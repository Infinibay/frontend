'use client';

import { Server } from 'lucide-react';
import { ComingSoonPage } from '@/components/placeholders/ComingSoonPage';

export default function InfrastructurePage() {
  return (
    <ComingSoonPage
      icon={<Server size={24} />}
      title="Infrastructure"
      description="Physical hosts and networks powering the instance. Arrives in Phase 2."
    />
  );
}
