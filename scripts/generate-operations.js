/**
 * GraphQL Operations Generator Script
 *
 * Note: This script uses console.log/console.error instead of the frontend debug system
 * because it's a Node.js build tool that needs immediate, unconditional output visibility.
 * The createDebugger system is designed for browser-based frontend debugging.
 */

const { buildSchema, introspectionFromSchema, printSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function fetchSchema() {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query IntrospectionQuery {
          __schema {
            types {
              kind
              name
              fields {
                name
                args {
                  name
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
                type {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
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
          }
        }
      `
    })
  });

  const { data } = await response.json();
  return data;
}

function generateOperations(schemaData) {
  const operations = [];
  const schema = schemaData.__schema;
  
  // Find root types
  const queryType = schema.types.find(t => t.name === schema.queryType?.name);
  const mutationType = schema.types.find(t => t.name === schema.mutationType?.name);
  const subscriptionType = schema.types.find(t => t.name === schema.subscriptionType?.name);

  // Generate queries
  if (queryType) {
    queryType.fields.forEach(field => {
      const operation = `query ${capitalizeFirstLetter(field.name)} {
  ${field.name}
}`;
      operations.push(operation);
    });
  }

  // Generate mutations
  if (mutationType) {
    mutationType.fields.forEach(field => {
      const operation = `mutation ${capitalizeFirstLetter(field.name)} {
  ${field.name}
}`;
      operations.push(operation);
    });
  }

  // Generate subscriptions
  if (subscriptionType) {
    subscriptionType.fields.forEach(field => {
      const operation = `subscription ${capitalizeFirstLetter(field.name)} {
  ${field.name}
}`;
      operations.push(operation);
    });
  }

  return operations;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function main() {
  try {
    const schemaData = await fetchSchema();
    const operations = generateOperations(schemaData);
    
    // Create operations directory if it doesn't exist
    const operationsDir = path.join(__dirname, '..', 'src', 'gql', 'operations');
    if (!fs.existsSync(operationsDir)) {
      fs.mkdirSync(operationsDir, { recursive: true });
    }

    // Write operations to file
    const operationsFile = path.join(operationsDir, 'operations.graphql');
    fs.writeFileSync(operationsFile, operations.join('\n\n'));
    
    console.log('Generated operations file at:', operationsFile);
  } catch (error) {
    console.error('Error generating operations:', error);
    process.exit(1);
  }
}

main();
