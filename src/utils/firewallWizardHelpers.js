import {
  validateRule,
  calculateRiskLevel,
  normalizeAction,
  normalizeDirection,
  COMMON_SERVICES
} from './firewallHelpers.js';
import {
  serviceCategories,
  knownServices
} from '../config/securityServices.js';

// ===== SERVICE ALIASES =====

export const SERVICE_ALIASES = {
  http: 'web',
  https: 'web',
  smtp: 'email',
  pop3: 'email',
  imap: 'email',
  sftp: 'ftp',
  video_conference: 'streaming',
  dns: 'dns',
  rdp: 'rdp',
  vnc: 'vnc',
  ssh: 'ssh',
  smb: 'ftp',
  streaming: 'web',
  gaming: 'web'
};

// ===== SERVICE SCENARIOS SECTION =====

export const WIZARD_SERVICE_SCENARIOS = {
  web_browsing: {
    key: 'web_browsing',
    title: 'Browse the Web',
    description: 'I want to browse websites, use social media, and access online services',
    icon: '🌐',
    category: 'common',
    services: ['http', 'https', 'dns'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      destinationValue: '0.0.0.0/0',
      ports: [80, 443, 53],
      protocol: 'TCP'
    }
  },
  work_from_home: {
    key: 'work_from_home',
    title: 'Work from Home',
    description: 'I need to connect to my office network via VPN or remote desktop',
    icon: '🏠',
    category: 'common',
    services: ['rdp', 'vnc', 'ssh', 'vpn'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      ports: [3389, 5900, 22, 1723],
      protocol: 'TCP'
    }
  },
  file_sharing: {
    key: 'file_sharing',
    title: 'Share Files',
    description: 'I want to share files with colleagues or access shared network drives',
    icon: '📁',
    category: 'common',
    services: ['smb', 'ftp', 'sftp'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      ports: [445, 21, 22],
      protocol: 'TCP'
    }
  },
  email_access: {
    key: 'email_access',
    title: 'Access Email',
    description: 'I need to send and receive emails using email clients',
    icon: '📧',
    category: 'common',
    services: ['smtp', 'pop3', 'imap'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      ports: [25, 110, 143, 587, 993, 995],
      protocol: 'TCP'
    }
  },
  video_calls: {
    key: 'video_calls',
    title: 'Video Calls & Meetings',
    description: 'I want to use video conferencing like Zoom, Teams, or Skype',
    icon: '📹',
    category: 'common',
    services: ['video_conference'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      destinationValue: '0.0.0.0/0',
      ports: [80, 443, 8080],
      protocol: 'TCP'
    }
  },
  host_website: {
    key: 'host_website',
    title: 'Host a Website',
    description: 'I want others to access a website or web service I\'m running',
    icon: '🖥️',
    category: 'server',
    services: ['http', 'https'],
    autoConfig: {
      direction: 'INBOUND',
      action: 'ALLOW',
      destinationType: 'department',
      sourceValue: '0.0.0.0/0',
      ports: [80, 443],
      protocol: 'TCP'
    }
  },
  remote_access: {
    key: 'remote_access',
    title: 'Allow Remote Access',
    description: 'I want to let others connect to my computer remotely',
    icon: '🔗',
    category: 'server',
    services: ['rdp', 'vnc', 'ssh'],
    autoConfig: {
      direction: 'INBOUND',
      action: 'ALLOW',
      destinationType: 'department',
      sourceValue: '0.0.0.0/0',
      ports: [3389, 5900, 22],
      protocol: 'TCP'
    }
  },
  gaming: {
    key: 'gaming',
    title: 'Online Gaming',
    description: 'I want to play online games and connect to game servers',
    icon: '🎮',
    category: 'entertainment',
    services: ['gaming'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      destinationValue: '0.0.0.0/0',
      protocol: 'TCP'
    }
  },
  streaming: {
    key: 'streaming',
    title: 'Stream Media',
    description: 'I want to watch videos, listen to music, or stream content',
    icon: '🎬',
    category: 'entertainment',
    services: ['streaming'],
    autoConfig: {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      sourceType: 'department',
      destinationValue: '0.0.0.0/0',
      ports: [80, 443, 1935],
      protocol: 'TCP'
    }
  },
  custom: {
    key: 'custom',
    title: 'Custom Configuration',
    description: 'I have specific requirements not covered by the common scenarios',
    icon: '⚙️',
    category: 'advanced',
    services: [],
    autoConfig: null
  }
};

