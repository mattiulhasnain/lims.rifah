/// <reference types="cypress" />

describe('Patient Management Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should navigate to patient management', () => {
    cy.contains('Patient Management').click();
    cy.contains('Patient Management').should('be.visible');
  });

  it('should add a new patient successfully', () => {
    cy.contains('Patient Management').click();
    cy.contains('Add').click({ force: true });
    
    // Fill patient form
    cy.get('input').filter('[type="text"]').first().type('Cypress Test Patient');
    cy.get('input').filter('[type="text"]').eq(1).type('03001234567');
    cy.get('input').filter('[type="text"]').eq(2).type('Test Address');
    
    cy.contains('button', 'Add Patient').click({ force: true });
    cy.contains('Patient added successfully', { timeout: 5000 });
  });

  it('should display patient list', () => {
    cy.contains('Patient Management').click();
    cy.get('table').should('be.visible');
    cy.get('table thead').should('contain', 'Name');
    cy.get('table thead').should('contain', 'Phone');
    cy.get('table thead').should('contain', 'Address');
  });

  it('should edit existing patient', () => {
    cy.contains('Patient Management').click();
    
    // Find first patient and click edit
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Edit').click();
    });
    
    // Update patient information
    cy.get('input').filter('[type="text"]').first().clear().type('Updated Patient Name');
    cy.contains('button', 'Update Patient').click();
    cy.contains('Patient updated successfully', { timeout: 5000 });
  });

  it('should delete patient', () => {
    cy.contains('Patient Management').click();
    
    // Find first patient and click delete
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Delete').click();
    });
    
    // Confirm deletion
    cy.contains('button', 'Confirm').click();
    cy.contains('Patient deleted successfully', { timeout: 5000 });
  });

  it('should search patients', () => {
    cy.contains('Patient Management').click();
    
    // Search for a specific patient
    cy.get('input[placeholder*="search" i]').type('Test');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('should validate required fields', () => {
    cy.contains('Patient Management').click();
    cy.contains('Add').click({ force: true });
    
    // Try to submit without required fields
    cy.contains('button', 'Add Patient').click({ force: true });
    
    // Check for validation messages
    cy.get('input').filter('[type="text"]').first().should('have.attr', 'required');
  });
}); 