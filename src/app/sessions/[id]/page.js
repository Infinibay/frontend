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
  PlayCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();

  if (!params.id) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
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

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Session control"
          count="not implemented"
          description="VDI user session actions are not wired to the backend yet."
          secondary={
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

        <Alert tone="warning" icon={<PlayCircle size={14} />} title="Session backend required">
          This route intentionally avoids the old preview-only shadow, message, takeover, and force-logoff actions. Production session management needs backend session tracking, user notification, audit events, and safe control APIs first.
        </Alert>
      </ResponsiveStack>
    </Page>
  );
}
