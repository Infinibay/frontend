import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import auth from '@/utils/auth'
import { CURRENT_USER_QUERY } from '@/graphql/queries';
import { client } from '@/apollo-client';
import { ApolloClient } from '@apollo/client';

const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { getState }) => {
	return await auth.fetchCurrentUser();
});

const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { dispatch }) => {
	const token = await auth.login(email, password);
	return token;
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
		token: null,
		user: {
			id: null,
			firstName: null,
			lastName: null,
			email: null,
			role: null,
		},
		loading: {
			login: false,
			fetchUser: false
		},
		error: {
			login: null,
			fetchUser: null
		}
	},
	reducers: {
		logout: (state) => {
			state.token = null;
			state.user = {
				id: null,
				firstName: null,
				lastName: null,
				email: null,
				role: null,
			};
			state.isLoggedIn = false;
			state.error.login = null;
			state.error.fetchUser = null;
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
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading.login = false;
				state.error.login = action.error.message;
				state.token = null;
				state.isLoggedIn = false;
			});
	}
});

export const { logout } = authSlice.actions;
export { fetchCurrentUser, loginUser };
export default authSlice.reducer;