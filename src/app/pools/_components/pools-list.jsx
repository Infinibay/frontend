'use client';

import {
  Alert,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Skeleton } from
'@infinibay/harbor';
import { Layers, Plus, RefreshCcw } from 'lucide-react';

import { RowContextMenu } from '@/components/common/RowContextMenu';

// The list/table section of the pools page: the error / loading / empty /
// filtered-empty / table state machine. Purely presentational — all data and
// callbacks are owned by the page and passed in, so behaviour is unchanged.
export function PoolsList({
  error,
  pools,
  loading,
  filteredPools,
  columns,
  onRetry,
  onNew,
  onClearFilters,
  onRowClick,
  buildRowMenu
}) {
  if (error && pools.length === 0) {
    return (
      <Alert
        tone="danger"
        title="Couldn't load pools"
        actions={
        <Button size="sm" onClick={onRetry} icon={<RefreshCcw size={16} />}>
            Retry
          </Button>
        }>
        {String(error?.message || error)}
      </Alert>);

  }

  if (loading && pools.length === 0) {
    return (
      <ResponsiveStack direction="col" gap={2}>
        <Skeleton height={40} />
        <Skeleton height={48} />
        <Skeleton height={48} />
        <Skeleton height={48} />
      </ResponsiveStack>);

  }

  if (pools.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={18} />}
        title="No pools yet"
        description="A pool keeps desktops sharing a blueprint + golden image warm and ready to hand out."
        actions={
        <Button variant="primary" icon={<Plus size={14} />} onClick={onNew}>
            New Pool
          </Button>
        } />);

  }

  if (filteredPools.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={18} />}
        title="No pools match the filters"
        description={`${pools.length} pool${pools.length !== 1 ? 's' : ''} don't match the current filters.`}
        actions={
        <Button size="sm" variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        } />);

  }

  return (
    <RowContextMenu
      rows={filteredPools}
      labelFor={(r) => r.name}
      buildItems={buildRowMenu}>
      <DataTable
        rows={filteredPools}
        columns={columns}
        rowId={(r) => r.id}
        defaultDensity="compact"
        onRowClick={onRowClick} />
    </RowContextMenu>);

}
