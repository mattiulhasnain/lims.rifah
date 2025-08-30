const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Read and execute schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database schema created successfully');
    
    // Check if data exists, if not seed with sample data
    const checkData = await pool.query('SELECT COUNT(*) FROM patients');
    if (parseInt(checkData.rows[0].count) === 0) {
      const seedPath = path.join(__dirname, '../database/seed.sql');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('Sample data seeded successfully');
    }
    
    return true;
  } catch (err) {
    console.error('Database initialization failed:', err);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down database connections...');
  await pool.end();
  process.exit(0);
});

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 