import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  criticalResults: boolean;
  appointmentReminders: boolean;
  paymentDue: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
  sendNotification: (type: keyof NotificationSettings, message: string, data?: Record<string, unknown>) => void;
  isNotificationEnabled: (type: keyof NotificationSettings) => boolean;
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  lowStockAlerts: true,
  criticalResults: true,
  appointmentReminders: true,
  paymentDue: true
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings);

  // Load notification settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('lab_notification_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultNotificationSettings, ...parsedSettings });
        }
      } catch {
        console.error('Failed to load notification settings, using defaults');
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lab_notification_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultNotificationSettings);
  };

  const sendNotification = (type: keyof NotificationSettings, message: string, data?: Record<string, unknown>) => {
    if (!settings[type]) {
      console.log(`Notification ${type} is disabled`);
      return;
    }

    // Simulate sending different types of notifications
    switch (type) {
      case 'emailNotifications':
        console.log(`📧 Email notification: ${message}`, data);
        // Here you would integrate with your email service
        break;
      
      case 'smsNotifications':
        console.log(`📱 SMS notification: ${message}`, data);
        // Here you would integrate with SMS service
        break;
      
      case 'pushNotifications':
        console.log(`🔔 Push notification: ${message}`, data);
        // Here you would integrate with push notification service
        break;
      
      case 'lowStockAlerts':
        console.log(`⚠️ Low stock alert: ${message}`, data);
        // Show in-app notification
        showInAppNotification('Low Stock Alert', message, 'warning');
        break;
      
      case 'criticalResults':
        console.log(`🚨 Critical result alert: ${message}`, data);
        // Show urgent in-app notification
        showInAppNotification('Critical Result', message, 'error');
        break;
      
      case 'appointmentReminders':
        console.log(`📅 Appointment reminder: ${message}`, data);
        // Show in-app notification
        showInAppNotification('Appointment Reminder', message, 'info');
        break;
      
      case 'paymentDue':
        console.log(`💰 Payment due alert: ${message}`, data);
        // Show in-app notification
        showInAppNotification('Payment Due', message, 'warning');
        break;
    }
  };

  const showInAppNotification = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success') => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      type === 'success' ? 'bg-green-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="font-semibold">${title}</h4>
          <p class="text-sm mt-1">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  const isNotificationEnabled = (type: keyof NotificationSettings): boolean => {
    return settings[type];
  };

  return (
    <NotificationContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      sendNotification,
      isNotificationEnabled
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 