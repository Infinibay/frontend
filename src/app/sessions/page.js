'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  DataTable,
  ResponsiveStack,
  StatusDot,
} from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { LIVE_SESSIONS } from '@/lib/mockData/sessions';

function duration(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

/** Tiny ticker so the "Duration" column feels live. */
function useTicker(intervalMs = 3000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setN((n) => n + 1), intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
}

export default function SessionsListPage() {
  const router = useRouter();
  useTicker(3000);

  const columns = useMemo(
    () => [
      {
        key: 'user',
        label: 'User',
        render: (row) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status="online" size={8} />
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.userName}</span>
              <span className="text-fg-muted text-xs font-mono">{row.userEmail}</span>
            </ResponsiveStack>
          </ResponsiveStack>
        ),
      },
      {
        key: 'desktop',
        label: 'Desktop',
        width: 140,
        render: (row) => <span className="font-mono text-sm">{row.desktopName}</span>,
      },
      {
        key: 'host',
        label: 'Host',
        width: 100,
        render: (row) => <span className="font-mono text-xs text-fg-muted">{row.host}</span>,
      },
      {
        key: 'clientIp',
        label: 'Client',
        width: 140,
        render: (row) => <span className="font-mono text-xs">{row.clientIp}</span>,
      },
      {
        key: 'protocol',
        label: 'Protocol',
        width: 110,
        render: (row) => <Badge tone="neutral">{row.protocol}</Badge>,
      },
      {
        key: 'connectedAt',
        label: 'Duration',
        width: 100,
        render: (row) => <span className="font-mono text-xs">{duration(row.connectedAt)}</span>,
      },
      {
        key: 'latencyMs',
        label: 'Latency',
        width: 90,
        align: 'right',
        render: (row) => (
          <span
            className={[
              'font-mono text-xs',
              row.latencyMs > 60 ? 'text-warning' : '',
            ].join(' ')}
          >
            {row.latencyMs} ms
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title="Sessions"
          count={`${LIVE_SESSIONS.length} live`}
        />
        <DataTable
          rows={LIVE_SESSIONS}
          columns={columns}
          rowKey={(r) => r.id}
          dense
          onRowClick={(r) => router.push(`/sessions/${r.id}`)}
        />
      </ResponsiveStack>
    </Page>
  );
}
