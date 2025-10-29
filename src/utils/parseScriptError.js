/**
 * Parses GraphQL/backend errors and returns user-friendly error messages
 * while logging full error details to console for debugging.
 *
 * @param {Error} error - The error object from GraphQL mutation/query
 * @param {string} [context] - Additional context string (e.g., 'script execution', 'script save')
 * @returns {string} User-friendly error message
 */
export function parseScriptError(error, context = '') {
  // Log full error to console for debugging
  if (context) {
    console.error('[Script Error]', context, error)
  } else {
    console.error('[Script Error]', error)
  }

  // Extract the raw error message from various error structures
  const rawMessage = extractErrorMessage(error)

  // Map error patterns to user-friendly messages
  const userMessage = mapErrorToUserMessage(rawMessage)

  return userMessage
}

/**
 * Extracts the error message from various error structures
 *
 * @param {Error} error - The error object
 * @returns {string} The extracted error message
 */
function extractErrorMessage(error) {
  // Handle falsy errors
  if (!error) {
    return 'Unknown error'
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Try GraphQL errors array
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message
  }

  // Try nested network error with result.errors
  if (error.networkError?.result?.errors?.[0]?.message) {
    return error.networkError.result.errors[0].message
  }

  // Try network error
  if (error.networkError && error.networkError.message) {
    return error.networkError.message
  }

  // Try direct message
  if (error.message) {
    return error.message
  }

  // Fallback
  return 'Unknown error'
}

/**
 * Maps error message patterns to user-friendly messages
 *
 * @param {string} message - The raw error message
 * @returns {string} User-friendly error message
 */
function mapErrorToUserMessage(message) {
  const lowerMessage = message.toLowerCase()

  // Not Found Errors
  if (matchErrorPattern(lowerMessage, ['not found'])) {
    return 'The requested resource could not be found. It may have been deleted or you may not have access to it.'
  }

  // Permission Errors
  if (matchErrorPattern(lowerMessage, ['permission', 'access denied', 'unauthorized', 'forbidden'])) {
    return 'You do not have permission to perform this action. Please contact your administrator if you believe this is an error.'
  }

  // Template Variable Errors (check before generic validation errors)
  if (matchErrorPattern(lowerMessage, ['undefined input variables', 'template variable'])) {
    return 'The script references input variables that are not defined. Please check the script configuration.'
  }

  // Input Type Errors
  if (matchErrorPattern(lowerMessage, ['invalid input type', 'input type'])) {
    return 'One or more script inputs have an invalid type. Please review the input configuration.'
  }

  // Validation Errors (generic)
  if (matchErrorPattern(lowerMessage, ['missing required inputs', 'required field', 'validation failed'])) {
    return 'Please check that all required fields are filled in correctly.'
  }

  // File System Errors - File Exists
  if (matchErrorPattern(lowerMessage, ['file already exists', 'eexist'])) {
    return 'A script with this name already exists. Please choose a different name.'
  }

  // File System Errors - Permission Denied
  if (matchErrorPattern(lowerMessage, ['eacces', 'permission denied']) &&
      matchErrorPattern(lowerMessage, ['file', 'write', 'save'])) {
    return 'Unable to save the script due to file system permissions. Please contact support.'
  }

  // Database Errors - Unique Constraint
  if (matchErrorPattern(lowerMessage, ['unique constraint', 'duplicate key'])) {
    return 'A script with this name already exists. Please choose a different name.'
  }

  // Network Errors
  if (matchErrorPattern(lowerMessage, ['network', 'fetch failed', 'econnrefused'])) {
    return 'Unable to connect to the server. Please check your internet connection and try again.'
  }

  // GraphQL Errors (generic)
  if (matchErrorPattern(lowerMessage, ['graphql error'])) {
    return 'An error occurred while processing your request. Please try again.'
  }

  // Default Fallback
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
}

/**
 * Checks if error message matches any of the provided patterns
 *
 * @param {string} message - The error message (should be lowercase)
 * @param {string[]} patterns - Array of pattern strings to match
 * @returns {boolean} True if any pattern matches
 */
function matchErrorPattern(message, patterns) {
  return patterns.some(pattern => message.includes(pattern))
}

export default parseScriptError
