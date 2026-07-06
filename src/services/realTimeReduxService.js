import { toast } from 'sonner'
import { getSocketService } from './socketService'
import { createDebugger } from '@/utils/debug'
import { trackRealTimeEvent } from '@/utils/performance'
import { fetchVMHealthSnapshot } from '@/state/slices/health'
import client from '@/apollo-client'
// Pool state is not in Redux — it lives in Apollo (see handlePoolEvent). Import
// the SAME document the pools pages query so a realtime pool event can refresh
// the shared cache. pools-gql.js is a pure gql module (no React/'use client'),
// so importing it from this service pulls in no page/UI code.
import { POOLS_QUERY } from '@/app/pools/_components/pools-gql'

// Derive the ProblemTransformationService category bucket from a realtime
// autocheck check/issue name. This mirrors the heuristic in the health slice's
// deriveCategory (state/slices/health.js): the snapshot path categorises checks
// there, and the realtime issue-detected path must produce the SAME bucket or a
// critical live issue gets defaulted to 'system' → INFORMATIONAL and never flips
// the VM health badge. Keep in sync with health.js if new check types are added.
const deriveIssueCategory = (checkName) => {
  if (!checkName) return 'system'
  const key = String(checkName).toLowerCase()
  if (key.includes('firewall')) return 'firewall'
  if (key.includes('defender') || key.includes('security') || key.includes('antivirus') || key.includes('event_log')) return 'security'
  if (key.includes('disk') || key.includes('storage')) return 'storage'
  if (key.includes('update')) return 'updates'
  if (key.includes('cpu') || key.includes('memory') || key.includes('performance') || key.includes('resource') || key.includes('temperature') || key.includes('boot')) return 'performance'
  if (key.includes('service') || key.includes('application') || key.includes('startup') || key.includes('app')) return 'applications'
  return 'system'
}

// Map the realtime (lowercase) severity to the autoChecks status the snapshot
// path uses (mapChecksToAutoChecks: FAILED→failed, WARNING→warning, INFO→info),
// so realtime issues drive the health badge/priority the same way snapshots do.
const severityToStatus = (severity) => {
  switch (String(severity || '').toLowerCase()) {
    case 'critical':
      return 'failed'
    case 'warning':
      return 'warning'
    default:
      return 'info'
  }
}

// Redux Real-time Service - integrates Socket.io events with Redux store
export class RealTimeReduxService {
  constructor(store) {
    this.store = store
    this.socketService = getSocketService()
    this.subscriptions = []
    this.isInitialized = false
    this.debug = createDebugger('frontend:realtime:redux')
    // Debounce handle for the pools cache refresh (a scale op emits a burst of
    // events; we only need one network refetch to converge). See handlePoolEvent.
    this.poolsRefetchTimer = null
    // Last network sample per vmId ({ t, bytes }) so handleMetricsEvent can turn
    // cumulative interface byte counters into a Mbps rate across successive
    // metrics events. Cleared on teardown.
    this.lastNetSample = new Map()
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

    // Subscribe to Pool events. The backend emits 'pools' on pool
    // create/update/scale/delete; without this the pools list/detail pages rely
    // purely on their 15-20s poll. Pools are NOT in Redux, so this is a cache
    // refresh + DOM broadcast rather than a slice dispatch — see handlePoolEvent.
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('pools', (action, data) => {
        this.handlePoolEvent(action, data)
      }, [
        'create',
        'update',
        'scale',
        'delete'
      ])
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

    // Subscribe to live resource metrics (resource 'metrics', action 'update').
    // The backend emits these ~every 30s per running VM to owner+admins+dept
    // (VmEventManager.handleMetricsUpdate → sendToUser(_, 'metrics','update',…)).
    // We map the flat guest SystemMetrics payload into the nested shape the VM
    // Overview "Live resources" card reads (health.vmHealthData[vmId].metrics).
    this.subscriptions.push(
      this.socketService.subscribeToAllResourceEvents('metrics', (action, data) => {
        this.handleMetricsEvent(action, data)
      }, [
        'update'
      ])
    )

    this.debug.success('subscribe', `Subscribed to ${this.subscriptions.length} real-time event groups`)
  }

