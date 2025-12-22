'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Network,
  Server,
  Route,
  Globe,
  CheckCircle,
  XCircle,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getGlassClasses } from '@/utils/glass-effects';
import { COMPONENT_INFO, FIELD_TOOLTIPS, getFlowStatus } from './networkDiagnosticsHelp';

const FlowNode = ({ icon: Icon, label, status, isOk, details, info, isFirst, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      {/* Node */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'relative flex flex-col items-center p-4 rounded-xl transition-all duration-200',
              'hover:scale-105 cursor-pointer',
              'border-2',
              isOk
                ? 'bg-green-50/80 border-green-300 hover:bg-green-100/80'
                : 'bg-red-50/80 border-red-300 hover:bg-red-100/80'
            )}
          >
            {/* Status indicator */}
            <div className="absolute -top-2 -right-2">
              {isOk ? (
                <CheckCircle className="w-5 h-5 text-green-600 fill-white" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 fill-white" />
              )}
            </div>

            {/* Icon */}
            <div
              className={cn(
                'p-3 rounded-lg mb-2',
                isOk ? 'bg-green-100' : 'bg-red-100'
              )}
            >
              <Icon className={cn('w-6 h-6', isOk ? 'text-green-700' : 'text-red-700')} />
            </div>

            {/* Label */}
            <span className="text-sm font-medium text-foreground">{label}</span>

            {/* Status badge */}
            <Badge
              className={cn(
                'mt-1 text-xs',
                isOk
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              )}
            >
              {status}
            </Badge>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="center">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Icon className={cn('w-5 h-5', isOk ? 'text-green-600' : 'text-red-600')} />
              <h4 className="font-semibold">{info.name}</h4>
              <Badge className={cn('ml-auto', isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                {isOk ? 'OK' : 'Issue'}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{info.description}</p>

            {/* What it does */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">What it does</p>
                  <p className="text-xs text-blue-700">{info.whatItDoes}</p>
                </div>
              </div>
            </div>

            {/* If fails warning */}
            {!isOk && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-medium text-red-800 mb-1">Impact</p>
                <p className="text-xs text-red-700">{info.ifFails}</p>
              </div>
            )}

            {/* Details */}
            {details && details.length > 0 && (
              <div className="space-y-1 pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground">Details</p>
                {details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Connector arrow (not after last node) */}
      {!isLast && (
        <div className="flex items-center mx-2">
          <div
            className={cn(
              'w-8 h-0.5',
              isOk ? 'bg-green-300' : 'bg-red-300 border-dashed'
            )}
          />
          <ChevronRight
            className={cn('w-4 h-4 -ml-1', isOk ? 'text-green-400' : 'text-red-400')}
          />
        </div>
      )}
    </div>
  );
};

const NetworkFlowDiagram = ({ diagnostics }) => {
  const flowStatus = getFlowStatus(diagnostics);

  // Prepare details for each node
  const bridgeDetails = diagnostics?.bridge
    ? [
        { label: 'IP Address', value: diagnostics.bridge.ipAddresses?.join(', ') || 'None' },
        { label: 'MTU', value: diagnostics.bridge.mtu || 'Unknown' },
        { label: 'State', value: diagnostics.bridge.state || 'Unknown' },
        {
          label: 'Interfaces',
          value: diagnostics.bridge.attachedInterfaces?.length || 0,
        },
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
        { label: 'NAT Rule', value: diagnostics.nat.ruleExists ? 'Configured' : 'Missing' },
        { label: 'IP Forward', value: diagnostics.nat.ipForwardingEnabled ? 'Enabled' : 'Disabled' },
        { label: 'Table', value: diagnostics.nat.tableExists ? 'Exists' : 'Missing' },
        { label: 'Chain', value: diagnostics.nat.chainExists ? 'Exists' : 'Missing' },
      ]
    : [];

  // All nodes OK determines if we show "all green" internet
  const allOk = flowStatus.bridge.ok && flowStatus.dnsmasq.ok && flowStatus.nat.ok;

  return (
    <TooltipProvider>
      <div className={cn(getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'lg' }), 'p-6')}>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Network Flow</h3>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                This diagram shows the path network traffic takes from your VMs to the internet.
                Click on each component to see details.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Flow diagram */}
        <div className="flex items-center justify-center py-4 overflow-x-auto">
          {/* VM Node (always OK - represents the VMs) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100 border-2 border-slate-300">
            <div className="p-2 rounded-lg bg-slate-200 mb-2">
              <Monitor className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-xs font-medium text-slate-700">VMs</span>
          </div>

          {/* Arrow to Bridge */}
          <div className="flex items-center mx-2">
            <div className="w-6 h-0.5 bg-slate-300" />
            <ChevronRight className="w-4 h-4 -ml-1 text-slate-400" />
          </div>

          {/* Bridge Node */}
          <FlowNode
            icon={Network}
            label="Bridge"
            status={flowStatus.bridge.label}
            isOk={flowStatus.bridge.ok}
            details={bridgeDetails}
            info={COMPONENT_INFO.bridge}
          />

          {/* DNSMASQ Node */}
          <FlowNode
            icon={Server}
            label="DHCP/DNS"
            status={flowStatus.dnsmasq.label}
            isOk={flowStatus.dnsmasq.ok}
            details={dnsmasqDetails}
            info={COMPONENT_INFO.dnsmasq}
          />

          {/* NAT Node */}
          <FlowNode
            icon={Route}
            label="NAT"
            status={flowStatus.nat.label}
            isOk={flowStatus.nat.ok}
            details={natDetails}
            info={COMPONENT_INFO.nat}
            isLast
          />

          {/* Arrow to Internet */}
          <div className="flex items-center mx-2">
            <div className={cn('w-6 h-0.5', allOk ? 'bg-green-300' : 'bg-red-300')} />
            <ChevronRight className={cn('w-4 h-4 -ml-1', allOk ? 'text-green-400' : 'text-red-400')} />
          </div>

          {/* Internet Node */}
          <div
            className={cn(
              'flex flex-col items-center p-3 rounded-xl border-2',
              allOk
                ? 'bg-blue-50 border-blue-300'
                : 'bg-slate-100 border-slate-300'
            )}
          >
            <div className={cn('p-2 rounded-lg mb-2', allOk ? 'bg-blue-100' : 'bg-slate-200')}>
              <Globe className={cn('w-5 h-5', allOk ? 'text-blue-700' : 'text-slate-500')} />
            </div>
            <span className={cn('text-xs font-medium', allOk ? 'text-blue-700' : 'text-slate-500')}>
              Internet
            </span>
            {allOk ? (
              <Badge className="mt-1 text-xs bg-blue-100 text-blue-800 border-blue-300">
                Reachable
              </Badge>
            ) : (
              <Badge className="mt-1 text-xs bg-slate-100 text-slate-600 border-slate-300">
                Blocked
              </Badge>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>Working</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Issue detected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Click nodes for details</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NetworkFlowDiagram;
