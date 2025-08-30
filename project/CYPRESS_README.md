# Cypress Testing Guide for LIMS System

This document provides comprehensive information about setting up and running Cypress tests for the Laboratory Information Management System (LIMS).

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- The LIMS application running on `http://localhost:5173`

### Installation
Cypress is already installed as a development dependency. If you need to reinstall:

```bash
npm install --save-dev cypress @testing-library/cypress
```

## 📁 Test Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── authentication.cy.ts    # Login/logout tests
│   ├── dashboard.cy.ts         # Dashboard functionality tests
│   ├── patient-management.cy.ts # Patient CRUD operations
│   ├── invoice-management.cy.ts # Invoice management tests
│   ├── test-management.cy.ts   # Test management tests
│   ├── navigation.cy.ts        # Sidebar and routing tests
│   └── lims-flow.cy.ts         # Complete workflow tests
├── fixtures/              # Test data
│   └── testData.json     # Sample data for tests
├── support/               # Support files
│   └── e2e.ts            # Custom commands and setup
└── cypress.config.ts     # Cypress configuration
```

## 🧪 Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cy:open
```

### Run Tests in Headless Mode
```bash
npm run cy:run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/authentication.cy.ts"
```

### Run Tests with Specific Browser
```bash
npx cypress run --browser chrome
```

## 🔧 Configuration

The Cypress configuration (`cypress.config.ts`) includes:

- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Viewport**: 1280x720 (desktop)
- **Timeouts**: 10 seconds for commands and requests
- **Screenshots**: Enabled on test failures
- **Component Testing**: Configured for React + Vite

## 📊 Test Data

Test data is stored in `cypress/fixtures/testData.json` and includes:

- **Users**: Admin, receptionist, and student accounts
- **Patients**: Sample patient records
- **Tests**: Sample laboratory tests
- **Doctors**: Sample doctor records

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Adm1n!2024#Secure |
| Receptionist | receptionist | Rec3pt!on2024$ |
| Student | student | Stud3nt!2024@ |

## 🎯 Test Categories

### 1. Authentication Tests (`authentication.cy.ts`)
- Login/logout functionality
- Credential validation
- Session management
- Error handling

### 2. Dashboard Tests (`dashboard.cy.ts`)
- Key metrics display
- Quick actions
- Charts and graphs
- Responsive layout

### 3. Patient Management Tests (`patient-management.cy.ts`)
- CRUD operations
- Search and filtering
- Form validation
- Data persistence

### 4. Invoice Management Tests (`invoice-management.cy.ts`)
- Invoice creation
- Test selection
- Total calculation
- PDF generation

### 5. Test Management Tests (`test-management.cy.ts`)
- Test CRUD operations
- Category management
- Import/export functionality
- Price management

### 6. Navigation Tests (`navigation.cy.ts`)
- Sidebar functionality
- Routing
- Breadcrumbs
- Responsive behavior

### 7. Complete Workflow Tests (`lims-flow.cy.ts`)
- End-to-end patient journey
- Test ordering and completion
- Report generation
- Verification process

## 🛠️ Custom Commands

The support file (`cypress/support/e2e.ts`) includes custom commands:

```typescript
// Login helper
cy.login(username, password)

// Navigation helper
cy.navigateToTab(tabName)

// Patient creation helper
cy.createTestPatient(patientData)

// Invoice creation helper
cy.createTestInvoice(patientName, testName)

// Report completion helper
cy.completeTestReport()

// Report verification helper
cy.verifyTestReport()
```

## 📱 Responsive Testing

Tests include responsive behavior validation:

```typescript
// Test different viewport sizes
cy.viewport(1280, 720);  // Desktop
cy.viewport(768, 1024);  // Tablet
cy.viewport(375, 667);   // Mobile
```

## 🔍 Best Practices

### 1. Test Isolation
- Each test is independent
- `beforeEach` hooks handle setup
- `afterEach` hooks handle cleanup

### 2. Selector Strategy
- Use semantic selectors when possible
- Prefer `data-testid` attributes
- Avoid brittle selectors (class names, text content)

### 3. Assertions
- Use explicit assertions
- Check both positive and negative cases
- Validate UI state and data

### 4. Error Handling
- Test error scenarios
- Validate error messages
- Test edge cases

## 🚨 Common Issues & Solutions

### 1. Element Not Found
- Check if element is visible
- Use `{ force: true }` for hidden elements
- Verify element exists before interaction

### 2. Timing Issues
- Use appropriate timeouts
- Wait for elements to be visible
- Use `cy.wait()` sparingly

### 3. Authentication Issues
- Ensure correct credentials
- Check session state
- Clear cookies/localStorage if needed

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run cy:run
```

### Docker Support
```dockerfile
FROM cypress/included:13.7.3
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "cy:run"]
```

## 🔧 Debugging

### Debug Mode
```bash
npx cypress open --config video=true
```

### Console Logs
```typescript
cy.log('Debug information');
console.log('Additional debug info');
```

### Screenshots
Screenshots are automatically taken on test failures and saved to `cypress/screenshots/`.

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library for Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [React Testing with Cypress](https://docs.cypress.io/guides/component-testing/react-overview)

## 🤝 Contributing

When adding new tests:

1. Follow the existing naming convention
2. Include proper TypeScript types
3. Add test data to fixtures if needed
4. Update this README with new test information
5. Ensure tests are isolated and reliable

## 📞 Support

For issues related to Cypress testing:

1. Check the Cypress documentation
2. Review existing test patterns
3. Check console logs and screenshots
4. Verify test data and environment setup 