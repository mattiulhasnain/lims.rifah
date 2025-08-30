// Data calculation utilities for LIMS system

import { 
  Patient, 
  Doctor, 
  Test, 
  Invoice, 
  Report, 
  StockItem, 
  Expense, 
  AuditLog, 
  Dashboard,
  Notification 
} from '../types';

export class DataCalculator {
  // Calculate dashboard metrics from real data
  static calculateDashboard(
    patients: Patient[],
    invoices: Invoice[],
    reports: Report[],
    stock: StockItem[],
    auditLogs: AuditLog[],
    expenses: Expense[]
  ): Dashboard {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate total patients
    const totalPatients = patients.length;

    // Calculate today's patients (patients created today)
    const todayPatients = patients.filter(patient => {
      const patientDate = new Date(patient.createdAt);
      return patientDate >= today;
    }).length;

    // Calculate total revenue from all invoices
    const totalRevenue = invoices.reduce((sum, invoice) => {
      return sum + invoice.finalAmount;
    }, 0);

    // Calculate today's revenue
    const todayRevenue = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      return invoiceDate >= today;
    }).reduce((sum, invoice) => {
      return sum + invoice.finalAmount;
    }, 0);

    // Calculate pending reports
    const pendingReports = reports.filter(report => 
      report.status === 'pending' || report.status === 'in_progress'
    ).length;

    // Calculate low stock items (items below reorder level)
    const lowStockItems = stock.filter(item => 
      item.currentStock <= item.reorderLevel
    ).length;

    // Get recent activities (last 10 audit logs)
    const recentActivities = auditLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalPatients,
      todayPatients,
      totalRevenue,
      todayRevenue,
      pendingReports,
      lowStockItems,
      recentActivities
    };
  }

  // Calculate patient statistics
  static calculatePatientStats(patients: Patient[], invoices: Invoice[]) {
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.visitCount > 0).length;
    const newPatientsThisMonth = patients.filter(p => {
      const patientDate = new Date(p.createdAt);
      const monthStart = new Date(patientDate.getFullYear(), patientDate.getMonth(), 1);
      return patientDate >= monthStart;
    }).length;

    const totalBilled = patients.reduce((sum, p) => sum + p.totalBilled, 0);
    const totalPending = patients.reduce((sum, p) => sum + p.pendingDues, 0);

    return {
      totalPatients,
      activePatients,
      newPatientsThisMonth,
      totalBilled,
      totalPending,
      averageBilled: totalPatients > 0 ? totalBilled / totalPatients : 0
    };
  }

  // Calculate financial statistics
  static calculateFinancialStats(invoices: Invoice[], expenses: Expense[]) {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyRevenue = invoices.filter(inv => {
      const invoiceDate = new Date(inv.createdAt);
      return invoiceDate >= monthStart;
    }).reduce((sum, inv) => sum + inv.finalAmount, 0);

    const monthlyExpenses = expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate >= monthStart;
    }).reduce((sum, exp) => sum + exp.amount, 0);

    const monthlyProfit = monthlyRevenue - monthlyExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    };
  }

  // Calculate test statistics
  static calculateTestStats(tests: Test[], reports: Report[]) {
    const totalTests = tests.length;
    const activeTests = tests.filter(t => t.isActive).length;
    
    const testUsage = tests.map(test => {
      const usageCount = reports.reduce((count, report) => {
        return count + report.tests.filter(rt => rt.testId === test.id).length;
      }, 0);
      
      return {
        testId: test.id,
        testName: test.name,
        usageCount,
        revenue: usageCount * test.price
      };
    }).sort((a, b) => b.usageCount - a.usageCount);

    const totalTestsPerformed = reports.reduce((sum, report) => {
      return sum + report.tests.length;
    }, 0);

    return {
      totalTests,
      activeTests,
      totalTestsPerformed,
      testUsage,
      averageTestsPerReport: reports.length > 0 ? totalTestsPerformed / reports.length : 0
    };
  }

  // Calculate doctor performance
  static calculateDoctorPerformance(doctors: Doctor[], invoices: Invoice[]) {
    return doctors.map(doctor => {
      const doctorInvoices = invoices.filter(inv => inv.doctorId === doctor.id);
      const totalReferrals = doctorInvoices.length;
      const totalRevenue = doctorInvoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
      const commission = totalRevenue * (doctor.commissionPercent / 100);

      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        totalReferrals,
        totalRevenue,
        commission,
        averageRevenuePerReferral: totalReferrals > 0 ? totalRevenue / totalReferrals : 0
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  // Calculate stock statistics
  static calculateStockStats(stock: StockItem[]) {
    const totalItems = stock.length;
    const lowStockItems = stock.filter(item => item.currentStock <= item.reorderLevel);
    const outOfStockItems = stock.filter(item => item.currentStock === 0);
    
    const totalStockValue = stock.reduce((sum, item) => {
      return sum + (item.currentStock * item.costPerUnit);
    }, 0);

    const reorderValue = lowStockItems.reduce((sum, item) => {
      const needed = item.reorderLevel - item.currentStock;
      return sum + (needed * item.costPerUnit);
    }, 0);

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalStockValue,
      reorderValue,
      lowStockItemsList: lowStockItems
    };
  }

  // Calculate monthly trends
  static calculateMonthlyTrends(invoices: Invoice[], patients: Patient[], reports: Report[]) {
    const months = [];
    const now = new Date();
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        startDate: month,
        endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0)
      });
    }

    return months.map(({ month, startDate, endDate }) => {
      const monthInvoices = invoices.filter(inv => {
        const invoiceDate = new Date(inv.createdAt);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });

      const monthPatients = patients.filter(patient => {
        const patientDate = new Date(patient.createdAt);
        return patientDate >= startDate && patientDate <= endDate;
      });

      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= startDate && reportDate <= endDate;
      });

      return {
        month,
        revenue: monthInvoices.reduce((sum, inv) => sum + inv.finalAmount, 0),
        patients: monthPatients.length,
        reports: monthReports.length,
        tests: monthReports.reduce((sum, report) => sum + report.tests.length, 0)
      };
    });
  }

  // Calculate notification statistics
  static calculateNotificationStats(notifications: Notification[]) {
    const totalNotifications = notifications.length;
    const unreadNotifications = notifications.filter(n => !n.isRead).length;
    
    const notificationsByType = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const notificationsByCategory = notifications.reduce((acc, notification) => {
      acc[notification.category] = (acc[notification.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      notificationsByCategory
    };
  }

  // Generate insights and recommendations
  static generateInsights(
    patients: Patient[],
    invoices: Invoice[],
    reports: Report[],
    stock: StockItem[],
    expenses: Expense[]
  ) {
    const insights = [];

    // Financial insights
    const financialStats = this.calculateFinancialStats(invoices, expenses);
    if (financialStats.profitMargin < 20) {
      insights.push({
        type: 'warning',
        category: 'financial',
        title: 'Low Profit Margin',
        message: `Current profit margin is ${financialStats.profitMargin.toFixed(1)}%. Consider reviewing pricing or reducing costs.`
      });
    }

    // Stock insights
    const stockStats = this.calculateStockStats(stock);
    if (stockStats.lowStockItems > 0) {
      insights.push({
        type: 'warning',
        category: 'stock',
        title: 'Low Stock Items',
        message: `${stockStats.lowStockItems} items are running low on stock. Total reorder value: PKR ${stockStats.reorderValue.toLocaleString()}`
      });
    }

    // Patient insights
    const patientStats = this.calculatePatientStats(patients, invoices);
    if (patientStats.totalPending > 0) {
      insights.push({
        type: 'info',
        category: 'patients',
        title: 'Pending Payments',
        message: `Total pending payments: PKR ${patientStats.totalPending.toLocaleString()} from ${patientStats.activePatients} patients`
      });
    }

    // Report insights
    const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'in_progress');
    if (pendingReports.length > 10) {
      insights.push({
        type: 'warning',
        category: 'reports',
        title: 'High Pending Reports',
        message: `${pendingReports.length} reports are pending completion. Consider increasing staff or optimizing workflow.`
      });
    }

    return insights;
  }
} 