/**
 * Centralized validation utility for script inputs.
 * Consolidates validation logic from all input components.
 */

// Shared validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;
const UNIX_PATH_REGEX = /^\//;

/**
 * Validates a URL string
 * @param {string} value - URL to validate
 * @param {string[]} allowedProtocols - Allowed URL protocols (e.g., ['http', 'https'] or ['http:', 'https:'])
 * @returns {boolean} True if valid, false otherwise
 */
function isValidUrl(value, allowedProtocols = ['http', 'https']) {
  try {
    const url = new URL(value);
    // Normalize protocols by removing trailing colons
    const normalizedAllowed = allowedProtocols.map(p => p.replace(':', ''));
    const protocol = url.protocol.replace(':', '');
    return normalizedAllowed.includes(protocol);
  } catch {
    return false;
  }
}

/**
 * Validates a text input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateTextInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value) {
    if (input.validation?.minLength && value.length < input.validation.minLength) {
      return `Minimum length is ${input.validation.minLength} characters`;
    }

    if (input.validation?.maxLength && value.length > input.validation.maxLength) {
      return `Maximum length is ${input.validation.maxLength} characters`;
    }

    if (input.validation?.pattern) {
      const regex = new RegExp(input.validation.pattern);
      if (!regex.test(value)) {
        return input.validation.patternDescription || 'Invalid format';
      }
    }
  }

  return null;
}

/**
 * Validates a number input
 * @param {Object} input - Input definition
 * @param {number} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateNumberInput(input, value) {
  if (input.required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }

  if (value !== null && value !== undefined && value !== '') {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return 'Must be a valid number';
    }

    if (input.validation?.min !== undefined && numValue < input.validation.min) {
      return `Minimum value is ${input.validation.min}`;
    }

    if (input.validation?.max !== undefined && numValue > input.validation.max) {
      return `Maximum value is ${input.validation.max}`;
    }

    if (input.validation?.step !== undefined && input.validation.step !== 0) {
      const step = input.validation.step;
      const min = input.validation?.min || 0;
      const remainder = (numValue - min) % step;
      // Use small tolerance for floating-point precision issues
      const tolerance = step < 1 ? 1e-10 : 1e-6;
      if (Math.abs(remainder) > tolerance && Math.abs(remainder - step) > tolerance) {
        return `Value must be a multiple of ${step}`;
      }
    }

    if (input.validation?.integerOnly && !Number.isInteger(numValue)) {
      return 'Value must be an integer (no decimals)';
    }
  }

  return null;
}

/**
 * Validates an email input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateEmailInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value && !EMAIL_REGEX.test(value)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Validates a URL input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateUrlInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value) {
    const allowedProtocols = input.validation?.protocols || ['http', 'https'];
    if (!isValidUrl(value, allowedProtocols)) {
      // Normalize protocols for display (remove colons)
      const displayProtocols = allowedProtocols.map(p => p.replace(':', ''));
      return `Please enter a valid URL (${displayProtocols.join(', ')})`;
    }
  }

  return null;
}

/**
 * Validates a password input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validatePasswordInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value && input.validation?.minLength && value.length < input.validation.minLength) {
    return `Password must be at least ${input.validation.minLength} characters`;
  }

  return null;
}

/**
 * Validates a select input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateSelectInput(input, value) {
  if (input.required && !value) {
    return 'Please select an option';
  }

  if (value && input.options) {
    const validOptions = input.options.map(opt => opt.value || opt);
    if (!validOptions.includes(value)) {
      return 'Invalid selection';
    }
  }

  return null;
}

/**
 * Validates a multi-select input
 * @param {Object} input - Input definition
 * @param {Array} value - Current value (array of selected values)
 * @returns {string|null} Error message or null if valid
 */
function validateMultiSelectInput(input, value) {
  const selectedValues = Array.isArray(value) ? value : [];

  if (input.required && selectedValues.length === 0) {
    return 'Please select at least one option';
  }

  if (input.validation?.minSelections && selectedValues.length < input.validation.minSelections) {
    return `Please select at least ${input.validation.minSelections} option(s)`;
  }

  if (input.validation?.maxSelections && selectedValues.length > input.validation.maxSelections) {
    return `Please select at most ${input.validation.maxSelections} option(s)`;
  }

  return null;
}

/**
 * Validates a path input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validatePathInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value) {
    const isWindowsPath = WINDOWS_PATH_REGEX.test(value);
    const isUnixPath = UNIX_PATH_REGEX.test(value);

    if (!isWindowsPath && !isUnixPath) {
      return 'Please enter a valid file path';
    }
  }

  return null;
}

/**
 * Validates a textarea input
 * @param {Object} input - Input definition
 * @param {string} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateTextareaInput(input, value) {
  if (input.required && !value) {
    return 'This field is required';
  }

  if (value && input.validation?.maxLength && value.length > input.validation.maxLength) {
    return `Maximum length is ${input.validation.maxLength} characters`;
  }

  return null;
}

/**
 * Validates a boolean input
 * @param {Object} input - Input definition
 * @param {boolean} value - Current value
 * @returns {string|null} Error message or null if valid
 */
function validateBooleanInput(input, value) {
  // Boolean inputs don't require validation
  return null;
}

/**
 * Main validation function that routes to type-specific validators
 * @param {Object} input - Input definition object with type and validation properties
 * @param {*} value - Current value to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateScriptInput(input, value) {
  if (!input || !input.type) {
    return null;
  }

  switch (input.type) {
    case 'text':
      return validateTextInput(input, value);
    case 'number':
      return validateNumberInput(input, value);
    case 'email':
      return validateEmailInput(input, value);
    case 'url':
      return validateUrlInput(input, value);
    case 'password':
      return validatePasswordInput(input, value);
    case 'select':
      return validateSelectInput(input, value);
    case 'multiselect':
      return validateMultiSelectInput(input, value);
    case 'path':
      return validatePathInput(input, value);
    case 'textarea':
      return validateTextareaInput(input, value);
    case 'boolean':
      return validateBooleanInput(input, value);
    default:
      return null;
  }
}

export default validateScriptInput;
