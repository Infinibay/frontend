'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Button,
  EmptyState,
  ResponsiveStack,
} from '@infinibay/harbor';
import { ArrowLeft, HardDrive } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';

export default function StorageDetailPage() {
  const router = useRouter();
  const params = useParams();

  if (!params.id) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
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

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Storage backend"
          count="not connected"
          description="External storage backends are not wired to the backend yet."
          secondary={
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

        <Alert
          tone="warning"
          icon={<HardDrive size={14} />}
          title="Storage backend required"
        >
          This route intentionally avoids the old preview-only connection test. Production storage needs backend models for mounts, credentials, quotas, health checks, and assignment workflows first.
        </Alert>
      </ResponsiveStack>
    </Page>
  );
}
