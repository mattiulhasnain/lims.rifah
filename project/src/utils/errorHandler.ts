// Error handling utilities for LIMS system

export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
  userId?: string;
  module?: string;
}

export class LIMSError extends Error {
  public code: string;
  public details?: string;
  public module?: string;
  public timestamp: Date;

  constructor(code: string, message: string, details?: string, module?: string) {
    super(message);
    this.name = 'LIMSError';
    this.code = code;
    this.details = details;
    this.module = module;
    this.timestamp = new Date();
  }
}

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_SESSION_EXPIRED: 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_003',
  
  // Data validation errors
  VALIDATION_REQUIRED_FIELD: 'VAL_001',
  VALIDATION_INVALID_FORMAT: 'VAL_002',
  VALIDATION_DUPLICATE_ENTRY: 'VAL_003',
  
  // Database errors
  DB_CONNECTION_FAILED: 'DB_001',
  DB_QUERY_FAILED: 'DB_002',
  DB_TRANSACTION_FAILED: 'DB_003',
  
  // File operations
  FILE_UPLOAD_FAILED: 'FILE_001',
  FILE_NOT_FOUND: 'FILE_002',
  FILE_CORRUPTED: 'FILE_003',
  
  // Report generation
  REPORT_GENERATION_FAILED: 'REP_001',
  REPORT_TEMPLATE_NOT_FOUND: 'REP_002',
  REPORT_DATA_INVALID: 'REP_003',
  
  // System errors
  SYSTEM_MAINTENANCE: 'SYS_001',
  SYSTEM_OVERLOAD: 'SYS_002',
  SYSTEM_CONFIG_ERROR: 'SYS_003'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid username or password',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Session expired. Please log in again',
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action',
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'This field is required',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Invalid format',
  [ERROR_CODES.VALIDATION_DUPLICATE_ENTRY]: 'This entry already exists',
  [ERROR_CODES.DB_CONNECTION_FAILED]: 'Database connection failed',
  [ERROR_CODES.DB_QUERY_FAILED]: 'Database query failed',
  [ERROR_CODES.DB_TRANSACTION_FAILED]: 'Database transaction failed',
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'File upload failed',
  [ERROR_CODES.FILE_NOT_FOUND]: 'File not found',
  [ERROR_CODES.FILE_CORRUPTED]: 'File is corrupted',
  [ERROR_CODES.REPORT_GENERATION_FAILED]: 'Report generation failed',
  [ERROR_CODES.REPORT_TEMPLATE_NOT_FOUND]: 'Report template not found',
  [ERROR_CODES.REPORT_DATA_INVALID]: 'Invalid report data',
  [ERROR_CODES.SYSTEM_MAINTENANCE]: 'System is under maintenance',
  [ERROR_CODES.SYSTEM_OVERLOAD]: 'System is overloaded. Please try again later',
  [ERROR_CODES.SYSTEM_CONFIG_ERROR]: 'System configuration error'
} as const;

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle and log errors
  handleError(error: Error | LIMSError, userId?: string, module?: string): AppError {
    const appError: AppError = {
      code: error instanceof LIMSError ? error.code : 'UNKNOWN_ERROR',
      message: error.message,
      details: error instanceof LIMSError ? error.details : error.stack,
      timestamp: new Date(),
      userId,
      module: error instanceof LIMSError ? error.module : module
    };

    this.errorLog.push(appError);
    this.logError(appError);
    return appError;
  }

  // Log error to console and potentially external service
  private logError(error: AppError): void {
    console.error('LIMS Error:', {
      code: error.code,
      message: error.message,
      module: error.module,
      timestamp: error.timestamp,
      userId: error.userId
    });

    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or your own error logging API
    if (process.env.NODE_ENV === 'production') {
      // this.sendToErrorService(error);
    }
  }

  // Get error log
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Get errors by module
  getErrorsByModule(module: string): AppError[] {
    return this.errorLog.filter(error => error.module === module);
  }

  // Get errors by user
  getErrorsByUser(userId: string): AppError[] {
    return this.errorLog.filter(error => error.userId === userId);
  }

  // Get recent errors
  getRecentErrors(hours: number = 24): AppError[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.errorLog.filter(error => error.timestamp > cutoffTime);
  }
}

// Validation utilities
export class ValidationError extends LIMSError {
  constructor(field: string, message: string, details?: string) {
    super(ERROR_CODES.VALIDATION_REQUIRED_FIELD, message, details, 'validation');
    this.name = 'ValidationError';
  }
}

// Form validation helpers
export const validateRequired = (value: unknown, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(fieldName, `${fieldName} is required`);
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('email', 'Invalid email format');
  }
};

export const validatePhone = (phone: string): void => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    throw new ValidationError('phone', 'Invalid phone number format');
  }
};

export const validateCNIC = (cnic: string): void => {
  const cnicRegex = /^\d{5}-\d{7}-\d$/;
  if (!cnicRegex.test(cnic)) {
    throw new ValidationError('cnic', 'Invalid CNIC format (XXXXX-XXXXXXX-X)');
  }
};

// Async error wrapper
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  userId?: string,
  module?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const errorHandler = ErrorHandler.getInstance();
    const appError = errorHandler.handleError(
      error instanceof Error ? error : new Error(String(error)),
      userId,
      module
    );
    throw appError;
  }
};

// React error boundary hook
export const useErrorHandler = () => {
  const handleError = (error: Error, userId?: string, module?: string) => {
    const errorHandler = ErrorHandler.getInstance();
    return errorHandler.handleError(error, userId, module);
  };

  return { handleError };
}; 