export function getServiceScenarioByKey(key) {
  const scenario = WIZARD_SERVICE_SCENARIOS[key];
  if (!scenario) return null;

  // Enrich with category display information
  const categoryInfo = serviceCategories[scenario.category];
  return {
    ...scenario,
    categoryDisplay: categoryInfo?.name,
    categoryIcon: categoryInfo?.icon,
    categoryDescription: categoryInfo?.description
  };
}

export function getScenarioSuggestions(category = 'all') {
  let scenarios;
  if (category === 'all') {
    scenarios = Object.values(WIZARD_SERVICE_SCENARIOS);
  } else {
    scenarios = Object.values(WIZARD_SERVICE_SCENARIOS).filter(scenario =>
      scenario.category === category
    );
  }

  // Enrich each scenario with category display information
  return scenarios.map(scenario => {
    const categoryInfo = serviceCategories[scenario.category];
    return {
      ...scenario,
      categoryDisplay: categoryInfo?.name,
      categoryIcon: categoryInfo?.icon,
      categoryDescription: categoryInfo?.description
    };
  });
}

// ===== DIRECTION & ACTION EXPLANATIONS =====

export const WIZARD_DIRECTIONS = {
  INBOUND: {
    title: 'Allow Others to Connect to Me',
    description: 'Let people from other computers connect to services on my computers',
    analogy: 'Like opening your door to let visitors come in',
    examples: [
      'Hosting a website that others can visit',
      'Running a file server that colleagues can access',
      'Allowing remote desktop connections to my computer'
    ],
    icon: '📥',
    riskLevel: 'medium',
    riskNote: 'Opening inbound connections increases security risk'
  },
  OUTBOUND: {
    title: 'Allow Me to Connect to Others',
    description: 'Let my computers connect to services on other computers',
    analogy: 'Like going out to visit other places',
    examples: [
      'Browsing websites on the internet',
      'Connecting to company servers',
      'Downloading files from online services'
    ],
    icon: '📤',
    riskLevel: 'low',
    riskNote: 'Generally safer than inbound connections'
  }
};

export const WIZARD_ACTIONS = {
  ALLOW: {
    title: 'Give Access',
    description: 'Allow the connection and let data flow through',
    analogy: 'Like giving someone a green light to proceed',
    icon: '✅',
    color: 'green'
  },
  DENY: {
    title: 'Block Access (Silent)',
    description: 'Block the connection without telling the other side',
    analogy: 'Like ignoring someone knocking at your door',
    icon: '🚫',
    color: 'red'
  },
  REJECT: {
    title: 'Block Access (with Notice)',
    description: 'Block the connection and inform the other side it was rejected',
    analogy: 'Like telling someone at your door that they can\'t come in',
    icon: '❌',
    color: 'red'
  }
};

export function getDirectionExplanation(direction) {
  const normalizedDirection = direction?.toUpperCase();
  return WIZARD_DIRECTIONS[normalizedDirection] || {
    title: 'Unknown Direction',
    description: 'Direction not recognized',
    icon: '❓'
  };
}

export function getActionExplanation(action) {
  const normalizedAction = action?.toUpperCase();
  return WIZARD_ACTIONS[normalizedAction] || {
    title: 'Unknown Action',
    description: 'Action not recognized',
    icon: '❓'
  };
}

// ===== SMART DEFAULTS & SUGGESTIONS =====

export function getWizardDefaults(scenarioKey) {
  const scenario = getServiceScenarioByKey(scenarioKey);
  if (!scenario || !scenario.autoConfig) {
    return {
      direction: 'OUTBOUND',
      action: 'ALLOW',
      protocol: 'TCP',
      priority: 100
    };
  }

  return {
    ...scenario.autoConfig,
    priority: getRecommendedPriority(scenario.category),
    description: `Auto-configured for: ${scenario.title}`
  };
}

export function getSmartSuggestions(context) {
  const suggestions = {
    ipRanges: getCommonIPSuggestions(),
    ports: getCommonPortSuggestions(context.services),
    priorities: getCommonPrioritySuggestions()
  };

  if (context.direction === 'INBOUND') {
    suggestions.securityTips = [
      'Consider limiting source IPs to trusted networks',
      'Use high priority for critical services',
      'Review inbound rules regularly for security'
    ];
  }

  return suggestions;
}

export function getRecommendedPriority(category) {
  const priorityMap = {
    common: 100,
    server: 200,
    entertainment: 50,
    advanced: 100
  };
  return priorityMap[category] || 100;
}

