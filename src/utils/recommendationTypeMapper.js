/**
 * Recommendation type mapper utility
 * Converts backend RecommendationType enum values to user-friendly display information
 */

import { Shield, Zap, AlertTriangle, HardDrive, Download, Settings, Info, Clock } from 'lucide-react';

// Priority levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Categories
export const CATEGORIES = {
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  MAINTENANCE: 'maintenance',
  STORAGE: 'storage',
  UPDATES: 'updates',
  GENERAL: 'general'
};

// Urgency badge configuration
export const URGENCY_BADGES = {
  IMMEDIATE: {
    text: 'URGENT',
    color: 'bg-red-600 text-white',
    borderColor: 'border-red-600',
    icon: AlertTriangle,
    animate: true
  },
  URGENT: {
    text: 'HIGH PRIORITY',
    color: 'bg-orange-500 text-white',
    borderColor: 'border-orange-500',
    icon: AlertTriangle,
    animate: false
  },
  SOON: {
    text: 'ATTENTION REQUIRED',
    color: 'bg-yellow-500 text-white',
    borderColor: 'border-yellow-500',
    icon: Clock,
    animate: false
  },
  NORMAL: {
    text: 'NORMAL',
    color: 'bg-blue-500 text-white',
    borderColor: 'border-blue-500',
    icon: Info,
    animate: false
  }
};

