/**
 * Debug Panel - In-page debugging interface for Infinibay
 * Activated when localStorage.DEBUG includes 'ui' or 'UI'
 */

export class DebugPanel {
  constructor() {
    // Prevent multiple instances
    if (typeof window !== 'undefined' && window.__infinibayDebugPanelInstance) {
      return window.__infinibayDebugPanelInstance
    }

    this.logs = []
    this.isVisible = false
    this.currentFilter = ''
    this.selectedNamespaces = new Set()
    this.allNamespaces = new Set()
    this.maxLogs = 1000 // Limit logs to prevent memory issues
    this.sidebarVisible = true

    this.createPanel()
    this.bindEvents()
    this.show()

    // Store instance globally to prevent duplicates
    if (typeof window !== 'undefined') {
      window.__infinibayDebugPanelInstance = this
    }
  }

  createPanel() {
    // Create main container
    this.container = document.createElement('div')
    this.container.id = 'infinibay-debug-panel'
    this.container.innerHTML = `
      <div class="debug-panel-header">
        <div class="debug-panel-title">
          <span class="debug-panel-logo">🔧</span>
          <span>Infinibay Debug Panel</span>
        </div>
        <div class="debug-panel-controls">
          <button class="debug-btn debug-btn-sidebar" title="Toggle sidebar">📋</button>
          <button class="debug-btn debug-btn-clear" title="Clear logs">🗑️</button>
          <button class="debug-btn debug-btn-export" title="Export logs">💾</button>
          <button class="debug-btn debug-btn-minimize" title="Minimize">➖</button>
          <button class="debug-btn debug-btn-close" title="Close">✖️</button>
        </div>
      </div>

      <div class="debug-panel-body">
        <div class="debug-panel-sidebar">
          <div class="debug-sidebar-header">
            <h4>Namespaces</h4>
            <div class="debug-sidebar-controls">
              <button class="debug-btn-small debug-btn-expand-all" title="Expand all">📂</button>
              <button class="debug-btn-small debug-btn-collapse-all" title="Collapse all">📁</button>
            </div>
          </div>
          <div class="debug-namespace-tree"></div>
        </div>

        <div class="debug-panel-main">
          <div class="debug-panel-toolbar">
            <div class="debug-panel-search">
              <input type="text" placeholder="Filter logs..." class="debug-search-input">
            </div>
            <div class="debug-panel-levels">
              <label><input type="checkbox" value="log" checked> Log</label>
              <label><input type="checkbox" value="info" checked> Info</label>
              <label><input type="checkbox" value="warn" checked> Warn</label>
              <label><input type="checkbox" value="error" checked> Error</label>
              <label><input type="checkbox" value="success" checked> Success</label>
            </div>
          </div>

          <div class="debug-panel-content">
            <div class="debug-logs-container">
              <div class="debug-logs-list"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="debug-panel-footer">
        <span class="debug-log-count">0 logs</span>
        <span class="debug-panel-status">Ready</span>
      </div>
    `

    // Add styles
    this.addStyles()

    // Append to body
    document.body.appendChild(this.container)

    // Get references to elements
    this.logsList = this.container.querySelector('.debug-logs-list')
    this.searchInput = this.container.querySelector('.debug-search-input')
    this.namespaceTree = this.container.querySelector('.debug-namespace-tree')
    this.sidebar = this.container.querySelector('.debug-panel-sidebar')
    this.logCount = this.container.querySelector('.debug-log-count')
    this.status = this.container.querySelector('.debug-panel-status')
  }

