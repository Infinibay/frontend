import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import auth from '@/utils/auth';
import { FEATURE_FLAG_DEFAULTS } from '@/config/featureFlags';

// Async thunk for feature flags
const fetchFeatureFlags = createAsyncThunk('featureFlags/fetch', async () => {
	return await auth.fetchFeatureFlags();
});

// Initial state
const initialState = {
	flags: { ...FEATURE_FLAG_DEFAULTS }, // key -> boolean map (effective)
	meta: [], // full array of { key, label, description, enabled } for the settings UI
	loading: false,
	error: null,
	initialized: false
};

const featureFlagsSlice = createSlice({
	name: 'featureFlags',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFeatureFlags.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchFeatureFlags.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				const payload = action.payload || [];
				state.meta = payload;
				state.flags = {
					...FEATURE_FLAG_DEFAULTS,
					...payload.reduce((acc, f) => {
						acc[f.key] = f.enabled;
						return acc;
					}, {})
				};
				state.initialized = true;
			})
			.addCase(fetchFeatureFlags.rejected, (state, action) => {
				state.loading = false;
				// Surface the failure so the flags settings UI can show it.
				state.error = action.error?.message || 'Failed to load feature flags';
				// Do NOT reset flags/meta on a transient failure: flags are persisted
				// (store.js whitelist ['flags']) and were rehydrated (or seeded from
				// FEATURE_FLAG_DEFAULTS in initialState) before this fetch ran. Keep
				// the current effective flags rather than overwriting the persisted
				// copy with defaults; if nothing was ever loaded, state.flags already
				// equals FEATURE_FLAG_DEFAULTS.
				state.initialized = true;
			});
	}
});

// Selectors
export const selectFeatureFlags = (state) => state.featureFlags.flags;
export const selectFeatureFlagMeta = (state) => state.featureFlags.meta;
export const selectFeatureFlagsError = (state) => state.featureFlags.error;

export { fetchFeatureFlags };
export default featureFlagsSlice.reducer;
