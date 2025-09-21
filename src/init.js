import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser } from '@/state/slices/auth';
import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';
import { fetchApplications } from './state/slices/applications';
import { fetchGraphics } from './state/slices/system';
import { fetchUsers } from './state/slices/users';
import { fetchFilters } from './state/slices/filters';
import { fetchFilterRules } from './state/slices/filterRules';
import { fetchAppSettings } from './state/slices/appSettings';

export const fetchInitialData = createAsyncThunk(
	'app/fetchInitialData',
	async (_, { dispatch }) => {
		try {
			console.log('Fetching initial data...');

			// Fetch all data concurrently
			await Promise.all([
				dispatch(fetchAppSettings()),
				dispatch(fetchCurrentUser()),
				dispatch(fetchVms()),
				dispatch(fetchDepartments()),
				dispatch(fetchApplications()),
				dispatch(fetchGraphics()),
				dispatch(fetchUsers()),
				dispatch(fetchFilters()),
				dispatch(fetchFilterRules()),
			]);

			return true;
		} catch (error) {
			console.error('Initial data fetch failed:', error);
			throw error;
		}
	}
);
