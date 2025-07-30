import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, UserCheck, TestTube, FileText, 
  Receipt, Package, DollarSign, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle, Calendar, Book,
  ArrowRight, HelpCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { dashboard, refreshDashboard, patients, doctors, tests, invoices, reports, stock } = useData();
  const { user } = useAuth();
  
  // Workflow guidance state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [showWorkflowHelp, setShowWorkflowHelp] = useState(false);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard, patients, doctors, tests, invoices, reports, stock]);

  // Workflow guidance functions
  const showWorkflowSuccess = (message: string, steps: string[]) => {
    setSuccessMessage(message);
    setNextSteps(steps);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 8000);
  };

  const handleQuickAction = (action: string, callback: () => void) => {
    callback();
    
    // Show appropriate success message and next steps based on action
    switch (action) {
      case 'add-patient':
        showWorkflowSuccess(
          'Patient added successfully!',
          ['Create an invoice for the patient', 'Schedule an appointment', 'Assign tests']
        );
        break;
      case 'create-invoice':
        showWorkflowSuccess(
          'Invoice created successfully!',
          ['Collect payment from patient', 'Schedule sample collection', 'Assign to technician']
        );
        break;
      case 'enter-results':
        showWorkflowSuccess(
          'Results entered successfully!',
          ['Review for critical values', 'Send for verification', 'Generate report']
        );
        break;
      case 'verify-report':
        showWorkflowSuccess(
          'Report verified successfully!',
          ['Print report for patient', 'Send to doctor', 'Archive report']
        );
        break;
      default:
        showWorkflowSuccess(
          'Action completed successfully!',
          ['Continue with next task', 'Check notifications for updates']
        );
    }
  };

  const stats = [
    {
      title: 'Total Patients',
      value: dashboard.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      trend: `+${dashboard.todayPatients} today`
    },
    {
      title: 'Total Revenue',
      value: `PKR ${dashboard.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: `+PKR ${dashboard.todayRevenue.toLocaleString()} today`
    },
    {
      title: 'Pending Reports',
      value: dashboard.pendingReports,
      icon: FileText,
      color: 'bg-yellow-500',
      trend: 'Need attention'
    },
    {
      title: 'Low Stock Items',
      value: dashboard.lowStockItems,
      icon: Package,
      color: 'bg-red-500',
      trend: 'Reorder required'
    }
  ];

  const quickStats = [
    { title: 'Active Doctors', value: doctors.filter(d => d.isActive).length, icon: UserCheck },
    { title: 'Available Tests', value: tests.filter(t => t.isActive).length, icon: TestTube },
    { title: 'Today\'s Invoices', value: invoices.filter(i => 
      new Date(i.createdAt).toDateString() === new Date().toDateString()
    ).length, icon: Receipt },
    { title: 'Completed Reports', value: reports.filter(r => r.status === 'completed').length, icon: CheckCircle }
  ];

  const recentActivities = [
    { action: 'New patient registered', time: '2 minutes ago', type: 'success' },
    { action: 'Report completed for John Doe', time: '15 minutes ago', type: 'info' },
    { action: 'Invoice #INV001 created', time: '1 hour ago', type: 'success' },
    { action: 'Low stock alert: CBC Reagent Kit', time: '2 hours ago', type: 'warning' },
    { action: 'Dr. Ahmad Ali added new test', time: '3 hours ago', type: 'info' }
  ];

  // Role-based widgets and quick actions
  let roleStats = stats;
  let roleQuickStats = quickStats;
  let roleQuickActions: { label: string; onClick: () => void; icon: React.ReactNode }[] = [];

  // Cyberpunk neon color palette for dev dashboard
  const neonColors = [
    'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
    'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600',
    'bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500',
    'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500'
  ];

  // Real-time analytics state for dev dashboard
  const [devStats, setDevStats] = useState({
    uptime: 99.99,
    errorRate: 0.02,
    buildStatus: 'Passing',
    featureFlags: 7,
    apiRequests: 1234567,
    activeUsers: 42
  });

  useEffect(() => {
    if (user?.role === 'dev') {
      const interval = setInterval(() => {
        setDevStats(prev => ({
          uptime: Math.max(99.90, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.02)),
          errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
          buildStatus: Math.random() > 0.98 ? 'Failing' : 'Passing',
          featureFlags: prev.featureFlags,
          apiRequests: prev.apiRequests + Math.floor(Math.random() * 1000),
          activeUsers: Math.max(30, Math.min(60, prev.activeUsers + Math.floor(Math.random() * 5 - 2)))
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [user?.role]);

  switch (user?.role) {
    case 'admin':
      // Admin sees all stats and quick actions
      roleStats = stats;
      roleQuickStats = quickStats;
      roleQuickActions = [
        { label: 'Add User', onClick: () => window.location.hash = '#settings', icon: <Users className="w-5 h-5" /> },
        { label: 'View Analytics', onClick: () => window.location.hash = '#analytics', icon: <TrendingUp className="w-5 h-5" /> },
        { label: 'System Backup', onClick: () => window.location.hash = '#backup', icon: <Package className="w-5 h-5" /> },
      ];
      break;
    case 'receptionist':
      roleStats = [
        {
          title: 'Today\'s Appointments',
          value: dashboard.todayPatients, // Replace with actual appointments count if available
          icon: Calendar,
          color: 'bg-blue-500',
          trend: '+2 new'
        },
        {
          title: 'New Patients',
          value: patients.filter(p => p.createdAt >= new Date(new Date().setHours(0,0,0,0))).length,
          icon: Users,
          color: 'bg-green-500',
          trend: '+1 today'
        },
        {
          title: 'Pending Invoices',
          value: invoices.filter(i => i.status !== 'paid').length,
          icon: Receipt,
          color: 'bg-yellow-500',
          trend: 'Action needed'
        },
        {
          title: 'Upcoming Appointments',
          value: dashboard.todayPatients, // Replace with actual upcoming appointments if available
          icon: Calendar,
          color: 'bg-purple-500',
          trend: '+1 upcoming'
        }
      ];
      roleQuickStats = [
        { title: 'Patients Today', value: dashboard.todayPatients, icon: Users },
        { title: 'Invoices Today', value: invoices.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: Receipt }
      ];
      roleQuickActions = [
        { label: 'Add Patient', onClick: () => window.location.hash = '#patients', icon: <Users className="w-5 h-5" /> },
        { label: 'Book Appointment', onClick: () => window.location.hash = '#appointments', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Create Invoice', onClick: () => window.location.hash = '#invoices', icon: <Receipt className="w-5 h-5" /> },
      ];
      break;
    case 'technician':
      roleStats = [
        {
          title: 'Pending Tests',
          value: reports.filter(r => r.status === 'pending').length,
          icon: TestTube,
          color: 'bg-blue-500',
          trend: '+3 new'
        },
        {
          title: 'Samples to Process',
          value: reports.filter(r => r.status === 'in_progress').length,
          icon: Package,
          color: 'bg-yellow-500',
          trend: 'In progress'
        },
        {
          title: 'Completed Tests',
          value: reports.filter(r => r.status === 'completed').length,
          icon: CheckCircle,
          color: 'bg-green-500',
          trend: '+2 today'
        },
        {
          title: 'Critical Results',
          value: reports.filter(r => r.criticalValues).length,
          icon: AlertTriangle,
          color: 'bg-red-500',
          trend: 'Attention'
        }
      ];
      roleQuickStats = [
        { title: 'Assigned Reports', value: reports.length, icon: TestTube },
        { title: 'Reports Today', value: reports.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length, icon: FileText }
      ];
      roleQuickActions = [
        { label: 'Enter Results', onClick: () => window.location.hash = '#test-reporting', icon: <TestTube className="w-5 h-5" /> },
        { label: 'View Assigned', onClick: () => window.location.hash = '#tests', icon: <FileText className="w-5 h-5" /> },
      ];
      break;
    case 'pathologist':
      roleStats = [
        {
          title: 'Reports to Verify',
          value: reports.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
          icon: FileText,
          color: 'bg-yellow-500',
          trend: 'Action needed'
        },
        {
          title: 'Critical Results',
          value: reports.filter(r => r.criticalValues).length,
          icon: AlertTriangle,
          color: 'bg-red-500',
          trend: 'Attention'
        },
        {
          title: 'Verified Reports',
          value: reports.filter(r => r.status === 'verified').length,
          icon: CheckCircle,
          color: 'bg-green-500',
          trend: '+1 today'
        },
        {
          title: 'Locked Reports',
          value: reports.filter(r => r.status === 'locked').length,
          icon: XCircle,
          color: 'bg-blue-500',
          trend: 'Locked'
        }
      ];
      roleQuickStats = [
        { title: 'Reports Today', value: reports.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length, icon: FileText },
        { title: 'Critical Reports', value: reports.filter(r => r.criticalValues).length, icon: AlertTriangle }
      ];
      roleQuickActions = [
        { label: 'Review Reports', onClick: () => window.location.hash = '#reports', icon: <FileText className="w-5 h-5" /> },
        { label: 'Lock Report', onClick: () => window.location.hash = '#reports', icon: <XCircle className="w-5 h-5" /> },
      ];
      break;
    case 'student':
      roleStats = [
        {
          title: 'Training Modules',
          value: 3, // Placeholder
          icon: Book,
          color: 'bg-blue-500',
          trend: 'New'
        },
        {
          title: 'Recent Activity',
          value: 5, // Placeholder
          icon: TrendingUp,
          color: 'bg-green-500',
          trend: '+2 today'
        },
        {
          title: 'Completed Modules',
          value: 2, // Placeholder
          icon: CheckCircle,
          color: 'bg-purple-500',
          trend: 'Keep going'
        },
        {
          title: 'Pending Modules',
          value: 1, // Placeholder
          icon: Clock,
          color: 'bg-yellow-500',
          trend: 'Pending'
        }
      ];
      roleQuickStats = [
        { title: 'Modules Today', value: 1, icon: Book },
        { title: 'Activity', value: 2, icon: TrendingUp }
      ];
      roleQuickActions = [
        { label: 'View Modules', onClick: () => window.location.hash = '#training', icon: <Book className="w-5 h-5" /> },
        { label: 'Learning Resources', onClick: () => window.location.hash = '#resources', icon: <TrendingUp className="w-5 h-5" /> },
      ];
      break;
    case 'dev':
      // Unique cyber dashboard for devs
      roleStats = [
        {
          title: 'API Uptime',
          value: devStats.uptime.toFixed(2) + '%',
          icon: TrendingUp,
          color: neonColors[0],
          trend: devStats.uptime > 99.95 ? 'Stable' : 'Fluctuating'
        },
        {
          title: 'Error Rate',
          value: devStats.errorRate.toFixed(2) + '%',
          icon: AlertTriangle,
          color: neonColors[1],
          trend: devStats.errorRate < 0.05 ? 'Low' : 'High'
        },
        {
          title: 'Build Status',
          value: devStats.buildStatus,
          icon: CheckCircle,
          color: neonColors[2],
          trend: 'Last: ' + (Math.floor(Math.random() * 5) + 1) + 'm ago'
        },
        {
          title: 'Feature Flags',
          value: devStats.featureFlags + ' Active',
          icon: XCircle,
          color: neonColors[3],
          trend: 'Toggleable'
        }
      ];
      roleQuickStats = [
        { title: 'API Requests (24h)', value: devStats.apiRequests, icon: FileText },
        { title: 'Active Users', value: devStats.activeUsers, icon: Users }
      ];
      roleQuickActions = [
        { label: 'View API Logs', onClick: () => window.location.hash = '#logs', icon: <FileText className="w-5 h-5" /> },
        { label: 'Toggle Features', onClick: () => window.location.hash = '#settings', icon: <XCircle className="w-5 h-5" /> },
        { label: 'Run Test Script', onClick: () => alert('Test script executed!'), icon: <TestTube className="w-5 h-5" /> },
      ];
      break;
    default:
      break;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Workflow Success Banner */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">{successMessage}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-green-600 text-sm">Next steps:</span>
                  {nextSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <span className="text-green-600 text-sm">{step}</span>
                      {idx < nextSteps.length - 1 && <ArrowRight className="w-3 h-3 text-green-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Workflow Help Banner */}
      {showWorkflowHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Workflow Guidance</h3>
                <p className="text-blue-600 text-sm">
                  {user?.role === 'receptionist' && 'Start by adding a patient, then create an invoice and schedule appointments.'}
                  {user?.role === 'technician' && 'Check pending tests, enter results, and flag any critical values for immediate attention.'}
                  {user?.role === 'pathologist' && 'Review completed reports, verify results, and ensure quality control standards.'}
                  {user?.role === 'admin' && 'Monitor system performance, manage users, and review analytics for optimization.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowWorkflowHelp(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWorkflowHelp(!showWorkflowHelp)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Workflow Help</span>
          </button>
          <button
            onClick={() => window.location.hash = '#notifications'}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>View Alerts</span>
          </button>
        </div>
      </div>

      {/* Role-based Quick Actions with Enhanced Workflow */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleQuickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.label.toLowerCase().replace(' ', '-'), action.onClick)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 flex items-center space-x-3 group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                {action.icon}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{action.label}</div>
                <div className="text-sm text-gray-500">
                  {action.label === 'Add Patient' && 'Register new patient'}
                  {action.label === 'Create Invoice' && 'Generate billing'}
                  {action.label === 'Enter Results' && 'Add test results'}
                  {action.label === 'Verify Report' && 'Review and approve'}
                  {action.label === 'View Analytics' && 'Check performance'}
                  {action.label === 'System Backup' && 'Create backup'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Stats with Workflow Context */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roleStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.trend.includes('today') ? 'text-green-600' : 
                  stat.trend.includes('attention') || stat.trend.includes('required') ? 'text-red-600' : 
                  'text-blue-600'
                }`}>
                  {stat.trend}
                </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {/* Action hint based on stat */}
            {stat.title.includes('Pending') && (
              <button 
                onClick={() => {
                  if (stat.title.includes('Reports')) {
                    handleQuickAction('view-pending', () => window.location.hash = '#test-reporting');
                  } else if (stat.title.includes('Invoices')) {
                    handleQuickAction('view-pending', () => window.location.hash = '#invoices');
                  }
                }}
                className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleQuickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {/* Low Stock Alerts */}
            {stock.filter(item => item.currentStock <= item.reorderLevel).map(item => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Low Stock Alert</p>
                  <p className="text-xs text-red-700">{item.name} - Only {item.currentStock} units left</p>
                </div>
              </div>
            ))}
            {/* Pending Verification Alerts */}
            {(() => {
              const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'in_progress');
              if (pendingReports.length > 0) {
                return (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Pending Verification</p>
                      <p className="text-xs text-yellow-700">{pendingReports.length} report(s) waiting for pathologist review</p>
              </div>
            </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Monthly Target</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">97%</p>
            <p className="text-sm text-gray-600">Report Accuracy</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.5hrs</p>
            <p className="text-sm text-gray-600">Avg. Report Time</p>
          </div>
        </div>
      </div>
      {/* Add watermark at the bottom of the dashboard */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none select-none opacity-40 text-xs font-mono text-gray-500">
        Developer House: MUHIUM dev | sahiwal.tech
      </div>
    </div>
  );
};

export default Dashboard;