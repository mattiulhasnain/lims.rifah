// EmailJS Configuration for Rifah Laboratories
// This file contains the EmailJS configuration and setup instructions

export interface EmailJSConfig {
  SERVICE_ID: string;
  TEMPLATE_ID: string;
  PUBLIC_KEY: string;
  SECURITY_TEMPLATE_ID: string;
}

// Default configuration with placeholder values
// You need to replace these with your actual EmailJS credentials
export const EMAILJS_CONFIG: EmailJSConfig = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  SECURITY_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_SECURITY_TEMPLATE_ID || 'YOUR_SECURITY_TEMPLATE_ID'
};

// Check if EmailJS is properly configured
export const isEmailJSConfigured = (): boolean => {
  return !(
    EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
    EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
    EMAILJS_CONFIG.SECURITY_TEMPLATE_ID === 'YOUR_SECURITY_TEMPLATE_ID'
  );
};

// EmailJS Setup Instructions
export const EMAILJS_SETUP_INSTRUCTIONS = `
📧 EmailJS Setup Instructions for Rifah Laboratories

To enable email functionality in your LIMS system, follow these steps:

1. 🚀 Create EmailJS Account
   - Go to https://www.emailjs.com/
   - Sign up for a free account
   - Verify your email address

2. 📧 Add Email Service
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Copy the Service ID

3. 📝 Create Email Templates
   - Go to "Email Templates"
   - Create two templates:
     a) Welcome Email Template (for new users)
     b) Security Alert Template (for admin notifications)
   - Copy the Template IDs

4. 🔑 Get Public Key
   - Go to "Account" → "API Keys"
   - Copy your Public Key

5. ⚙️ Configure Environment Variables
   Create a .env file in your project root with:
   
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_welcome_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_SECURITY_TEMPLATE_ID=your_security_template_id

6. 🔄 Restart Development Server
   - Stop your dev server
   - Run: npm run dev

7. ✅ Test Email Functionality
   - Go to Settings → Create User
   - Create a new user account
   - Check if welcome email is sent

📋 Template Variables for Welcome Email:
- to_email: {{to_email}}
- to_name: {{to_name}}
- subject: {{subject}}
- username: {{username}}
- password: {{password}}
- role: {{role}}
- login_url: {{login_url}}
- lab_name: {{lab_name}}
- lab_phone: {{lab_phone}}
- lab_email: {{lab_email}}
- lab_website: {{lab_website}}
- lab_address: {{lab_address}}
- created_date: {{created_date}}

📋 Template Variables for Security Alert:
- to_email: {{to_email}}
- subject: {{subject}}
- username: {{username}}
- password: {{password}}
- role: {{role}}
- user_email: {{user_email}}
- full_name: {{full_name}}
- created_date: {{created_date}}
- created_time: {{created_time}}

⚠️ Important Notes:
- Free EmailJS plan allows 200 emails/month
- For production use, consider upgrading to a paid plan
- Keep your API keys secure and never commit them to version control
- Test email functionality thoroughly before going live

🔧 Troubleshooting:
- If emails aren't sending, check browser console for errors
- Verify all environment variables are set correctly
- Ensure EmailJS service is properly configured
- Check spam folder for test emails
`;

// Fallback email function when EmailJS is not configured
export const sendFallbackEmail = async (
  toEmail: string,
  subject: string,
  message: string
): Promise<boolean> => {
  console.warn('📧 EmailJS not configured. Using fallback email function.');
  console.log('📧 Would send email to:', toEmail);
  console.log('📧 Subject:', subject);
  console.log('📧 Message:', message);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you could use a different email service here
  // For now, we'll just return true to simulate success
  return true;
}; 