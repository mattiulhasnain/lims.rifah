const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, i.invoice_number, t.name as test_name, u.username as verified_by_name
      FROM reports r
      LEFT JOIN invoices i ON r.invoice_id = i.id
      LEFT JOIN tests t ON r.test_id = t.id
      LEFT JOIN users u ON r.verified_by = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, i.invoice_number, t.name as test_name, u.username as verified_by_name
      FROM reports r
      LEFT JOIN invoices i ON r.invoice_id = i.id
      LEFT JOIN tests t ON r.test_id = t.id
      LEFT JOIN users u ON r.verified_by = u.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create new report
router.post('/', async (req, res) => {
  try {
    const {
      report_number, invoice_id, test_id, result,
      normal_range, unit, status
    } = req.body;

    const reportResult = await pool.query(
      `INSERT INTO reports (
        report_number, invoice_id, test_id, result,
        normal_range, unit, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [report_number, invoice_id, test_id, result,
       normal_range, unit, status || 'pending']
    );

    res.status(201).json(reportResult.rows[0]);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Update report
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      result, normal_range, unit, status
    } = req.body;

    const updateResult = await pool.query(
      `UPDATE reports SET 
        result = $1, normal_range = $2, unit = $3,
        status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 RETURNING *`,
      [result, normal_range, unit, status, id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Verify report
router.put('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified_by } = req.body;

    const result = await pool.query(
      `UPDATE reports SET 
        status = 'verified', verified_by = $1, verified_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *`,
      [verified_by, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error verifying report:', err);
    res.status(500).json({ error: 'Failed to verify report' });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router; 