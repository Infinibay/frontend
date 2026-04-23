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
import {
  POLICIES,
  WEB_CATEGORIES,
  CUSTOM_RULES,
  testDomain,
} from '@/lib/mockData/policies';

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
              <div className="flex flex-col divide-y divide-white/5">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-2 px-2">
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {c.allow ? (
                          <Badge tone="success" size="sm">Allow</Badge>
                        ) : (
                          <Badge tone="danger" size="sm">Block</Badge>
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
                <div className="flex flex-col divide-y divide-white/5">
                  {customRules.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-2 px-2">
                      <span className="font-mono text-sm flex-1">{r.domain}</span>
                      {r.allow ? (
                        <Badge tone="success" size="sm">Allow</Badge>
                      ) : (
                        <Badge tone="danger" size="sm">Block</Badge>
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