// Recommendation type mappings - aligned with backend schema
export const RECOMMENDATION_MAPPINGS = {
  // Security recommendations
  DEFENDER_DISABLED: {
    label: 'Windows Defender Disabled',
    description: 'Windows Defender is disabled, leaving your VM vulnerable to security threats.',
    detailedDescription: 'Windows Defender is your first line of defense against malware and security threats. When disabled, your VM is exposed to viruses, ransomware, and other threats.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Enable Windows Defender', 'Configure real-time protection'],
    userFriendlyExplanation: 'Your antivirus is turned off. This is dangerous because viruses can enter your computer. You should enable it immediately.',
    technicalDetails: 'Windows Defender provides real-time protection against malware, spyware, and other security threats.'
  },

  DEFENDER_THREAT: {
    label: 'Defender Threats Detected',
    description: 'Windows Defender has detected active threats or quarantined items.',
    detailedDescription: 'Security threats have been detected that require immediate attention to maintain system security.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Review detected threats', 'Run full scan', 'Clean quarantined items'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.threatCount > 0) {
        return `Your antivirus found ${metadata.threatCount} threat(s) on your computer. You should review and clean them immediately.`;
      }
      return 'Your antivirus found viruses or threats on your computer. You should review and clean them immediately.';
    },
    technicalDetails: 'Windows Defender has detected malware, spyware, or other threats that are active or quarantined.'
  },

  // Performance recommendations
  HIGH_CPU_APP: {
    label: 'High CPU Applications',
    description: 'Specific applications are consuming excessive CPU resources.',
    detailedDescription: 'Some applications are using more CPU than normal, which may slow down the system.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Identify problematic applications', 'Close unnecessary applications', 'Restart specific applications'],
    userFriendlyExplanation: 'Some programs are using too much of your computer\'s processing power. You should close the ones you don\'t need.',
    technicalDetails: 'Specific applications are consuming CPU resources above normal thresholds.'
  },

  HIGH_RAM_APP: {
    label: 'High Memory Applications',
    description: 'Specific applications are consuming excessive memory resources.',
    detailedDescription: 'Some applications are using more RAM than normal, affecting system performance.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Identify memory-consuming applications', 'Close unnecessary applications', 'Restart specific applications'],
    userFriendlyExplanation: 'Some programs are using too much of your computer\'s memory. You should close the ones you don\'t need.',
    technicalDetails: 'Specific applications are consuming memory resources above normal thresholds.'
  },

  // Storage recommendations
  DISK_SPACE_LOW: {
    label: 'Low Disk Space',
    description: 'There is little free space left on the disk, which may affect performance.',
    detailedDescription: 'When free space is less than 10%, the system may become unstable and slow.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.STORAGE,
    icon: HardDrive,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Delete unnecessary files', 'Clean temporary files', 'Move files to external storage'],
    userFriendlyExplanation: 'Your hard drive is almost full. This can cause problems. You should delete files you don\'t need.',
    technicalDetails: 'It is recommended to maintain at least 15% free space for optimal performance.'
  },

  // Update recommendations
  APP_UPDATE_AVAILABLE: {
    label: 'Application Updates Available',
    description: 'Updates are available for some installed applications.',
    detailedDescription: 'Application updates include security improvements, bug fixes, and new features.',
    priority: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      return metadata?.securityUpdateCount > 0 ? PRIORITY_LEVELS.HIGH : PRIORITY_LEVELS.MEDIUM;
    },
    category: CATEGORIES.UPDATES,
    icon: Download,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    actions: ['Review available updates', 'Install security updates', 'Schedule automatic updates'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.securityUpdateCount > 0) {
        return `You have ${metadata.securityUpdateCount} important security update(s). It\'s like updating apps on your phone - improves security and functionality.`;
      }
      return 'Some of your programs have new versions available. It\'s like updating apps on your phone - improves security and functionality.';
    },
    technicalDetails: 'Application updates include critical security patches and functionality improvements.'
  },

  OS_UPDATE_AVAILABLE: {
    label: 'System Updates Available',
    description: 'Critical or security updates are available.',
    detailedDescription: 'System updates include critical security patches and stability improvements that are essential for security.',
    priority: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      return metadata?.rebootDays >= 7 ? PRIORITY_LEVELS.CRITICAL : PRIORITY_LEVELS.HIGH;
    },
    category: CATEGORIES.UPDATES,
    icon: Download,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Install system updates', 'Schedule reboot', 'Review automatic updates'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.rebootDays >= 7) {
        return `URGENT - Your system has been waiting ${metadata.rebootDays} days for a reboot. Important updates are pending. Like getting vaccinated - it protects your computer from new problems. You should install them and reboot immediately.`;
      } else if (metadata?.rebootDays >= 3) {
        return `Your system has been waiting ${metadata.rebootDays} days for a reboot. Important updates are pending. You should install them and reboot soon.`;
      }
      return 'Important system updates are pending. Like getting vaccinated - it protects your computer from new problems. You should install them.';
    },
    technicalDetails: 'System updates include critical security patches that protect against known vulnerabilities.'
  },

  // Resource optimization recommendations
  OVER_PROVISIONED: {
    label: 'Over-Provisioned VM',
    description: 'VM resources (CPU/RAM) are consistently under-utilized.',
    detailedDescription: 'Your VM has more resources assigned than it actually needs, which can be optimized.',
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES.PERFORMANCE,
    icon: Settings,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    actions: ['Review resource usage', 'Consider reducing CPU/RAM', 'Optimize configuration'],
    userFriendlyExplanation: 'Your virtual machine has more power than it needs. You can optimize it to save resources.',
    technicalDetails: 'Assigned resources consistently exceed actual usage over extended periods.'
  },

  UNDER_PROVISIONED: {
    label: 'Under-Provisioned VM',
    description: 'VM resources are consistently over-utilized, affecting performance.',
    detailedDescription: 'Your VM needs more resources to function optimally due to consistently high usage.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Increase CPU/RAM', 'Review workload', 'Optimize applications'],
    userFriendlyExplanation: 'Your virtual machine needs more power to work well. Consider adding more resources.',
    technicalDetails: 'Resources are consistently over-utilized, causing performance degradation.'
  },

  // Network recommendations
  PORT_BLOCKED: {
    label: 'Blocked Ports',
    description: 'Firewall rules are blocking ports that applications are trying to use.',
    detailedDescription: 'Some applications cannot function properly due to firewall rules blocking their ports.',
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    actions: ['Review firewall rules', 'Configure exceptions', 'Verify affected applications'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.blockedPorts && metadata.blockedPorts.length > 0) {
        const port = metadata.blockedPorts[0];
        return `The program '${port.processName || 'Unknown'}' cannot communicate on port ${port.port} because the firewall is blocking it. You may need to adjust the configuration.`;
      }
      return 'Some programs cannot communicate because the firewall is blocking them. You may need to adjust the configuration.';
    },
    technicalDetails: 'Firewall rules are preventing legitimate network traffic from specific applications.'
  },

  // General recommendations
  OTHER: {
    label: 'General Recommendation',
    description: 'System recommendation that does not fit in other categories.',
    detailedDescription: 'This is a general system recommendation to improve performance.',
    priority: PRIORITY_LEVELS.LOW,
    category: CATEGORIES.GENERAL,
    icon: Info,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    actions: ['Review details', 'Apply recommendation'],
    userFriendlyExplanation: 'The system has a general recommendation to improve performance.',
    technicalDetails: 'Miscellaneous system recommendation.'
  }
};