  // Handle live resource metrics events (resource 'metrics', action 'update').
  // Payload: eventData.data = { vmId, metrics } where `metrics` is the flat
  // backend SystemMetrics shape (cpuUsagePercent, usedMemoryKB/totalMemoryKB,
  // diskUsageStats[], networkStats[]). Map to the nested UI shape and dispatch.
  handleMetricsEvent(_action, eventData) {
    const startTime = performance.now()

    if (eventData?.status === 'error') {
      this.debug.error('metrics-event', 'Metrics error:', eventData.error)
      return
    }

    const payload = eventData?.data ?? eventData
    const vmId = payload?.vmId
    const raw = payload?.metrics
    if (!vmId || !raw) {
      this.debug.warn('metrics-event', 'Metrics event missing vmId/metrics')
      return
    }

    // CPU — already a percentage.
    const cpuUsage = Number.isFinite(Number(raw.cpuUsagePercent))
      ? Math.max(0, Math.min(100, Number(raw.cpuUsagePercent)))
      : null

    // Memory — derive % from used/total KB.
    const totalMem = Number(raw.totalMemoryKB)
    const usedMem = Number(raw.usedMemoryKB)
    const memoryUsage = totalMem > 0 && Number.isFinite(usedMem)
      ? Math.max(0, Math.min(100, (usedMem / totalMem) * 100))
      : null

    // Disk — aggregate used/total across real filesystems (GB).
    const disks = Array.isArray(raw.diskUsageStats) ? raw.diskUsageStats : []
    let totalGb = 0
    let usedGb = 0
    for (const d of disks) {
      const t = Number(d?.total_gb)
      const u = Number(d?.used_gb)
      if (t > 0 && Number.isFinite(u)) {
        totalGb += t
        usedGb += u
      }
    }
    const storageUsage = totalGb > 0 ? Math.max(0, Math.min(100, (usedGb / totalGb) * 100)) : null

    // Network — the interface counters are cumulative bytes, so compute Mbps from
    // the delta since the previous sample for this VM. First sample → 0.
    const ifaces = Array.isArray(raw.networkStats) ? raw.networkStats : []
    let totalBytes = 0
    for (const nic of ifaces) {
      const name = typeof nic?.name === 'string' ? nic.name : ''
      if (nic?.is_up === false) continue
      if (name === 'lo' || name.startsWith('lo')) continue // skip loopback
      totalBytes += (Number(nic?.bytes_received) || 0) + (Number(nic?.bytes_sent) || 0)
    }
    const now = Date.now()
    const prevSample = this.lastNetSample.get(vmId)
    let bandwidth = 0
    if (prevSample && totalBytes >= prevSample.bytes && now > prevSample.t) {
      const seconds = (now - prevSample.t) / 1000
      if (seconds > 0) {
        bandwidth = ((totalBytes - prevSample.bytes) * 8) / (seconds * 1e6) // Mbps
      }
    }
    this.lastNetSample.set(vmId, { t: now, bytes: totalBytes })

    const metrics = {
      cpu: { usage: cpuUsage },
      memory: { usage: memoryUsage },
      storage: { usage: storageUsage },
      network: { bandwidth },
      updatedAt: now,
    }

    this.store.dispatch({ type: 'health/setVMMetrics', payload: { vmId, metrics } })

    trackRealTimeEvent('metrics:update', performance.now() - startTime)
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

  // Handle Pool real-time events (create / update / scale / delete).
  //
  // PARTIAL BY DESIGN: pool state does NOT live in Redux (there is no pools
  // slice), and the pools list/detail pages hold it in local React state fed by
  // imperative `client.query(POOLS_QUERY, { fetchPolicy: 'network-only' })`
  // calls — they neither watch the Apollo cache nor read Redux, so this service
  // cannot push directly into their render. Two things we CAN do from here:
  //   1. Refetch POOLS_QUERY through the shared Apollo client (the SAME
  //      mechanism the pages use) so the cache is authoritative for any
  //      cache-first consumer and primed ahead of the pages' next read.
  //   2. Broadcast a DOM CustomEvent so a pools page can opt into instant
  //      refresh with a one-line listener:
  //        window.addEventListener('infinibay:pools:changed', () => fetchPools())
  //      Until such a listener exists, the pages still converge via their
  //      existing 15-20s poll, which is intentionally LEFT IN PLACE as the
  //      fallback — nothing here removes it.
  handlePoolEvent(action, eventData) {
    const startTime = performance.now()
    this.debug.log('pool-event', `Received Pool ${action} event:`, eventData)

    if (eventData?.status === 'error') {
      this.debug.error('pool-event', `Pool ${action} error:`, eventData.error)
      return
    }

    // Backend wraps payloads as { status, data, timestamp }; fall back to the
    // raw payload for resilience to either shape.
    const poolData = eventData?.data ?? eventData

    // Broadcast immediately so any listening page can refresh without waiting
    // for its poll. Guarded for SSR / no-DOM safety.
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent('infinibay:pools:changed', {
          detail: { action, pool: poolData ?? null }
        })
      )
    }

