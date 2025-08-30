const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all tests
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tests ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get test by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM tests WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching test:', err);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Create new test
router.post('/', async (req, res) => {
  try {
    const {
      name, category, price, sample_type,
      turnaround_time, description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tests (
        name, category, price, sample_type,
        turnaround_time, description
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [name, category, price, sample_type, turnaround_time, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating test:', err);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Update test
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, category, price, sample_type,
      turnaround_time, description
    } = req.body;

    const result = await pool.query(
      `UPDATE tests SET 
        name = $1, category = $2, price = $3, sample_type = $4,
        turnaround_time = $5, description = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *`,
      [name, category, price, sample_type, turnaround_time, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// Delete test
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM tests WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

module.exports = router; 