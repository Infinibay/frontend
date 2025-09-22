/**
 * Utility functions for firewall operations and data transformation
 */

// Normalization helpers for backend/frontend value mapping
/**
 * Normalize action values from backend to frontend
 */
export const normalizeAction = (action) => {
  if (!action) return 'allow';
  const normalized = action.toLowerCase();
  switch (normalized) {
    case 'accept': return 'allow';
    case 'drop': return 'deny';
    case 'reject': return 'reject';
    case 'audit': return 'log';
    case 'logging': return 'log';
    case 'watch': return 'monitor';
    case 'observe': return 'monitor';
    case 'throttle': return 'rate_limit';
    case 'limit': return 'rate_limit';
    case 'isolate': return 'quarantine';
    case 'contain': return 'quarantine';
    case 'forward': return 'redirect';
    case 'route': return 'redirect';
    case 'analyze': return 'inspect';
    case 'scan': return 'inspect';
    default: return normalized;
  }
};

/**
 * Normalize direction values from backend to frontend
 */
export const normalizeDirection = (direction) => {
  if (!direction) return 'inbound';
  const normalized = direction.toLowerCase();
  switch (normalized) {
    case 'in': return 'inbound';
    case 'out': return 'outbound';
    case 'inout': return 'bidirectional';
    case 'both': return 'bidirectional';
    case 'all': return 'any';
    case '*': return 'any';
    case 'localhost': return 'local';
    case 'loopback': return 'local';
    case 'fwd': return 'forward';
    case 'route': return 'forward';
    default: return normalized;
  }
};

/**
 * Denormalize action values from frontend to backend
 *
 * Backend action mapping assumptions:
 * - Backend supports: ACCEPT, DROP, REJECT (confirmed)
 * - Advanced actions (log, monitor, rate_limit, etc.) are mapped to closest backend equivalent
 * - 'redirect' maps to 'accept' since backend doesn't support FORWARD as an action
 * - Use SUPPORTED_ACTION_KEYS in components to limit to backend-supported actions
 */
export const denormalizeAction = (action) => {
  if (!action) return 'accept';
  const normalized = action.toLowerCase();
  switch (normalized) {
    case 'allow': return 'accept';
    case 'deny': return 'drop';
    case 'reject': return 'reject';
    // Advanced actions - map to closest backend equivalent
    case 'log': return 'accept'; // Log + allow behavior
    case 'monitor': return 'accept'; // Monitor + allow behavior
    case 'rate_limit': return 'accept'; // Rate limit + allow behavior
    case 'quarantine': return 'drop'; // Quarantine = drop for backend
    case 'redirect': return 'accept'; // Redirect handled at app level, allow at firewall level
    case 'inspect': return 'accept'; // Inspect + allow behavior
    default: return normalized;
  }
};

/**
 * Denormalize direction values from frontend to backend
 */
export const denormalizeDirection = (direction) => {
  if (!direction) return 'in';
  const normalized = direction.toLowerCase();
  switch (normalized) {
    case 'inbound': return 'in';
    case 'outbound': return 'out';
    case 'bidirectional': return 'inout';
    case 'any': return 'all';
    case 'local': return 'localhost';
    case 'forward': return 'fwd';
    default: return normalized;
  }
};

// Common service definitions with default ports
export const COMMON_SERVICES = {
  web: {
    name: 'Web Server',
    description: 'Allows HTTP and HTTPS access for websites',
    ports: [
      { port: '80', protocol: 'tcp', name: 'HTTP' },
      { port: '443', protocol: 'tcp', name: 'HTTPS' }
    ]
  },
  ssh: {
    name: 'SSH Remote Access',
    description: 'Allows secure remote connection via SSH',
    ports: [
      { port: '22', protocol: 'tcp', name: 'SSH' }
    ]
  },
  database: {
    name: 'Database Server',
    description: 'Allows access to common databases',
    ports: [
      { port: '3306', protocol: 'tcp', name: 'MySQL' },
      { port: '5432', protocol: 'tcp', name: 'PostgreSQL' },
      { port: '1433', protocol: 'tcp', name: 'SQL Server' },
      { port: '27017', protocol: 'tcp', name: 'MongoDB' }
    ]
  },
  ftp: {
    name: 'FTP Server',
    description: 'Allows file transfer via FTP/SFTP',
    ports: [
      { port: '21', protocol: 'tcp', name: 'FTP' },
      { port: '22', protocol: 'tcp', name: 'SFTP' }
    ]
  },
  email: {
    name: 'Mail Server',
    description: 'Allows email services',
    ports: [
      { port: '25', protocol: 'tcp', name: 'SMTP' },
      { port: '110', protocol: 'tcp', name: 'POP3' },
      { port: '143', protocol: 'tcp', name: 'IMAP' },
      { port: '993', protocol: 'tcp', name: 'IMAPS' },
      { port: '995', protocol: 'tcp', name: 'POP3S' }
    ]
  },
  dns: {
    name: 'DNS Server',
    description: 'Allows domain name resolution',
    ports: [
      { port: '53', protocol: 'tcp', name: 'DNS TCP' },
      { port: '53', protocol: 'udp', name: 'DNS UDP' }
    ]
  },
  rdp: {
    name: 'Remote Desktop',
    description: 'Allows Windows remote desktop connection',
    ports: [
      { port: '3389', protocol: 'tcp', name: 'RDP' }
    ]
  },
  vnc: {
    name: 'VNC (Remote Desktop)',
    description: 'Allows VNC connection for remote desktop',
    ports: [
      { port: '5900', protocol: 'tcp', name: 'VNC' }
    ]
  }
};

// Protocol definitions
export const PROTOCOLS = {
  tcp: { name: 'TCP', description: 'Reliable protocol for web applications and data transfer' },
  udp: { name: 'UDP', description: 'Fast protocol for streaming and real-time gaming' },
  icmp: { name: 'ICMP', description: 'Protocol for network diagnostics (ping)' }
};

