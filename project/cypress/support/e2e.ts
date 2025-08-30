/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

// Custom commands for common LIMS operations
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.contains('Sign In');
  cy.get('input[placeholder="Enter your username"]').type(username);
  cy.get('input[placeholder="Enter your password"]').type(password);
  cy.contains('button', 'Sign In').click();
  cy.contains('Dashboard', { timeout: 10000 });
});

Cypress.Commands.add('navigateToTab', (tabName: string) => {
  cy.contains(tabName).click();
  cy.wait(1000); // Wait for navigation
});

Cypress.Commands.add('createTestPatient', (patientData: Record<string, string>) => {
  cy.navigateToTab('Patient Management');
  cy.contains('Add').click({ force: true });
  
  // Fill patient form
  cy.get('input').filter('[type="text"]').first().type(patientData.name);
  cy.get('input').filter('[type="text"]').eq(1).type(patientData.phone);
  cy.get('input').filter('[type="text"]').eq(2).type(patientData.address);
  
  cy.contains('button', 'Add Patient').click({ force: true });
  cy.contains('Patient added successfully', { timeout: 5000 });
});

Cypress.Commands.add('createTestInvoice', () => {
  cy.navigateToTab('Invoice Management');
  cy.contains('Add').click({ force: true });
  
  // Select patient
  cy.get('select').first().select(1);
  
  // Add test
  cy.contains('Add Test').click();
  cy.get('select').filter(':visible').last().select(1);
  
  cy.contains('button', 'Save').click({ force: true });
  cy.contains('Invoice created successfully', { timeout: 5000 });
});

Cypress.Commands.add('completeTestReport', () => {
  cy.navigateToTab('Reports');
  
  // Find first incomplete report
  cy.get('table').find('button').contains('Enter Results').should('exist');
  cy.get('table tbody tr').first().within(() => {
    cy.get('button').first().click(); // Enter results
  });
  
  // Enter result
  cy.get('table').find('input').first().type('10');
  cy.contains('button', 'Mark Completed').click();
  cy.contains('Report completed successfully', { timeout: 5000 });
});

Cypress.Commands.add('verifyTestReport', () => {
  cy.navigateToTab('Reports');
  
  // Find first completed report and verify
  cy.get('table tbody tr').first().within(() => {
    cy.get('button[title="Verify"]').click();
  });
  cy.contains('Verify').click();
  cy.contains('Download PDF').should('not.have.attr', 'disabled');
});

// Global beforeEach hook
beforeEach(() => {
  // Clear any existing data
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Global afterEach hook
afterEach(() => {
  // Take screenshot on failure
  cy.screenshot();
});

// Type definitions for custom commands
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      navigateToTab(tabName: string): Chainable<void>;
      createTestPatient(patientData: Record<string, string>): Chainable<void>;
      createTestInvoice(): Chainable<void>;
      completeTestReport(): Chainable<void>;
      verifyTestReport(): Chainable<void>;
    }
  }
} 