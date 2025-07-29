import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DatabaseSettings {
  host: string;
  port: string;
  database: string;
  username: string;
  poolSize: number;
  autoBackup: boolean;
  backupInterval: string;
  compression: boolean;
}

interface DatabaseContextType {
  settings: DatabaseSettings;
  updateSettings: (newSettings: Partial<DatabaseSettings>) => void;
  resetSettings: () => void;
  testConnection: () => Promise<{ success: boolean; message: string }>;
  createBackup: () => Promise<{ success: boolean; message: string; backupId?: string }>;
  restoreBackup: (backupId: string) => Promise<{ success: boolean; message: string }>;
  getBackupHistory: () => Array<{ id: string; date: Date; size: string; status: string }>;
}

const defaultDatabaseSettings: DatabaseSettings = {
  host: 'localhost',
  port: '5432',
  database: 'rifah_lab',
  username: 'postgres',
  poolSize: 10,
  autoBackup: true,
  backupInterval: 'daily',
  compression: true
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<DatabaseSettings>(defaultDatabaseSettings);
  const [backupHistory, setBackupHistory] = useState<Array<{ id: string; date: Date; size: string; status: string }>>([]);

  // Load database settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('lab_database_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultDatabaseSettings, ...parsedSettings });
        }
      } catch {
        console.error('Failed to load database settings, using defaults');
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lab_database_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<DatabaseSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultDatabaseSettings);
  };

  const testConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Simulate database connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate connection test based on settings
      const isValidHost = settings.host.trim() !== '';
      const isValidPort = parseInt(settings.port) > 0 && parseInt(settings.port) <= 65535;
      const isValidDatabase = settings.database.trim() !== '';
      
      if (!isValidHost || !isValidPort || !isValidDatabase) {
        return {
          success: false,
          message: 'Invalid database configuration. Please check host, port, and database name.'
        };
      }
      
      // Simulate 90% success rate for valid configurations
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        return {
          success: true,
          message: `✅ Successfully connected to ${settings.database} on ${settings.host}:${settings.port}`
        };
      } else {
        return {
          success: false,
          message: '❌ Connection failed. Please check your database server and credentials.'
        };
      }
    } catch {
      return {
        success: false,
        message: '❌ Connection test failed with error. Please try again.'
      };
    }
  };

  const createBackup = async (): Promise<{ success: boolean; message: string; backupId?: string }> => {
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const backupId = `backup_${Date.now()}`;
      const backupSize = `${Math.floor(Math.random() * 100) + 10}MB`;
      
      const newBackup = {
        id: backupId,
        date: new Date(),
        size: backupSize,
        status: 'completed'
      };
      
      setBackupHistory(prev => [newBackup, ...prev]);
      
      return {
        success: true,
        message: `✅ Backup created successfully! Size: ${backupSize}`,
        backupId
      };
    } catch {
      return {
        success: false,
        message: '❌ Backup creation failed. Please try again.'
      };
    }
  };

  const restoreBackup = async (backupId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Simulate backup restoration
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup) {
        return {
          success: false,
          message: '❌ Backup not found.'
        };
      }
      
      return {
        success: true,
        message: `✅ Backup ${backupId} restored successfully!`
      };
    } catch {
      return {
        success: false,
        message: '❌ Backup restoration failed. Please try again.'
      };
    }
  };

  const getBackupHistory = (): Array<{ id: string; date: Date; size: string; status: string }> => {
    return backupHistory;
  };

  return (
    <DatabaseContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      testConnection,
      createBackup,
      restoreBackup,
      getBackupHistory
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}; 