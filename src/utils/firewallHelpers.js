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
    default: return normalized;
  }
};

/**
 * Denormalize action values from frontend to backend
 */
export const denormalizeAction = (action) => {
  if (!action) return 'accept';
  const normalized = action.toLowerCase();
  switch (normalized) {
    case 'allow': return 'accept';
    case 'deny': return 'drop';
    case 'reject': return 'reject';
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
    default: return normalized;
  }
};

// Common service definitions with default ports
export const COMMON_SERVICES = {
  web: {
    name: 'Servidor Web',
    description: 'Permite acceso HTTP y HTTPS para sitios web',
    ports: [
      { port: '80', protocol: 'tcp', name: 'HTTP' },
      { port: '443', protocol: 'tcp', name: 'HTTPS' }
    ]
  },
  ssh: {
    name: 'Acceso Remoto SSH',
    description: 'Permite conexión remota segura mediante SSH',
    ports: [
      { port: '22', protocol: 'tcp', name: 'SSH' }
    ]
  },
  database: {
    name: 'Servidor de Base de Datos',
    description: 'Permite acceso a bases de datos comunes',
    ports: [
      { port: '3306', protocol: 'tcp', name: 'MySQL' },
      { port: '5432', protocol: 'tcp', name: 'PostgreSQL' },
      { port: '1433', protocol: 'tcp', name: 'SQL Server' },
      { port: '27017', protocol: 'tcp', name: 'MongoDB' }
    ]
  },
  ftp: {
    name: 'Servidor FTP',
    description: 'Permite transferencia de archivos via FTP/SFTP',
    ports: [
      { port: '21', protocol: 'tcp', name: 'FTP' },
      { port: '22', protocol: 'tcp', name: 'SFTP' }
    ]
  },
  email: {
    name: 'Servidor de Correo',
    description: 'Permite servicios de correo electrónico',
    ports: [
      { port: '25', protocol: 'tcp', name: 'SMTP' },
      { port: '110', protocol: 'tcp', name: 'POP3' },
      { port: '143', protocol: 'tcp', name: 'IMAP' },
      { port: '993', protocol: 'tcp', name: 'IMAPS' },
      { port: '995', protocol: 'tcp', name: 'POP3S' }
    ]
  },
  dns: {
    name: 'Servidor DNS',
    description: 'Permite resolución de nombres de dominio',
    ports: [
      { port: '53', protocol: 'tcp', name: 'DNS TCP' },
      { port: '53', protocol: 'udp', name: 'DNS UDP' }
    ]
  },
  rdp: {
    name: 'Escritorio Remoto',
    description: 'Permite conexión de escritorio remoto de Windows',
    ports: [
      { port: '3389', protocol: 'tcp', name: 'RDP' }
    ]
  },
  vnc: {
    name: 'VNC (Escritorio Remoto)',
    description: 'Permite conexión VNC para escritorio remoto',
    ports: [
      { port: '5900', protocol: 'tcp', name: 'VNC' }
    ]
  }
};

// Protocol definitions
export const PROTOCOLS = {
  tcp: { name: 'TCP', description: 'Protocolo confiable para aplicaciones web y transferencia de datos' },
  udp: { name: 'UDP', description: 'Protocolo rápido para streaming y juegos en tiempo real' },
  icmp: { name: 'ICMP', description: 'Protocolo para diagnósticos de red (ping)' }
};

// Action definitions with descriptions
export const ACTIONS = {
  allow: {
    name: 'Permitir',
    description: 'Permite el tráfico que coincide con esta regla',
    color: 'green',
    icon: '✅'
  },
  deny: {
    name: 'Denegar',
    description: 'Bloquea silenciosamente el tráfico que coincide con esta regla',
    color: 'red',
    icon: '🚫'
  },
  reject: {
    name: 'Rechazar',
    description: 'Bloquea el tráfico y envía una respuesta de rechazo',
    color: 'orange',
    icon: '⛔'
  }
};

// Direction definitions
export const DIRECTIONS = {
  inbound: {
    name: 'Entrante',
    description: 'Tráfico que llega a la máquina virtual desde el exterior',
    icon: '⬇️'
  },
  outbound: {
    name: 'Saliente',
    description: 'Tráfico que sale de la máquina virtual hacia el exterior',
    icon: '⬆️'
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
    sourceDisplay: 'Cualquier IP', // Default since sourceIp not available
    destinationDisplay: 'Cualquier IP' // Default since destinationIp not available
  };
};