// Action definitions with descriptions
export const ACTIONS = {
  allow: {
    name: 'Allow',
    description: 'Allows traffic matching this rule',
    color: 'green',
    icon: '✅',
    risk: 'high'
  },
  deny: {
    name: 'Deny',
    description: 'Silently blocks traffic matching this rule',
    color: 'red',
    icon: '🚫',
    risk: 'low'
  },
  reject: {
    name: 'Reject',
    description: 'Blocks traffic and sends a rejection response',
    color: 'orange',
    icon: '⛔',
    risk: 'low'
  },
  log: {
    name: 'Log',
    description: 'Logs traffic without blocking for audit and monitoring',
    color: 'blue',
    icon: '📝',
    risk: 'minimal',
    requiresAdditional: false
  },
  monitor: {
    name: 'Monitor',
    description: 'Monitors traffic and generates alerts without affecting flow',
    color: 'purple',
    icon: '👁️',
    risk: 'minimal',
    requiresAdditional: false
  },
  rate_limit: {
    name: 'Rate Limit',
    description: 'Limits traffic speed to prevent overload',
    color: 'yellow',
    icon: '⏱️',
    risk: 'medium',
    requiresAdditional: true,
    additionalFields: ['rateLimit', 'timeWindow']
  },
  quarantine: {
    name: 'Quarantine',
    description: 'Isolates suspicious traffic in a controlled environment',
    color: 'amber',
    icon: '🔒',
    risk: 'medium',
    requiresAdditional: false
  },
  redirect: {
    name: 'Redirect',
    description: 'Redirects traffic to another address or port',
    color: 'indigo',
    icon: '↩️',
    risk: 'medium',
    requiresAdditional: true,
    additionalFields: ['redirectTarget']
  },
  inspect: {
    name: 'Inspect',
    description: 'Performs deep packet inspection before processing',
    color: 'teal',
    icon: '🔍',
    risk: 'low',
    requiresAdditional: false
  }
};

// Direction definitions
export const DIRECTIONS = {
  inbound: {
    name: 'Inbound',
    description: 'Traffic arriving at the virtual machine from outside',
    icon: '⬇️',
    color: 'red',
    risk: 'high'
  },
  outbound: {
    name: 'Outbound',
    description: 'Traffic leaving the virtual machine to the outside',
    icon: '⬆️',
    color: 'blue',
    risk: 'medium'
  },
  bidirectional: {
    name: 'Bidirectional',
    description: 'Traffic that can flow in both directions',
    icon: '↕️',
    color: 'purple',
    risk: 'high'
  },
  any: {
    name: 'Any',
    description: 'Applies to all traffic regardless of direction',
    icon: '🌐',
    color: 'orange',
    risk: 'high'
  },
  local: {
    name: 'Local',
    description: 'Local traffic within the virtual machine (localhost)',
    icon: '🏠',
    color: 'green',
    risk: 'low'
  },
  forward: {
    name: 'Forward',
    description: 'Traffic forwarded or routed through the virtual machine',
    icon: '🔄',
    color: 'amber',
    risk: 'medium'
  }
};

/**
 * Derive origin from sources array
 */
export const getOriginFromSources = (sources) => {
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return 'custom';
  }
  return sources.some(source => source.includes('template')) ? 'template' : 'custom';
};

/**
 * Generate display name from rule description or auto-generate one
 */
export const getDisplayName = (rule) => {
  if (rule.description && rule.description.trim().length > 0) {
    return rule.description;
  }
  return generateRuleDescription(rule);
};

/**
 * Format a firewall rule for display with normalization
 */
export const formatRuleForDisplay = (rule) => {
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  const protocol = PROTOCOLS[rule.protocol?.toLowerCase()] || { name: rule.protocol?.toUpperCase() || 'UNKNOWN' };
  const action = ACTIONS[normalizedAction.toLowerCase()] || { name: normalizedAction || 'UNKNOWN' };
  const direction = DIRECTIONS[normalizedDirection.toLowerCase()] || { name: normalizedDirection || 'UNKNOWN' };

  return {
    ...rule,
    // Normalized fields for UI
    normalizedAction,
    normalizedDirection,
    origin: getOriginFromSources(rule.sources),
    displayName: getDisplayName(rule),
    enabled: true, // Default to enabled since backend doesn't have this field

    // Formatted display values
    formattedProtocol: protocol.name,
    formattedAction: action.name,
    formattedDirection: direction.name,
    actionColor: action.color,
    actionIcon: action.icon,
    directionIcon: direction.icon,
    portDisplay: formatPortDisplay(rule.port),
    sourceDisplay: 'Any IP', // Default since sourceIp not available
    destinationDisplay: 'Any IP' // Default since destinationIp not available
  };
};

/**
 * Format port for display
 */
export const formatPortDisplay = (port) => {
  if (!port) return 'Any port';
  if (port === '*') return 'Any port';
  if (port.includes('-')) return `Ports ${port}`;
  if (port.includes(',')) return `Ports ${port}`;
  return `Port ${port}`;
};

/**
 * Format IP address for display
 */
export const formatIPDisplay = (ip) => {
  if (!ip) return 'Any IP';
  if (ip === '*' || ip === '0.0.0.0/0') return 'Any IP';
  return ip;
};

/**
 * Generate user-friendly description for a firewall rule with normalization
 */
export const generateRuleDescription = (rule) => {
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  const action = ACTIONS[normalizedAction?.toLowerCase()]?.name || normalizedAction;
  const direction = DIRECTIONS[normalizedDirection?.toLowerCase()]?.name.toLowerCase() || normalizedDirection;
  const protocol = PROTOCOLS[rule.protocol?.toLowerCase()]?.name || rule.protocol?.toUpperCase();
  const port = formatPortDisplay(rule.port);

  let description = `${action} ${direction} traffic`;

  if (rule.protocol) {
    description += ` using ${protocol}`;
  }

  if (rule.port && rule.port !== '*' && rule.port !== 'all') {
    description += ` on ${port.toLowerCase()}`;
  }

  return description;
};

/**
 * Validate port range or single port
 */
export const isValidPort = (port) => {
  if (!port || port === '*') return true;

  // Handle port ranges (e.g., "80-90")
  if (port.includes('-')) {
    const [start, end] = port.split('-').map(p => parseInt(p.trim()));
    return start >= 1 && end <= 65535 && start <= end;
  }

  // Handle port lists (e.g., "80,443,8080")
  if (port.includes(',')) {
    const ports = port.split(',').map(p => parseInt(p.trim()));
    return ports.every(p => p >= 1 && p <= 65535);
  }

  // Handle single port
  const portNum = parseInt(port);
  return portNum >= 1 && portNum <= 65535;
};

/**
 * Validate IP address or CIDR notation
 */
