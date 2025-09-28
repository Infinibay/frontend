/**
 * Enhanced GraphQL Operations Generator Script
 *
 * This script generates GraphQL operations and integrates with the existing codegen workflow.
 * It supports dry-run mode, validation, and works alongside graphql-codegen instead of replacing it.
 *
 * Usage:
 *   node scripts/generate-operations.js [options]
 *
 * Options:
 *   --dry-run, -d     Preview generated operations without writing files
 *   --validate, -v    Validate generated operations against schema
 *   --output, -o      Specify output directory (default: src/gql/generated)
 *   --help, -h        Show this help message
 *
 * Note: This script uses console.log/console.error instead of the frontend debug system
 * because it's a Node.js build tool that needs immediate, unconditional output visibility.
 */

const { buildSchema, introspectionFromSchema, printSchema, validate, parse } = require('graphql');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
  schemaUrl: process.env.GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  outputDir: 'src/gql/generated',
  maxFieldDepth: 3,
  dryRun: false,
  validate: false,
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      case '--validate':
      case '-v':
        options.validate = true;
        break;
      case '--output':
      case '-o':
        if (i + 1 < args.length) {
          options.outputDir = args[++i];
        }
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        console.warn(`⚠️  Unknown option: ${arg}`);
    }
  }

  return options;
}

// Show help message
function showHelp() {
  console.log(`
GraphQL Operations Generator

Usage: node scripts/generate-operations.js [options]

Options:
  --dry-run, -d     Preview generated operations without writing files
  --validate, -v    Validate generated operations against schema
  --output, -o      Specify output directory (default: src/gql/generated)
  --help, -h        Show this help message

Examples:
  node scripts/generate-operations.js --dry-run
  node scripts/generate-operations.js --output src/gql/custom --validate
  node scripts/generate-operations.js -d -v
`);
}