// Type aliases for backend compatibility
RECOMMENDATION_MAPPINGS.SYSTEM_UPDATE_AVAILABLE = RECOMMENDATION_MAPPINGS.OS_UPDATE_AVAILABLE;

/**
 * Get recommendation display information
 * @param {string} type - Recommendation type
 * @param {Object} recommendation - Optional full recommendation object with data
 * @returns {Object} Display information object
 */
export const getRecommendationInfo = (type, recommendation = null) => {
  const mapping = RECOMMENDATION_MAPPINGS[type] || {
    label: type,
    description: 'System recommendation',
    priority: PRIORITY_LEVELS.LOW,
    category: CATEGORIES.GENERAL,
    icon: Info,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    userFriendlyExplanation: 'The system has a recommendation to improve performance.',
    technicalDetails: 'Technical information not available.'
  };

  // Resolve dynamic properties if recommendation is provided
  if (recommendation) {
    const resolved = { ...mapping };

    // Resolve dynamic priority
    if (typeof mapping.priority === 'function') {
      resolved.priority = mapping.priority(recommendation);
    }

    // Resolve dynamic userFriendlyExplanation
    if (typeof mapping.userFriendlyExplanation === 'function') {
      resolved.userFriendlyExplanation = mapping.userFriendlyExplanation(recommendation);
    }

    // Extract metadata and attach enhanced info
    const metadata = extractRecommendationMetadata(recommendation);
    if (metadata) {
      resolved.urgencyBadge = getUrgencyBadge(type, metadata);
      resolved.dataPreview = getDataPreview(type, metadata);
      resolved.affectedCount = getAffectedCount(type, metadata);
    }

    return resolved;
  }

  return mapping;
};

/**
 * Get priority level for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} Priority level
 */
export const getRecommendationPriority = (type) => {
  return getRecommendationInfo(type).priority;
};

/**
 * Get category for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} Category
 */
export const getRecommendationCategory = (type) => {
  return getRecommendationInfo(type).category;
};

/**
 * Get icon component for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {Component} Icon component
 */
export const getRecommendationIcon = (type) => {
  return getRecommendationInfo(type).icon;
};

/**
 * Get user-friendly explanation for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} User-friendly explanation
 */
export const getUserFriendlyExplanation = (type) => {
  return getRecommendationInfo(type).userFriendlyExplanation;
};

/**
 * Check if recommendation requires immediate action
 * @param {string} type - Recommendation type
 * @returns {boolean} True if requires immediate action
 */
export const requiresImmediateAction = (type) => {
  const priority = getRecommendationPriority(type);
  return priority === PRIORITY_LEVELS.CRITICAL;
};

/**
 * Get priority color classes
 * @param {string} priority - Priority level
 * @returns {Object} Color classes object
 */
