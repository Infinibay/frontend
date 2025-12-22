'use client';

import React, { useState } from 'react';
import {
  Network,
  Server,
  Route,
  Shield,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getGlassClasses } from '@/utils/glass-effects';
import { COMPONENT_INFO, FIELD_TOOLTIPS, getComponentStatus } from './networkDiagnosticsHelp';

const MetricRow = ({ label, value, type = 'text', tooltip }) => {
  let displayValue = value;

  if (type === 'boolean') {
    displayValue = value ? (
      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Yes
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <XCircle className="w-3 h-3 mr-1" />
        No
      </Badge>
    );
  } else if (type === 'path') {
    displayValue = (
      <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[200px] block">
        {value}
      </code>
    );
  }

  return (
    <div className="flex justify-between items-center py-1.5 text-sm">
      <span className="text-muted-foreground flex items-center gap-1">
        {label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-3 h-3 text-muted-foreground/60" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
      <span>{displayValue}</span>
    </div>
  );
};

const StatusCard = ({ icon: Icon, title, isHealthy, issues, metrics, extraContent, info }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border-2 transition-all duration-200',
        isHealthy
          ? 'bg-green-50/50 border-green-200 hover:border-green-300'
          : 'bg-red-50/50 border-red-200 hover:border-red-300'
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2.5 rounded-lg',
                isHealthy ? 'bg-green-100' : 'bg-red-100'
              )}
            >
              <Icon className={cn('w-5 h-5', isHealthy ? 'text-green-700' : 'text-red-700')} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{title}</h4>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </div>
          </div>
          <Badge
            className={cn(
              isHealthy
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
            )}
          >
            {isHealthy ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                OK
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Issue
              </>
            )}
          </Badge>
        </div>

        {/* Issues list if any */}
        {issues.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-red-100/50 border border-red-200">
            <ul className="space-y-1">
              {issues.map((issue, idx) => (
                <li key={idx} className="text-xs text-red-700 flex items-start gap-1">
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key metrics (always visible) */}
        <div className="space-y-1 border-t pt-3">
          {metrics.slice(0, 3).map((metric, idx) => (
            <MetricRow key={idx} {...metric} />
          ))}
        </div>
      </div>

      {/* Expandable section for more details */}
      {(metrics.length > 3 || extraContent) && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full rounded-t-none border-t text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show more details
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            {/* Additional metrics */}
            {metrics.length > 3 && (
              <div className="space-y-1 pt-2">
                {metrics.slice(3).map((metric, idx) => (
                  <MetricRow key={idx} {...metric} />
                ))}
              </div>
            )}
            {/* Extra content (logs, etc.) */}
            {extraContent}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
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

  // Guard for null/undefined data
  const bridge = diagnostics?.bridge || {};
  const dnsmasq = diagnostics?.dnsmasq || {};
  const nat = diagnostics?.nat || {};
  const brNetfilter = diagnostics?.brNetfilter || {};

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bridge Card */}
        <StatusCard
          icon={Network}
          title="Network Bridge"
          isHealthy={bridgeStatus.isHealthy}
          issues={bridgeStatus.issues}
          info={COMPONENT_INFO.bridge}
          metrics={[
            { label: 'Status', value: bridge.isUp, type: 'boolean', tooltip: FIELD_TOOLTIPS.bridge.isUp },
            { label: 'State', value: bridge.state || 'Unknown', tooltip: FIELD_TOOLTIPS.bridge.state },
            { label: 'IP Address', value: bridge.ipAddresses?.join(', ') || 'None', tooltip: FIELD_TOOLTIPS.bridge.ipAddresses },
            { label: 'MTU', value: bridge.mtu || 'Unknown', tooltip: FIELD_TOOLTIPS.bridge.mtu },
            { label: 'Interfaces', value: bridge.attachedInterfaces?.length || 0, tooltip: FIELD_TOOLTIPS.bridge.attachedInterfaces },
          ]}
          extraContent={
            bridge.attachedInterfaces?.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">Connected Interfaces</p>
                <div className="flex flex-wrap gap-1">
                  {bridge.attachedInterfaces.map((iface, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-mono">
                      {iface}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          }
        />

        {/* DNSMASQ Card */}
        <StatusCard
          icon={Server}
          title="DHCP & DNS Server"
          isHealthy={dnsmasqStatus.isHealthy}
          issues={dnsmasqStatus.issues}
          info={COMPONENT_INFO.dnsmasq}
          metrics={[
            { label: 'Running', value: dnsmasq.isRunning, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.isRunning },
            { label: 'DHCP Port', value: dnsmasq.listeningPort, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.listeningPort },
            { label: 'PID', value: dnsmasq.pid || 'N/A', tooltip: FIELD_TOOLTIPS.dnsmasq.pid },
            { label: 'PID Match', value: dnsmasq.pidMatches, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.pidMatches },
            { label: 'Config', value: dnsmasq.configExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.configExists },
            { label: 'Leases', value: dnsmasq.leaseFileExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.dnsmasq.leaseFileExists },
          ]}
          extraContent={
            <div className="mt-3 pt-3 border-t space-y-2">
              {dnsmasq.configPath && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Config Path</span>
                  <div className="flex items-center gap-1">
                    <code className="bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[180px]">
                      {dnsmasq.configPath}
                    </code>
                    <button
                      onClick={() => copyToClipboard(dnsmasq.configPath, 'config')}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedPath === 'config' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {dnsmasq.leasePath && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Lease Path</span>
                  <div className="flex items-center gap-1">
                    <code className="bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[180px]">
                      {dnsmasq.leasePath}
                    </code>
                    <button
                      onClick={() => copyToClipboard(dnsmasq.leasePath, 'lease')}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedPath === 'lease' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          }
        />

        {/* NAT Card */}
        <StatusCard
          icon={Route}
          title="NAT Gateway"
          isHealthy={natStatus.isHealthy}
          issues={natStatus.issues}
          info={COMPONENT_INFO.nat}
          metrics={[
            { label: 'IP Forwarding', value: nat.ipForwardingEnabled, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.ipForwardingEnabled },
            { label: 'NAT Rule', value: nat.ruleExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.ruleExists },
            { label: 'Table', value: nat.tableExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.tableExists },
            { label: 'Chain', value: nat.chainExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.nat.chainExists },
          ]}
          extraContent={
            nat.ruleDetails && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">NAT Rule</p>
                <div className="bg-muted p-2 rounded-md">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {nat.ruleDetails}
                  </pre>
                </div>
              </div>
            )
          }
        />

        {/* br_netfilter Card */}
        <StatusCard
          icon={Shield}
          title="Bridge Firewall"
          isHealthy={brNetfilterStatus.isHealthy}
          issues={brNetfilterStatus.issues}
          info={COMPONENT_INFO.brNetfilter}
          metrics={[
            { label: 'Module Loaded', value: brNetfilter.moduleLoaded, type: 'boolean', tooltip: FIELD_TOOLTIPS.brNetfilter.moduleLoaded },
            { label: 'Persistence', value: brNetfilter.persistenceFileExists, type: 'boolean', tooltip: FIELD_TOOLTIPS.brNetfilter.persistenceFile },
            { label: 'IPv4 iptables', value: brNetfilter.callIptables === 0 ? 'Disabled' : 'Enabled', tooltip: FIELD_TOOLTIPS.brNetfilter.callIptables },
          ]}
          extraContent={
            <div className="mt-3 pt-3 border-t space-y-1">
              <MetricRow
                label="IPv6 ip6tables"
                value={brNetfilter.callIp6tables === 0 ? 'Disabled' : 'Enabled'}
                tooltip={FIELD_TOOLTIPS.brNetfilter.callIp6tables}
              />
              <MetricRow
                label="ARP arptables"
                value={brNetfilter.callArptables === 0 ? 'Disabled' : 'Enabled'}
                tooltip={FIELD_TOOLTIPS.brNetfilter.callArptables}
              />
              <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700">
                  <HelpCircle className="w-3 h-3 inline mr-1" />
                  "Disabled" values are typically correct. This prevents host firewall rules from interfering with VM traffic.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </TooltipProvider>
  );
};

export default ComponentStatusCards;
