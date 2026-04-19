'use client';

import React from 'react';
import { Card, Stat, Badge } from '@infinibay/harbor';
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';

/**
 * Overview tab — placeholder while the full redesign (MetricCards +
 * Sparklines + SnapshotTimeline + PropertyList) lands in Fase 2.2.
 * Shows static allocation from the VM record so the tab isn't empty.
 */
const VMOverviewTab = ({ vm }) => {
  if (!vm) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="vCPU cores"
          value={vm.cpuCores ?? 0}
          icon={<Cpu className="h-3.5 w-3.5" />}
        />
        <Stat
          label="RAM"
          value={vm.ramGB ?? 0}
          suffix="GB"
          icon={<MemoryStick className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Disk"
          value={vm.template?.storage ?? 0}
          suffix="GB"
          icon={<HardDrive className="h-3.5 w-3.5" />}
        />
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 text-xs text-fg-muted uppercase tracking-wider mb-2">
            <Network className="h-3.5 w-3.5" />
            Network
          </div>
          <div className="text-sm font-mono text-fg truncate">{vm.localIP || '—'}</div>
          {vm.publicIP ? (
            <div className="text-xs font-mono text-fg-muted truncate mt-0.5">
              public {vm.publicIP}
            </div>
          ) : null}
        </Card>
      </div>

      <Card variant="glass" className="p-6">
        <div className="text-sm text-fg-muted space-y-2">
          <p>Live metrics, sparklines, snapshot timeline and critical alerts land here in Fase 2.2.</p>
          <p className="flex items-center gap-2 flex-wrap">
            Template:
            {vm.template?.name ? <Badge tone="info">{vm.template.name}</Badge> : <span>—</span>}
            {vm.department?.name ? <Badge tone="neutral">{vm.department.name}</Badge> : null}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VMOverviewTab;
