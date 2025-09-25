export const DEFAULT_AVATAR_CANONICAL = 'images/avatars/man.svg';
export const DEFAULT_AVATAR_URL = '/api/avatars/image/man.svg';

// Cache for available avatars to avoid repeated API calls
let avatarCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the full URL for an avatar
 * @param {string|null|undefined} avatarPath - Avatar path from database
 * @returns {string} Full avatar URL or default avatar path
 */
export function getAvatarUrl(avatarPath) {
  // Handle null, undefined, or empty strings
  if (!avatarPath || avatarPath.trim() === '') {
    return DEFAULT_AVATAR_URL;
  }

  // If already a full URL (starts with http/https), return as-is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  // If already using the API endpoint pattern, return as-is
  if (avatarPath.startsWith('/api/avatars/image/')) {
    return avatarPath;
  }

  // Convert relative paths to API endpoint URLs
  let filename = avatarPath;

  // Handle paths that start with 'images/avatars/'
  if (avatarPath.startsWith('images/avatars/')) {
    filename = avatarPath.substring('images/avatars/'.length);
  }
  // Handle paths that start with 'images/'
  else if (avatarPath.startsWith('images/')) {
    // This could be 'images/default-avatar.svg' - extract just the filename
    filename = avatarPath.substring('images/'.length);
  }
  // Handle absolute paths starting with '/'
  else if (avatarPath.startsWith('/')) {
    // Extract just the filename from the path
    filename = avatarPath.split('/').pop();
  }

  // Construct the API endpoint URL
  return `/api/avatars/image/${filename}`;
}

/**
 * Fetch available avatars from the API
 * @returns {Promise<Array<Object>>} Array of avatar objects
 */
export async function getAvailableAvatars() {
  // Check cache first
  const now = Date.now();
  if (avatarCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return avatarCache;
  }

  try {
    const response = await fetch('/api/avatars');

    if (!response.ok) {
      throw new Error(`Failed to fetch avatars: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected array of avatars');
    }

    // Transform and validate each avatar entry
    const avatars = data.map(avatar => {
      if (typeof avatar === 'string') {
        // If it's just a string, assume it's the path
        return {
          path: avatar,
          url: getAvatarUrl(avatar),
          name: avatar.split('/').pop().split('.')[0] || 'Avatar'
        };
      } else if (typeof avatar === 'object' && avatar.path) {
        // If it's an object with a path property
        return {
          ...avatar,
          url: avatar.url ?? getAvatarUrl(avatar.path), // Prefer server URL to avoid divergence
          name: avatar.name || avatar.path.split('/').pop().split('.')[0] || 'Avatar',
          isDefault: avatar.isDefault || false // Pass through isDefault from server
        };
      } else {
        console.warn('Invalid avatar entry:', avatar);
        return null;
      }
    }).filter(Boolean); // Remove null entries

    // Update cache
    avatarCache = avatars;
    cacheTimestamp = now;

    return avatars;
  } catch (error) {
    console.error('Error fetching avatars:', error);

    // Return default avatars as fallback
    return [
      {
        path: DEFAULT_AVATAR_CANONICAL,
        url: DEFAULT_AVATAR_URL,
        name: 'Default Avatar'
      }
    ];
  }
}

/**
 * Validate if an avatar path is in the correct format
 * @param {string} path - Avatar path to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidAvatarPath(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Allow common image extensions
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const hasValidExtension = validExtensions.some(ext =>
    path.toLowerCase().endsWith(ext)
  );

  // Allow URLs or relative paths with valid extensions
  const isUrl = path.startsWith('http://') || path.startsWith('https://');
  const isRelativePath = !path.includes('..') && !path.includes('\\');

  return hasValidExtension && (isUrl || isRelativePath);
}

/**
 * Clear the avatar cache (useful for testing or forced refresh)
 */
export function clearAvatarCache() {
  avatarCache = null;
  cacheTimestamp = null;
}

/**
 * Get a display name from an avatar path
 * @param {string} avatarPath - Avatar path
 * @returns {string} Display name
 */
export function getAvatarDisplayName(avatarPath) {
  if (!avatarPath) {
    return 'Default Avatar';
  }

  // Extract filename from path
  const filename = avatarPath.split('/').pop();
  if (!filename) {
    return 'Avatar';
  }

  // Remove extension and format as display name
  const nameWithoutExtension = filename.split('.')[0];
  return nameWithoutExtension
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Avatar';
}

// Backward compatibility
export const DEFAULT_AVATAR_PATH = DEFAULT_AVATAR_URL;