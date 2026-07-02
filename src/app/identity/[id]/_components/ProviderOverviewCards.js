'use client';

import {
  Alert,
  Badge,
  ResponsiveStack,
  StatusDot } from
'@infinibay/harbor';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { timeAgo } from './utils';

function providerStatusMeta(status) {
  switch (status) {
    case 'CONNECTED':
      return { dot: 'online', tone: 'success', label: 'Connected' };
    case 'SYNCING':
      return { dot: 'provisioning', tone: 'info', label: 'Syncing' };
    case 'ERROR':
      return { dot: 'degraded', tone: 'warning', label: 'Error' };
    case 'DISCONNECTED':
    default:
      return { dot: 'offline', tone: 'neutral', label: 'Disconnected' };
  }
}

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-28 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>);

}

export function ProviderOverviewCards({ provider }) {
  const meta = providerStatusMeta(provider.status);
  return (
    <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={4} align="stretch">
      <div className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
        <ResponsiveStack direction="col" gap={3}>
          <ResponsiveStack direction="row" gap={2} align="center" justify="between">
            <ResponsiveStack direction="row" gap={2} align="center">
              <StatusDot status={meta.dot} size={8} />
              <span className="text-sm font-medium">Connection</span>
            </ResponsiveStack>
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </ResponsiveStack>
          <KV label="Last test" value={timeAgo(provider.lastTestAt)} />
          <KV label="Last sync" value={timeAgo(provider.lastSyncAt)} />
          <KV label="Enabled" value={provider.enabled ? 'Yes' : 'No'} />
          {provider.lastError ? (
            <Alert tone="warning" icon={<AlertCircle size={14} />} title="Last connection error">
              {provider.lastError}
            </Alert>
          ) : null}
        </ResponsiveStack>
      </div>

      <div className="w-full lg:w-80 rounded-md border border-border-subtle bg-surface-raised p-4">
        <ResponsiveStack direction="col" gap={3}>
          <ResponsiveStack direction="row" gap={2} align="center">
            <CheckCircle2 size={16} className="text-fg-muted" />
            <span className="text-sm font-medium">Sync readiness</span>
          </ResponsiveStack>
          <span className="text-sm text-fg-muted">
            Sync imports directory users into Infinibay as standard users and links them to this connector for future updates.
          </span>
          <KV label="Users" value="Created and updated during manual sync" />
          <KV label="Groups" value={provider.groupFilter ? 'Counted during sync' : 'No group filter configured'} />
        </ResponsiveStack>
      </div>
    </ResponsiveStack>);

}
