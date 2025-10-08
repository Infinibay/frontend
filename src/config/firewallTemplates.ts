/**
 * Firewall Templates Configuration
 *
 * Defines pre-configured firewall rule bundles for common VM use cases.
 * Templates provide "2-click setup" for business owners while maintaining
 * technical accuracy for geeks.
 *
 * Templates are frontend-only abstractions - they generate individual
 * FirewallRule objects via the backend API when activated.
 */

import { SERVICE_PRESETS, ServicePreset } from './servicePresets';

export type FirewallTemplate = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  category: 'server' | 'desktop' | 'development' | 'database';
  servicePresets: string[]; // IDs of service presets to enable
  customRules?: TemplateRule[]; // Additional custom rules not in service presets
  priority: number; // Base priority for template rules
};

export type TemplateRule = {
  name: string;
  description: string;
  action: 'ACCEPT' | 'DROP' | 'REJECT';
  direction: 'IN' | 'OUT' | 'INOUT';
  priority: number;
  protocol: string;
  dstPortStart?: number;
  dstPortEnd?: number;
  srcIpAddr?: string;
  srcIpMask?: string;
  dstIpAddr?: string;
  dstIpMask?: string;
};

/**
 * All available firewall templates
 * Sorted alphabetically by category, then by name
 */
export const FIREWALL_TEMPLATES: FirewallTemplate[] = [
  // ==================== DATABASE SERVERS ====================
  {
    id: 'database-server',
    name: 'Database Server',
    displayName: 'Database Server',
    description: 'Secure configuration for database servers. Allows database access only, blocks unnecessary services. Ideal for MySQL, PostgreSQL, MongoDB servers.',
    icon: '🗄️',
    category: 'database',
    servicePresets: ['mysql', 'postgresql', 'mongodb', 'redis', 'ssh'],
    customRules: [
      {
        name: 'Block Incoming Web Traffic',
        description: 'Database servers should not serve web traffic',
        action: 'DROP',
        direction: 'IN',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 80,
        dstPortEnd: 80
      },
      {
        name: 'Block Incoming HTTPS',
        description: 'Database servers should not serve HTTPS traffic',
        action: 'DROP',
        direction: 'IN',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 443,
        dstPortEnd: 443
      }
    ],
    priority: 300
  },

  // ==================== DESKTOP ====================
  {
    id: 'desktop-basic',
    name: 'Desktop',
    displayName: 'Desktop (Basic)',
    description: 'Standard desktop configuration. Allows outbound web browsing, email, and file access. Blocks incoming connections except RDP/SSH for remote access.',
    icon: '🖥️',
    category: 'desktop',
    servicePresets: ['https', 'http', 'dns', 'rdp', 'smb'],
    customRules: [
      {
        name: 'Allow All Outbound',
        description: 'Desktop users need full outbound access',
        action: 'ACCEPT',
        direction: 'OUT',
        priority: 900,
        protocol: 'all'
      }
    ],
    priority: 500
  },
  {
    id: 'desktop-secure',
    name: 'Desktop Secure',
    displayName: 'Desktop (Secure)',
    description: 'Hardened desktop configuration. Only HTTPS and DNS outbound, RDP for remote access. Blocks HTTP and all file sharing protocols.',
    icon: '🔒',
    category: 'desktop',
    servicePresets: ['https', 'dns', 'rdp'],
    customRules: [
      {
        name: 'Block SMB/File Sharing',
        description: 'Prevent lateral movement attacks',
        action: 'DROP',
        direction: 'INOUT',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 445,
        dstPortEnd: 445
      },
      {
        name: 'Block Insecure HTTP',
        description: 'Force HTTPS only for security',
        action: 'DROP',
        direction: 'OUT',
        priority: 200,
        protocol: 'tcp',
        dstPortStart: 80,
        dstPortEnd: 80
      }
    ],
    priority: 500
  },

  // ==================== DEVELOPMENT ====================
  {
    id: 'development',
    name: 'Development',
    displayName: 'Development Environment',
    description: 'Permissive configuration for developers. Allows common development ports (8000-9000), databases, SSH, and full outbound access. Not recommended for production.',
    icon: '💻',
    category: 'development',
    servicePresets: ['https', 'http', 'dns', 'ssh', 'mysql', 'postgresql', 'mongodb', 'redis'],
    customRules: [
      {
        name: 'Allow Dev Server Ports',
        description: 'Common development server ports',
        action: 'ACCEPT',
        direction: 'INOUT',
        priority: 500,
        protocol: 'tcp',
        dstPortStart: 8000,
        dstPortEnd: 9000
      },
      {
        name: 'Allow NodeJS Debug',
        description: 'Node.js debugging port',
        action: 'ACCEPT',
        direction: 'IN',
        priority: 500,
        protocol: 'tcp',
        dstPortStart: 9229,
        dstPortEnd: 9229
      },
      {
        name: 'Allow All Outbound',
        description: 'Developers need unrestricted outbound access',
        action: 'ACCEPT',
        direction: 'OUT',
        priority: 900,
        protocol: 'all'
      }
    ],
    priority: 500
  },

  // ==================== WEB SERVERS ====================
  {
    id: 'web-server',
    name: 'Web Server',
    displayName: 'Web Server',
    description: 'Optimized for web hosting. Allows HTTP, HTTPS, SSH for administration. Blocks databases and file sharing. Ideal for Apache, Nginx, IIS servers.',
    icon: '🌐',
    category: 'server',
    servicePresets: ['https', 'http', 'dns', 'ssh'],
    customRules: [
      {
        name: 'Block Database Ports',
        description: 'Web servers should not expose databases',
        action: 'DROP',
        direction: 'IN',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 3306,
        dstPortEnd: 3306
      },
      {
        name: 'Block PostgreSQL',
        description: 'Web servers should not expose databases',
        action: 'DROP',
        direction: 'IN',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 5432,
        dstPortEnd: 5432
      },
      {
        name: 'Block MongoDB',
        description: 'Web servers should not expose databases',
        action: 'DROP',
        direction: 'IN',
        priority: 100,
        protocol: 'tcp',
        dstPortStart: 27017,
        dstPortEnd: 27017
      }
    ],
    priority: 400
  },
  {
    id: 'web-server-secure',
    name: 'Web Server Secure',
    displayName: 'Web Server (HTTPS Only)',
    description: 'Hardened web server configuration. Only HTTPS (no HTTP), SSH for administration. Forces encrypted connections only.',
    icon: '🔐',
    category: 'server',
    servicePresets: ['https', 'dns', 'ssh'],
    customRules: [
      {
        name: 'Block Insecure HTTP',
        description: 'Force HTTPS only',
        action: 'DROP',
        direction: 'IN',
        priority: 50,
        protocol: 'tcp',
        dstPortStart: 80,
        dstPortEnd: 80
      }
    ],
    priority: 400
  }
];

