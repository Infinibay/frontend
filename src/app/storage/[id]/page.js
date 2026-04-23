'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Badge,
  Button,
  EmptyState,
  ResourceMeter,
  ResponsiveStack,
} from '@infinibay/harbor';
import { ArrowLeft, CheckCircle2, HardDrive, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { STORAGE_MOUNTS, TYPE_META } from '@/lib/mockData/storage';

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-28 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>
  );
}

export default function StorageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const m = STORAGE_MOUNTS.find((x) => x.id === params.id);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  if (!m) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PreviewBanner />
          <EmptyState
            icon={<HardDrive size={18} />}
            title="Mount not found"
            actions={
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/storage')}
              >
                Back
              </Button>
            }
          />
        </ResponsiveStack>
      </Page>
    );
  }

  const meta = TYPE_META[m.type];
  const pct = Math.round((m.usedGB / m.totalGB) * 100);

  const onTest = () => {
    setTesting(true);
    setResult(null);
    setTimeout(() => {
      setTesting(false);
      setResult({
        ok: true,
        message: `Reached ${m.endpoint} — ${m.latencyMs || '<1'} ms round-trip.`,
      });
    }, 700);
  };

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title={m.name}
          count={`${meta.label} · ${pct}% used`}
          primary={
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              loading={testing}
              onClick={onTest}
            >
              Test connection
            </Button>
          }
          secondary={
            <Button
              size="sm"
              variant="ghost"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/storage')}
            >
              Back
            </Button>
          }
        />

        {result ? (
          <Alert
            tone="success"
            icon={<CheckCircle2 size={14} />}
            title="Connection successful"
          >
            <span className="font-mono text-xs">{result.message}</span>
          </Alert>
        ) : null}

        <section className="flex flex-col gap-2">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">Connection</h2>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <KV label="Type" value={<Badge tone="neutral">{meta.label}</Badge>} />
            <KV label="Endpoint" value={m.endpoint} mono />
            {m.bucket ? <KV label="Bucket" value={m.bucket} mono /> : null}
            <KV label="Status" value={m.status} />
            <KV label="Latency" value={m.latencyMs === 0 ? 'local' : `${m.latencyMs} ms`} mono />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">Capacity</h2>
          </div>
          <ResourceMeter
            resources={[
              { label: 'Used', value: pct, detail: `${m.usedGB} / ${m.totalGB} GB` },
            ]}
            layout="rows"
          />
        </section>

        <section className="flex flex-col gap-2">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">
              Bindings
              <span className="text-fg-muted text-xs font-normal ml-2">
                · {m.bindings.includes('*') ? 'All departments' : `${m.bindings.length} department${m.bindings.length !== 1 ? 's' : ''}`}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            {m.bindings.includes('*') ? (
              <Badge tone="info">Shared across all departments</Badge>
            ) : (
              m.bindings.map((b) => <Badge key={b} tone="neutral">{b}</Badge>)
            )}
          </div>
        </section>
      </ResponsiveStack>
    </Page>
  );
}