/**
 * Format port for display
 */
export const formatPortDisplay = (port) => {
  if (!port) return 'Cualquier puerto';
  if (port === '*') return 'Cualquier puerto';
  if (port.includes('-')) return `Puertos ${port}`;
  if (port.includes(',')) return `Puertos ${port}`;
  return `Puerto ${port}`;
};

/**
 * Format IP address for display
 */
export const formatIPDisplay = (ip) => {
  if (!ip) return 'Cualquier IP';
  if (ip === '*' || ip === '0.0.0.0/0') return 'Cualquier IP';
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

  let description = `${action} tráfico ${direction}`;

  if (rule.protocol) {
    description += ` usando ${protocol}`;
  }

  if (rule.port && rule.port !== '*' && rule.port !== 'all') {
    description += ` en ${port.toLowerCase()}`;
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

  if (!rule.name || rule.name.trim().length === 0) {
    errors.push('El nombre de la regla es obligatorio');
  }

  if (!rule.action) {
    errors.push('La acción es obligatoria');
  }

  if (!rule.direction) {
    errors.push('La dirección es obligatoria');
  }

  if (rule.protocol && !['tcp', 'udp', 'icmp'].includes(rule.protocol.toLowerCase())) {
    errors.push('El protocolo debe ser TCP, UDP o ICMP');
  }

  if (rule.port && !isValidPort(rule.port)) {
    errors.push('El puerto no es válido (debe estar entre 1-65535)');
  }

  if (rule.sourceIp && !isValidIP(rule.sourceIp)) {
    errors.push('La IP de origen no es válida');
  }

  if (rule.destinationIp && !isValidIP(rule.destinationIp)) {
    errors.push('La IP de destino no es válida');
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

  // Higher risk for inbound traffic
  if (normalizedDirection === 'inbound') risk += 2;

  // Higher risk for allow actions
  if (normalizedAction === 'allow') risk += 2;

  // Higher risk for common attack ports
  const riskyPorts = ['22', '23', '80', '443', '3389', '5900'];
  if (rule.port && riskyPorts.includes(rule.port.toString())) risk += 1;

  // Higher risk for port ranges
  if (rule.port && rule.port.includes('-')) risk += 2;

  // Higher risk for all ports
  if (!rule.port || rule.port === '*' || rule.port === 'all') risk += 3;

  if (risk >= 8) return { level: 'high', label: 'Alto Riesgo', color: 'red' };
  if (risk >= 5) return { level: 'medium', label: 'Riesgo Medio', color: 'yellow' };
  if (risk >= 2) return { level: 'low', label: 'Riesgo Bajo', color: 'green' };
  return { level: 'minimal', label: 'Riesgo Mínimo', color: 'blue' };
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

/**
 * Generate Spanish explanations for firewall concepts
 */
export const getFirewallConcepts = () => {
  return {
    firewall: {
      title: '¿Qué es un Firewall?',
      content: 'Un firewall es como un guardia de seguridad para tu máquina virtual. Decide qué tráfico de red puede entrar y salir de tu VM, bloqueando conexiones no autorizadas.'
    },
    inbound: {
      title: 'Tráfico Entrante (Inbound)',
      content: 'Es el tráfico que llega a tu VM desde otras computadoras o internet. Por ejemplo, cuando alguien visita tu sitio web.'
    },
    outbound: {
      title: 'Tráfico Saliente (Outbound)',
      content: 'Es el tráfico que sale de tu VM hacia otras computadoras o internet. Por ejemplo, cuando tu VM descarga actualizaciones.'
    },
    ports: {
      title: 'Puertos de Red',
      content: 'Los puertos son como puertas numeradas en tu VM. Cada servicio (web, email, etc.) usa puertos específicos para comunicarse.'
    },
    protocols: {
      title: 'Protocolos de Red',
      content: 'Los protocolos definen cómo se comunican las computadoras. TCP es confiable (páginas web), UDP es rápido (videos), ICMP es para diagnósticos.'
    },
    templates: {
      title: 'Plantillas de Firewall',
      content: 'Las plantillas son configuraciones predefinidas para servicios comunes. Te ahorran tiempo al configurar reglas automáticamente.'
    }
  };
};