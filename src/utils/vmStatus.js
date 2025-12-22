/**
 * VM Status Utilities
 *
 * Maps QEMU/infinivirt VM states to frontend display categories and actions.
 *
 * Status Flow (from infinivirt/StateSync):
 *
 * QMP Status (QEMU)     →  DB Status (infinivirt)  →  Frontend Category
 * ─────────────────────────────────────────────────────────────────────────
 * 'running'             →  'running'               →  'active'
 * 'paused'              →  'suspended'             →  'suspended'
 * 'shutdown'            →  'off'                   →  'off'
 * 'suspended'           →  'suspended'             →  'suspended'
 * 'inmigrate'           →  'building'              →  'transitional'
 * 'postmigrate'         →  'building'              →  'transitional'
 * 'prelaunch'           →  'building'              →  'transitional'
 * 'finish-migrate'      →  'building'              →  'transitional'
 * 'restore-vm'          →  'building'              →  'transitional'
 * 'watchdog'            →  'error'                 →  'error'
 * 'guest-panicked'      →  'error'                 →  'error'
 * 'io-error'            →  'error'                 →  'error'
 * 'colo'                →  'running'               →  'active'
 *
 * Additional DB statuses (set by VMLifecycle):
 * 'starting'            →  'transitional'
 * 'updating_hardware'   →  'transitional'
 * 'powering_off_update' →  'transitional'
 */

/**
 * All valid DB statuses from infinivirt
 * @type {string[]}
 */
export const DB_VM_STATUSES = [
  'building',
  'running',
  'off',
  'suspended',
  'paused',
  'starting',
  'updating_hardware',
  'powering_off_update',
  'error'
]

/**
 * Status categories for visual grouping
 */
export const STATUS_CATEGORY = {
  ACTIVE: 'active',
  OFF: 'off',
  SUSPENDED: 'suspended',
  TRANSITIONAL: 'transitional',
  ERROR: 'error'
}

/**
 * Maps DB status to frontend category
 * @param {string} status - The VM status from the database
 * @returns {string} The status category
 */
export const getStatusCategory = (status) => {
  if (!status) return STATUS_CATEGORY.OFF

  const normalizedStatus = status.toLowerCase()

  // Active states - VM is running and usable
  if (normalizedStatus === 'running') {
    return STATUS_CATEGORY.ACTIVE
  }

  // Off states - VM is completely stopped
  if (['off', 'stopped', 'shutdown'].includes(normalizedStatus)) {
    return STATUS_CATEGORY.OFF
  }

  // Suspended states - VM is paused but can be resumed quickly
  if (['suspended', 'paused'].includes(normalizedStatus)) {
    return STATUS_CATEGORY.SUSPENDED
  }

  // Error states - something went wrong
  if (normalizedStatus === 'error') {
    return STATUS_CATEGORY.ERROR
  }

  // Transitional states - VM is changing state, actions disabled
  if ([
    'starting',
    'building',
    'updating_hardware',
    'powering_off_update',
    'inmigrate',
    'postmigrate',
    'prelaunch'
  ].includes(normalizedStatus)) {
    return STATUS_CATEGORY.TRANSITIONAL
  }

  // Unknown status - treat as off for safety
  console.warn(`Unknown VM status: ${status}, treating as 'off'`)
  return STATUS_CATEGORY.OFF
}

/**
 * Gets the indicator color classes for a status
 * @param {string} status - The VM status from the database
 * @returns {string} Tailwind CSS classes for the status indicator
 */
export const getStatusColor = (status) => {
  const category = getStatusCategory(status)

  switch (category) {
    case STATUS_CATEGORY.ACTIVE:
      return 'bg-green-500'

    case STATUS_CATEGORY.OFF:
      return 'bg-gray-400'

    case STATUS_CATEGORY.SUSPENDED:
      return 'bg-yellow-500'

    case STATUS_CATEGORY.TRANSITIONAL:
      return 'bg-blue-500 animate-pulse'

    case STATUS_CATEGORY.ERROR:
      return 'bg-red-500'

    default:
      return 'bg-gray-400'
  }
}

/**
 * Gets theme-aware status colors for badges/pills (with WCAG 4.5:1 compliance)
 * @param {string} status - The VM status from the database
 * @returns {string} Tailwind CSS classes for status badges
 */