export const getPriorityColors = (priority) => {
  const colorMap = {
    [PRIORITY_LEVELS.CRITICAL]: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    },
    [PRIORITY_LEVELS.HIGH]: {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    },
    [PRIORITY_LEVELS.MEDIUM]: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    [PRIORITY_LEVELS.LOW]: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  return colorMap[priority] || colorMap[PRIORITY_LEVELS.LOW];
};

/**
 * Check if a recommendation type is using fallback mapping
 * @param {string} type - Recommendation type
 * @returns {boolean} True if using fallback mapping
 */
export const isFallbackType = (type) => {
  return !RECOMMENDATION_MAPPINGS[type];
};

/**
 * Get category display information
 * @param {string} category - Category name
 * @returns {Object} Category display information
 */
export const getCategoryInfo = (category) => {
  const categoryMap = {
    [CATEGORIES.SECURITY]: {
      label: 'Security',
      description: 'Recommendations related to system protection and security',
      icon: Shield,
      color: 'text-red-600'
    },
    [CATEGORIES.PERFORMANCE]: {
      label: 'Performance',
      description: 'Recommendations to improve system speed and efficiency',
      icon: Zap,
      color: 'text-orange-600'
    },
    [CATEGORIES.MAINTENANCE]: {
      label: 'Maintenance',
      description: 'Preventive maintenance and optimization tasks',
      icon: Settings,
      color: 'text-blue-600'
    },
    [CATEGORIES.STORAGE]: {
      label: 'Storage',
      description: 'Disk space management and file cleanup',
      icon: HardDrive,
      color: 'text-purple-600'
    },
    [CATEGORIES.UPDATES]: {
      label: 'Updates',
      description: 'System, application, and driver updates',
      icon: Download,
      color: 'text-green-600'
    },
    [CATEGORIES.GENERAL]: {
      label: 'General',
      description: 'General system recommendations',
      icon: Info,
      color: 'text-muted-foreground'
    }
  };

  return categoryMap[category] || categoryMap[CATEGORIES.GENERAL];
};

/**
 * Extract recommendation metadata from data field
 * @param {Object} recommendation - Full recommendation object
 * @returns {Object} Extracted metadata
 */
export const extractRecommendationMetadata = (recommendation) => {
  if (!recommendation || !recommendation.data) {
    return null;
  }

  let data;
  try {
    data = typeof recommendation.data === 'string'
      ? JSON.parse(recommendation.data)
      : recommendation.data;
  } catch (error) {
    console.error('Failed to parse recommendation data:', error);
    return null;
  }

  const metadata = {};

  // OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE metadata
  if (recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') {
    metadata.rebootDays = data.rebootPendingDays || null;
    metadata.rebootUrgent = data.rebootUrgent || false;
    metadata.rebootRequiredSince = data.rebootRequiredSince || null;
    metadata.totalUpdates = data.totalUpdates || 0;
    metadata.criticalCount = data.criticalCount || 0;
    metadata.securityCount = data.securityCount || 0;
    metadata.importantCount = data.importantCount || 0;
    metadata.updateTitles = data.updateTitles || [];
    metadata.updates = data.updates || [];
  }

  // APP_UPDATE_AVAILABLE metadata
  if (recommendation.type === 'APP_UPDATE_AVAILABLE') {
    metadata.securityUpdateCount = data.security_updates || data.securityCount || 0;
    metadata.totalUpdateCount = data.total_updates || data.totalUpdates || 0;
    metadata.affectedApps = data.applications || data.apps || [];
  }

  // PORT_BLOCKED metadata
  if (recommendation.type === 'PORT_BLOCKED') {
    const blockedPorts = [];

    // Handle array of ports
    if (Array.isArray(data.ports)) {
      data.ports.forEach(portData => {
        blockedPorts.push({
          port: portData.port,
          protocol: portData.protocol,
          processName: portData.processName || 'Unknown',
          processId: portData.processId || null,
          ruleName: portData.ruleName || null,
          ruleAction: portData.ruleAction || null,
          blockReason: portData.blockReason || null,
          attemptCount: portData.attemptCount || 1,
          lastAttempt: portData.lastAttempt || null
        });
      });
    }
    // Handle single port (legacy format)
    else if (data.port && data.protocol) {
      blockedPorts.push({
        port: data.port,
        protocol: data.protocol,
        processName: data.processName || 'Unknown',
        processId: data.processId || null,
        ruleName: data.ruleName || null,
        ruleAction: data.ruleAction || null,
        blockReason: data.blockReason || null,
        attemptCount: data.attemptCount || 1,
        lastAttempt: data.lastAttempt || null
      });
    }

    metadata.blockedPorts = blockedPorts;
  }

  // DEFENDER_THREAT metadata
  if (recommendation.type === 'DEFENDER_THREAT') {
    metadata.activeThreats = data.active_threats || data.activeThreats || 0;
    metadata.quarantinedThreats = data.quarantined_threats || data.quarantinedThreats || 0;
    metadata.threatCount = (metadata.activeThreats || 0) + (metadata.quarantinedThreats || 0);
    metadata.lastScanTime = data.last_scan_time || data.lastScanTime || null;
  }

  // UNDER_PROVISIONED/OVER_PROVISIONED metadata
  if (recommendation.type === 'UNDER_PROVISIONED' || recommendation.type === 'OVER_PROVISIONED') {
    metadata.currentCPU = data.currentCPU || null;
    metadata.recommendedCPU = data.recommendedCPU || null;
    metadata.currentRAM = data.currentRAM || null;
    metadata.recommendedRAM = data.recommendedRAM || null;
    metadata.usagePattern = data.usagePattern || null;
  }

  return metadata;
};

