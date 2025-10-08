/**
 * Service Presets Configuration
 *
 * Defines common network services with their ports, protocols, and security information.
 * These presets are used to create firewall rules with one-click activation.
 *
 * Following Infinibay philosophy: Simplify complex networking for business owners,
 * while providing clear technical details for geeks via tooltips.
 */

export type ServicePreset = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'web' | 'remote' | 'database' | 'email' | 'file' | 'other';
  icon: string;
  baseRiskLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
  rules: ServicePresetRule[];
};

export type ServicePresetRule = {
  protocol: string; // 'tcp', 'udp', 'icmp', 'all'
  port?: number;
  portRange?: { start: number; end: number };
  direction: 'IN' | 'OUT' | 'INOUT';
  description: string;
};

/**
 * All available service presets
 * Sorted alphabetically by category, then by name
 */
export const SERVICE_PRESETS: ServicePreset[] = [
  // ==================== WEB SERVICES ====================
  {
    id: 'http',
    name: 'HTTP',
    displayName: 'HTTP (Web)',
    description: 'Standard web traffic (port 80). Insecure - prefer HTTPS.',
    category: 'web',
    icon: '🌐',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 80,
        direction: 'INOUT',
        description: 'HTTP web traffic'
      }
    ]
  },
  {
    id: 'https',
    name: 'HTTPS',
    displayName: 'HTTPS (Secure Web)',
    description: 'Encrypted web traffic (port 443). Recommended for web servers.',
    category: 'web',
    icon: '🔒',
    baseRiskLevel: 'LOW',
    rules: [
      {
        protocol: 'tcp',
        port: 443,
        direction: 'INOUT',
        description: 'HTTPS encrypted web traffic'
      }
    ]
  },
  {
    id: 'dns',
    name: 'DNS',
    displayName: 'DNS',
    description: 'Domain Name System (port 53). Required for internet connectivity.',
    category: 'web',
    icon: '🔍',
    baseRiskLevel: 'MINIMAL',
    rules: [
      {
        protocol: 'udp',
        port: 53,
        direction: 'INOUT',
        description: 'DNS queries (UDP)'
      },
      {
        protocol: 'tcp',
        port: 53,
        direction: 'INOUT',
        description: 'DNS zone transfers (TCP)'
      }
    ]
  },

  // ==================== REMOTE ACCESS ====================
  {
    id: 'rdp',
    name: 'RDP',
    displayName: 'Remote Desktop (RDP)',
    description: 'Windows Remote Desktop Protocol (port 3389). High security risk if exposed to internet.',
    category: 'remote',
    icon: '🖥️',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 3389,
        direction: 'IN',
        description: 'RDP incoming connections'
      }
    ]
  },
  {
    id: 'ssh',
    name: 'SSH',
    displayName: 'SSH',
    description: 'Secure Shell (port 22). For remote server administration.',
    category: 'remote',
    icon: '⌨️',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 22,
        direction: 'IN',
        description: 'SSH remote access'
      }
    ]
  },

  // ==================== DATABASES ====================
  {
    id: 'mongodb',
    name: 'MongoDB',
    displayName: 'MongoDB',
    description: 'MongoDB database (port 27017). Should only be accessible from application servers.',
    category: 'database',
    icon: '🍃',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 27017,
        direction: 'IN',
        description: 'MongoDB database connections'
      }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL',
    displayName: 'MySQL/MariaDB',
    description: 'MySQL database (port 3306). Should only be accessible from application servers.',
    category: 'database',
    icon: '🐬',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 3306,
        direction: 'IN',
        description: 'MySQL database connections'
      }
    ]
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    displayName: 'PostgreSQL',
    description: 'PostgreSQL database (port 5432). Should only be accessible from application servers.',
    category: 'database',
    icon: '🐘',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 5432,
        direction: 'IN',
        description: 'PostgreSQL database connections'
      }
    ]
  },
  {
    id: 'redis',
    name: 'Redis',
    displayName: 'Redis',
    description: 'Redis cache/database (port 6379). Should only be accessible from application servers.',
    category: 'database',
    icon: '⚡',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 6379,
        direction: 'IN',
        description: 'Redis connections'
      }
    ]
  },

  // ==================== EMAIL ====================
  {
    id: 'imap',
    name: 'IMAP',
    displayName: 'IMAP',
    description: 'Internet Message Access Protocol (port 143). For email retrieval.',
    category: 'email',
    icon: '📧',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 143,
        direction: 'INOUT',
        description: 'IMAP email access'
      }
    ]
  },
  {
    id: 'pop3',
    name: 'POP3',
    displayName: 'POP3',
    description: 'Post Office Protocol v3 (port 110). For email retrieval.',
    category: 'email',
    icon: '📬',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 110,
        direction: 'INOUT',
        description: 'POP3 email access'
      }
    ]
  },
  {
    id: 'smtp',
    name: 'SMTP',
    displayName: 'SMTP',
    description: 'Simple Mail Transfer Protocol (port 25). For sending email.',
    category: 'email',
    icon: '✉️',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 25,
        direction: 'OUT',
        description: 'SMTP outgoing email'
      }
    ]
  },

  // ==================== FILE SHARING ====================
  {
    id: 'ftp',
    name: 'FTP',
    displayName: 'FTP',
    description: 'File Transfer Protocol (port 21). Insecure - prefer SFTP.',
    category: 'file',
    icon: '📁',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 21,
        direction: 'INOUT',
        description: 'FTP control connection'
      },
      {
        protocol: 'tcp',
        portRange: { start: 20, end: 20 },
        direction: 'INOUT',
        description: 'FTP data connection'
      }
    ]
  },
  {
    id: 'nfs',
    name: 'NFS',
    displayName: 'NFS',
    description: 'Network File System (port 2049). For Unix/Linux file sharing.',
    category: 'file',
    icon: '📂',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 2049,
        direction: 'INOUT',
        description: 'NFS file sharing'
      }
    ]
  },
  {
    id: 'sftp',
    name: 'SFTP',
    displayName: 'SFTP (SSH)',
    description: 'Secure File Transfer Protocol (port 22). Same as SSH.',
    category: 'file',
    icon: '🔐',
    baseRiskLevel: 'MEDIUM',
    rules: [
      {
        protocol: 'tcp',
        port: 22,
        direction: 'INOUT',
        description: 'SFTP secure file transfer'
      }
    ]
  },
  {
    id: 'smb',
    name: 'SMB',
    displayName: 'SMB/CIFS',
    description: 'Windows file sharing (ports 139, 445). High security risk.',
    category: 'file',
    icon: '🪟',
    baseRiskLevel: 'HIGH',
    rules: [
      {
        protocol: 'tcp',
        port: 139,
        direction: 'INOUT',
        description: 'NetBIOS Session Service'
      },
      {
        protocol: 'tcp',
        port: 445,
        direction: 'INOUT',
        description: 'SMB over TCP'
      }
    ]
  }
];

/**
 * Get service preset by ID
 */
export function getServicePreset(id: string): ServicePreset | undefined {
  return SERVICE_PRESETS.find(preset => preset.id === id);
}

/**
 * Get all service presets by category
 */
export function getServicePresetsByCategory(category: ServicePreset['category']): ServicePreset[] {
  return SERVICE_PRESETS.filter(preset => preset.category === category);
}

/**
 * Get service preset categories with counts
 */
export function getServiceCategories() {
  const categories = new Map<string, { label: string; count: number; icon: string }>();

  SERVICE_PRESETS.forEach(preset => {
    const existing = categories.get(preset.category) || { label: '', count: 0, icon: '' };
    categories.set(preset.category, {
      label: preset.category.charAt(0).toUpperCase() + preset.category.slice(1),
      count: existing.count + 1,
      icon: getCategoryIcon(preset.category)
    });
  });

  return Array.from(categories.entries()).map(([id, data]) => ({ id, ...data }));
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    web: '🌐',
    remote: '🖥️',
    database: '💾',
    email: '📧',
    file: '📁',
    other: '⚙️'
  };
  return icons[category] || '⚙️';
}
