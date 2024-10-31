import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser } from '@/state/slices/auth';
import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';

export const fetchInitialData = createAsyncThunk(
	'app/fetchInitialData',
	async (_, { dispatch }) => {
		try {
			console.log('Fetching initial data...');
			
			// Fetch all data concurrently
			await Promise.all([
				dispatch(fetchCurrentUser()),
				dispatch(fetchVms()),
				dispatch(fetchDepartments())
			]);

			return true;
		} catch (error) {
			console.error('Initial data fetch failed:', error);
			throw error;
		}
	}
);
