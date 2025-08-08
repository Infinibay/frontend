# Frontend Debug System Usage

This debug system provides localStorage-based debugging similar to the backend debug implementation.

## Quick Start

### Enable Debugging

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