    // Keep the Apollo cache fresh. Debounced: a scale operation fires a burst of
    // events and we only need one network refetch to converge.
    if (this.poolsRefetchTimer) clearTimeout(this.poolsRefetchTimer)
    this.poolsRefetchTimer = setTimeout(() => {
      this.poolsRefetchTimer = null
      client
        .query({ query: POOLS_QUERY, fetchPolicy: 'network-only' })
        .catch((err) => {
          // A failed refresh is non-fatal: the pages' own poll retries anyway.
          this.debug.warn('pool-event', 'Pools cache refetch failed:', err)
        })
    }, 400)

    const endTime = performance.now()
    trackRealTimeEvent(`pool:${action}`, endTime - startTime)
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
        const { vmId, issueType, severity, description } = payload
        if (vmId && issueType) {
          // useVMProblems gates the VM Overview problems panel on BOTH
          // state.health.vmHealthData[vmId] AND autoChecks[vmId] being present.
          // Nothing currently writes vmHealthData (the fetchVMHealthData thunk is
          // dead — it queries a non-existent `vm` field and is dispatched nowhere),
          // so without this seed the panel stays permanently empty even as issues
          // stream in. Seed a minimal record, but ONLY when absent so a future real
          // health snapshot is never clobbered.
          const existingHealth = this.store.getState().health?.vmHealthData?.[vmId]
          if (!existingHealth) {
            this.store.dispatch({
              type: 'health/setVMHealthData',
              payload: { vmId, data: { id: vmId, name: payload.vmName ?? null } }
            })
          }

          const issue = {
            // STABLE id keyed by (vm, issue type), NOT `${issueType}-${Date.now()}`.
            // The backend re-emits issue-detected for the same ongoing problem every
            // health cycle; a timestamped id inserted a NEW autoChecks entry each
            // cycle, so badge counts climbed unbounded and every `key={p.id}` row
            // remounted on each tick (visible flicker). A stable id makes a
            // re-detection overwrite in place. Detection time lives in `timestamp`.
            id: `${vmId}:${issueType}`,
            timestamp: Date.now(),
            checkName: issueType,
            // category + status must match the snapshot path (mapChecksToAutoChecks)
            // or useVMProblems defaults category → 'system' and the priority service
            // maps 'system' to INFORMATIONAL, so a critical live issue would never
            // flip the VM health badge.
            category: deriveIssueCategory(issueType),
            status: severityToStatus(severity),
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
          // Stable toast id so repeated detections of the SAME issue collapse onto
          // one toast (sonner replaces by id) instead of stacking a fresh toast
          // every health cycle.
          id: vmId && issueType ? `issue:${vmId}:${issueType}` : undefined,
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
        const { vmId, success, description } = payload
        if (success) {
          toast.success('Remediation completed successfully', {
            description,
            duration: 5000
          })
          // Reconcile the problems panel: the resolved issue must leave
          // autoChecks[vmId]. The health slice has no per-issue removal reducer, so
          // refetch the authoritative snapshot to prune it (merges into existing
          // autoChecks; PASSED checks are dropped by mapChecksToAutoChecks).
          if (vmId) {
            this.store.dispatch(fetchVMHealthSnapshot({ vmId }))
          }
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
        // Reconcile the problems panel so the resolved issue leaves autoChecks[vmId]
        // instead of lingering. vmId lives on the flat data payload.
        if (data.vmId) {
          this.store.dispatch(fetchVMHealthSnapshot({ vmId: data.vmId }))
        }
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

    // Cancel any pending debounced pools cache refetch so it can't fire after
    // teardown (or against a torn-down/re-authed client).
    if (this.poolsRefetchTimer) {
      clearTimeout(this.poolsRefetchTimer)
      this.poolsRefetchTimer = null
    }

    // Drop cached network samples so a fresh session recomputes rates from scratch.
    this.lastNetSample.clear()

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