// Enhanced schema fetching with error handling and retries
async function fetchSchema(options) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Fetching schema from ${options.schemaUrl} (attempt ${attempt}/${maxRetries})`);

      const response = await fetch(options.schemaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query IntrospectionQuery {
              __schema {
                types {
                  kind
                  name
                  description
                  fields {
                    name
                    description
                    args {
                      name
                      description
                      type {
                        kind
                        name
                        ofType {
                          kind
                          name
                          ofType {
                            kind
                            name
                          }
                        }
                      }
                      defaultValue
                    }
                    type {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                  inputFields {
                    name
                    description
                    type {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                    defaultValue
                  }
                  interfaces {
                    kind
                    name
                  }
                  enumValues {
                    name
                    description
                  }
                  possibleTypes {
                    kind
                    name
                  }
                }
                queryType {
                  name
                }
                mutationType {
                  name
                }
                subscriptionType {
                  name
                }
                directives {
                  name
                  description
                  locations
                  args {
                    name
                    description
                    type {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                    defaultValue
                  }
                }
              }
            }
          `
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
      }

      if (!result.data?.__schema) {
        throw new Error('Invalid schema response: missing __schema field');
      }

      console.log('✅ Schema fetched successfully');
      return result.data;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        const delay = attempt * 1000; // Progressive delay
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to fetch schema after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Enhanced operation generation with field selection and arguments
function generateOperations(schemaData, options) {
  const operations = [];
  const schema = schemaData.__schema;

  // Find root types
  const queryType = schema.types.find(t => t.name === schema.queryType?.name);
  const mutationType = schema.types.find(t => t.name === schema.mutationType?.name);
  const subscriptionType = schema.types.find(t => t.name === schema.subscriptionType?.name);

  // Helper function to generate field selection with proper depth
  function generateFieldSelection(type, schema, depth = 0, maxDepth = options.maxFieldDepth) {
    if (depth >= maxDepth) return '';

    const typeObj = schema.types.find(t => t.name === getTypeName(type));
    if (!typeObj || !typeObj.fields) return '';

    const scalarFields = typeObj.fields.filter(field => {
      const fieldTypeName = getTypeName(field.type);
      const fieldType = schema.types.find(t => t.name === fieldTypeName);
      return !fieldType || fieldType.kind === 'SCALAR' || fieldType.kind === 'ENUM';
    });

    const objectFields = typeObj.fields.filter(field => {
      const fieldTypeName = getTypeName(field.type);
      const fieldType = schema.types.find(t => t.name === fieldTypeName);
      return fieldType && (fieldType.kind === 'OBJECT' || fieldType.kind === 'INTERFACE');
    }).slice(0, 2); // Limit to 2 nested objects to avoid complexity

    let selection = '';

    // Add scalar fields
    if (scalarFields.length > 0) {
      selection += scalarFields.map(f => `    ${'  '.repeat(depth)}${f.name}`).join('\n');
    }

    // Add basic object fields (one level deep only)
    if (depth < maxDepth - 1 && objectFields.length > 0) {
      for (const field of objectFields) {
        const fieldTypeName = getTypeName(field.type);
        const nestedSelection = generateFieldSelection(field.type, schema, depth + 1, Math.min(maxDepth, depth + 2));
        if (nestedSelection) {
          selection += `\n    ${'  '.repeat(depth)}${field.name} {\n${nestedSelection}\n    ${'  '.repeat(depth)}}`;
        }
      }
    }

    return selection;
  }

  // Helper function to get the actual type name, unwrapping NonNull and List wrappers
  function getTypeName(type) {
    if (type.ofType) {
      return getTypeName(type.ofType);
    }
    return type.name;
  }

  // Helper function to generate arguments for operations
  function generateArguments(field) {
    if (!field.args || field.args.length === 0) return '';

    const requiredArgs = field.args.filter(arg => arg.type.kind === 'NON_NULL');
    const optionalArgs = field.args.filter(arg => arg.type.kind !== 'NON_NULL').slice(0, 3); // Limit optional args

    const allArgs = [...requiredArgs, ...optionalArgs];

    if (allArgs.length === 0) return '';

    const argStrings = allArgs.map(arg => {
      const typeName = getTypeName(arg.type);
      const isRequired = arg.type.kind === 'NON_NULL';
      const typeString = `${isRequired ? '$' : '$'}${arg.name}: ${typeName}${isRequired ? '!' : ''}`;
      return typeString;
    });

    return `(${argStrings.join(', ')})`;
  }

  // Helper function to generate argument variables for field calls
  function generateArgumentCalls(field) {
    if (!field.args || field.args.length === 0) return '';

    const requiredArgs = field.args.filter(arg => arg.type.kind === 'NON_NULL');
    const optionalArgs = field.args.filter(arg => arg.type.kind !== 'NON_NULL').slice(0, 3);

    const allArgs = [...requiredArgs, ...optionalArgs];

    if (allArgs.length === 0) return '';

    const argCalls = allArgs.map(arg => `${arg.name}: $${arg.name}`);
    return `(${argCalls.join(', ')})`;
  }

  // Generate queries
  if (queryType && queryType.fields) {
    console.log(`📝 Generating ${queryType.fields.length} query operations...`);

    queryType.fields.forEach(field => {
      const operationName = capitalizeFirstLetter(field.name);
      const arguments = generateArguments(field);
      const argumentCalls = generateArgumentCalls(field);
      const fieldSelection = generateFieldSelection(field.type, schema);

      const operation = `query ${operationName}${arguments} {
  ${field.name}${argumentCalls}${fieldSelection ? ` {\n${fieldSelection}\n  }` : ''}
}`;

      operations.push(operation);
    });
  }

  // Generate mutations
  if (mutationType && mutationType.fields) {
    console.log(`📝 Generating ${mutationType.fields.length} mutation operations...`);

    mutationType.fields.forEach(field => {
      const operationName = capitalizeFirstLetter(field.name);
      const arguments = generateArguments(field);
      const argumentCalls = generateArgumentCalls(field);
      const fieldSelection = generateFieldSelection(field.type, schema);

      const operation = `mutation ${operationName}${arguments} {
  ${field.name}${argumentCalls}${fieldSelection ? ` {\n${fieldSelection}\n  }` : ''}
}`;

      operations.push(operation);
    });
  }

  // Generate subscriptions
  if (subscriptionType && subscriptionType.fields) {
    console.log(`📝 Generating ${subscriptionType.fields.length} subscription operations...`);

    subscriptionType.fields.forEach(field => {
      const operationName = capitalizeFirstLetter(field.name);
      const arguments = generateArguments(field);
      const argumentCalls = generateArgumentCalls(field);
      const fieldSelection = generateFieldSelection(field.type, schema);

      const operation = `subscription ${operationName}${arguments} {
  ${field.name}${argumentCalls}${fieldSelection ? ` {\n${fieldSelection}\n  }` : ''}
}`;

      operations.push(operation);
    });
  }

  console.log(`✅ Generated ${operations.length} total operations`);
  return operations;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Validation function
async function validateOperations(operations, schema) {
  const validationErrors = [];

  for (const [index, operation] of operations.entries()) {
    try {
      const document = parse(operation);
      const errors = validate(schema, document);

      if (errors.length > 0) {
        validationErrors.push({
          index,
          operation: operation.split('\n')[0], // First line for identification
          errors: errors.map(e => e.message)
        });
      }
    } catch (parseError) {
      validationErrors.push({
        index,
        operation: operation.split('\n')[0],
        errors: [`Parse error: ${parseError.message}`]
      });
    }
  }

  return validationErrors;
}

// Check for existing operations to avoid duplicates
function checkExistingOperations(outputDir) {
  const existingOperations = new Set();

  if (!fs.existsSync(outputDir)) {
    return existingOperations;
  }

  const files = fs.readdirSync(outputDir, { recursive: true });

  for (const file of files) {
    if (file.endsWith('.graphql')) {
      const filePath = path.join(outputDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract operation names using regex
      const operationMatches = content.match(/(query|mutation|subscription)\s+(\w+)/g);
      if (operationMatches) {
        operationMatches.forEach(match => {
          const operationName = match.split(/\s+/)[1];
          existingOperations.add(operationName);
        });
      }
    }
  }

  return existingOperations;
}

// Enhanced main function
async function main() {
  console.log('🚀 GraphQL Operations Generator Starting...\n');

  const options = parseArgs();

  try {
    // Fetch schema
    const schemaData = await fetchSchema(options);
    const operations = generateOperations(schemaData, options);

    console.log(`📝 Generated ${operations.length} operations`);

    // Check for existing operations
    const outputDir = path.join(__dirname, '..', options.outputDir);
    const existingOperations = checkExistingOperations(outputDir);

    if (existingOperations.size > 0) {
      console.log(`ℹ️  Found ${existingOperations.size} existing operations`);
    }

    // Filter out duplicate operations
    const newOperations = operations.filter(op => {
      const firstLine = op.split('\n')[0];
      const operationName = firstLine.match(/(query|mutation|subscription)\s+(\w+)/)?.[2];
      return operationName && !existingOperations.has(operationName);
    });

    console.log(`✨ ${newOperations.length} new operations to generate`);

    // Validate operations if requested
    if (options.validate && newOperations.length > 0) {
      console.log('\n🔍 Validating operations...');
      const schema = buildSchema(printSchema(schemaData.__schema));
      const validationErrors = await validateOperations(newOperations, schema);

      if (validationErrors.length > 0) {
        console.error('\n❌ Validation errors found:');
        validationErrors.forEach(({ index, operation, errors }) => {
          console.error(`  Operation ${index + 1} (${operation}):`);
          errors.forEach(error => console.error(`    - ${error}`));
        });

        if (!options.dryRun) {
          console.error('\n🛑 Aborting due to validation errors');
          process.exit(1);
        }
      } else {
        console.log('✅ All operations are valid');
      }
    }

    // Dry run mode
    if (options.dryRun) {
      console.log('\n🔍 Dry run mode - operations preview:');
      newOperations.forEach((op, index) => {
        console.log(`\n--- Operation ${index + 1} ---`);
        console.log(op);
      });

      console.log(`\n📊 Summary:`);
      console.log(`  - Total operations generated: ${operations.length}`);
      console.log(`  - New operations (would be written): ${newOperations.length}`);
      console.log(`  - Existing operations (skipped): ${existingOperations.size}`);
      console.log(`  - Output directory: ${outputDir}`);

      return;
    }

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Write operations to files
    if (newOperations.length > 0) {
      const operationsFile = path.join(outputDir, 'generated-operations.graphql');
      fs.writeFileSync(operationsFile, newOperations.join('\n\n'));

      console.log(`✅ Generated operations written to: ${operationsFile}`);

      // Generate summary report
      const summaryFile = path.join(outputDir, 'generation-summary.json');
      const summary = {
        timestamp: new Date().toISOString(),
        totalOperations: operations.length,
        newOperations: newOperations.length,
        existingOperations: existingOperations.size,
        schemaUrl: options.schemaUrl,
        outputDir: options.outputDir,
        validated: options.validate
      };

      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
      console.log(`📊 Summary report written to: ${summaryFile}`);
    } else {
      console.log('ℹ️  No new operations to generate');
    }

    console.log('\n🎉 Operation generation completed successfully!');

  } catch (error) {
    console.error('\n💥 Error generating operations:', error.message);
    if (process.env.DEBUG) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();
