/**
 * VM State Constants
 *
 * Single source of truth for VM states matching backend DBVMStatus.
 * See: infinivirt/src/types/sync.types.ts
 */

export const VM_STATES = {
  OFF: 'off',
  RUNNING: 'running',
  SUSPENDED: 'suspended',
  PAUSED: 'paused',
  BUILDING: 'building',
  UPDATING_HARDWARE: 'updating_hardware',
  POWERING_OFF_UPDATE: 'powering_off_update',
  ERROR: 'error'
}

// All valid states for validation
export const ALL_VM_STATES = Object.values(VM_STATES)

// States that allow PLAY action (power on / resume)
export const PLAYABLE_STATES = [
  VM_STATES.OFF,
  VM_STATES.SUSPENDED,
  VM_STATES.PAUSED,
  VM_STATES.ERROR
]

// States that allow STOP action (power off)
export const STOPPABLE_STATES = [
  VM_STATES.RUNNING,
  VM_STATES.SUSPENDED,
  VM_STATES.PAUSED,
  VM_STATES.ERROR
]

// States that allow PAUSE action (suspend)
export const PAUSABLE_STATES = [
  VM_STATES.RUNNING
]

// States where VM is busy (no actions allowed)
export const BUSY_STATES = [
  VM_STATES.BUILDING,
  VM_STATES.UPDATING_HARDWARE,
  VM_STATES.POWERING_OFF_UPDATE
]

// Helper functions
export const canPlay = (status) => {
  if (!status) return false
  if (BUSY_STATES.includes(status)) return false
  if (PLAYABLE_STATES.includes(status)) return true
  // Fallback: unknown state allows play for recovery
  return !ALL_VM_STATES.includes(status)
}

export const canStop = (status) => {
  if (!status) return false
  if (BUSY_STATES.includes(status)) return false
  if (STOPPABLE_STATES.includes(status)) return true
  // Fallback: unknown state allows stop for recovery
  return !ALL_VM_STATES.includes(status)
}

export const canPause = (status) => {
  if (!status) return false
  return PAUSABLE_STATES.includes(status)
}

export const isBusy = (status) => {
  return BUSY_STATES.includes(status)
}

export const isUnknownState = (status) => {
  return status && !ALL_VM_STATES.includes(status)
}

// Status indicator colors
export const getStatusColor = (status) => {
  switch (status) {
    case VM_STATES.RUNNING:
      return 'green'
    case VM_STATES.OFF:
      return 'gray'
    case VM_STATES.SUSPENDED:
    case VM_STATES.PAUSED:
      return 'yellow'
    case VM_STATES.BUILDING:
    case VM_STATES.UPDATING_HARDWARE:
      return 'blue'
    case VM_STATES.POWERING_OFF_UPDATE:
      return 'orange'
    case VM_STATES.ERROR:
      return 'red'
    default:
      return 'gray' // Unknown state fallback
  }
}

// Status indicator CSS classes (for Tailwind)
export const getStatusBgClass = (status) => {
  switch (status) {
    case VM_STATES.RUNNING:
      return 'bg-green-400'
    case VM_STATES.OFF:
      return 'bg-gray-400'
    case VM_STATES.SUSPENDED:
    case VM_STATES.PAUSED:
      return 'bg-yellow-400'
    case VM_STATES.BUILDING:
    case VM_STATES.UPDATING_HARDWARE:
      return 'bg-blue-400'
    case VM_STATES.POWERING_OFF_UPDATE:
      return 'bg-orange-400'
    case VM_STATES.ERROR:
      return 'bg-red-400'
    default:
      return 'bg-gray-400' // Unknown state fallback
  }
}
