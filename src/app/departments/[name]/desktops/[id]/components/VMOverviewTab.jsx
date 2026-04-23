'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Badge,
  Card,
  EmptyState,
  Page,
  PropertyList,
  ResourceMeter,
  ResponsiveStack,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  Cpu,
  HardDrive,
  Heart,
  Info,
  MemoryStick,
  Network,
} from 'lucide-react';
import useVMProblems from '@/hooks/useVMProblems';

const VMOverviewTab = ({ vmId, vm }) => {
  const healthMachine = useSelector(
    (state) => state.health?.machines?.[vmId] || null,
  );

  const {
    criticalProblems = [],
    importantProblems = [],
    informationalProblems = [],
    requiresImmediateAction,
    lastCheckTime,
  } = useVMProblems(vmId, vm?.name) || {};

  const metrics = healthMachine?.metrics || {};
  const hasMetrics =
    metrics.cpu?.usage != null ||
    metrics.memory?.usage != null ||
    metrics.storage?.usage != null ||
    metrics.network?.bandwidth != null;

  const healthLevel =
    requiresImmediateAction || criticalProblems.length > 0
      ? 'critical'
      : importantProblems.length > 0
        ? 'degraded'
        : 'healthy';

  const healthTone =
    healthLevel === 'critical'
      ? 'danger'
      : healthLevel === 'degraded'
        ? 'warning'
        : 'success';

  const healthLabel =
    healthLevel === 'critical'
      ? 'Needs attention'
      : healthLevel === 'degraded'
        ? 'Running with warnings'
        : 'Operating normally';

  const propertyItems = useMemo(
    () => [
      { key: 'cores', section: 'Hardware', label: 'vCPU cores', value: vm?.cpuCores ?? '—' },
      { key: 'ram', section: 'Hardware', label: 'RAM', value: vm?.ramGB ? `${vm.ramGB} GB` : '—' },
      { key: 'disk', section: 'Hardware', label: 'Disk', value: vm?.template?.storage ? `${vm.template.storage} GB` : '—' },
      { key: 'gpu', section: 'Hardware', label: 'GPU', value: vm?.gpuPciAddress || '—' },
      { key: 'template', section: 'Hardware', label: 'Blueprint', value: vm?.template?.name || '—' },
      { key: 'localIP', section: 'Network', label: 'Local IP', value: vm?.localIP || '—', copyable: !!vm?.localIP },
      { key: 'publicIP', section: 'Network', label: 'Public IP', value: vm?.publicIP || '—', copyable: !!vm?.publicIP },
      { key: 'os', section: 'Network', label: 'OS', value: vm?.configuration?.os || vm?.os || '—' },
      { key: 'department', section: 'Identity', label: 'Department', value: vm?.department?.name || '—' },
      {
        key: 'owner',
        section: 'Identity',
        label: 'Owner',
        value: vm?.user
          ? `${vm.user.firstName || ''} ${vm.user.lastName || ''}`.trim() ||
            vm.user.email
          : '—',
      },
      {
        key: 'created',
        section: 'Identity',
        label: 'Created',
        value: vm?.createdAt ? new Date(vm.createdAt).toLocaleString() : '—',
      },
      { key: 'id', section: 'Identity', label: 'VM ID', value: vm?.id || '—', copyable: !!vm?.id },
    ],
    [vm],
  );

  const totalProblems =
    criticalProblems.length + importantProblems.length + informationalProblems.length;

  return (
    <Page>
        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Heart size={18} />}
          leadingIconTone={healthLevel === 'healthy' ? 'green' : healthLevel === 'degraded' ? 'amber' : 'rose'}
          title={
            <ResponsiveStack direction="row" gap={3} align="center" wrap>
              <span>Health</span>
              <Badge tone={healthTone} pulse={healthLevel !== 'healthy'}>
                {healthLabel}
              </Badge>
              {lastCheckTime ? (
                <span>
                  last check {new Date(lastCheckTime).toLocaleTimeString()}
                </span>
              ) : null}
            </ResponsiveStack>
          }
          description={
            totalProblems === 0
              ? 'No detected issues for this VM.'
              : `${totalProblems} detected issue${totalProblems !== 1 ? 's' : ''}.`
          }
        >
          {totalProblems > 0 ? (
            <ResponsiveStack direction="row" gap={2} wrap>
              {criticalProblems.length > 0 ? (
                <Badge tone="danger" icon={<AlertTriangle size={12} />} pulse>
                  {criticalProblems.length} critical
                </Badge>
              ) : null}
              {importantProblems.length > 0 ? (
                <Badge tone="warning" icon={<AlertTriangle size={12} />}>
                  {importantProblems.length} important
                </Badge>
              ) : null}
              {informationalProblems.length > 0 ? (
                <Badge tone="info" icon={<Info size={12} />}>
                  {informationalProblems.length} info
                </Badge>
              ) : null}
            </ResponsiveStack>
          ) : null}
        </Card>

        {criticalProblems.length > 0 ? (
          <Alert
            tone="danger"
            icon={<AlertTriangle size={14} />}
            title={`${criticalProblems.length} critical ${
              criticalProblems.length === 1 ? 'problem' : 'problems'
            } need attention`}
          >
            <ResponsiveStack direction="col" gap={1}>
              {criticalProblems.slice(0, 3).map((p) => (
                <span key={p.id}>• {p.description || p.title || p.type}</span>
              ))}
              {criticalProblems.length > 3 ? (
                <span>+ {criticalProblems.length - 3} more…</span>
              ) : null}
            </ResponsiveStack>
          </Alert>
        ) : null}

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Cpu size={18} />}
          leadingIconTone="sky"
          title="Live resources"
          description={
            hasMetrics
              ? 'Instant readings from the running VM.'
              : 'The VM is not reporting live metrics right now.'
          }
        >
          {hasMetrics ? (
            <ResourceMeter
              resources={[
                {
                  label: 'CPU',
                  value: metrics.cpu?.usage ?? 0,
                  detail:
                    metrics.cpu?.usage != null
                      ? `${Math.round(metrics.cpu.usage)}% of ${vm?.cpuCores ?? '?'} cores`
                      : undefined,
                  icon: <Cpu size={14} />,
                },
                {
                  label: 'Memory',
                  value: metrics.memory?.usage ?? 0,
                  detail:
                    metrics.memory?.usage != null
                      ? `${Math.round(metrics.memory.usage)}% of ${vm?.ramGB ?? '?'} GB`
                      : undefined,
                  icon: <MemoryStick size={14} />,
                },
                {
                  label: 'Disk',
                  value: metrics.storage?.usage ?? 0,
                  detail:
                    metrics.storage?.usage != null
                      ? `${Math.round(metrics.storage.usage)}%`
                      : undefined,
                  icon: <HardDrive size={14} />,
                },
                {
                  label: 'Network',
                  value: Math.min(100, metrics.network?.bandwidth ?? 0),
                  detail:
                    metrics.network?.bandwidth != null
                      ? `${Math.round(metrics.network.bandwidth)} Mbps`
                      : undefined,
                  icon: <Network size={14} />,
                },
              ]}
            />
          ) : (
            <EmptyState
              variant="inline"
              icon={<Cpu size={14} />}
              title="No live metrics"
              description="Start the desktop and install InfiniService to see CPU, memory, disk and network usage here."
            />
          )}
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Info size={18} />}
          leadingIconTone="purple"
          title="Details"
        >
          <PropertyList items={propertyItems} />
        </Card>

        {importantProblems.length > 0 ? (
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title={`${importantProblems.length} important issue${importantProblems.length !== 1 ? 's' : ''}`}
          >
            <ResponsiveStack direction="col" gap={1}>
              {importantProblems.slice(0, 5).map((p) => (
                <span key={p.id}>• {p.description || p.title || p.type}</span>
              ))}
            </ResponsiveStack>
          </Alert>
        ) : null}
    </Page>
  );
};

export default VMOverviewTab;
