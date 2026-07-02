'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Z,
  ButtonGroup,
  ContentSwap,
  DataTable,
  FluidGrid,
  HostCard,
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
  const isPaused = status === 'paused' || status === 'suspended';
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

  // Paused / suspended: Play resumes, Stop is still valid (mirrors the menu's
  // isPaused logic) — so inline controls match the menu's valid-action set.
  if (isPaused) {
    return (
      <ButtonGroup>
        <IconButton
          size="sm"
          variant="ghost"
          label="Start"
          icon={<Play size={14} />}
          onClick={(e) => {
            stop(e);
            onPlay?.(vm);
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
 * `onAfter` runs before each action. The cursor-positioned right-click menus
 * (table + grid) pass it to close themselves; Harbor's <Menu> closes itself via
 * MenuCtx, so the kebab menu doesn't need it.
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
  <GridWithContextMenu
    hosts={hosts}
    pendingActions={pendingActions}
    onOpen={onOpen}
    onPlay={onPlay}
    onPause={onPause}
    onStop={onStop}
    onDelete={onDelete}
    onCapture={onCapture} /> :


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

/**
 * useCursorMenu — cursor-positioned right-click menu shared by the table and
 * grid surfaces. Unlike Harbor's <ContextMenu> (which has no MenuCtx.Provider,
 * so its MenuItems never close it), this closes itself when an item runs via
 * the `onAfter` hook the menu renderer wires to `close`. It also moves focus
 * into the menu on open and supports ArrowUp/Down roving + Escape — parity with
 * Harbor's <Menu>.
 */
function useCursorMenu() {
  const menuRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (!ctx) return;
    const raf = requestAnimationFrame(() => {
      if (menuRef.current) focusFirst(menuRef.current);
    });
    function down(e) {
      if (!menuRef.current?.contains(e.target)) setCtx(null);
    }
    function key(e) {
      if (e.key === 'Escape') setCtx(null);
    }
    // Fixed-position cursor menu: close on scroll so it can't drift off its row.
    function onScroll() {
      setCtx(null);
    }
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [ctx]);

  function openAt(e, raw) {
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

  function onMenuKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, -1);
    }
  }

  const close = () => setCtx(null);

  return { ctx, menuRef, openAt, close, onMenuKeyDown };
}

function CursorMenu({ menu, pendingActions, onOpen, onPlay, onPause, onStop, onDelete, onCapture }) {
  const { ctx, menuRef, close, onMenuKeyDown } = menu;
  if (!ctx || typeof document === 'undefined') return null;
  return createPortal(
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
        onAfter={close} />

    </div>,
    document.body);

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
  const menu = useCursorMenu();

  function onContextMenu(e) {
    // Harbor's DataTable renders CSS-grid <div role="row"> and stamps each data
    // row with `data-row-id` (its rowId). Resolve by that stable id — never by
    // positional index — so the menu targets the clicked record even after the
    // table is sorted / filtered / paginated internally.
    const rowEl = e.target.closest('[role="row"]');
    if (!rowEl || !wrapRef.current?.contains(rowEl)) return;
    const domRowId = rowEl.getAttribute('data-row-id');
    if (domRowId == null) return;
    const raw = hosts.find((h) => String(h.id) === domRowId)?._raw;
    if (!raw) return;
    menu.openAt(e, raw);
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

      <CursorMenu
        menu={menu}
        pendingActions={pendingActions}
        onOpen={onOpen}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
        onDelete={onDelete}
        onCapture={onCapture} />
    </div>);

}

/**
 * GridWithContextMenu — the aerial card grid. Renders FluidGrid + HostCard
 * directly (rather than Harbor's <ClusterView>) so the page header stays the
 * single filter system: ClusterView ships its own Status/Region/Tag chip bar +
 * density toggle + "No hosts match" empty state, which competed with the page's
 * own Selects and filtered-empty state. Filtering/empty are owned by the page.
 */
function GridWithContextMenu({
  hosts,
  pendingActions,
  onOpen,
  onPlay,
  onPause,
  onStop,
  onDelete,
  onCapture
}) {
  const menu = useCursorMenu();

  return (
    <div>
      <FluidGrid minItemWidth={280} gap={12}>
        {hosts.map((h) => {
          const raw = h._raw;
          return (
            <div key={h.id}>
              <HostCard
                name={h.name}
                subtitle={h.subtitle}
                status={h.status}
                tags={h.tags}
                leadingIcon={h.osIcon}
                actions={
                <InlinePowerButtons
                  vm={raw}
                  pending={pendingActions}
                  onPlay={onPlay}
                  onPause={onPause}
                  onStop={onStop} />
                }
                onClick={raw && onOpen ? () => onOpen(raw) : undefined}
                onContextMenu={raw ? (e) => menu.openAt(e, raw) : undefined} />
            </div>);

        })}
      </FluidGrid>

      <CursorMenu
        menu={menu}
        pendingActions={pendingActions}
        onOpen={onOpen}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
        onDelete={onDelete}
        onCapture={onCapture} />
    </div>);

}
