#!/usr/bin/env node

// Husky installation script
// This script ensures that Git hooks are properly configured for all developers

const fs = require('fs');
const path = require('path');

const huskyDir = path.join(__dirname);
const gitDir = path.join(__dirname, '..', '.git');

// Check if we're in a Git repository
if (!fs.existsSync(gitDir)) {
  console.log('⚠️  Not in a Git repository. Skipping husky installation.');
  process.exit(0);
}

// Check if husky hooks exist and are executable
const hooks = ['pre-commit', 'commit-msg'];

hooks.forEach(hook => {
  const hookPath = path.join(huskyDir, hook);

  if (fs.existsSync(hookPath)) {
    // Make hook executable
    fs.chmodSync(hookPath, '755');
    console.log(`✅ ${hook} hook configured and made executable`);
  } else {
    console.log(`⚠️  ${hook} hook not found at ${hookPath}`);
  }
});

console.log('✅ Husky installation completed!');
console.log('ℹ️  Developers can now run GraphQL codegen validation on commit.');