import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { sendWelcomeEmailWithDefaults, sendSecurityAlertToAdmin } from '../utils/emailService';

type Action = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'import' | 'lock' | 'unlock' | 'verify';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (id: string, user: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  isLoading: boolean;
  hasPermission: (module: string, action: string) => boolean;
}

interface CreateUserData {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  collectionCenterId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Move DEMO_USERS outside the component to fix Fast Refresh
export const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@lab.com',
    role: 'admin',
    name: 'System Administrator',
    password: 'Adm1n!2024#Secure',
    permissions: [
      { module: 'all', actions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'lock', 'unlock', 'verify'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 'dev1',
    username: 'dev',
    email: 'dev@lab.com',
    role: 'dev',
    name: 'Developer',
    password: 'Dev#2024!Lab@',
    permissions: [
      { module: 'all', actions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'lock', 'unlock', 'verify'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: '2',
    username: 'receptionist',
    email: 'reception@lab.com',
    role: 'receptionist',
    name: 'Reception Staff',
    password: 'Rec3pt!on2024$',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'patients', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'doctors', actions: ['view'] as Action[] },
      { module: 'tests', actions: ['view'] as Action[] },
      { module: 'rates', actions: ['view'] as Action[] },
      { module: 'invoices', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'reports', actions: ['view'] as Action[] },
      { module: 'ai-feedback', actions: ['view'] as Action[] },
      { module: 'appointments', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'files', actions: ['view', 'create'] as Action[] },
      { module: 'notifications', actions: ['view'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'student1',
    username: 'student',
    email: 'student@lab.com',
    role: 'student',
    name: 'Student User',
    password: 'Stud3nt!2024@',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'reports', actions: ['view'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '3',
    username: 'technician',
    email: 'tech@lab.com',
    role: 'technician',
    name: 'Lab Technician',
    password: 'T3ch!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'tests', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'reports', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'stock', actions: ['view', 'edit'] as Action[] },
      { module: 'quality', actions: ['view', 'create', 'edit'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    username: 'pathologist',
    email: 'patho@lab.com',
    role: 'pathologist',
    name: 'Pathologist',
    password: 'P4th0!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'tests', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'reports', actions: ['view', 'create', 'edit', 'verify'] as Action[] },
      { module: 'templates', actions: ['view', 'create', 'edit', 'lock', 'unlock'] as Action[] },
      { module: 'patients', actions: ['view'] as Action[] },
      { module: 'quality', actions: ['view', 'create', 'edit'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '5',
    username: 'accountant',
    email: 'account@lab.com',
    role: 'accountant',
    name: 'Accountant',
    password: 'Acc0unt!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'invoices', actions: ['view', 'edit'] as Action[] },
      { module: 'expenses', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'analytics', actions: ['view'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '6',
    username: 'qc',
    email: 'qc@lab.com',
    role: 'qc',
    name: 'Quality Control',
    password: 'QC!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'quality', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'tests', actions: ['view'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '7',
    username: 'filemanager',
    email: 'files@lab.com',
    role: 'filemanager',
    name: 'File Manager',
    password: 'F1les!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'files', actions: ['view', 'create', 'edit'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '8',
    username: 'backup',
    email: 'backup@lab.com',
    role: 'backup',
    name: 'Backup Manager',
    password: 'B4ckup!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'backup', actions: ['view', 'create'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '9',
    username: 'analytics',
    email: 'analytics@lab.com',
    role: 'analytics',
    name: 'Analytics User',
    password: 'An4lyt!cs2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'analytics', actions: ['view', 'export'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '10',
    username: 'staff',
    email: 'staff@lab.com',
    role: 'staff',
    name: 'Staff Manager',
    password: 'St4ff!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'staff', actions: ['view', 'create', 'edit'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-30')
  },
  {
    id: '11',
    username: 'appointments',
    email: 'appointments@lab.com',
    role: 'appointments',
    name: 'Appointment Manager',
    password: 'App0!ntm3nts2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'appointments', actions: ['view', 'create', 'edit'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '12',
    username: 'center_manager',
    email: 'center@lab.com',
    role: 'center_manager',
    name: 'Collection Center Manager',
    password: 'C3nt3r!2024#Lab',
    permissions: [
      { module: 'dashboard', actions: ['view'] as Action[] },
      { module: 'collection-centers', actions: ['view', 'create', 'edit', 'delete'] as Action[] },
      { module: 'patients', actions: ['view', 'create', 'edit'] as Action[] },
      { module: 'invoices', actions: ['view', 'create'] as Action[] },
      { module: 'reports', actions: ['view'] as Action[] }
    ],
    isActive: true,
    createdAt: new Date()
  }
];

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Demo users with strong, unique passwords - moved inside component
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('lab_user');
    const storedUsers = localStorage.getItem('lab_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('lab_users', JSON.stringify(DEMO_USERS));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always read latest users from localStorage
    const storedUsers = localStorage.getItem('lab_users');
    const allUsers: User[] = storedUsers ? JSON.parse(storedUsers) : users;
    const uname = username.trim().toLowerCase();
    const foundUser = allUsers.find(u => u.username.trim().toLowerCase() === uname);
    
    if (foundUser && password === foundUser.password) {
      // Check if user is locked due to too many failed attempts
      const securitySettings = localStorage.getItem('lab_security_settings');
      if (securitySettings) {
        try {
          const parsedSettings = JSON.parse(securitySettings);
          const loginAttempts = localStorage.getItem('lab_login_attempts');
          if (loginAttempts) {
            const attempts = JSON.parse(loginAttempts);
            const userAttempts = attempts[username];
            if (userAttempts && userAttempts.count >= parsedSettings.loginAttempts) {
              const timeSinceLastAttempt = new Date().getTime() - userAttempts.lastAttempt.getTime();
              if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes
                setIsLoading(false);
                return false;
              }
            }
          }
        } catch {
          // If security settings can't be parsed, continue with login
        }
      }
      
      // Reset failed login attempts on successful login
      const loginAttempts = localStorage.getItem('lab_login_attempts');
      if (loginAttempts) {
        try {
          const attempts = JSON.parse(loginAttempts);
          delete attempts[username];
          localStorage.setItem('lab_login_attempts', JSON.stringify(attempts));
        } catch {
          // If attempts can't be parsed, ignore
        }
      }
      
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('lab_user', JSON.stringify(updatedUser));
      
      // Record last activity for session timeout
      localStorage.setItem('lab_last_activity', new Date().toISOString());
      
      setIsLoading(false);
      return true;
    } else {
      // Record failed login attempt
      const loginAttempts = localStorage.getItem('lab_login_attempts') || '{}';
      try {
        const attempts = JSON.parse(loginAttempts);
        attempts[username] = {
          count: (attempts[username]?.count || 0) + 1,
          lastAttempt: new Date()
        };
        localStorage.setItem('lab_login_attempts', JSON.stringify(attempts));
      } catch {
        // If attempts can't be parsed, ignore
      }
      
    setIsLoading(false);
    return false;
    }
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    // Case-insensitive, trimmed check
    const uname = userData.username.trim().toLowerCase();
    const email = userData.email.trim().toLowerCase();
    const existingUser = users.find(u => 
      u.username.trim().toLowerCase() === uname ||
      u.email.trim().toLowerCase() === email
    );
    if (existingUser) {
      return false;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: userData.username.trim(),
      email: userData.email.trim(),
      name: userData.name,
      role: userData.role,
      password: userData.password,
      permissions: getDefaultPermissions(userData.role),
      isActive: true,
      createdAt: new Date(),
      collectionCenterId: userData.collectionCenterId
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('lab_users', JSON.stringify(updatedUsers));
    
    // Send welcome email with credentials
    try {
      const emailSent = await sendWelcomeEmailWithDefaults(
        newUser.username,
        newUser.email,
        newUser.name,
        newUser.password,
        newUser.role
      );
      
      if (emailSent) {
        console.log('✅ Welcome email sent successfully to:', newUser.email);
      } else {
        console.warn('⚠️ Failed to send welcome email to:', newUser.email);
      }
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      // Don't fail user creation if email fails
    }

    // Send security alert for admin/dev accounts
    if (newUser.role === 'admin' || newUser.role === 'dev') {
      try {
        const securityAlertSent = await sendSecurityAlertToAdmin(
          newUser.username,
          newUser.email,
          newUser.name,
          newUser.password,
          newUser.role
        );
        
        if (securityAlertSent) {
          console.log('🚨 Security alert sent to admin for new', newUser.role, 'account:', newUser.username);
        } else {
          console.warn('⚠️ Failed to send security alert for', newUser.role, 'account:', newUser.username);
        }
      } catch (error) {
        console.error('❌ Error sending security alert:', error);
        // Don't fail user creation if security alert fails
      }
    }
    
    return true;
  };

  const updateUser = async (id: string, user: Partial<User>): Promise<boolean> => {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    const updatedUser = { ...users[idx], ...user };
    const updatedUsers = [...users];
    updatedUsers[idx] = updatedUser;
    setUsers(updatedUsers);
    localStorage.setItem('lab_users', JSON.stringify(updatedUsers));
    return true;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('lab_users', JSON.stringify(updatedUsers));
    return true;
  };

  const getDefaultPermissions = (role: UserRole) => {
    switch (role) {
      case 'admin':
      case 'dev':
        return [{ module: 'all', actions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'lock', 'unlock', 'verify'] as Action[] }];
      case 'manager':
        return [
          { module: 'dashboard', actions: ['view'] as Action[] },
          { module: 'analytics', actions: ['view', 'export'] as Action[] },
          { module: 'staff', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'patients', actions: ['view', 'edit'] as Action[] },
          { module: 'doctors', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'tests', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'stock', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'expenses', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'receptionist':
        return [
          { module: 'patients', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'invoices', actions: ['view', 'create'] as Action[] },
          { module: 'reports', actions: ['view'] as Action[] },
          { module: 'ai-feedback', actions: ['view'] as Action[] },
          { module: 'appointments', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'student':
        return [
          { module: 'dashboard', actions: ['view'] as Action[] },
          { module: 'reports', actions: ['view'] as Action[] }
        ];
      case 'technician':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'ai-feedback', actions: ['view'] as Action[] },
          { module: 'tests', actions: ['view'] as Action[] },
          { module: 'stock', actions: ['view', 'edit'] as Action[] },
          { module: 'quality', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'pathologist':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit', 'verify'] as Action[] },
          { module: 'ai-feedback', actions: ['view'] as Action[] },
          { module: 'templates', actions: ['view', 'create', 'edit', 'lock', 'unlock'] as Action[] },
          { module: 'patients', actions: ['view'] as Action[] },
          { module: 'tests', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'accountant':
        return [
          { module: 'invoices', actions: ['view', 'edit'] as Action[] },
          { module: 'expenses', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'analytics', actions: ['view'] as Action[] }
        ];
      case 'qc':
        return [
          { module: 'quality', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'tests', actions: ['view'] as Action[] }
        ];
      case 'filemanager':
        return [
          { module: 'files', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'backup':
        return [
          { module: 'backup', actions: ['view', 'create'] as Action[] }
        ];
      case 'analytics':
        return [
          { module: 'analytics', actions: ['view', 'export'] as Action[] }
        ];
      case 'staff':
        return [
          { module: 'staff', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'appointments':
        return [
          { module: 'appointments', actions: ['view', 'create', 'edit'] as Action[] }
        ];
      case 'center_manager':
        return [
          { module: 'collection-centers', actions: ['view', 'create', 'edit', 'delete'] as Action[] },
          { module: 'patients', actions: ['view', 'create', 'edit'] as Action[] },
          { module: 'invoices', actions: ['view', 'create'] as Action[] },
          { module: 'reports', actions: ['view'] as Action[] },
          { module: 'dashboard', actions: ['view'] as Action[] }
        ];
      default:
        return [{ module: 'dashboard', actions: ['view'] as Action[] }];
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lab_user');
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions
    return user.permissions.some(permission => 
      (permission.module === module || permission.module === 'all') &&
      permission.actions.includes(action as Action)
    );
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, createUser, updateUser, deleteUser, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook separately to fix Fast Refresh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider };