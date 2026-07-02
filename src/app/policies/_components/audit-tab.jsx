import { Alert, Button, DataTable, EmptyState } from '@infinibay/harbor';
import { History, RefreshCw } from 'lucide-react';

import { SectionCard } from './section-card';

// Access change log (the "Audit log" tab body). State stays owned by the page
// and arrives as props. Distinguishes the four async states: loading, error,
// empty and populated — a failed fetch must never look like "no changes yet".
export const AuditTab = ({ audit, auditColumns, loading, error, onRetry }) => {
  return (
    <SectionCard icon={<History size={16} className="text-fg-muted" />} title="Access change log">
      {error ? (
        <Alert
          tone="danger"
          title="Couldn't load the audit log"
          actions={
            onRetry ? (
              <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={onRetry}>
                Retry
              </Button>
            ) : null
          }>
          {error}
        </Alert>
      ) : loading && !audit.length ? (
        <span className="text-fg-muted text-sm">Loading audit log…</span>
      ) : audit.length ? (
        <DataTable rows={audit} columns={auditColumns} rowId={(r) => r.id} defaultDensity="compact" />
      ) : (
        <EmptyState
          icon={<History size={18} />}
          title="No changes recorded yet"
          description="Permission and department-role changes will appear here as they happen." />
      )}
    </SectionCard>
  );
};
