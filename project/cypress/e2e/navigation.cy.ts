/// <reference types="cypress" />

describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    cy.get('input[placeholder="Enter your username"]').type('admin');
    cy.get('input[placeholder="Enter your password"]').type('Adm1n!2024#Secure');
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard', { timeout: 10000 });
  });

  it('should navigate to all main modules', () => {
    const modules = [
      'Dashboard',
      'Patient Management',
      'Doctor Management',
      'Test Management',
      'Invoice Management',
      'Reports',
      'Analytics',
      'Settings'
    ];

    modules.forEach(module => {
      cy.contains(module).click();
      cy.contains(module).should('be.visible');
      cy.url().should('include', `#${module.toLowerCase().replace(/\s+/g, '-')}`);
    });
  });

  it('should handle sidebar collapse/expand', () => {
    // Check if sidebar is expanded by default
    cy.get('[data-testid="sidebar"]').should('be.visible');
    
    // Click collapse button
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'collapsed');
    
    // Click expand button
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('not.have.class', 'collapsed');
  });

  it('should maintain active tab state', () => {
    // Navigate to different tabs
    cy.contains('Patient Management').click();
    cy.url().should('include', '#patients');
    cy.get('[data-testid="sidebar"]').find('.active').should('contain', 'Patient Management');
    
    cy.contains('Test Management').click();
    cy.url().should('include', '#tests');
    cy.get('[data-testid="sidebar"]').find('.active').should('contain', 'Test Management');
  });

  it('should handle breadcrumb navigation', () => {
    cy.contains('Patient Management').click();
    
    // Check if breadcrumbs are displayed
    cy.get('[data-testid="breadcrumbs"]').should('be.visible');
    cy.get('[data-testid="breadcrumbs"]').should('contain', 'Dashboard');
    cy.get('[data-testid="breadcrumbs"]').should('contain', 'Patient Management');
    
    // Click on breadcrumb to go back
    cy.get('[data-testid="breadcrumbs"]').contains('Dashboard').click();
    cy.contains('Dashboard').should('be.visible');
  });

  it('should handle keyboard navigation', () => {
    // Test keyboard shortcuts
    cy.get('body').type('{ctrl}+1'); // Dashboard
    cy.url().should('include', '#dashboard');
    
    cy.get('body').type('{ctrl}+2'); // Patients
    cy.url().should('include', '#patients');
  });

  it('should handle responsive navigation', () => {
    // Test mobile navigation
    cy.viewport(375, 667);
    
    // Check if mobile menu button is visible
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    
    // Open mobile menu
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    // Navigate using mobile menu
    cy.get('[data-testid="mobile-menu"]').contains('Patient Management').click();
    cy.contains('Patient Management').should('be.visible');
  });

  it('should handle deep linking', () => {
    // Test direct URL access
    cy.visit('/#patients');
    cy.contains('Patient Management').should('be.visible');
    
    cy.visit('/#tests');
    cy.contains('Test Management').should('be.visible');
    
    cy.visit('/#invoices');
    cy.contains('Invoice Management').should('be.visible');
  });

  it('should handle unauthorized access', () => {
    // Test access to restricted areas
    cy.visit('/#settings');
    cy.contains('Settings').should('be.visible');
    
    // Switch to user with limited permissions
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Switch User').click();
    
    cy.get('input[placeholder="Enter your username"]').type('student');
    cy.get('input[placeholder="Enter your password"]').type('Stud3nt!2024@');
    cy.contains('button', 'Sign In').click();
    
    // Try to access restricted area
    cy.visit('/#settings');
    cy.contains('Access Denied').should('be.visible');
  });

  it('should handle navigation errors gracefully', () => {
    // Test invalid route
    cy.visit('/#invalid-route');
    cy.contains('Page Not Found').should('be.visible');
    
    // Test back button functionality
    cy.go('back');
    cy.contains('Dashboard').should('be.visible');
  });
}); 