export const isValidIP = (ip) => {
  if (!ip || ip === '*' || ip === '0.0.0.0/0') return true;

  // Basic IPv4 validation with optional CIDR
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  if (!ipv4Regex.test(ip)) return false;

  const [address, cidr] = ip.split('/');
  const octets = address.split('.').map(octet => parseInt(octet));

  // Validate octets
  if (!octets.every(octet => octet >= 0 && octet <= 255)) return false;

  // Validate CIDR if present
  if (cidr) {
    const cidrNum = parseInt(cidr);
    if (cidrNum < 0 || cidrNum > 32) return false;
  }

  return true;
};

/**
 * Validate firewall rule configuration
 */
export const validateRule = (rule) => {
  const errors = [];
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  if (!rule.name || rule.name.trim().length === 0) {
    errors.push('Rule name is required');
  }

  if (!rule.action) {
    errors.push('Action is required');
  } else {
    const actionConfig = ACTIONS[normalizedAction];

    // Validate actions that require additional parameters
    if (actionConfig && actionConfig.requiresAdditional) {
      if (normalizedAction === 'rate_limit') {
        if (!rule.rateLimit || isNaN(rule.rateLimit) || rule.rateLimit <= 0) {
          errors.push('Rate limit must be a positive number');
        }
        if (!rule.timeWindow || isNaN(rule.timeWindow) || rule.timeWindow <= 0) {
          errors.push('Time window must be a positive number (seconds)');
        }
      }

      if (normalizedAction === 'redirect') {
        if (!rule.redirectTarget || rule.redirectTarget.trim().length === 0) {
          errors.push('Redirect target is required');
        } else {
          const target = rule.redirectTarget.trim();
          const [host, portStr] = target.split(':');
          const portOk = !!portStr && isValidPort(portStr);
          const hostOk = !!host && isValidIP(host);
          if (!hostOk || !portOk) {
            errors.push('Redirect target must have valid IP:port format');
          }
        }
      }
    }
  }

  if (!rule.direction) {
    errors.push('Direction is required');
  } else {
    // Validate direction-specific constraints
    if ((normalizedDirection === 'bidirectional' || normalizedDirection === 'any') && normalizedAction === 'allow') {
      errors.push('Bidirectional and any-direction rules with "allow" action represent a high security risk');
    }
  }

  if (rule.protocol && !['tcp', 'udp', 'icmp'].includes(rule.protocol.toLowerCase())) {
    errors.push('Protocol must be TCP, UDP, or ICMP');
  }

  if (rule.port && !isValidPort(rule.port)) {
    errors.push('Port is not valid (must be between 1-65535)');
  }

  if (rule.sourceIp && !isValidIP(rule.sourceIp)) {
    errors.push('Source IP is not valid');
  }

  if (rule.destinationIp && !isValidIP(rule.destinationIp)) {
    errors.push('Destination IP is not valid');
  }

  // Validate invalid action-direction combinations
  if (normalizedAction === 'log' && normalizedDirection === 'local') {
    errors.push('Local traffic logging is not useful for auditing');
  }

  if ((normalizedAction === 'quarantine' || normalizedAction === 'redirect') && normalizedDirection === 'outbound') {
    errors.push('Quarantine and redirection are more effective on inbound traffic');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate security risk level for a rule with normalization
 */
export const calculateRiskLevel = (rule) => {
  let risk = 0;

  const normalizedDirection = normalizeDirection(rule.direction);
  const normalizedAction = normalizeAction(rule.action);

  // Direction risk assessment
  switch (normalizedDirection) {
    case 'inbound':
      risk += 2; // Higher risk for inbound traffic
      break;
    case 'bidirectional':
    case 'any':
      risk += 4; // Very high risk for bidirectional and any direction
      break;
    case 'outbound':
    case 'forward':
      risk += 1; // Medium risk for outbound/forward
      break;
    case 'local':
      risk += 0; // Low risk for local traffic
      break;
  }

  // Action risk assessment
  switch (normalizedAction) {
    case 'allow':
      risk += 3; // High risk for allow actions
      break;
    case 'log':
    case 'monitor':
      risk += 0; // No additional risk for logging/monitoring
      break;
    case 'rate_limit':
    case 'quarantine':
      risk += 1; // Low additional risk for rate limiting/quarantine
      break;
    case 'redirect':
      risk += 2; // Medium risk for redirection
      break;
    case 'inspect':
      risk += 0; // No additional risk for inspection
      break;
    case 'deny':
    case 'reject':
      risk -= 1; // Lower risk for blocking actions
      break;
  }

  // Higher risk for common attack ports
  const riskyPorts = ['22', '23', '80', '443', '3389', '5900', '21', '25', '53', '135', '139', '445'];
  if (rule.port && riskyPorts.includes(rule.port.toString())) risk += 1;

  // Higher risk for port ranges
  if (rule.port && rule.port.includes('-')) risk += 2;

  // Higher risk for all ports
  if (!rule.port || rule.port === '*' || rule.port === 'all') risk += 3;

  // Additional risk factors for specific combinations
  if (normalizedAction === 'allow' && (normalizedDirection === 'bidirectional' || normalizedDirection === 'any')) {
    risk += 2; // Extra risk for allowing bidirectional/any traffic
  }

  if (normalizedAction === 'redirect' && !rule.redirectTarget) {
    risk += 1; // Risk for redirect without proper target
  }

  if (normalizedAction === 'rate_limit' && (!rule.rateLimit || rule.rateLimit > 1000)) {
    risk += 1; // Risk for high rate limits or no limit specified
  }

  // Ensure risk doesn't go below 0
  risk = Math.max(0, risk);

  if (risk >= 10) return { level: 'critical', label: 'Critical Risk', color: 'red' };
  if (risk >= 7) return { level: 'high', label: 'High Risk', color: 'orange' };
  if (risk >= 4) return { level: 'medium', label: 'Medium Risk', color: 'yellow' };
  if (risk >= 2) return { level: 'low', label: 'Low Risk', color: 'green' };
  return { level: 'minimal', label: 'Minimal Risk', color: 'blue' };
};

/**
 * Sort rules by priority (most restrictive first) with normalization
 */
export const sortRulesByPriority = (rules) => {
  return [...rules].sort((a, b) => {
    const aNormalizedAction = normalizeAction(a.action);
    const bNormalizedAction = normalizeAction(b.action);
    const aNormalizedDirection = normalizeDirection(a.direction);
    const bNormalizedDirection = normalizeDirection(b.direction);
    const aOrigin = getOriginFromSources(a.sources);
    const bOrigin = getOriginFromSources(b.sources);

    // Deny/Reject rules first
    if (aNormalizedAction === 'allow' && (bNormalizedAction === 'deny' || bNormalizedAction === 'reject')) return 1;
    if ((aNormalizedAction === 'deny' || aNormalizedAction === 'reject') && bNormalizedAction === 'allow') return -1;

    // More specific rules first (fewer wildcards)
    const aWildcards = countWildcards(a);
    const bWildcards = countWildcards(b);
    if (aWildcards !== bWildcards) return aWildcards - bWildcards;

    // Inbound rules before outbound
    if (aNormalizedDirection === 'inbound' && bNormalizedDirection === 'outbound') return -1;
    if (aNormalizedDirection === 'outbound' && bNormalizedDirection === 'inbound') return 1;

    // Custom rules before template rules
    if (aOrigin === 'custom' && bOrigin === 'template') return -1;
    if (aOrigin === 'template' && bOrigin === 'custom') return 1;

    return 0;
  });
};

/**
 * Count wildcards in a rule (for priority sorting)
 */
const countWildcards = (rule) => {
  let count = 0;
  if (!rule.port || rule.port === '*' || rule.port === 'all') count++;
  // Note: sourceIp/destinationIp not available in backend schema, so we don't count them
  return count;
};

/**
 * Filter rules by various criteria with normalization
 */
export const filterRules = (rules, filters) => {
  return rules.filter(rule => {
    const normalizedAction = normalizeAction(rule.action);
    const normalizedDirection = normalizeDirection(rule.direction);
    const origin = getOriginFromSources(rule.sources);
    const displayName = getDisplayName(rule);

    // Default enabled to true since backend doesn't have this field
    if (filters.enabled !== undefined && filters.enabled !== true) return false;
    if (filters.direction && normalizedDirection !== filters.direction) return false;
    if (filters.action && normalizedAction !== filters.action) return false;
    if (filters.protocol && rule.protocol !== filters.protocol) return false;
    if (filters.origin && origin !== filters.origin) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const searchFields = [
        displayName,
        rule.description,
        rule.port,
        rule.protocol,
        normalizedAction,
        normalizedDirection
      ].filter(Boolean);

      if (!searchFields.some(field => field.toString().toLowerCase().includes(search))) {
        return false;
      }
    }
    return true;
  });
};

// Protocol-specific port suggestions
export const TCP_COMMON_PORTS = {
  web: [
    { port: '80', name: 'HTTP', description: 'Web server (unencrypted)' },
    { port: '443', name: 'HTTPS', description: 'Secure web server (encrypted)' },
    { port: '8080', name: 'Alt HTTP', description: 'Alternative web server port' },
    { port: '8443', name: 'Alt HTTPS', description: 'Alternative secure web port' }
  ],
  database: [
    { port: '3306', name: 'MySQL', description: 'MySQL database server' },
    { port: '5432', name: 'PostgreSQL', description: 'PostgreSQL database server' },
    { port: '1433', name: 'SQL Server', description: 'Microsoft SQL Server' },
    { port: '27017', name: 'MongoDB', description: 'MongoDB NoSQL database' },
    { port: '6379', name: 'Redis', description: 'Redis in-memory database' }
  ],
  remote: [
    { port: '22', name: 'SSH', description: 'Secure shell remote access' },
    { port: '3389', name: 'RDP', description: 'Windows Remote Desktop' },
    { port: '5900', name: 'VNC', description: 'VNC remote desktop' },
    { port: '23', name: 'Telnet', description: 'Telnet (insecure, avoid)' }
  ],
  mail: [
    { port: '25', name: 'SMTP', description: 'Email sending' },
    { port: '587', name: 'SMTP TLS', description: 'Secure email sending' },
    { port: '110', name: 'POP3', description: 'Email retrieval' },
    { port: '143', name: 'IMAP', description: 'Email access' },
    { port: '993', name: 'IMAPS', description: 'Secure email access' }
  ],
  file: [
    { port: '21', name: 'FTP', description: 'File transfer (insecure)' },
    { port: '22', name: 'SFTP', description: 'Secure file transfer' },
    { port: '445', name: 'SMB', description: 'Windows file sharing' },
    { port: '2049', name: 'NFS', description: 'Network file system' }
  ]
};

export const UDP_COMMON_PORTS = {
  network: [
    { port: '53', name: 'DNS', description: 'Domain name resolution' },
    { port: '67', name: 'DHCP Server', description: 'IP address assignment' },
    { port: '68', name: 'DHCP Client', description: 'IP address request' },
    { port: '123', name: 'NTP', description: 'Time synchronization' }
  ],
  streaming: [
    { port: '1935', name: 'RTMP', description: 'Real-time streaming' },
    { port: '5004', name: 'RTP', description: 'Real-time protocol' },
    { port: '5060', name: 'SIP', description: 'Voice over IP signaling' }
  ],
  gaming: [
    { port: '27015', name: 'Source Engine', description: 'Steam games' },
    { port: '7777', name: 'Unreal', description: 'Unreal Tournament' },
    { port: '25565', name: 'Minecraft', description: 'Minecraft server' }
  ]
};

/**
 * Get protocol-specific port suggestions
 */
export const getProtocolPortSuggestions = (protocol) => {
  const normalizedProtocol = protocol?.toLowerCase();

  switch (normalizedProtocol) {
    case 'tcp':
      return Object.values(TCP_COMMON_PORTS).flat();
    case 'udp':
      return Object.values(UDP_COMMON_PORTS).flat();
    case 'icmp':
      return []; // ICMP doesn't use ports
    default:
      return [];
  }
};

/**
 * Get port description for a specific port
 */
export const getPortDescription = (port, protocol = 'tcp') => {
  const allPorts = getProtocolPortSuggestions(protocol);
  const portInfo = allPorts.find(p => p.port === port.toString());
  return portInfo ? `${portInfo.name} - ${portInfo.description}` : null;
};

/**
 * Check if a port is well-known (1-1023)
 */
export const isWellKnownPort = (port) => {
  const portNum = parseInt(port);
  return portNum >= 1 && portNum <= 1023;
};

/**
 * Enhanced field-level validation functions
 */
export const validatePortRange = (port) => {
  if (!port || port === '*' || port === 'all') {
    return { isValid: true, suggestion: 'Consider specifying specific ports for better security' };
  }

  // Handle port ranges
  if (port.includes('-')) {
    const [start, end] = port.split('-').map(p => parseInt(p.trim()));
    if (isNaN(start) || isNaN(end)) {
      return { isValid: false, error: 'Port range must contain valid numbers', example: '80-90' };
    }
    if (start < 1 || end > 65535) {
      return { isValid: false, error: 'Ports must be between 1-65535', example: '1024-2048' };
    }
    if (start > end) {
      return { isValid: false, error: 'Start port must be less than end port', example: '80-443' };
    }
    if (end - start > 1000) {
      return { isValid: true, warning: 'Large port ranges may impact security', suggestion: 'Consider limiting to specific ports' };
    }
    return { isValid: true };
  }

  // Handle port lists
  if (port.includes(',')) {
    const ports = port.split(',').map(p => parseInt(p.trim()));
    const invalidPorts = ports.filter(p => isNaN(p) || p < 1 || p > 65535);
    if (invalidPorts.length > 0) {
      return { isValid: false, error: 'All ports must be between 1-65535', example: '80,443,8080' };
    }
    if (ports.length > 10) {
      return { isValid: true, warning: 'Many ports specified', suggestion: 'Consider using port ranges' };
    }
    return { isValid: true };
  }

  // Handle single port
  const portNum = parseInt(port);
  if (isNaN(portNum)) {
    return { isValid: false, error: 'Port must be a number', example: '80' };
  }
  if (portNum < 1 || portNum > 65535) {
    return { isValid: false, error: 'Port must be between 1-65535', example: '80' };
  }
  if (portNum < 1024) {
    return { isValid: true, warning: 'Well-known port', suggestion: 'Ensure this service should be accessible' };
  }
  return { isValid: true };
};

/**
 * Enhanced IP address validation with CIDR support
 */
export const validateIPAddress = (ip) => {
  if (!ip || ip === '*' || ip === '0.0.0.0/0' || ip === 'any') {
    return { isValid: true, warning: 'Any IP allowed', suggestion: 'Consider restricting to specific networks' };
  }

  // Check for common formats
  const commonFormats = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12'];

  // IPv4 with optional CIDR validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  if (!ipv4Regex.test(ip)) {
    return {
      isValid: false,
      error: 'Invalid IP format',
      example: 'Examples: 192.168.1.100, 192.168.1.0/24, 10.0.0.0/8'
    };
  }

  const [address, cidr] = ip.split('/');
  const octets = address.split('.').map(octet => parseInt(octet));

  // Validate octets
  const invalidOctets = octets.filter(octet => isNaN(octet) || octet < 0 || octet > 255);
  if (invalidOctets.length > 0) {
    return { isValid: false, error: 'IP octets must be 0-255', example: '192.168.1.100' };
  }

  // Validate CIDR if present
  if (cidr) {
    const cidrNum = parseInt(cidr);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      return { isValid: false, error: 'CIDR must be 0-32', example: '192.168.1.0/24' };
    }
  }

  // Check for private networks
  const firstOctet = octets[0];
  const secondOctet = octets[1];
  if (firstOctet === 192 && secondOctet === 168) {
    return { isValid: true, info: 'Private network (192.168.x.x)' };
  }
  if (firstOctet === 10) {
    return { isValid: true, info: 'Private network (10.x.x.x)' };
  }
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
    return { isValid: true, info: 'Private network (172.16-31.x.x)' };
  }
  if (firstOctet === 127) {
    return { isValid: true, info: 'Localhost/loopback address' };
  }

  return { isValid: true, warning: 'Public IP address', suggestion: 'Ensure this is intended' };
};