/**
 * Get template by ID
 */
export function getFirewallTemplate(id: string): FirewallTemplate | undefined {
  return FIREWALL_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all templates by category
 */
export function getFirewallTemplatesByCategory(
  category: FirewallTemplate['category']
): FirewallTemplate[] {
  return FIREWALL_TEMPLATES.filter(template => template.category === category);
}

/**
 * Get template categories with counts
 */
export function getTemplateCategories() {
  const categories = new Map<string, { label: string; count: number; icon: string }>();

  FIREWALL_TEMPLATES.forEach(template => {
    const existing = categories.get(template.category) || { label: '', count: 0, icon: '' };
    categories.set(template.category, {
      label: template.category.charAt(0).toUpperCase() + template.category.slice(1),
      count: existing.count + 1,
      icon: getCategoryIcon(template.category)
    });
  });

  return Array.from(categories.entries()).map(([id, data]) => ({ id, ...data }));
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    server: '🌐',
    desktop: '🖥️',
    development: '💻',
    database: '🗄️'
  };
  return icons[category] || '⚙️';
}

/**
 * Convert a template to individual firewall rules
 * This is called when user activates a template
 */
export function expandTemplateToRules(template: FirewallTemplate) {
  const rules: TemplateRule[] = [];

  // Add rules from service presets
  template.servicePresets.forEach(presetId => {
    const preset = SERVICE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    preset.rules.forEach(serviceRule => {
      rules.push({
        name: `${preset.displayName} - ${serviceRule.description}`,
        description: serviceRule.description,
        action: 'ACCEPT',
        direction: serviceRule.direction as 'IN' | 'OUT' | 'INOUT',
        priority: template.priority,
        protocol: serviceRule.protocol,
        dstPortStart: serviceRule.port || serviceRule.portRange?.start,
        dstPortEnd: serviceRule.port || serviceRule.portRange?.end
      });
    });
  });

  // Add custom rules from template
  if (template.customRules) {
    rules.push(...template.customRules);
  }

  return rules;
}

/**
 * Get summary of what a template enables/blocks
 */
export function getTemplateSummary(template: FirewallTemplate): {
  allowedServices: string[];
  blockedPorts: number[];
  totalRules: number;
} {
  const allowedServices = template.servicePresets
    .map(id => SERVICE_PRESETS.find(p => p.id === id)?.displayName)
    .filter(Boolean) as string[];

  const blockedPorts =
    template.customRules
      ?.filter(rule => rule.action === 'DROP' || rule.action === 'REJECT')
      .map(rule => rule.dstPortStart)
      .filter(Boolean) as number[] || [];

  const totalRules = expandTemplateToRules(template).length;

  return {
    allowedServices,
    blockedPorts,
    totalRules
  };
}
