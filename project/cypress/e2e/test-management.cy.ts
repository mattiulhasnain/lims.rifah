/// <reference types="cypress" />

describe('Test Management Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should navigate to test management', () => {
    cy.contains('Test Management').click();
    cy.contains('Test Management').should('be.visible');
  });

  it('should add a new test', () => {
    cy.contains('Test Management').click();
    cy.contains('Add').click({ force: true });
    
    // Fill test form
    cy.get('input[name="name"]').type('Cypress Test');
    cy.get('input[name="code"]').type('CT001');
    cy.get('input[name="price"]').type('1000');
    cy.get('select[name="category"]').select('Hematology');
    
    cy.contains('button', 'Add Test').click({ force: true });
    cy.contains('Test added successfully', { timeout: 5000 });
  });

  it('should display test list', () => {
    cy.contains('Test Management').click();
    cy.get('table').should('be.visible');
    cy.get('table thead').should('contain', 'Name');
    cy.get('table thead').should('contain', 'Code');
    cy.get('table thead').should('contain', 'Price');
    cy.get('table thead').should('contain', 'Category');
  });

  it('should edit existing test', () => {
    cy.contains('Test Management').click();
    
    // Find first test and click edit
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Edit').click();
    });
    
    // Update test information
    cy.get('input[name="name"]').clear().type('Updated Test Name');
    cy.get('input[name="price"]').clear().type('1500');
    
    cy.contains('button', 'Update Test').click();
    cy.contains('Test updated successfully', { timeout: 5000 });
  });

  it('should delete test', () => {
    cy.contains('Test Management').click();
    
    // Find first test and click delete
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Delete').click();
    });
    
    // Confirm deletion
    cy.contains('button', 'Confirm').click();
    cy.contains('Test deleted successfully', { timeout: 5000 });
  });

  it('should search tests', () => {
    cy.contains('Test Management').click();
    
    // Search for a specific test
    cy.get('input[placeholder*="search" i]').type('Blood');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('should filter tests by category', () => {
    cy.contains('Test Management').click();
    
    // Filter by category
    cy.get('select[name="categoryFilter"]').select('Hematology');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('should validate required fields', () => {
    cy.contains('Test Management').click();
    cy.contains('Add').click({ force: true });
    
    // Try to submit without required fields
    cy.contains('button', 'Add Test').click({ force: true });
    
    // Check for validation messages
    cy.get('input[name="name"]').should('have.attr', 'required');
    cy.get('input[name="code"]').should('have.attr', 'required');
  });

  it('should import tests from CSV', () => {
    cy.contains('Test Management').click();
    
    // Click import button
    cy.contains('Import').click();
    
    // Upload CSV file (placeholder for file upload test)
    cy.get('input[type="file"]').should('be.visible');
    cy.contains('button', 'Import Tests').click();
    
    cy.contains('Tests imported successfully', { timeout: 5000 });
  });

  it('should export tests to CSV', () => {
    cy.contains('Test Management').click();
    
    // Click export button
    cy.contains('Export').click();
    
    // Check if download is triggered
    cy.contains('Export completed successfully', { timeout: 5000 });
  });
}); 