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

    // Subscribe to Firewall events (generic filters + rule changes)
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('firewall', (action, data) => {
        this.handleFirewallEvent(action, data)
      }, [
        'generic:assigned',
        'generic:unassigned',
        'generic:assigned:department',
        'generic:unassigned:department',
        'rule:created',
        'rule:updated',
        'rule:deleted',
        'rule:created:department',
        'rule:updated:department',
        'rule:deleted:department'
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
      case 'generic:assigned':
      case 'generic:unassigned':
        this.store.dispatch({
          type: 'firewall/realTimeGenericFilterChanged',
          payload: {
            vmId: firewallData.vmId,
            filterId: firewallData.filterId,
            filterName: firewallData.filterName,
            action: action
          }
        })
        break

      case 'generic:assigned:department':
      case 'generic:unassigned:department':
        this.store.dispatch({
          type: 'firewall/realTimeGenericFilterChanged',
          payload: {
            departmentId: firewallData.departmentId,
            filterId: firewallData.filterId,
            filterName: firewallData.filterName,
            action: action
          }
        })
        break

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
