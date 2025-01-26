import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth'
import vmsReducer from './slices/vms'
import departments from './slices/departments'
import persistedApplicaitonReducer from './slices/applications'
import templatesReducer from './slices/templates'
import systemReducer from './slices/system'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['vms', 'templates'] // Don't persist these reducers
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

const persistedAuth = persistReducer(persistAuthConfig, authReducer)
const persistedDeparments = persistReducer(persistConfigDepartments, departments)
const persistedSystem = persistReducer(persistSystemConfig, systemReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    vms: vmsReducer,
    departments: persistedDeparments,
    applications: persistedApplicaitonReducer,
    templates: templatesReducer,
    system: persistedSystem,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)