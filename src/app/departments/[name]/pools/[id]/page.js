'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Button,
  EmptyState,
  ResponsiveStack,
} from '@infinibay/harbor';
import { ArrowLeft, Layers } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { POOLS } from '@/lib/mockData/pools';

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-32 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>
  );
}

export default function PoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pool = POOLS.find((p) => p.id === params.id);
  const [tab, setTab] = useState('overview');

  if (!pool) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PreviewBanner />
          <EmptyState
            icon={<Layers size={18} />}
            title="Pool not found"
            actions={
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/pools')}
              >
                Back
              </Button>
            }
          />
        </ResponsiveStack>
      </Page>
    );
  }

  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'desktops',   label: 'Desktops' },
    { id: 'sessions',   label: `Sessions · ${pool.activeSessions}` },
    { id: 'image',      label: 'Image' },
    { id: 'assignment', label: 'Assignment' },
    { id: 'settings',   label: 'Settings' },
  ];

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title={pool.name}
          count={`${pool.department} · ${pool.type === 'persistent' ? 'Persistent' : 'Non-persistent'} · ${pool.activeSessions} active`}
          secondary={
            <Button
              size="sm"
              variant="ghost"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/pools')}
            >
              Back
            </Button>
          }
        />

        <ResponsiveStack direction="row" gap={1} align="center" wrap>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                'text-sm px-3 py-1.5 rounded-md transition-colors',
                tab === t.id ? 'bg-white/10 text-fg' : 'text-fg-muted hover:text-fg hover:bg-white/5',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </ResponsiveStack>

        {tab === 'overview' && (
          <section className="flex flex-col gap-2 py-2">
            <KV label="Department" value={pool.department} />
            <KV label="Blueprint" value={pool.blueprint} />
            <KV label="Image version" value={pool.imageVersion} mono />
            <KV label="Type" value={pool.type === 'persistent' ? 'Persistent' : 'Non-persistent'} />
            <KV label="Size" value={`${pool.minSize} – ${pool.maxSize} desktops`} mono />
            <KV label="Active sessions" value={pool.activeSessions} mono />
            <KV label="Idle desktops" value={pool.idleDesktops} mono />
            <KV label="Idle timeout" value={`${pool.idleTimeoutMin} min`} mono />
            <KV label="Health" value={pool.health} />
          </section>
        )}

        {tab === 'desktops' && (
          <section className="py-2">
            <span className="text-fg-muted text-sm">
              Desktops in this pool are backed by the live Desktops list. Filter
              <code className="font-mono text-xs bg-white/5 rounded px-1 mx-1">pool={pool.name}</code>
              in <Link className="underline underline-offset-2" href="/desktops">/desktops</Link>.
            </span>
          </section>
        )}

        {tab === 'sessions' && (
          <section className="py-2">
            <span className="text-fg-muted text-sm">
              {pool.activeSessions} active sessions in this pool —
              see <Link className="underline underline-offset-2" href="/sessions">/sessions</Link>.
            </span>
          </section>
        )}

        {tab === 'image' && (
          <section className="flex flex-col gap-2 py-2">
            <KV label="Blueprint" value={pool.blueprint} />
            <KV label="Current version" value={pool.imageVersion} mono />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toast.info('Preview only — not wired yet.')}
            >
              Publish new version
            </Button>
          </section>
        )}

        {tab === 'assignment' && (
          <section className="flex flex-col gap-2 py-2">
            <span className="text-fg-muted text-sm">
              Users get a desktop from this pool when they belong to:
            </span>
            <div className="flex flex-col gap-1">
              {pool.assignedGroups.map((g) => (
                <span key={g} className="font-mono text-xs">{g}</span>
              ))}
            </div>
          </section>
        )}

        {tab === 'settings' && (
          <section className="flex flex-col gap-2 py-2">
            <KV label="Type" value={pool.type} />
            <KV label="Min / max size" value={`${pool.minSize} – ${pool.maxSize}`} mono />
            <KV label="Idle timeout" value={`${pool.idleTimeoutMin} min`} mono />
            <span className="text-fg-muted text-xs pt-2">
              Editing pool settings in this preview is non-operative.
            </span>
          </section>
        )}
      </ResponsiveStack>
    </Page>
  );
}
