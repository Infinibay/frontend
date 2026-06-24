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
			})
			.addCase(fetchFeatureFlags.fulfilled, (state, action) => {
				state.loading = false;
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
			.addCase(fetchFeatureFlags.rejected, (state) => {
				state.loading = false;
				// Keep fail-safe defaults if fetch fails
				state.flags = { ...FEATURE_FLAG_DEFAULTS };
				state.meta = [];
				state.initialized = true;
			});
	}
});

// Selectors
export const selectFeatureFlags = (state) => state.featureFlags.flags;
export const selectFeatureFlagMeta = (state) => state.featureFlags.meta;

export { fetchFeatureFlags };
export default featureFlagsSlice.reducer;