/**
 * Validate priority with recommendations
 */
export const validatePriority = (priority) => {
  if (!priority && priority !== 0) {
    return { isValid: true, suggestion: 'Priority will be auto-assigned' };
  }

  const priorityNum = parseInt(priority);
  if (isNaN(priorityNum)) {
    return { isValid: false, error: 'Priority must be a number', example: '100' };
  }

  if (priorityNum < 0 || priorityNum > 1000) {
    return { isValid: false, error: 'Priority must be 0-1000', example: '100' };
  }

  if (priorityNum < 50) {
    return { isValid: true, info: 'High priority rule (processed first)' };
  }
  if (priorityNum > 800) {
    return { isValid: true, info: 'Low priority rule (processed last)' };
  }

  return { isValid: true };
};

/**
 * Check for dangerous rule combinations
 */
export const validateRuleCombination = (rule) => {
  const warnings = [];
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  // High-risk combinations
  if (normalizedAction === 'allow' && normalizedDirection === 'inbound' && (!rule.port || rule.port === '*')) {
    warnings.push({
      type: 'danger',
      message: 'Allowing all inbound traffic is extremely risky',
      suggestion: 'Specify specific ports or use a more restrictive action'
    });
  }

  if (normalizedAction === 'allow' && normalizedDirection === 'bidirectional') {
    warnings.push({
      type: 'warning',
      message: 'Bidirectional allow rules create security vulnerabilities',
      suggestion: 'Consider separate inbound and outbound rules'
    });
  }

  if (normalizedAction === 'allow' && rule.port === '22' && (!rule.sourceIp || rule.sourceIp === '*')) {
    warnings.push({
      type: 'danger',
      message: 'SSH access from any IP is a common attack vector',
      suggestion: 'Restrict source IP to trusted networks'
    });
  }

  if (normalizedAction === 'allow' && ['3389', '5900'].includes(rule.port)) {
    warnings.push({
      type: 'warning',
      message: 'Remote desktop access should be carefully controlled',
      suggestion: 'Use VPN or restrict source IPs'
    });
  }

  return warnings;
};

