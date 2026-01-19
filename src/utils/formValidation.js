/**
 * Frontend form validation and sanitization utilities
 * Protects against common injection attacks and ensures data quality
 */

// Field-specific length and character limits
export const FIELD_LIMITS = {
  name: { min: 2, max: 100, label: 'Contact name' },
  email: { max: 254, label: 'Email' },
  company_name: { min: 2, max: 200, label: 'Company name' },
  homepage_url: { max: 2048, label: 'Website URL' },
  product_name: { min: 2, max: 150, label: 'Product name' },
  product_page_url: { max: 2048, label: 'Product page URL' },
};

// Patterns that indicate potential injection attacks
const UNSAFE_PATTERNS = [
  /<script/i, // Script tags
  /javascript:/i, // JavaScript protocol
  /on\w+\s*=/i, // Event handlers (onclick, onload, etc)
  /{{|{%/, // Template injection (Jinja, etc)
  /\$\{/, // Template literals
  /`/, // Backticks for template literals
];

/**
 * Sanitize input by removing control characters and normalizing whitespace
 * @param {string} value - Input value to sanitize
 * @returns {string} Sanitized value
 */
export function sanitizeInput(value) {
  if (!value) return '';

  return String(value)
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace to single spaces
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Check if input contains unsafe patterns
 * @param {string} value - Input to check
 * @returns {boolean} True if unsafe patterns detected
 */
export function containsUnsafePatterns(value) {
  return UNSAFE_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Validate text field with length and pattern checks
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @returns {object} Validation result with valid flag and error message
 */
export function validateTextField(fieldName, value) {
  if (!value) {
    return { valid: false, error: 'This field is required.' };
  }

  const limits = FIELD_LIMITS[fieldName];
  if (!limits) {
    return { valid: true };
  }

  const sanitized = sanitizeInput(value);

  // Check minimum length
  if (limits.min && sanitized.length < limits.min) {
    return {
      valid: false,
      error: `${limits.label} must be at least ${limits.min} characters.`,
    };
  }

  // Check maximum length
  if (limits.max && sanitized.length > limits.max) {
    return {
      valid: false,
      error: `${limits.label} cannot exceed ${limits.max} characters.`,
    };
  }

  // Check for unsafe patterns
  if (containsUnsafePatterns(sanitized)) {
    return {
      valid: false,
      error: 'Input contains invalid characters or patterns.',
    };
  }

  return { valid: true };
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'Email is required.' };
  }

  const sanitized = sanitizeInput(email);

  // Basic email pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }

  // Check email length (RFC 5321)
  if (sanitized.length > 254) {
    return { valid: false, error: 'Email address is too long.' };
  }

  // Check for unsafe patterns in email
  if (containsUnsafePatterns(sanitized)) {
    return { valid: false, error: 'Email contains invalid characters.' };
  }

  return { valid: true };
}

/**
 * Validate URL with protocol check
 * @param {string} url - URL to validate
 * @returns {object} Validation result
 */
export function validateUrl(url) {
  if (!url) {
    return { valid: false, error: 'URL is required.' };
  }

  const sanitized = sanitizeInput(url);

  // Must start with http:// or https://
  const urlRegex = /^https?:\/\/.+/i;
  if (!urlRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Enter a full URL starting with http:// or https://',
    };
  }

  // Check URL length
  if (sanitized.length > 2048) {
    return { valid: false, error: 'URL is too long.' };
  }

  // Try to parse as URL for additional validation
  try {
    const urlObj = new URL(sanitized);
    // Ensure only http/https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'URL must use http:// or https://',
      };
    }
  } catch (error) {
    return { valid: false, error: 'Enter a valid URL.' };
  }

  // Check for unsafe patterns
  if (containsUnsafePatterns(sanitized)) {
    return { valid: false, error: 'URL contains invalid characters.' };
  }

  return { valid: true };
}

/**
 * Get react-hook-form compatible validation rules for a field
 * @param {string} fieldName - Name of the field
 * @returns {object} Validation rules object for react-hook-form
 */
export function getValidationRules(fieldName) {
  switch (fieldName) {
    case 'name':
      return {
        required: 'Contact name is required.',
        minLength: {
          value: FIELD_LIMITS.name.min,
          message: `Name must be at least ${FIELD_LIMITS.name.min} characters.`,
        },
        maxLength: {
          value: FIELD_LIMITS.name.max,
          message: `Name cannot exceed ${FIELD_LIMITS.name.max} characters.`,
        },
        validate: {
          noUnsafePatterns: (value) => {
            if (containsUnsafePatterns(value)) {
              return 'Input contains invalid characters or patterns.';
            }
            return true;
          },
        },
      };

    case 'email':
      return {
        required: 'Email is required.',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Enter a valid email address.',
        },
        maxLength: {
          value: FIELD_LIMITS.email.max,
          message: `Email cannot exceed ${FIELD_LIMITS.email.max} characters.`,
        },
        validate: {
          noUnsafePatterns: (value) => {
            if (containsUnsafePatterns(value)) {
              return 'Email contains invalid characters.';
            }
            return true;
          },
        },
      };

    case 'company_name':
    case 'product_name':
      return {
        required: `${FIELD_LIMITS[fieldName].label} is required.`,
        minLength: {
          value: FIELD_LIMITS[fieldName].min,
          message: `${FIELD_LIMITS[fieldName].label} must be at least ${FIELD_LIMITS[fieldName].min} characters.`,
        },
        maxLength: {
          value: FIELD_LIMITS[fieldName].max,
          message: `${FIELD_LIMITS[fieldName].label} cannot exceed ${FIELD_LIMITS[fieldName].max} characters.`,
        },
        validate: {
          noUnsafePatterns: (value) => {
            if (containsUnsafePatterns(value)) {
              return 'Input contains invalid characters or patterns.';
            }
            return true;
          },
        },
      };

    case 'homepage_url':
    case 'product_page_url':
      return {
        required: `${fieldName === 'homepage_url' ? 'Website' : 'Product page'} URL is required.`,
        pattern: {
          value: /^https?:\/\/.+/i,
          message: 'Enter a full URL starting with http:// or https://',
        },
        maxLength: {
          value: FIELD_LIMITS[fieldName].max,
          message: `URL cannot exceed ${FIELD_LIMITS[fieldName].max} characters.`,
        },
        validate: {
          validUrl: (value) => {
            try {
              const urlObj = new URL(value);
              if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return 'URL must use http:// or https://';
              }
              return true;
            } catch (error) {
              return 'Enter a valid URL.';
            }
          },
          noUnsafePatterns: (value) => {
            if (containsUnsafePatterns(value)) {
              return 'URL contains invalid characters.';
            }
            return true;
          },
        },
      };

    default:
      return {
        required: 'This field is required.',
      };
  }
}
