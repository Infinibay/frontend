import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSettingsReducer from './slices/appSettings'
import authReducer from './slices/auth'
import departments from './slices/departments'
import firewallReducer from './slices/firewall'
import healthReducer from './slices/health'
import headerReducer from './slices/header'
import isoReducer from './slices/iso'
import persistedApplicaitonReducer from './slices/applications'
import systemReducer from './slices/system'
import templateCategoriesReducer from './slices/templateCategories'
import templatesReducer from './slices/templates'
import usersReducer from './slices/users'
import vmPortsReducer from './slices/vmPorts'
import vmsReducer from './slices/vms'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['vms', 'templates', 'templateCategories', 'users', 'vmPorts', 'firewall', 'header'] // Don't persist these reducers
};

const persistAuthConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'] // Only persist these fields
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

const persistAppSettingsConfig = {
  key: 'appSettings',
  storage,
  whitelist: ['settings'] // Only persist the settings object
};

const persistedAuth = persistReducer(persistAuthConfig, authReducer)
const persistedDeparments = persistReducer(persistConfigDepartments, departments)
const persistedSystem = persistReducer(persistSystemConfig, systemReducer)
const persistedAppSettings = persistReducer(persistAppSettingsConfig, appSettingsReducer);

export const store = configureStore({
  reducer: {
    appSettings: persistedAppSettings,
    applications: persistedApplicaitonReducer,
    auth: persistedAuth,
    departments: persistedDeparments,
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