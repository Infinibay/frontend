'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
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
      <ButtonGroup onClick={stop}>
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
                  onStop={onStop} />
                
                <Menu
                  side="bottom"
                  align="end"
                  trigger={
                  <button
                    type="button"
                    aria-label="More actions"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-fg-muted hover:text-fg transition-colors"
                    onClick={stop}>
                    
                      <MoreHorizontal size={14} />
                    </button>
                  }>
                  
                  <MenuLabel>{raw?.name}</MenuLabel>
                  <MenuSeparator />
                  <MenuItem
                    icon={<Play size={14} />}
                    disabled={isPending || isRunning}
                    onClick={() => onPlay?.(raw)}>
                    
                    Start
                  </MenuItem>
                  <MenuItem
                    icon={<Pause size={14} />}
                    disabled={isPending || !isRunning}
                    onClick={() => onPause?.(raw)}>
                    
                    Pause
                  </MenuItem>
                  <MenuItem
                    icon={<Square size={14} />}
                    disabled={isPending || isStopped}
                    onClick={() => onStop?.(raw)}>
                    
                    Stop
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    icon={<ExternalLink size={14} />}
                    onClick={() => onOpen?.(raw)}>
                    
                    Open
                  </MenuItem>
                  {onDelete ?
                  <>
                      <MenuSeparator />
                      <MenuItem
                      icon={<Trash2 size={14} />}
                      danger
                      onClick={() => onDelete(raw)}>
                      
                        Delete
                      </MenuItem>
                    </> :
                  null}
                </Menu>
              </ResponsiveStack>
            </div>);

        }
      }
    );

    return cols;
  }, [pendingActions, showDepartment, onPlay, onPause, onStop, onOpen, onDelete]);

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
              onClick={() => onPlay?.(raw)}>
              
                    Start
                  </MenuItem>
                  <MenuItem
              icon={<Pause size={14} />}
              disabled={isPending || !isRunning}
              onClick={() => onPause?.(raw)}>
              
                    Pause
                  </MenuItem>
                  <MenuItem
              icon={<Square size={14} />}
              disabled={isPending || isStopped}
              onClick={() => onStop?.(raw)}>
              
                    Stop
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
              icon={<ExternalLink size={14} />}
              onClick={() => onOpen?.(raw)}>
              
                    Open
                  </MenuItem>
                  {onDelete ?
            <>
                      <MenuSeparator />
                      <MenuItem
                icon={<Trash2 size={14} />}
                danger
                onClick={() => onDelete(raw)}>
                
                        Delete
                      </MenuItem>
                    </> :
            null}
                </>
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
    function down(e) {
      if (!menuRef.current?.contains(e.target)) setCtx(null);
    }
    function key(e) {
      if (e.key === 'Escape') setCtx(null);
    }
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [ctx]);

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

  const status = (ctx?.raw?.status || '').toLowerCase();
  const isRunning = status === 'running';
  const isPaused = status === 'paused' || status === 'suspended';
  const isStopped = !isRunning && !isPaused;
  const isPending = !!(ctx && pendingActions?.[ctx.raw?.id]);

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
          style={{
            position: 'fixed',
            left: ctx.x,
            top: ctx.y,
            zIndex: 9999,
            minWidth: 200
          }}
          className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1">
          
              <MenuLabel>{ctx.raw?.name}</MenuLabel>
              <MenuSeparator />
              <MenuItem
            icon={<Play size={14} />}
            disabled={isPending || isRunning}
            onClick={() => {
              setCtx(null);
              onPlay?.(ctx.raw);
            }}>
            
                Start
              </MenuItem>
              <MenuItem
            icon={<Pause size={14} />}
            disabled={isPending || !isRunning}
            onClick={() => {
              setCtx(null);
              onPause?.(ctx.raw);
            }}>
            
                Pause
              </MenuItem>
              <MenuItem
            icon={<Square size={14} />}
            disabled={isPending || isStopped}
            onClick={() => {
              setCtx(null);
              onStop?.(ctx.raw);
            }}>
            
                Stop
              </MenuItem>
              <MenuSeparator />
              <MenuItem
            icon={<ExternalLink size={14} />}
            onClick={() => {
              setCtx(null);
              onOpen?.(ctx.raw);
            }}>
            
                Open
              </MenuItem>
              {onCapture ?
          <>
                  <MenuSeparator />
                  <MenuItem
              icon={<Camera size={14} />}
              onClick={() => {
                setCtx(null);
                onCapture(ctx.raw);
              }}>
              
                    Capture as Golden Image
                  </MenuItem>
                </> :
          null}
              {onDelete ?
          <>
                  <MenuSeparator />
                  <MenuItem
              icon={<Trash2 size={14} />}
              danger
              onClick={() => {
                setCtx(null);
                onDelete(ctx.raw);
              }}>
              
                    Delete
                  </MenuItem>
                </> :
          null}
            </div>,
        document.body
      ) :
      null}
    </div>);

}