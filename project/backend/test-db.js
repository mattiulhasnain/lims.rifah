const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log('Current time:', result.rows[0].now);
    
    // Test tables existence
    const tables = ['users', 'patients', 'doctors', 'tests', 'invoices', 'reports', 'stock'];
    
    for (const table of tables) {
      try {
        const tableResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ Table '${table}' exists with ${tableResult.rows[0].count} records`);
      } catch (err) {
        console.log(`❌ Table '${table}' not found or error:`, err.message);
      }
    }
    
    // Test sample query
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Total users: ${userCount.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify DATABASE_URL in .env file');
    console.log('3. Ensure database exists');
    console.log('4. Check user permissions');
  } finally {
    await pool.end();
  }
}

testConnection(); 