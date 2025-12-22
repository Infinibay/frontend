/**
 * Network Diagnostics Help Texts and Constants
 *
 * This file contains all user-facing text for the network diagnostics dashboard.
 * Centralizing these texts makes it easy to maintain consistency and potentially
 * support internationalization in the future.
 */

export const COMPONENT_INFO = {
  bridge: {
    name: 'Network Bridge',
    icon: 'bridge',
    description: 'Virtual switch that connects all VMs in this department to a shared network.',
    whatItDoes: 'The bridge acts as a virtual switch, allowing VMs to communicate with each other and with the outside network.',
    ifFails: 'VMs will lose all network connectivity. They cannot communicate with each other or access the internet.',
  },
  dnsmasq: {
    name: 'DHCP & DNS',
    icon: 'server',
    description: 'Server that automatically assigns IP addresses to VMs and resolves domain names.',
    whatItDoes: 'DNSMASQ provides DHCP (automatic IP assignment) and DNS (domain name resolution) services to VMs.',
    ifFails: 'New VMs will not receive IP addresses automatically. Existing VMs may lose DNS resolution.',
  },
  nat: {
    name: 'NAT Gateway',
    icon: 'route',
    description: 'Allows VMs with private IPs to access the internet through the host.',
    whatItDoes: 'Network Address Translation (NAT) translates private VM addresses to the host\'s public address for internet access.',
    ifFails: 'VMs will only have local network access. They cannot reach the internet.',
  },
  brNetfilter: {
    name: 'Bridge Firewall',
    icon: 'shield',
    description: 'Kernel module that enables firewall rules for bridge traffic.',
    whatItDoes: 'The br_netfilter module allows iptables to inspect and filter traffic passing through the bridge.',
    ifFails: 'NAT rules may not work correctly. VMs might lose internet connectivity.',
  },
};

export const FIELD_TOOLTIPS = {
  bridge: {
    exists: 'Indicates if the virtual bridge interface has been created for this department.',
    isUp: 'The bridge must be in UP state to transmit network traffic.',
    state: 'Operational state of the bridge: UP (working), DOWN (disabled), or UNKNOWN.',
    mtu: 'Maximum Transmission Unit - the largest packet size in bytes (typically 1500).',
    ipAddresses: 'IP addresses assigned to the bridge. This IP serves as the gateway for VMs.',
    attachedInterfaces: 'Virtual interfaces (vnetX) connected to this bridge. Each running VM should have one.',
  },
  dnsmasq: {
    isRunning: 'Whether the DNSMASQ service is currently running and serving requests.',
    pid: 'Process ID of the DNSMASQ service in the operating system.',
    pidMatches: 'Verifies that the stored PID matches the actual running process.',
    listeningPort: 'Port 67 is the standard DHCP port. DNSMASQ must listen here to serve IP addresses.',
    configExists: 'The configuration file defines the IP range, lease time, and DHCP options.',
    configPath: 'Location of the DNSMASQ configuration file.',
    leaseFileExists: 'The lease file tracks which IPs have been assigned to which VMs.',
    leasePath: 'Location of the DHCP lease database file.',
  },
  brNetfilter: {
    moduleLoaded: 'The br_netfilter kernel module must be loaded for NAT to work with bridges.',
    persistenceFile: 'If this file exists, the module will load automatically on system reboot.',
    callIptables: 'When enabled, IPv4 bridge traffic passes through iptables rules.',
    callIp6tables: 'When enabled, IPv6 bridge traffic passes through ip6tables rules.',
    callArptables: 'When enabled, ARP traffic passes through arptables rules.',
  },
  nat: {
    ruleExists: 'Whether the NAT masquerade rule is configured for this department\'s network.',
    tableExists: 'The NAT table in iptables must exist to configure address translation.',
    chainExists: 'The POSTROUTING chain is where masquerade rules are applied.',
    ipForwardingEnabled: 'Kernel setting that allows forwarding packets between interfaces.',
    ruleDetails: 'The actual iptables command configured for NAT.',
  },
};

export const STATUS_MESSAGES = {
  healthy: {
    title: 'Network Operational',
    description: 'All systems are working correctly. VMs can obtain IP addresses and access the internet.',
    color: 'green',
  },
  degraded: {
    title: 'Network Degraded',
    description: 'Some components have issues. VMs may experience connectivity problems.',
    color: 'yellow',
  },
  critical: {
    title: 'Network Critical',
    description: 'Major components are failing. VMs cannot connect to the network properly.',
    color: 'red',
  },
};

