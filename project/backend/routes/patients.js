const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  try {
    const {
      patient_id, name, age, gender, contact, email, address,
      cnic, blood_group, allergies, medical_history, referred_by,
      sample_type, collection_center_id, created_by
    } = req.body;

    const result = await pool.query(
      `INSERT INTO patients (
        patient_id, name, age, gender, contact, email, address,
        cnic, blood_group, allergies, medical_history, referred_by,
        sample_type, collection_center_id, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [patient_id, name, age, gender, contact, email, address,
       cnic, blood_group, allergies, medical_history, referred_by,
       sample_type, collection_center_id, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, age, gender, contact, email, address,
      cnic, blood_group, allergies, medical_history, referred_by,
      sample_type, collection_center_id
    } = req.body;

    const result = await pool.query(
      `UPDATE patients SET 
        name = $1, age = $2, gender = $3, contact = $4, email = $5,
        address = $6, cnic = $7, blood_group = $8, allergies = $9,
        medical_history = $10, referred_by = $11, sample_type = $12,
        collection_center_id = $13, updated_at = CURRENT_TIMESTAMP
      WHERE id = $14 RETURNING *`,
      [name, age, gender, contact, email, address, cnic, blood_group,
       allergies, medical_history, referred_by, sample_type, collection_center_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM patients WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router; 