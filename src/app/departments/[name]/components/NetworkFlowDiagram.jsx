'use client';

import { useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  Globe,
  HelpCircle,
  Monitor,
  Network,
  Route,
  Server,
  XCircle,
} from 'lucide-react';
import {
  Badge,
  Card,
  Dialog,
  IconTile,
  PropertyList,
  ResponsiveStack,
  Tooltip,
} from '@infinibay/harbor';
import {
  COMPONENT_INFO,
  getFlowStatus,
} from './networkDiagnosticsHelp';

const FlowNode = ({ icon, label, status, isOk, details, info }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ResponsiveStack direction="col" gap={2} align="center">
        <IconTile
          icon={icon}
          tone={isOk ? 'green' : 'rose'}
          size="lg"
        />
        <span>{label}</span>
        <Badge
          tone={isOk ? 'success' : 'danger'}
          icon={isOk ? <CheckCircle size={10} /> : <XCircle size={10} />}
        >
          {status}
        </Badge>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Details for ${label}`}
        >
          <HelpCircle size={14} />
        </button>
      </ResponsiveStack>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <IconTile icon={icon} tone={isOk ? 'green' : 'rose'} size="sm" />
            <span>{info.name}</span>
            <Badge tone={isOk ? 'success' : 'danger'}>
              {isOk ? 'OK' : 'Issue'}
            </Badge>
          </ResponsiveStack>
        }
        description={info.description}
      >
        <ResponsiveStack direction="col" gap={3}>
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            leadingIcon={<HelpCircle size={18} />}
            leadingIconTone="sky"
            title="What it does"
          >
            {info.whatItDoes}
          </Card>
          {!isOk ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              leadingIcon={<XCircle size={18} />}
              leadingIconTone="rose"
              title="Impact"
            >
              {info.ifFails}
            </Card>
          ) : null}
          {details && details.length > 0 ? (
            <PropertyList
              items={details.map((d, idx) => ({
                key: `d-${idx}`,
                label: d.label,
                value: d.value,
              }))}
            />
          ) : null}
        </ResponsiveStack>
      </Dialog>
    </>
  );
};

const FlowConnector = () => (
  <ResponsiveStack direction="row" gap={0} align="center">
    <ChevronRight size={16} />
  </ResponsiveStack>
);

const NetworkFlowDiagram = ({ diagnostics }) => {
  const flowStatus = getFlowStatus(diagnostics);

  const bridgeDetails = diagnostics?.bridge
    ? [
        { label: 'IP address', value: diagnostics.bridge.ipAddresses?.join(', ') || 'None' },
        { label: 'MTU', value: diagnostics.bridge.mtu || 'Unknown' },
        { label: 'State', value: diagnostics.bridge.state || 'Unknown' },
        { label: 'Interfaces', value: diagnostics.bridge.attachedInterfaces?.length || 0 },
      ]
    : [];

  const dnsmasqDetails = diagnostics?.dnsmasq
    ? [
        { label: 'PID', value: diagnostics.dnsmasq.pid || 'N/A' },
        { label: 'Port 67', value: diagnostics.dnsmasq.listeningPort ? 'Listening' : 'Not listening' },
        { label: 'Config', value: diagnostics.dnsmasq.configExists ? 'Exists' : 'Missing' },
        { label: 'Leases', value: diagnostics.dnsmasq.leaseFileExists ? 'Exists' : 'Missing' },
      ]
    : [];

  const natDetails = diagnostics?.nat
    ? [
        { label: 'NAT rule', value: diagnostics.nat.ruleExists ? 'Configured' : 'Missing' },
        { label: 'IP forward', value: diagnostics.nat.ipForwardingEnabled ? 'Enabled' : 'Disabled' },
        { label: 'Table', value: diagnostics.nat.tableExists ? 'Exists' : 'Missing' },
        { label: 'Chain', value: diagnostics.nat.chainExists ? 'Exists' : 'Missing' },
      ]
    : [];

  const allOk = flowStatus.bridge.ok && flowStatus.dnsmasq.ok && flowStatus.nat.ok;

  return (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      leadingIcon={<Network size={18} />}
      leadingIconTone="sky"
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <span>Network flow</span>
          <Tooltip content="This diagram shows the path network traffic takes from your VMs to the internet. Click on each component to see details.">
            <span>
              <HelpCircle size={12} />
            </span>
          </Tooltip>
        </ResponsiveStack>
      }
      footer={
        <ResponsiveStack direction="row" gap={4} align="center" justify="center" wrap>
          <ResponsiveStack direction="row" gap={1} align="center">
            <CheckCircle size={10} />
            <span>Working</span>
          </ResponsiveStack>
          <ResponsiveStack direction="row" gap={1} align="center">
            <XCircle size={10} />
            <span>Issue detected</span>
          </ResponsiveStack>
          <span>Click the help icon on any node for details</span>
        </ResponsiveStack>
      }
    >
      <ResponsiveStack direction="row" gap={3} align="center" justify="center" wrap>
        <ResponsiveStack direction="col" gap={2} align="center">
          <IconTile icon={<Monitor size={18} />} tone="neutral" size="lg" />
          <span>VMs</span>
        </ResponsiveStack>

        <FlowConnector />

        <FlowNode
          icon={<Network size={18} />}
          label="Bridge"
          status={flowStatus.bridge.label}
          isOk={flowStatus.bridge.ok}
          details={bridgeDetails}
          info={COMPONENT_INFO.bridge}
        />

        <FlowConnector />

        <FlowNode
          icon={<Server size={18} />}
          label="DHCP/DNS"
          status={flowStatus.dnsmasq.label}
          isOk={flowStatus.dnsmasq.ok}
          details={dnsmasqDetails}
          info={COMPONENT_INFO.dnsmasq}
        />

        <FlowConnector />

        <FlowNode
          icon={<Route size={18} />}
          label="NAT"
          status={flowStatus.nat.label}
          isOk={flowStatus.nat.ok}
          details={natDetails}
          info={COMPONENT_INFO.nat}
        />

        <FlowConnector />

        <ResponsiveStack direction="col" gap={2} align="center">
          <IconTile
            icon={<Globe size={18} />}
            tone={allOk ? 'sky' : 'neutral'}
            size="lg"
          />
          <span>Internet</span>
          <Badge tone={allOk ? 'info' : 'neutral'}>
            {allOk ? 'Reachable' : 'Blocked'}
          </Badge>
        </ResponsiveStack>
      </ResponsiveStack>
    </Card>
  );
};

export default NetworkFlowDiagram;
