/**
 * Debug Panel Status Utility
 * Use this to check the status of debug panels and clean up duplicates
 */

export const getDebugPanelStatus = () => {
  if (typeof window === 'undefined') {
    return { error: 'Not in browser environment' }
  }

  const status = {
    manager: !!window.__infinibayDebugPanelManager,
    instance: !!window.__infinibayDebugPanelInstance,
    managerPanel: window.__infinibayDebugPanelManager?.getPanel(),
    panelsInDOM: document.querySelectorAll('#infinibay-debug-panel').length,
    debugConfig: localStorage.getItem('DEBUG'),
    isUIMode: false
  }

  // Check if UI mode is enabled
  const debugConfig = localStorage.getItem('DEBUG')
  if (debugConfig) {
    const enabledNamespaces = debugConfig.split(',').map(ns => ns.trim().toLowerCase())
    status.isUIMode = enabledNamespaces.includes('ui')
  }

  return status
}

export const cleanupDebugPanels = () => {
  if (typeof window === 'undefined') return

  console.log('🧹 Cleaning up debug panels...')
  
  // Remove all debug panels from DOM
  const panels = document.querySelectorAll('#infinibay-debug-panel')
  panels.forEach((panel, index) => {
    console.log(`Removing panel ${index + 1}`)
    panel.remove()
  })

  // Clear global references
  if (window.__infinibayDebugPanelManager) {
    window.__infinibayDebugPanelManager.destroyPanel()
  }
  window.__infinibayDebugPanelInstance = null

  // Remove styles
  const styles = document.getElementById('infinibay-debug-styles')
  if (styles) {
    styles.remove()
  }

  console.log('✅ Cleanup complete')
  return getDebugPanelStatus()
}

export const reinitializeDebugPanel = () => {
  if (typeof window === 'undefined') return

  console.log('🔄 Reinitializing debug panel...')
  
  // Clean up first
  cleanupDebugPanels()
  
  // Wait a bit then reinitialize
  setTimeout(() => {
    const debugConfig = localStorage.getItem('DEBUG')
    if (debugConfig && debugConfig.toLowerCase().includes('ui')) {
      import('./debug').then(({ createDebugger }) => {
        const debug = createDebugger('frontend:debug:reinit')
        debug.success('reinit', 'Debug panel reinitialized successfully!')
      })
    }
  }, 100)
}

// Add to global scope for easy access in console
if (typeof window !== 'undefined') {
  window.debugPanelStatus = getDebugPanelStatus
  window.cleanupDebugPanels = cleanupDebugPanels
  window.reinitializeDebugPanel = reinitializeDebugPanel
  
  console.log('🔧 Debug panel utilities loaded:')
  console.log('- debugPanelStatus() - Check panel status')
  console.log('- cleanupDebugPanels() - Remove all panels')
  console.log('- reinitializeDebugPanel() - Clean and recreate panel')
}
