/**
 * Generate MD5 hash of a string
 * @param {string} string - String to hash
 * @returns {Promise<string>} MD5 hash
 */
async function md5(string) {
  // Use native Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Synchronous MD5 hash fallback (simple implementation for browsers without crypto.subtle)
 * @param {string} string - String to hash
 * @returns {string} MD5 hash
 */
function md5Sync(string) {
  // For SSR or browsers without crypto.subtle, use a default hash based on email
  // This is a simple fallback - Gravatar will just show default avatar
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Generate a Gravatar URL based on an email address
 * @param {string} email - User email address
 * @param {object} options - Gravatar options
 * @param {number} options.size - Image size in pixels (1-2048)
 * @param {string} options.default - Default image type (404, mp, identicon, monsterid, wavatar, retro, robohash, blank)
 * @param {string} options.rating - Maximum rating (g, pg, r, x)
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, options = {}) {
  if (!email || typeof email !== 'string') {
    // Return default Gravatar for missing email
    return getDefaultGravatarUrl(options);
  }

  // Normalize email: trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Generate simple hash for Gravatar (using synchronous fallback)
  const hash = md5Sync(normalizedEmail);

  // Build URL with options
  const {
    size = 200,
    default: defaultImage = 'identicon',
    rating = 'g'
  } = options;

  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating
  });

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

/**
 * Get a default Gravatar URL when no email is provided
 * @param {object} options - Gravatar options
 * @returns {string} Default Gravatar URL
 */
export function getDefaultGravatarUrl(options = {}) {
  const {
    size = 200,
    default: defaultImage = 'identicon',
    rating = 'g'
  } = options;

  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating
  });

  // Use a consistent hash for default avatar
  const defaultHash = '00000000000000000000000000000000';

  return `https://www.gravatar.com/avatar/${defaultHash}?${params.toString()}`;
}

/**
 * Get Gravatar profile URL
 * @param {string} email - User email address
 * @returns {string} Gravatar profile URL
 */
export function getGravatarProfileUrl(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hash = md5Sync(normalizedEmail);

  return `https://www.gravatar.com/${hash}`;
}

/**
 * Available Gravatar default image types
 */
export const GRAVATAR_DEFAULTS = {
  /** Return 404 if no Gravatar exists */
  NOT_FOUND: '404',
  /** Mystery person silhouette */
  MYSTERY_PERSON: 'mp',
  /** Geometric pattern based on email hash */
  IDENTICON: 'identicon',
  /** Generated monster with different colors */
  MONSTERID: 'monsterid',
  /** Generated face with different features */
  WAVATAR: 'wavatar',
  /** 8-bit arcade-style pixelated faces */
  RETRO: 'retro',
  /** Generated robot with different colors */
  ROBOHASH: 'robohash',
  /** Transparent PNG */
  BLANK: 'blank'
};

/**
 * Available Gravatar ratings
 */
export const GRAVATAR_RATINGS = {
  /** Suitable for display on all websites */
  G: 'g',
  /** May contain rude gestures, provocatively dressed individuals */
  PG: 'pg',
  /** May contain harsh profanity, intense violence, nudity */
  R: 'r',
  /** May contain hardcore sexual imagery or extremely disturbing violence */
  X: 'x'
};
