'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle,
  Copy,
  HelpCircle,
  Network,
  Route,
  Server,
  Shield,
  XCircle,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Card,
  CodeBlock,
  IconButton,
  PropertyList,
  ResponsiveGrid,
  ResponsiveStack,
  Tooltip,
} from '@infinibay/harbor';
import {
  COMPONENT_INFO,
  FIELD_TOOLTIPS,
  getComponentStatus,
} from './networkDiagnosticsHelp';

const metricValue = (value, type) => {
  if (type === 'boolean') {
    return value ? (
      <Badge tone="success" icon={<CheckCircle size={10} />}>
        Yes
      </Badge>
    ) : (
      <Badge tone="neutral" icon={<XCircle size={10} />}>
        No
      </Badge>
    );
  }
  if (type === 'path') {
    return <span>{value}</span>;
  }
  return <span>{value}</span>;
};

const StatusCard = ({ icon, title, isHealthy, issues, metrics, extraContent, info }) => {
  const items = metrics.map((m, idx) => ({
    key: `m-${idx}`,
    label: m.tooltip ? (
      <Tooltip content={m.tooltip}>
        <ResponsiveStack direction="row" gap={1} align="center">
          <span>{m.label}</span>
          <HelpCircle size={10} />
        </ResponsiveStack>
      </Tooltip>
    ) : (
      m.label
    ),
    value: metricValue(m.value, m.type),
  }));

  return (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      fullHeight
      leadingIcon={icon}
      leadingIconTone={isHealthy ? 'green' : 'rose'}
      title={
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          <span>{title}</span>
          {isHealthy ? (
            <Badge tone="success" icon={<CheckCircle size={10} />}>
              OK
            </Badge>
          ) : (
            <Badge tone="danger" icon={<XCircle size={10} />}>
              Issue
            </Badge>
          )}
        </ResponsiveStack>
      }
      description={info.description}
    >
      <ResponsiveStack direction="col" gap={3}>
        {issues.length > 0 ? (
          <Alert tone="danger" size="sm" icon={<XCircle size={12} />}>
            <ResponsiveStack direction="col" gap={1}>
              {issues.map((issue, idx) => (
                <span key={idx}>• {issue}</span>
              ))}
            </ResponsiveStack>
          </Alert>
        ) : null}
        <PropertyList items={items} />
        {extraContent}
      </ResponsiveStack>
    </Card>
  );
};

