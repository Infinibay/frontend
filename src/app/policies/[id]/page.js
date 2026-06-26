'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  EmptyState,
  ResponsiveStack,
  TextField,
  IconButton,
} from '@infinibay/harbor';
import {
  ArrowLeft,
  Check,
  X as XIcon,
  ShieldCheck,
  Globe,
  Network,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
const POLICIES = [
  { id: 'pol-office', name: 'Office baseline', kind: 'web' },
  { id: 'pol-restricted', name: 'Restricted browsing', kind: 'web' },
  { id: 'pol-dev', name: 'Developer access', kind: 'network' },
  { id: 'pol-callcenter', name: 'Call center', kind: 'web' },
  { id: 'pol-vpn-only', name: 'VPN only', kind: 'network' },
];
const WEB_CATEGORIES = {};
const CUSTOM_RULES = {};
const testDomain = () => ({
  verdict: 'blocked',
  reason: 'Policy testing requires backend enforcement support.',
});

export default function PolicyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const policy = POLICIES.find((p) => p.id === params.id);

  const [testInput, setTestInput] = useState('');
  const [testOut, setTestOut] = useState(null);

  const categories = policy ? WEB_CATEGORIES[policy.id] || [] : [];
  const customRules = policy ? CUSTOM_RULES[policy.id] || [] : [];

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

  const onTest = () => {
    if (!testInput.trim()) {
      setTestOut(null);
      return;
    }
    setTestOut(testDomain(policy.id, testInput));
  };

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title={policy.name}
          description={policy.description}
          count={policy.kind === 'web' ? 'Web filter' : 'Network policy'}
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

        {policy.kind === 'web' ? (
          <>
            <section className="flex flex-col gap-2">
              <div className="pb-2 border-b border-white/5">
                <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                  <Globe size={14} className="text-fg-muted" />
                  Try a domain
                </h2>
              </div>
              <ResponsiveStack direction="row" gap={2} align="center">
                <div className="flex-1">
                  <TextField
                    placeholder="youtube.com, github.com, etc."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onTest(); }}
                  />
                </div>
                <Button size="sm" variant="primary" onClick={onTest}>
                  Check
                </Button>
              </ResponsiveStack>
              {testOut ? (
                <Alert
                  tone={testOut.verdict === 'allowed' ? 'success' : 'danger'}
                  icon={testOut.verdict === 'allowed' ? <Check size={14} /> : <XIcon size={14} />}
                  title={`${testInput} → ${testOut.verdict.toUpperCase()}`}
                >
                  <span className="text-xs">{testOut.reason}</span>
                </Alert>
              ) : null}
            </section>

            <section className="flex flex-col gap-2">
              <div className="pb-2 border-b border-white/5">
                <h2 className="text-base font-semibold m-0">
                  Categories
                  <span className="text-fg-muted text-xs font-normal ml-2">
                    · {categories.length}
                  </span>
                </h2>
              </div>
              <div className="flex flex-col divide-y divide-[color:var(--harbor-border-subtle)]">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-2 px-2">
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {c.allow ? (
                          <Badge tone="success">Allow</Badge>
                        ) : (
                          <Badge tone="danger">Block</Badge>
                        )}
                      </div>
                      <span className="text-fg-muted text-xs">{c.description}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.info('Preview only — not wired yet.')}
                    >
                      {c.allow ? 'Block' : 'Allow'}
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <div className="pb-2 border-b border-white/5">
                <h2 className="text-base font-semibold m-0">
                  Custom rules
                  <span className="text-fg-muted text-xs font-normal ml-2">
                    · {customRules.length}
                  </span>
                </h2>
              </div>
              {customRules.length === 0 ? (
                <span className="text-fg-muted text-sm py-2">
                  No custom rules. Categories apply.
                </span>
              ) : (
                <div className="flex flex-col divide-y divide-[color:var(--harbor-border-subtle)]">
                  {customRules.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-2 px-2">
                      <span className="font-mono text-sm flex-1">{r.domain}</span>
                      {r.allow ? (
                        <Badge tone="success">Allow</Badge>
                      ) : (
                        <Badge tone="danger">Block</Badge>
                      )}
                      <IconButton
                        size="sm"
                        variant="ghost"
                        label="Remove rule"
                        icon={<XIcon size={14} />}
                        onClick={() => toast.info('Preview only — not wired yet.')}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Network size={14} className="text-fg-muted" />
                Network rules
              </h2>
            </div>
            <span className="text-fg-muted text-sm py-2">
              Network policy editor — preview only. Inbound / outbound / presets
              (Web browsing only, VPN only, Open) with nftables-level advanced mode.
            </span>
          </section>
        )}
      </ResponsiveStack>
    </Page>
  );
}