/**
 * Get validation suggestions based on field values
 */
export const getValidationSuggestions = (field, value, rule = {}) => {
  switch (field) {
    case 'port':
      return validatePortRange(value);
    case 'sourceIp':
    case 'destinationIp':
      return validateIPAddress(value);
    case 'priority':
      return validatePriority(value);
    default:
      return { isValid: true };
  }
};

/**
 * Suggest ports for common services
 */
export const suggestPortsForService = (service) => {
  const serviceMap = {
    web: [{ port: '80', name: 'HTTP' }, { port: '443', name: 'HTTPS' }],
    database: [{ port: '3306', name: 'MySQL' }, { port: '5432', name: 'PostgreSQL' }],
    remote: [{ port: '22', name: 'SSH' }, { port: '3389', name: 'RDP' }],
    mail: [{ port: '25', name: 'SMTP' }, { port: '143', name: 'IMAP' }],
    dns: [{ port: '53', name: 'DNS' }]
  };

  return serviceMap[service] || [];
};

/**
 * Suggest priority based on rule type
 */
export const suggestPriorityForRule = (rule) => {
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  // Security rules should have high priority
  if (normalizedAction === 'deny' || normalizedAction === 'reject') {
    return { priority: 10, reason: 'Security rules should be processed first' };
  }

  // Allow rules for critical services
  if (normalizedAction === 'allow' && ['22', '80', '443'].includes(rule.port)) {
    return { priority: 50, reason: 'Critical service access' };
  }

  // General allow rules
  if (normalizedAction === 'allow') {
    return { priority: 100, reason: 'Standard allow rule' };
  }

  // Monitoring rules can be lower priority
  if (normalizedAction === 'log' || normalizedAction === 'monitor') {
    return { priority: 200, reason: 'Monitoring rules can be processed later' };
  }

  return { priority: 100, reason: 'Default priority' };
};

