const { pool } = require('./database');

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      reportGenerationTime: [],
      databaseQueryTime: [],
      dailyReportCount: 0,
      peakHourlyLoad: 0
    };
  }

  // Track report generation performance
  async trackReportGeneration(reportId, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    this.metrics.reportGenerationTime.push({
      reportId,
      duration,
      timestamp: new Date()
    });

    // Keep only last 1000 records
    if (this.metrics.reportGenerationTime.length > 1000) {
      this.metrics.reportGenerationTime.shift();
    }

    return duration;
  }

  // Track database query performance
  async trackQueryPerformance(query, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    this.metrics.databaseQueryTime.push({
      query: query.substring(0, 100), // Truncate long queries
      duration,
      timestamp: new Date()
    });

    // Keep only last 1000 records
    if (this.metrics.databaseQueryTime.length > 1000) {
      this.metrics.databaseQueryTime.shift();
    }

    return duration;
  }

  // Get daily report statistics
  async getDailyReportStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const result = await pool.query(
        'SELECT COUNT(*) as count, COUNT(CASE WHEN status = $1 THEN 1 END) as completed FROM reports WHERE created_at >= $2',
        ['completed', today]
      );

      this.metrics.dailyReportCount = parseInt(result.rows[0].count);
      
      return {
        totalReports: result.rows[0].count,
        completedReports: result.rows[0].completed,
        pendingReports: result.rows[0].count - result.rows[0].completed
      };
    } catch (err) {
      console.error('Error getting daily report stats:', err);
      return { totalReports: 0, completedReports: 0, pendingReports: 0 };
    }
  }

  // Get performance metrics
  getPerformanceMetrics() {
    const avgReportTime = this.metrics.reportGenerationTime.length > 0 
      ? this.metrics.reportGenerationTime.reduce((sum, item) => sum + item.duration, 0) / this.metrics.reportGenerationTime.length
      : 0;

    const avgQueryTime = this.metrics.databaseQueryTime.length > 0
      ? this.metrics.databaseQueryTime.reduce((sum, item) => sum + item.duration, 0) / this.metrics.databaseQueryTime.length
      : 0;

    return {
      averageReportGenerationTime: Math.round(avgReportTime),
      averageQueryTime: Math.round(avgQueryTime),
      totalReportsTracked: this.metrics.reportGenerationTime.length,
      totalQueriesTracked: this.metrics.databaseQueryTime.length,
      dailyReportCount: this.metrics.dailyReportCount
    };
  }

  // Check if system can handle current load
  async checkSystemCapacity() {
    try {
      // Check current database connections
      const connections = await pool.query('SELECT count(*) FROM pg_stat_activity');
      const activeConnections = parseInt(connections.rows[0].count);

      // Check database size
      const dbSize = await pool.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size,
               pg_database_size(current_database()) as size_bytes
      `);

      // Check table sizes
      const tableSizes = await pool.query(`
        SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `);

      return {
        activeConnections,
        maxConnections: 100, // Default PostgreSQL max
        databaseSize: dbSize.rows[0].size,
        databaseSizeBytes: dbSize.rows[0].size_bytes,
        tableSizes: tableSizes.rows,
        canHandleLoad: activeConnections < 80 // Leave 20% buffer
      };
    } catch (err) {
      console.error('Error checking system capacity:', err);
      return { canHandleLoad: false, error: err.message };
    }
  }

  // Generate performance report
  async generatePerformanceReport() {
    const dailyStats = await this.getDailyReportStats();
    const performanceMetrics = this.getPerformanceMetrics();
    const systemCapacity = await this.checkSystemCapacity();

    return {
      timestamp: new Date(),
      dailyStats,
      performanceMetrics,
      systemCapacity,
      recommendations: this.generateRecommendations(dailyStats, performanceMetrics, systemCapacity)
    };
  }

  // Generate recommendations based on performance
  generateRecommendations(dailyStats, performanceMetrics, systemCapacity) {
    const recommendations = [];

    if (dailyStats.totalReports > 200) {
      recommendations.push('High daily report volume detected. Consider upgrading database plan for better performance.');
    }

    if (performanceMetrics.averageReportGenerationTime > 5000) {
      recommendations.push('Report generation is slow. Check database indexes and optimize queries.');
    }

    if (performanceMetrics.averageQueryTime > 1000) {
      recommendations.push('Database queries are slow. Consider adding more indexes or optimizing table structure.');
    }

    if (!systemCapacity.canHandleLoad) {
      recommendations.push('High database connection usage. Consider scaling up database resources.');
    }

    if (recommendations.length === 0) {
      recommendations.push('System performance is optimal. No immediate action required.');
    }

    return recommendations;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor; 