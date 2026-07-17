// Derived state + formatting for the Sessions ("Live desktop connections") view.
//
// Two real signals feed this page and neither is a "user session": the AGENT
// LINK (virtio transport health from socketConnectionStats) and the CONSOLE
// SESSION (a live SPICE/VNC relay from consoleSessions). Everything here derives
// display state from those — no mock data.

// keepAlive.successRate arrives as a STRING like "95.5%" or "N/A". Parse it to a
// 0..100 number, or null when unknown.
export function parseSuccessRate(raw) {
  if (raw == null) return null;
  const match = String(raw).match(/([\d.]+)\s*%/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

// Link-quality thresholds. A desktop's agent link is "degraded" when it is
// connected but the transport is slow, lossy, or actively failing keep-alives.
export const RTT_WARN_MS = 60;
export const SUCCESS_WARN_PCT = 95;

// Reduce an agent connection to one of three qualities for the StatusDot + filter.
export function linkQuality(conn) {
  if (!conn || !conn.isConnected) return 'offline';
  const ka = conn.keepAlive;
  const rtt = ka?.averageRtt;
  const success = parseSuccessRate(ka?.successRate);
  const failing = (ka?.consecutiveFailures ?? 0) > 0;
  const slow = typeof rtt === 'number' && rtt > RTT_WARN_MS;
  const lossy = success != null && success < SUCCESS_WARN_PCT;
  return failing || slow || lossy ? 'degraded' : 'online';
}

// StatusDot status + human label per quality (StatusDot statuses are lowercase).
export const QUALITY_META = {
  online: { status: 'online', label: 'Healthy' },
  degraded: { status: 'degraded', label: 'Degraded' },
  offline: { status: 'offline', label: 'Offline' }
};

export function fmtRtt(rtt) {
  return rtt == null ? '—' : `${Math.round(rtt)} ms`;
}

export function fmtSuccess(raw) {
  const n = parseSuccessRate(raw);
  return n == null ? '—' : `${n}%`;
}

// Compact "time since" for the last-message column. Updates whenever the page
// refetches (on agent-connection socket events), matching the fleet's cadence.
export function timeAgo(iso) {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// Minutes until a console relay hard-expires (null when unknown/past).
export function minutesUntil(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.round(ms / 60000));
}

// Join agent connections + console relays + VM metadata into one row per desktop.
// A row exists if EITHER a connection or a console session references the vmId, so
// a console relay on a VM whose agent is silent still shows up.
export function buildSessionRows({ connections, consoleSessions, machines }) {
  const byId = new Map((machines || []).map((vm) => [vm.id, vm]));
  const consoleByVm = new Map((consoleSessions || []).map((c) => [c.vmId, c]));

  const vmIds = new Set();
  (connections || []).forEach((c) => vmIds.add(c.vmId));
  (consoleSessions || []).forEach((c) => vmIds.add(c.vmId));

  const connByVm = new Map((connections || []).map((c) => [c.vmId, c]));

  return Array.from(vmIds).map((vmId) => {
    const conn = connByVm.get(vmId) || null;
    const cSession = consoleByVm.get(vmId) || null;
    const vm = byId.get(vmId) || null;
    const ka = conn?.keepAlive || null;
    return {
      id: vmId,
      vmId,
      vm,
      desktopName: vm?.name || vmId,
      departmentName: vm?.department?.name || null,
      department: vm?.department?.name || '—',
      vmStatus: vm?.status || '—',
      isConnected: !!conn?.isConnected,
      quality: linkQuality(conn),
      averageRtt: ka?.averageRtt ?? null,
      successRate: ka?.successRate ?? null,
      consecutiveFailures: ka?.consecutiveFailures ?? 0,
      reconnectAttempts: conn?.reconnectAttempts ?? 0,
      lastMessageTime: conn?.lastMessageTime || null,
      sentCount: ka?.sentCount ?? null,
      receivedCount: ka?.receivedCount ?? null,
      console: cSession
    };
  });
}

// Match a row against the free-text search box (name / vmId / department).
export function rowMatches(row, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    row.desktopName.toLowerCase().includes(q) ||
    row.vmId.toLowerCase().includes(q) ||
    (row.department || '').toLowerCase().includes(q)
  );
}

// Apply the segmented view filter.
export function rowInView(row, filter) {
  switch (filter) {
    case 'online':
      return row.quality === 'online';
    case 'degraded':
      return row.quality === 'degraded';
    case 'offline':
      return row.quality === 'offline';
    case 'inuse':
      return !!row.console?.connected;
    default:
      return true;
  }
}