  addStyles() {
    if (document.getElementById('infinibay-debug-styles')) return

    const styles = document.createElement('style')
    styles.id = 'infinibay-debug-styles'
    styles.textContent = `
      #infinibay-debug-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 800px;
        height: 500px;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 12px;
        color: #fff;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        resize: both;
        overflow: hidden;
        min-width: 600px;
        min-height: 300px;
      }

      .debug-panel-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .debug-panel-sidebar {
        width: 250px;
        background: #222;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        transition: margin-left 0.3s ease;
      }

      .debug-panel-sidebar.hidden {
        margin-left: -250px;
      }

      .debug-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #2a2a2a;
        border-bottom: 1px solid #333;
      }

      .debug-sidebar-header h4 {
        margin: 0;
        font-size: 12px;
        color: #4ECDC4;
        font-weight: bold;
      }

      .debug-sidebar-controls {
        display: flex;
        gap: 4px;
      }

      .debug-btn-small {
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 10px;
      }

      .debug-btn-small:hover {
        background: #444;
        color: #fff;
      }

      .debug-namespace-tree {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .debug-panel-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .debug-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #2d2d2d;
        border-bottom: 1px solid #333;
        cursor: move;
      }

      .debug-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        color: #4ECDC4;
      }

      .debug-panel-controls {
        display: flex;
        gap: 4px;
      }

      .debug-btn {
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      .debug-btn:hover {
        background: #444;
        color: #fff;
      }

      .debug-panel-toolbar {
        display: flex;
        gap: 12px;
        padding: 8px 12px;
        background: #252525;
        border-bottom: 1px solid #333;
        flex-wrap: wrap;
        align-items: center;
      }

      .debug-search-input {
        background: #333;
        border: 1px solid #555;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        width: 200px;
      }

      .debug-namespace-filter {
        background: #333;
        border: 1px solid #555;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        width: 150px;
      }

      .debug-panel-levels {
        display: flex;
        gap: 8px;
      }

      .debug-panel-levels label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        cursor: pointer;
      }

      .debug-panel-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .debug-logs-container {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .debug-log-entry {
        padding: 4px 8px;
        border-bottom: 1px solid #2a2a2a;
        font-family: inherit;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .debug-log-entry:hover {
        background: #2a2a2a;
      }

      .debug-log-timestamp {
        color: #888;
        margin-right: 8px;
      }

      .debug-log-namespace {
        font-weight: bold;
        margin-right: 8px;
      }

      .debug-log-content {
        color: #ccc;
      }

      .debug-panel-footer {
        display: flex;
        justify-content: space-between;
        padding: 4px 12px;
        background: #2d2d2d;
        border-top: 1px solid #333;
        font-size: 11px;
        color: #888;
      }

      .debug-panel-minimized {
        height: 40px !important;
        width: 200px !important;
      }

      .debug-panel-minimized .debug-panel-body,
      .debug-panel-minimized .debug-panel-footer {
        display: none;
      }

      .debug-namespace-item {
        margin: 2px 0;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        user-select: none;
      }

      .debug-namespace-item:hover {
        background: #333;
      }

      .debug-namespace-item.selected {
        background: #4ECDC4;
        color: #000;
      }

      .debug-namespace-item.parent {
        font-weight: bold;
        border-bottom: 1px solid #333;
        margin-bottom: 4px;
      }

      .debug-namespace-item.child {
        margin-left: 16px;
        font-size: 10px;
        opacity: 0.8;
      }

      .debug-namespace-item .namespace-count {
        float: right;
        background: #444;
        color: #ccc;
        padding: 1px 4px;
        border-radius: 8px;
        font-size: 9px;
        margin-left: 8px;
      }

      .debug-namespace-item.selected .namespace-count {
        background: #000;
        color: #4ECDC4;
      }

      .debug-level-info { color: #5DADE2; }
      .debug-level-warn { color: #F39C12; }
      .debug-level-error { color: #E74C3C; }
      .debug-level-success { color: #27AE60; }
      .debug-level-log { color: #BDC3C7; }
    `

    document.head.appendChild(styles)
  }

