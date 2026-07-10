'use client';

/**
 * Inline status chip — the operator-console equivalent of a Badge for
 * run-state. Meant for dense tables and detail headers.
 *
 * Usage:
 *   <StatusChip status="online" />                  // Running
 *   <StatusChip status="offline" label="Stopped" /> // override label
 *
 * Tone is deliberately low-saturation (~10% alpha backgrounds) so chips
 * don't compete with the data row. Backgrounds use the `/10` opacity step,
 * which Tailwind generates from the default scale — arbitrary steps like `/12`
 * are NOT emitted by the project config, so the tint would silently vanish.
 */

const STATUS_THEME = {
  online:       { label: 'Running',      bg: 'bg-success/10', fg: 'text-success', dot: 'bg-success' },
  degraded:     { label: 'Paused',       bg: 'bg-warning/10', fg: 'text-warning', dot: 'bg-warning' },
  provisioning: { label: 'Starting',     bg: 'bg-info/10',    fg: 'text-info',    dot: 'bg-info' },
  maintenance:  { label: 'Stopping',     bg: 'bg-info/10',    fg: 'text-info',    dot: 'bg-info' },
  offline:      { label: 'Stopped',      bg: 'bg-fg-muted/10', fg: 'text-fg-muted', dot: 'bg-fg-muted' },
  error:        { label: 'Error',        bg: 'bg-danger/10',  fg: 'text-danger',  dot: 'bg-danger' },
  unknown:      { label: 'Unknown',      bg: 'bg-fg-muted/10', fg: 'text-fg-muted', dot: 'bg-fg-muted' },
  // Cross-node migration in flight (Machine.status='moving'). Info "busy" tone; the
  // desktop is locked out of power/console until the move finishes or fails.
  moving:       { label: 'Moving…',      bg: 'bg-info/10',    fg: 'text-info',    dot: 'bg-info' },
  // Frozen while a golden image is being built/captured from this desktop
  // (Machine.goldenImageBuildId set). Amber "busy" tone; the desktop is not usable
  // and every power/console/capture action is disabled until it clears.
  locked:       { label: 'Building image', bg: 'bg-warning/10', fg: 'text-warning', dot: 'bg-warning' },
};

export function StatusChip({ status, label, pulse }) {
  const s = STATUS_THEME[status] || STATUS_THEME.unknown;
  const shouldPulse = pulse ?? (status === 'online' || status === 'provisioning' || status === 'locked' || status === 'moving');
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
