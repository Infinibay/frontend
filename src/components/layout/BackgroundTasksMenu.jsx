'use client';

/**
 * BackgroundTasksMenu
 *
 * Header dropdown (to the left of the notification bell) that lists long-running
 * server tasks — currently cross-node VM migrations — with live progress + status,
 * fed by the app-wide `backgroundTasks` Redux slice (RealTimeReduxService bridges
 * the Socket.IO lifecycle events into it). The button only appears while there's at
 * least one task to show, and animates while any task is running.
 */

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Layers,
  X,
} from 'lucide-react';
import { IconButton, Progress } from '@infinibay/harbor';
import {
  selectBackgroundTasks,
  selectRunningTaskCount,
  taskDismissed,
  clearFinishedTasks,
} from '@/state/slices/backgroundTasks';

const KIND_ICON = {
  migration: ArrowRightLeft,
  golden_image: Layers,
};

function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

function StatusIcon({ status }) {
  if (status === 'success') {
    return <CheckCircle2 size={16} style={{ color: '#34d399' }} />;
  }
  if (status === 'error') {
    return <AlertCircle size={16} style={{ color: '#fb7185' }} />;
  }
  return <Loader2 size={16} className="animate-spin" style={{ color: '#38bdf8' }} />;
}

function TaskRow({ task, onDismiss }) {
  const KindIcon = KIND_ICON[task.kind] || Activity;
  const isRunning = task.status === 'running';
  const tone = task.status === 'error' ? 'rose' : task.status === 'success' ? 'green' : 'sky';

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        background: 'rgb(var(--harbor-bg-elev-1))',
        border: '1px solid rgb(var(--harbor-border-subtle))',
      }}
    >
      <div style={{ paddingTop: 1 }}>
        <StatusIcon status={task.status} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <KindIcon size={12} style={{ color: 'rgb(var(--harbor-fg-muted))', flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgb(var(--harbor-fg))',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgb(var(--harbor-fg-muted))', flexShrink: 0 }}>
            {timeAgo(task.updatedAt)}
          </span>
        </div>

        <div
          style={{
            fontSize: 12,
            color: task.status === 'error' ? '#fb7185' : 'rgb(var(--harbor-fg-muted))',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={task.status === 'error' ? task.error || task.detail : task.detail}
        >
          {task.status === 'error' ? (task.error || task.detail) : task.detail}
        </div>

        {task.status !== 'error' ? (
          <div style={{ marginTop: 8 }}>
            <Progress
              value={Math.max(0, Math.min(100, task.progress ?? 0))}
              tone={tone}
              shimmer={isRunning}
              showValue={false}
            />
          </div>
        ) : null}
      </div>

      {!isRunning ? (
        <button
          type="button"
          onClick={() => onDismiss(task.id)}
          aria-label="Dismiss"
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgb(var(--harbor-fg-muted))',
            padding: 2,
            lineHeight: 0,
            borderRadius: 6,
          }}
        >
          <X size={14} />
        </button>
      ) : (
        <div style={{ width: 18 }} />
      )}
    </div>
  );
}

export function BackgroundTasksMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const tasks = useSelector(selectBackgroundTasks);
  const running = useSelector(selectRunningTaskCount);

  // Close on outside click (ignore clicks inside the panel).
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape.
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Only occupy header space when there's something to show.
  if (tasks.length === 0) return null;

  const hasFinished = tasks.some((t) => t.status !== 'running');

  const badgeStyle = {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 9999,
    background: 'rgb(var(--harbor-brand))',
    color: 'rgb(var(--harbor-brand-fg))',
    fontSize: 11,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    pointerEvents: 'none',
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={running > 0 ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
        onClick={() => setIsOpen((v) => !v)}
        label={running > 0 ? `${running} background task${running > 1 ? 's' : ''} running` : 'Background tasks'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      />
      {running > 0 ? <span style={badgeStyle}>{running > 99 ? '99+' : running}</span> : null}

      {isOpen ? (
        <div
          role="dialog"
          aria-label="Background tasks"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 380,
            maxWidth: 'calc(100vw - 24px)',
            background: 'rgb(var(--harbor-bg-elev-2))',
            border: '1px solid rgb(var(--harbor-border))',
            borderRadius: 14,
            boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
            zIndex: 60,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderBottom: '1px solid rgb(var(--harbor-border-subtle))',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgb(var(--harbor-fg))' }}>
              Background tasks
            </span>
            {running > 0 ? (
              <span style={{ fontSize: 12, color: 'rgb(var(--harbor-fg-muted))' }}>
                {running} running
              </span>
            ) : null}
            {hasFinished ? (
              <button
                type="button"
                onClick={() => dispatch(clearFinishedTasks())}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'rgb(var(--harbor-fg-muted))',
                  padding: '2px 4px',
                }}
              >
                Clear finished
              </button>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 10,
              maxHeight: 420,
              overflowY: 'auto',
            }}
          >
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onDismiss={(id) => dispatch(taskDismissed(id))} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BackgroundTasksMenu;