const ComponentStatusCards = ({ diagnostics }) => {
  const [copiedPath, setCopiedPath] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(id);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const bridgeStatus = getComponentStatus('bridge', diagnostics);
  const dnsmasqStatus = getComponentStatus('dnsmasq', diagnostics);
  const natStatus = getComponentStatus('nat', diagnostics);
  const brNetfilterStatus = getComponentStatus('brNetfilter', diagnostics);

  const bridge = diagnostics?.bridge || {};
  const dnsmasq = diagnostics?.dnsmasq || {};
  const nat = diagnostics?.nat || {};
  const brNetfilter = diagnostics?.brNetfilter || {};

  return (
    <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={4}>
      <StatusCard
        icon={<Network size={18} />}
        title="Network bridge"
        isHealthy={bridgeStatus.isHealthy}
        issues={bridgeStatus.issues}
        info={COMPONENT_INFO.bridge}
        metrics={[
          { label: 'Status', value: bridge.isUp, type: 'boolean', tooltip: FIELD_TOOLTIPS.bridge.isUp },
          { label: 'State', value: bridge.state || 'Unknown', tooltip: FIELD_TOOLTIPS.bridge.state },
          { label: 'IP address', value: bridge.ipAddresses?.join(', ') || 'None', tooltip: FIELD_TOOLTIPS.bridge.ipAddresses },
          { label: 'MTU', value: bridge.mtu || 'Unknown', tooltip: FIELD_TOOLTIPS.bridge.mtu },
          { label: 'Interfaces', value: bridge.attachedInterfaces?.length || 0, tooltip: FIELD_TOOLTIPS.bridge.attachedInterfaces },
        ]}
        extraContent={
          bridge.attachedInterfaces?.length > 0 ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Connected interfaces"
            >
              <ResponsiveStack direction="row" gap={2} wrap>
                {bridge.attachedInterfaces.map((iface, idx) => (
                  <Badge key={idx} tone="neutral">
                    {iface}
                  </Badge>
                ))}
              </ResponsiveStack>
            </Card>
          ) : null
        }
      />

      <StatusCard
        icon={<Server size={18} />}
        title="DHCP & DNS server"
        isHealthy={dnsmasqStatus.isHealthy}
        issues={dnsmasqStatus.issues}
        info={COMPONENT_INFO.dnsmasq}
        metrics={[
          { label: 'Running', value: dnsmasq.isRunning, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.isRunning },
          { label: 'DHCP port', value: dnsmasq.listeningPort, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.listeningPort },
          { label: 'PID', value: dnsmasq.pid || 'N/A', tooltip: FIELD_TOOLTIPS.dnsmasq.pid },
          { label: 'PID match', value: dnsmasq.pidMatches, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.pidMatches },
          { label: 'Config', value: dnsmasq.configExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.configExists },
          { label: 'Leases', value: dnsmasq.leaseFileExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.leaseFileExists },
        ]}
        extraContent={
          dnsmasq.configPath || dnsmasq.leasePath ? (
            <ResponsiveStack direction="col" gap={2}>
              {dnsmasq.configPath ? (
                <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                  <span>Config path</span>
                  <ResponsiveStack direction="row" gap={1} align="center">
                    <Badge tone="neutral">{dnsmasq.configPath}</Badge>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label="Copy config path"
                      icon={copiedPath === 'config' ? <Check size={12} /> : <Copy size={12} />}
                      onClick={() => copyToClipboard(dnsmasq.configPath, 'config')}
                    />
                  </ResponsiveStack>
                </ResponsiveStack>
              ) : null}
              {dnsmasq.leasePath ? (
                <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                  <span>Lease path</span>
                  <ResponsiveStack direction="row" gap={1} align="center">
                    <Badge tone="neutral">{dnsmasq.leasePath}</Badge>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label="Copy lease path"
                      icon={copiedPath === 'lease' ? <Check size={12} /> : <Copy size={12} />}
                      onClick={() => copyToClipboard(dnsmasq.leasePath, 'lease')}
                    />
                  </ResponsiveStack>
                </ResponsiveStack>
              ) : null}
            </ResponsiveStack>
          ) : null
        }
      />

      <StatusCard
        icon={<Route size={18} />}
        title="NAT gateway"
        isHealthy={natStatus.isHealthy}
        issues={natStatus.issues}
        info={COMPONENT_INFO.nat}
        metrics={[
          { label: 'IP forwarding', value: nat.ipForwardingEnabled, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.ipForwardingEnabled },
          { label: 'NAT rule', value: nat.ruleExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.ruleExists },
          { label: 'Table', value: nat.tableExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.tableExists },
          { label: 'Chain', value: nat.chainExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.chainExists },
        ]}
        extraContent={
          nat.ruleDetails ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="NAT rule"
            >
              <CodeBlock code={nat.ruleDetails} />
            </Card>
          ) : null
        }
      />

      <StatusCard
        icon={<Shield size={18} />}
        title="Bridge firewall"
        isHealthy={brNetfilterStatus.isHealthy}
        issues={brNetfilterStatus.issues}
        info={COMPONENT_INFO.brNetfilter}
        metrics={[
          { label: 'Module loaded', value: brNetfilter.moduleLoaded, type: 'boolean', tooltip: FIELD_TOOLTIPS.brNetfilter.moduleLoaded },
          { label: 'Persistence', value: brNetfilter.persistenceFileExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.brNetfilter.persistenceFile },
          { label: 'IPv4 iptables', value: brNetfilter.callIptables === 0 ? 'Disabled' : 'Enabled', tooltip: FIELD_TOOLTIPS.brNetfilter.callIptables },
          { label: 'IPv6 ip6tables', value: brNetfilter.callIp6tables === 0 ? 'Disabled' : 'Enabled', tooltip: FIELD_TOOLTIPS.brNetfilter.callIp6tables },
          { label: 'ARP arptables', value: brNetfilter.callArptables === 0 ? 'Disabled' : 'Enabled', tooltip: FIELD_TOOLTIPS.brNetfilter.callArptables },
        ]}
        extraContent={
          <Alert
            tone="info"
            size="sm"
            icon={<HelpCircle size={12} />}
          >
            &quot;Disabled&quot; values are typically correct. This prevents host firewall rules from interfering with VM traffic.
          </Alert>
        }
      />
    </ResponsiveGrid>
  );
};

export default ComponentStatusCards;
