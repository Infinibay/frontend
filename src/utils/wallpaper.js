/**
 * Wallpaper management utilities for dynamic background changes
 */

/**
 * Updates CSS custom properties for wallpaper changes
 * @param {string} wallpaperUrl - URL or path to the wallpaper image
 * @param {string} theme - Current theme ('light' or 'dark')
 */
export const updateWallpaperCSS = (wallpaperUrl, theme = 'light') => {
  try {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.style.setProperty('--wallpaper-url-dark', `url('${wallpaperUrl}')`);
    } else {
      root.style.setProperty('--wallpaper-url', `url('${wallpaperUrl}')`);
    }
  } catch (error) {
    console.error('Failed to update wallpaper CSS:', error);
  }
};

// Cache for wallpapers
let wallpaperCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches available wallpapers from the backend API
 * @returns {Promise<Array>} Array of wallpaper objects
 */
export const fetchAvailableWallpapers = async () => {
  try {
    console.log('🖼️ fetchAvailableWallpapers: Fetching from /api/wallpapers');
    const response = await fetch('/api/wallpapers');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const wallpapers = await response.json();
    console.log('🖼️ fetchAvailableWallpapers: Received wallpapers:', wallpapers);

    // Update cache
    wallpaperCache = wallpapers;
    cacheTimestamp = Date.now();

    return wallpapers;
  } catch (error) {
    console.error('🖼️ fetchAvailableWallpapers: Failed to fetch wallpapers:', error);
    return [];
  }
};

/**
 * Checks if wallpaper cache is still valid
 * @returns {boolean} True if cache is valid
 */
export const isWallpaperCacheValid = () => {
  return wallpaperCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
};

/**
 * Returns cached wallpapers or fetches if not cached
 * @returns {Promise<Array>} Array of wallpaper objects
 */
export const getAvailableWallpapers = async () => {
  if (isWallpaperCacheValid()) {
    return wallpaperCache;
  }

  return await fetchAvailableWallpapers();
};

/**
 * Forces refresh of wallpaper cache
 * @returns {Promise<Array>} Array of wallpaper objects
 */
export const refreshWallpapers = async () => {
  wallpaperCache = null;
  cacheTimestamp = null;
  return await fetchAvailableWallpapers();
};

/**
 * Validates uploaded wallpaper files
 * @param {File} file - File object to validate
 * @returns {Object} Validation result with success flag and message
 */
export const validateWallpaperFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!file) {
    return { success: false, message: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: 'Invalid file type. Please use JPG, PNG, WebP, or GIF images.'
    };
  }

  if (file.size > maxSize) {
    return {
      success: false,
      message: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { success: true, message: 'File is valid' };
};

/**
 * Preloads wallpaper image for smooth transitions
 * @param {string} url - URL of the wallpaper to preload
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadWallpaper = (url) => {
  console.log('🖼️ preloadWallpaper: Attempting to preload:', url);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log('🖼️ preloadWallpaper: Successfully loaded:', url);
      resolve(img);
    };
    img.onerror = (error) => {
      console.error('🖼️ preloadWallpaper: Failed to load:', url, error);
      reject(new Error(`Failed to load wallpaper: ${url}`));
    };
    img.src = url;
  });
};

/**
 * Resets wallpaper to default for specified theme
 * @param {string} theme - Theme to reset ('light' or 'dark')
 */
export const resetToDefaultWallpaper = async (theme = 'light') => {
  try {
    const wallpapers = await getAvailableWallpapers();
    const defaultWallpaper = wallpapers.find(w => w.isDefault);
    if (defaultWallpaper) {
      updateWallpaperCSS(defaultWallpaper.url, theme);
    }
  } catch (error) {
    console.error('Failed to reset to default wallpaper:', error);
  }
};

/**
 * Formats wallpaper URL for CSS usage
 * @param {string} url - Raw URL or path
 * @returns {string} Properly formatted URL for CSS
 */
export const formatWallpaperUrl = (url) => {
  if (!url) return '';

  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Handle relative paths
  if (url.startsWith('/')) {
    return url;
  }

  // Add leading slash for relative paths
  return `/${url}`;
};

/**
 * Gets wallpaper category display name
 * @param {string} category - Category identifier
 * @returns {string} Display name for category
 */
export const getCategoryDisplayName = (category) => {
  const categoryNames = {
    abstract: 'Abstract',
    nature: 'Nature',
    minimal: 'Minimal',
    gradient: 'Gradient',
    geometric: 'Geometric'
  };

  return categoryNames[category] || 'Other';
};

/**
 * Applies wallpaper changes with smooth transition
 * @param {string} wallpaperUrl - URL of the new wallpaper
 * @param {string} theme - Current theme
 * @returns {Promise} Promise that resolves when transition is complete
 */
export const applyWallpaperWithTransition = async (wallpaperUrl, theme = 'light') => {
  try {
    // Preload the new wallpaper
    await preloadWallpaper(wallpaperUrl);

    // Update CSS with transition
    updateWallpaperCSS(wallpaperUrl, theme);

    // Return success
    return { success: true, message: 'Wallpaper applied successfully' };
  } catch (error) {
    console.error('Failed to apply wallpaper:', error);
    return { success: false, message: 'Failed to apply wallpaper' };
  }
};