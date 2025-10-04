/**
 * Generic Filter Categorization Utilities
 *
 * Provides functions for categorizing generic firewall filters by service type
 * and identifying critical filters that require admin privileges.
 */

/**
 * Filter categories with metadata
 * @constant {Object.<string, {name: string, icon: string, color: string, description: string}>}
 */
export const FILTER_CATEGORIES = {
  security: {
    name: 'Seguridad y Red',
    icon: '🛡️',
    color: 'red',
    description: 'Protección básica y seguridad de red'
  },
  web: {
    name: 'Servicios Web',
    icon: '🌐',
    color: 'blue',
    description: 'HTTP, HTTPS y servicios web'
  },
  remote: {
    name: 'Acceso Remoto',
    icon: '🔌',
    color: 'purple',
    description: 'SSH, RDP, VNC'
  },
  database: {
    name: 'Bases de Datos',
    icon: '💾',
    color: 'green',
    description: 'MySQL, PostgreSQL, MongoDB'
  },
  email: {
    name: 'Email',
    icon: '📧',
    color: 'yellow',
    description: 'SMTP, POP3, IMAP'
  },
  files: {
    name: 'Archivos',
    icon: '📁',
    color: 'orange',
    description: 'FTP, SMB, NFS'
  },
  infrastructure: {
    name: 'Infraestructura',
    icon: '⚙️',
    color: 'gray',
    description: 'DNS, NTP, DHCP'
  },
  other: {
    name: 'Otros',
    icon: '📦',
    color: 'slate',
    description: 'Servicios adicionales'
  }
};

/**
 * Critical filters that require admin privileges to unassign
 * Stored in lowercase for case-insensitive comparison
 * @constant {string[]}
 */
export const CRITICAL_FILTERS = ['basic security', 'dhcp'];

/**
 * Categorizes a filter based on its name
 * @param {string} filterName - The name of the filter
 * @returns {string} Category key
 */
export function categorizeFilter(filterName) {
  const name = filterName.toLowerCase();

  if (name.includes('security') || name.includes('arp') || name.includes('mac') ||
      name.includes('spoof') || name.includes('clean')) {
    return 'security';
  }

  if (name.includes('http') || name.includes('https') || name.includes('web')) {
    return 'web';
  }

  if (name.includes('ssh') || name.includes('rdp') || name.includes('vnc') ||
      name.includes('remote')) {
    return 'remote';
  }

  if (name.includes('mysql') || name.includes('postgres') || name.includes('mongo') ||
      name.includes('database') || name.includes('sql')) {
    return 'database';
  }

  if (name.includes('smtp') || name.includes('pop') || name.includes('imap') ||
      name.includes('mail') || name.includes('email')) {
    return 'email';
  }

  if (name.includes('ftp') || name.includes('smb') || name.includes('nfs') ||
      name.includes('samba') || name.includes('file')) {
    return 'files';
  }

  if (name.includes('dns') || name.includes('ntp') || name.includes('dhcp') ||
      name.includes('snmp')) {
    return 'infrastructure';
  }

  return 'other';
}

/**
 * Checks if a filter is critical (requires admin to unassign)
 * Case-insensitive comparison
 * @param {string} filterName - The name of the filter
 * @returns {boolean} True if filter is critical
 */
export function isCriticalFilter(filterName) {
  return CRITICAL_FILTERS.includes(filterName.toLowerCase());
}

/**
 * Gets theme-aware color classes for a category
 * @param {string} category - Category key
 * @param {string} theme - Current theme ('light' or 'dark')
 * @returns {{text: string, bg: string}} Tailwind color classes
 */
export function getCategoryColor(category, theme) {
  const colorMap = {
    red: {
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    blue: {
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    purple: {
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    green: {
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    yellow: {
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    orange: {
      text: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    gray: {
      text: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-900/30'
    },
    slate: {
      text: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-900/30'
    }
  };

  const categoryColor = FILTER_CATEGORIES[category]?.color || 'slate';
  return colorMap[categoryColor] || colorMap.slate;
}

/**
 * Gets the icon emoji for a category
 * @param {string} category - Category key
 * @returns {string} Icon emoji
 */
export function getCategoryIcon(category) {
  return FILTER_CATEGORIES[category]?.icon || '📦';
}