export const HEALTH_CHECKS = [
  { id: 'bridge_exists', label: 'Bridge exists', weight: 15, category: 'bridge' },
  { id: 'bridge_up', label: 'Bridge is up', weight: 20, category: 'bridge' },
  { id: 'dnsmasq_running', label: 'DHCP server running', weight: 20, category: 'dnsmasq' },
  { id: 'dnsmasq_port', label: 'DHCP port listening', weight: 10, category: 'dnsmasq' },
  { id: 'dnsmasq_config', label: 'DHCP config exists', weight: 5, category: 'dnsmasq' },
  { id: 'nat_rule', label: 'NAT rule configured', weight: 15, category: 'nat' },
  { id: 'ip_forwarding', label: 'IP forwarding enabled', weight: 15, category: 'nat' },
];

/**
 * Calculate network health score from diagnostics data
 * @param {Object} diagnostics - The diagnostics object from GraphQL
 * @returns {Object} { score: number, status: string, failedChecks: string[], passedChecks: string[] }
 */
export function calculateNetworkHealth(diagnostics) {
  if (!diagnostics) {
    return { score: 0, status: 'critical', failedChecks: [], passedChecks: [] };
  }

  const checkResults = [
    { ...HEALTH_CHECKS[0], pass: diagnostics.bridge?.exists },
    { ...HEALTH_CHECKS[1], pass: diagnostics.bridge?.isUp },
    { ...HEALTH_CHECKS[2], pass: diagnostics.dnsmasq?.isRunning },
    { ...HEALTH_CHECKS[3], pass: diagnostics.dnsmasq?.listeningPort },
    { ...HEALTH_CHECKS[4], pass: diagnostics.dnsmasq?.configExists },
    { ...HEALTH_CHECKS[5], pass: diagnostics.nat?.ruleExists },
    { ...HEALTH_CHECKS[6], pass: diagnostics.nat?.ipForwardingEnabled },
  ];

  const score = checkResults.reduce((acc, check) => acc + (check.pass ? check.weight : 0), 0);
  const failedChecks = checkResults.filter(c => !c.pass).map(c => c.id);
  const passedChecks = checkResults.filter(c => c.pass).map(c => c.id);

  let status = 'healthy';
  if (score < 50) {
    status = 'critical';
  } else if (score < 80) {
    status = 'degraded';
  }

  return { score, status, failedChecks, passedChecks };
}

/**
 * Get component status from diagnostics
 * @param {string} component - Component name (bridge, dnsmasq, nat, brNetfilter)
 * @param {Object} diagnostics - The diagnostics object
 * @returns {Object} { isHealthy: boolean, issues: string[] }
 */
export function getComponentStatus(component, diagnostics) {
  if (!diagnostics) {
    return { isHealthy: false, issues: ['No diagnostics data'] };
  }

  const issues = [];

  switch (component) {
    case 'bridge':
      if (!diagnostics.bridge?.exists) issues.push('Bridge does not exist');
      if (!diagnostics.bridge?.isUp) issues.push('Bridge is not up');
      break;
    case 'dnsmasq':
      if (!diagnostics.dnsmasq?.isRunning) issues.push('DNSMASQ not running');
      if (!diagnostics.dnsmasq?.listeningPort) issues.push('Not listening on DHCP port');
      if (!diagnostics.dnsmasq?.pidMatches) issues.push('PID mismatch detected');
      break;
    case 'nat':
      if (!diagnostics.nat?.ruleExists) issues.push('NAT rule not configured');
      if (!diagnostics.nat?.ipForwardingEnabled) issues.push('IP forwarding disabled');
      break;
    case 'brNetfilter':
      if (!diagnostics.brNetfilter?.moduleLoaded) issues.push('Module not loaded');
      break;
    default:
      break;
  }

  return { isHealthy: issues.length === 0, issues };
}

/**
 * Get flow node status for the network diagram
 * @param {Object} diagnostics - The diagnostics object
 * @returns {Object} Status for each node in the flow
 */
export function getFlowStatus(diagnostics) {
  if (!diagnostics) {
    return {
      bridge: { ok: false, label: 'Unknown' },
      dnsmasq: { ok: false, label: 'Unknown' },
      nat: { ok: false, label: 'Unknown' },
    };
  }

  return {
    bridge: {
      ok: diagnostics.bridge?.exists && diagnostics.bridge?.isUp,
      label: diagnostics.bridge?.isUp ? 'UP' : 'DOWN',
    },
    dnsmasq: {
      ok: diagnostics.dnsmasq?.isRunning && diagnostics.dnsmasq?.listeningPort,
      label: diagnostics.dnsmasq?.isRunning ? 'Running' : 'Stopped',
    },
    nat: {
      ok: diagnostics.nat?.ruleExists && diagnostics.nat?.ipForwardingEnabled,
      label: diagnostics.nat?.ipForwardingEnabled ? 'Enabled' : 'Disabled',
    },
  };
}
