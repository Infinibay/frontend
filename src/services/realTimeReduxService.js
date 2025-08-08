import { getSocketService } from './socketService'
// Normalize backend status values to UI-friendly values
const normalizeVmStatus = (status) => {
  switch (status) {
    case 'off':
      return 'stopped'
    case 'suspended':
      return 'paused'
    default:
      return status
  }
}


// Redux Real-time Service - integrates Socket.io events with Redux store
export class RealTimeReduxService {
  constructor(store) {
    this.store = store
    this.socketService = getSocketService()
    this.subscriptions = []
    this.isInitialized = false
  }

  // Initialize real-time Redux integration
  async initialize() {
    if (this.isInitialized) {
      console.log('🔄 Real-time Redux service already initialized')
      return
    }

    const state = this.store.getState()
    const { token, socketNamespace } = state.auth

    if (!token) {
      console.warn('⚠️ No auth token available, cannot initialize real-time service')
      return
    }

    if (!socketNamespace) {
      console.warn('⚠️ No socket namespace available, cannot initialize real-time service')
      return
    }

    try {
      // Connect to Socket.io server
      await this.socketService.connect(token, socketNamespace)

      // Subscribe to all real-time events
      this.subscribeToEvents()

      this.isInitialized = true
      console.log('🎯 Real-time Redux service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize real-time Redux service:', error)
    }
  }

  // Subscribe to all relevant real-time events
  subscribeToEvents() {
    console.log('👂 Subscribing to real-time events...')
    console.log('🔑 Using socket namespace:', this.socketService.userNamespace)

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

    console.log(`✅ Subscribed to ${this.subscriptions.length} real-time event groups`)
  }

  // Handle VM real-time events
  handleVmEvent(action, eventData) {
    console.log(`🖥️ Received VM ${action} event:`, eventData)

    if (eventData.status === 'error') {
      console.error(`❌ VM ${action} error:`, eventData.error)
      return
    }

    const vmData = eventData.data
    if (!vmData) {
      console.warn(`⚠️ No data in VM ${action} event`)
      return
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
          console.log("Updating bm....")
          const normalized = { ...vmData, status: normalizeVmStatus(vmData.status) }
          this.store.dispatch({
            type: 'vms/realTimeVmStatusChanged',
            payload: { ...normalized, action }
          })
        }
        break

      default:
        console.warn(`🤷 Unknown VM action: ${action}`)
    }
  }

  // Handle User real-time events
  handleUserEvent(action, eventData) {
    console.log(`👤 Received User ${action} event:`, eventData)

    if (eventData.status === 'error') {
      console.error(`❌ User ${action} error:`, eventData.error)
      return
    }

    const userData = eventData.data
    if (!userData) {
      console.warn(`⚠️ No data in User ${action} event`)
      return
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
        break

      case 'delete':
        this.store.dispatch({
          type: 'users/realTimeUserDeleted',
          payload: userData
        })
        break

      default:
        console.warn(`🤷 Unknown User action: ${action}`)
    }
  }

  // Handle Department real-time events
  handleDepartmentEvent(action, eventData) {
    console.log(`🏢 Received Department ${action} event:`, eventData)

    if (eventData.status === 'error') {
      console.error(`❌ Department ${action} error:`, eventData.error)
      return
    }

    const deptData = eventData.data
    if (!deptData) {
      console.warn(`⚠️ No data in Department ${action} event`)
      return
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
        this.store.dispatch({
          type: 'departments/realTimeDepartmentUpdated',
          payload: deptData
        })
        break

      case 'delete':
        this.store.dispatch({
          type: 'departments/realTimeDepartmentDeleted',
          payload: deptData
        })
        break

      default:
        console.warn(`🤷 Unknown Department action: ${action}`)
    }
  }

  // Handle Application real-time events
  handleApplicationEvent(action, eventData) {
    console.log(`📱 Received Application ${action} event:`, eventData)

    if (eventData.status === 'error') {
      console.error(`❌ Application ${action} error:`, eventData.error)
      return
    }

    const appData = eventData.data
    if (!appData) {
      console.warn(`⚠️ No data in Application ${action} event`)
      return
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
        console.warn(`🤷 Unknown Application action: ${action}`)
    }
  }

  // Cleanup subscriptions
  cleanup() {
    console.log('🧹 Cleaning up real-time Redux service')

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
