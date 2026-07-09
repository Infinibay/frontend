import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createMigrate, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSettingsReducer from './slices/appSettings'
import authReducer from './slices/auth'
import backgroundTasksReducer from './slices/backgroundTasks'
import departments from './slices/departments'
import featureFlagsReducer from './slices/featureFlags'
import firewallReducer from './slices/firewall'
import healthReducer from './slices/health'
import headerReducer from './slices/header'
import isoReducer from './slices/iso'
import persistedApplicationReducer from './slices/applications'
import systemReducer from './slices/system'
import templateCategoriesReducer from './slices/templateCategories'
import templatesReducer from './slices/templates'
import usersReducer from './slices/users'
import vmPortsReducer from './slices/vmPorts'
import vmsReducer from './slices/vms'

// Persisted-state schema version. Bump the matching config's `version` and add
// a numbered entry to its migration map below when a slice's persisted shape
// changes incompatibly; redux-persist then migrates (or purges) old payloads
// instead of hydrating a corrupt shape into the store.
const persistAuthConfig = {
  key: 'auth',
  storage,
  version: 1,
  // No transform needed to reach v1 (baseline). Add `2: (state) => ...` etc.
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  whitelist: ['user', 'token'] // Only persist these fields
};

const persistConfigDepartments = {
  key: 'departments',
  storage,
  version: 1,
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  whitelist: ['items'] // Only persist the items array
};

const persistSystemConfig = {
  key: 'system',
  storage,
  version: 1,
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  whitelist: ['graphics'] // Only persist the graphics array
};

const persistAppSettingsConfig = {
  key: 'appSettings',
  storage,
  version: 1,
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  whitelist: ['settings'] // Only persist the settings object
};

const persistFeatureFlagsConfig = {
  key: 'featureFlags',
  storage,
  version: 1,
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  whitelist: ['flags'] // Only persist the effective flags map
};

const persistedAuth = persistReducer(persistAuthConfig, authReducer)
const persistedDepartments = persistReducer(persistConfigDepartments, departments)
const persistedSystem = persistReducer(persistSystemConfig, systemReducer)
const persistedAppSettings = persistReducer(persistAppSettingsConfig, appSettingsReducer);
const persistedFeatureFlags = persistReducer(persistFeatureFlagsConfig, featureFlagsReducer);

export const store = configureStore({
  reducer: {
    appSettings: persistedAppSettings,
    applications: persistedApplicationReducer,
    auth: persistedAuth,
    backgroundTasks: backgroundTasksReducer,
    departments: persistedDepartments,
    featureFlags: persistedFeatureFlags,
    firewall: firewallReducer,
    header: headerReducer,
    health: healthReducer,
    iso: isoReducer,
    system: persistedSystem,
    templateCategories: templateCategoriesReducer,
    templates: templatesReducer,
    users: usersReducer,
    vmPorts: vmPortsReducer,
    vms: vmsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)