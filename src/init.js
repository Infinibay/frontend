import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser } from '@/state/slices/auth';
import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';
import { fetchApplications } from './state/slices/applications';
import { fetchGraphics } from './state/slices/system';
import { fetchUsers } from './state/slices/users';
import { fetchAppSettings } from './state/slices/appSettings';
import { createDebugger } from './utils/debug';
import { startTimer, endTimer, measureAsync, trackDataLoading } from './utils/performance';

const debug = createDebugger('frontend:init');

// Service categories for optimized loading
const SERVICE_CONFIG = {
	// Critical services required for app navigation and auth
	critical: [
		{ name: 'appSettings', action: fetchAppSettings, description: 'App configuration and settings' },
		{ name: 'currentUser', action: fetchCurrentUser, description: 'Current user authentication' }
	],

	// Deferred services - load in background after critical services
	deferred: [
		{ name: 'departments', action: fetchDepartments, description: 'Department data for organization' },
		{ name: 'vms', action: fetchVms, description: 'Virtual machine inventory' },
		{ name: 'applications', action: fetchApplications, description: 'Available applications' },
		{ name: 'users', action: fetchUsers, description: 'User management data' }
	],

	// On-demand services - only load when specifically needed
	onDemand: [
		{ name: 'graphics', action: fetchGraphics, description: 'Graphics hardware for VM configuration' }
	]
};

// Environment configuration for loading behavior
const LOAD_ALL_SERVICES = process.env.NODE_ENV === 'development' && process.env.REACT_APP_LOAD_ALL_INIT === 'true';
const SKIP_DEFERRED = process.env.REACT_APP_SKIP_DEFERRED_INIT === 'true';

const executeServiceWithTiming = async (service, dispatch) => {
	const startTime = performance.now();

	try {
		const result = await measureAsync(`init:${service.name}`, async () => {
			return await dispatch(service.action()).unwrap();
		});

		const endTime = performance.now();
		trackDataLoading(service.name, startTime, endTime, true);

		debug.info(`${service.name} loaded successfully (${(endTime - startTime).toFixed(2)}ms)`);
		return { success: true, result };
	} catch (error) {
		const endTime = performance.now();
		trackDataLoading(service.name, startTime, endTime, false);

		debug.error(`${service.name} failed to load (${(endTime - startTime).toFixed(2)}ms):`, error);
		return { success: false, error };
	}
};

const loadDeferredServices = async (dispatch) => {
	debug.info('Starting deferred services loading in background...');

	const deferredResults = {
		successes: [],
		failures: []
	};

	// Load deferred services in parallel for better performance
	const deferredPromises = SERVICE_CONFIG.deferred.map(async (service) => {
		const result = await executeServiceWithTiming(service, dispatch);

		if (result.success) {
			deferredResults.successes.push(service.name);
		} else {
			deferredResults.failures.push({
				service: service.name,
				error: result.error,
				description: service.description
			});
		}

		return result;
	});

	await Promise.allSettled(deferredPromises);

	debug.info('Deferred services loading completed:', {
		successes: deferredResults.successes,
		failures: deferredResults.failures.map(f => f.service)
	});

	return deferredResults;
};

export const fetchInitialData = createAsyncThunk(
	'app/fetchInitialData',
	async (_, { dispatch }) => {
		const totalStartTime = startTimer('init:total');
		debug.info('Starting optimized initial data fetch...');

		const results = {
			successes: [],
			failures: [],
			deferred: null,
			timing: {
				start: performance.now(),
				critical: null,
				total: null
			}
		};

		// Load critical services first - app cannot start without these
		debug.info('Loading critical services...');
		const criticalStartTime = startTimer('init:critical');

		for (const service of SERVICE_CONFIG.critical) {
			const result = await executeServiceWithTiming(service, dispatch);

			if (result.success) {
				results.successes.push(service.name);

				// Avatar processing removed - now using Gravatar
			} else {
				debug.error(`Critical service ${service.name} failed:`, result.error);
				results.failures.push({
					service: service.name,
					error: result.error,
					description: service.description,
					critical: true
				});
				throw result.error; // Critical failure stops app initialization
			}
		}

		results.timing.critical = endTimer('init:critical');
		debug.success('Critical services loaded successfully');

		// Load deferred services in background if not disabled
		if (!SKIP_DEFERRED) {
			if (LOAD_ALL_SERVICES) {
				// In development with LOAD_ALL_SERVICES, wait for deferred services
				debug.info('Development mode: loading all services synchronously...');
				results.deferred = await loadDeferredServices(dispatch);
			} else {
				// In production, load deferred services asynchronously
				loadDeferredServices(dispatch).then((deferredResults) => {
					debug.info('Background loading completed:', deferredResults);
				}).catch((error) => {
					debug.warn('Background loading failed:', error);
				});
			}
		} else {
			debug.info('Deferred service loading disabled by configuration');
		}

		results.timing.end = performance.now();
		results.timing.total = endTimer('init:total');

		debug.success('Initial data fetch completed:', {
			successes: results.successes,
			failures: results.failures.map(f => f.service),
			timing: {
				critical: `${results.timing.critical?.toFixed(2)}ms`,
				total: `${results.timing.total?.toFixed(2)}ms`
			},
			config: {
				loadAll: LOAD_ALL_SERVICES,
				skipDeferred: SKIP_DEFERRED,
				environment: process.env.NODE_ENV
			}
		});

		return results;
	}
);

// Export service configuration for use by other components
export { SERVICE_CONFIG };
