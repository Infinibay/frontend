'use client'

/**
 * @deprecated Use ScriptListItem — it provides a denser Harbor-native layout.
 *
 * Kept only for backward compatibility. Re-exports a thin `Card` wrapper
 * around `ScriptListItem` so any lingering callers keep working.
 *
 * @see ScriptListItem
 */

import { ScriptListItem } from './ScriptListItem'

export function ScriptCard(props) {
  return <ScriptListItem {...props} />
}
