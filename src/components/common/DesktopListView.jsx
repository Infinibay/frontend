'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Z,
  ButtonGroup,
  ClusterView,
  ContentSwap,
  ContextMenu,
  DataTable,
  IconButton,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  ResponsiveStack,
  Spinner } from
'@infinibay/harbor';
import {
  Pause,
  Play,
  Square,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  Camera } from
'lucide-react';
import { focusFirst, focusNextMenuItem } from '@infinibay/harbor/a11y';
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
      </span>);

  }

  if (status === 'running') {
    return (
      <ButtonGroup>
        <IconButton
          size="sm"
          variant="ghost"
          label="Pause"
          icon={<Pause size={14} />}
          onClick={(e) => {
            stop(e);
            onPause?.(vm);
          }} />
        
        <IconButton
          size="sm"
          variant="ghost"
          label="Stop"
          icon={<Square size={14} />}
          onClick={(e) => {
            stop(e);
            onStop?.(vm);
          }} />
        
      </ButtonGroup>);

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
      }} />);


}

/**
 * VmMenuItems — the single source of truth for a desktop's action menu.
 *
 * Shared by all three surfaces (table kebab, table right-click, grid
 * right-click) so the available actions never drift between them — e.g.
 * "Capture as Golden Image" now shows everywhere `onCapture` is provided,
 * instead of only on the table right-click.
 *
 * `onAfter` runs before each action (used by the cursor-positioned table menu
 * to close itself); Harbor's <Menu>/<ContextMenu> close themselves.
 */
function VmMenuItems({
  vm,
  pending,
  onPlay,
  onPause,
  onStop,
  onOpen,
  onCapture,
  onDelete,
  onAfter
}) {
  const status = (vm?.status || '').toLowerCase();
  const isRunning = status === 'running';
  const isPaused = status === 'paused' || status === 'suspended';
  const isStopped = !isRunning && !isPaused;
  const isPending = !!pending?.[vm?.id];
  const run = (fn) => () => {
    onAfter?.();
    fn?.(vm);
  };

  return (
    <>
      <MenuLabel>{vm?.name}</MenuLabel>
      <MenuSeparator />
      <MenuItem icon={<Play size={14} />} disabled={isPending || isRunning} onClick={run(onPlay)}>
        Start
      </MenuItem>
      <MenuItem icon={<Pause size={14} />} disabled={isPending || !isRunning} onClick={run(onPause)}>
        Pause
      </MenuItem>
      <MenuItem icon={<Square size={14} />} disabled={isPending || isStopped} onClick={run(onStop)}>
        Stop
      </MenuItem>
      <MenuSeparator />
      <MenuItem icon={<ExternalLink size={14} />} onClick={run(onOpen)}>
        Open
      </MenuItem>
      {onCapture ?
      <>
          <MenuSeparator />
          <MenuItem icon={<Camera size={14} />} onClick={run(onCapture)}>
            Capture as Golden Image
          </MenuItem>
        </> :
      null}
      {onDelete ?
      <>
          <MenuSeparator />
          <MenuItem icon={<Trash2 size={14} />} danger onClick={run(onDelete)}>
            Delete
          </MenuItem>
        </> :
      null}
    </>);

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
 *   nodeNameById       — optional { [nodeId]: nodeName } map for placement display
 *   onOpen             — (vm) => void, row click
 *   onPlay/onPause/onStop/onDelete — action callbacks
 */
export function DesktopListView({
  hosts,
  pendingActions,
  view = 'table',
  showDepartment = true,
  nodeNameById = {},
  onOpen,
  onPlay,
  onPause,
  onStop,
  onDelete,
  onCapture
}) {
  const columns = useMemo(() => {
    const cols = [
    {
      id: 'status',
      header: 'Status',
      width: 110,
      cell: ({ row }) => <StatusChip status={row.status} />
    },
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      cell: ({ row }) =>
      <span className="font-medium truncate">{row.name}</span>

    }];


    if (showDepartment) {
      cols.push({
        id: 'department',
        header: 'Department',
        width: 160,
        cell: ({ row }) => {
          const name = row._raw?.department?.name;
          return name ?
          <span className="text-sm">{name}</span> :

          <span className="text-fg-subtle">—</span>;

        }
      });
    }

    cols.push(
      {
        id: 'node',
        header: 'Node',
        width: 160,
        cell: ({ row }) => {
          const nodeId = row._raw?.nodeId;
          const nodeName = nodeId ? nodeNameById[nodeId] || nodeId : null;
          return nodeName ?
          <span className="text-sm truncate">{nodeName}</span> :

          <span className="text-fg-subtle">—</span>;

        }
      },
      {
        id: 'os',
        header: 'OS',
        width: 140,
        cell: ({ row }) => {
          const os = row._raw?.configuration?.os || row._raw?.os;
          return os ? <OsBadge os={os} /> : <span className="text-fg-subtle">—</span>;
        }
      },
      {
        id: 'blueprint',
        header: 'Blueprint',
        width: 160,
        cell: ({ row }) => {
          const tpl = row._raw?.template?.name;
          return tpl ?
          <span className="text-sm">{tpl}</span> :

          <span className="text-fg-subtle">—</span>;

        }
      },
      {
        id: 'ip',
        header: 'IP',
        width: 140,
        cell: ({ row }) => {
          const ip = row._raw?.localIP || row._raw?.publicIP;
          return ip ?
          <span className="font-mono text-xs">{ip}</span> :

          <span className="text-fg-subtle">—</span>;

        }
      },
      {
        id: 'actions',
        header: '',
        width: 140,
        align: 'right',
        cell: ({ row }) => {
          const raw = row._raw;
          const stop = (e) => e.stopPropagation();
          return (
            <div onClick={stop}>
              <ResponsiveStack direction="row" gap={1} justify="end" align="center">
                <InlinePowerButtons
                  vm={raw}
                  pending={pendingActions}
                  onPlay={onPlay}
                  onPause={onPause}
                  onStop={onStop} />

                <Menu
                  side="bottom"
                  align="end"
                  trigger={
                  <button
                    type="button"
                    aria-label="More actions"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--harbor-focus-ring)]"
                    onClick={stop}>

                      <MoreHorizontal size={14} />
                    </button>
                  }>

                  <VmMenuItems
                    vm={raw}
                    pending={pendingActions}
                    onPlay={onPlay}
                    onPause={onPause}
                    onStop={onStop}
                    onOpen={onOpen}
                    onCapture={onCapture}
                    onDelete={onDelete} />

                </Menu>
              </ResponsiveStack>
            </div>);

        }
      }
    );

    return cols;
  }, [pendingActions, showDepartment, nodeNameById, onPlay, onPause, onStop, onOpen, onCapture, onDelete]);

  const inner = view === 'grid' ?
  <ClusterView
    hosts={hosts.map((h) => ({
      ...h,
      actions:
      <InlinePowerButtons
        vm={h._raw}
        pending={pendingActions}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop} />


    }))}
    onHostClick={(host) => {
      const raw = hosts.find((h) => h.id === host.id)?._raw;
      if (raw && onOpen) onOpen(raw);
    }}
    renderHost={(host, card) => {
      const raw = hosts.find((h) => h.id === host.id)?._raw;
      if (!raw) return card;
      return (
        <ContextMenu
          menu={
          <VmMenuItems
            vm={raw}
            pending={pendingActions}
            onPlay={onPlay}
            onPause={onPause}
            onStop={onStop}
            onOpen={onOpen}
            onCapture={onCapture}
            onDelete={onDelete} />
          }>

              {card}
            </ContextMenu>);

    }} /> :


  <TableWithContextMenu
    hosts={hosts}
    columns={columns}
    pendingActions={pendingActions}
    onOpen={onOpen}
    onPlay={onPlay}
    onPause={onPause}
    onStop={onStop}
    onDelete={onDelete}
    onCapture={onCapture} />;



  return (
    <ContentSwap id={view} variant="fade" duration={160}>
      {inner}
    </ContentSwap>);

}

