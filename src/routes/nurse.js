const express = require('express');
const router = express.Router();
const db = require('../services/db');

// AUTH MIDDLEWARE
const checkNurseAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Missing Authorization Header' });
    }
    const expected = `Bearer ${process.env.NURSE_DASHBOARD_TOKEN}`;
    if (token !== expected) {
        return res.status(403).json({ error: 'Invalid Token' });
    }
    next();
};

// Protect all routes
router.use(checkNurseAuth);

// GET /api/nurse/tasks
// Fetch pending tasks directly from DB (Securely)
router.get('/tasks', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                nt.*, 
                cp.name as patient_name, 
                cp.age, 
                cp.condition 
            FROM nurse_tasks nt
            JOIN chronic_patients cp ON nt.patient_id = cp.id
            WHERE nt.status = 'pending'
            ORDER BY 
                CASE 
                    WHEN priority = 'critical' THEN 1 
                    WHEN priority = 'high' THEN 2 
                    WHEN priority = 'normal' THEN 3 
                    ELSE 4 
                END,
                created_at ASC
        `);

        // Map to ensure cleaner frontend consumption
        const tasks = result.rows.map(row => ({
            ...row,
            chronic_patients: { // Maintain structure for frontend compat
                name: row.patient_name,
                age: row.age,
                condition: row.condition
            }
        }));

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Database Error' });
    }
});

// POST /api/nurse/tasks/:id/resolve
router.post('/tasks/:id/resolve', async (req, res) => {
    const taskId = req.params.id;
    const { nurseId, actionType, notes } = req.body;

    try {
        // 1. Mark Task as Completed
        const taskRes = await db.query(
            `UPDATE nurse_tasks SET status = 'completed', completed_at = NOW() WHERE id = $1 RETURNING *`,
            [taskId]
        );

        if (taskRes.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const task = taskRes.rows[0];

        // 2. Log Action with Structured Data (Outcome/NextAction)
        const { outcome, nextAction } = req.body;
        const structuredNotes = JSON.stringify({
            note: notes,
            outcome: outcome || 'unknown',
            nextAction: nextAction || 'none'
        });

        await db.query(
            `INSERT INTO nurse_logs (task_id, patient_id, nurse_id, action_type, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [taskId, task.patient_id, nurseId || 'system', actionType || 'resolve', structuredNotes]
        );

        console.log(`✅ [Nurse API] Task ${taskId} resolved by ${nurseId}`);
        res.json({ success: true });

    } catch (error) {
        console.error('Error resolving task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
