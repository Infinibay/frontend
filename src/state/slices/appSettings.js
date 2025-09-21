import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import auth from '@/utils/auth';

// Async thunks for app settings
const fetchAppSettings = createAsyncThunk('appSettings/fetch', async (_, { getState }) => {
	return await auth.fetchAppSettings();
});

const updateAppSettings = createAsyncThunk('appSettings/update', async (settingsInput, { getState }) => {
	return await auth.updateAppSettings(settingsInput);
});

// Default settings structure
const defaultSettings = {
	theme: 'system',
	wallpaper: null,
	logoUrl: null,
	interfaceSize: 'md'
};

// Initial state
const initialState = {
	settings: defaultSettings,
	loading: {
		fetch: false,
		update: false
	},
	error: {
		fetch: null,
		update: null
	},
	initialized: false
};

const appSettingsSlice = createSlice({
	name: 'appSettings',
	initialState,
	reducers: {
		resetSettings: (state) => {
			state.settings = defaultSettings;
			state.error.fetch = null;
			state.error.update = null;
			state.initialized = false;
		},
		setThemePreference: (state, action) => {
			// Optimistic update for immediate UI response
			state.settings.theme = action.payload;
		},
		setSizePreference: (state, action) => {
			// Optimistic update for immediate UI response
			state.settings.interfaceSize = action.payload;
		},
		clearErrors: (state) => {
			state.error.fetch = null;
			state.error.update = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(REHYDRATE, (state, action) => {
				const incoming = action.payload?.appSettings;
				if (incoming?.settings) {
					state.initialized = true;
				}
			})
			// Fetch app settings
			.addCase(fetchAppSettings.pending, (state) => {
				state.loading.fetch = true;
				state.error.fetch = null;
			})
			.addCase(fetchAppSettings.fulfilled, (state, action) => {
				state.loading.fetch = false;
				state.settings = { ...defaultSettings, ...(action.payload || {}) };
				// Validate interfaceSize value from backend
				const valid = ['sm', 'md', 'lg', 'xl'];
				if (!valid.includes(state.settings.interfaceSize)) {
					state.settings.interfaceSize = 'md';
				}
				state.initialized = true;
			})
			.addCase(fetchAppSettings.rejected, (state, action) => {
				state.loading.fetch = false;
				state.error.fetch = action.error.message;
				// Use default settings if fetch fails
				state.settings = defaultSettings;
				state.initialized = true;
			})
			// Update app settings
			.addCase(updateAppSettings.pending, (state) => {
				state.loading.update = true;
				state.error.update = null;
			})
			.addCase(updateAppSettings.fulfilled, (state, action) => {
				state.loading.update = false;
				if (action.payload) {
					state.settings = { ...state.settings, ...action.payload };
				}
			})
			.addCase(updateAppSettings.rejected, (state, action) => {
				state.loading.update = false;
				state.error.update = action.error.message;
			});
	}
});

// Selectors
export const selectAppSettings = (state) => state.appSettings.settings;
export const selectAppSettingsLoading = (state) => state.appSettings.loading;
export const selectAppSettingsError = (state) => state.appSettings.error;
export const selectAppSettingsInitialized = (state) => state.appSettings.initialized;
export const selectTheme = (state) => state.appSettings.settings.theme;
export const selectInterfaceSize = (state) => state.appSettings.settings.interfaceSize;

export const { resetSettings, setThemePreference, setSizePreference, clearErrors } = appSettingsSlice.actions;
export { fetchAppSettings, updateAppSettings };
export default appSettingsSlice.reducer;