  bindEvents() {
    // Header drag functionality
    let isDragging = false
    let dragOffset = { x: 0, y: 0 }

    const header = this.container.querySelector('.debug-panel-header')
    header.addEventListener('mousedown', (e) => {
      isDragging = true
      dragOffset.x = e.clientX - this.container.offsetLeft
      dragOffset.y = e.clientY - this.container.offsetTop
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', stopDrag)
    })

    const handleDrag = (e) => {
      if (!isDragging) return
      this.container.style.left = (e.clientX - dragOffset.x) + 'px'
      this.container.style.top = (e.clientY - dragOffset.y) + 'px'
      this.container.style.right = 'auto'
    }

    const stopDrag = () => {
      isDragging = false
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    // Control buttons
    this.container.querySelector('.debug-btn-sidebar').addEventListener('click', () => this.toggleSidebar())
    this.container.querySelector('.debug-btn-clear').addEventListener('click', () => this.clearLogs())
    this.container.querySelector('.debug-btn-export').addEventListener('click', () => this.exportLogs())
    this.container.querySelector('.debug-btn-minimize').addEventListener('click', () => this.toggleMinimize())
    this.container.querySelector('.debug-btn-close').addEventListener('click', () => this.hide())

    // Sidebar controls
    this.container.querySelector('.debug-btn-expand-all').addEventListener('click', () => this.expandAllNamespaces())
    this.container.querySelector('.debug-btn-collapse-all').addEventListener('click', () => this.collapseAllNamespaces())

    // Search and filters
    this.searchInput.addEventListener('input', () => this.filterLogs())

    // Level checkboxes
    this.container.querySelectorAll('.debug-panel-levels input').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.filterLogs())
    })
  }

  addLog(logData) {
    // Add to logs array
    this.logs.push({
      ...logData,
      id: Date.now() + Math.random()
    })

    // Limit logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Track namespace
    this.allNamespaces.add(logData.namespace)

    // Update namespace tree
    this.updateNamespaceTree()

    // Re-render if visible
    if (this.isVisible) {
      this.renderLogs()
    }

    // Update status
    this.updateStatus()
  }

  updateNamespaceTree() {
    // Build namespace hierarchy
    const namespaceHierarchy = this.buildNamespaceHierarchy()

    // Render namespace tree
    this.namespaceTree.innerHTML = ''
    this.renderNamespaceHierarchy(namespaceHierarchy, this.namespaceTree)
  }

  buildNamespaceHierarchy() {
    const hierarchy = {}

    Array.from(this.allNamespaces).forEach(namespace => {
      const parts = namespace.split(':')
      let current = hierarchy

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            fullPath: parts.slice(0, index + 1).join(':'),
            children: {},
            count: 0
          }
        }
        current = current[part].children
      })
    })

    // Count logs for each namespace
    this.logs.forEach(log => {
      const parts = log.namespace.split(':')
      let current = hierarchy

      parts.forEach(part => {
        if (current[part]) {
          current[part].count++
          current = current[part].children
        }
      })
    })

    return hierarchy
  }

  renderNamespaceHierarchy(hierarchy, container, level = 0) {
    Object.values(hierarchy).forEach(node => {
      const item = document.createElement('div')
      item.className = `debug-namespace-item ${level === 0 ? 'parent' : 'child'}`
      item.dataset.namespace = node.fullPath

      const isSelected = this.selectedNamespaces.has(node.fullPath)
      if (isSelected) {
        item.classList.add('selected')
      }

      item.innerHTML = `
        <span class="namespace-name">${node.name}</span>
        <span class="namespace-count">${node.count}</span>
      `

      item.addEventListener('click', (e) => {
        e.stopPropagation()
        this.toggleNamespaceSelection(node.fullPath)
      })

      container.appendChild(item)

      // Render children
      if (Object.keys(node.children).length > 0) {
        this.renderNamespaceHierarchy(node.children, container, level + 1)
      }
    })
  }

  toggleNamespaceSelection(namespace) {
    if (this.selectedNamespaces.has(namespace)) {
      this.selectedNamespaces.delete(namespace)
    } else {
      this.selectedNamespaces.add(namespace)
    }

    this.updateNamespaceTree()
    this.filterLogs()
  }

  renderLogs() {
    const filteredLogs = this.getFilteredLogs()

    this.logsList.innerHTML = filteredLogs.map(log => {
      const argsText = log.args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2)
        }
        return String(arg)
      }).join(' ')

      return `
        <div class="debug-log-entry debug-level-${log.level}">
          <span class="debug-log-timestamp">${log.timestamp}</span>
          <span class="debug-log-namespace" style="color: ${log.color}">${log.namespace}</span>
          <span class="debug-log-content">${argsText}</span>
        </div>
      `
    }).join('')

    // Auto-scroll to bottom
    this.logsList.scrollTop = this.logsList.scrollHeight
  }

  getFilteredLogs() {
    const searchTerm = this.searchInput.value.toLowerCase()
    const enabledLevels = Array.from(this.container.querySelectorAll('.debug-panel-levels input:checked')).map(cb => cb.value)

    return this.logs.filter(log => {
      // Search filter
      if (searchTerm && !log.namespace.toLowerCase().includes(searchTerm) &&
        !log.args.some(arg => String(arg).toLowerCase().includes(searchTerm))) {
        return false
      }

      // Namespace filter - if any namespaces are selected, only show those
      if (this.selectedNamespaces.size > 0) {
        const isSelected = Array.from(this.selectedNamespaces).some(selectedNs =>
          log.namespace === selectedNs || log.namespace.startsWith(selectedNs + ':')
        )
        if (!isSelected) {
          return false
        }
      }

      // Level filter
      if (!enabledLevels.includes(log.level)) {
        return false
      }

      return true
    })
  }

  filterLogs() {
    this.renderLogs()
    this.updateStatus()
  }

  updateStatus() {
    const total = this.logs.length
    const filtered = this.getFilteredLogs().length
    this.logCount.textContent = `${filtered}/${total} logs`
    this.status.textContent = filtered !== total ? `Filtered` : 'Ready'
  }

  clearLogs() {
    this.logs = []
    this.renderLogs()
    this.updateStatus()
  }

  exportLogs() {
    const data = JSON.stringify(this.logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `infinibay-debug-${new Date().toISOString().slice(0, 19)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  toggleMinimize() {
    this.container.classList.toggle('debug-panel-minimized')
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible
    if (this.sidebarVisible) {
      this.sidebar.classList.remove('hidden')
    } else {
      this.sidebar.classList.add('hidden')
    }
  }

  expandAllNamespaces() {
    // Select all top-level namespaces
    this.allNamespaces.forEach(namespace => {
      const topLevel = namespace.split(':')[0]
      this.selectedNamespaces.add(topLevel)
    })
    this.updateNamespaceTree()
    this.filterLogs()
  }

  collapseAllNamespaces() {
    this.selectedNamespaces.clear()
    this.updateNamespaceTree()
    this.filterLogs()
  }

  show() {
    this.isVisible = true
    this.container.style.display = 'flex'
    this.renderLogs()
  }

  hide() {
    this.isVisible = false
    this.container.style.display = 'none'
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    const styles = document.getElementById('infinibay-debug-styles')
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles)
    }

    // Clear global instance reference
    if (typeof window !== 'undefined') {
      window.__infinibayDebugPanelInstance = null
    }
  }
}
