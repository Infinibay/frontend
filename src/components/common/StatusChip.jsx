'use client';

/**
 * Inline status chip — the operator-console equivalent of a Badge for
 * run-state. Meant for dense tables and detail headers.
 *
 * Usage:
 *   <StatusChip status="online" />                  // Running
 *   <StatusChip status="offline" label="Stopped" /> // override label
 *
 * Tone is deliberately low-saturation (10-15% alpha backgrounds) so chips
 * don't compete with the data row.
 */

const STATUS_THEME = {
  online:       { label: 'Running',      bg: 'bg-success/12', fg: 'text-success', dot: 'bg-success' },
  degraded:     { label: 'Paused',       bg: 'bg-warning/12', fg: 'text-warning', dot: 'bg-warning' },
  provisioning: { label: 'Starting',     bg: 'bg-info/12',    fg: 'text-info',    dot: 'bg-info' },
  maintenance:  { label: 'Stopping',     bg: 'bg-info/12',    fg: 'text-info',    dot: 'bg-info' },
  offline:      { label: 'Stopped',      bg: 'bg-white/5',    fg: 'text-fg-muted', dot: 'bg-white/30' },
  error:        { label: 'Error',        bg: 'bg-danger/12',  fg: 'text-danger',  dot: 'bg-danger' },
  unknown:      { label: 'Unknown',      bg: 'bg-white/5',    fg: 'text-fg-muted', dot: 'bg-white/30' },
};

export function StatusChip({ status, label, pulse }) {
  const s = STATUS_THEME[status] || STATUS_THEME.unknown;
  const shouldPulse = pulse ?? (status === 'online' || status === 'provisioning');
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
        'text-xs font-medium whitespace-nowrap',
        s.bg,
        s.fg,
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-1.5 w-1.5 rounded-full',
          s.dot,
          shouldPulse ? 'animate-pulse' : '',
        ].join(' ')}
      />
      {label || s.label}
    </span>
  );
}
