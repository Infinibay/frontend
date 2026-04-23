'use client';

import { Page, EmptyState } from '@infinibay/harbor';

/**
 * Placeholder page used during phased redesign.
 * Sections appear in the sidebar from day 1; content lands in Phase 1/2.
 */
export function ComingSoonPage({ title, description, icon }) {
  return (
    <Page>
      <EmptyState icon={icon} title={title} description={description} />
    </Page>
  );
}
