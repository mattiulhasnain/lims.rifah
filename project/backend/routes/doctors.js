const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM doctors ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM doctors WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

// Create new doctor
router.post('/', async (req, res) => {
  try {
    const {
      name, specialty, contact, email, hospital,
      commission_percent, cnic, address
    } = req.body;

    const result = await pool.query(
      `INSERT INTO doctors (
        name, specialty, contact, email, hospital,
        commission_percent, cnic, address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, specialty, contact, email, hospital, commission_percent, cnic, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, specialty, contact, email, hospital,
      commission_percent, cnic, address
    } = req.body;

    const result = await pool.query(
      `UPDATE doctors SET 
        name = $1, specialty = $2, contact = $3, email = $4,
        hospital = $5, commission_percent = $6, cnic = $7,
        address = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *`,
      [name, specialty, contact, email, hospital, commission_percent, cnic, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM doctors WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

module.exports = router; 