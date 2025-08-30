#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 LIMS Cypress Test Runner');
console.log('============================\n');

const testOptions = [
  { name: 'Open Cypress Test Runner (Interactive)', command: 'npm run cy:open' },
  { name: 'Run All Tests (Headless)', command: 'npm run cy:run' },
  { name: 'Run Authentication Tests', command: 'npx cypress run --spec "cypress/e2e/authentication.cy.ts"' },
  { name: 'Run Dashboard Tests', command: 'npx cypress run --spec "cypress/e2e/dashboard.cy.ts"' },
  { name: 'Run Patient Management Tests', command: 'npx cypress run --spec "cypress/e2e/patient-management.cy.ts"' },
  { name: 'Run Invoice Management Tests', command: 'npx cypress run --spec "cypress/e2e/invoice-management.cy.ts"' },
  { name: 'Run Test Management Tests', command: 'npx cypress run --spec "cypress/e2e/test-management.cy.ts"' },
  { name: 'Run Navigation Tests', command: 'npx cypress run --spec "cypress/e2e/navigation.cy.ts"' },
  { name: 'Run Complete Workflow Tests', command: 'npx cypress run --spec "cypress/e2e/lims-flow.cy.ts"' },
  { name: 'Run Tests with Chrome Browser', command: 'npx cypress run --browser chrome' },
  { name: 'Run Tests with Firefox Browser', command: 'npx cypress run --browser firefox' },
  { name: 'Run Tests with Edge Browser', command: 'npx cypress run --browser edge' }
];

function displayMenu() {
  console.log('Available test options:\n');
  testOptions.forEach((option, index) => {
    console.log(`${index + 1}. ${option.name}`);
  });
  console.log('0. Exit\n');
}

function runTest(optionIndex) {
  if (optionIndex === 0) {
    console.log('👋 Goodbye!');
    process.exit(0);
  }

  if (optionIndex < 1 || optionIndex > testOptions.length) {
    console.log('❌ Invalid option. Please try again.\n');
    return;
  }

  const selectedOption = testOptions[optionIndex - 1];
  console.log(`\n🚀 Running: ${selectedOption.name}`);
  console.log(`Command: ${selectedOption.command}\n`);

  try {
    // Check if the application is running
    console.log('⚠️  Make sure your LIMS application is running on http://localhost:5173\n');
    
    execSync(selectedOption.command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    console.log('❌ Test execution failed. Please check the error above.');
  }
}

// Check if command line argument is provided
if (process.argv.length > 2) {
  const optionIndex = parseInt(process.argv[2]);
  runTest(optionIndex);
} else {
  // Interactive mode
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askQuestion() {
    displayMenu();
    rl.question('Select an option (0-12): ', (answer) => {
      const optionIndex = parseInt(answer);
      runTest(optionIndex);
      
      if (optionIndex !== 0) {
        rl.question('\nPress Enter to continue...', () => {
          console.clear();
          askQuestion();
        });
      } else {
        rl.close();
      }
    });
  }

  askQuestion();
}

console.log('\n📚 For more information, see CYPRESS_README.md');
console.log('🔗 Cypress Documentation: https://docs.cypress.io/'); 