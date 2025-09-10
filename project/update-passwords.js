#!/usr/bin/env node

/**
 * Password Update Script
 * This script updates the .env.local file with new passwords from localStorage
 * Run this script after changing passwords through the UI
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env.local');

function updateEnvFile() {
  try {
    // Read current .env.local file
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf8');
    }

    // Check for new passwords in localStorage (this would be set by the password service)
    // In a real implementation, you might want to pass these as command line arguments
    const newAdminPassword = process.env.NEW_ADMIN_PASSWORD;
    const newAdvancedPassword = process.env.NEW_ADVANCED_PASSWORD;

    if (newAdminPassword) {
      // Update or add VITE_ADMIN_PASSWORD
      if (envContent.includes('VITE_ADMIN_PASSWORD=')) {
        envContent = envContent.replace(
          /VITE_ADMIN_PASSWORD=.*/,
          `VITE_ADMIN_PASSWORD=${newAdminPassword}`
        );
      } else {
        envContent += `\nVITE_ADMIN_PASSWORD=${newAdminPassword}`;
      }
      console.log('✅ Updated admin password');
    }

    if (newAdvancedPassword) {
      // Update or add VITE_ADVANCED_ADMIN_PASSWORD
      if (envContent.includes('VITE_ADVANCED_ADMIN_PASSWORD=')) {
        envContent = envContent.replace(
          /VITE_ADVANCED_ADMIN_PASSWORD=.*/,
          `VITE_ADVANCED_ADMIN_PASSWORD=${newAdvancedPassword}`
        );
      } else {
        envContent += `\nVITE_ADVANCED_ADMIN_PASSWORD=${newAdvancedPassword}`;
      }
      console.log('✅ Updated advanced admin password');
    }

    // Write updated content back to file
    fs.writeFileSync(ENV_FILE, envContent);
    console.log('✅ Environment file updated successfully');
    console.log('🔄 Please restart your development server for changes to take effect');

  } catch (error) {
    console.error('❌ Error updating environment file:', error.message);
    process.exit(1);
  }
}

// Run the update
updateEnvFile();
