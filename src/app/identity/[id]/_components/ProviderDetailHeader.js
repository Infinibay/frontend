'use client';

import { Button, ResponsiveStack } from '@infinibay/harbor';
import { ArrowLeft, Pencil, RefreshCw, Trash2 } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';

const TYPE_LABEL = {
  ACTIVE_DIRECTORY: 'Active Directory',
  AD: 'Active Directory',
  LDAP: 'LDAP'
};

export function ProviderDetailHeader({
  provider,
  onBack,
  onEdit,
  onTest,
  onSync,
  onDelete,
  testing,
  syncing
}) {
  const syncDisabled = !provider.enabled;
  return (
    <PageHeader
      title={provider.name}
      count={TYPE_LABEL[provider.providerType] || provider.providerType}
      description={`${provider.host}:${provider.port}`}
      secondary={
        <Button
          size="sm"
          variant="secondary"
          icon={<ArrowLeft size={14} />}
          onClick={onBack}
        >
          Back
        </Button>
      }
      primary={
        <ResponsiveStack direction="row" gap={2} align="center">
          <Button
            size="sm"
            variant="secondary"
            icon={<Pencil size={14} />}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<RefreshCw size={14} />}
            onClick={onTest}
            loading={testing}
          >
            Test connection
          </Button>
          <span
            title={syncDisabled ? 'Directory is disabled — enable it in Edit to sync' : undefined}
            className="inline-flex"
          >
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              onClick={onSync}
              loading={syncing}
              disabled={syncDisabled}
              aria-label={
                syncDisabled ? 'Sync now (disabled — enable the directory in Edit)' : 'Sync now'
              }
            >
              Sync now
            </Button>
          </span>
          {onDelete ? (
            <Button
              size="sm"
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={onDelete}
            >
              Delete
            </Button>
          ) : null}
        </ResponsiveStack>
      }
    />
  );
}
