import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth'
import vmsReducer from './slices/vms'

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
		auth: persistedReducer,
		vms: vmsReducer,
	},
});
export const persistor = persistStore(store)