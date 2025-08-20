import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth'
import vmsReducer from './slices/vms'
import departments from './slices/departments'
import persistedApplicaitonReducer from './slices/applications'
import templatesReducer from './slices/templates'
import templateCategoriesReducer from './slices/templateCategories'
import systemReducer from './slices/system'
import usersReducer from './slices/users'
import filtersReducer from './slices/filters'
import filterRulesReducer from './slices/filterRules'
import vmPortsReducer from './slices/vmPorts'
import securityReducer from './slices/security'
import isoReducer from './slices/iso'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['vms', 'templates', 'templateCategories', 'users', 'vmPorts'] // Don't persist these reducers
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

const persistFilterRulesConfig = {
  key: 'filterRules',
  storage,
  whitelist: ['items'],
};

const persistFiltersConfig = {
  key: 'filters',
  storage,
  whitelist: ['items', 'selectedFilter'],
};

const persistedAuth = persistReducer(persistAuthConfig, authReducer)
const persistedDeparments = persistReducer(persistConfigDepartments, departments)
const persistedSystem = persistReducer(persistSystemConfig, systemReducer)
const persistedFilterRules = persistReducer(persistFilterRulesConfig, filterRulesReducer);
const persistedFilters = persistReducer(persistFiltersConfig, filtersReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    vms: vmsReducer,
    departments: persistedDeparments,
    applications: persistedApplicaitonReducer,
    templates: templatesReducer,
    templateCategories: templateCategoriesReducer,
    system: persistedSystem,
    users: usersReducer,
    filters: persistedFilters,
    filterRules: persistedFilterRules,
    vmPorts: vmPortsReducer,
    security: securityReducer,
    iso: isoReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)