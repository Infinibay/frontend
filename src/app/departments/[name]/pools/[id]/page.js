'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Page, ResponsiveStack, Spinner } from '@infinibay/harbor';

// The pool detail experience lives at the canonical, department-agnostic
// route `/pools/[id]` (richer: desktops list, per-desktop actions, settings).
// This department-scoped route is kept only as a redirect so existing links
// keep working.
export default function DepartmentPoolRedirect() {
  const router = useRouter();
  const params = useParams();
  const poolId = String(params.id || '');

  useEffect(() => {
    router.replace(poolId ? `/pools/${poolId}` : '/pools');
  }, [router, poolId]);

  return (
    <Page>
      <ResponsiveStack direction="row" gap={3} justify="center" align="center">
        <Spinner /> <span className="text-fg-muted text-sm">Opening pool…</span>
      </ResponsiveStack>
    </Page>
  );
}
