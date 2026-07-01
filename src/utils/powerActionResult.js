/**
 * Interpret the result of a VM power mutation (powerOn / powerOff).
 *
 * These GraphQL mutations return `SuccessType { success, message }`. Apollo only
 * THROWS on a GraphQL/transport error — a resolver that returns
 * `{ success: false, message }` (e.g. QEMU failed to start because SPICE could
 * not bind) is still a *successful* HTTP/GraphQL response. If the caller only
 * relies on try/catch it will falsely report success to the user. This helper
 * inspects the payload and returns the human-readable failure reason, or `null`
 * when the operation genuinely succeeded.
 *
 * @param {'start'|'stop'} action - the UI action that was requested
 * @param {*} data - the `data` object returned by the Apollo mutation
 * @returns {string|null} the failure message to surface, or null on success
 */
export function getPowerActionError (action, data) {
  const field = action === 'start' ? 'powerOn' : action === 'stop' ? 'powerOff' : null
  if (!field) return null
  const result = data?.[field]
  // Only treat an EXPLICIT success:false as a failure. Absent/malformed payloads
  // are left to the network-error path (they would have thrown) so we don't
  // invent failures for a shape we don't recognise.
  if (result && result.success === false) {
    return (typeof result.message === 'string' && result.message.trim() !== '')
      ? result.message
      : `Failed to ${action} the desktop.`
  }
  return null
}
