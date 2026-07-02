'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Button,
  ResponsiveStack,
  Skeleton,
} from '@infinibay/harbor';
import { ArrowLeft, HardDrive } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import useFeatureFlag from '@/hooks/useFeatureFlag';

export default function StorageDetailPage() {
  const router = useRouter();
  const storageEnabled = useFeatureFlag('storage');
  // Feature flags load lazily; wait until initialized before redirecting so a
  // hard refresh / deep-link doesn't bounce enabled users on the fail-safe default.
  const flagsInitialized = useSelector((state) => !!state.featureFlags?.initialized);

  useEffect(() => {
    if (flagsInitialized && !storageEnabled) {
      router.replace('/desktops');
    }
  }, [flagsInitialized, storageEnabled, router]);

  if (!flagsInitialized) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <Skeleton height={130} />
          <Skeleton height={180} />
        </ResponsiveStack>
      </Page>
    );
  }

  if (!storageEnabled) {
    return null;
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
