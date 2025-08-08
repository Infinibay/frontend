/**
 * Debug Panel Test Script
 * Run this in the browser console to test the debug panel functionality
 */

export const testDebugPanel = () => {
  console.log('🧪 Testing Infinibay Debug Panel...')

  // Import the debug system
  import('./debug').then(({ createDebugger }) => {
    // Create test debuggers for different namespaces
    const realtimeDebug = createDebugger('frontend:realtime:socket')
    const realtimeReduxDebug = createDebugger('frontend:realtime:redux')
    const stateVmsDebug = createDebugger('frontend:state:vms')
    const stateAuthDebug = createDebugger('frontend:state:auth')
    const graphqlDebug = createDebugger('frontend:graphql:queries')
    const componentDebug = createDebugger('frontend:components:userpc')
    const authDebug = createDebugger('frontend:auth:login')

    console.log('✅ Debug system loaded')
    console.log('🎯 Enable debug panel with: localStorage.setItem("DEBUG", "ui")')
    console.log('📋 All logs will appear in the panel regardless of namespace filtering!')

    // Test different log levels and namespaces
    setTimeout(() => {
      realtimeDebug.info('connection', 'Testing Socket.io connection...')
      realtimeDebug.success('connection', 'Connected to Socket.io server')

      realtimeReduxDebug.log('event', 'Processing real-time event:', { type: 'vm_update', data: { id: 'vm-123' } })
      realtimeReduxDebug.warn('validation', 'Invalid event data received')

      stateVmsDebug.log('update', 'Updating VM state:', { id: 'vm-123', status: 'running' })
      stateVmsDebug.success('create', 'VM created successfully')

      stateAuthDebug.info('token', 'Refreshing authentication token')
      authDebug.success('login', 'User logged in successfully')

      graphqlDebug.log('query', 'Executing GraphQL query:', 'ListVmsDocument')
      graphqlDebug.error('mutation', 'GraphQL mutation failed:', new Error('Network timeout'))

      componentDebug.info('render', 'UserPC component rendered with props:', { vmId: 'vm-123', visible: true })
      componentDebug.success('event', 'User interaction completed successfully')

      console.log('🎯 Test logs generated!')
      console.log('📋 Check the namespace sidebar to navigate through different log categories')
    }, 1000)

    // Generate some continuous logs for testing namespace hierarchy
    let counter = 0
    const interval = setInterval(() => {
      counter++

      // Alternate between different namespaces
      const debuggers = [realtimeDebug, stateVmsDebug, graphqlDebug, componentDebug]
      const randomDebugger = debuggers[counter % debuggers.length]

      randomDebugger.log('heartbeat', `Heartbeat #${counter}`, {
        timestamp: new Date().toISOString(),
        namespace: randomDebugger.namespace
      })

      if (counter >= 15) {
        clearInterval(interval)
        console.log('🏁 Test completed! Check the debug panel namespace sidebar.')
        console.log('💡 Try clicking different namespaces to filter logs!')
      }
    }, 1500)
  })
}

// Auto-run test if this file is imported directly
if (typeof window !== 'undefined') {
  // Add test function to global scope for easy access
  window.testDebugPanel = testDebugPanel

  console.log('🔧 Debug panel test loaded!')
  console.log('Run testDebugPanel() in console to generate test logs')
}
