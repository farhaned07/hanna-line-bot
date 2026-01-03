/**
 * Patient Summary PDF Service
 * Orchestrates PDF generation using Puppeteer, EJS templates, and Chart.js
 */

const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');
const { aggregatePatientData } = require('./dataAggregator');
const { generateCharts } = require('./chartGenerator');

/**
 * Generate a unique audit ID
 * @returns {string} Audit ID in format RPT-XXXXXXXX
 */
const generateAuditId = () => {
    return `RPT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

/**
 * Generate default AI summary based on data
 * @param {Object} data - Aggregated patient data
 * @param {string} language - 'th' or 'en'
 * @returns {string} Summary text
 */
const generateAISummary = (data, language) => {
    const { engagement, adherence, vitals, symptoms } = data;

    if (language === 'th') {
        let summary = '';

        if (engagement.percentage >= 80) {
            summary += 'ผู้ป่วยมีส่วนร่วมดีเยี่ยมในการเช็คอินสุขภาพประจำวัน ';
        } else if (engagement.percentage >= 50) {
            summary += 'ผู้ป่วยมีส่วนร่วมปานกลางในการเช็คอินสุขภาพ ';
        } else {
            summary += 'ผู้ป่วยมีส่วนร่วมในการเช็คอินค่อนข้างน้อย ควรติดตามเพิ่มเติม ';
        }

        if (adherence.percentage !== null) {
            if (adherence.percentage >= 80) {
                summary += 'การรับประทานยาสม่ำเสมอ ';
            } else if (adherence.percentage >= 60) {
                summary += 'การรับประทานยาต้องการการติดตามเพิ่มเติม ';
            } else {
                summary += 'การรับประทานยาต้องการความใส่ใจเป็นพิเศษ ';
            }
        }

        if (vitals.trend === 'improving') {
            summary += 'แนวโน้มค่าสุขภาพดีขึ้น ';
        } else if (vitals.trend === 'worsening') {
            summary += 'แนวโน้มค่าสุขภาพต้องเฝ้าระวัง ';
        } else {
            summary += 'แนวโน้มค่าสุขภาพคงที่ ';
        }

        if (symptoms.total === 0) {
            summary += 'ไม่พบอาการผิดปกติที่รายงานในช่วงเวลานี้';
        } else {
            summary += `มีอาการที่รายงาน ${symptoms.total} ครั้ง`;
        }

        return summary;
    } else {
        let summary = '';

        if (engagement.percentage >= 80) {
            summary += 'Patient demonstrates excellent engagement with daily health check-ins. ';
        } else if (engagement.percentage >= 50) {
            summary += 'Patient shows moderate engagement with health monitoring. ';
        } else {
            summary += 'Patient engagement is below expected levels and requires follow-up. ';
        }

        if (adherence.percentage !== null) {
            if (adherence.percentage >= 80) {
                summary += 'Medication adherence is consistent. ';
            } else if (adherence.percentage >= 60) {
                summary += 'Medication adherence shows room for improvement. ';
            } else {
                summary += 'Medication adherence requires attention. ';
            }
        }

        summary += `Vitals trend is ${vitals.trend}. `;

        if (symptoms.total === 0) {
            summary += 'No concerning symptoms reported during this period.';
        } else {
            summary += `${symptoms.total} symptom occurrence(s) were reported and documented.`;
        }

        return summary;
    }
};

/**
 * Generate patient health summary PDF
 * @param {Object} options - Generation options
 * @param {string} options.patientId - Patient UUID
 * @param {number} options.timeRangeDays - Time range (7, 15, or 30)
 * @param {string} options.language - Language ('th' or 'en')
 * @param {string} options.generatedBy - Staff identifier
 * @returns {Promise<Object>} Result with auditId and PDF buffer
 */
const generatePatientSummary = async ({
    patientId,
    tenantId, // New: Tenant Context
    timeRangeDays,
    language,
    generatedBy
}) => {
    const startTime = Date.now();
    const auditId = generateAuditId();

    console.log(`[PDF] Starting generation for patient ${patientId}, tenant: ${tenantId || 'Legacy'}, range: ${timeRangeDays} days`);

    try {
        // 1. Aggregate patient data (Tenant-Aware)
        console.log('[PDF] Aggregating patient data...');
        const data = await aggregatePatientData(patientId, timeRangeDays, tenantId);

        // 2. Fetch Tenant Branding (if applicable)
        let tenant = {
            name: 'Hanna AI Nurse',
            logo_url: null, // Default or generic logo
            code: 'SYSTEM'
        };

        if (tenantId) {
            try {
                const tenantRes = await db.query(
                    'SELECT name, logo_url, code FROM tenants WHERE id = $1',
                    [tenantId]
                );
                if (tenantRes.rows[0]) {
                    tenant = tenantRes.rows[0];
                }
            } catch (err) {
                console.warn('[PDF] Failed to fetch tenant branding, using default:', err.message);
            }
        }

        // 3. Generate charts
        console.log('[PDF] Generating charts...');
        const charts = await generateCharts(data, timeRangeDays);

        // 4. Generate AI summary
        const aiSummary = generateAISummary(data, language);

        // 5. Select template
        const templateFile = language === 'th' ? 'summary_th.ejs' : 'summary_en.ejs';
        const templatePath = path.join(__dirname, '../templates', templateFile);

        // 6. Render HTML
        console.log('[PDF] Rendering HTML template...');
        const html = await ejs.renderFile(templatePath, {
            patient: data.patient,
            timeRange: data.timeRange,
            engagement: data.engagement,
            adherence: data.adherence,
            vitals: data.vitals,
            symptoms: data.symptoms,
            escalations: data.escalations,
            nurseActions: data.nurseActions,
            charts,
            aiSummary,
            auditId,
            tenant, // Pass tenant branding
            generatedAt: new Date().toISOString()
        });

        // 6. Launch Puppeteer and generate PDF
        console.log('[PDF] Launching Puppeteer...');
        const launchOptions = {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=none'
            ]
        };

        // Use system Chromium if PUPPETEER_EXECUTABLE_PATH is set (Railway/Docker)
        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            console.log(`[PDF] Using system Chromium: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
        }

        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();

        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 1600 });

        // Set content and wait for fonts/images to load
        await page.setContent(html, {
            waitUntil: ['networkidle0', 'domcontentloaded']
        });

        // Give extra time for Google Fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate PDF buffer
        console.log('[PDF] Generating PDF buffer...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '10mm',
                right: '10mm'
            },
            preferCSSPageSize: true
        });

        await browser.close();

        // 7. Calculate checksum
        const checksum = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

        // 8. Store in database audit log
        const generationTimeMs = Date.now() - startTime;
        console.log(`[PDF] Generation complete in ${generationTimeMs}ms`);

        // Save to audit log (skip in mock mode)
        if (process.env.USE_MOCK_DATA !== 'true') {
            await db.query(`
                INSERT INTO pdf_audit_log (
                    patient_id, audit_id, generated_by, 
                    time_range_days, language, file_path,
                    file_size_bytes, checksum, generation_time_ms
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
                patientId,
                auditId,
                generatedBy,
                timeRangeDays,
                language,
                `summaries/${patientId}/${auditId}.pdf`, // Logical path
                pdfBuffer.length,
                checksum,
                generationTimeMs
            ]);
        } else {
            console.log('[PDF] Skipping audit log in mock mode');
        }

        return {
            success: true,
            auditId,
            pdfBuffer,
            checksum,
            generationTimeMs,
            patient: data.patient
        };

    } catch (error) {
        console.error('[PDF] Generation failed:', error);
        throw error;
    }
};

/**
 * Retrieve PDF generation history for a patient
 * @param {string} patientId - Patient UUID
 * @param {number} limit - Max records to return
 * @returns {Promise<Array>} List of PDF audit records
 */
const getPDFHistory = async (patientId, limit = 20) => {
    const result = await db.query(`
        SELECT 
            audit_id, time_range_days, language,
            file_size_bytes, generation_time_ms,
            accessed_count, created_at
        FROM pdf_audit_log
        WHERE patient_id = $1
        ORDER BY created_at DESC
        LIMIT $2
    `, [patientId, limit]);

    return result.rows;
};

/**
 * Verify PDF integrity by audit ID
 * @param {string} auditId - Audit ID to verify
 * @returns {Promise<Object>} Verification result
 */
const verifyPDF = async (auditId) => {
    const result = await db.query(`
        SELECT checksum, created_at, patient_id
        FROM pdf_audit_log
        WHERE audit_id = $1
    `, [auditId]);

    if (!result.rows[0]) {
        return { valid: false, error: 'Audit ID not found' };
    }

    return {
        valid: true,
        checksum: result.rows[0].checksum,
        createdAt: result.rows[0].created_at,
        patientId: result.rows[0].patient_id
    };
};

module.exports = {
    generatePatientSummary,
    getPDFHistory,
    verifyPDF,
    generateAuditId
};
