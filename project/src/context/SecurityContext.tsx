import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SecuritySettings {
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
  twoFactorAuth: boolean;
  auditLogging: boolean;
  dataEncryption: boolean;
}

interface SecurityContextType {
  settings: SecuritySettings;
  updateSettings: (newSettings: Partial<SecuritySettings>) => void;
  resetSettings: () => void;
  checkSessionTimeout: () => boolean;
  checkPasswordExpiry: (lastPasswordChange: Date) => boolean;
  checkLoginAttempts: (username: string) => { canLogin: boolean; attemptsLeft: number };
  recordLoginAttempt: (username: string, success: boolean) => void;
  isAuditLoggingEnabled: () => boolean;
  isDataEncryptionEnabled: () => boolean;
  isTwoFactorEnabled: () => boolean;
}

const defaultSecuritySettings: SecuritySettings = {
  sessionTimeout: 30,
  passwordExpiry: 90,
  loginAttempts: 5,
  twoFactorAuth: false,
  auditLogging: true,
  dataEncryption: true
};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, { count: number; lastAttempt: Date }>>({});

  // Load security settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('lab_security_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultSecuritySettings, ...parsedSettings });
        }
      } catch {
        console.error('Failed to load security settings, using defaults');
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lab_security_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SecuritySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSecuritySettings);
  };

  // Check if current session should timeout
  const checkSessionTimeout = (): boolean => {
    const lastActivity = localStorage.getItem('lab_last_activity');
    if (!lastActivity) return false;

    const lastActivityTime = new Date(lastActivity).getTime();
    const currentTime = new Date().getTime();
    const timeoutMs = settings.sessionTimeout * 60 * 1000; // Convert minutes to milliseconds

    return (currentTime - lastActivityTime) > timeoutMs;
  };

  // Check if password has expired
  const checkPasswordExpiry = (lastPasswordChange: Date): boolean => {
    const currentDate = new Date();
    const expiryDate = new Date(lastPasswordChange);
    expiryDate.setDate(expiryDate.getDate() + settings.passwordExpiry);

    return currentDate > expiryDate;
  };

  // Check login attempts for a user
  const checkLoginAttempts = (username: string): { canLogin: boolean; attemptsLeft: number } => {
    const userAttempts = loginAttempts[username];
    if (!userAttempts) {
      return { canLogin: true, attemptsLeft: settings.loginAttempts };
    }

    // Reset attempts if more than 15 minutes have passed
    const timeSinceLastAttempt = new Date().getTime() - userAttempts.lastAttempt.getTime();
    if (timeSinceLastAttempt > 15 * 60 * 1000) { // 15 minutes
      setLoginAttempts(prev => {
        const newAttempts = { ...prev };
        delete newAttempts[username];
        return newAttempts;
      });
      return { canLogin: true, attemptsLeft: settings.loginAttempts };
    }

    const attemptsLeft = Math.max(0, settings.loginAttempts - userAttempts.count);
    return { canLogin: attemptsLeft > 0, attemptsLeft };
  };

  // Record a login attempt
  const recordLoginAttempt = (username: string, success: boolean) => {
    if (success) {
      // Reset attempts on successful login
      setLoginAttempts(prev => {
        const newAttempts = { ...prev };
        delete newAttempts[username];
        return newAttempts;
      });
    } else {
      // Increment failed attempts
      setLoginAttempts(prev => ({
        ...prev,
        [username]: {
          count: (prev[username]?.count || 0) + 1,
          lastAttempt: new Date()
        }
      }));
    }
  };

  const isAuditLoggingEnabled = (): boolean => {
    return settings.auditLogging;
  };

  const isDataEncryptionEnabled = (): boolean => {
    return settings.dataEncryption;
  };

  const isTwoFactorEnabled = (): boolean => {
    return settings.twoFactorAuth;
  };

  return (
    <SecurityContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      checkSessionTimeout,
      checkPasswordExpiry,
      checkLoginAttempts,
      recordLoginAttempt,
      isAuditLoggingEnabled,
      isDataEncryptionEnabled,
      isTwoFactorEnabled
    }}>
      {children}
    </SecurityContext.Provider>
  );
}; 