export function getCommonIPSuggestions() {
  return [
    {
      value: '0.0.0.0/0',
      label: 'Anywhere (All IP addresses)',
      description: 'Allow connections from any IP address on the internet',
      riskLevel: 'high'
    },
    {
      value: '192.168.0.0/16',
      label: 'Local Network (192.168.x.x)',
      description: 'Only computers on your local home/office network',
      riskLevel: 'low'
    },
    {
      value: '10.0.0.0/8',
      label: 'Private Network (10.x.x.x)',
      description: 'Computers on your organization\'s private network',
      riskLevel: 'low'
    },
    {
      value: '172.16.0.0/12',
      label: 'Private Network (172.16-31.x.x)',
      description: 'Another common private network range',
      riskLevel: 'low'
    }
  ];
}

export function getCommonPortSuggestions(services = []) {
  const suggestions = [];

  services.forEach(service => {
    const aliasedService = SERVICE_ALIASES[service] || service;
    const commonService = COMMON_SERVICES[aliasedService];
    if (commonService && commonService.ports) {
      commonService.ports.forEach(portInfo => {
        suggestions.push({
          port: portInfo.port,
          label: `${portInfo.name} (${portInfo.port})`,
          description: commonService.description
        });
      });
    }
  });

  return suggestions;
}

export function buildRulesFromServices(services, direction, action) {
  const rules = [];

  services.forEach(service => {
    const aliasedService = SERVICE_ALIASES[service] || service;
    const commonService = COMMON_SERVICES[aliasedService];

    if (commonService && commonService.ports) {
      commonService.ports.forEach(portInfo => {
        rules.push({
          action: normalizeAction(action),
          direction: normalizeDirection(direction),
          protocol: portInfo.protocol,
          port: portInfo.port,
          description: `${commonService.name} - ${portInfo.name}`
        });
      });
    } else {
      // Search knownServices by port/protocol
      const knownService = knownServices.find(ks =>
        ks.name.toLowerCase().includes(service.toLowerCase())
      );
      if (knownService && knownService.ports) {
        knownService.ports.forEach(portInfo => {
          rules.push({
            action: normalizeAction(action),
            direction: normalizeDirection(direction),
            protocol: portInfo.protocol,
            port: portInfo.start.toString(),
            description: knownService.name
          });
        });
      }
    }
  });

  return rules;
}

export function getCommonPrioritySuggestions() {
  return [
    {
      value: 300,
      label: 'High Priority',
      description: 'Critical services that must work (email, VPN)',
      color: 'red'
    },
    {
      value: 100,
      label: 'Normal Priority',
      description: 'Regular everyday services (web browsing, file sharing)',
      color: 'blue'
    },
    {
      value: 50,
      label: 'Low Priority',
      description: 'Nice-to-have services (games, streaming)',
      color: 'gray'
    }
  ];
}

// ===== PLAIN LANGUAGE VALIDATION =====

export function validateWizardRule(rule) {
  const technicalRule = convertWizardToTechnical(rule);
  const validation = validateRule(technicalRule);

  if (validation.isValid) {
    return validation;
  }

  const ple = getPlainLanguageErrors(validation.errors);
  return {
    ...validation,
    plainLanguageErrors: ple,
    help: getValidationHelp(ple)
  };
}

export function getPlainLanguageErrors(errors) {
  const translations = new Map([
    [/port is not valid/i, 'Port numbers must be between 1 and 65535. Please choose a valid port.'],
    [/protocol must be tcp|udp|icmp/i, 'Please choose either TCP, UDP or ICMP as the protocol.'],
    [/source ip is not valid/i, 'The source IP doesn\'t look right. Please check for typos.'],
    [/destination ip is not valid/i, 'The destination IP doesn\'t look right. Please check for typos.'],
    [/rule name is required/i, 'Please give your rule a name to help you remember what it does.'],
    [/action is required/i, 'Please choose what action this rule should take (Allow, Deny, etc.).'],
    [/direction is required/i, 'Please specify the traffic direction (Inbound or Outbound).']
  ]);

  return errors.map((msg) => ({
    message: msg,
    friendlyMessage: [...translations].find(([re]) => re.test(msg))?.[1] || msg,
    field: inferFieldFromMessage(msg),
    suggestion: getErrorSuggestion({ field: inferFieldFromMessage(msg) })
  }));
}

function inferFieldFromMessage(msg) {
  if (/port/i.test(msg)) return 'ports';
  if (/protocol/i.test(msg)) return 'protocol';
  if (/source ip/i.test(msg)) return 'sourceValue';
  if (/destination ip/i.test(msg)) return 'destinationValue';
  if (/name/i.test(msg)) return 'name';
  if (/action/i.test(msg)) return 'action';
  if (/direction/i.test(msg)) return 'direction';
  return undefined;
}

