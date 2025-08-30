// Security utilities for LIMS system

export interface SecurityConfig {
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  requireLowercase: boolean;
  lockoutDuration: number; // minutes
  enableAuditLog: boolean;
  enableEncryption: boolean;
}

export interface LoginAttempt {
  username: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();
  private lockedAccounts: Map<string, Date> = new Map();
  private config: SecurityConfig;

  private constructor() {
    this.config = this.loadSecurityConfig();
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Load security configuration from localStorage or use defaults
  private loadSecurityConfig(): SecurityConfig {
    const stored = localStorage.getItem('lab_security_config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall back to defaults if parsing fails
      }
    }

    return {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      requireLowercase: true,
      lockoutDuration: 15,
      enableAuditLog: true,
      enableEncryption: true
    };
  }

  // Save security configuration
  saveSecurityConfig(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config };
    localStorage.setItem('lab_security_config', JSON.stringify(this.config));
  }

  // Get current security configuration
  getSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Validate password strength
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }

    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if account is locked
  isAccountLocked(username: string): boolean {
    const lockTime = this.lockedAccounts.get(username);
    if (!lockTime) return false;

    const now = new Date();
    const lockoutDurationMs = this.config.lockoutDuration * 60 * 1000;
    
    if (now.getTime() - lockTime.getTime() > lockoutDurationMs) {
      this.lockedAccounts.delete(username);
      return false;
    }

    return true;
  }

  // Record login attempt
  recordLoginAttempt(username: string, success: boolean, ipAddress?: string, userAgent?: string): void {
    const attempt: LoginAttempt = {
      username,
      timestamp: new Date(),
      success,
      ipAddress,
      userAgent
    };

    if (!this.loginAttempts.has(username)) {
      this.loginAttempts.set(username, []);
    }

    this.loginAttempts.get(username)!.push(attempt);

    // Keep only recent attempts (last 24 hours)
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.loginAttempts.set(
      username,
      this.loginAttempts.get(username)!.filter(attempt => attempt.timestamp > cutoffTime)
    );

    // Check for account lockout
    if (!success) {
      const recentFailedAttempts = this.loginAttempts
        .get(username)!
        .filter(attempt => !attempt.success && attempt.timestamp > cutoffTime);

      if (recentFailedAttempts.length >= this.config.maxLoginAttempts) {
        this.lockedAccounts.set(username, new Date());
      }
    } else {
      // Clear failed attempts on successful login
      this.loginAttempts.delete(username);
      this.lockedAccounts.delete(username);
    }
  }

  // Get login attempts for a user
  getLoginAttempts(username: string): LoginAttempt[] {
    return this.loginAttempts.get(username) || [];
  }

  // Check session validity
  isSessionValid(): boolean {
    const lastActivity = localStorage.getItem('lab_last_activity');
    if (!lastActivity) return false;

    const lastActivityTime = new Date(lastActivity).getTime();
    const currentTime = new Date().getTime();
    const sessionTimeoutMs = this.config.sessionTimeout * 60 * 1000;

    return (currentTime - lastActivityTime) < sessionTimeoutMs;
  }

  // Update last activity
  updateLastActivity(): void {
    localStorage.setItem('lab_last_activity', new Date().toISOString());
  }

  // Clear session data
  clearSession(): void {
    localStorage.removeItem('lab_last_activity');
    localStorage.removeItem('lab_user_data');
  }

  // Generate secure random string
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Simple encryption/decryption (for demo purposes - use proper encryption in production)
  encrypt(data: string): string {
    if (!this.config.enableEncryption) return data;
    // Simple base64 encoding for demo - replace with proper encryption
    return btoa(encodeURIComponent(data));
  }

  decrypt(encryptedData: string): string {
    if (!this.config.enableEncryption) return encryptedData;
    // Simple base64 decoding for demo - replace with proper decryption
    return decodeURIComponent(atob(encryptedData));
  }

  // Sanitize user input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate file upload
  validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
    }

    return { isValid: true };
  }

  // Get security audit log
  getSecurityAuditLog(): LoginAttempt[] {
    const allAttempts: LoginAttempt[] = [];
    this.loginAttempts.forEach(attempts => {
      allAttempts.push(...attempts);
    });
    return allAttempts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Clear security audit log
  clearSecurityAuditLog(): void {
    this.loginAttempts.clear();
    this.lockedAccounts.clear();
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();

// Utility functions
export const hashPassword = async (password: string): Promise<string> => {
  // In a real application, use a proper hashing library like bcrypt
  // For demo purposes, we'll use a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generatePassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}; 