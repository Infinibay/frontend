'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  Dialog,
  EmptyState,
  ResponsiveStack,
} from '@infinibay/harbor';
import {
  ArrowLeft,
  PlayCircle,
  Eye,
  UserX,
  MessageSquare,
  RotateCcw,
  LockKeyhole,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { LIVE_SESSIONS, mockSessionEvents } from '@/lib/mockData/sessions';

function duration(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-32 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>
  );
}

function Indicator({ label, on }) {
  return (
    <Badge tone={on ? 'success' : 'neutral'} size="sm">
      {label}: {on ? 'Yes' : 'No'}
    </Badge>
  );
}

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const session = LIVE_SESSIONS.find((s) => s.id === params.id);
  const [shadowOpen, setShadowOpen] = useState(false);

  const [, force] = useState(0);
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 3000);
    return () => clearInterval(i);
  }, []);

  if (!session) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PreviewBanner />
          <EmptyState
            icon={<PlayCircle size={18} />}
            title="Session not found"
            actions={
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/sessions')}
              >
                Back
              </Button>
            }
          />
        </ResponsiveStack>
      </Page>
    );
  }

  const events = mockSessionEvents(session);

  const noop = (what) => () => toast.info(`${what} — preview only.`);

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title={`${session.userName} · ${session.desktopName}`}
          count={`${session.protocol} · ${duration(session.connectedAt)} · ${session.latencyMs} ms`}
          secondary={
            <Button
              size="sm"
              variant="ghost"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/sessions')}
            >
              Back
            </Button>
          }
        />

        <ResponsiveStack direction="row" gap={2} wrap>
          <Button
            size="sm"
            variant="secondary"
            icon={<MessageSquare size={14} />}
            onClick={noop('Send message')}
          >
            Send message
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<Eye size={14} />}
            onClick={() => setShadowOpen(true)}
          >
            Shadow
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<LockKeyhole size={14} />}
            onClick={noop('Take over')}
          >
            Take over
          </Button>
          <Button
            size="sm"
            variant="destructive"
            icon={<UserX size={14} />}
            onClick={noop('Force logoff')}
          >
            Force logoff
          </Button>
          <Button
            size="sm"
            variant="destructive"
            icon={<RotateCcw size={14} />}
            onClick={noop('Reset desktop')}
          >
            Reset desktop
          </Button>
        </ResponsiveStack>

        <section className="flex flex-col gap-2">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">Session</h2>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <KV label="User" value={session.userName} />
            <KV label="Email" value={session.userEmail} mono />
            <KV label="Desktop" value={session.desktopName} mono />
            <KV label="Host" value={session.host} mono />
            <KV label="Client IP" value={session.clientIp} mono />
            <KV label="Protocol" value={<Badge tone="neutral">{session.protocol}</Badge>} />
            <KV label="Bandwidth" value={`${session.bandwidthKbps} Kbps`} mono />
          </div>
          <ResponsiveStack direction="row" gap={2} wrap>
            <Indicator label="USB redirect" on={session.usbRedirect} />
            <Indicator label="Clipboard" on={session.clipboard} />
            <Indicator label="Printing" on={session.printing} />
          </ResponsiveStack>
        </section>

        <section className="flex flex-col gap-2">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">Timeline</h2>
          </div>
          <div className="flex flex-col gap-2 py-2 font-mono text-xs">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-fg-subtle w-28 shrink-0">
                  {new Date(e.at).toLocaleTimeString()}
                </span>
                <Badge tone="neutral" size="sm">
                  {e.kind}
                </Badge>
                <span>{e.text}</span>
              </div>
            ))}
          </div>
        </section>
      </ResponsiveStack>

      <Dialog
        open={shadowOpen}
        onClose={() => setShadowOpen(false)}
        size="lg"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Eye size={16} />
            <span>Shadow · {session.desktopName}</span>
          </ResponsiveStack>
        }
        description={`Viewing ${session.userName}'s session (read-only). User has been notified.`}
        footer={
          <Button variant="secondary" onClick={() => setShadowOpen(false)}>
            Stop shadowing
          </Button>
        }
      >
        <Alert tone="info" icon={<Eye size={14} />}>
          Preview only — this would stream the desktop's framebuffer read-only,
          with visible notification to the user and an entry in /events.
        </Alert>
        <div className="mt-3 h-56 rounded-md bg-black/40 flex items-center justify-center text-fg-subtle text-xs font-mono border border-white/10">
          [ live framebuffer preview ]
        </div>
      </Dialog>
    </Page>
  );
}