function TableWithContextMenu({
  hosts,
  columns,
  pendingActions,
  onOpen,
  onPlay,
  onPause,
  onStop,
  onDelete,
  onCapture
}) {
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (!ctx) return;
    // Move focus into the menu on open so keyboard users can arrow through it
    // and Escape back out — parity with Harbor's <Menu>/<ContextMenu>.
    const raf = requestAnimationFrame(() => {
      if (menuRef.current) focusFirst(menuRef.current);
    });
    function down(e) {
      if (!menuRef.current?.contains(e.target)) setCtx(null);
    }
    function key(e) {
      if (e.key === 'Escape') setCtx(null);
    }
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [ctx]);

  function onMenuKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, -1);
    }
  }

  function onContextMenu(e) {
    const tr = e.target.closest('tbody tr');
    if (!tr || !wrapRef.current?.contains(tr)) return;
    const allRows = Array.from(
      wrapRef.current.querySelectorAll('tbody tr')
    );
    const idx = allRows.indexOf(tr);
    const host = hosts[idx];
    const raw = host?._raw;
    if (!raw) return;
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    const W = 220;
    const H = 280;
    if (x + W > window.innerWidth - 8) x = window.innerWidth - W - 8;
    if (y + H > window.innerHeight - 8) y = window.innerHeight - H - 8;
    setCtx({ x, y, raw });
  }

  return (
    <div ref={wrapRef} onContextMenu={onContextMenu}>
      <DataTable
        rows={hosts}
        columns={columns}
        rowId={(r) => r.id}
        defaultDensity="compact"
        onRowClick={(row) => {
          const raw = row._raw;
          if (raw && onOpen) onOpen(raw);
        }} />
      
      {ctx && typeof document !== 'undefined' ?
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label={`Actions for ${ctx.raw?.name || 'desktop'}`}
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          style={{
            position: 'fixed',
            left: ctx.x,
            top: ctx.y,
            zIndex: Z.CONTEXT_MENU,
            minWidth: 200
          }}
          className="rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]">

              <VmMenuItems
                vm={ctx.raw}
                pending={pendingActions}
                onPlay={onPlay}
                onPause={onPause}
                onStop={onStop}
                onOpen={onOpen}
                onCapture={onCapture}
                onDelete={onDelete}
                onAfter={() => setCtx(null)} />

            </div>,
        document.body
      ) :
      null}
    </div>);

}
