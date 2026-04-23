'use client';

import { Activity } from 'lucide-react';
import { ComingSoonPage } from '@/components/placeholders/ComingSoonPage';

export default function EventsPage() {
  return (
    <ComingSoonPage
      icon={<Activity size={24} />}
      title="Events"
      description="Filterable log of system events, health alerts, and audit entries. Arrives in Phase 2."
    />
  );
}
