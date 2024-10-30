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
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
			state.user = action.payload;
			state.isLoggedIn = true;
		});
		builder.addCase(fetchCurrentUser.rejected, (state) => {
			state.user = {
				id: null,
				firstName: null,
				lastName: null,
				email: null,
				role: null,
			};
			state.isLoggedIn = false;
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.token = action.payload;
			state.isLoggedIn = true;
		});
		builder.addCase(loginUser.rejected, (state) => {
			state.token = null;
			state.isLoggedIn = false;
		});
	}
});

export const { logout } = authSlice.actions;
export { fetchCurrentUser, loginUser };
export default authSlice.reducer;