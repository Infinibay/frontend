/**
 * Firewall Helper Utilities
 *
 * Functions for formatting, validating, and managing firewall rules.
 * Follows Infinibay philosophy: Hide complexity for business owners,
 * provide detailed information for geeks.
 */

import { createDebugger } from './debug';

const debug = createDebugger('frontend:utils:firewallHelpers');

// ==================== TYPES ====================

export type FirewallRule = {
  id: string;
  ruleSetId?: string;
  name: string;
  description?: string;
  action: 'ACCEPT' | 'DROP' | 'REJECT';
  direction: 'IN' | 'OUT' | 'INOUT';
  priority: number;
  protocol: string;
  srcPortStart?: number;
  srcPortEnd?: number;
  dstPortStart?: number;
  dstPortEnd?: number;
  srcIpAddr?: string;
  srcIpMask?: string;
  dstIpAddr?: string;
  dstIpMask?: string;
  connectionState?: Record<string, unknown>;
  overridesDept?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type RuleValidationError = {
  field: string;
  message: string;
};

export type RuleConflict = {
  type: 'DUPLICATE' | 'CONTRADICTORY' | 'PORT_OVERLAP' | 'PRIORITY_CONFLICT';
  message: string;
  conflictingRule: FirewallRule;
};

// ==================== FORMATTING ====================

/**
 * Get human-readable action label with icon and color
 */
export function getActionInfo(action: FirewallRule['action']): {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
} {
  const actionMap = {
    ACCEPT: {
      label: 'Allow',
      icon: '✅',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Traffic is permitted'
    },
    DROP: {
      label: 'Block (Silent)',
      icon: '🚫',
      color: 'text-red-700 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      description: 'Traffic is silently dropped without notification'
    },
    REJECT: {
      label: 'Block (Notify)',
      icon: '❌',
      color: 'text-orange-700 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      description: 'Traffic is blocked and sender is notified'
    }
  };

  return actionMap[action] || actionMap.DROP;
}

/**
 * Get human-readable direction label with icon
 */
export function getDirectionInfo(direction: FirewallRule['direction']): {
  label: string;
  icon: string;
  color: string;
  description: string;
} {
  const directionMap = {
    IN: {
      label: 'Incoming',
      icon: '↓',
      color: 'text-blue-600 dark:text-blue-400',
      description: 'Applies to incoming traffic to this VM'
    },
    OUT: {
      label: 'Outgoing',
      icon: '↑',
      color: 'text-purple-600 dark:text-purple-400',
      description: 'Applies to outgoing traffic from this VM'
    },
    INOUT: {
      label: 'Both Directions',
      icon: '↕',
      color: 'text-gray-600 dark:text-gray-400',
      description: 'Applies to both incoming and outgoing traffic'
    }
  };

  return directionMap[direction] || directionMap.IN;
}

/**
 * Get human-readable protocol label
 */
export function getProtocolInfo(protocol: string): {
  label: string;
  description: string;
} {
  const protocolMap: Record<string, { label: string; description: string }> = {
    tcp: { label: 'TCP', description: 'Transmission Control Protocol (reliable)' },
    udp: { label: 'UDP', description: 'User Datagram Protocol (fast)' },
    icmp: { label: 'ICMP', description: 'Internet Control Message Protocol (ping)' },
    all: { label: 'All Protocols', description: 'Applies to all protocol types' }
  };

  return (
    protocolMap[protocol.toLowerCase()] || {
      label: protocol.toUpperCase(),
      description: `Protocol: ${protocol}`
    }
  );
}

/**
 * Get human-readable port display with common service names
 */
export function getPortLabel(
  portStart?: number,
  portEnd?: number,
  protocol?: string
): string {
  if (!portStart) return 'Any Port';
  if (portStart === portEnd || !portEnd) {
    const serviceName = getCommonServiceName(portStart, protocol);
    return serviceName ? `${serviceName} (${portStart})` : `Port ${portStart}`;
  }
  return `Ports ${portStart}-${portEnd}`;
}

/**
 * Get common service name for well-known ports
 */
export function getCommonServiceName(port: number, protocol?: string): string | null {
  const services: Record<number, string> = {
    20: 'FTP Data',
    21: 'FTP',
    22: 'SSH/SFTP',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    445: 'SMB',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5900: 'VNC',
    6379: 'Redis',
    8080: 'HTTP Alt',
    27017: 'MongoDB'
  };

  return services[port] || null;
}

/**
 * Get priority label (LOW/MEDIUM/HIGH) from numeric priority
 */
export function getPriorityLabel(priority: number): {
  label: string;
  description: string;
  color: string;
} {
  if (priority < 300) {
    return {
      label: 'HIGH',
      description: 'Applied first (priority < 300)',
      color: 'text-red-600 dark:text-red-400'
    };
  }
  if (priority < 600) {
    return {
      label: 'MEDIUM',
      description: 'Standard priority (300-599)',
      color: 'text-yellow-600 dark:text-yellow-400'
    };
  }
  return {
    label: 'LOW',
    description: 'Applied last (priority ≥ 600)',
    color: 'text-green-600 dark:text-green-400'
  };
}

/**
 * Get numeric priority from label
 */
export function getPriorityFromLabel(label: 'LOW' | 'MEDIUM' | 'HIGH'): number {
  const priorityMap = {
    LOW: 800,
    MEDIUM: 500,
    HIGH: 200
  };
  return priorityMap[label];
}

/**
 * Format IP address/mask for display
 */
export function formatIpRange(ipAddr?: string, ipMask?: string): string {
  if (!ipAddr) return 'Any IP';
  if (!ipMask || ipMask === '255.255.255.255') return ipAddr;
  return `${ipAddr}/${ipMask}`;
}

// ==================== VALIDATION ====================

/**
 * Validate firewall rule input
 */
export function validateFirewallRule(rule: Partial<FirewallRule>): {
  isValid: boolean;
  errors: RuleValidationError[];
} {
  const errors: RuleValidationError[] = [];

  // Name is required
  if (!rule.name || rule.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Rule name is required'
    });
  }

  // Action is required
  if (!rule.action || !['ACCEPT', 'DROP', 'REJECT'].includes(rule.action)) {
    errors.push({
      field: 'action',
      message: 'Action must be ACCEPT, DROP, or REJECT'
    });
  }

  // Direction is required
  if (!rule.direction || !['IN', 'OUT', 'INOUT'].includes(rule.direction)) {
    errors.push({
      field: 'direction',
      message: 'Direction must be IN, OUT, or INOUT'
    });
  }

  // Priority is required and must be valid
  if (rule.priority === undefined || rule.priority === null) {
    errors.push({
      field: 'priority',
      message: 'Priority is required'
    });
  } else if (rule.priority < 0 || rule.priority > 1000) {
    errors.push({
      field: 'priority',
      message: 'Priority must be between 0 and 1000'
    });
  }

  // Protocol is required
  if (!rule.protocol || rule.protocol.trim() === '') {
    errors.push({
      field: 'protocol',
      message: 'Protocol is required'
    });
  }

  // Validate port range if specified
  if (rule.dstPortStart !== undefined) {
    if (rule.dstPortStart < 0 || rule.dstPortStart > 65535) {
      errors.push({
        field: 'dstPortStart',
        message: 'Port must be between 0 and 65535'
      });
    }
    if (rule.dstPortEnd && rule.dstPortEnd < rule.dstPortStart) {
      errors.push({
        field: 'dstPortEnd',
        message: 'End port must be greater than or equal to start port'
      });
    }
  }

  if (rule.srcPortStart !== undefined) {
    if (rule.srcPortStart < 0 || rule.srcPortStart > 65535) {
      errors.push({
        field: 'srcPortStart',
        message: 'Port must be between 0 and 65535'
      });
    }
    if (rule.srcPortEnd && rule.srcPortEnd < rule.srcPortStart) {
      errors.push({
        field: 'srcPortEnd',
        message: 'End port must be greater than or equal to start port'
      });
    }
  }

  // Validate IP addresses if specified
  if (rule.srcIpAddr && !isValidIpAddress(rule.srcIpAddr)) {
    errors.push({
      field: 'srcIpAddr',
      message: 'Invalid source IP address format'
    });
  }

  if (rule.dstIpAddr && !isValidIpAddress(rule.dstIpAddr)) {
    errors.push({
      field: 'dstIpAddr',
      message: 'Invalid destination IP address format'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate IP address format (simple IPv4 validation)
 */
function isValidIpAddress(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * Detect conflicts between a new rule and existing rules
 */
export function detectRuleConflicts(
  newRule: Partial<FirewallRule>,
  existingRules: FirewallRule[]
): RuleConflict[] {
  const conflicts: RuleConflict[] = [];

  existingRules.forEach(existing => {
    // Check for duplicate rules (same ports, protocol, direction)
    if (
      existing.protocol === newRule.protocol &&
      existing.direction === newRule.direction &&
      existing.dstPortStart === newRule.dstPortStart &&
      existing.dstPortEnd === newRule.dstPortEnd &&
      existing.srcPortStart === newRule.srcPortStart &&
      existing.srcPortEnd === newRule.srcPortEnd
    ) {
      if (existing.action === newRule.action) {
        conflicts.push({
          type: 'DUPLICATE',
          message: 'A duplicate rule already exists',
          conflictingRule: existing
        });
      } else {
        conflicts.push({
          type: 'CONTRADICTORY',
          message: `Conflicts with existing rule: ${existing.name} (${existing.action} vs ${newRule.action})`,
          conflictingRule: existing
        });
      }
    }

    // Check for port overlaps with contradictory actions
    if (
      existing.protocol === newRule.protocol &&
      existing.direction === newRule.direction &&
      existing.action !== newRule.action &&
      portsOverlap(
        existing.dstPortStart,
        existing.dstPortEnd,
        newRule.dstPortStart,
        newRule.dstPortEnd
      )
    ) {
      conflicts.push({
        type: 'PORT_OVERLAP',
        message: `Port range overlaps with "${existing.name}" but has different action`,
        conflictingRule: existing
      });
    }
  });

  return conflicts;
}

/**
 * Check if two port ranges overlap
 */
function portsOverlap(
  start1?: number,
  end1?: number,
  start2?: number,
  end2?: number
): boolean {
  if (!start1 || !start2) return false;
  const actualEnd1 = end1 || start1;
  const actualEnd2 = end2 || start2;

  return start1 <= actualEnd2 && start2 <= actualEnd1;
}

// ==================== RULE GROUPING & ANALYSIS ====================

/**
 * Group rules by origin (department vs VM)
 */
export function groupRulesByOrigin(
  effectiveRules: FirewallRule[],
  vmRules: FirewallRule[],
  departmentRules: FirewallRule[]
): {
  fromDepartment: FirewallRule[];
  fromVM: FirewallRule[];
  overrides: FirewallRule[];
} {
  const vmRuleIds = new Set(vmRules.map(r => r.id));
  const deptRuleIds = new Set(departmentRules.map(r => r.id));

  return {
    fromDepartment: effectiveRules.filter(r => deptRuleIds.has(r.id) && !r.overridesDept),
    fromVM: effectiveRules.filter(r => vmRuleIds.has(r.id) && !r.overridesDept),
    overrides: effectiveRules.filter(r => r.overridesDept === true)
  };
}

/**
 * Calculate security score based on rules (0-100)
 */
export function calculateSecurityScore(rules: FirewallRule[]): {
  score: number;
  level: 'UNCONFIGURED' | 'AT_RISK' | 'MODERATE' | 'SECURE';
  issues: string[];
} {
  let score = 50; // Start at moderate
  const issues: string[] = [];

  // No rules = unconfigured
  if (rules.length === 0) {
    return {
      score: 0,
      level: 'UNCONFIGURED',
      issues: ['No firewall rules configured']
    };
  }

  // Check for "allow all" rules
  const hasAllowAll = rules.some(
    r => r.action === 'ACCEPT' && r.protocol === 'all' && r.direction !== 'OUT'
  );
  if (hasAllowAll) {
    score -= 40;
    issues.push('⚠️ "Allow all" rule detected - high security risk');
  }

  // Check for inbound protection
  const hasInboundRules = rules.some(r => r.direction === 'IN' || r.direction === 'INOUT');
  if (!hasInboundRules) {
    score -= 20;
    issues.push('No inbound protection rules');
  }

  // Bonus for DROP/REJECT rules (shows active blocking)
  const hasBlockingRules = rules.some(r => r.action === 'DROP' || r.action === 'REJECT');
  if (hasBlockingRules) {
    score += 15;
  }

  // Bonus for multiple rules (shows deliberate configuration)
  if (rules.length >= 5) {
    score += 10;
  }

  // Check for high-risk ports exposed
  const highRiskPorts = [23, 445, 3389]; // Telnet, SMB, RDP
  const exposedRiskPorts = rules.filter(
    r =>
      r.action === 'ACCEPT' &&
      r.direction !== 'OUT' &&
      r.dstPortStart &&
      highRiskPorts.includes(r.dstPortStart)
  );
  if (exposedRiskPorts.length > 0) {
    score -= 10 * exposedRiskPorts.length;
    exposedRiskPorts.forEach(r => {
      const portName = getCommonServiceName(r.dstPortStart!) || r.dstPortStart;
      issues.push(`⚠️ High-risk port exposed: ${portName}`);
    });
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine security level
  let level: 'UNCONFIGURED' | 'AT_RISK' | 'MODERATE' | 'SECURE';
  if (score === 0) level = 'UNCONFIGURED';
  else if (score < 40) level = 'AT_RISK';
  else if (score < 70) level = 'MODERATE';
  else level = 'SECURE';

  debug.log('Security score calculated:', { score, level, issues });

  return { score, level, issues };
}

/**
 * Sort rules by priority (lower priority number = higher precedence)
 */
export function sortRulesByPriority(rules: FirewallRule[]): FirewallRule[] {
  return [...rules].sort((a, b) => a.priority - b.priority);
}

/**
 * Filter rules by search term
 */
export function filterRulesBySearch(rules: FirewallRule[], searchTerm: string): FirewallRule[] {
  if (!searchTerm.trim()) return rules;

  const term = searchTerm.toLowerCase();
  return rules.filter(rule => {
    const nameMatch = rule.name.toLowerCase().includes(term);
    const descMatch = rule.description?.toLowerCase().includes(term);
    const protocolMatch = rule.protocol.toLowerCase().includes(term);
    const portMatch = rule.dstPortStart?.toString().includes(term);
    const actionMatch = rule.action.toLowerCase().includes(term);

    return nameMatch || descMatch || protocolMatch || portMatch || actionMatch;
  });
}
