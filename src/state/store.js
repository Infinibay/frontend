import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth'
import vmsReducer from './slices/vms'
import departments from './slices/departments'

const persistAuthConfig = {
  key: 'auth',
  storage,
};

const persistConfigDepartments = {
	key: 'departments',
	storage,
};

const persistedAuth = persistReducer(persistAuthConfig, authReducer)
const persistedDeparments = persistReducer(persistConfigDepartments, departments)

export const store = configureStore({
  reducer: {
		auth: persistedAuth,
		vms: vmsReducer,
		departments: persistedDeparments,
	},
});
export const persistor = persistStore(store)