/**
 * Get urgency badge for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {string|null} Urgency level or null
 */
const getUrgencyBadge = (type, metadata) => {
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays >= 7) {
    return 'IMMEDIATE';
  }
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays >= 3) {
    return 'URGENT';
  }
  if (type === 'DEFENDER_THREAT' && metadata.activeThreats > 0) {
    return 'IMMEDIATE';
  }
  if (type === 'APP_UPDATE_AVAILABLE' && metadata.securityUpdateCount > 0) {
    return 'URGENT';
  }
  if (type === 'PORT_BLOCKED') {
    return 'SOON';
  }
  return null;
};

/**
 * Get data preview text for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {string|null} Preview text or null
 */
const getDataPreview = (type, metadata) => {
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays) {
    return `Reboot pending ${metadata.rebootDays} days`;
  }
  if (type === 'APP_UPDATE_AVAILABLE' && metadata.securityUpdateCount > 0) {
    return `${metadata.securityUpdateCount} security updates`;
  }
  if (type === 'DEFENDER_THREAT' && metadata.threatCount > 0) {
    return `${metadata.threatCount} threat(s) detected`;
  }
  if (type === 'PORT_BLOCKED' && metadata.blockedPorts?.length > 0) {
    return `Port ${metadata.blockedPorts[0].port} blocked`;
  }
  return null;
};

/**
 * Get affected count for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {number|null} Count or null
 */
const getAffectedCount = (type, metadata) => {
  if (type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') {
    return metadata.totalUpdates || null;
  }
  if (type === 'APP_UPDATE_AVAILABLE') {
    return metadata.totalUpdateCount || null;
  }
  if (type === 'DEFENDER_THREAT') {
    return metadata.threatCount || null;
  }
  if (type === 'PORT_BLOCKED') {
    return metadata.blockedPorts?.length || null;
  }
  return null;
};

/**
 * Get reboot urgency text helper
 * @param {number} days - Days since reboot required
 * @returns {string} Urgency text
 */
export const getRebootUrgencyText = (days) => {
  if (days >= 7) {
    return `urgent - pending ${days} days`;
  } else if (days >= 3) {
    return `attention required - pending ${days} days`;
  } else if (days > 0) {
    return `pending ${days} day(s)`;
  }
  return '';
};