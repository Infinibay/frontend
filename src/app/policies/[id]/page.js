'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Button,
  EmptyState,
  ResponsiveStack,
} from '@infinibay/harbor';
import {
  ArrowLeft,
  ShieldCheck,
  Globe,
  Network,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';

// The per-policy editor is not yet backed by real models/enforcement. This
// route deliberately ships an honest "backend required" stub instead of the old
// preview-only fake rules/domain tester. The known policy list is a placeholder
// so a shared/bookmarked link resolves to a titled stub rather than a 404.
const POLICIES = [
  { id: 'pol-office', name: 'Office baseline', kind: 'web' },
  { id: 'pol-restricted', name: 'Restricted browsing', kind: 'web' },
  { id: 'pol-dev', name: 'Developer access', kind: 'network' },
  { id: 'pol-callcenter', name: 'Call center', kind: 'web' },
  { id: 'pol-vpn-only', name: 'VPN only', kind: 'network' },
];

export default function PolicyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const policy = POLICIES.find((p) => p.id === params.id);

  if (!policy) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PreviewBanner />
          <EmptyState
            icon={<ShieldCheck size={18} />}
            title="Policy not found"
            actions={
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/policies')}
              >
                Back to policies
              </Button>
            }
          />
        </ResponsiveStack>
      </Page>
    );
  }

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title={policy.name}
          description="The fine-grained policy editor is not wired to the backend yet."
          count={policy.kind === 'web' ? 'Web filter draft' : 'Network policy draft'}
          primary={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/policies')}
            >
              Back
            </Button>
          }
        />

        <Alert
          tone="warning"
          icon={<ShieldCheck size={14} />}
          title="Policy backend required"
        >
          This route intentionally avoids the old preview-only rules and domain test. Production policy editing needs backend models, enforcement, audit logging, and assignment workflows first.
        </Alert>

        <section className="rounded-md border border-border-subtle bg-surface-raised p-4">
          <ResponsiveStack direction="col" gap={3}>
            <ResponsiveStack direction="row" gap={2} align="center">
              {policy.kind === 'web' ? (
                <Globe size={16} className="text-fg-muted" />
              ) : (
                <Network size={16} className="text-fg-muted" />
              )}
              <span className="text-sm font-medium">Required before this can be enabled</span>
            </ResponsiveStack>
            <div className="grid gap-2 text-sm text-fg-muted">
              <span>Backend policy schema and CRUD mutations</span>
              <span>Department and desktop assignment model</span>
              <span>Runtime enforcement path through network/firewall services</span>
              <span>Audit trail for policy changes</span>
            </div>
          </ResponsiveStack>
        </section>
      </ResponsiveStack>
    </Page>
  );
}
