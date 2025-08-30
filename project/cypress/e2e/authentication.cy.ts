/// <reference types="cypress" />

describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login form correctly', () => {
    cy.contains('Sign In');
    cy.get('input[placeholder="Enter your username"]').should('be.visible');
    cy.get('input[placeholder="Enter your password"]').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
    cy.contains('LabManager Pro').should('be.visible');
  });

  it('should login successfully with admin credentials', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.users.admin.username, data.users.admin.password);
      cy.contains('Dashboard').should('be.visible');
      cy.url().should('include', '#dashboard');
    });
  });

  it('should login successfully with receptionist credentials', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.users.receptionist.username, data.users.receptionist.password);
      cy.contains('Dashboard').should('be.visible');
      cy.url().should('include', '#dashboard');
    });
  });

  it('should login successfully with student credentials', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.users.student.username, data.users.student.password);
      cy.contains('Dashboard').should('be.visible');
      cy.url().should('include', '#dashboard');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[placeholder="Enter your username"]').type('invalid');
    cy.get('input[placeholder="Enter your password"]').type('wrongpassword');
    cy.contains('button', 'Sign In').click();
    cy.contains('Invalid username or password').should('be.visible');
  });

  it('should show error for empty credentials', () => {
    cy.contains('button', 'Sign In').click();
    cy.get('input[placeholder="Enter your username"]').should('have.attr', 'required');
    cy.get('input[placeholder="Enter your password"]').should('have.attr', 'required');
  });

  it('should logout successfully', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.users.admin.username, data.users.admin.password);
      cy.contains('Dashboard').should('be.visible');
      
      // Logout (assuming there's a logout button in header)
      cy.get('[data-testid="logout-button"]').click();
      cy.contains('Sign In').should('be.visible');
    });
  });

  it('should maintain session after page refresh', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.users.admin.username, data.users.admin.password);
      cy.contains('Dashboard').should('be.visible');
      
      cy.reload();
      cy.contains('Dashboard').should('be.visible');
    });
  });
}); 