export function getValidationHelp(errors) {
  const help = [];

  errors.forEach(error => {
    if (error.field === 'sourceValue' || error.field === 'destinationValue') {
      help.push({
        title: 'IP Address Help',
        content: 'Use formats like: 192.168.1.100 (single computer) or 192.168.1.0/24 (whole network)'
      });
    }

    if (error.field === 'ports') {
      help.push({
        title: 'Port Number Help',
        content: 'Common ports: 80 (web), 443 (secure web), 22 (SSH), 3389 (Remote Desktop)'
      });
    }
  });

  return help;
}

function getErrorSuggestion(error) {
  const suggestions = {
    'sourceValue': 'Try using an IP address like 192.168.1.100 or a network like 192.168.1.0/24',
    'destinationValue': 'Try using an IP address like 192.168.1.100 or 0.0.0.0/0 for anywhere',
    'ports': 'Use a port number between 1 and 65535, like 80 for web or 22 for SSH',
    'priority': 'Use a number like 100 for normal priority or 300 for high priority'
  };

  return suggestions[error.field] || 'Please check the value and try again';
}

// ===== RISK COMMUNICATION =====

export function getWizardRiskAssessment(rule) {
  const technicalRule = convertWizardToTechnical(rule);
  const risk = calculateRiskLevel(technicalRule);

  const friendlyRisk = {
    level: risk.level,
    title: getRiskTitle(risk.level),
    explanation: getFriendlyRiskExplanation(rule, risk.level),
    warnings: getRiskWarnings(rule, risk.level),
    alternatives: getSaferAlternatives(rule, risk.level),
    color: risk.color,
    label: risk.label
  };

  return friendlyRisk;
}

export function getRiskWarnings(rule, riskLevel) {
  const warnings = [];

  if (rule.direction === 'INBOUND' && rule.sourceValue === '0.0.0.0/0') {
    warnings.push({
      type: 'security',
      message: 'This rule allows connections from anywhere on the internet',
      impact: 'Anyone can attempt to connect to your service',
      recommendation: 'Consider limiting to specific IP addresses or networks'
    });
  }

  if (riskLevel === 'high' || riskLevel === 'critical') {
    warnings.push({
      type: 'high-risk',
      message: 'This configuration has significant security implications',
      impact: 'Could potentially expose your systems to security threats',
      recommendation: 'Review the rule carefully and consider safer alternatives'
    });
  }

  return warnings;
}

export function getSaferAlternatives(rule, riskLevel) {
  const alternatives = [];

  if (rule.direction === 'INBOUND' && rule.sourceValue === '0.0.0.0/0') {
    alternatives.push({
      suggestion: 'Limit to local network only',
      description: 'Change source to 192.168.0.0/16 to allow only local computers',
      riskReduction: 'Significantly reduces exposure to internet threats'
    });
  }

  if (rule.action === 'ALLOW' && (riskLevel === 'high' || riskLevel === 'critical')) {
    alternatives.push({
      suggestion: 'Use VPN access instead',
      description: 'Set up VPN and allow access only through the VPN',
      riskReduction: 'Adds encryption and authentication to the connection'
    });
  }

  return alternatives;
}

export function getDepartmentImpactWarning(rule, department) {
  if (rule.sourceType === 'department' || rule.destinationType === 'department') {
    return {
      message: `This rule will affect all computers in the ${department} department`,
      impact: 'All users in this department will have the same access permissions',
      consideration: 'Make sure this access level is appropriate for all department members'
    };
  }

  return null;
}

function getRiskTitle(riskLevel) {
  const titles = {
    'minimal': '✅ Minimal Risk',
    'low': '✅ Low Risk',
    'medium': '⚠️ Medium Risk',
    'high': '🚨 High Risk',
    'critical': '🚨 Critical Risk'
  };
  return titles[riskLevel] || 'Unknown Risk';
}

function getFriendlyRiskExplanation(rule, riskLevel) {
  const lvl = (riskLevel || '').toLowerCase();

  if (rule.direction === 'OUTBOUND') {
    return 'Outbound rules are generally safer since they only allow your computers to reach out to others.';
  }

  if (rule.direction === 'INBOUND' && lvl === 'low') {
    return 'This inbound rule has limited exposure and follows security best practices.';
  }

  if (rule.direction === 'INBOUND' && lvl === 'high') {
    return 'This inbound rule opens your computers to connections from the internet, which increases security risk.';
  }

  if (rule.direction === 'INBOUND' && lvl === 'critical') {
    return 'This inbound rule creates significant security vulnerabilities and should be carefully reviewed or avoided.';
  }

  return 'Please review this rule carefully for any security implications.';
}

