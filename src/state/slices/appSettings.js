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
	interfaceSize: 'md',
	// Whitelabel — applied at runtime via CSS vars. null = use Harbor default.
	accentColor: null,
	brandName: null,
	// UI view modes — persist the operator's preferred layout for lists that
	// support both. 'table' is the operator default per design guideline §6.1.
	desktopsView: 'table',
	departmentsView: 'grid',
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
		setAccentColor: (state, action) => {
			state.settings.accentColor = action.payload || null;
		},
		setBrandName: (state, action) => {
			state.settings.brandName = action.payload || null;
		},
		setLogoUrl: (state, action) => {
			state.settings.logoUrl = action.payload || null;
		},
		setDesktopsView: (state, action) => {
			state.settings.desktopsView = action.payload === 'grid' ? 'grid' : 'table';
		},
		setDepartmentsView: (state, action) => {
			state.settings.departmentsView = action.payload === 'table' ? 'table' : 'grid';
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
export const selectAccentColor = (state) => state.appSettings.settings.accentColor;
export const selectBrandName = (state) => state.appSettings.settings.brandName;
export const selectLogoUrl = (state) => state.appSettings.settings.logoUrl;
export const selectDesktopsView = (state) => state.appSettings.settings.desktopsView || 'table';
export const selectDepartmentsView = (state) => state.appSettings.settings.departmentsView || 'grid';

export const {
	resetSettings,
	setThemePreference,
	setSizePreference,
	setAccentColor,
	setBrandName,
	setLogoUrl,
	setDesktopsView,
	setDepartmentsView,
	clearErrors,
} = appSettingsSlice.actions;
export { fetchAppSettings, updateAppSettings };
export default appSettingsSlice.reducer;