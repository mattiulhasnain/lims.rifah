import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Notification } from '../../types';
import { 
  Bell, Check, X, AlertTriangle, Info, CheckCircle,
  Calendar, DollarSign, Package, FileText, Users,
  Eye, Clock, Shield, Zap
} from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'critical' | 'verification'>('all');
  const [showCriticalBanner, setShowCriticalBanner] = useState(true);

  // Get critical and verification notifications
  const criticalNotifications = notifications.filter(n => n.priority === 'high' && n.category === 'report');
  const verificationNotifications = notifications.filter(n => n.category === 'report' && n.message.includes('verification'));
  const unreadCriticalCount = criticalNotifications.filter(n => !n.isRead).length;
  const unreadVerificationCount = verificationNotifications.filter(n => !n.isRead).length;

  // Play sound for new critical notifications
  useEffect(() => {
    const newCriticalNotifications = criticalNotifications.filter(n => !n.isRead);
    if (newCriticalNotifications.length > 0) {
      // In a real app, you would play a sound here
      console.log('Critical notification received:', newCriticalNotifications[0].title);
    }
  }, [criticalNotifications]);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'high':
        return notification.priority === 'high';
      case 'critical':
        return notification.priority === 'high' && notification.category === 'report';
      case 'verification':
        return notification.category === 'report' && notification.message.includes('verification');
      default:
        return true;
    }
  });

  // Action handlers for critical notifications
  const handleViewReport = (notification: Notification) => {
    // Navigate to the specific report
    console.log('Navigate to report:', notification.actionUrl);
    markNotificationAsRead(notification.id);
  };

  const handleAcknowledgeCritical = (notification: Notification) => {
    // Mark critical result as acknowledged
    console.log('Acknowledge critical result:', notification.id);
    markNotificationAsRead(notification.id);
  };

  const handleVerifyReport = (notification: Notification) => {
    // Navigate to verification page
    console.log('Navigate to verification:', notification.actionUrl);
    markNotificationAsRead(notification.id);
  };

  // Use DataContext methods for actions
  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'stock') return <Package className="w-5 h-5" />;
    if (category === 'payment') return <DollarSign className="w-5 h-5" />;
    if (category === 'report') return <FileText className="w-5 h-5" />;
    if (category === 'appointment') return <Calendar className="w-5 h-5" />;
    if (category === 'system') return <Users className="w-5 h-5" />;

    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <X className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Critical Alerts Banner */}
      {showCriticalBanner && unreadCriticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  {unreadCriticalCount} Critical Result{unreadCriticalCount > 1 ? 's' : ''} Require{unreadCriticalCount > 1 ? '' : 's'} Attention
                </h3>
                <p className="text-red-600">Immediate action required for patient safety</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('critical')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View All</span>
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

      {/* Pending Verifications Banner */}
      {unreadVerificationCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  {unreadVerificationCount} Report{unreadVerificationCount > 1 ? 's' : ''} Pending Verification
                </h3>
                <p className="text-yellow-600">Reports ready for pathologist review</p>
              </div>
            </div>
            <button
              onClick={() => setFilter('verification')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Review Now</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount} unread • {unreadCriticalCount} critical • {unreadVerificationCount} pending verification
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
              { key: 'high', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length },
              { key: 'critical', label: 'Critical Results', count: unreadCriticalCount, badge: 'red' },
              { key: 'verification', label: 'Pending Verification', count: unreadVerificationCount, badge: 'yellow' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as 'all' | 'unread' | 'high' | 'critical' | 'verification')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  filter === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{option.label}</span>
                {option.badge && option.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    option.badge === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
              !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
            } ${notification.priority === 'high' && notification.category === 'report' ? 'border-l-4 border-l-red-500 bg-red-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type, notification.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority.toUpperCase()}
                    </span>
                    {notification.priority === 'high' && notification.category === 'report' && (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>CRITICAL</span>
                      </span>
                    )}
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="capitalize">{notification.category}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(notification.createdAt)}</span>
                  </div>

                  {/* Action Buttons for Critical Notifications */}
                  {notification.priority === 'high' && notification.category === 'report' && !notification.isRead && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleViewReport(notification)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Report</span>
                      </button>
                      <button
                        onClick={() => handleAcknowledgeCritical(notification)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    </div>
                  )}

                  {/* Action Buttons for Verification Notifications */}
                  {notification.category === 'report' && notification.message.includes('verification') && !notification.isRead && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleVerifyReport(notification)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 flex items-center space-x-1"
                      >
                        <Shield className="w-3 h-3" />
                        <span>Verify Report</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
          </p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
            <div className="space-y-2">
              {[
                'Low stock alerts',
                'Report ready notifications',
                'Payment reminders',
                'System maintenance alerts'
              ].map((item, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Push Notifications</h4>
            <div className="space-y-2">
              {[
                'Critical value alerts',
                'Appointment reminders',
                'Urgent system alerts',
                'Daily summary reports'
              ].map((item, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;