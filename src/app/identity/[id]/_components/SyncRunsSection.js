'use client';

import { useMemo } from 'react';
import {
  Alert,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import { RefreshCw } from 'lucide-react';

import { timeAgo } from './utils';

export function SyncRunsSection({ runs, loading, error, onRetry }) {
  const providerRunColumns = useMemo(() => [
  {
    id: 'status',
    header: 'Status',
    width: 120,
    cell: ({ row: r }) =>
    <ResponsiveStack direction="row" gap={2} align="center">
          <StatusDot status={r.status === 'SUCCESS' ? 'online' : r.status === 'ERROR' ? 'degraded' : 'provisioning'} size={8} />
          <span className="text-sm">{r.status}</span>
        </ResponsiveStack>

  },
  { id: 'startedAt', header: 'Started', width: 150, cell: ({ row: r }) => <span className="text-sm">{timeAgo(r.startedAt)}</span> },
  { id: 'usersCreated', header: '+ Users', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersCreated}</span> },
  { id: 'usersUpdated', header: '~ Users', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersUpdated}</span> },
  { id: 'usersDisabled', header: '- Users', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersDisabled}</span> },
  { id: 'groupsSeen', header: 'Groups', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.groupsSeen}</span> },
  { id: 'message', header: 'Message', cell: ({ row: r }) => <span className={r.error ? 'text-sm text-danger' : 'text-sm text-fg-muted'}>{r.error || r.message || '—'}</span> }],
  []);

  const renderBody = () => {
    if (loading && runs.length === 0) {
      return (
        <ResponsiveStack direction="col" gap={2}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </ResponsiveStack>
      );
    }
    if (error) {
      return (
        <Alert
          tone="danger"
          title="Could not load sync runs"
          actions={
            onRetry ? (
              <Button size="sm" variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            ) : null
          }
        >
          {error.message || 'Something went wrong while loading recent sync runs.'}
        </Alert>
      );
    }
    if (runs.length > 0) {
      return (
        <DataTable
          rows={runs}
          columns={providerRunColumns}
          rowId={(r) => r.id}
          defaultDensity="compact"
        />
      );
    }
    return (
      <EmptyState
        icon={<RefreshCw size={18} />}
        title="No sync runs yet"
        description="Run a manual sync to import directory users and record the first sync result."
      />
    );
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="pb-2 border-b border-border-subtle">
        <h2 className="text-base font-semibold m-0">
          Recent sync runs <span className="text-fg-muted text-xs font-normal">· {runs.length}</span>
        </h2>
      </div>
      {renderBody()}
    </section>
  );
}
