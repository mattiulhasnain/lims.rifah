// Email Service for sending welcome emails with credentials
// Using EmailJS for real email sending

import emailjs from '@emailjs/browser';

export interface EmailCredentials {
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  loginUrl: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  subject: string;
  labName: string;
  labAddress: string;
  labPhone: string;
  labEmail: string;
  labWebsite: string;
}

// Import EmailJS configuration
import { EMAILJS_CONFIG, isEmailJSConfigured, sendFallbackEmail } from './emailConfig';

// Initialize EmailJS only if configured
if (isEmailJSConfigured()) {
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Default email configuration
const defaultConfig: EmailConfig = {
  fromEmail: 'noreply@rifahlabs.com',
  fromName: 'Rifah Laboratories',
  subject: 'Welcome to Rifah Laboratories - Your Account Credentials',
  labName: 'Rifah Laboratories',
  labAddress: '170- Hali Road Tehseel Chowk Sahiwal',
  labPhone: '0404-220285',
  labEmail: 'info@rifahlabs.com',
  labWebsite: 'www.rifahlabs.com'
};

// Security monitoring email configuration for admin/dev accounts
const securityConfig: EmailConfig = {
  fromEmail: 'security@rifahlabs.com',
  fromName: 'Rifah Laboratories Security',
  subject: '🚨 SECURITY ALERT: New Admin/Developer Account Created',
  labName: 'Rifah Laboratories',
  labAddress: '170- Hali Road Tehseel Chowk Sahiwal',
  labPhone: '0404-220285',
  labEmail: 'info@rifahlabs.com',
  labWebsite: 'www.rifahlabs.com'
};

// Generate HTML email template
const generateWelcomeEmailHTML = (credentials: EmailCredentials, config: EmailConfig): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${config.labName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 20px;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
          color: #2d3748;
        }
        .credentials-box {
          background-color: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .credentials-box h3 {
          margin: 0 0 15px 0;
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
        }
        .credential-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .credential-row:last-child {
          border-bottom: none;
        }
        .credential-label {
          font-weight: 600;
          color: #4a5568;
          min-width: 120px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          background-color: #edf2f7;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          color: #2d3748;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .security-notice {
          background-color: #fef5e7;
          border: 1px solid #f6ad55;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
        .security-notice h4 {
          margin: 0 0 10px 0;
          color: #c05621;
          font-size: 14px;
        }
        .security-notice ul {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #744210;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
          color: #718096;
        }
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          color: #718096;
        }
        .contact-info span {
          margin: 0 10px;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .credential-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>${config.labName}</h1>
          <p>Professional Diagnostic Services</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${credentials.name}</strong>,</p>
            <p>Welcome to <strong>${config.labName}</strong>! Your account has been successfully created and you can now access our Laboratory Management System.</p>
          </div>
          
          <div class="credentials-box">
            <h3>🔐 Your Login Credentials</h3>
            <div class="credential-row">
              <span class="credential-label">Username:</span>
              <span class="credential-value">${credentials.username}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${credentials.password}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Role:</span>
              <span class="credential-value">${credentials.role}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Email:</span>
              <span class="credential-value">${credentials.email}</span>
            </div>
          </div>
          
          <a href="${credentials.loginUrl}" class="login-button">
            🚀 Access Your Account
          </a>
          
          <div class="security-notice">
            <h4>🔒 Security Reminders:</h4>
            <ul>
              <li>Keep your credentials confidential and never share them</li>
              <li>Change your password on first login for security</li>
              <li>Log out when you're done using the system</li>
              <li>Contact IT support if you suspect any security issues</li>
            </ul>
          </div>
          
          <p><strong>Account Created:</strong> ${currentDate}</p>
          <p><strong>System Access:</strong> You can now log in to manage patients, tests, reports, and other laboratory operations based on your role permissions.</p>
        </div>
        
        <div class="footer">
          <p><strong>${config.labName}</strong></p>
          <div class="contact-info">
            <span>📞 ${config.labPhone}</span>
            <span>📧 ${config.labEmail}</span>
            <span>🌐 ${config.labWebsite}</span>
          </div>
          <p>${config.labAddress}</p>
          <p style="margin-top: 15px; font-size: 11px; color: #a0aec0;">
            This is a computer-generated invoice. No physical signature required. Generated on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email template
const generateWelcomeEmailText = (credentials: EmailCredentials, config: EmailConfig): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Welcome to ${config.labName}!

Dear ${credentials.name},

Your account has been successfully created and you can now access our Laboratory Management System.

=== YOUR LOGIN CREDENTIALS ===
Username: ${credentials.username}
Password: ${credentials.password}
Role: ${credentials.role}
Email: ${credentials.email}

=== ACCESS YOUR ACCOUNT ===
Login URL: ${credentials.loginUrl}

=== SECURITY REMINDERS ===
- Keep your credentials confidential and never share them
- Change your password on first login for security
- Log out when you're done using the system
- Contact IT support if you suspect any security issues

Account Created: ${currentDate}
System Access: You can now log in to manage patients, tests, reports, and other laboratory operations based on your role permissions.

=== CONTACT INFORMATION ===
${config.labName}
Phone: ${config.labPhone}
Email: ${config.labEmail}
Website: ${config.labWebsite}
Address: ${config.labAddress}

This is an automated message. Please do not reply to this email.
  `;
};

// Generate HTML email template for security alert
const generateSecurityAlertHTML = (credentials: EmailCredentials, config: EmailConfig): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert - New Admin Account</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .alert-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px 20px;
        }
        .alert-message {
          background-color: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .alert-message h3 {
          margin: 0 0 15px 0;
          color: #dc2626;
          font-size: 18px;
          font-weight: 600;
        }
        .credentials-box {
          background-color: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .credentials-box h3 {
          margin: 0 0 15px 0;
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
        }
        .credential-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .credential-row:last-child {
          border-bottom: none;
        }
        .credential-label {
          font-weight: 600;
          color: #4a5568;
          min-width: 120px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          background-color: #edf2f7;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          color: #2d3748;
        }
        .security-notice {
          background-color: #fef5e7;
          border: 1px solid #f6ad55;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
        .security-notice h4 {
          margin: 0 0 10px 0;
          color: #c05621;
          font-size: 14px;
        }
        .security-notice ul {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #744210;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
          color: #718096;
        }
        .timestamp {
          background-color: #f1f5f9;
          border-radius: 6px;
          padding: 10px;
          margin: 15px 0;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .credential-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="alert-icon">🚨</div>
          <h1>SECURITY ALERT</h1>
          <p>New High-Privilege Account Created</p>
        </div>
        
        <div class="content">
          <div class="alert-message">
            <h3>⚠️ IMPORTANT SECURITY NOTIFICATION</h3>
            <p>A new <strong>${credentials.role.toUpperCase()}</strong> account has been created in the Rifah Laboratories Management System. This account has elevated privileges and should be monitored closely.</p>
          </div>
          
          <div class="timestamp">
            <strong>Account Created:</strong> ${currentDate} at ${currentTime}
          </div>
          
          <div class="credentials-box">
            <h3>🔐 New Account Credentials</h3>
            <div class="credential-row">
              <span class="credential-label">Username:</span>
              <span class="credential-value">${credentials.username}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${credentials.password}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Role:</span>
              <span class="credential-value">${credentials.role.toUpperCase()}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Email:</span>
              <span class="credential-value">${credentials.email}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Full Name:</span>
              <span class="credential-value">${credentials.name}</span>
            </div>
          </div>
          
          <div class="security-notice">
            <h4>🔒 Security Recommendations:</h4>
            <ul>
              <li>Verify this account creation was authorized</li>
              <li>Monitor the account for unusual activity</li>
              <li>Ensure the user changes their password on first login</li>
              <li>Review account permissions and access levels</li>
              <li>Consider implementing additional security measures</li>
            </ul>
          </div>
          
          <p><strong>System Access:</strong> This account has full administrative privileges and can access all system modules including user management, system settings, and sensitive data.</p>
        </div>
        
        <div class="footer">
          <p><strong>${config.labName} - Security Monitoring</strong></p>
          <p>This is an automated security alert. Please review and take appropriate action if needed.</p>
          <p style="margin-top: 15px; font-size: 11px; color: #a0aec0;">
            Generated by: ${config.labName} Security System
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email template for security alert
const generateSecurityAlertText = (credentials: EmailCredentials, config: EmailConfig): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return `
🚨 SECURITY ALERT - New Admin/Developer Account Created 🚨

IMPORTANT SECURITY NOTIFICATION

A new ${credentials.role.toUpperCase()} account has been created in the Rifah Laboratories Management System. This account has elevated privileges and should be monitored closely.

=== ACCOUNT CREATION DETAILS ===
Account Created: ${currentDate} at ${currentTime}
Role: ${credentials.role.toUpperCase()}

=== NEW ACCOUNT CREDENTIALS ===
Username: ${credentials.username}
Password: ${credentials.password}
Role: ${credentials.role.toUpperCase()}
Email: ${credentials.email}
Full Name: ${credentials.name}

=== SECURITY RECOMMENDATIONS ===
- Verify this account creation was authorized
- Monitor the account for unusual activity
- Ensure the user changes their password on first login
- Review account permissions and access levels
- Consider implementing additional security measures

=== SYSTEM ACCESS ===
This account has full administrative privileges and can access all system modules including user management, system settings, and sensitive data.

=== CONTACT INFORMATION ===
${config.labName}
Phone: ${config.labPhone}
Email: ${config.labEmail}
Website: ${config.labWebsite}
Address: ${config.labAddress}

This is an automated security alert. Please review and take appropriate action if needed.

Generated by: ${config.labName} Security System
  `;
};

// Real email sending function using EmailJS
export const sendWelcomeEmail = async (
  credentials: EmailCredentials,
  config: EmailConfig = defaultConfig
): Promise<boolean> => {
  try {
    // Generate email content
    const htmlContent = generateWelcomeEmailHTML(credentials, config);
    const textContent = generateWelcomeEmailText(credentials, config);
    
    console.log('📧 Sending welcome email to:', credentials.email);
    console.log('📧 Email Subject:', config.subject);
    
    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      console.warn('📧 EmailJS not configured, using fallback');
      return await sendFallbackEmail(
        credentials.email,
        config.subject,
        textContent
      );
    }
    
    // EmailJS template parameters
    const templateParams = {
      to_email: credentials.email,
      to_name: credentials.name,
      subject: config.subject,
      html_content: htmlContent,
      text_content: textContent,
      username: credentials.username,
      password: credentials.password,
      role: credentials.role,
      login_url: credentials.loginUrl,
      lab_name: config.labName,
      lab_phone: config.labPhone,
      lab_email: config.labEmail,
      lab_website: config.labWebsite,
      lab_address: config.labAddress,
      created_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Welcome email sent successfully to:', credentials.email);
    console.log('📋 EmailJS Response:', response);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return false;
  }
};

// Function to send welcome email with default configuration
export const sendWelcomeEmailWithDefaults = async (
  username: string,
  email: string,
  name: string,
  password: string,
  role: string
): Promise<boolean> => {
  const credentials: EmailCredentials = {
    username,
    email,
    name,
    password,
    role,
    loginUrl: window.location.origin // Current domain
  };
  
  return await sendWelcomeEmail(credentials);
};

// Function to send security alert email
export const sendSecurityAlertEmail = async (
  credentials: EmailCredentials,
  config: EmailConfig = securityConfig
): Promise<boolean> => {
  try {
    const htmlContent = generateSecurityAlertHTML(credentials, config);
    const textContent = generateSecurityAlertText(credentials, config);

    console.log('📧 Sending security alert email to:', credentials.email);
    console.log('📧 Email Subject:', config.subject);

    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      console.warn('📧 EmailJS not configured, using fallback');
      return await sendFallbackEmail(
        credentials.email,
        config.subject,
        textContent
      );
    }

    // EmailJS template parameters for security alert
    const templateParams = {
      to_email: credentials.email,
      subject: config.subject,
      html_content: htmlContent,
      text_content: textContent,
      username: credentials.username,
      password: credentials.password,
      role: credentials.role.toUpperCase(),
      user_email: credentials.email,
      full_name: credentials.name,
      login_url: credentials.loginUrl,
      lab_name: config.labName,
      lab_phone: config.labPhone,
      lab_email: config.labEmail,
      lab_website: config.labWebsite,
      lab_address: config.labAddress,
      created_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      created_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.SECURITY_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Security alert email sent successfully to:', credentials.email);
    console.log('📋 EmailJS Response:', response);

    return true;
  } catch (error) {
    console.error('❌ Failed to send security alert email:', error);
    return false;
  }
};

// Function to send security alert to admin email (m.mattiulhasnain@gmail.com)
export const sendSecurityAlertToAdmin = async (
  username: string,
  email: string,
  name: string,
  password: string,
  role: string
): Promise<boolean> => {
  const credentials: EmailCredentials = {
    username,
    email,
    name,
    password,
    role,
    loginUrl: window.location.origin
  };

  // Override the email to send to admin
  const adminCredentials = {
    ...credentials,
    email: 'm.mattiulhasnain@gmail.com'
  };

  return await sendSecurityAlertEmail(adminCredentials);
};

// Export the email templates for testing
export { generateWelcomeEmailHTML, generateWelcomeEmailText, generateSecurityAlertHTML, generateSecurityAlertText }; 