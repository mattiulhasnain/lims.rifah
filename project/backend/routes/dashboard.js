const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const patientsCount = await pool.query('SELECT COUNT(*) FROM patients');
    const doctorsCount = await pool.query('SELECT COUNT(*) FROM doctors');
    const testsCount = await pool.query('SELECT COUNT(*) FROM tests');
    const invoicesCount = await pool.query('SELECT COUNT(*) FROM invoices');
    const reportsCount = await pool.query('SELECT COUNT(*) FROM reports');
    const stockItemsCount = await pool.query('SELECT COUNT(*) FROM stock');

    // Get today's counts
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = await pool.query(
      'SELECT COUNT(*) FROM patients WHERE DATE(created_at) = $1',
      [today]
    );
    const todayInvoices = await pool.query(
      'SELECT COUNT(*) FROM invoices WHERE DATE(created_at) = $1',
      [today]
    );
    const todayReports = await pool.query(
      'SELECT COUNT(*) FROM reports WHERE DATE(created_at) = $1',
      [today]
    );

    // Get pending reports
    const pendingReports = await pool.query(
      'SELECT COUNT(*) FROM reports WHERE status = $1',
      ['pending']
    );

    // Get low stock items
    const lowStockItems = await pool.query(`
      SELECT COUNT(*) FROM stock 
      WHERE quantity <= reorder_level AND is_active = true
    `);

    // Get revenue for current month
    const currentMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
    const monthlyRevenue = await pool.query(`
      SELECT COALESCE(SUM(final_amount), 0) as total_revenue
      FROM invoices 
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', $1::date)
    `, [currentMonth + '-01']);

    const stats = {
      totals: {
        patients: parseInt(patientsCount.rows[0].count),
        doctors: parseInt(doctorsCount.rows[0].count),
        tests: parseInt(testsCount.rows[0].count),
        invoices: parseInt(invoicesCount.rows[0].count),
        reports: parseInt(reportsCount.rows[0].count),
        stockItems: parseInt(stockItemsCount.rows[0].count)
      },
      today: {
        patients: parseInt(todayPatients.rows[0].count),
        invoices: parseInt(todayInvoices.rows[0].count),
        reports: parseInt(todayReports.rows[0].count)
      },
      pending: {
        reports: parseInt(pendingReports.rows[0].count),
        lowStock: parseInt(lowStockItems.rows[0].count)
      },
      revenue: {
        monthly: parseFloat(monthlyRevenue.rows[0].total_revenue)
      }
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent activities
router.get('/recent-activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent patients
    const recentPatients = await pool.query(
      'SELECT id, name, created_at FROM patients ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    // Get recent invoices
    const recentInvoices = await pool.query(`
      SELECT i.id, i.invoice_number, i.final_amount, p.name as patient_name, i.created_at
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      ORDER BY i.created_at DESC LIMIT $1
    `, [limit]);

    // Get recent reports
    const recentReports = await pool.query(`
      SELECT r.id, r.report_number, r.status, t.name as test_name, r.created_at
      FROM reports r
      LEFT JOIN tests t ON r.test_id = t.id
      ORDER BY r.created_at DESC LIMIT $1
    `, [limit]);

    const activities = {
      patients: recentPatients.rows,
      invoices: recentInvoices.rows,
      reports: recentReports.rows
    };

    res.json(activities);
  } catch (err) {
    console.error('Error fetching recent activities:', err);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

// Get chart data
router.get('/chart-data', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    // Get daily patient registrations
    const dailyPatients = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM patients
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    // Get daily revenue
    const dailyRevenue = await pool.query(`
      SELECT DATE(created_at) as date, COALESCE(SUM(final_amount), 0) as revenue
      FROM invoices
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    // Get test category distribution
    const testCategories = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM tests
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `);

    const chartData = {
      dailyPatients: dailyPatients.rows,
      dailyRevenue: dailyRevenue.rows,
      testCategories: testCategories.rows
    };

    res.json(chartData);
  } catch (err) {
    console.error('Error fetching chart data:', err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

module.exports = router; 