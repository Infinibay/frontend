import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import auth from '@/utils/auth'
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:state:auth');


const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { getState }) => {
	return await auth.fetchCurrentUser();
});

const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { dispatch }) => {
	const token = await auth.login(email, password);
	if (token) {
		// redirect to /computers using browser url
		window.location.href = '/computers';
	}
	return token;
});

// Function to get initial state from localStorage
const getInitialState = () => {
	// Only access localStorage in browser environment
	if (typeof window !== 'undefined') {
		try {
			const token = localStorage.getItem('token');
			const socketNamespace = localStorage.getItem('socketNamespace');
			
			// Log for debugging Chrome issue
			debug.info('init', 'Auth initial state from localStorage:', {
				hasToken: !!token,
				hasNamespace: !!socketNamespace,
				namespace: socketNamespace
			});
			
			return {
				isLoggedIn: !!token,
				token: token || null,
				socketNamespace: socketNamespace || null,
				user: {
					id: null,
					firstName: null,
					lastName: null,
					email: null,
					role: null,
					avatar: null,
				},
				loading: {
					login: false,
					fetchUser: false
				},
				error: {
					login: null,
					fetchUser: null
				}
			};
		} catch (error) {
			debug.error('init', 'Error reading from localStorage:', error);
			// Fall through to default state
		}
	}
	
	// Default state for SSR or if localStorage fails
	return {
		isLoggedIn: false,
		token: null,
		socketNamespace: null,
		user: {
			id: null,
			firstName: null,
			lastName: null,
			email: null,
			role: null,
			avatar: null,
		},
		loading: {
			login: false,
			fetchUser: false
		},
		error: {
			login: null,
			fetchUser: null
		}
	};
};

const authSlice = createSlice({
	name: 'auth',
	initialState: getInitialState(),
	reducers: {
		logout: (state) => {
			state.token = null;
			state.socketNamespace = null;
			state.user = {
				id: null,
				firstName: null,
				lastName: null,
				email: null,
				role: null,
				avatar: null,
			};
			state.isLoggedIn = false;
			state.error.login = null;
			state.error.fetchUser = null;

			// Clear both token and socket namespace from localStorage
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token');
				localStorage.removeItem('socketNamespace');
			}
		},
		setSocketNamespace: (state, action) => {
			state.socketNamespace = action.payload;
			// Store in localStorage for persistence
			if (typeof window !== 'undefined' && action.payload) {
				localStorage.setItem('socketNamespace', action.payload);
				debug.success('socket', 'Socket namespace saved to localStorage:', action.payload);
			}
		},
		realTimeCurrentUserUpdated: (state, action) => {
			const updatedUser = action.payload;
			// Only update if the updated user is the currently logged-in user
			if (updatedUser && updatedUser.id === state.user?.id) {
				state.user = {
					...state.user,
					...updatedUser
				};
				debug.success('realtime', 'Current user updated via real-time event:', {
					userId: updatedUser.id,
					hasAvatar: !!updatedUser.avatar,
					avatar: updatedUser.avatar
				});
			}
		},
		restoreAuthFromStorage: (state) => {
			// Restore auth state from localStorage if it exists
			if (typeof window !== 'undefined') {
				try {
					const token = localStorage.getItem('token');
					const socketNamespace = localStorage.getItem('socketNamespace');
					
					if (token) {
						state.token = token;
						state.isLoggedIn = true;
						debug.success('restore', 'Token restored from localStorage');
					}
					
					if (socketNamespace) {
						state.socketNamespace = socketNamespace;
						debug.success('restore', 'Socket namespace restored from localStorage:', socketNamespace);
					}
				} catch (error) {
					debug.error('restore', 'Error restoring auth from localStorage:', error);
				}
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentUser.pending, (state) => {
				state.loading.fetchUser = true;
				state.error.fetchUser = null;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.loading.fetchUser = false;
				state.user = action.payload;
				state.isLoggedIn = true;

				// Use namespace from backend response, or generate one if not provided
				if (action.payload?.namespace) {
					debug.info('namespace', 'Using namespace from backend:', action.payload.namespace);
					state.socketNamespace = action.payload.namespace;
					if (typeof window !== 'undefined') {
						localStorage.setItem('socketNamespace', action.payload.namespace);
					}
				} else if (action.payload?.id) {
					// Fallback: generate namespace using same format as backend
					// Backend uses: user_${userId.substring(0, 8)}
					const namespace = `user_${action.payload.id.substring(0, 8)}`;
					debug.info('namespace', 'Generated fallback namespace:', namespace);
					state.socketNamespace = namespace;
					if (typeof window !== 'undefined') {
						localStorage.setItem('socketNamespace', namespace);
					}
				}
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.loading.fetchUser = false;
				state.error.fetchUser = action.error.message;
				state.user = {
					id: null,
					firstName: null,
					lastName: null,
					email: null,
					role: null,
					avatar: null,
				};
				state.isLoggedIn = false;
			})
			.addCase(loginUser.pending, (state) => {
				state.loading.login = true;
				state.error.login = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading.login = false;
				state.token = action.payload;
				state.isLoggedIn = true;

				// Store token in localStorage (already done in auth.login, but ensure consistency)
				if (typeof window !== 'undefined' && action.payload) {
					localStorage.setItem('token', action.payload);
				}

				// Socket namespace will be set when fetchCurrentUser is called after login
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading.login = false;
				state.error.login = action.error.message;
				state.token = null;
				state.isLoggedIn = false;
			});
	}
});

export const { logout, setSocketNamespace, restoreAuthFromStorage, realTimeCurrentUserUpdated } = authSlice.actions;
export { fetchCurrentUser, loginUser };
export default authSlice.reducer;