export const getStatusBadgeColors = (status) => {
  const category = getStatusCategory(status)

  switch (category) {
    case STATUS_CATEGORY.ACTIVE:
      return 'bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border-emerald-500/30 ring-1 ring-emerald-600/40'

    case STATUS_CATEGORY.OFF:
      return 'bg-gray-500/30 text-gray-800 dark:text-gray-200 border-gray-500/30 ring-1 ring-gray-600/40'

    case STATUS_CATEGORY.SUSPENDED:
      return 'bg-amber-500/30 text-amber-800 dark:text-amber-200 border-amber-500/30 ring-1 ring-amber-600/40'

    case STATUS_CATEGORY.TRANSITIONAL:
      return 'bg-blue-500/30 text-blue-800 dark:text-blue-200 border-blue-500/30 ring-1 ring-blue-600/40'

    case STATUS_CATEGORY.ERROR:
      return 'bg-red-500/30 text-red-800 dark:text-red-200 border-red-500/30 ring-1 ring-red-600/40'

    default:
      return 'bg-gray-500/30 text-gray-800 dark:text-gray-200 border-gray-500/30 ring-1 ring-gray-600/40'
  }
}

/**
 * Gets a user-friendly label for a status
 * @param {string} status - The VM status from the database
 * @returns {string} Human-readable status label
 */
export const getStatusLabel = (status) => {
  if (!status) return 'Unknown'

  const labels = {
    // Active
    'running': 'Running',

    // Off
    'off': 'Off',
    'stopped': 'Stopped',
    'shutdown': 'Shut Down',

    // Suspended
    'suspended': 'Suspended',
    'paused': 'Paused',

    // Transitional
    'starting': 'Starting...',
    'building': 'Building...',
    'updating_hardware': 'Updating...',
    'powering_off_update': 'Updating...',
    'inmigrate': 'Migrating...',
    'postmigrate': 'Migrating...',
    'prelaunch': 'Preparing...',

    // Error
    'error': 'Error'
  }

  return labels[status.toLowerCase()] || status
}

/**
 * Available actions for each status
 */
export const VM_ACTIONS = {
  START: 'start',
  CONNECT: 'connect',
  PAUSE: 'pause',
  RESUME: 'resume',
  STOP: 'stop',
  RESET: 'reset',
  DELETE: 'delete'
}

/**
 * Gets available actions for a given status
 * @param {string} status - The VM status from the database
 * @returns {string[]} Array of available action names
 */
export const getAvailableActions = (status) => {
  const category = getStatusCategory(status)

  switch (category) {
    case STATUS_CATEGORY.ACTIVE:
      // Running: can connect, pause, stop, reset
      return [VM_ACTIONS.CONNECT, VM_ACTIONS.PAUSE, VM_ACTIONS.STOP, VM_ACTIONS.RESET]

    case STATUS_CATEGORY.OFF:
      // Off: can start or delete
      return [VM_ACTIONS.START, VM_ACTIONS.DELETE]

    case STATUS_CATEGORY.SUSPENDED:
      // Suspended: can resume or stop
      return [VM_ACTIONS.RESUME, VM_ACTIONS.STOP]

    case STATUS_CATEGORY.TRANSITIONAL:
      // Transitional: no actions available (wait for transition to complete)
      return []

    case STATUS_CATEGORY.ERROR:
      // Error: can try to start again or delete
      return [VM_ACTIONS.START, VM_ACTIONS.DELETE]

    default:
      return [VM_ACTIONS.START, VM_ACTIONS.DELETE]
  }
}

/**
 * Checks if a specific action is available for a status
 * @param {string} status - The VM status from the database
 * @param {string} action - The action to check (from VM_ACTIONS)
 * @returns {boolean} True if the action is available
 */
export const isActionAvailable = (status, action) => {
  return getAvailableActions(status).includes(action)
}

/**
 * Checks if the VM is in a transitional state (actions should be disabled)
 * @param {string} status - The VM status from the database
 * @returns {boolean} True if the VM is transitioning
 */
export const isTransitioning = (status) => {
  return getStatusCategory(status) === STATUS_CATEGORY.TRANSITIONAL
}

/**
 * Checks if the VM is running and connectable
 * @param {string} status - The VM status from the database
 * @returns {boolean} True if the VM is running
 */
export const isRunning = (status) => {
  return getStatusCategory(status) === STATUS_CATEGORY.ACTIVE
}

/**
 * Checks if the VM can be started
 * @param {string} status - The VM status from the database
 * @returns {boolean} True if the VM can be started
 */
export const canStart = (status) => {
  const category = getStatusCategory(status)
  return category === STATUS_CATEGORY.OFF || category === STATUS_CATEGORY.ERROR
}

/**
 * Checks if the VM can be stopped
 * @param {string} status - The VM status from the database
 * @returns {boolean} True if the VM can be stopped
 */
export const canStop = (status) => {
  const category = getStatusCategory(status)
  return category === STATUS_CATEGORY.ACTIVE || category === STATUS_CATEGORY.SUSPENDED
}
