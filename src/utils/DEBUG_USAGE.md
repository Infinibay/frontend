# Frontend Debug System Usage

This debug system provides localStorage-based debugging similar to the backend debug implementation, with an optional **in-page debug panel** for enhanced debugging experience.

## Quick Start

### Enable Console Debugging

Open browser DevTools console and set the DEBUG localStorage key:

```javascript
// Enable all frontend debugging
localStorage.setItem('DEBUG', 'frontend:*')

// Enable specific namespaces
localStorage.setItem('DEBUG', 'frontend:realtime:*')
localStorage.setItem('DEBUG', 'frontend:state:vms,frontend:graphql:*')

// Enable everything
localStorage.setItem('DEBUG', '*')

// Disable debugging
localStorage.removeItem('DEBUG')
```

### 🎯 Enable Debug Panel (NEW!)

For a better debugging experience, enable the **in-page debug panel**:

```javascript
// Enable debug panel UI - shows ALL logs regardless of namespace filtering
localStorage.setItem('DEBUG', 'ui')

// Enable debug panel + console logging for specific namespaces
localStorage.setItem('DEBUG', 'ui,frontend:realtime:*,frontend:state:*')

// Keyboard shortcut: Ctrl+Shift+D (toggles debug panel)
```

**🔥 Key Feature**: When UI mode is enabled, **ALL logs are captured and displayed in the panel**, regardless of your DEBUG namespace configuration. Console logging still respects namespace filtering.

The debug panel provides:
- �️ **Namespace navigation sidebar** - Browse and filter by namespace hierarchy
- �📋 **Organized log view** with timestamps and color-coded namespaces
- 🔍 **Search and filter** logs by content
- 📊 **Level filtering** (log, info, warn, error, success)
- 💾 **Export logs** to JSON file
- 🗑️ **Clear logs** functionality
- 📱 **Draggable and resizable** interface
- ⚡ **Real-time log streaming**
- 📋 **Toggle sidebar** for more space

### Using in Code

```javascript
import { createDebugger } from '@/utils/debug'

// Create a debugger instance
const debug = createDebugger('frontend:components:userpc')

// Basic logging
debug.log('render', 'Component rendering with props:', props)

// Different log levels
debug.info('event', 'Button clicked')
debug.warn('validation', 'Invalid input detected')
debug.error('api', 'Failed to fetch data:', error)
debug.success('operation', 'Data saved successfully')
```

## Namespace Structure

```
frontend:realtime:*          // All real-time related logs
frontend:realtime:redux      // Real-time Redux service
frontend:realtime:socket     // Socket service
frontend:realtime:provider   // RealTimeProvider component
frontend:state:*             // All Redux state logs
frontend:state:vms           // VM state slice
frontend:state:security      // Security state slice
frontend:state:filterRules   // Filter rules state slice
frontend:state:system        // System state slice
frontend:state:vmPorts       // VM ports state slice
frontend:graphql:*           // All GraphQL operations
frontend:graphql:adapter     // GraphQL adapter utility
frontend:components:*        // All component logs
frontend:components:userpc   // UserPC component
frontend:hooks:*             // All custom hooks
frontend:hooks:socketConnection // Socket connection hook
frontend:auth:*              // Authentication flow
frontend:routing:*           // Navigation and routing
```

## Examples

### Enable Real-time Debugging
```javascript
localStorage.setItem('DEBUG', 'frontend:realtime:*')
// Shows all Socket.io and Redux real-time logs
```

### Enable State Management Debugging
```javascript
localStorage.setItem('DEBUG', 'frontend:state:*')
// Shows all Redux state changes and GraphQL operations
```

### Enable Component Debugging
```javascript
localStorage.setItem('DEBUG', 'frontend:components:*')
// Shows all component lifecycle and event logs
```

### Multiple Namespaces
```javascript
localStorage.setItem('DEBUG', 'frontend:realtime:socket,frontend:state:vms,frontend:graphql:mutations')
// Shows only socket events, VM state changes, and GraphQL mutations
```

## 🎛️ Debug Panel Features

When you enable the debug panel with `localStorage.setItem('DEBUG', 'ui')`, you get:

### **Panel Controls:**
- **� Toggle Sidebar**: Show/hide namespace navigation sidebar
- **�🗑️ Clear Logs**: Remove all current logs
- **💾 Export Logs**: Download logs as JSON file
- **➖ Minimize**: Collapse panel to title bar only
- **✖️ Close**: Hide panel (logs continue in console)

### **Namespace Navigation:**
- **Left Sidebar**: Hierarchical view of all namespaces with log counts
- **Click to Filter**: Click any namespace to show only those logs
- **📂 Expand All**: Select all top-level namespaces
- **📁 Collapse All**: Clear all namespace selections

### **Filtering & Search:**
- **Search Box**: Filter logs by content or namespace
- **Level Checkboxes**: Toggle log levels (log, info, warn, error, success)
- **Namespace Selection**: Use sidebar to filter by specific namespaces

### **Panel Interaction:**
- **Drag**: Click and drag the header to move the panel
- **Resize**: Drag the bottom-right corner to resize
- **Keyboard Shortcut**: `Ctrl+Shift+D` to toggle panel on/off

### **Log Display:**
- **Color-coded namespaces**: Each namespace gets a unique color
- **Timestamps**: Precise timing for each log entry
- **Auto-scroll**: Automatically scrolls to newest logs
- **Object formatting**: JSON objects are properly formatted

## Features

- **Zero Performance Impact**: Only logs when debugging is enabled
- **Colored Output**: Each namespace gets a consistent color
- **Timestamped**: All logs include timestamps
- **Hierarchical**: Support for wildcard matching (`frontend:*`)
- **Multiple Namespaces**: Comma-separated list support
- **Log Levels**: info, warn, error, success with emojis

## Current Implementation

The debug system is currently implemented in:

**Services:**
- ✅ `src/services/realTimeReduxService.js` - Real-time Redux integration (complete)
- ✅ `src/services/socketService.js` - Socket.io service (complete)

**State Management:**
- ✅ `src/state/slices/vms.js` - VM state management (partial)
- ✅ `src/state/slices/security.js` - Security state management (complete)
- ✅ `src/state/slices/filterRules.js` - Filter rules state management (complete)
- ✅ `src/state/slices/system.js` - System state management (complete)
- ✅ `src/state/slices/vmPorts.js` - VM ports state management (complete)

**Utilities:**
- ✅ `src/utils/auth.js` - Authentication utilities (complete)
- ✅ `src/utils/graphql-adapter.js` - GraphQL adapter (complete)

**Components:**
- ✅ `src/components/RealTimeProvider.jsx` - Real-time provider (complete)
- ✅ `src/hooks/useSocketConnection.js` - Socket connection hook (complete)

**Cleaned Up:**
- ✅ `src/components/ui/wizard.jsx` - Removed validation debugging logs
- ✅ `src/components/CreateMachine/` - Removed component debugging logs
- ✅ `src/app/auth/sign-in/page.jsx` - Removed login debugging logs

**Debug Panel:**
- ✅ `src/utils/debugPanel.js` - In-page debug panel implementation
- ✅ `src/utils/debugInit.js` - Auto-initialization and keyboard shortcuts
- ✅ `src/app/layout.js` - Debug panel integration

## Migration Guide

Replace existing console.log calls:

```javascript
// Before
console.log('🖥️ Received VM event:', data)
console.error('❌ Failed to connect:', error)

// After
const debug = createDebugger('frontend:realtime:redux')
debug.log('vm-event', 'Received VM event:', data)
debug.error('connection', 'Failed to connect:', error)
```
