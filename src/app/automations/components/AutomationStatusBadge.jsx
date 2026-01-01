'use client';

/**
 * AutomationStatusBadge Component
 *
 * Displays the status of an automation with appropriate styling.
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    variant: 'secondary',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600 dark:text-amber-400',
  },
  APPROVED: {
    label: 'Approved',
    variant: 'outline',
    className: 'border-green-500 text-green-600 dark:text-green-400',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'outline',
    className: 'border-red-500 text-red-600 dark:text-red-400',
  },
  ARCHIVED: {
    label: 'Archived',
    variant: 'secondary',
    className: 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  },
};

export function AutomationStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

export default AutomationStatusBadge;