/**
 * Get common IP ranges for suggestions
 */
export const getCommonIPRanges = () => {
  return [
    { ip: '192.168.1.0/24', name: 'Home Network', description: 'Common home router range' },
    { ip: '192.168.0.0/24', name: 'Home Network Alt', description: 'Alternative home range' },
    { ip: '10.0.0.0/24', name: 'Private Network', description: 'Small private network' },
    { ip: '10.0.0.0/8', name: 'Large Private', description: 'Large private network' },
    { ip: '172.16.0.0/12', name: 'Medium Private', description: 'Medium private network' },
    { ip: '127.0.0.1/32', name: 'Localhost', description: 'Local machine only' }
  ];
};

/**
 * Generate rule preview text
 */
export const generateRulePreview = (rule) => {
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);
  const protocol = rule.protocol?.toUpperCase() || 'ANY';
  const port = rule.port || 'any port';
  const sourceIp = rule.sourceIp || 'any source';
  const destinationIp = rule.destinationIp || 'any destination';

  let preview = `${normalizedAction.toUpperCase()} ${normalizedDirection} ${protocol} traffic`;

  if (rule.port && rule.port !== '*') {
    preview += ` on port ${port}`;
  }

  if (rule.sourceIp && rule.sourceIp !== '*') {
    preview += ` from ${sourceIp}`;
  }

  if (rule.destinationIp && rule.destinationIp !== '*') {
    preview += ` to ${destinationIp}`;
  }

  return preview;
};

/**
 * Detect conflicts with existing rules
 */
export const detectRuleConflicts = (newRule, existingRules) => {
  const conflicts = [];

  existingRules.forEach((existing, index) => {
    const newNormalizedAction = normalizeAction(newRule.action);
    const existingNormalizedAction = normalizeAction(existing.action);
    const newNormalizedDirection = normalizeDirection(newRule.direction);
    const existingNormalizedDirection = normalizeDirection(existing.direction);

    // Check for contradictory rules
    if (
      newRule.protocol === existing.protocol &&
      newRule.port === existing.port &&
      newNormalizedDirection === existingNormalizedDirection &&
      newNormalizedAction !== existingNormalizedAction
    ) {
      conflicts.push({
        type: 'contradiction',
        message: `Conflicts with rule ${index + 1}: same conditions but different actions`,
        existingRule: existing
      });
    }

    // Check for redundant rules
    if (
      newRule.protocol === existing.protocol &&
      newRule.port === existing.port &&
      newNormalizedDirection === existingNormalizedDirection &&
      newNormalizedAction === existingNormalizedAction
    ) {
      conflicts.push({
        type: 'duplicate',
        message: `Duplicate of rule ${index + 1}`,
        existingRule: existing
      });
    }
  });

  return conflicts;
};

/**
 * Enhanced risk assessment
 */
export const getRiskExplanation = (riskLevel) => {
  const explanations = {
    critical: {
      title: 'Critical Risk',
      description: 'This rule creates significant security vulnerabilities',
      recommendations: [
        'Review if this rule is absolutely necessary',
        'Consider more restrictive alternatives',
        'Add additional security measures if required',
        'Monitor traffic closely if implemented'
      ]
    },
    high: {
      title: 'High Risk',
      description: 'This rule may expose your system to security threats',
      recommendations: [
        'Limit source IP addresses to trusted networks',
        'Restrict port ranges to only necessary ports',
        'Consider using VPN for remote access',
        'Implement additional monitoring'
      ]
    },
    medium: {
      title: 'Medium Risk',
      description: 'This rule has moderate security implications',
      recommendations: [
        'Ensure proper access controls are in place',
        'Monitor for unusual traffic patterns',
        'Consider time-based restrictions if applicable'
      ]
    },
    low: {
      title: 'Low Risk',
      description: 'This rule poses minimal security risk',
      recommendations: [
        'Standard monitoring is sufficient',
        'Review periodically for continued relevance'
      ]
    },
    minimal: {
      title: 'Minimal Risk',
      description: 'This rule is generally safe',
      recommendations: [
        'No special security measures required'
      ]
    }
  };

  return explanations[riskLevel.level] || explanations.minimal;
};

/**
 * Get suggested alternatives for high-risk configurations
 */
export const getSuggestedAlternatives = (rule) => {
  const suggestions = [];
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  if (normalizedAction === 'allow' && normalizedDirection === 'inbound' && (!rule.port || rule.port === '*')) {
    suggestions.push({
      title: 'Specify Exact Ports',
      description: 'Instead of allowing all ports, specify only the ports you need',
      example: 'Port 80 for web, 443 for HTTPS, 22 for SSH'
    });
  }

  if (normalizedAction === 'allow' && (!rule.sourceIp || rule.sourceIp === '*')) {
    suggestions.push({
      title: 'Restrict Source IPs',
      description: 'Limit access to trusted IP addresses or networks',
      example: '192.168.1.0/24 for local network, specific IPs for remote access'
    });
  }

  if (normalizedAction === 'allow' && normalizedDirection === 'bidirectional') {
    suggestions.push({
      title: 'Separate Direction Rules',
      description: 'Create separate rules for inbound and outbound traffic',
      example: 'One rule for inbound connections, another for outbound responses'
    });
  }

  return suggestions;
};