function getRiskColor(riskLevel) {
  const colors = {
    'minimal': 'blue',
    'low': 'green',
    'medium': 'yellow',
    'high': 'orange',
    'critical': 'red'
  };
  return colors[riskLevel] || 'gray';
}

// ===== INTEGRATION FUNCTIONS =====

export function convertWizardToTechnical(wizardRule) {
  if (wizardRule.scenarioKey) {
    const scenario = getServiceScenarioByKey(wizardRule.scenarioKey);
    if (scenario && scenario.autoConfig) {
      Object.assign(wizardRule, scenario.autoConfig);
    }
  }

  return {
    action: normalizeAction(wizardRule.action),
    direction: normalizeDirection(wizardRule.direction),
    protocol: wizardRule.protocol?.toLowerCase(),
    port: (wizardRule.ports?.length ? wizardRule.ports.join(',') : '*'),
    sourceIp: wizardRule.sourceValue || undefined,
    destinationIp: wizardRule.destinationValue || undefined,
    description: wizardRule.description || '',
    name: wizardRule.name || ''
  };
}

export function convertTechnicalToWizard(technicalRule) {
  const wizardRule = {
    action: technicalRule.action,
    direction: technicalRule.direction,
    protocol: technicalRule.protocol,
    ports: technicalRule.port && technicalRule.port !== '*' ? technicalRule.port.split(',').map(p => p.trim()) : [],
    sourceValue: technicalRule.sourceIp,
    destinationValue: technicalRule.destinationIp,
    description: technicalRule.description || '',
    name: technicalRule.name || ''
  };

  wizardRule.scenarioKey = detectScenarioFromRule(wizardRule);
  wizardRule.isCustom = !wizardRule.scenarioKey;

  return wizardRule;
}

export function generatePlainLanguageSummary(rule) {
  const actionKey = (rule.action || '').toUpperCase();
  const directionKey = (rule.direction || '').toUpperCase();

  const actionInfo = WIZARD_ACTIONS[actionKey];
  const actionTitle = actionInfo?.title || 'Rule';

  const actionVerbs = { ALLOW: 'Allow', DENY: 'Block', REJECT: 'Block' };
  const verb = actionVerbs[actionKey] || actionTitle;

  let summary = `${verb}: `;

  if (directionKey === 'INBOUND') {
    summary += `connections from ${formatSourceForSummary(rule)} to `;
    summary += `${formatDestinationForSummary(rule)}`;
  } else {
    summary += `${formatSourceForSummary(rule)} to connect to `;
    summary += `${formatDestinationForSummary(rule)}`;
  }

  if (rule.ports && rule.ports.length > 0) {
    summary += ` on port${rule.ports.length > 1 ? 's' : ''} ${rule.ports.join(', ')}`;
  }

  if (rule.protocol) {
    summary += ` (${rule.protocol})`;
  }

  return summary;
}

function detectScenarioFromRule(rule) {
  for (const [key, scenario] of Object.entries(WIZARD_SERVICE_SCENARIOS)) {
    if (scenario.autoConfig && ruleMatchesScenario(rule, scenario.autoConfig)) {
      return key;
    }
  }
  return null;
}

function ruleMatchesScenario(rule, autoConfig) {
  return rule.direction?.toLowerCase() === autoConfig.direction?.toLowerCase() &&
         rule.action?.toLowerCase() === autoConfig.action?.toLowerCase() &&
         rule.protocol?.toLowerCase() === autoConfig.protocol?.toLowerCase();
}

function formatSourceForSummary(rule) {
  if (rule.sourceType === 'department') {
    return 'computers in this department';
  }
  if (rule.sourceValue === '0.0.0.0/0') {
    return 'anywhere on the internet';
  }
  if (rule.sourceValue && rule.sourceValue.includes('192.168')) {
    return 'the local network';
  }
  return rule.sourceValue || 'specified computers';
}

function formatDestinationForSummary(rule) {
  if (rule.destinationType === 'department') {
    return 'computers in this department';
  }
  if (rule.destinationValue === '0.0.0.0/0') {
    return 'anywhere on the internet';
  }
  if (rule.destinationValue && rule.destinationValue.includes('192.168')) {
    return 'the local network';
  }
  return rule.destinationValue || 'specified computers';
}