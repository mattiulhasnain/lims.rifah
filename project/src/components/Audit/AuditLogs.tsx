import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Download, User,
  Activity, Shield, Eye, AlertTriangle, CheckCircle,
  Zap, Target, X
} from 'lucide-react';
import { AuditLog, Notification } from '../../types';

const AuditLogs: React.FC = () => {
  const { auditLogs, notifications } = useData();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [selectedLog, setSelectedLog] = useState<AuditLog | Notification | null>(null);
  const [showType, setShowType] = useState<'all' | 'logs' | 'notifications'>('all');
  const [showCriticalBanner, setShowCriticalBanner] = useState(true);

  // Merge audit logs and notifications for unified view
  type MergedAuditItem = (AuditLog & { _type: 'log'; timestamp: Date }) | (Notification & { _type: 'notification'; timestamp: Date });

  const mergedData = ([
    ...auditLogs.map(log => ({
      ...log,
      _type: 'log' as const,
      timestamp: log.timestamp,
      title: log.action + ' ' + log.module,
      message: log.details,
      category: log.module,
      type: 'info',
    })),
    ...notifications.map(n => ({
      ...n,
      _type: 'notification' as const,
      timestamp: n.createdAt,
      userId: '',
      action: n.type?.toUpperCase() || '',
      module: n.category,
      details: n.message,
      title: n.title,
      category: n.category,
    }))
  ] as MergedAuditItem[]).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Type guards
  function isAuditLog(item: MergedAuditItem): item is AuditLog & { _type: 'log'; timestamp: Date } {
    return item._type === 'log';
  }
  function isNotification(item: MergedAuditItem): item is Notification & { _type: 'notification'; timestamp: Date } {
    return item._type === 'notification';
  }

  const filteredMerged = mergedData.filter(item => {
    if (showType === 'logs' && item._type !== 'log') return false;
    if (showType === 'notifications' && item._type !== 'notification') return false;
    const matchesSearch = (
      (isAuditLog(item) ? item.details : item.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isAuditLog(item) ? item.module : item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesAction = actionFilter === 'all' || (isAuditLog(item) ? item.action === actionFilter : false);
    const matchesModule = moduleFilter === 'all' || (isAuditLog(item) ? item.module === moduleFilter : false);
    // Date range filter
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const matchesDate = item.timestamp >= cutoffDate;
    return matchesSearch && matchesAction && matchesModule && matchesDate;
  });

  // Get critical actions and verification activities
  const criticalActions = mergedData.filter(item => 
    isAuditLog(item) && ['DELETE', 'VERIFY', 'LOCK', 'UNLOCK'].includes(item.action)
  );
  const verificationActivities = mergedData.filter(item => 
    (isAuditLog(item) && item.action === 'VERIFY') || 
    (isNotification(item) && item.category === 'report' && item.message.includes('verification'))
  );
  const recentCriticalActions = criticalActions.filter(item => {
    const hoursAgo = (Date.now() - item.timestamp.getTime()) / (1000 * 60 * 60);
    return hoursAgo < 24; // Last 24 hours
  });

  // Real-time alerts for critical actions
  useEffect(() => {
    if (recentCriticalActions.length > 0) {
      console.log('Critical action detected:', recentCriticalActions[0]);
      // In a real app, you would show a toast notification here
    }
  }, [recentCriticalActions]);

  // Action handlers for critical audit items
  const handleInvestigateAction = (item: MergedAuditItem) => {
    console.log('Investigate action:', item);
    setSelectedLog(item);
  };

  const handleReviewVerification = (item: MergedAuditItem) => {
    console.log('Review verification:', item);
    // Navigate to verification review page
  };

  const handleExportCritical = () => {
    const criticalData = mergedData.filter(item => 
      isAuditLog(item) && ['DELETE', 'VERIFY', 'LOCK', 'UNLOCK'].includes(item.action)
    );
    // Export critical actions to CSV
    console.log('Exporting critical actions:', criticalData.length);
  };

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'VERIFY', 'LOCK', 'UNLOCK'];
  const modules = ['PATIENTS', 'DOCTORS', 'TESTS', 'INVOICES', 'REPORTS', 'STOCK', 'EXPENSES', 'AUTH', 'SETTINGS'];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'UPDATE': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'DELETE': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'VIEW': return <Eye className="w-4 h-4 text-gray-600" />;
      case 'LOGIN': return <Shield className="w-4 h-4 text-green-600" />;
      case 'LOGOUT': return <Shield className="w-4 h-4 text-gray-600" />;
      case 'VERIFY': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'VIEW': return 'bg-gray-100 text-gray-800';
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'VERIFY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId: string) => {
    // In real app, this would lookup user by ID
    const userNames: { [key: string]: string } = {
      '1': 'System Administrator',
      '2': 'Reception Staff',
      '3': 'Lab Technician',
      '4': 'Dr. Pathologist'
    };
    return userNames[userId] || 'Unknown User';
  };

  const exportLogs = () => {
    const csvRows = [
      ['Timestamp', 'Type', 'User', 'Action', 'Module', 'Title', 'Details', 'Category', 'IP Address'],
      ...filteredMerged.map(item => [
        item.timestamp.toLocaleString(),
        isAuditLog(item) ? 'Audit Log' : 'Notification',
        isAuditLog(item) ? getUserName(item.userId) : '',
        isAuditLog(item) ? item.action : isNotification(item) ? item.type?.toUpperCase() : '',
        isAuditLog(item) ? item.module : isNotification(item) ? item.category : '',
        isAuditLog(item) ? item.title : isNotification(item) ? item.title : '',
        isAuditLog(item) ? item.details : isNotification(item) ? item.message : '',
        isAuditLog(item) ? item.category : isNotification(item) ? item.category : '',
        isAuditLog(item) ? item.ipAddress || '' : ''
      ])
    ];
    const csvContent = csvRows.map(row => row.map(field => '"' + (field || '').replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Critical Actions Banner */}
      {showCriticalBanner && recentCriticalActions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  {recentCriticalActions.length} Critical Action{recentCriticalActions.length > 1 ? 's' : ''} in Last 24 Hours
                </h3>
                <p className="text-red-600">Security-sensitive activities requiring review</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActionFilter('critical')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Review All</span>
              </button>
              <button
                onClick={handleExportCritical}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowCriticalBanner(false)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Activities Banner */}
      {verificationActivities.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-purple-800">
                  {verificationActivities.length} Verification Activit{verificationActivities.length > 1 ? 'ies' : 'y'}
                </h3>
                <p className="text-purple-600">Report verification and approval activities</p>
              </div>
            </div>
            <button
              onClick={() => setActionFilter('VERIFY')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>View Verifications</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">
            Track all system activities and user actions • {recentCriticalActions.length} critical actions today
          </p>
        </div>
        {hasPermission('audit', 'export') && (
          <div className="flex space-x-2">
            <button
              onClick={handleExportCritical}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Critical</span>
            </button>
          <button
            onClick={exportLogs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
              <span>Export All</span>
          </button>
          </div>
        )}
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{mergedData.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Actions</p>
              <p className="text-2xl font-bold text-red-600">{criticalActions.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verifications</p>
              <p className="text-2xl font-bold text-purple-600">{verificationActivities.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(mergedData.map(log => log.userId)).size}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="critical">Critical Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <div className="flex gap-2">
            <button onClick={() => setShowType('all')} className={`px-3 py-2 rounded ${showType==='all'?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`}>All</button>
            <button onClick={() => setShowType('logs')} className={`px-3 py-2 rounded ${showType==='logs'?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`}>Logs</button>
            <button onClick={() => setShowType('notifications')} className={`px-3 py-2 rounded ${showType==='notifications'?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`}>Alerts</button>
          </div>
        </div>
      </div>

      {/* Enhanced Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Module</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerged.map((item) => (
                <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-50 ${
                  isAuditLog(item) && ['DELETE', 'VERIFY', 'LOCK', 'UNLOCK'].includes(item.action) 
                    ? 'bg-red-50 border-l-4 border-l-red-500' 
                    : ''
                }`}>
                  <td className="py-3 px-4">{item.timestamp.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{isAuditLog(item) ? 'Audit Log' : 'Notification'}</span>
                      {isAuditLog(item) && ['DELETE', 'VERIFY', 'LOCK', 'UNLOCK'].includes(item.action) && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>CRITICAL</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{isAuditLog(item) ? getUserName(item.userId) : ''}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {isAuditLog(item) ? getActionIcon(item.action) : null}
                      <span className={`px-2 py-1 rounded-full text-xs ${isAuditLog(item) ? getActionColor(item.action) : ''}`}>
                        {isAuditLog(item) ? item.action : isNotification(item) ? item.type?.toUpperCase() : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{isAuditLog(item) ? item.module : isNotification(item) ? item.category : ''}</td>
                  <td className="py-3 px-4">{isAuditLog(item) ? item.title : isNotification(item) ? item.title : ''}</td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate">
                      {isAuditLog(item) ? item.details : isNotification(item) ? item.message : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setSelectedLog(item)} className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAuditLog(item) && ['DELETE', 'VERIFY', 'LOCK', 'UNLOCK'].includes(item.action) && (
                        <button 
                          onClick={() => handleInvestigateAction(item)} 
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Investigate"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                      )}
                      {((isAuditLog(item) && item.action === 'VERIFY') || 
                        (isNotification(item) && item.category === 'report' && item.message.includes('verification'))) && (
                        <button 
                          onClick={() => handleReviewVerification(item)} 
                          className="p-1 text-purple-600 hover:text-purple-800"
                          title="Review Verification"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMerged.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No audit logs found for the selected criteria</p>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-medium">{isAuditLog(selectedLog) ? getUserName(selectedLog.userId) : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Action</p>
                  <div className="flex items-center space-x-2">
                    {isAuditLog(selectedLog) ? getActionIcon(selectedLog.action) : null}
                    <span className={`px-2 py-1 rounded-full text-sm ${isAuditLog(selectedLog) ? getActionColor(selectedLog.action) : ''}`}>
                      {isAuditLog(selectedLog) ? selectedLog.action : isNotification(selectedLog) ? selectedLog.type?.toUpperCase() : ''}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Module</p>
                  <p className="font-medium">{isAuditLog(selectedLog) ? selectedLog.module : isNotification(selectedLog) ? selectedLog.category : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="font-medium">{selectedLog.timestamp ? selectedLog.timestamp.toLocaleString() : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="font-medium">{isAuditLog(selectedLog) ? selectedLog.ipAddress || 'N/A' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session ID</p>
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Details</p>
                <p className="bg-gray-50 p-3 rounded-lg">{isAuditLog(selectedLog) ? selectedLog.details : isNotification(selectedLog) ? selectedLog.message : ''}</p>
              </div>
              {isAuditLog(selectedLog) && selectedLog.userAgent && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">User Agent</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm break-all">{selectedLog.userAgent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;