const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all stock items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stock ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// Get stock item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM stock WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching stock item:', err);
    res.status(500).json({ error: 'Failed to fetch stock item' });
  }
});

// Create new stock item
router.post('/', async (req, res) => {
  try {
    const {
      item_name, category, quantity, unit, unit_price,
      supplier, reorder_level
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stock (
        item_name, category, quantity, unit, unit_price,
        supplier, reorder_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [item_name, category, quantity || 0, unit, unit_price,
       supplier, reorder_level || 10]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating stock item:', err);
    res.status(500).json({ error: 'Failed to create stock item' });
  }
});

// Update stock item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      item_name, category, quantity, unit, unit_price,
      supplier, reorder_level
    } = req.body;

    const result = await pool.query(
      `UPDATE stock SET 
        item_name = $1, category = $2, quantity = $3, unit = $4,
        unit_price = $5, supplier = $6, reorder_level = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [item_name, category, quantity, unit, unit_price,
       supplier, reorder_level, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating stock item:', err);
    res.status(500).json({ error: 'Failed to update stock item' });
  }
});

// Update stock quantity
router.put('/:id/quantity', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add', 'subtract', 'set'

    let newQuantity;
    if (operation === 'add') {
      newQuantity = `quantity + ${quantity}`;
    } else if (operation === 'subtract') {
      newQuantity = `GREATEST(quantity - ${quantity}, 0)`;
    } else {
      newQuantity = quantity;
    }

    const result = await pool.query(
      `UPDATE stock SET 
        quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating stock quantity:', err);
    res.status(500).json({ error: 'Failed to update stock quantity' });
  }
});

// Delete stock item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM stock WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    res.json({ message: 'Stock item deleted successfully' });
  } catch (err) {
    console.error('Error deleting stock item:', err);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM stock 
      WHERE quantity <= reorder_level AND is_active = true
      ORDER BY quantity ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching low stock items:', err);
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

module.exports = router; 