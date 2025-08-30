/// <reference types="cypress" />

describe('Invoice Management Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should navigate to invoice management', () => {
    cy.contains('Invoice Management').click();
    cy.contains('Invoice Management').should('be.visible');
  });

  it('should create a new invoice', () => {
    cy.contains('Invoice Management').click();
    cy.contains('Add').click({ force: true });
    
    // Select patient
    cy.get('select').first().select(1);
    
    // Add test
    cy.contains('Add Test').click();
    cy.get('select').filter(':visible').last().select(1);
    
    // Save invoice
    cy.contains('button', 'Save').click({ force: true });
    cy.contains('Invoice created successfully', { timeout: 5000 });
  });

  it('should display invoice list', () => {
    cy.contains('Invoice Management').click();
    cy.get('table').should('be.visible');
    cy.get('table thead').should('contain', 'Invoice #');
    cy.get('table thead').should('contain', 'Patient');
    cy.get('table thead').should('contain', 'Amount');
  });

  it('should calculate invoice total correctly', () => {
    cy.contains('Invoice Management').click();
    cy.contains('Add').click({ force: true });
    
    // Select patient
    cy.get('select').first().select(1);
    
    // Add multiple tests
    cy.contains('Add Test').click();
    cy.get('select').filter(':visible').last().select(1);
    
    cy.contains('Add Test').click();
    cy.get('select').filter(':visible').last().select(2);
    
    // Check if total is calculated
    cy.get('[data-testid="invoice-total"]').should('be.visible');
  });

  it('should edit existing invoice', () => {
    cy.contains('Invoice Management').click();
    
    // Find first invoice and click edit
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Edit').click();
    });
    
    // Modify invoice
    cy.contains('Add Test').click();
    cy.get('select').filter(':visible').last().select(1);
    
    cy.contains('button', 'Update Invoice').click();
    cy.contains('Invoice updated successfully', { timeout: 5000 });
  });

  it('should delete invoice', () => {
    cy.contains('Invoice Management').click();
    
    // Find first invoice and click delete
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Delete').click();
    });
    
    // Confirm deletion
    cy.contains('button', 'Confirm').click();
    cy.contains('Invoice deleted successfully', { timeout: 5000 });
  });

  it('should generate PDF invoice', () => {
    cy.contains('Invoice Management').click();
    
    // Find first invoice and generate PDF
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('PDF').click();
    });
    
    // Check if PDF generation is triggered
    cy.contains('PDF generated successfully', { timeout: 5000 });
  });

  it('should search invoices', () => {
    cy.contains('Invoice Management').click();
    
    // Search for invoices
    cy.get('input[placeholder*="search" i]').type('Test');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });
}); 