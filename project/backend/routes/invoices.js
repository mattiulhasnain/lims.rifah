const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, p.name as patient_name, d.name as doctor_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      LEFT JOIN doctors d ON i.doctor_id = d.id
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT i.*, p.name as patient_name, d.name as doctor_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      LEFT JOIN doctors d ON i.doctor_id = d.id
      WHERE i.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get invoice tests
    const testsResult = await pool.query(`
      SELECT it.*, t.name as test_name, t.category
      FROM invoice_tests it
      JOIN tests t ON it.test_id = t.id
      WHERE it.invoice_id = $1
    `, [id]);
    
    const invoice = result.rows[0];
    invoice.tests = testsResult.rows;
    
    res.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const {
      invoice_number, patient_id, doctor_id, total_amount,
      discount_amount, tax_amount, final_amount, tests
    } = req.body;

    // Create invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        invoice_number, patient_id, doctor_id, total_amount,
        discount_amount, tax_amount, final_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [invoice_number, patient_id, doctor_id, total_amount,
       discount_amount || 0, tax_amount || 0, final_amount]
    );

    const invoice = invoiceResult.rows[0];

    // Add invoice tests
    if (tests && tests.length > 0) {
      for (const test of tests) {
        await client.query(
          'INSERT INTO invoice_tests (invoice_id, test_id, price) VALUES ($1, $2, $3)',
          [invoice.id, test.test_id, test.price]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(invoice);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  } finally {
    client.release();
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      patient_id, doctor_id, total_amount,
      discount_amount, tax_amount, final_amount, tests
    } = req.body;

    // Update invoice
    const result = await client.query(
      `UPDATE invoices SET 
        patient_id = $1, doctor_id = $2, total_amount = $3,
        discount_amount = $4, tax_amount = $5, final_amount = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *`,
      [patient_id, doctor_id, total_amount, discount_amount || 0,
       tax_amount || 0, final_amount, id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Update invoice tests if provided
    if (tests) {
      // Remove existing tests
      await client.query('DELETE FROM invoice_tests WHERE invoice_id = $1', [id]);
      
      // Add new tests
      if (tests.length > 0) {
        for (const test of tests) {
          await client.query(
            'INSERT INTO invoice_tests (invoice_id, test_id, price) VALUES ($1, $2, $3)',
            [id, test.test_id, test.price]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating invoice:', err);
    res.status(500).json({ error: 'Failed to update invoice' });
  } finally {
    client.release();
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Delete invoice tests first
    await client.query('DELETE FROM invoice_tests WHERE invoice_id = $1', [id]);
    
    // Delete invoice
    const result = await client.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: 'Failed to delete invoice' });
  } finally {
    client.release();
  }
});

module.exports = router; 