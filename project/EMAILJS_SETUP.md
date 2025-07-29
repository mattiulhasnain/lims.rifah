# 📧 EmailJS Setup Guide for Rifah Laboratories LIMS

This guide will help you configure EmailJS to enable email functionality in your LIMS system.

## 🚀 Quick Setup

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account
- Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Copy the **Service ID**

### 3. Create Email Templates

#### Welcome Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Name it: `Welcome Email - Rifah Laboratories`
4. Use this HTML template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to {{lab_name}}</title>
</head>
<body>
    <h2>Welcome to {{lab_name}}!</h2>
    <p>Dear {{to_name}},</p>
    <p>Your account has been successfully created. Here are your login credentials:</p>
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Username:</strong> {{username}}</p>
        <p><strong>Password:</strong> {{password}}</p>
        <p><strong>Role:</strong> {{role}}</p>
        <p><strong>Login URL:</strong> <a href="{{login_url}}">{{login_url}}</a></p>
    </div>
    
    <p><strong>Account Created:</strong> {{created_date}}</p>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4>🔒 Security Reminders:</h4>
    <ul>
        <li>Keep your credentials confidential</li>
        <li>Change your password on first login</li>
            <li>Log out when you're done</li>
            <li>Contact IT support for any issues</li>
    </ul>
    </div>
    
    <p><strong>{{lab_name}}</strong><br>
    📞 {{lab_phone}} | 📧 {{lab_email}}<br>
    🌐 {{lab_website}}<br>
    📍 {{lab_address}}</p>
</body>
</html>
```

#### Security Alert Template
1. Create another template named: `Security Alert - Rifah Laboratories`
2. Use this HTML template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Security Alert - {{lab_name}}</title>
</head>
<body>
    <h2 style="color: #dc3545;">🚨 SECURITY ALERT</h2>
    <p>A new <strong>{{role}}</strong> account has been created in the Rifah Laboratories Management System.</p>
    
    <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4>⚠️ IMPORTANT SECURITY NOTIFICATION</h4>
        <p>This account has elevated privileges and should be monitored closely.</p>
    </div>
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4>New Account Details:</h4>
        <p><strong>Username:</strong> {{username}}</p>
        <p><strong>Password:</strong> {{password}}</p>
        <p><strong>Role:</strong> {{role}}</p>
        <p><strong>Email:</strong> {{user_email}}</p>
        <p><strong>Full Name:</strong> {{full_name}}</p>
        <p><strong>Created:</strong> {{created_date}} at {{created_time}}</p>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4>🔒 Security Recommendations:</h4>
        <ul>
            <li>Verify this account creation was authorized</li>
            <li>Monitor the account for unusual activity</li>
            <li>Ensure the user changes their password</li>
            <li>Review account permissions</li>
        </ul>
    </div>
    
    <p><strong>{{lab_name}} - Security Monitoring</strong></p>
</body>
</html>
```

### 4. Get API Keys
1. Go to **"Account"** → **"API Keys"**
2. Copy your **Public Key**

### 5. Configure Environment Variables
Create a `.env` file in your project root with:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_welcome_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SECURITY_TEMPLATE_ID=your_security_template_id_here

# Laboratory Information (optional)
VITE_LAB_NAME=Rifah Laboratories
VITE_LAB_ADDRESS=170- Hali Road Tehseel Chowk Sahiwal
VITE_LAB_PHONE=0404-220285
VITE_LAB_EMAIL=info@rifahlabs.com
VITE_LAB_WEBSITE=www.rifahlabs.com
```

**Important:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser. You can copy the `env.example` file to `.env` and fill in your actual values.

### 6. Restart Development Server
```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

### 7. Test Email Functionality
1. Go to **Settings** → **Create User**
2. Create a new user account
3. Check if welcome email is sent
4. Check browser console for any errors

## 📋 Template Variables Reference

### Welcome Email Variables
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient full name
- `{{subject}}` - Email subject
- `{{username}}` - New user's username
- `{{password}}` - New user's password
- `{{role}}` - User's role (admin, technician, etc.)
- `{{login_url}}` - System login URL
- `{{lab_name}}` - Laboratory name
- `{{lab_phone}}` - Laboratory phone
- `{{lab_email}}` - Laboratory email
- `{{lab_website}}` - Laboratory website
- `{{lab_address}}` - Laboratory address
- `{{created_date}}` - Account creation date

### Security Alert Variables
- `{{to_email}}` - Admin email address
- `{{subject}}` - Security alert subject
- `{{username}}` - New user's username
- `{{password}}` - New user's password
- `{{role}}` - User's role (UPPERCASE)
- `{{user_email}}` - New user's email
- `{{full_name}}` - New user's full name
- `{{created_date}}` - Account creation date
- `{{created_time}}` - Account creation time

## ⚠️ Important Notes

### Free Plan Limitations
- **200 emails/month** on free plan
- For production use, consider upgrading to a paid plan
- Monitor your email usage in EmailJS dashboard

### Security Best Practices
- Keep your API keys secure
- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys

### Troubleshooting

#### Emails Not Sending
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure EmailJS service is properly configured
4. Check spam folder for test emails
5. Verify template variables are correct

#### Common Errors
- **"Service not found"** - Check SERVICE_ID
- **"Template not found"** - Check TEMPLATE_ID
- **"Invalid public key"** - Check PUBLIC_KEY
- **"Rate limit exceeded"** - Upgrade to paid plan

#### Testing
- Use the **"Test"** button in EmailJS dashboard
- Check email delivery in your email provider
- Monitor EmailJS dashboard for delivery status

## 🔧 Advanced Configuration

### Custom Email Templates
You can customize the email templates by:
1. Editing the HTML in EmailJS dashboard
2. Adding your laboratory branding
3. Including additional security information
4. Customizing the styling

### Multiple Email Services
You can set up multiple email services for:
- Different types of notifications
- Backup email providers
- Regional email services

### Email Tracking
EmailJS provides:
- Delivery status tracking
- Open rate monitoring
- Click tracking (with paid plans)
- Analytics dashboard

## 📞 Support

If you need help with EmailJS setup:
1. Check EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. Contact EmailJS support
3. Check the LIMS system logs for errors
4. Verify all configuration steps

---

**Note:** This setup is required for full email functionality. Without EmailJS configuration, the system will use a fallback function that logs emails to the console instead of sending them. 