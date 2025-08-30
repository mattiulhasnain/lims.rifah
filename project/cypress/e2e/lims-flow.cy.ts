/// <reference types="cypress" />

describe('LIMS Core Workflow Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should complete full LIMS workflow', () => {
    // Step 1: Create a new patient
    cy.contains('Patient Management').click();
    cy.contains('Add').click({ force: true });
    
    const patientName = 'Cypress Test Patient';
    const patientPhone = '03001234567';
    const patientAddress = 'Test Address';
    
    cy.get('input').filter('[type="text"]').first().type(patientName);
    cy.get('input').filter('[type="text"]').eq(1).type(patientPhone);
    cy.get('input').filter('[type="text"]').eq(2).type(patientAddress);
    cy.contains('button', 'Add Patient').click({ force: true });
    cy.contains('Patient added successfully', { timeout: 5000 });

    // Step 2: Navigate to Test Management
    cy.contains('Test Management').click();
    cy.contains('Test Management').should('be.visible');

    // Step 3: Create Invoice
    cy.contains('Invoice Management').click();
    cy.contains('Add').click({ force: true });
    
    // Select patient
    cy.get('select').first().select(1);
    
    // Add test
    cy.contains('Add Test').click();
    cy.get('select').filter(':visible').last().select(1);
    
    cy.contains('button', 'Save').click({ force: true });
    cy.contains('Invoice created successfully', { timeout: 5000 });

    // Step 4: Complete Test Report
    cy.contains('Reports').click();
    
    // Find first incomplete report
    cy.get('table').find('button').contains('Enter Results').should('exist');
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click(); // Enter results
    });

    // Enter a result and complete
    cy.get('table').find('input').first().type('10');
    cy.contains('button', 'Mark Completed').click();
    cy.contains('Report completed successfully', { timeout: 5000 });

    // Step 5: Verify Report
    cy.contains('Reports').click();
    cy.get('table tbody tr').first().within(() => {
      cy.get('button[title="Verify"]').click();
    });
    cy.contains('Verify').click();
    cy.contains('Download PDF').should('not.have.attr', 'disabled');
  });

  it('should handle patient search and filtering', () => {
    cy.contains('Patient Management').click();
    
    // Search for specific patient
    cy.get('input[placeholder*="search" i]').type('Test');
    cy.get('table tbody tr').should('have.length.at.least', 1);
    
    // Clear search
    cy.get('input[placeholder*="search" i]').clear();
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('should manage test categories', () => {
    cy.contains('Test Management').click();
    
    // Add new test category
    cy.contains('Add Category').click({ force: true });
    cy.get('input[name="categoryName"]').type('Cypress Test Category');
    cy.contains('button', 'Add Category').click();
    cy.contains('Category added successfully', { timeout: 5000 });
  });

  it('should generate and download reports', () => {
    cy.contains('Reports').click();
    
    // Generate report
    cy.contains('Generate Report').click();
    cy.get('select[name="reportType"]').select('Monthly Summary');
    cy.get('input[name="startDate"]').type('2024-01-01');
    cy.get('input[name="endDate"]').type('2024-12-31');
    cy.contains('button', 'Generate').click();
    
    cy.contains('Report generated successfully', { timeout: 10000 });
  });
}); 