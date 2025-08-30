/// <reference types="cypress" />

describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should display dashboard correctly', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.url().should('include', '#dashboard');
  });

  it('should show key metrics', () => {
    // Check if key metrics are displayed
    cy.contains('Total Patients').should('be.visible');
    cy.contains('Total Tests').should('be.visible');
    cy.contains('Pending Reports').should('be.visible');
    cy.contains('Today\'s Appointments').should('be.visible');
  });

  it('should display recent activities', () => {
    // Check if recent activities section exists
    cy.contains('Recent Activities').should('be.visible');
    cy.get('[data-testid="recent-activities"]').should('be.visible');
  });

  it('should show quick actions', () => {
    // Check if quick action buttons are present
    cy.contains('Add Patient').should('be.visible');
    cy.contains('Create Invoice').should('be.visible');
    cy.contains('Schedule Appointment').should('be.visible');
  });

  it('should navigate to modules from quick actions', () => {
    // Test quick action navigation
    cy.contains('Add Patient').click();
    cy.contains('Patient Management').should('be.visible');
    
    cy.go('back');
    cy.contains('Dashboard').should('be.visible');
    
    cy.contains('Create Invoice').click();
    cy.contains('Invoice Management').should('be.visible');
  });

  it('should display charts and graphs', () => {
    // Check if analytics charts are displayed
    cy.get('[data-testid="analytics-chart"]').should('be.visible');
    cy.get('[data-testid="revenue-chart"]').should('be.visible');
  });

  it('should show notifications', () => {
    // Check if notifications are displayed
    cy.get('[data-testid="notifications"]').should('be.visible');
  });

  it('should refresh dashboard data', () => {
    // Test dashboard refresh functionality
    cy.get('[data-testid="refresh-dashboard"]').click();
    cy.contains('Dashboard').should('be.visible');
  });

  it('should display user information', () => {
    // Check if user info is displayed
    cy.get('[data-testid="user-info"]').should('contain', 'admin');
    cy.get('[data-testid="user-role"]').should('contain', 'admin');
  });

  it('should handle responsive layout', () => {
    // Test responsive behavior
    cy.viewport(768, 1024); // Tablet view
    cy.contains('Dashboard').should('be.visible');
    
    cy.viewport(375, 667); // Mobile view
    cy.contains('Dashboard').should('be.visible');
  });
}); 