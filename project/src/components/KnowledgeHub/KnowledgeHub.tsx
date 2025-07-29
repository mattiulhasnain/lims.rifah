import React, { useState } from 'react';
import { 
  BookOpen, Search, FileText, Video, HelpCircle, 
  Users, Settings, TestTube,
  ChevronRight, ChevronDown, Download,
  Play, Clock, Star, Bookmark, Share2
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'faq' | 'video' | 'documentation' | 'troubleshooting';
  tags: string[];
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: Date;
  author: string;
  estimatedTime: string;
  isBookmarked?: boolean;
  isPopular?: boolean;
}

const KnowledgeHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const knowledgeItems: KnowledgeItem[] = [
    // Getting Started Guides
    {
      id: 'getting-started',
      title: 'Getting Started with LIMS',
      description: 'Complete guide to get you started with the Laboratory Information Management System',
      category: 'guide',
      tags: ['getting-started', 'basics', 'introduction'],
      content: `
# Getting Started with LIMS

Welcome to the Laboratory Information Management System (LIMS) for Rifah Laboratories. This guide will help you get started with the system.

## First Steps

1. **Login to the System**
   - Use your provided username and password
   - Contact your administrator if you need access

2. **Understand Your Role**
   - Different roles have different permissions
   - Check your dashboard for role-specific features

3. **Navigate the Interface**
   - Use the sidebar to access different modules
   - The dashboard provides an overview of your tasks

## Key Modules

- **Patients**: Register and manage patient information
- **Invoices**: Create and manage billing
- **Tests**: Manage test catalog and results
- **Reports**: Generate and verify laboratory reports
- **Analytics**: View business insights and trends

## Best Practices

- Always verify patient information before creating invoices
- Use the search and filter functions to find information quickly
- Save your work regularly
- Report any issues to your system administrator
      `,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-15'),
      author: 'System Admin',
      estimatedTime: '10 minutes',
      isPopular: true
    },

    // Workflow Guides
    {
      id: 'workflow-guide',
      title: 'Complete Workflow Guide',
      description: 'Step-by-step guide through the complete laboratory workflow',
      category: 'guide',
      tags: ['workflow', 'process', 'step-by-step'],
      content: `
# Complete Laboratory Workflow Guide

This guide walks you through the complete laboratory workflow from patient registration to report delivery.

## Workflow Overview

### 1. Patient Registration
- Register new patients with complete information
- Include medical history and allergies
- Generate unique patient IDs

### 2. Invoice Creation
- Select tests for the patient
- Apply any discounts
- Generate professional invoices with QR codes

### 3. Test Processing
- Enter test results in the Add Results area
- Handle critical results with proper acknowledgment
- Save drafts or complete results

### 4. Report Generation
- Generate laboratory reports
- Apply templates and formatting
- Include interpretations and comments

### 5. Verification Process
- Pathologist verification of reports
- Approve or return for corrections
- Lock reports after verification

### 6. Report Delivery
- Generate PDF reports
- Print or email to patients/doctors
- Maintain audit trail

## Critical Result Handling

When critical results are detected:
1. Acknowledge the critical nature
2. Add detailed comments
3. Ensure immediate notification
4. Follow up with appropriate personnel

## Quality Control

- Regular calibration of instruments
- Quality control testing
- Documentation of all procedures
- Continuous monitoring and improvement
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-20'),
      author: 'Quality Manager',
      estimatedTime: '15 minutes',
      isPopular: true
    },

    // Role-specific Guides
    {
      id: 'receptionist-guide',
      title: 'Receptionist User Guide',
      description: 'Complete guide for receptionist role in LIMS',
      category: 'guide',
      tags: ['receptionist', 'patient-registration', 'invoicing'],
      content: `
# Receptionist User Guide

As a receptionist, you are responsible for patient registration and invoice creation.

## Daily Tasks

### Patient Registration
1. **New Patient Registration**
   - Click "Patients" in the sidebar
   - Click "Add New Patient"
   - Fill in all required fields
   - Include medical history and allergies

2. **Existing Patient Lookup**
   - Use the search function
   - Filter by name, ID, or contact number
   - Update information as needed

### Invoice Creation
1. **Create New Invoice**
   - Click "Invoices" in the sidebar
   - Click "Create New Invoice"
   - Select patient (or register new one)
   - Add tests and quantities
   - Apply discounts if applicable
   - Generate invoice

2. **Payment Processing**
   - Record payments received
   - Update payment status
   - Generate receipts

## Best Practices

- Always verify patient information
- Double-check test selections
- Maintain accurate payment records
- Keep patient information confidential
- Report any issues immediately
      `,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-18'),
      author: 'Training Team',
      estimatedTime: '12 minutes'
    },

    {
      id: 'technician-guide',
      title: 'Technician User Guide',
      description: 'Complete guide for laboratory technicians',
      category: 'guide',
      tags: ['technician', 'test-processing', 'results-entry'],
      content: `
# Technician User Guide

As a laboratory technician, you are responsible for test processing and result entry.

## Key Responsibilities

### Test Processing
1. **Access Pending Tests**
   - Go to "Add Results" in the sidebar
   - View pending tests for the day
   - Prioritize urgent or critical tests

2. **Result Entry**
   - Click "Add/Edit Result" for each test
   - Enter accurate results
   - Include units and reference ranges
   - Flag abnormal or critical results

3. **Critical Result Handling**
   - Acknowledge critical results
   - Add detailed comments
   - Ensure immediate notification
   - Follow established protocols

### Quality Control
- Perform daily quality control tests
- Document control results
- Report any out-of-range controls
- Maintain instrument calibration records

## Best Practices

- Always verify patient and test information
- Enter results accurately and completely
- Handle critical results with urgency
- Maintain quality control standards
- Document any issues or deviations
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-19'),
      author: 'Lab Manager',
      estimatedTime: '10 minutes'
    },

    {
      id: 'pathologist-guide',
      title: 'Pathologist User Guide',
      description: 'Complete guide for pathologist verification process',
      category: 'guide',
      tags: ['pathologist', 'verification', 'reports'],
      content: `
# Pathologist User Guide

As a pathologist, you are responsible for report verification and interpretation.

## Verification Process

### Review Reports
1. **Access Reports for Verification**
   - Go to "Report Verification" in the sidebar
   - View completed reports awaiting verification
   - Review test results and interpretations

2. **Report Verification**
   - Review all test results
   - Check for accuracy and completeness
   - Verify interpretations
   - Add comments if needed

3. **Decision Making**
   - **Approve**: Report is accurate and complete
   - **Return for Correction**: Issues found, needs revision
   - **Add Comments**: Provide additional information

### Critical Results Review
- Review all critical results
- Ensure proper handling and documentation
- Verify notification procedures were followed
- Add clinical interpretations as needed

## Best Practices

- Thoroughly review all results
- Pay special attention to critical values
- Provide clear and accurate interpretations
- Maintain high standards of quality
- Document any concerns or recommendations
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-21'),
      author: 'Chief Pathologist',
      estimatedTime: '8 minutes'
    },

    {
      id: 'manager-guide',
      title: 'Manager User Guide',
      description: 'Complete guide for laboratory managers and supervisors',
      category: 'guide',
      tags: ['manager', 'supervision', 'administration'],
      content: `
# Manager User Guide

As a laboratory manager, you oversee operations and ensure quality standards.

## Key Responsibilities

### Staff Management
1. **User Management**
   - Create and manage user accounts
   - Assign appropriate roles and permissions
   - Monitor staff activity and performance

2. **Quality Control**
   - Review quality control reports
   - Monitor instrument calibration
   - Ensure compliance with standards

### Operational Oversight
1. **Dashboard Monitoring**
   - Review daily statistics and trends
   - Monitor pending reports and critical results
   - Track laboratory performance metrics

2. **Report Management**
   - Oversee report verification process
   - Handle escalated issues
   - Ensure timely report delivery

### Administrative Tasks
1. **Settings Management**
   - Configure laboratory information
   - Manage test catalogs and pricing
   - Set up backup and security settings

2. **Analytics Review**
   - Analyze business performance
   - Review financial reports
   - Monitor quality metrics

## Best Practices

- Regular staff training and development
- Continuous quality improvement
- Effective communication with staff
- Data-driven decision making
- Compliance with regulatory requirements
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-22'),
      author: 'Lab Director',
      estimatedTime: '12 minutes'
    },

    {
      id: 'accountant-guide',
      title: 'Accountant User Guide',
      description: 'Complete guide for financial management and billing',
      category: 'guide',
      tags: ['accountant', 'billing', 'finance'],
      content: `
# Accountant User Guide

As an accountant, you manage financial aspects and billing operations.

## Key Responsibilities

### Invoice Management
1. **Invoice Processing**
   - Review and approve invoices
   - Handle payment processing
   - Manage discounts and adjustments

2. **Financial Reporting**
   - Generate financial reports
   - Track revenue and expenses
   - Monitor payment collections

### Rate Management
1. **Rate List Management**
   - Update test pricing
   - Create special rate lists
   - Manage bulk pricing changes

2. **Expense Tracking**
   - Record laboratory expenses
   - Categorize expenses
   - Generate expense reports

### Analytics and Reporting
1. **Financial Analytics**
   - Review revenue trends
   - Analyze profit margins
   - Monitor financial performance

2. **Audit Support**
   - Maintain financial records
   - Support audit processes
   - Ensure compliance

## Best Practices

- Accurate financial record keeping
- Regular reconciliation of accounts
- Timely financial reporting
- Compliance with accounting standards
- Effective communication with management
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-23'),
      author: 'Finance Manager',
      estimatedTime: '10 minutes'
    },

    // FAQs
    {
      id: 'faq-general',
      title: 'General FAQ',
      description: 'Frequently asked questions about LIMS usage',
      category: 'faq',
      tags: ['faq', 'general', 'common-questions'],
      content: `
# Frequently Asked Questions

## General Questions

### Q: How do I reset my password?
A: Contact your system administrator to reset your password. They can provide you with a new temporary password.

### Q: Can I access LIMS from home?
A: LIMS access is typically restricted to the laboratory network for security reasons. Contact your IT department for remote access options.

### Q: How do I report a bug or issue?
A: Use the "Report Issue" feature in the system or contact your system administrator directly.

### Q: Can I export data from LIMS?
A: Yes, most modules have export functionality. Look for the export button in each section.

### Q: How do I search for specific information?
A: Use the search bars and filters available in each module. You can search by patient name, test name, date, etc.

## Technical Questions

### Q: What browsers are supported?
A: LIMS works best with Chrome, Firefox, Safari, and Edge. Make sure you're using the latest version.

### Q: How do I print reports?
A: Use the print button in the report viewer, or download as PDF and print from there.

### Q: Can I customize the interface?
A: Some customization options are available in the Settings section, including theme preferences.

## Workflow Questions

### Q: What should I do if I make a mistake?
A: Most actions can be corrected. If you can't undo an action, contact your supervisor or administrator.

### Q: How do I handle critical results?
A: Critical results require immediate acknowledgment and comments. Follow the prompts in the system.

### Q: What's the difference between draft and complete?
A: Draft saves your work without finalizing it. Complete finalizes the result and moves it to the next workflow step.
      `,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-22'),
      author: 'Support Team',
      estimatedTime: '5 minutes',
      isPopular: true
    },

    {
      id: 'faq-billing',
      title: 'Billing & Finance FAQ',
      description: 'Common questions about invoicing and financial management',
      category: 'faq',
      tags: ['faq', 'billing', 'finance', 'invoices'],
      content: `
# Billing & Finance FAQ

## Invoice Questions

### Q: How do I create an invoice?
A: Go to Invoices → Create New Invoice → Select patient → Add tests → Apply discounts → Generate invoice.

### Q: Can I edit an invoice after creation?
A: Yes, until it's locked. Once locked, contact your administrator for changes.

### Q: How do I apply discounts?
A: Use the discount field when creating invoices. You can apply percentage or fixed amount discounts.

### Q: What payment methods are accepted?
A: Cash, card, bank transfer, and mobile payments are supported.

## Rate List Questions

### Q: How do I update test prices?
A: Go to Rate Lists → Select rate list → Edit prices → Save changes.

### Q: Can I create different rates for different doctors?
A: Yes, you can create custom rate lists for specific doctors or groups.

### Q: How do I import test prices from Excel?
A: Use the import function in Rate List Management with CSV format.

## Financial Reports

### Q: How do I generate financial reports?
A: Go to Analytics → Financial Reports → Select date range → Generate report.

### Q: Can I export financial data?
A: Yes, all financial reports can be exported to Excel or PDF format.

### Q: How do I track outstanding payments?
A: Check the Invoices section with "Pending" status filter.
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-24'),
      author: 'Finance Team',
      estimatedTime: '6 minutes'
    },

    {
      id: 'faq-quality',
      title: 'Quality Control FAQ',
      description: 'Questions about quality control and laboratory standards',
      category: 'faq',
      tags: ['faq', 'quality-control', 'qc', 'standards'],
      content: `
# Quality Control FAQ

## QC Testing

### Q: How often should I run QC tests?
A: Daily for critical tests, weekly for routine tests, or as per your laboratory's SOP.

### Q: What should I do if QC is out of range?
A: Stop testing, investigate the cause, recalibrate if needed, and document the incident.

### Q: How do I record QC results?
A: Go to Quality Control → Add QC Record → Enter control values → Save.

### Q: Can I set up QC alerts?
A: Yes, configure alert thresholds in the QC settings for automatic notifications.

## Calibration

### Q: How often should instruments be calibrated?
A: Follow manufacturer recommendations, typically monthly or after maintenance.

### Q: What documentation is required for calibration?
A: Date, time, operator, calibration values, and verification results.

### Q: How do I schedule calibration reminders?
A: Set up calendar reminders or use the QC management system alerts.

## Compliance

### Q: What QC documentation is required for audits?
A: QC logs, calibration records, corrective action reports, and proficiency testing results.

### Q: How long should I keep QC records?
A: Minimum 2 years, but check your local regulatory requirements.

### Q: How do I handle QC failures?
A: Document the failure, investigate root cause, take corrective action, and verify resolution.
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-25'),
      author: 'Quality Manager',
      estimatedTime: '7 minutes'
    },

    // Troubleshooting
    {
      id: 'troubleshooting-common',
      title: 'Common Issues and Solutions',
      description: 'Solutions for common problems encountered in LIMS',
      category: 'troubleshooting',
      tags: ['troubleshooting', 'problems', 'solutions'],
      content: `
# Common Issues and Solutions

## Login Issues

### Problem: Can't log in
**Solution:**
1. Check your username and password
2. Ensure Caps Lock is off
3. Clear browser cache and cookies
4. Try a different browser
5. Contact administrator if problem persists

### Problem: Session expired
**Solution:**
1. Simply log in again
2. Your work should be saved automatically
3. Check for any unsaved changes

## Data Entry Issues

### Problem: Can't save results
**Solution:**
1. Check if all required fields are filled
2. Verify data format (numbers, dates, etc.)
3. Check for validation errors
4. Try refreshing the page
5. Contact support if issue continues

### Problem: Search not working
**Solution:**
1. Check spelling of search terms
2. Try different search criteria
3. Clear filters and try again
4. Use partial matches

## Performance Issues

### Problem: System is slow
**Solution:**
1. Close unnecessary browser tabs
2. Clear browser cache
3. Check internet connection
4. Try refreshing the page
5. Contact IT if problem persists

### Problem: Reports not loading
**Solution:**
1. Check if you have proper permissions
2. Verify the report exists
3. Try generating the report again
4. Contact administrator

## Print Issues

### Problem: Can't print reports
**Solution:**
1. Check printer connection
2. Verify printer settings
3. Try downloading as PDF first
4. Check browser print settings
5. Contact IT support

## Critical Result Issues

### Problem: Critical result not flagged
**Solution:**
1. Check if result contains "critical" keyword
2. Verify result format
3. Manually flag if needed
4. Contact supervisor

### Problem: Can't acknowledge critical result
**Solution:**
1. Ensure you're logged in with proper permissions
2. Add required comments
3. Check all required fields
4. Contact administrator if blocked
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-23'),
      author: 'IT Support',
      estimatedTime: '8 minutes'
    },

    {
      id: 'troubleshooting-reports',
      title: 'Report Generation Issues',
      description: 'Solutions for report generation and printing problems',
      category: 'troubleshooting',
      tags: ['troubleshooting', 'reports', 'printing', 'pdf'],
      content: `
# Report Generation Issues

## PDF Generation Problems

### Problem: PDF not generating
**Solution:**
1. Check if all required fields are completed
2. Verify patient information is complete
3. Ensure test results are entered
4. Try refreshing the page
5. Contact support if issue persists

### Problem: PDF is corrupted or incomplete
**Solution:**
1. Try generating the report again
2. Check browser compatibility
3. Clear browser cache
4. Try a different browser
5. Contact IT support

### Problem: Report template not loading
**Solution:**
1. Check template settings
2. Verify template file exists
3. Contact administrator to check template configuration
4. Use default template temporarily

## Print Issues

### Problem: Print layout is incorrect
**Solution:**
1. Check page setup settings
2. Verify printer settings
3. Try different paper sizes
4. Use landscape orientation if needed
5. Contact IT for printer configuration

### Problem: Fonts not displaying correctly
**Solution:**
1. Check if fonts are installed on system
2. Try using standard fonts
3. Update browser to latest version
4. Contact IT for font installation

## Data Issues

### Problem: Test results not appearing in report
**Solution:**
1. Verify results are saved and completed
2. Check if results are verified (if required)
3. Ensure proper test selection
4. Contact technician if results missing

### Problem: Patient information incorrect in report
**Solution:**
1. Verify patient details in patient management
2. Check if correct patient is selected
3. Update patient information if needed
4. Regenerate report after corrections
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-26'),
      author: 'IT Support',
      estimatedTime: '10 minutes'
    },

    {
      id: 'troubleshooting-data',
      title: 'Data Management Issues',
      description: 'Solutions for data entry, import, and export problems',
      category: 'troubleshooting',
      tags: ['troubleshooting', 'data', 'import', 'export'],
      content: `
# Data Management Issues

## Import Problems

### Problem: CSV import failing
**Solution:**
1. Check CSV file format and headers
2. Verify data types match expected format
3. Remove special characters from data
4. Check file encoding (UTF-8 recommended)
5. Contact support for file format issues

### Problem: Duplicate data after import
**Solution:**
1. Check for existing records before import
2. Use update mode instead of insert
3. Clean data before import
4. Verify import settings
5. Contact administrator for data cleanup

## Export Issues

### Problem: Export file is empty
**Solution:**
1. Check if data exists in the system
2. Verify export filters and date range
3. Ensure proper permissions for data access
4. Try different export formats
5. Contact support if issue persists

### Problem: Export format not supported
**Solution:**
1. Use supported formats (CSV, Excel, PDF)
2. Check browser compatibility
3. Try different export method
4. Contact IT for format support

## Data Entry Issues

### Problem: Can't save patient data
**Solution:**
1. Check required fields are completed
2. Verify data format (phone, email, etc.)
3. Check for duplicate patient records
4. Ensure proper permissions
5. Contact administrator if blocked

### Problem: Test results not saving
**Solution:**
1. Verify all required fields are filled
2. Check result format and units
3. Ensure test is properly selected
4. Try saving as draft first
5. Contact technician if issue persists

## Backup and Restore

### Problem: Backup not completing
**Solution:**
1. Check available disk space
2. Verify backup location permissions
3. Try manual backup instead of automatic
4. Contact IT for backup configuration
5. Check system resources

### Problem: Restore not working
**Solution:**
1. Verify backup file integrity
2. Check restore permissions
3. Ensure compatible backup version
4. Contact administrator for restore
5. Verify system requirements
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-27'),
      author: 'Database Admin',
      estimatedTime: '12 minutes'
    },

    // Video Tutorials
    {
      id: 'video-basics',
      title: 'LIMS Basics Video Tutorial',
      description: 'Video guide covering the basics of LIMS usage',
      category: 'video',
      tags: ['video', 'tutorial', 'basics'],
      content: `
# LIMS Basics Video Tutorial

## Video Overview
This video covers the fundamental aspects of using the LIMS system.

## Topics Covered
- System navigation
- Patient registration
- Invoice creation
- Basic result entry
- Report generation

## Video Duration: 15 minutes

## Key Points
1. **Navigation**: Learn how to move between different modules
2. **Patient Management**: Understand patient registration process
3. **Billing**: Create and manage invoices
4. **Results**: Enter and manage test results
5. **Reports**: Generate and view reports

## Follow-up Resources
- Complete Workflow Guide
- Role-specific guides
- FAQ section

*Note: This video is available in the training section. Contact your administrator for access.*
      `,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-24'),
      author: 'Training Team',
      estimatedTime: '15 minutes',
      isPopular: true
    },

    {
      id: 'video-advanced',
      title: 'Advanced LIMS Features',
      description: 'Video tutorial covering advanced LIMS functionality',
      category: 'video',
      tags: ['video', 'tutorial', 'advanced', 'features'],
      content: `
# Advanced LIMS Features Video Tutorial

## Video Overview
This video covers advanced features and techniques for power users.

## Topics Covered
- Advanced search and filtering
- Bulk operations
- Custom templates
- Analytics and reporting
- Quality control management

## Video Duration: 20 minutes

## Key Points
1. **Advanced Search**: Master complex search queries
2. **Bulk Operations**: Process multiple records efficiently
3. **Templates**: Create and customize report templates
4. **Analytics**: Understand business intelligence features
5. **Quality Control**: Manage QC processes effectively

## Advanced Techniques
- Keyboard shortcuts for faster navigation
- Custom filters and saved searches
- Template customization
- Data export and import
- Performance optimization

*Note: This video is available in the training section. Contact your administrator for access.*
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-25'),
      author: 'Training Team',
      estimatedTime: '20 minutes'
    },

    {
      id: 'video-quality',
      title: 'Quality Control Management',
      description: 'Video guide for quality control procedures',
      category: 'video',
      tags: ['video', 'tutorial', 'quality-control', 'qc'],
      content: `
# Quality Control Management Video Tutorial

## Video Overview
This video covers quality control procedures and best practices.

## Topics Covered
- QC test procedures
- Calibration processes
- Control chart interpretation
- Corrective actions
- Documentation requirements

## Video Duration: 18 minutes

## Key Points
1. **QC Testing**: Proper QC test execution
2. **Calibration**: Instrument calibration procedures
3. **Control Charts**: Understanding QC trends
4. **Corrective Actions**: Handling QC failures
5. **Documentation**: Proper record keeping

## Best Practices
- Daily QC procedures
- Calibration schedules
- Out-of-control handling
- Documentation standards
- Regulatory compliance

*Note: This video is available in the training section. Contact your administrator for access.*
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-26'),
      author: 'Quality Manager',
      estimatedTime: '18 minutes'
    },

    // Documentation
    {
      id: 'system-documentation',
      title: 'System Documentation',
      description: 'Technical documentation for LIMS system',
      category: 'documentation',
      tags: ['documentation', 'technical', 'system'],
      content: `
# LIMS System Documentation

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Data Storage**: Local Storage (demo mode)
- **PDF Generation**: jsPDF + html2canvas
- **Data Processing**: Client-side processing

## Data Models

### Core Entities
- **Patients**: Patient information and medical history
- **Doctors**: Healthcare provider information
- **Tests**: Laboratory test definitions
- **Invoices**: Billing and payment records
- **Reports**: Test results and interpretations
- **Users**: System users and permissions

### Workflow States
- **Pending**: Initial state for reports
- **In Progress**: Results being entered
- **Completed**: All results entered
- **Verified**: Pathologist verification complete
- **Locked**: Final state, no further changes

## Security Features

### Authentication
- Role-based access control
- Session management
- Permission-based feature access

### Audit Trail
- Complete action logging
- User accountability
- Timestamp tracking
- IP address logging

## Performance Considerations

### Optimization
- Efficient data filtering
- Pagination for large datasets
- Optimized search algorithms
- Minimal re-renders

### Caching
- Local storage for data persistence
- Browser caching for static assets
- Optimized bundle sizes

## Integration Points

### External Systems
- PDF generation for reports
- QR code generation for invoices
- Excel export functionality
- Print integration

### Data Import/Export
- CSV import for test lists
- Excel export for reports
- PDF generation for documents
- Data backup and restore
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-25'),
      author: 'Development Team',
      estimatedTime: '20 minutes'
    },

    {
      id: 'api-documentation',
      title: 'API Documentation',
      description: 'Technical API documentation for system integration',
      category: 'documentation',
      tags: ['documentation', 'api', 'integration', 'technical'],
      content: `
# API Documentation

## Overview
This document describes the API endpoints and data structures for LIMS integration.

## Authentication
All API requests require authentication using JWT tokens.

### Headers
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

## Endpoints

### Patients
- **GET /api/patients** - List all patients
- **POST /api/patients** - Create new patient
- **GET /api/patients/{id}** - Get patient details
- **PUT /api/patients/{id}** - Update patient
- **DELETE /api/patients/{id}** - Delete patient

### Tests
- **GET /api/tests** - List all tests
- **POST /api/tests** - Create new test
- **GET /api/tests/{id}** - Get test details
- **PUT /api/tests/{id}** - Update test

### Reports
- **GET /api/reports** - List all reports
- **POST /api/reports** - Create new report
- **GET /api/reports/{id}** - Get report details
- **PUT /api/reports/{id}** - Update report

## Data Models

### Patient Model
\`\`\`json
{
  "id": "string",
  "name": "string",
  "age": "number",
  "gender": "string",
  "contact": "string",
  "address": "string"
}
\`\`\`

### Test Model
\`\`\`json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "price": "number",
  "normalRange": "string"
}
\`\`\`

## Error Handling
All errors return appropriate HTTP status codes and error messages.

### Common Error Codes
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error
      `,
      difficulty: 'advanced',
      lastUpdated: new Date('2024-01-28'),
      author: 'Development Team',
      estimatedTime: '25 minutes'
    },

    {
      id: 'deployment-guide',
      title: 'Deployment Guide',
      description: 'Step-by-step guide for deploying LIMS system',
      category: 'documentation',
      tags: ['documentation', 'deployment', 'installation', 'setup'],
      content: `
# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser
- Internet connection for dependencies

## Installation Steps

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-repo/lims.git
cd lims
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Create \`.env\` file with required variables:
\`\`\`
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Rifah Laboratories LIMS
\`\`\`

### 4. Build Application
\`\`\`bash
npm run build
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

## Production Deployment

### 1. Build for Production
\`\`\`bash
npm run build
\`\`\`

### 2. Deploy to Web Server
Upload \`dist\` folder contents to your web server.

### 3. Configure Web Server
Set up proper routing for SPA (Single Page Application).

## Configuration

### Environment Variables
- **VITE_API_URL**: Backend API URL
- **VITE_APP_NAME**: Application name
- **VITE_VERSION**: Application version

### Security Considerations
- Enable HTTPS in production
- Configure proper CORS settings
- Set up authentication properly
- Regular security updates

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version and dependencies
2. **Runtime errors**: Verify environment variables
3. **Performance issues**: Optimize bundle size and caching
4. **Security issues**: Review security configuration
      `,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-29'),
      author: 'DevOps Team',
      estimatedTime: '15 minutes'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'guide', name: 'Guides', icon: <FileText className="w-4 h-4" /> },
    { id: 'faq', name: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'video', name: 'Video Tutorials', icon: <Video className="w-4 h-4" /> },
    { id: 'documentation', name: 'Documentation', icon: <Settings className="w-4 h-4" /> },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    const matchesBookmarks = !showBookmarksOnly || bookmarkedItems.has(item.id);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesBookmarks;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleBookmark = (itemId: string) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(itemId)) {
      newBookmarks.delete(itemId);
    } else {
      newBookmarks.add(itemId);
    }
    setBookmarkedItems(newBookmarks);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'faq': return 'bg-purple-100 text-purple-800';
      case 'video': return 'bg-orange-100 text-orange-800';
      case 'documentation': return 'bg-gray-100 text-gray-800';
      case 'troubleshooting': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
            <p className="text-gray-600">Find answers, guides, and resources for using LIMS</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                showBookmarksOnly 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredItems.length} articles found</span>
            <div className="flex items-center space-x-4">
              <span>Popular articles are marked with a star</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    {item.isPopular && <Star className="w-5 h-5 text-yellow-500" />}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-lg ${
                      bookmarkedItems.has(item.id)
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedItems.has(item.id) && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="prose max-w-none print-friendly">
                    <div 
                      className="text-gray-700 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{
                        __html: item.content
                          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">$1</h1>')
                          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mb-4 mt-8 text-blue-600">$1</h2>')
                          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-gray-900 mb-3 mt-6 text-gray-800">$1</h3>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
                          .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 flex items-start"><span class="text-blue-500 mr-2 mt-1">•</span><span>$1</span></li>')
                          .replace(/^1\. (.*$)/gim, '<li class="ml-6 mb-2 flex items-start"><span class="text-blue-500 mr-2 mt-1 font-medium">$&</span></li>')
                          .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-7">')
                          .replace(/^([^<].*)/gm, '<p class="mb-4 text-gray-700 leading-7">$1</p>')
                          .replace(/<p class="mb-4 text-gray-700 leading-7"><\/p>/g, '')
                          .replace(/<p class="mb-4 text-gray-700 leading-7"><h1/g, '<h1')
                          .replace(/<p class="mb-4 text-gray-700 leading-7"><h2/g, '<h2')
                          .replace(/<p class="mb-4 text-gray-700 leading-7"><h3/g, '<h3')
                          .replace(/<p class="mb-4 text-gray-700 leading-7"><li/g, '<ul class="mb-6 space-y-2"><li')
                          .replace(/<\/li>\n<li/g, '</li><li')
                          .replace(/<\/li>\n<p class="mb-4 text-gray-700 leading-7">/g, '</li></ul><p class="mb-4 text-gray-700 leading-7">')
                          .replace(/<\/li>\n<h/g, '</li></ul><h')
                          .replace(/```(.*?)```/g, '<div class="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500 my-4"><code class="text-sm font-mono text-gray-800">$1</code></div>')
                          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Last updated: {item.lastUpdated.toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.category === 'video' && (
                        <button 
                          onClick={() => {
                            // In a real implementation, this would open a video player
                            alert(`Video tutorial: ${item.title}\n\nThis would open the video player in a real implementation.`);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Play className="w-4 h-4" />
                          <span>Watch Video</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          if (printWindow) {
                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>${item.title} - LIMS Knowledge Hub</title>
                                  <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                                    h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
                                    h2 { color: #2563eb; margin-top: 30px; }
                                    h3 { color: #374151; margin-top: 20px; }
                                    strong { font-weight: bold; }
                                    em { font-style: italic; }
                                    ul { margin: 10px 0; }
                                    li { margin: 5px 0; }
                                    code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
                                    .header { text-align: center; margin-bottom: 30px; }
                                    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
                                    @media print { body { margin: 0; } }
                                  </style>
                                </head>
                                <body>
                                  <div class="header">
                                    <h1>${item.title}</h1>
                                    <p><strong>Category:</strong> ${categories.find(c => c.id === item.category)?.name}</p>
                                    <p><strong>Difficulty:</strong> ${item.difficulty}</p>
                                    <p><strong>Author:</strong> ${item.author}</p>
                                    <p><strong>Last Updated:</strong> ${item.lastUpdated.toLocaleDateString()}</p>
                                  </div>
                                  <div class="content">
                                    ${item.content
                                      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                      .replace(/^- (.*$)/gim, '<li>$1</li>')
                                      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
                                      .replace(/\n\n/g, '</p><p>')
                                      .replace(/^([^<].*)/gm, '<p>$1</p>')
                                      .replace(/```(.*?)```/g, '<code>$1</code>')
                                      .replace(/`(.*?)`/g, '<code>$1</code>')
                                    }
                                  </div>
                                  <div class="footer">
                                    <p>Generated from LIMS Knowledge Hub - Rifah Laboratories</p>
                                    <p>Generated on: ${new Date().toLocaleString()}</p>
                                  </div>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Print</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          // Create a clean text version for download
                          const cleanContent = item.content
                            .replace(/^# (.*$)/gim, '$1\n')
                            .replace(/^## (.*$)/gim, '\n$1\n')
                            .replace(/^### (.*$)/gim, '\n$1\n')
                            .replace(/\*\*(.*?)\*\*/g, '$1')
                            .replace(/\*(.*?)\*/g, '$1')
                            .replace(/^- (.*$)/gim, '• $1')
                            .replace(/^1\. (.*$)/gim, '$&')
                            .replace(/```(.*?)```/g, '$1')
                            .replace(/`(.*?)`/g, '$1');
                          
                          const blob = new Blob([
                            `${item.title}\n` +
                            `Category: ${categories.find(c => c.id === item.category)?.name}\n` +
                            `Difficulty: ${item.difficulty}\n` +
                            `Author: ${item.author}\n` +
                            `Last Updated: ${item.lastUpdated.toLocaleDateString()}\n` +
                            `\n${'='.repeat(50)}\n\n` +
                            cleanContent +
                            `\n\n${'='.repeat(50)}\n` +
                            `Generated from LIMS Knowledge Hub - Rifah Laboratories\n` +
                            `Generated on: ${new Date().toLocaleString()}`
                          ], { type: 'text/plain' });
                          
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download TXT</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            No articles found
          </div>
          <div className="text-gray-500">
            Try adjusting your search criteria or filters
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              alert('Contact Support\n\nEmail: support@rifahlabs.com\nPhone: 0404-220285\nWhatsApp: 0320-3655101');
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Contact Support</div>
                <div className="text-sm text-gray-500">Get help from our team</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setSelectedCategory('video');
              setSearchTerm('');
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Training Videos</div>
                <div className="text-sm text-gray-500">Watch video tutorials</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              alert('Download Manual\n\nThis would download the complete user manual in PDF format.');
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Download Manual</div>
                <div className="text-sm text-gray-500">Complete user manual</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => window.location.hash = '#diagnostic-knowledge'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TestTube className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Diagnostic Reference</div>
                <div className="text-sm text-gray-500">Test ranges & interpretation</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub; 