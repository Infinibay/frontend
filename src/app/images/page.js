'use client';

import { toast } from 'sonner';
import {
  Page,
  Badge,
  Button,
  ResponsiveStack,
} from '@infinibay/harbor';
import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { GOLDEN_IMAGES } from '@/lib/mockData/images';

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.round(ms / 86400000);
  if (d < 1) return 'today';
  if (d < 30) return `${d}d ago`;
  return `${Math.round(d / 30)}mo ago`;
}

const STATUS_TONE = {
  draft: 'warning',
  published: 'success',
  deprecated: 'neutral',
};

export default function GoldenImagesPage() {
  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title="Golden Images"
          count={`${GOLDEN_IMAGES.length} image${GOLDEN_IMAGES.length !== 1 ? 's' : ''}`}
        />

        {GOLDEN_IMAGES.map((img) => (
          <section key={img.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold m-0">{img.name}</h2>
                  <span className="text-fg-muted text-xs">
                    · {img.os} · current {img.currentVersion} · {img.usedByPools} pool{img.usedByPools !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                icon={<Plus size={14} />}
                onClick={() => toast.info('Preview only — not wired yet.')}
              >
                Publish new version
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-white/5">
              {img.versions.slice().reverse().map((v) => (
                <div key={v.id} className="flex items-center gap-3 py-2 px-2">
                  <span className="font-mono text-sm w-12 shrink-0">{v.version}</span>
                  <Badge tone={STATUS_TONE[v.status]} size="sm">
                    {v.status}
                  </Badge>
                  <span className="text-sm text-fg-muted flex-1 truncate">
                    {v.notes}
                  </span>
                  <span className="font-mono text-xs text-fg-subtle">{v.sizeGB} GB</span>
                  <span className="text-xs text-fg-muted w-16 text-right">{timeAgo(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </ResponsiveStack>
    </Page>
  );
}
