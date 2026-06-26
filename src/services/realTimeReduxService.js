import { toast } from 'sonner'
import { getSocketService } from './socketService'
import { createDebugger } from '@/utils/debug'
import { trackRealTimeEvent } from '@/utils/performance'


// Redux Real-time Service - integrates Socket.io events with Redux store
export class RealTimeReduxService {
  constructor(store) {
    this.store = store
    this.socketService = getSocketService()
    this.subscriptions = []
    this.isInitialized = false
    this.debug = createDebugger('frontend:realtime:redux')
  }

  // Initialize real-time Redux integration
  async initialize() {
    if (this.isInitialized) {
      this.debug.warn('init', 'Real-time Redux service already initialized')
      return
    }

    const state = this.store.getState()
    const { token, socketNamespace } = state.auth

    if (!token) {
      this.debug.warn('init', 'No auth token available, cannot initialize real-time service')
      return
    }

    if (!socketNamespace) {
      this.debug.warn('init', 'No socket namespace available, cannot initialize real-time service')
      return
    }

    try {
      this.debug.info('init', 'Connecting to Socket.io server...')
      // Connect to Socket.io server
      await this.socketService.connect(token, socketNamespace)

      // Subscribe to all real-time events
      this.subscribeToEvents()

      this.isInitialized = true
      this.debug.success('init', 'Real-time Redux service initialized successfully')
    } catch (error) {
      this.debug.error('init', 'Failed to initialize real-time Redux service:', error)
      // Rethrow so RealTimeProvider's catch can set status to 'error'. Swallowing
      // here made a failed connection (connect_error) look 'connected' in the UI.
      this.isInitialized = false
      throw error
    }
  }

  // Subscribe to all relevant real-time events
  subscribeToEvents() {
    this.debug.info('subscribe', 'Subscribing to real-time events...')
    this.debug.info('subscribe', 'Using socket namespace:', this.socketService.userNamespace)

    // Subscribe to VM events
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('vms', (action, data) => {
        this.handleVmEvent(action, data)
      })
    )

