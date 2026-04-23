'use client';

import { useMemo } from 'react';
import {
  ButtonGroup,
  ClusterView,
  ContextMenu,
  DataTable,
  IconButton,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  ResponsiveStack,
  Spinner,
} from '@infinibay/harbor';
import {
  Pause,
  Play,
  Square,
  ExternalLink,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { StatusChip } from '@/components/common/StatusChip';
import { OsBadge } from '@/components/common/OsBadge';

function InlinePowerButtons({ vm, pending, onPlay, onPause, onStop }) {
  const status = (vm?.status || '').toLowerCase();
  const stop = (e) => e.stopPropagation();
  const isPending = !!pending?.[vm?.id];

  if (isPending) {
    return (
      <span onClick={stop}>
        <Spinner />
      </span>
    );
  }

  if (status === 'running') {
    return (
      <ButtonGroup onClick={stop}>
        <IconButton
          size="sm"
          variant="ghost"
          label="Pause"
          icon={<Pause size={14} />}
          onClick={(e) => {
            stop(e);
            onPause?.(vm);
          }}
        />
        <IconButton
          size="sm"
          variant="ghost"
          label="Stop"
          icon={<Square size={14} />}
          onClick={(e) => {
            stop(e);
            onStop?.(vm);
          }}
        />
      </ButtonGroup>
    );
  }

  return (
    <IconButton
      size="sm"
      variant="ghost"
      label="Start"
      icon={<Play size={14} />}
      onClick={(e) => {
        stop(e);
        onPlay?.(vm);
      }}
    />
  );
}

/**
 * DesktopListView — shared component for the cross-dept /desktops list and
 * the Desktops tab inside a Department detail. Renders either as a dense
 * table (operator default) or a ClusterView grid.
 *
 * Props:
 *   hosts              — array of { id, name, status, subtitle, tags, osIcon, _raw }
 *                        (same shape the Cluster view has always consumed)
 *   pendingActions     — { [vmId]: true } dict from Redux
 *   view               — 'table' | 'grid'
 *   showDepartment     — whether to include the Department column (cross-dept lists)
 *   onOpen             — (vm) => void, row click
 *   onPlay/onPause/onStop/onDelete — action callbacks
 */
export function DesktopListView({
  hosts,
  pendingActions,
  view = 'table',
  showDepartment = true,
  onOpen,
  onPlay,
  onPause,
  onStop,
  onDelete,
}) {
  const columns = useMemo(() => {
    const cols = [
      {
        key: 'status',
        label: 'Status',
        width: 110,
        render: (row) => <StatusChip status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (row) => (
          <span className="font-medium truncate">{row.name}</span>
        ),
      },
    ];

    if (showDepartment) {
      cols.push({
        key: 'department',
        label: 'Department',
        width: 160,
        render: (row) => {
          const name = row._raw?.department?.name;
          return name ? (
            <span className="text-sm">{name}</span>
          ) : (
            <span className="text-fg-subtle">—</span>
          );
        },
      });
    }

    cols.push(
      {
        key: 'os',
        label: 'OS',
        width: 140,
        render: (row) => {
          const os = row._raw?.configuration?.os || row._raw?.os;
          return os ? <OsBadge os={os} /> : <span className="text-fg-subtle">—</span>;
        },
      },
      {
        key: 'blueprint',
        label: 'Blueprint',
        width: 160,
        render: (row) => {
          const tpl = row._raw?.template?.name;
          return tpl ? (
            <span className="text-sm">{tpl}</span>
          ) : (
            <span className="text-fg-subtle">—</span>
          );
        },
      },
      {
        key: 'ip',
        label: 'IP',
        width: 140,
        render: (row) => {
          const ip = row._raw?.localIP || row._raw?.publicIP;
          return ip ? (
            <span className="font-mono text-xs">{ip}</span>
          ) : (
            <span className="text-fg-subtle">—</span>
          );
        },
      },
      {
        key: 'actions',
        label: '',
        width: 140,
        align: 'right',
        render: (row) => {
          const raw = row._raw;
          const status = (raw?.status || '').toLowerCase();
          const isRunning = status === 'running';
          const isPaused = status === 'paused' || status === 'suspended';
          const isStopped = !isRunning && !isPaused;
          const isPending = !!pendingActions?.[raw?.id];
          const stop = (e) => e.stopPropagation();
          return (
            <div onClick={stop}>
              <ResponsiveStack direction="row" gap={1} justify="end" align="center">
                <InlinePowerButtons
                  vm={raw}
                  pending={pendingActions}
                  onPlay={onPlay}
                  onPause={onPause}
                  onStop={onStop}
                />
                <Menu
                  side="bottom"
                  align="end"
                  trigger={
                    <button
                      type="button"
                      aria-label="More actions"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-fg-muted hover:text-fg transition-colors"
                      onClick={stop}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  }
                >
                  <MenuLabel>{raw?.name}</MenuLabel>
                  <MenuSeparator />
                  <MenuItem
                    icon={<Play size={14} />}
                    disabled={isPending || isRunning}
                    onClick={() => onPlay?.(raw)}
                  >
                    Start
                  </MenuItem>
                  <MenuItem
                    icon={<Pause size={14} />}
                    disabled={isPending || !isRunning}
                    onClick={() => onPause?.(raw)}
                  >
                    Pause
                  </MenuItem>
                  <MenuItem
                    icon={<Square size={14} />}
                    disabled={isPending || isStopped}
                    onClick={() => onStop?.(raw)}
                  >
                    Stop
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    icon={<ExternalLink size={14} />}
                    onClick={() => onOpen?.(raw)}
                  >
                    Open
                  </MenuItem>
                  {onDelete ? (
                    <>
                      <MenuSeparator />
                      <MenuItem
                        icon={<Trash2 size={14} />}
                        danger
                        onClick={() => onDelete(raw)}
                      >
                        Delete
                      </MenuItem>
                    </>
                  ) : null}
                </Menu>
              </ResponsiveStack>
            </div>
          );
        },
      },
    );

    return cols;
  }, [pendingActions, showDepartment, onPlay, onPause, onStop, onOpen, onDelete]);

  if (view === 'grid') {
    return (
      <ClusterView
        hosts={hosts.map((h) => ({
          ...h,
          actions: (
            <InlinePowerButtons
              vm={h._raw}
              pending={pendingActions}
              onPlay={onPlay}
              onPause={onPause}
              onStop={onStop}
            />
          ),
        }))}
        onHostClick={(host) => {
          const raw = hosts.find((h) => h.id === host.id)?._raw;
          if (raw && onOpen) onOpen(raw);
        }}
        renderHost={(host, card) => {
          const raw = hosts.find((h) => h.id === host.id)?._raw;
          if (!raw) return card;
          const status = (raw.status || '').toLowerCase();
          const isRunning = status === 'running';
          const isPaused = status === 'paused' || status === 'suspended';
          const isStopped = !isRunning && !isPaused;
          const isPending = !!pendingActions?.[raw.id];
          return (
            <ContextMenu
              menu={
                <>
                  <MenuLabel>{raw.name}</MenuLabel>
                  <MenuSeparator />
                  <MenuItem
                    icon={<Play size={14} />}
                    disabled={isPending || isRunning}
                    onClick={() => onPlay?.(raw)}
                  >
                    Start
                  </MenuItem>
                  <MenuItem
                    icon={<Pause size={14} />}
                    disabled={isPending || !isRunning}
                    onClick={() => onPause?.(raw)}
                  >
                    Pause
                  </MenuItem>
                  <MenuItem
                    icon={<Square size={14} />}
                    disabled={isPending || isStopped}
                    onClick={() => onStop?.(raw)}
                  >
                    Stop
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    icon={<ExternalLink size={14} />}
                    onClick={() => onOpen?.(raw)}
                  >
                    Open
                  </MenuItem>
                  {onDelete ? (
                    <>
                      <MenuSeparator />
                      <MenuItem
                        icon={<Trash2 size={14} />}
                        danger
                        onClick={() => onDelete(raw)}
                      >
                        Delete
                      </MenuItem>
                    </>
                  ) : null}
                </>
              }
            >
              {card}
            </ContextMenu>
          );
        }}
      />
    );
  }

  return (
    <DataTable
      rows={hosts}
      columns={columns}
      rowKey={(r) => r.id}
      dense
      onRowClick={(row) => {
        const raw = row._raw;
        if (raw && onOpen) onOpen(raw);
      }}
    />
  );
}
