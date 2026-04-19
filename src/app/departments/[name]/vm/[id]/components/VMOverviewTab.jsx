'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  MetricCard,
  PropertyList,
  Alert,
  Badge,
  StatusDot,
  Stat,
} from '@infinibay/harbor';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import useVMProblems from '@/hooks/useVMProblems';

/**
 * VM detail — Overview tab.
 *
 * Harbor-native dashboard. Reads live health data from the Redux
 * `health.machines[vmId]` slice (populated by the socket service /
 * polling elsewhere). When no metrics are present the MetricCards
 * fall back to the VM's allocation totals so the page still reads
 * usefully for stopped / fresh VMs.
 */
const VMOverviewTab = ({ vmId, vm }) => {
  const healthMachine = useSelector(
    (state) => state.health?.machines?.[vmId] || null
  );

  const {
    criticalProblems = [],
    importantProblems = [],
    informationalProblems = [],
    requiresImmediateAction,
    lastCheckTime,
  } = useVMProblems(vmId, vm?.name) || {};

  const metrics = healthMachine?.metrics || {};

  const propertyItems = useMemo(() => {
    const items = [];

    // Hardware
    items.push(
      { key: 'cores', section: 'Hardware', label: 'vCPU cores', value: vm?.cpuCores ?? '—' },
      { key: 'ram', section: 'Hardware', label: 'RAM', value: vm?.ramGB ? `${vm.ramGB} GB` : '—' },
      { key: 'disk', section: 'Hardware', label: 'Disk', value: vm?.template?.storage ? `${vm.template.storage} GB` : '—' },
      { key: 'gpu', section: 'Hardware', label: 'GPU', value: vm?.gpuPciAddress || '—' },
      { key: 'template', section: 'Hardware', label: 'Template', value: vm?.template?.name || '—' },
    );

    // Network
    items.push(
      { key: 'localIP', section: 'Network', label: 'Local IP', value: vm?.localIP || '—', copyable: !!vm?.localIP },
      { key: 'publicIP', section: 'Network', label: 'Public IP', value: vm?.publicIP || '—', copyable: !!vm?.publicIP },
      { key: 'os', section: 'Network', label: 'OS', value: vm?.configuration?.os || vm?.os || '—' },
    );

    // Identity
    items.push(
      { key: 'department', section: 'Identity', label: 'Department', value: vm?.department?.name || '—' },
      {
        key: 'owner',
        section: 'Identity',
        label: 'Owner',
        value: vm?.user
          ? `${vm.user.firstName || ''} ${vm.user.lastName || ''}`.trim() || vm.user.email
          : '—',
      },
      {
        key: 'created',
        section: 'Identity',
        label: 'Created',
        value: vm?.createdAt ? new Date(vm.createdAt).toLocaleString() : '—',
      },
      { key: 'id', section: 'Identity', label: 'VM ID', value: vm?.id || '—', copyable: !!vm?.id },
    );

    return items;
  }, [vm]);

  const healthLevel = requiresImmediateAction || criticalProblems.length > 0
    ? 'offline'
    : importantProblems.length > 0
      ? 'degraded'
      : 'online';

  const healthLabel = healthLevel === 'online'
    ? 'Healthy'
    : healthLevel === 'degraded'
      ? 'Needs attention'
      : 'Critical';

  return (
    <div className="space-y-6">
      {/* Critical problems banner — shown only when there are criticals. */}
      {criticalProblems.length > 0 && (
        <Alert
          tone="danger"
          title={`${criticalProblems.length} critical ${criticalProblems.length === 1 ? 'problem' : 'problems'} need attention`}
        >
          <ul className="list-disc list-inside space-y-0.5">
            {criticalProblems.slice(0, 3).map((p) => (
              <li key={p.id}>{p.description || p.title || p.type}</li>
            ))}
            {criticalProblems.length > 3 && (
              <li className="text-fg-subtle">+ {criticalProblems.length - 3} more…</li>
            )}
          </ul>
        </Alert>
      )}

      {/* Health summary — 4 stats. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 flex items-center gap-3">
          <StatusDot status={healthLevel} />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-fg-muted">Health</div>
            <div className="text-sm font-medium text-fg">{healthLabel}</div>
            {lastCheckTime && (
              <div className="text-[10px] text-fg-subtle mt-0.5">
                last check {new Date(lastCheckTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        </Card>
        <Stat
          label="Critical"
          value={criticalProblems.length}
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Important"
          value={importantProblems.length}
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Informational"
          value={informationalProblems.length}
          icon={<CheckCircle className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Live metric cards. Values are instant reads from Redux health
          state; no time-series available yet (tracked separately), so
          we fall back to the allocation when metrics haven't arrived. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CPU usage"
          icon={<Cpu className="h-4 w-4" />}
          value={metrics.cpu?.usage != null ? Math.round(metrics.cpu.usage) : '—'}
          unit={metrics.cpu?.usage != null ? '%' : ''}
          raw={metrics.cpu?.usage}
          threshold={[70, 90]}
        />
        <MetricCard
          label="Memory usage"
          icon={<MemoryStick className="h-4 w-4" />}
          value={metrics.memory?.usage != null ? Math.round(metrics.memory.usage) : '—'}
          unit={metrics.memory?.usage != null ? '%' : ''}
          raw={metrics.memory?.usage}
          threshold={[75, 90]}
        />
        <MetricCard
          label="Disk usage"
          icon={<HardDrive className="h-4 w-4" />}
          value={metrics.storage?.usage != null ? Math.round(metrics.storage.usage) : '—'}
          unit={metrics.storage?.usage != null ? '%' : ''}
          raw={metrics.storage?.usage}
          threshold={[80, 92]}
        />
        <MetricCard
          label="Network"
          icon={<Network className="h-4 w-4" />}
          value={metrics.network?.bandwidth != null ? Math.round(metrics.network.bandwidth) : '—'}
          unit={metrics.network?.bandwidth != null ? 'Mbps' : ''}
        />
      </div>

      {/* Properties grid — hardware, network, identity. */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-fg mb-4">Details</h2>
          <PropertyList items={propertyItems} />
        </div>
      </Card>

      {/* Important / informational problems — compact lists. */}
      {importantProblems.length > 0 && (
        <Alert tone="warning" title={`${importantProblems.length} important`}>
          <ul className="list-disc list-inside space-y-0.5">
            {importantProblems.slice(0, 5).map((p) => (
              <li key={p.id}>{p.description || p.title || p.type}</li>
            ))}
          </ul>
        </Alert>
      )}

      {informationalProblems.length === 0 &&
        importantProblems.length === 0 &&
        criticalProblems.length === 0 && (
          <Alert tone="success" title="All clear">
            No detected problems for this VM. The system is operating normally.
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="success">OK</Badge>
              {vm?.status && <Badge tone="neutral">{vm.status}</Badge>}
            </div>
          </Alert>
        )}
    </div>
  );
};

export default VMOverviewTab;