/**
 * Check if combination is high-risk
 */
export const isHighRiskCombination = (rule) => {
  const normalizedAction = normalizeAction(rule.action);
  const normalizedDirection = normalizeDirection(rule.direction);

  // Allow all inbound traffic
  if (normalizedAction === 'allow' && normalizedDirection === 'inbound' && (!rule.port || rule.port === '*')) {
    return true;
  }

  // Allow bidirectional traffic
  if (normalizedAction === 'allow' && normalizedDirection === 'bidirectional') {
    return true;
  }

  // SSH from any IP
  if (normalizedAction === 'allow' && rule.port === '22' && (!rule.sourceIp || rule.sourceIp === '*')) {
    return true;
  }

  return false;
};

/**
 * Get field dependencies (which fields should be enabled/disabled)
 */
export const getFieldDependencies = (rule) => {
  const dependencies = {
    sourcePort: true,
    destinationPort: true,
    rateLimit: false,
    timeWindow: false,
    redirectTarget: false
  };

  // ICMP doesn't use ports
  if (rule.protocol === 'icmp') {
    dependencies.sourcePort = false;
    dependencies.destinationPort = false;
  }

  // Rate limiting fields
  if (normalizeAction(rule.action) === 'rate_limit') {
    dependencies.rateLimit = true;
    dependencies.timeWindow = true;
  }

  // Redirect fields
  if (normalizeAction(rule.action) === 'redirect') {
    dependencies.redirectTarget = true;
  }

  return dependencies;
};

/**
 * Check if port fields should be disabled
 */
export const shouldDisablePortFields = (protocol) => {
  return protocol?.toLowerCase() === 'icmp';
};

/**
 * Get conditional fields based on action
 */
export const getConditionalFields = (action) => {
  const normalizedAction = normalizeAction(action);
  const fields = [];

  if (normalizedAction === 'rate_limit') {
    fields.push(
      { name: 'rateLimit', label: 'Rate Limit (requests/second)', type: 'number', required: true },
      { name: 'timeWindow', label: 'Time Window (seconds)', type: 'number', required: true }
    );
  }

  if (normalizedAction === 'redirect') {
    fields.push(
      { name: 'redirectTarget', label: 'Redirect Target (IP:Port)', type: 'text', required: true }
    );
  }

  return fields;
};

/**
 * Get context-aware placeholder text
 */
export const getFieldPlaceholders = (field, rule = {}) => {
  const placeholders = {
    port: rule.protocol === 'icmp' ? 'N/A (ICMP doesn\'t use ports)' : 'e.g., 80, 443, 80-90',
    sourceIp: 'e.g., 192.168.1.0/24, 10.0.0.0/8, *',
    destinationIp: 'e.g., 192.168.1.100, 10.0.0.0/8, *',
    priority: 'e.g., 100 (lower = higher priority)',
    name: 'e.g., Allow web traffic',
    description: 'e.g., Allows HTTP and HTTPS traffic for web server'
  };

  return placeholders[field] || '';
};

/**
 * Get helpful tooltips for each field
 */
export const getFieldTooltips = () => {
  return {
    direction: {
      title: 'Traffic Direction',
      content: 'Inbound: traffic coming TO your VM (e.g., web requests). Outbound: traffic FROM your VM (e.g., downloads). Choose based on who initiates the connection.'
    },
    action: {
      title: 'Rule Action',
      content: 'Allow: permits traffic. Deny: silently blocks traffic. Reject: blocks and sends rejection. Advanced actions provide additional security features.'
    },
    protocol: {
      title: 'Network Protocol',
      content: 'TCP: reliable, ordered delivery (web, email, files). UDP: fast, unordered (streaming, gaming, DNS). ICMP: network diagnostics (ping).'
    },
    port: {
      title: 'Network Ports',
      content: 'Ports are like numbered doors for services. Common: 80 (HTTP), 443 (HTTPS), 22 (SSH), 25 (email). Use ranges like 80-90 or lists like 80,443.'
    },
    sourceIp: {
      title: 'Source IP Address',
      content: 'Where traffic originates. Use CIDR notation (192.168.1.0/24) for networks. * means any IP. Restrict to trusted networks for security.'
    },
    destinationIp: {
      title: 'Destination IP Address',
      content: 'Where traffic is going. Usually your VM\'s IP or network. Use CIDR notation for network ranges. * means any destination.'
    },
    priority: {
      title: 'Rule Priority',
      content: 'Lower numbers = higher priority (processed first). Deny rules should be high priority (low numbers). Typical range: 1-1000.'
    }
  };
};

/**
 * Get detailed protocol explanations
 */
export const getProtocolExplanation = (protocol) => {
  const explanations = {
    tcp: {
      title: 'TCP (Transmission Control Protocol)',
      description: 'Reliable, connection-oriented protocol that ensures data arrives in order',
      useCases: ['Web browsing (HTTP/HTTPS)', 'Email (SMTP, IMAP)', 'File transfers (FTP, SFTP)', 'Remote access (SSH, RDP)'],
      characteristics: ['Reliable delivery', 'Error checking', 'Ordered packets', 'Connection-based']
    },
    udp: {
      title: 'UDP (User Datagram Protocol)',
      description: 'Fast, connectionless protocol optimized for speed over reliability',
      useCases: ['Video streaming', 'Online gaming', 'DNS queries', 'Voice calls (VoIP)'],
      characteristics: ['Fast transmission', 'No error checking', 'Unordered packets', 'Connectionless']
    },
    icmp: {
      title: 'ICMP (Internet Control Message Protocol)',
      description: 'Network diagnostic protocol used for error reporting and network testing',
      useCases: ['Ping commands', 'Traceroute', 'Network error reporting', 'Path MTU discovery'],
      characteristics: ['No ports used', 'Network diagnostics', 'Error reporting', 'Network management']
    }
  };

  return explanations[protocol?.toLowerCase()] || null;
};

/**
 * Get detailed direction explanations with examples
 */
