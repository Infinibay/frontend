import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser, setUserAvatar } from '@/state/slices/auth';
import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';
import { fetchApplications } from './state/slices/applications';
import { fetchGraphics } from './state/slices/system';
import { fetchUsers } from './state/slices/users';
import { fetchFilters } from './state/slices/filters';
import { fetchFilterRules } from './state/slices/filterRules';
import { fetchAppSettings } from './state/slices/appSettings';
import { createDebugger } from './utils/debug';
import { getAvatarUrl } from './utils/avatar';

const debug = createDebugger('frontend:init');

export const fetchInitialData = createAsyncThunk(
	'app/fetchInitialData',
	async (_, { dispatch }) => {
		debug.log('start', 'Fetching initial data...');

		const results = {
			successes: [],
			failures: []
		};

		// Critical services - these failures should throw
		try {
			await dispatch(fetchAppSettings()).unwrap();
			results.successes.push('appSettings');
		} catch (error) {
			debug.error('critical', 'App settings fetch failed:', error);
			results.failures.push({ service: 'appSettings', error });
			throw error; // Critical failure
		}

		try {
			const user = await dispatch(fetchCurrentUser()).unwrap();
			results.successes.push('currentUser');

			// Process avatar after successful user fetch
			try {
				const processedAvatarUrl = getAvatarUrl(user.avatar);
				await dispatch(setUserAvatar(processedAvatarUrl));
				debug.success('avatar', 'Avatar processed and updated:', processedAvatarUrl);
			} catch (avatarError) {
				debug.warn('avatar', 'Avatar processing failed:', avatarError);
				// Not critical - continue with app initialization
			}
		} catch (error) {
			debug.error('critical', 'Current user fetch failed:', error);
			results.failures.push({ service: 'currentUser', error });
			throw error; // Critical failure
		}

		// Non-critical services - these failures are logged but don't throw
		try {
			await dispatch(fetchDepartments()).unwrap();
			results.successes.push('departments');
		} catch (error) {
			debug.warn('non-critical', 'Departments fetch failed:', error);
			results.failures.push({ service: 'departments', error });
		}

		try {
			await dispatch(fetchVms()).unwrap();
			results.successes.push('vms');
		} catch (error) {
			debug.warn('non-critical', 'VMs fetch failed:', error);
			results.failures.push({ service: 'vms', error });
		}

		try {
			await dispatch(fetchApplications()).unwrap();
			results.successes.push('applications');
		} catch (error) {
			debug.warn('non-critical', 'Applications fetch failed:', error);
			results.failures.push({ service: 'applications', error });
		}

		try {
			await dispatch(fetchGraphics()).unwrap();
			results.successes.push('graphics');
		} catch (error) {
			debug.warn('non-critical', 'Graphics fetch failed:', error);
			results.failures.push({ service: 'graphics', error });
		}

		try {
			await dispatch(fetchUsers()).unwrap();
			results.successes.push('users');
		} catch (error) {
			debug.warn('non-critical', 'Users fetch failed:', error);
			results.failures.push({ service: 'users', error });
		}

		try {
			await dispatch(fetchFilters()).unwrap();
			results.successes.push('filters');
		} catch (error) {
			debug.warn('non-critical', 'Filters fetch failed:', error);
			results.failures.push({ service: 'filters', error });
		}

		try {
			await dispatch(fetchFilterRules()).unwrap();
			results.successes.push('filterRules');
		} catch (error) {
			debug.warn('non-critical', 'Filter rules fetch failed:', error);
			results.failures.push({ service: 'filterRules', error });
		}

		debug.success('complete', 'Initial data fetch completed:', {
			successes: results.successes,
			failures: results.failures.map(f => f.service)
		});

		return results;
	}
);
