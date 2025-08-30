// Deployment configuration for LIMS system

const deployConfig = {
  // Environment configurations
  environments: {
    development: {
      apiUrl: 'http://localhost:3000',
      baseUrl: 'http://localhost:5173',
      environment: 'development',
      enableDebug: true,
      enableLogging: true,
      enableAnalytics: false
    },
    staging: {
      apiUrl: 'https://staging-api.rifahlabs.com',
      baseUrl: 'https://staging.rifahlabs.com',
      environment: 'staging',
      enableDebug: true,
      enableLogging: true,
      enableAnalytics: true
    },
    production: {
      apiUrl: 'https://api.rifahlabs.com',
      baseUrl: 'https://app.rifahlabs.com',
      environment: 'production',
      enableDebug: false,
      enableLogging: true,
      enableAnalytics: true
    }
  },

  // Build configurations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Asset optimization
    assets: {
      inline: 4096, // Inline assets smaller than 4KB
      limit: 8192,  // Limit asset size to 8KB
      hash: true    // Add hash to filenames for cache busting
    },

    // Compression settings
    compression: {
      gzip: true,
      brotli: true,
      threshold: 1024 // Compress files larger than 1KB
    },

    // Bundle splitting
    splitting: {
      vendor: true,
      chunks: {
        vendor: ['react', 'react-dom'],
        ui: ['lucide-react', 'react-select'],
        charts: ['recharts'],
        forms: ['react-hook-form', 'yup']
      }
    }
  },

  // Server configurations
  server: {
    // Development server
    dev: {
      port: 5173,
      host: 'localhost',
      https: false,
      cors: true
    },

    // Production server
    prod: {
      port: 3000,
      host: '0.0.0.0',
      https: true,
      cors: {
        origin: ['https://app.rifahlabs.com'],
        credentials: true
      }
    }
  },

  // Database configurations
  database: {
    development: {
      type: 'sqlite',
      database: './lims-dev.db',
      logging: true
    },
    staging: {
      type: 'postgres',
      host: 'staging-db.rifahlabs.com',
      port: 5432,
      database: 'lims_staging',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: true
    },
    production: {
      type: 'postgres',
      host: 'prod-db.rifahlabs.com',
      port: 5432,
      database: 'lims_production',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: false,
      ssl: true
    }
  },

  // Email configurations
  email: {
    development: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    staging: {
      service: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY
    },
    production: {
      service: 'aws-ses',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1'
    }
  },

  // Security configurations
  security: {
    // JWT settings
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h',
      refreshExpiresIn: '7d'
    },

    // CORS settings
    cors: {
      origin: ['https://app.rifahlabs.com', 'https://staging.rifahlabs.com'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    },

    // Password policy
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },

  // Monitoring and logging
  monitoring: {
    // Application monitoring
    app: {
      enableMetrics: true,
      enableTracing: true,
      sampleRate: 0.1 // Sample 10% of requests
    },

    // Error tracking
    errors: {
      service: 'sentry',
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV
    },

    // Performance monitoring
    performance: {
      service: 'newrelic',
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
      appName: 'Rifah-LIMS'
    }
  },

  // Backup configurations
  backup: {
    // Database backup
    database: {
      schedule: '0 2 * * *', // Daily at 2 AM
      retention: 30, // Keep backups for 30 days
      storage: 's3',
      bucket: 'rifah-lims-backups'
    },

    // File backup
    files: {
      schedule: '0 3 * * *', // Daily at 3 AM
      retention: 90, // Keep backups for 90 days
      storage: 's3',
      bucket: 'rifah-lims-files'
    }
  },

  // CI/CD configurations
  ci: {
    // GitHub Actions
    github: {
      workflows: {
        test: {
          triggers: ['push', 'pull_request'],
          branches: ['main', 'develop']
        },
        deploy: {
          triggers: ['push'],
          branches: ['main']
        }
      }
    },

    // Docker
    docker: {
      image: 'rifah-lims',
      registry: 'ghcr.io/rifah-labs',
      platforms: ['linux/amd64', 'linux/arm64']
    }
  }
};

// Helper functions
export const getEnvironmentConfig = (env = process.env.NODE_ENV || 'development') => {
  return deployConfig.environments[env] || deployConfig.environments.development;
};

export const getDatabaseConfig = (env = process.env.NODE_ENV || 'development') => {
  return deployConfig.database[env] || deployConfig.database.development;
};

export const getEmailConfig = (env = process.env.NODE_ENV || 'development') => {
  return deployConfig.email[env] || deployConfig.email.development;
};

export const getSecurityConfig = () => {
  return deployConfig.security;
};

export const getBuildConfig = () => {
  return deployConfig.build;
};

export default deployConfig; 