export const getDirectionExplanation = (direction) => {
  const explanations = {
    inbound: {
      title: 'Inbound Traffic',
      description: 'Traffic arriving at your VM from external sources',
      examples: [
        'Web requests from users to your web server',
        'SSH connections from administrators',
        'Email delivery to your mail server',
        'API calls to your application'
      ],
      securityNote: 'Higher risk - external traffic trying to access your services'
    },
    outbound: {
      title: 'Outbound Traffic',
      description: 'Traffic leaving your VM to external destinations',
      examples: [
        'Your VM downloading software updates',
        'Sending emails from your application',
        'API calls to external services',
        'Database connections to remote servers'
      ],
      securityNote: 'Medium risk - your VM accessing external resources'
    },
    bidirectional: {
      title: 'Bidirectional Traffic',
      description: 'Traffic that can flow in both directions',
      examples: [
        'VPN connections',
        'P2P file sharing',
        'Video conferencing',
        'Real-time collaboration'
      ],
      securityNote: 'High risk - allows unrestricted two-way communication'
    }
  };

  return explanations[direction?.toLowerCase()] || null;
};

/**
 * Get detailed action explanations with security implications
 */
export const getActionExplanation = (action) => {
  const normalizedAction = normalizeAction(action);
  return ACTIONS[normalizedAction] || null;
};

/**
 * Get port explanation with common examples
 */
export const getPortExplanation = () => {
  return {
    title: 'Network Ports',
    description: 'Ports are virtual endpoints that identify specific services on a computer',
    concepts: {
      wellKnown: {
        title: 'Well-Known Ports (1-1023)',
        description: 'Reserved for system services',
        examples: ['80 (HTTP)', '443 (HTTPS)', '22 (SSH)', '25 (SMTP)']
      },
      registered: {
        title: 'Registered Ports (1024-49151)',
        description: 'Used by applications and services',
        examples: ['3306 (MySQL)', '5432 (PostgreSQL)', '8080 (Alt HTTP)']
      },
      dynamic: {
        title: 'Dynamic Ports (49152-65535)',
        description: 'Used for temporary connections',
        examples: ['Temporary client connections', 'Ephemeral ports']
      }
    },
    formats: {
      single: { example: '80', description: 'Single port' },
      range: { example: '80-90', description: 'Port range' },
      list: { example: '80,443,8080', description: 'Multiple ports' },
      wildcard: { example: '*', description: 'All ports' }
    }
  };
};

/**
 * Get IP addressing explanation with CIDR notation
 */
export const getIPExplanation = () => {
  return {
    title: 'IP Addresses and Networks',
    description: 'IP addresses identify devices on networks, CIDR notation defines network ranges',
    formats: {
      single: {
        example: '192.168.1.100',
        description: 'Single IP address'
      },
      cidr: {
        example: '192.168.1.0/24',
        description: 'Network with 256 addresses (192.168.1.0 to 192.168.1.255)'
      },
      wildcard: {
        example: '*',
        description: 'Any IP address'
      }
    },
    privateNetworks: {
      home: { range: '192.168.0.0/16', description: 'Home and small office networks' },
      enterprise: { range: '10.0.0.0/8', description: 'Large enterprise networks' },
      medium: { range: '172.16.0.0/12', description: 'Medium-sized networks' },
      localhost: { range: '127.0.0.0/8', description: 'Local machine only' }
    },
    cidrExamples: {
      '/32': 'Single host (1 address)',
      '/24': 'Small network (256 addresses)',
      '/16': 'Medium network (65,536 addresses)',
      '/8': 'Large network (16,777,216 addresses)'
    }
  };
};

/**
 * Get auto-completion data for common source IPs
 */
export const getCommonSourceIPs = () => {
  return [
    { ip: '192.168.1.0/24', name: 'Local Network', description: 'Common home/office network' },
    { ip: '10.0.0.0/8', name: 'Private Network', description: 'Large private network' },
    { ip: '172.16.0.0/12', name: 'Corporate Network', description: 'Medium corporate network' },
    { ip: '127.0.0.1', name: 'Localhost', description: 'Local machine only' },
    { ip: '*', name: 'Any Source', description: 'Allow from anywhere (risky)' }
  ];
};

/**
 * Get auto-completion data for common destination IPs
 */
export const getCommonDestinationIPs = () => {
  return [
    { ip: '192.168.1.0/24', name: 'Local Network', description: 'Local network range' },
    { ip: '10.0.0.0/24', name: 'VM Network', description: 'VM subnet' },
    { ip: '*', name: 'Any Destination', description: 'Any destination IP' },
    { ip: '0.0.0.0/0', name: 'Internet', description: 'Any internet destination' }
  ];
};

/**
 * Get common port range suggestions
 */
export const getPortRangeSuggestions = () => {
  return [
    { range: '80-443', name: 'Web Ports', description: 'HTTP and HTTPS' },
    { range: '8000-8999', name: 'Development', description: 'Common development ports' },
    { range: '3000-3999', name: 'Node.js Apps', description: 'Common Node.js application ports' },
    { range: '5000-5999', name: 'Services', description: 'Common service ports' },
    { range: '1024-65535', name: 'User Ports', description: 'All non-system ports' }
  ];
};

/**
 * Get rule description templates
 */
export const getDescriptionTemplates = () => {
  return {
    web: 'Allow web traffic (HTTP/HTTPS)',
    ssh: 'Allow SSH remote access',
    database: 'Allow database connections',
    email: 'Allow email server traffic',
    dns: 'Allow DNS resolution',
    block_all: 'Block all unauthorized traffic',
    monitor: 'Monitor suspicious activity',
    rate_limit: 'Rate limit high-volume traffic'
  };
};

/**
 * Generate Spanish explanations for firewall concepts
 */
export const getFirewallConcepts = () => {
  return {
    firewall: {
      title: 'What is a Firewall?',
      content: 'A firewall is like a security guard for your virtual machine. It decides what network traffic can enter and leave your VM, blocking unauthorized connections.'
    },
    inbound: {
      title: 'Inbound Traffic',
      content: 'This is traffic that arrives at your VM from other computers or the internet. For example, when someone visits your website.'
    },
    outbound: {
      title: 'Outbound Traffic',
      content: 'This is traffic that leaves your VM to other computers or the internet. For example, when your VM downloads updates.'
    },
    ports: {
      title: 'Network Ports',
      content: 'Ports are like numbered doors on your VM. Each service (web, email, etc.) uses specific ports to communicate.'
    },
    protocols: {
      title: 'Network Protocols',
      content: 'Protocols define how computers communicate. TCP is reliable (web pages), UDP is fast (videos), ICMP is for diagnostics.'
    },
    templates: {
      title: 'Firewall Templates',
      content: 'Templates are predefined configurations for common services. They save time by configuring rules automatically.'
    }
  };
};