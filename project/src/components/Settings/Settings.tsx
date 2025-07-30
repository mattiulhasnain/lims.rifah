import React, { useState, useEffect } from 'react';
import { useTheme, type Theme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSecurity } from '../../context/SecurityContext';
import { useNotifications } from '../../context/NotificationContext';
import { useDatabase } from '../../context/DatabaseContext';
import { 
  Settings as SettingsIcon, 
  Database, 
  Palette, 
  Bell, 
  Shield, 
  HardDrive,
  Download,
  Upload,
  Save,
  TestTube,
  Phone,
  MapPin,
  Mail,
  Globe,
  DollarSign,
  Clock,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import LoginCreator from '../Auth/LoginCreator';
import { DEMO_USERS } from '../../context/AuthContext';
import { themePresets, type ThemePreset } from '../../context/ThemeContext';

// Default settings structure
const defaultSettings = {
    general: {
      labName: 'Rifah Laboratories',
      address: '170- Hali Road Tehseel Chowk Sahiwal',
      phone: '0404-220285',
      whatsapp: '0320-3655101',
      email: 'info@rifahlabs.com',
      website: 'www.rifahlabs.com',
      timezone: 'Asia/Karachi',
      currency: 'PKR',
      language: 'English'
    },
    database: {
      host: 'localhost',
      port: '5432',
      database: 'rifah_lab',
      username: 'postgres',
      poolSize: 10,
      autoBackup: true,
      backupInterval: 'daily',
      compression: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      criticalResults: true,
      appointmentReminders: true,
      paymentDue: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      loginAttempts: 5,
      auditLogging: true,
      dataEncryption: true
    },
    appearance: {
          theme: 'light' as Theme,
    colorScheme: 'blue' as 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'indigo' | 'pink' | 'yellow' | 'gray',
    fontFamily: 'inter' as 'inter' | 'roboto' | 'poppins' | 'open-sans' | 'montserrat' | 'nunito' | 'raleway' | 'ubuntu',
    fontSize: 'base' as 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl',
    borderRadius: 'md' as 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full',
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
      compactMode: false,
    highContrast: false
  }
};

const Settings: React.FC = () => {
  const { theme, setTheme, settings: themeSettings, updateSettings: updateThemeSettings, applyPreset } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useData();
  const { settings: securitySettings, updateSettings: updateSecuritySettings } = useSecurity();
  const { settings: notificationSettings, updateSettings: updateNotificationSettings } = useNotifications();
  const { settings: databaseSettings, updateSettings: updateDatabaseSettings, testConnection } = useDatabase();
  const [activeTab, setActiveTab] = useState('general');
  const [showCreator, setShowCreator] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Load settings from localStorage on component mount and sync with contexts
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('labSettings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
          
          // Sync theme with theme context only if it's different
          if (parsedSettings.appearance?.theme && parsedSettings.appearance.theme !== theme) {
            setTheme(parsedSettings.appearance.theme as Theme);
          }
          
          // Don't sync appearance settings to avoid infinite loop
          // Theme context manages its own state independently
          
          // Sync security settings
          if (parsedSettings.security) {
            updateSecuritySettings(parsedSettings.security);
          }
          
          // Sync notification settings
          if (parsedSettings.notifications) {
            updateNotificationSettings(parsedSettings.notifications);
          }
          
          // Sync database settings
          if (parsedSettings.database) {
            updateDatabaseSettings(parsedSettings.database);
          }
        } else {
          // Initialize with default settings but use current theme
          const initialSettings = {
            ...defaultSettings,
            appearance: {
              ...defaultSettings.appearance,
              theme: theme
            }
          };
          setSettings(initialSettings);
          localStorage.setItem('labSettings', JSON.stringify(initialSettings));
        }
      } catch {
        console.error('Error loading settings');
        const fallbackSettings = {
          ...defaultSettings,
          appearance: {
            ...defaultSettings.appearance,
            theme: theme
          }
        };
        setSettings(fallbackSettings);
        addNotification({
          type: 'error',
          category: 'system',
          title: 'Settings Error',
          message: 'Failed to load settings. Using defaults.',
          isRead: false,
          priority: 'high'
        });
      }
    };

    loadSettings();
  }, [theme, setTheme, addNotification, updateDatabaseSettings, updateNotificationSettings, updateSecuritySettings]);

  // Sync settings state when theme changes from outside settings
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme
      }
    }));
  }, [theme]);

  // Sync settings with context values - this ensures the form inputs show the correct values
  useEffect(() => {
    console.log('Syncing settings with contexts:', {
      securitySettings,
      notificationSettings,
      databaseSettings
    });
    
    setSettings(prev => ({
      ...prev,
      security: securitySettings || prev.security,
      notifications: notificationSettings || prev.notifications,
      database: databaseSettings || prev.database
    }));
  }, [securitySettings, notificationSettings, databaseSettings]);

  // Test if contexts are working on mount (only runs once)
  useEffect(() => {
    console.log('Settings component mounted');
    console.log('Security context available:', !!updateSecuritySettings);
    console.log('Notification context available:', !!updateNotificationSettings);
    console.log('Database context available:', !!updateDatabaseSettings);
  }, [updateSecuritySettings, updateNotificationSettings, updateDatabaseSettings]); // Dependencies for console logs

  // Only show for admin/dev
  const showAdminTools = user && (user.role === 'admin' || user.role === 'dev');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup', icon: HardDrive }
  ];

  const validateSettings = (newSettings: typeof settings): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate general settings
    if (!newSettings.general.labName.trim()) {
      errors.push('Laboratory name is required');
    }
    if (!newSettings.general.phone.trim()) {
      errors.push('Phone number is required');
    }
    if (!newSettings.general.email.trim() || !/\S+@\S+\.\S+/.test(newSettings.general.email)) {
      errors.push('Valid email address is required');
    }

    // Validate database settings
    if (!newSettings.database.host.trim()) {
      errors.push('Database host is required');
    }
    const port = parseInt(newSettings.database.port as string);
    if (!newSettings.database.port || port < 1 || port > 65535) {
      errors.push('Valid database port is required (1-65535)');
    }
    if (!newSettings.database.database.trim()) {
      errors.push('Database name is required');
    }

    // Validate security settings
    if (newSettings.security.sessionTimeout < 1 || newSettings.security.sessionTimeout > 1440) {
      errors.push('Session timeout must be between 1 and 1440 minutes');
    }
    if (newSettings.security.passwordExpiry < 1 || newSettings.security.passwordExpiry > 365) {
      errors.push('Password expiry must be between 1 and 365 days');
    }
    if (newSettings.security.loginAttempts < 1 || newSettings.security.loginAttempts > 10) {
      errors.push('Login attempts must be between 1 and 10');
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSettingChange = (
    category: keyof typeof settings,
    key: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));

    // Update the appropriate context immediately (except appearance)
    switch (category) {
      case 'security':
        updateSecuritySettings({ [key]: value });
        break;
      case 'notifications':
        updateNotificationSettings({ [key]: value });
        break;
      case 'database':
        updateDatabaseSettings({ [key]: value });
        break;
      // Don't update theme context here to avoid infinite loop
    }
  };

  // Handle appearance changes separately
  const handleAppearanceChange = (key: string, value: string | number | boolean) => {
    updateThemeSettings({ [key]: value });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    handleSettingChange('appearance', 'theme', newTheme);
    
    // Immediately save the theme change to localStorage
    const updatedSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        theme: newTheme
      }
    };
    localStorage.setItem('labSettings', JSON.stringify(updatedSettings));
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      
      if (result.success) {
        addNotification({
          type: 'success',
          category: 'system',
          title: 'Database Connection',
          message: result.message,
          isRead: false,
          priority: 'medium'
        });
        alert(result.message);
      } else {
        addNotification({
          type: 'error',
          category: 'system',
          title: 'Database Connection',
          message: result.message,
          isRead: false,
          priority: 'high'
        });
        alert(result.message);
      }
    } catch {
      addNotification({
        type: 'error',
        category: 'system',
        title: 'Database Connection',
        message: 'Database connection test failed with error.',
        isRead: false,
        priority: 'high'
      });
      alert('❌ Database connection test failed with error.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportSettings = () => {
    try {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
      link.download = `lab-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
      URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        category: 'system',
        title: 'Settings Exported',
        message: 'Settings exported successfully!',
        isRead: false,
        priority: 'medium'
      });
    } catch {
      addNotification({
        type: 'error',
        category: 'system',
        title: 'Export Failed',
        message: 'Failed to export settings.',
        isRead: false,
        priority: 'high'
      });
    }
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          
          // Validate imported settings
          const validation = validateSettings(importedSettings);
          if (!validation.isValid) {
            alert(`❌ Invalid settings file:\n${validation.errors.join('\n')}`);
            return;
          }
          
          setSettings(importedSettings);
          
          // Sync theme if present
          if (importedSettings.appearance?.theme) {
            setTheme(importedSettings.appearance.theme as Theme);
          }
          
          addNotification({
            type: 'success',
            category: 'system',
            title: 'Settings Imported',
            message: 'Settings imported successfully!',
            isRead: false,
            priority: 'medium'
          });
          
          alert('✅ Settings imported successfully!');
        } catch {
          addNotification({
            type: 'error',
            category: 'system',
            title: 'Import Failed',
            message: 'Failed to import settings. Please check the file format.',
            isRead: false,
            priority: 'high'
          });
          alert('❌ Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setSaveStatus({ type: null, message: '' });
    
    try {
      // Validate settings before saving
      const validation = validateSettings(settings);
      if (!validation.isValid) {
        setSaveStatus({ 
          type: 'error', 
          message: `Validation failed:\n${validation.errors.join('\n')}` 
        });
        return;
      }

      // Update all contexts with new settings
      if (settings.security) {
        updateSecuritySettings(settings.security);
      }
      if (settings.notifications) {
        updateNotificationSettings(settings.notifications);
      }
      if (settings.database) {
        updateDatabaseSettings(settings.database);
      }

      // Save settings to localStorage
    localStorage.setItem('labSettings', JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({ 
        type: 'success', 
        message: 'Settings saved successfully!' 
      });
      
      addNotification({
        type: 'success',
        category: 'system',
        title: 'Settings Saved',
        message: 'Settings have been saved successfully!',
        isRead: false,
        priority: 'medium'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);
      
    } catch {
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to save settings. Please try again.' 
      });
      
      addNotification({
        type: 'error',
        category: 'system',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        isRead: false,
        priority: 'high'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSettings(defaultSettings);
      setTheme(defaultSettings.appearance.theme);
      localStorage.setItem('labSettings', JSON.stringify(defaultSettings));
      
      addNotification({
        type: 'info',
        category: 'system',
        title: 'Settings Reset',
        message: 'Settings have been reset to defaults.',
        isRead: false,
        priority: 'medium'
      });
    }
  };

  const testContexts = () => {
    console.log('Testing contexts...');
    
    // Test security context
    updateSecuritySettings({ sessionTimeout: 45 });
    console.log('Updated security settings');
    
    // Test notification context
    updateNotificationSettings({ emailNotifications: false });
    console.log('Updated notification settings');
    
    // Test database context
    updateDatabaseSettings({ host: 'test-host' });
    console.log('Updated database settings');
    
    alert('Contexts tested! Check console for details.');
  };

  const testFormInputs = () => {
    console.log('Testing form inputs...');
    
    // Test updating a security setting
    const newSessionTimeout = 60;
    handleSettingChange('security', 'sessionTimeout', newSessionTimeout);
    console.log('Updated session timeout to:', newSessionTimeout);
    
    // Test updating a notification setting
    const newEmailNotifications = false;
    handleSettingChange('notifications', 'emailNotifications', newEmailNotifications);
    console.log('Updated email notifications to:', newEmailNotifications);
    
    // Test updating a database setting
    const newHost = 'test-server.com';
    handleSettingChange('database', 'host', newHost);
    console.log('Updated database host to:', newHost);
    
    // Check if the settings were actually updated
    setTimeout(() => {
      console.log('After update - Security settings:', securitySettings);
      console.log('After update - Notification settings:', notificationSettings);
      console.log('After update - Database settings:', databaseSettings);
      
      if (securitySettings.sessionTimeout === newSessionTimeout) {
        console.log('✅ Security setting updated successfully!');
      } else {
        console.log('❌ Security setting not updated!');
      }
      
      if (notificationSettings.emailNotifications === newEmailNotifications) {
        console.log('✅ Notification setting updated successfully!');
      } else {
        console.log('❌ Notification setting not updated!');
      }
      
      if (databaseSettings.host === newHost) {
        console.log('✅ Database setting updated successfully!');
      } else {
        console.log('❌ Database setting not updated!');
      }
    }, 100);
    
    alert('Form inputs tested! Check console for details.');
  };

  const showCurrentState = () => {
    console.log('=== CURRENT SETTINGS STATE ===');
    console.log('Local settings state:', settings);
    console.log('Security context:', securitySettings);
    console.log('Notification context:', notificationSettings);
    console.log('Database context:', databaseSettings);
    console.log('=== END STATE ===');
    
    alert(`Current state logged to console.\n\nSecurity: ${JSON.stringify(securitySettings)}\nNotifications: ${JSON.stringify(notificationSettings)}\nDatabase: ${JSON.stringify(databaseSettings)}`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <TestTube className="w-4 h-4 inline mr-2" />
            Laboratory Name
          </label>
          <input
            type="text"
            value={settings.general.labName}
            onChange={(e) => handleSettingChange('general', 'labName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="text"
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <textarea
            value={settings.general.address}
            onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Smartphone className="w-4 h-4 inline mr-2" />
            WhatsApp Number
          </label>
          <input
            type="text"
            value={settings.general.whatsapp}
            onChange={(e) => handleSettingChange('general', 'whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Website
          </label>
          <input
            type="text"
            value={settings.general.website}
            onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Host
          </label>
          <input
            type="text"
            value={settings.database.host}
            onChange={(e) => handleSettingChange('database', 'host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Port
          </label>
          <input
            type="text"
            value={settings.database.port}
            onChange={(e) => handleSettingChange('database', 'port', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Name
          </label>
          <input
            type="text"
            value={settings.database.database}
            onChange={(e) => handleSettingChange('database', 'database', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Connection Pool Size
          </label>
          <input
            type="number"
            value={settings.database.poolSize}
            onChange={(e) => handleSettingChange('database', 'poolSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoBackup"
            checked={settings.database.autoBackup}
            onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Auto Backup
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="compression"
            checked={settings.database.compression}
            onChange={(e) => handleSettingChange('database', 'compression', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="compression" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Compression
          </label>
        </div>
      </div>

      <button
        onClick={testDatabaseConnection}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Test Connection
      </button>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsNotifications"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SMS Notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="pushNotifications"
            checked={settings.notifications.pushNotifications}
            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Push Notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStockAlerts"
            checked={settings.notifications.lowStockAlerts}
            onChange={(e) => handleSettingChange('notifications', 'lowStockAlerts', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="lowStockAlerts" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Low Stock Alerts
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="criticalResults"
            checked={settings.notifications.criticalResults}
            onChange={(e) => handleSettingChange('notifications', 'criticalResults', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="criticalResults" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Critical Results Alerts
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="appointmentReminders"
            checked={settings.notifications.appointmentReminders}
            onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="appointmentReminders" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Appointment Reminders
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="paymentDue"
            checked={settings.notifications.paymentDue}
            onChange={(e) => handleSettingChange('notifications', 'paymentDue', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="paymentDue" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment Due Alerts
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            min={1}
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password Expiry (days)
          </label>
          <input
            type="number"
            min={1}
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            min={1}
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Two-Factor Authentication
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auditLogging"
            checked={settings.security.auditLogging}
            onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="auditLogging" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Audit Logging
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="dataEncryption"
            checked={settings.security.dataEncryption}
            onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="dataEncryption" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Data Encryption
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme Mode
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { value: 'light', label: 'Light', icon: Sun, description: 'Bright and clean' },
            { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
            { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system' },
            { value: 'sunset', label: 'Sunset', icon: Sun, description: 'Warm and cozy' },
            { value: 'midnight', label: 'Midnight', icon: Moon, description: 'Deep and mysterious' },
            { value: 'ocean', label: 'Ocean', icon: Sun, description: 'Cool and refreshing' },
            { value: 'forest', label: 'Forest', icon: Sun, description: 'Natural and calm' },
            { value: 'desert', label: 'Desert', icon: Sun, description: 'Warm and earthy' },
            { value: 'aurora', label: 'Aurora', icon: Sun, description: 'Magical and dreamy' },
            { value: 'neon', label: 'Neon', icon: Sun, description: 'Vibrant and bold' }
          ].map(({ value, label, icon: Icon, description }) => (
          <button
              key={value}
              onClick={() => handleThemeChange(value as Theme)}
              className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                theme === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
            }`}
              title={description}
          >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
          </button>
          ))}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color Scheme
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { value: 'blue', color: '#3b82f6', name: 'Blue' },
            { value: 'green', color: '#10b981', name: 'Green' },
            { value: 'purple', color: '#8b5cf6', name: 'Purple' },
            { value: 'orange', color: '#f59e0b', name: 'Orange' },
            { value: 'red', color: '#ef4444', name: 'Red' },
            { value: 'teal', color: '#14b8a6', name: 'Teal' },
            { value: 'indigo', color: '#6366f1', name: 'Indigo' },
            { value: 'pink', color: '#ec4899', name: 'Pink' },
            { value: 'yellow', color: '#eab308', name: 'Yellow' },
            { value: 'gray', color: '#6b7280', name: 'Gray' }
          ].map(({ value, color, name }) => (
          <button
              key={value}
              onClick={() => handleAppearanceChange('colorScheme', value)}
                          className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              themeSettings.colorScheme === value
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
              title={name}
          >
              <div
                className="w-full h-8 rounded-md"
                style={{ backgroundColor: color }}
              />
              <span className="block text-xs mt-1 text-gray-600 dark:text-gray-400">{name}</span>
          </button>
          ))}
        </div>
      </div>

      {/* Font Family Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Family
        </label>
        <select
          value={themeSettings.fontFamily}
          onChange={(e) => handleAppearanceChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="inter">Inter</option>
          <option value="roboto">Roboto</option>
          <option value="poppins">Poppins</option>
          <option value="open-sans">Open Sans</option>
          <option value="montserrat">Montserrat</option>
          <option value="nunito">Nunito</option>
          <option value="raleway">Raleway</option>
          <option value="ubuntu">Ubuntu</option>
        </select>
      </div>

      {/* Font Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Size
        </label>
        <div className="grid grid-cols-6 gap-3">
          {[
            { value: 'xs', label: 'XS', size: '0.75rem' },
            { value: 'sm', label: 'SM', size: '0.875rem' },
            { value: 'base', label: 'Base', size: '1rem' },
            { value: 'lg', label: 'LG', size: '1.125rem' },
            { value: 'xl', label: 'XL', size: '1.25rem' },
            { value: '2xl', label: '2XL', size: '1.5rem' }
          ].map(({ value, label, size }) => (
          <button
              key={value}
              onClick={() => handleAppearanceChange('fontSize', value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                themeSettings.fontSize === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              style={{ fontSize: size }}
            >
              {label}
          </button>
          ))}
        </div>
      </div>

      {/* Border Radius Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Border Radius
        </label>
        <div className="grid grid-cols-6 gap-3">
          {[
            { value: 'none', label: 'None', radius: '0' },
            { value: 'sm', label: 'Small', radius: '0.125rem' },
            { value: 'md', label: 'Medium', radius: '0.375rem' },
            { value: 'lg', label: 'Large', radius: '0.5rem' },
            { value: 'xl', label: 'XL', radius: '0.75rem' },
            { value: 'full', label: 'Full', radius: '9999px' }
          ].map(({ value, label, radius }) => (
            <button
              key={value}
              onClick={() => handleAppearanceChange('borderRadius', value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                themeSettings.borderRadius === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              style={{ borderRadius: radius }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Speed Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Animation Speed
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'slow', label: 'Slow' },
            { value: 'normal', label: 'Normal' },
            { value: 'fast', label: 'Fast' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleAppearanceChange('animationSpeed', value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                themeSettings.animationSpeed === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="compactMode"
            checked={themeSettings.compactMode}
            onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="compactMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Compact Mode (Reduced spacing)
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="highContrast"
            checked={themeSettings.highContrast}
            onChange={(e) => handleAppearanceChange('highContrast', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="highContrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            High Contrast Mode
          </label>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Presets</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose from curated theme combinations for different moods and professional contexts
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themePresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as ThemePreset)}
              className="group relative p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {preset.name}
                </h4>
                <div className="flex space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `var(--color-primary)`,
                      opacity: 0.8
                    }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `var(--color-secondary)`,
                      opacity: 0.6
                    }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `var(--color-accent)`,
                      opacity: 0.4
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                {preset.description}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="capitalize">{preset.colorScheme}</span>
                <span className="capitalize">{preset.fontFamily.replace('-', ' ')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Backup & Restore Settings
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          Export your current settings or import settings from a backup file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={exportSettings}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export Settings</span>
        </button>

        <label className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Import Settings</span>
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return <div>Settings content for {activeTab}</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {showAdminTools && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Demo Logins & User Management</h3>
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-lg bg-blue-50"
            >
              <span>+ Create User</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {DEMO_USERS.map((account) => (
              <div
                key={account.username}
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-start"
              >
                <p className="text-base font-semibold text-gray-900 mb-1">{account.name || account.role}</p>
                <p className="text-xs text-gray-500 mb-1">{account.username}</p>
                <p className="text-xs text-gray-400 mb-1">{account.role}</p>
                <button
                  onClick={async () => {
                    localStorage.setItem('demo_login_username', account.username);
                    localStorage.setItem('demo_login_password', account.password);
                    const text = `Username: ${account.username} | Password: ${account.password}`;
                    try {
                      await navigator.clipboard.writeText(text);
                      alert(`Credentials copied to clipboard!\n${text}`);
                    } catch {
                      alert(`Could not copy to clipboard.\n${text}`);
                    }
                  }}
                  className="mt-1 text-xs text-blue-600 hover:underline"
                >
                  Copy Credentials
                </button>
                <details className="mt-1">
                  <summary className="text-xs text-gray-400 cursor-pointer">Show Password</summary>
                  <span className="text-xs text-gray-700">{account.password}</span>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
      {showCreator && (
        <LoginCreator onBack={() => setShowCreator(false)} />
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your laboratory management system settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          {/* Status Messages */}
          {saveStatus.type && (
            <div className={`mb-4 p-3 rounded-md flex items-center space-x-2 ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
                : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
            }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm whitespace-pre-line">{saveStatus.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
          <button
            onClick={saveSettings}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
            <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
              </button>

              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>

              <button
                onClick={testContexts}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Contexts</span>
              </button>

                             <button
                 onClick={testFormInputs}
                 className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
               >
                 <TestTube className="w-4 h-4" />
                 <span>Test Form Inputs</span>
               </button>

               <button
                 onClick={showCurrentState}
                 className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
               >
                 <TestTube className="w-4 h-4" />
                 <span>Show State</span>
          </button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last saved: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;