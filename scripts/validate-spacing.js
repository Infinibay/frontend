#!/usr/bin/env node

/**
 * Script para validar que no se usen clases de spacing hardcodeadas
 * Busca patrones como p-4, px-6, etc. en archivos JSX/JS
 *
 * Usage: node scripts/validate-spacing.js [--fix]
 */

const fs = require('fs');
const path = require('path');

// Pattern to match hardcoded spacing in className attributes
// Matches p-{number}, px-{number}, py-{number}, pt-{number}, pb-{number}, pl-{number}, pr-{number}
// And m-{number}, mx-{number}, my-{number}, mt-{number}, mb-{number}, ml-{number}, mr-{number}
const HARDCODED_SPACING_PATTERN = /\b(p-[0-9]+|px-[0-9]+|py-[0-9]+|pt-[0-9]+|pb-[0-9]+|pl-[0-9]+|pr-[0-9]+|m-[0-9]+|mx-[0-9]+|my-[0-9]+|mt-[0-9]+|mb-[0-9]+|ml-[0-9]+|mr-[0-9]+)\b/g;

// Directories to exclude
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'build',
  'dist',
  '.git',
  'coverage'
];

// Files to exclude (they might need hardcoded values for specific reasons)
const EXCLUDED_FILES = [
  'globals.css',
  'tailwind.config.js',
  'validate-spacing.js'
];

// Mapping suggestions for common patterns
const SUGGESTIONS = {
  'p-4': 'size-padding',
  'p-6': 'size-padding',
  'px-4': 'size-padding (horizontal)',
  'px-6': 'size-padding (horizontal)',
  'py-2': 'size-padding (vertical) or custom',
  'py-3': 'size-card-footer',
  'py-4': 'size-padding (vertical)',
  'pt-6': 'size-card-padding',
  'pb-6': 'pb-6 (keep if intentional)',
  'mb-2': 'size-margin-xs',
  'mb-4': 'size-margin-sm',
  'mt-2': 'size-margin-xs',
  'mt-4': 'size-margin-sm',
  'mx-4': 'size-container',
  'my-4': 'size-container'
};

/**
 * Recursively find all JS/JSX files in a directory
 */
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(item)) {
        findFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (['.js', '.jsx', '.tsx', '.ts'].includes(ext) && !EXCLUDED_FILES.includes(item)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Check a file for hardcoded spacing classes
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    // Only check lines that contain className
    if (line.includes('className')) {
      const matches = line.match(HARDCODED_SPACING_PATTERN);
      if (matches) {
        // Filter out false positives (e.g., in comments, or in variable names)
        const uniqueMatches = [...new Set(matches)];
        violations.push({
          line: index + 1,
          content: line.trim(),
          matches: uniqueMatches,
          suggestions: uniqueMatches.map(m => SUGGESTIONS[m] || 'size-* class')
        });
      }
    }
  });

  return violations;
}

/**
 * Format violations for output
 */
function formatViolations(filePath, violations) {
  const relativePath = path.relative(process.cwd(), filePath);
  let output = `\n${relativePath}:\n`;

  violations.forEach(v => {
    output += `  Line ${v.line}: ${v.matches.join(', ')}\n`;
    output += `    ${v.content.substring(0, 100)}${v.content.length > 100 ? '...' : ''}\n`;
    if (v.suggestions.length > 0) {
      output += `    Suggestions: ${v.suggestions.join(', ')}\n`;
    }
  });

  return output;
}

/**
 * Main function
 */
function main() {
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.error('Error: src directory not found. Run this script from the frontend directory.');
    process.exit(1);
  }

  console.log('Scanning for hardcoded spacing classes...\n');

  const files = findFiles(srcDir);
  let totalViolations = 0;
  const violationsByFile = {};

  files.forEach(file => {
    const violations = checkFile(file);
    if (violations.length > 0) {
      violationsByFile[file] = violations;
      totalViolations += violations.length;
    }
  });

  if (totalViolations > 0) {
    console.error(`Found ${totalViolations} potential spacing violations in ${Object.keys(violationsByFile).length} files:`);

    Object.entries(violationsByFile).forEach(([file, violations]) => {
      console.error(formatViolations(file, violations));
    });

    console.log('\n--- Size System Reference ---');
    console.log('Use these classes instead of hardcoded values:');
    console.log('  size-padding      - Standard padding');
    console.log('  size-gap          - Standard gap');
    console.log('  size-margin-xs    - Extra small margin');
    console.log('  size-margin-sm    - Small margin');
    console.log('  size-container    - Container spacing');
    console.log('  size-card-padding - Card header padding');
    console.log('  size-card-content - Card content padding');
    console.log('  size-card-footer  - Card footer padding');
    console.log('\nSee DESIGN_GUIDELINES.md and GLASS_EFFECTS_GUIDE.md for full reference.\n');

    // Exit with error code for CI/CD integration
    process.exit(1);
  } else {
    console.log('No spacing violations found!');
    console.log(`Scanned ${files.length} files.`);
  }
}

main();
