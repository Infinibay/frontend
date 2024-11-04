import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth'
import vmsReducer from './slices/vms'
import departments from './slices/departments'
import persistedApplicaitonReducer from './slices/applications'

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
		applications: persistedApplicaitonReducer,
	},
});
export const persistor = persistStore(store)