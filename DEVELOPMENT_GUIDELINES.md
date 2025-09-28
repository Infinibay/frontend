# Frontend Development Guidelines

This document defines the comprehensive development standards and patterns for the Infinibay frontend application. These guidelines ensure code consistency, maintainability, and proper integration with the established architecture.

## Table of Contents

1. [Architecture & Tech Stack](#architecture--tech-stack)
2. [Init.js Data Loading Strategy](#initjs-data-loading-strategy)
3. [Debug System Usage](#debug-system-usage)
4. [Real-time Updates Architecture](#real-time-updates-architecture)
5. [GraphQL Codegen Workflow](#graphql-codegen-workflow)
6. [Redux State Management](#redux-state-management)
7. [Loading States with Skeleton](#loading-states-with-skeleton)
8. [Component Structure & Conventions](#component-structure--conventions)
9. [Must Do's](#must-dos)
10. [Must Not Do's](#must-not-dos)
11. [Practical Examples](#practical-examples)

## Architecture & Tech Stack

The Infinibay frontend is built with a modern React ecosystem:

### Core Framework
- **Next.js 14** with App Router for modern React applications
- **TypeScript** for type safety and better development experience
- **React 18** with concurrent features

### State Management
- **Redux Toolkit** for predictable state management
- **Redux Persist** for selective data persistence
- **Apollo Client** for GraphQL state management

### Styling & UI
- **TailwindCSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **NextUI** for additional component library
- **Shadcn/ui** components for consistent design system

### Data & Communication
- **GraphQL** with Apollo Client for API communication
- **GraphQL Code Generator** for automatic hook generation
- **Socket.io** for real-time bidirectional communication

### Development Tools
- **Custom Debug System** with UI panel and namespace support
- **Storybook** for component development and testing
- **ESLint** and **Prettier** for code formatting

## Init.js Data Loading Strategy

The `src/init.js` file implements a critical data loading strategy that ensures the application starts with essential data while handling non-critical data gracefully.

### Critical Services

These services **must** load successfully for the application to function:

```javascript
// From init.js
const criticalServices = [
  'appSettings',    // Application configuration
  'currentUser'     // User authentication data
];
```

**When to add to critical services:**
- Data required for application navigation
- Authentication and authorization data
- Core application settings
- Data without which the app cannot function

### Non-Critical Services

These services can fail without preventing app startup:

```javascript
// From init.js
const nonCriticalServices = [
  'departments',
  'vms',
  'applications',
  'vmCategories',
  'users',
  'auditLogs',
  'notifications',
  'diskImages'
];
```

**When to add to non-critical services:**
- Feature-specific data that can be loaded on-demand
- Data that has fallback mechanisms
- Secondary information that enhances but doesn't block functionality

### Error Handling Pattern

```javascript
// Critical service failure - stops app initialization
if (!result.success) {
  debug.error(`Critical service ${serviceName} failed:`, result.error);
  throw new Error(`Failed to initialize critical service: ${serviceName}`);
}

// Non-critical service failure - logs error and continues
if (!result.success) {
  debug.warn(`Non-critical service ${serviceName} failed:`, result.error);
}
```

### Guidelines for Init.js

1. **Keep it minimal** - Only load data that's absolutely necessary for app startup
2. **Prefer on-demand loading** - Load feature-specific data when the feature is accessed
3. **Handle failures gracefully** - Distinguish between critical and non-critical failures
4. **Use debug logging** - Always log initialization progress and errors

## Debug System Usage

The custom debug system replaces all `console.log` usage and provides structured logging with UI integration.

### Basic Usage

```javascript
import { createDebugger } from '@/utils/debug';

// Create debugger with namespace
const debug = createDebugger('frontend:components:MyComponent');

// Use debug methods instead of console
debug.log('Component mounted');
debug.info('Data loaded successfully');
debug.warn('Fallback data used');
debug.error('Failed to load data', error);
debug.success('Operation completed');
```

### Namespace Conventions

Follow these namespace patterns for consistency:

```javascript
// Components
const debug = createDebugger('frontend:components:ComponentName');

// State/Redux
const debug = createDebugger('frontend:state:sliceName');

// Services
const debug = createDebugger('frontend:services:serviceName');

// Real-time
const debug = createDebugger('frontend:realtime:eventType');

// Utilities
const debug = createDebugger('frontend:utils:utilityName');

// Pages
const debug = createDebugger('frontend:pages:pageName');
```

### Debug Panel Features

Enable the debug panel to see all logs in the UI:

```javascript
// Activate debug panel
localStorage.setItem('DEBUG', 'ui');

// Filter specific namespaces
localStorage.setItem('DEBUG', 'frontend:realtime:*');
localStorage.setItem('DEBUG', 'frontend:state:*');
```

**Keyboard shortcut**: `Ctrl+Shift+D` toggles the debug panel

### Debug Levels

```javascript
debug.log('General information');        // Gray
debug.info('Important information');     // Blue
debug.warn('Warning condition');         // Orange
debug.error('Error occurred', error);    // Red
debug.success('Success operation');      // Green
```

### **MANDATORY**: Never use `console.log`

```javascript
// ❌ NEVER DO THIS
console.log('Something happened');

// ✅ ALWAYS DO THIS
const debug = createDebugger('frontend:components:MyComponent');
debug.log('Something happened');
```

## Real-time Updates Architecture

The real-time system integrates Socket.io with Redux for seamless live updates.

### Core Components

1. **SocketService** (`src/services/socketService.js`) - Manages Socket.io connection
2. **RealTimeReduxService** (`src/services/realTimeReduxService.js`) - Integrates Socket events with Redux

### How Real-time Updates Work

The real-time system uses event subscriptions that automatically dispatch Redux actions:

```javascript
// RealTimeReduxService subscribes to Socket.io events
this.socketService.subscribeToAllResourceEvents('vms', (action, data) => {
  this.handleVmEvent(action, data)
})

// Events are automatically dispatched to Redux store
this.store.dispatch({
  type: 'vms/realTimeVmUpdated',
  payload: vmData
})
```

### Setting Up Real-time Updates in Redux Slices

```javascript
// In Redux slice - add real-time reducers
const vmSlice = createSlice({
  name: 'vms',
  initialState,
  reducers: {
    // Regular reducers
    setVms: (state, action) => {
      state.items = action.payload;
    },

    // Real-time reducers (called by RealTimeReduxService)
    realTimeVmCreated: (state, action) => {
      state.items.push(action.payload);
      debug.info('VM created via real-time:', action.payload.id);
    },
    realTimeVmUpdated: (state, action) => {
      const index = state.items.findIndex(vm => vm.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    realTimeVmDeleted: (state, action) => {
      state.items = state.items.filter(vm => vm.id !== action.payload.id);
    }
  }
});
```

### Checking Connection Status

```javascript
import { getRealTimeReduxService } from '@/services/realTimeReduxService';

function MyComponent() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const debug = createDebugger('frontend:components:MyComponent');

  useEffect(() => {
    try {
      const realTimeService = getRealTimeReduxService();
      const status = realTimeService.getStatus();
      setConnectionStatus(status);
      debug.info('Real-time connection status:', status);
    } catch (error) {
      debug.warn('Real-time service not available:', error.message);
    }
  }, []);

  return (
    <div>
      {connectionStatus?.socketInfo?.connected === false && (
        <div>Connecting to real-time updates...</div>
      )}
      {/* Component content */}
    </div>
  );
}
```

### Real-time Event Patterns

```javascript
// Event naming convention
const eventName = 'vm:status:updated';
const eventName = 'department:created';
const eventName = 'user:profile:changed';

// Event handler pattern
const handleVmStatusUpdate = (state, action) => {
  const { vmId, status } = action.payload;
  const vm = state.vms.find(vm => vm.id === vmId);
  if (vm) {
    vm.status = status;
    debug.info(`VM ${vmId} status updated to ${status}`);
  }
};
```

## GraphQL Codegen Workflow

Automated GraphQL hook generation ensures type safety and consistency.

### File Organization

```
src/gql/
├── queries/
│   ├── vm.graphql
│   ├── user.graphql
│   └── department.graphql
├── mutations/
│   ├── createVm.graphql
│   ├── updateUser.graphql
│   └── deleteDepartment.graphql
├── hooks.ts          # Generated hooks
└── graphql.ts        # Generated types
```

### Writing GraphQL Operations

```graphql
# src/gql/queries/vm.graphql
query GetVms($departmentId: ID) {
  vms(departmentId: $departmentId) {
    id
    name
    status
    department {
      id
      name
    }
  }
}

query GetVmById($id: ID!) {
  vm(id: $id) {
    id
    name
    status
    cpu
    memory
    disk
  }
}
```

### Using Generated Hooks

```javascript
import { useGetVmsQuery, useGetVmByIdQuery } from '@/gql/hooks';

function VmList({ departmentId }) {
  const debug = createDebugger('frontend:components:VmList');

  const { data, loading, error } = useGetVmsQuery({
    variables: { departmentId },
    onCompleted: () => debug.success('VMs loaded successfully'),
    onError: (error) => debug.error('Failed to load VMs:', error)
  });

  if (loading) return <VmListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.vms?.map(vm => (
        <VmCard key={vm.id} vm={vm} />
      ))}
    </div>
  );
}
```

### Codegen Commands

```bash
# Regenerate hooks and types
npm run codegen

# Watch for changes (not scripted, but available via CLI)
npx graphql-codegen --config codegen.ts --watch
```

### **MANDATORY**: Use Generated Hooks

```javascript
// ❌ NEVER DO THIS
import { useQuery } from '@apollo/client';
import { GET_VMS } from './queries';

const { data } = useQuery(GET_VMS);

// ✅ ALWAYS DO THIS
import { useGetVmsQuery } from '@/gql/hooks';

const { data } = useGetVmsQuery();
```

## Redux State Management

Redux Toolkit with selective persistence and real-time integration.

### Slice Structure

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:state:vms');

// Async thunk pattern
export const fetchVms = createAsyncThunk(
  'vms/fetchVms',
  async (params, { rejectWithValue }) => {
    try {
      debug.info('Fetching VMs with params:', params);
      const response = await api.getVms(params);
      debug.success('VMs fetched successfully');
      return response.data;
    } catch (error) {
      debug.error('Failed to fetch VMs:', error);
      return rejectWithValue(error.message);
    }
  }
);

const vmSlice = createSlice({
  name: 'vms',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedVm: null
  },
  reducers: {
    setSelectedVm: (state, action) => {
      state.selectedVm = action.payload;
      debug.info('Selected VM changed:', action.payload?.id);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedVm, clearError } = vmSlice.actions;
export default vmSlice.reducer;
```

### Persistence Configuration

```javascript
// src/state/store.js
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Root-level blacklist - never persist these slices
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['vms', 'templates', 'templateCategories', 'users', 'vmPorts']
};

// Slice-specific persistence configurations
const persistAuthConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'] // Only persist user and token
};

const persistConfigDepartments = {
  key: 'departments',
  storage,
  whitelist: ['items'] // Only persist the items array
};

const persistSystemConfig = {
  key: 'system',
  storage,
  whitelist: ['graphics'] // Only persist the graphics array
};

const persistFiltersConfig = {
  key: 'filters',
  storage,
  whitelist: ['items', 'selectedFilter']
};

const persistFilterRulesConfig = {
  key: 'filterRules',
  storage,
  whitelist: ['items']
};

const persistAppSettingsConfig = {
  key: 'appSettings',
  storage,
  whitelist: ['settings'] // Only persist the settings object
};
```

### Error and Loading States

```javascript
// Standard pattern for handling states
function MyComponent() {
  const { data, loading, error } = useSelector(state => state.mySlice);
  const debug = createDebugger('frontend:components:MyComponent');

  useEffect(() => {
    if (error) {
      debug.error('Component error:', error);
    }
  }, [error]);

  if (loading) return <MySkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Component content */}</div>;
}
```

## Loading States with Skeleton

Use the Skeleton component for consistent loading states across the application.

### Basic Skeleton Usage

```javascript
import { Skeleton } from '@/components/ui/skeleton';

function VmListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Loading State Patterns

```javascript
// Pattern 1: Component-level loading
function VmCard({ vmId }) {
  const { data: vm, loading } = useGetVmByIdQuery({ variables: { id: vmId } });

  if (loading) return <VmCardSkeleton />;

  return <div>{/* VM card content */}</div>;
}

// Pattern 2: List-level loading
function VmList() {
  const { data, loading } = useGetVmsQuery();

  if (loading) return <VmListSkeleton />;

  return (
    <div>
      {data?.vms?.map(vm => <VmCard key={vm.id} vm={vm} />)}
    </div>
  );
}

// Pattern 3: Conditional skeleton
function Dashboard() {
  const { vms, loading: vmsLoading } = useSelector(state => state.vms);
  const { departments, loading: deptsLoading } = useSelector(state => state.departments);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        {vmsLoading ? <VmListSkeleton /> : <VmList vms={vms} />}
      </div>
      <div>
        {deptsLoading ? <DepartmentListSkeleton /> : <DepartmentList departments={departments} />}
      </div>
    </div>
  );
}
```

### When to Use Different Loading States

- **Skeleton**: For content that will be replaced with similar-shaped content
- **Spinner**: For actions/operations that don't have predictable content shape
- **Loading overlay**: For blocking operations that prevent interaction

## Component Structure & Conventions

### File and Component Naming

```javascript
// ✅ PascalCase for components
VmManagement.jsx
UserProfile.jsx
DepartmentSettings.jsx

// ✅ camelCase for functions and variables
const handleSubmit = () => {};
const userData = {};
const isLoading = false;

// ✅ kebab-case for file names (when not components)
user-utils.js
api-config.js
socket-service.js
```

### Component Structure Template

```javascript
'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:MyComponent');

function MyComponent({
  prop1,
  prop2 = 'defaultValue',
  onAction,
  className,
  ...props
}) {
  // Hooks
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.mySlice);
  const [localState, setLocalState] = useState(null);

  // Effects
  useEffect(() => {
    debug.log('Component mounted');
    return () => debug.log('Component unmounted');
  }, []);

  useEffect(() => {
    if (error) {
      debug.error('Component error:', error);
    }
  }, [error]);

  // Handlers
  const handleClick = (event) => {
    debug.info('Button clicked', { prop1, localState });
    onAction?.(event);
  };

  // Early returns
  if (loading) return <ComponentSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  // Render
  return (
    <div className={`my-component ${className}`} {...props}>
      <Button onClick={handleClick}>
        {prop1}
      </Button>
    </div>
  );
}

export default MyComponent;
```

### Import Order

```javascript
// 1. React and React-related
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

// 3. Internal utilities and services
import { createDebugger } from '@/utils/debug';
import { apiService } from '@/services/api';

// 4. Internal components
import { Button } from '@/components/ui/button';
import { VmCard } from '@/components/VmCard';

// 5. Types (if using TypeScript)
import type { VM, Department } from '@/types';
```

## Must Do's

### 1. Debug System
- ✅ **Always use `createDebugger`** instead of `console.log`
- ✅ **Follow namespace conventions** for organized logging
- ✅ **Use appropriate debug levels** (log, info, warn, error, success)
- ✅ **Include context in debug messages** (IDs, relevant data)

### 2. Data Loading
- ✅ **Load critical data in init.js** (appSettings, currentUser)
- ✅ **Load feature-specific data on-demand** when the feature is accessed
- ✅ **Handle loading and error states** in all components
- ✅ **Use Skeleton components** for predictable loading states

### 3. GraphQL Integration
- ✅ **Use generated hooks** from `@/gql/hooks`
- ✅ **Organize GraphQL files** in queries/ and mutations/ folders
- ✅ **Run codegen after schema changes** (`npm run codegen`)
- ✅ **Handle GraphQL errors properly** with error boundaries

### 4. Real-time Updates
- ✅ **Implement real-time updates** for data that changes frequently
- ✅ **Initialize RealTimeReduxService** with the Redux store
- ✅ **Add real-time reducers** to Redux slices for automatic event handling
- ✅ **Check connection status** via `getRealTimeReduxService().getStatus()` when needed
- ✅ **Handle connection state changes** gracefully

### 5. Redux State Management
- ✅ **Use selective persistence** - only persist necessary data
- ✅ **Follow slice structure patterns** with createAsyncThunk
- ✅ **Separate loading/error states** from actual data
- ✅ **Include debug logging** in all async thunks

### 6. Component Standards
- ✅ **Follow naming conventions** (PascalCase components, camelCase functions)
- ✅ **Use proper import order** (React, third-party, internal, types)
- ✅ **Include error boundaries** for robustness
- ✅ **Implement accessibility features** (ARIA labels, keyboard navigation)

### 7. Performance
- ✅ **Use React.memo** for expensive components
- ✅ **Implement proper key props** in lists
- ✅ **Lazy load heavy components** with React.lazy
- ✅ **Optimize re-renders** with useCallback and useMemo

## Must Not Do's

### 1. Debug System
- ❌ **Never use `console.log`** - always use createDebugger
- ❌ **Don't use generic namespaces** - be specific (avoid 'frontend:general')
- ❌ **Don't log sensitive data** (passwords, tokens, private info)

### 2. Data Loading
- ❌ **Don't load heavy data in init.js** - keep it minimal and critical only
- ❌ **Don't ignore loading states** - always provide user feedback
- ❌ **Don't load data that won't be used** - implement lazy loading
- ❌ **Don't block the UI** for non-critical data loading

### 3. GraphQL Integration
- ❌ **Never use Apollo Client directly** - use generated hooks
- ❌ **Don't ignore GraphQL errors** - handle them properly
- ❌ **Don't forget to run codegen** after schema changes
- ❌ **Don't mix REST and GraphQL** unnecessarily

### 4. Real-time Updates
- ❌ **Don't ignore real-time events** for data that changes
- ❌ **Don't create multiple socket connections** - use the singleton service
- ❌ **Don't forget to handle disconnection states**
- ❌ **Don't update state without validation**

### 5. Redux State Management
- ❌ **Don't persist entire Redux state** - be selective
- ❌ **Don't mutate state directly** - use Redux Toolkit
- ❌ **Don't ignore async thunk rejections**
- ❌ **Don't store UI state in Redux** unless it needs to persist

### 6. Component Standards
- ❌ **Don't create monolithic components** - break them down
- ❌ **Don't hardcode values** - use appSettings or constants
- ❌ **Don't ignore PropTypes/TypeScript types**
- ❌ **Don't forget accessibility** features

### 7. Performance
- ❌ **Don't render large lists without virtualization**
- ❌ **Don't create functions in render** - use useCallback
- ❌ **Don't ignore React DevTools warnings**
- ❌ **Don't fetch data on every render**

## Practical Examples

### Complete Component Example

```javascript
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVmsQuery, useUpdateVmMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { setSelectedVm } from '@/state/slices/vms';

const debug = createDebugger('frontend:components:VmManager');

function VmManager({ departmentId, onVmSelect }) {
  const dispatch = useDispatch();
  const { selectedVm } = useSelector(state => state.vms);
  const [searchTerm, setSearchTerm] = useState('');

  // GraphQL hooks
  const {
    data,
    loading,
    error,
    refetch
  } = useGetVmsQuery({
    variables: { departmentId },
    onCompleted: () => debug.success('VMs loaded successfully'),
    onError: (error) => debug.error('Failed to load VMs:', error)
  });

  const [updateVm, { loading: updating }] = useUpdateVmMutation({
    onCompleted: () => {
      debug.success('VM updated successfully');
      refetch(); // Refetch to get updated data
    },
    onError: (error) => debug.error('Failed to update VM:', error)
  });

  // Effects
  useEffect(() => {
    debug.log('VmManager mounted', { departmentId });
    return () => debug.log('VmManager unmounted');
  }, [departmentId]);

  // Handlers
  const handleVmSelect = useCallback((vm) => {
    debug.info('VM selected:', vm.id);
    dispatch(setSelectedVm(vm));
    onVmSelect?.(vm);
  }, [dispatch, onVmSelect]);

  const handleVmUpdate = useCallback(async (vmId, updates) => {
    debug.info('Updating VM:', { vmId, updates });
    try {
      await updateVm({
        variables: { id: vmId, input: updates }
      });
    } catch (error) {
      debug.error('VM update failed:', error);
    }
  }, [updateVm]);

  const handleSearch = useCallback((term) => {
    debug.info('Search term changed:', term);
    setSearchTerm(term);
  }, []);

  // Computed values
  const filteredVms = data?.vms?.filter(vm =>
    vm.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <VmCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Failed to load VMs</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="vm-manager">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search VMs..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="vm-list space-y-2">
        {filteredVms.map(vm => (
          <VmCard
            key={vm.id}
            vm={vm}
            selected={selectedVm?.id === vm.id}
            onSelect={() => handleVmSelect(vm)}
            onUpdate={(updates) => handleVmUpdate(vm.id, updates)}
            updating={updating}
          />
        ))}
      </div>

      {filteredVms.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No VMs found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}

// Skeleton component
function VmCardSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  );
}

export default VmManager;
```

### Real-time Integration Example

```javascript
// Redux slice with real-time support
import { createSlice } from '@reduxjs/toolkit';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:state:notifications');

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
      debug.info('Notification added:', action.payload.id);
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
        debug.info('Notification marked as read:', action.payload);
      }
    },
    clearAll: (state) => {
      state.items = [];
      state.unreadCount = 0;
      debug.info('All notifications cleared');
    }
  }
});

export const { addNotification, markAsRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Component using real-time notifications
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRealTimeReduxService } from '@/services/realTimeReduxService';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:NotificationCenter');

function NotificationCenter() {
  const { items, unreadCount } = useSelector(state => state.notifications);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    try {
      const realTimeService = getRealTimeReduxService();
      const status = realTimeService.getStatus();
      setConnectionStatus(status);

      if (status.socketInfo?.connected) {
        debug.success('Connected to real-time notifications');
      } else {
        debug.warn('Disconnected from real-time notifications');
      }
    } catch (error) {
      debug.warn('Real-time service not available:', error.message);
    }
  }, []);

  return (
    <div className="notification-center">
      <div className="header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
        {!connectionStatus?.socketInfo?.connected && (
          <span className="status offline">Offline</span>
        )}
      </div>

      <div className="notifications">
        {items.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
}
```

### Error Handling Example

```javascript
import React from 'react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:ErrorBoundary');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    debug.error('Error boundary caught error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## Conclusion

These guidelines ensure consistency, maintainability, and proper integration with the Infinibay frontend architecture. By following these patterns, developers can:

- Write more maintainable and debuggable code
- Properly integrate with the existing real-time and GraphQL systems
- Provide better user experiences with proper loading states
- Maintain type safety and consistency across the application

Remember: **Always consult these guidelines before starting any frontend development work.**