    // Subscribe to User events
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('users', (action, data) => {
        this.handleUserEvent(action, data)
      })
    )

    // Subscribe to Department events
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('departments', (action, data) => {
        this.handleDepartmentEvent(action, data)
      })
    )

    // Subscribe to Application events
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('applications', (action, data) => {
        this.handleApplicationEvent(action, data)
      })
    )

    // Subscribe to Firewall rule changes.
    // NOTE: the previous 'generic:*' actions were dead — the backend never emits them
    // (generic-filter assignment was removed; templates now create individual rules,
    // which fire the rule:* events handled below). Only the rule:* path is wired.
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('firewall', (action, data) => {
        this.handleFirewallEvent(action, data)
      }, [
        'rule:created',
        'rule:updated',
        'rule:deleted',
        'rule:created:department',
        'rule:updated:department',
        'rule:deleted:department'
      ])
    )

    // Subscribe to AutoCheck events (health monitoring / remediation lifecycle).
    // The backend emits these under the 'autocheck' resource (namespaced as
    // `${namespace}:autocheck:<action>`), so we must subscribe via the resource/action
    // pattern rather than the bare event names healthSocket.js used.
    // These are the ONLY autocheck actions the backend emits today
    // (VmEventManager.handleAutoCheckEvent). It does not emit 'started'/'completed'.
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('autocheck', (action, data) => {
        this.handleAutoCheckEvent(action, data)
      }, [
        'issue-detected',
        'remediation-available',
        'remediation-completed'
      ])
    )

    // Subscribe to health status changes (resource 'health_status').
    // backend does not yet emit this — ready for when it does. Its only emitter
    // (handleHealthStatusChange) is never invoked, and it sends action 'change'
    // with { vmId, vmName, healthStatus, checkResults } (no numeric score).
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('health_status', (action, data) => {
        this.handleHealthStatusEvent(action, data)
      }, [
        'change'
      ])
    )

    // Subscribe to user-initiated remediation lifecycle (resource 'remediation').
    // The backend dispatches these via the global event manager; VmEventManager
    // strips the 'remediation_' prefix and replaces '_' with '-' to derive the wire
    // action, so the actions we see are 'started' | 'succeeded' | 'failed' |
    // 'requires-reboot' | 'cancelled'. The payload's data is the result object
    // ({ description, reason, ... }).
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('remediation', (action, data) => {
        this.handleRemediationEvent(action, data)
      }, [
        'started',
        'succeeded',
        'failed',
        'requires-reboot',
        'cancelled'
      ])
    )

    this.debug.success('subscribe', `Subscribed to ${this.subscriptions.length} real-time event groups`)
  }

  // Handle VM real-time events
  handleVmEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('vm-event', `Received VM ${action} event:`, eventData)

    if (eventData.status === 'error') {
      this.debug.error('vm-event', `VM ${action} error:`, eventData.error)
      return
    }

    const vmData = eventData.data
    if (!vmData) {
      this.debug.warn('vm-event', `No data in VM ${action} event`)
      return
    }

    // Check if VM slice is empty and trigger data loading if needed
    const currentState = this.store.getState()
    const vmsSlice = currentState.vms
    if (!vmsSlice.items || vmsSlice.items.length === 0) {
      this.debug.info('vm-event', 'VM slice is empty, event might be arriving before initial data load')
      // Consider triggering initial data load or queuing events
    }

    // Dispatch appropriate Redux action based on the event
    switch (action) {
      case 'create':
        this.store.dispatch({
          type: 'vms/realTimeVmCreated',
          payload: vmData
        })
        break

      case 'update':
        this.store.dispatch({
          type: 'vms/realTimeVmUpdated',
          payload: vmData
        })
        break

      case 'delete':
        this.store.dispatch({
          type: 'vms/realTimeVmDeleted',
          payload: vmData
        })
        break

      case 'power_on':
      case 'power_off':
      case 'suspend':
        {
          this.debug.info('vm-event', `Updating VM status for ${action}`)
          this.store.dispatch({
            type: 'vms/realTimeVmStatusChanged',
            payload: { ...vmData, action }
          })
        }
        break

      default:
        this.debug.warn('vm-event', `Unknown VM action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`vm:${action}`, endTime - startTime)
  }

  // Handle User real-time events
  handleUserEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('user-event', `Received User ${action} event:`, eventData)

    if (eventData.status === 'error') {
      this.debug.error('user-event', `User ${action} error:`, eventData.error)
      return
    }

    const userData = eventData.data
    if (!userData) {
      this.debug.warn('user-event', `No data in User ${action} event`)
      return
    }

    // Check if users slice is empty and handle accordingly
    const currentState = this.store.getState()
    const usersSlice = currentState.users
    if (!usersSlice.items || usersSlice.items.length === 0) {
      this.debug.info('user-event', 'Users slice is empty, event might be arriving before initial data load')
    }

    // Dispatch appropriate Redux action based on the event
    switch (action) {
      case 'create':
        this.store.dispatch({
          type: 'users/realTimeUserCreated',
          payload: userData
        })
        break

      case 'update':
        this.store.dispatch({
          type: 'users/realTimeUserUpdated',
          payload: userData
        })

        // Also update the auth slice if this is the current user
        const currentUserId = this.store.getState().auth.user?.id
        if (userData.id === currentUserId) {
          this.debug.info('user-event', 'Updating current user in auth slice via real-time event')
          this.store.dispatch({
            type: 'auth/realTimeCurrentUserUpdated',
            payload: userData
          })
        }
        break

      case 'delete':
        this.store.dispatch({
          type: 'users/realTimeUserDeleted',
          payload: userData
        })
        break

      default:
        this.debug.warn('user-event', `Unknown User action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`user:${action}`, endTime - startTime)
  }

  // Handle Department real-time events
  handleDepartmentEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('dept-event', `Received Department ${action} event:`, eventData)

    if (eventData.status === 'error') {
      this.debug.error('dept-event', `Department ${action} error:`, eventData.error)
      return
    }

    const deptData = eventData.data
    if (!deptData) {
      this.debug.warn('dept-event', `No data in Department ${action} event`)
      return
    }

    // Check if departments slice is empty and handle accordingly
    const currentState = this.store.getState()
    const deptSlice = currentState.departments
    if (!deptSlice.items || deptSlice.items.length === 0) {
      this.debug.info('dept-event', 'Departments slice is empty, event might be arriving before initial data load')
    }

    // Dispatch appropriate Redux action based on the event
    switch (action) {
      case 'create':
        this.store.dispatch({
          type: 'departments/realTimeDepartmentCreated',
          payload: deptData
        })
        break

      case 'update':
        // Get the old department data before updating
        const currentState = this.store.getState()
        const oldDepartment = currentState.departments.items.find(d => d.id === deptData.id)

        // Update the department
        this.store.dispatch({
          type: 'departments/realTimeDepartmentUpdated',
          payload: deptData
        })

        // If the department name changed, update all VMs
        if (oldDepartment && oldDepartment.name !== deptData.name) {
          this.debug.info('dept-event', `Department name changed from "${oldDepartment.name}" to "${deptData.name}", updating VMs`)
          this.store.dispatch({
            type: 'vms/realTimeDepartmentNameUpdated',
            payload: {
              departmentId: deptData.id,
              newName: deptData.name
            }
          })
        }
        break

      case 'delete':
        this.store.dispatch({
          type: 'departments/realTimeDepartmentDeleted',
          payload: deptData
        })
        break

      case 'firewall_policy_changed':
        this.debug.info('dept-event', `Department firewall policy changed for "${deptData.name}"`)
        this.store.dispatch({
          type: 'departments/realTimeDepartmentUpdated',
          payload: deptData
        })
        break

      case 'firewall_default_config_changed':
        this.debug.info('dept-event', `Department firewall default config changed for "${deptData.name}"`)
        this.store.dispatch({
          type: 'departments/realTimeDepartmentUpdated',
          payload: deptData
        })
        break

      default:
        this.debug.warn('dept-event', `Unknown Department action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`department:${action}`, endTime - startTime)
  }

  // Handle Application real-time events
  handleApplicationEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('app-event', `Received Application ${action} event:`, eventData)

    if (eventData.status === 'error') {
      this.debug.error('app-event', `Application ${action} error:`, eventData.error)
      return
    }

    const appData = eventData.data
    if (!appData) {
      this.debug.warn('app-event', `No data in Application ${action} event`)
      return
    }

    // Check if applications slice is empty and handle accordingly
    const currentState = this.store.getState()
    const appSlice = currentState.applications
    if (!appSlice.items || appSlice.items.length === 0) {
      this.debug.info('app-event', 'Applications slice is empty, event might be arriving before initial data load')
    }

    // Dispatch appropriate Redux action based on the event
    switch (action) {
      case 'create':
        this.store.dispatch({
          type: 'applications/realTimeApplicationCreated',
          payload: appData
        })
        break

      case 'update':
        this.store.dispatch({
          type: 'applications/realTimeApplicationUpdated',
          payload: appData
        })
        break

      case 'delete':
        this.store.dispatch({
          type: 'applications/realTimeApplicationDeleted',
          payload: appData
        })
        break

      default:
        this.debug.warn('app-event', `Unknown Application action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`application:${action}`, endTime - startTime)
  }

  // Handle Firewall events (generic filters + rule changes)
  handleFirewallEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('firewall-event', `Received Firewall ${action} event:`, eventData)

    if (eventData.status === 'error') {
      this.debug.error('firewall-event', `Firewall ${action} error:`, eventData.error)
      return
    }

    const firewallData = eventData.data
    if (!firewallData) {
      this.debug.warn('firewall-event', `No data in Firewall ${action} event`)
      return
    }

    // Dispatch Redux action to trigger firewall refresh
    switch (action) {
      case 'rule:created':
      case 'rule:updated':
      case 'rule:deleted':
        this.store.dispatch({
          type: 'firewall/realTimeVMRuleChanged',
          payload: {
            vmId: firewallData.vmId,
            ruleId: firewallData.ruleId,
            ruleName: firewallData.ruleName,
            action: action
          }
        })
        break

      case 'rule:created:department':
      case 'rule:updated:department':
      case 'rule:deleted:department':
        this.store.dispatch({
          type: 'firewall/realTimeDepartmentRuleChanged',
          payload: {
            departmentId: firewallData.departmentId,
            ruleId: firewallData.ruleId,
            ruleName: firewallData.ruleName,
            action: action
          }
        })
        break

      default:
        this.debug.warn('firewall-event', `Unknown Firewall action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`firewall:${action}`, endTime - startTime)
  }

  // Handle AutoCheck real-time events (health monitoring + remediation lifecycle)
  handleAutoCheckEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('autocheck-event', `Received AutoCheck ${action} event:`, eventData)

    if (eventData?.status === 'error') {
      this.debug.error('autocheck-event', `AutoCheck ${action} error:`, eventData.error)
      return
    }

    // Backend events are wrapped as { status, data, timestamp }; fall back to the raw
    // payload for resilience to either shape.
    const payload = eventData?.data ?? eventData
    if (!payload) {
      this.debug.warn('autocheck-event', `No data in AutoCheck ${action} event`)
      return
    }

    switch (action) {
      case 'issue-detected': {
        // Backend payload.data is FLAT: { vmId, vmName, issueType, severity, description, details }
        const { vmId, issueType, severity, description, details } = payload
        if (vmId && issueType) {
          const issue = {
            id: `${issueType}-${Date.now()}`,
            checkName: issueType,
            status: 'issue',
            severity,
            message: description
          }
          this.store.dispatch({ type: 'health/addHealthIssue', payload: { vmId, issue } })
        }

        const severityMap = {
          critical: { fn: toast.error, title: 'Critical Issue Detected' },
          warning: { fn: toast.warning, title: 'Warning' },
          info: { fn: toast.info, title: 'Information' }
        }
        const notif = severityMap[severity] || severityMap.info
        notif.fn(`${notif.title}: ${description ?? ''}`, {
          description: vmId ? `VM: ${vmId}` : undefined,
          duration: 5000
        })
        break
      }

      case 'remediation-available': {
        // Backend payload.data is FLAT: { vmId, vmName, checkType, remediationType, description, ... }
        const { description } = payload
        toast.info('New remediation available', {
          description,
          duration: 7000
        })
        break
      }

      case 'remediation-completed': {
        // Backend payload.data is FLAT: { vmId, vmName, checkType, remediationType, success, description, ... }
        const { success, description } = payload
        if (success) {
          toast.success('Remediation completed successfully', {
            description,
            duration: 5000
          })
        } else {
          toast.error('Remediation failed', {
            description: description || 'Please check the logs for details',
            duration: 7000
          })
        }
        break
      }

      default:
        this.debug.warn('autocheck-event', `Unknown AutoCheck action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`autocheck:${action}`, endTime - startTime)
  }

  // Handle health score updates (resource 'health_status')
  handleHealthStatusEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('health-event', `Received HealthStatus ${action} event:`, eventData)

    if (eventData?.status === 'error') {
      this.debug.error('health-event', `HealthStatus ${action} error:`, eventData.error)
      return
    }

    const payload = eventData?.data ?? eventData
    if (!payload) {
      this.debug.warn('health-event', `No data in HealthStatus ${action} event`)
      return
    }

    switch (action) {
      // backend does not yet emit this — ready for when it does. handleHealthStatusChange
      // would send action 'change' with { vmId, vmName, healthStatus, checkResults }.
      case 'change': {
        const { vmId, healthStatus } = payload
        if (vmId && healthStatus) {
          const severityMap = {
            critical: { fn: toast.error, title: 'Health critical' },
            warning: { fn: toast.warning, title: 'Health warning' },
            healthy: { fn: toast.success, title: 'Health recovered' }
          }
          const notif = severityMap[healthStatus]
          if (notif) {
            notif.fn(notif.title, { description: `VM ${vmId}`, duration: 4000 })
          }
        }
        break
      }

      default:
        this.debug.warn('health-event', `Unknown HealthStatus action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`health_status:${action}`, endTime - startTime)
  }

  // Handle user-initiated remediation lifecycle events (resource 'remediation')
  handleRemediationEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('remediation-event', `Received Remediation ${action} event:`, eventData)

    if (eventData?.status === 'error') {
      this.debug.error('remediation-event', `Remediation ${action} error:`, eventData.error)
      return
    }

    // Backend events are wrapped as { status, data, timestamp }; data is the flat
    // VmEventManager.handleRemediationEvent payload { vmId, vmName, actionType, result, ... }
    // where the human-readable fields ({ description, reason, ... }) live on data.result.
    // Fall back to data itself (then the raw payload) for resilience to either shape.
    const data = eventData?.data ?? eventData
    if (!data) {
      this.debug.warn('remediation-event', `No data in Remediation ${action} event`)
      return
    }

    const result = data.result ?? data
    const description = result.description ?? 'Remediation'

    switch (action) {
      case 'started':
        toast.info('Remediation started', {
          description,
          duration: 5000
        })
        break

      case 'succeeded':
        toast.success(`${description} completed`, {
          duration: 5000
        })
        break

      case 'requires-reboot':
        toast.warning(`${description} — reboot required`, {
          duration: 7000
        })
        break

      case 'failed':
        toast.error(`${description}${result.reason ? `: ${result.reason}` : ''}`, {
          duration: 7000
        })
        break

      case 'cancelled':
        toast.info('Remediation cancelled', {
          duration: 5000
        })
        break

      default:
        this.debug.warn('remediation-event', `Unknown Remediation action: ${action}`)
    }

    const endTime = performance.now()
    trackRealTimeEvent(`remediation:${action}`, endTime - startTime)
  }

  // Cleanup subscriptions
  cleanup() {
    this.debug.info('cleanup', 'Cleaning up real-time Redux service')

    // Unsubscribe from all events
    this.subscriptions.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    })
    this.subscriptions = []

    // Disconnect socket
    this.socketService.disconnect()

    this.isInitialized = false
  }

  // Reinitialize (useful for auth changes)
  async reinitialize() {
    this.cleanup()
    await this.initialize()
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      socketInfo: this.socketService.getConnectionInfo(),
      subscriptionCount: this.subscriptions.length
    }
  }
}

// Singleton instance
let realTimeReduxService = null

export const createRealTimeReduxService = (store) => {
  if (!realTimeReduxService) {
    realTimeReduxService = new RealTimeReduxService(store)
  }
  return realTimeReduxService
}

export const getRealTimeReduxService = () => {
  if (!realTimeReduxService) {
    throw new Error('Real-time Redux service not initialized. Call createRealTimeReduxService first.')
  }
  return realTimeReduxService
}

export default RealTimeReduxService
