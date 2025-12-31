/**
 * Email Service - Resend Integration
 * 
 * Professional email sending via Resend API
 * Supports sending from custom domain (hanna.care)
 */

const { Resend } = require('resend');

class EmailService {
    constructor() {
        this.resend = null;
        this.initialized = false;
        this.defaultFrom = process.env.EMAIL_FROM || 'Hanna AI <falcon@hanna.care>';
    }

    init() {
        if (this.initialized) return;

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.log('[Email] ⚠️ RESEND_API_KEY not configured - emails will be logged only');
            return;
        }

        this.resend = new Resend(apiKey);
        this.initialized = true;
        console.log('[Email] ✅ Resend configured');
    }

    async send({ to, subject, body, from }) {
        this.init();

        const fromAddress = from || this.defaultFrom;

        // If no API key, log only
        if (!this.resend) {
            console.log('[Email] 📧 Would send (Resend not configured):');
            console.log(`  From: ${fromAddress}`);
            console.log(`  To: ${to}`);
            console.log(`  Subject: ${subject}`);
            console.log(`  Body: ${body.substring(0, 100)}...`);
            return { success: false, reason: 'Resend not configured' };
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: fromAddress,
                to: [to],
                subject,
                text: body,
                html: body.replace(/\n/g, '<br>'),
            });

            if (error) {
                console.error('[Email] ❌ Failed:', error.message);
                return { success: false, error: error.message };
            }

            console.log('[Email] ✅ Sent:', data.id);
            return { success: true, messageId: data.id };
        } catch (error) {
            console.error('[Email] ❌ Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async verify() {
        this.init();

        if (!this.resend) {
            return { configured: false };
        }

        // Resend doesn't have a verify method, but we can check by listing domains
        try {
            const { data } = await this.resend.domains.list();
            return {
                configured: true,
                verified: true,
                domains: data?.map(d => d.name) || []
            };
        } catch (error) {
            return { configured: true, verified: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
