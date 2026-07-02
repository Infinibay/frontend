import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  StatusDot,
  Tooltip } from
'@infinibay/harbor';
import {
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
  Move3d } from
'lucide-react';

import { DRAIN_POOL, UNDRAIN_POOL } from './pools-gql';
import { healthDot, healthLabel, typeLabel } from './pool-helpers';

// ---------------------------------------------------------------------------
// Single source of truth for a pool row's actions. Both the kebab Menu (below)
// and the right-click RowContextMenu (pools-list.jsx) render from this list, so
// the two surfaces can never drift. `onScale`, `onDelete` and `runMutation` are
// the same page-level handlers passed into the columns factory.
// ---------------------------------------------------------------------------

export function poolRowActions({ row, onScale, onDelete, runMutation }) {
  return [
  { key: 'scale', label: 'Scale…', icon: <Move3d size={14} />, onSelect: () => onScale(row) },
  row.draining ?
  {
    key: 'resume',
    label: 'Resume',
    icon: <Play size={14} />,
    onSelect: () => runMutation(UNDRAIN_POOL, { id: row.id }, 'Pool resumed')
  } :
  {
    key: 'drain',
    label: 'Drain',
    icon: <Pause size={14} />,
    onSelect: () => runMutation(DRAIN_POOL, { id: row.id }, 'Pool draining')
  },
  { key: 'delete-sep', separator: true },
  { key: 'delete', label: 'Delete', icon: <Trash2 size={14} />, danger: true, onSelect: () => onDelete(row) }];

}

// ---------------------------------------------------------------------------
// DataTable column definitions for the pools list. Extracted as a pure factory
// so the page can keep memoising it (same useMemo, same deps) with no behaviour
// change. `runMutation`, `onScale` and `onDelete` are supplied by the page.
// ---------------------------------------------------------------------------

export function createPoolColumns({
  deptNameById,
  templateNameById,
  runningByPool,
  runMutation,
  onScale,
  onDelete
}) {
  return [
  {
    id: 'health',
    header: '',
    width: 28,
    cell: ({ row }) =>
    <Tooltip content={healthLabel(row)}>
          <span className="inline-flex" aria-label={healthLabel(row)}>
            <StatusDot status={healthDot(row)} size={8} label={null} />
          </span>
        </Tooltip>

  },
  {
    id: 'name',
    header: 'Pool',
    cell: ({ row }) => <span className="font-medium">{row.name}</span>
  },
  {
    id: 'department',
    header: 'Department',
    cell: ({ row }) =>
    <span className="text-fg-muted text-sm">
          {deptNameById[row.departmentId] ?? row.departmentId.slice(0, 8)}
        </span>

  },
  {
    id: 'template',
    header: 'Blueprint',
    cell: ({ row }) =>
    <span className="text-fg-muted text-sm">
          {templateNameById[row.templateId] ?? row.templateId.slice(0, 8)}
        </span>

  },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) =>
    <Badge tone={row.type === 'persistent' ? 'info' : 'neutral'}>
          {typeLabel(row.type)}
        </Badge>

  },
  {
    id: 'size',
    header: 'Capacity',
    cell: ({ row }) => {
      const live = runningByPool[row.id];
      return (
        <div className="flex flex-col leading-tight">
            <span className="font-mono text-xs">
              {row.currentSize}
              <span className="text-fg-subtle"> / {row.sizeMin}–{row.sizeMax}</span>
            </span>
            {live && live.running > 0 ?
          <span className="text-fg-subtle text-[11px]">{live.running} running</span> :
          null}
          </div>);

    }
  },
  {
    id: 'state',
    header: 'State',
    cell: ({ row }) =>
    row.draining ?
    <Badge tone="warning">draining</Badge> :

    <span className="text-fg-muted text-xs">live</span>

  },
  {
    id: 'actions',
    header: '',
    width: 40,
    cell: ({ row }) =>
    // Stop the click from bubbling to the DataTable row (onRowClick), which
    // would navigate away before the menu could open. Harbor's Menu trigger
    // does not stop propagation on its own.
    <div onClick={(e) => e.stopPropagation()}>
          <Menu
        trigger={
        <IconButton size="sm" variant="ghost" label="Actions" icon={<MoreHorizontal size={14} />} />
        }>
            {poolRowActions({ row, onScale, onDelete, runMutation }).
        filter((a) => !a.separator).
        map((a) =>
        <MenuItem key={a.key} icon={a.icon} danger={a.danger} onClick={() => a.onSelect()}>
                {a.label}
              </MenuItem>
        )}
          </Menu>
        </div>


  }];

}
