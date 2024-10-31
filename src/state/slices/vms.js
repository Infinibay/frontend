import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { MACHINES_QUERY, GET_VNC_QUERY } from '@/graphql/queries';
import { 
	CREATE_MACHINE_MUTATION,
	DELETE_MACHINE_MUTATION,
	POWER_OFF_MUTATION,
	POWER_ON_MUTATION,
	SUSPEND_MUTATION
} from '@/graphql/mutations';

const executeGraphQLMutation = async (mutation, variables) => {
	try {
		const { data } = await client.mutate({ mutation, variables });
		return data;
	} catch (error) {
		console.error('GraphQL mutation error:', error);
		throw error;
	}
};

const executeGraphQLQuery = async (query, variables = {}) => {
	try {
		const { data } = await client.query({ query, variables });
		return data;
	} catch (error) {
		console.error('GraphQL query error:', error);
		throw error;
	}
};

export const fetchVms = createAsyncThunk(
	'vms/fetchVms',
	async () => {
		const data = await executeGraphQLQuery(MACHINES_QUERY);
		return data.machines;
	}
);

export const createVm = createAsyncThunk(
	'vms/createVm',
	async (payload) => {
		const data = await executeGraphQLMutation(CREATE_MACHINE_MUTATION, { input: payload });
		return data.createMachine;
	}
);

export const playVm = createAsyncThunk(
	'vms/playVm',
	async (payload, { dispatch }) => {
		await executeGraphQLMutation(POWER_ON_MUTATION, { id: payload.id });
		await dispatch(fetchVms());
		return payload;
	}
);

export const pauseVm = createAsyncThunk(
	'vms/pauseVm',
	async (payload, { dispatch }) => {
		await executeGraphQLMutation(SUSPEND_MUTATION, { id: payload.id });
		await dispatch(fetchVms());
		return payload;
	}
);

export const stopVm = createAsyncThunk(
	'vms/stopVm',
	async (payload, { dispatch }) => {
		await executeGraphQLMutation(POWER_OFF_MUTATION, { id: payload.id });
		await dispatch(fetchVms());
		return payload;
	}
);

export const deleteVm = createAsyncThunk(
	'vms/deleteVm',
	async (payload) => {
		const data = await executeGraphQLMutation(DELETE_MACHINE_MUTATION, { id: payload.id });
		return data.deleteMachine;
	}
);

export const getVnc = createAsyncThunk(
	'vms/getVnc',
	async (payload) => {
		const data = await executeGraphQLQuery(GET_VNC_QUERY, { id: payload.id });
		return {
			id: payload.id,
			config: {
				vnc: {
					link: data.getVnc.link,
					password: data.getVnc.password
				}
			}
		};
	}
);

const vmsSlice = createSlice({
	name: 'vms',
	initialState: {
		items: [],
		selectedMachine: null,
	},
	reducers: {
		selectMachine: (state, action) => {
			state.selectedMachine = action.payload;
		},
		deselectMachine: (state) => {
			state.selectedMachine = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchVms.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(createVm.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(deleteVm.fulfilled, (state, action) => {
				state.items = state.items.filter((vm) => vm.id !== action.payload.id);
			})
			.addCase(playVm.fulfilled, (state, action) => {
				const index = state.items.findIndex((vm) => vm.id === action.payload.id);
				if (index !== -1) {
					state.items[index].status = "running";
				}
			})
			.addCase(pauseVm.fulfilled, (state, action) => {
				const index = state.items.findIndex((vm) => vm.id === action.payload.id);
				if (index !== -1) {
					state.items[index].status = "paused";
				}
			})
			.addCase(stopVm.fulfilled, (state, action) => {
				const index = state.items.findIndex((vm) => vm.id === action.payload.id);
				if (index !== -1) {
					state.items[index].status = "stoped";
				}
			})
			.addCase(getVnc.fulfilled, (state, action) => {
				const index = state.items.findIndex((vm) => vm.id === action.payload.id);
				if (index !== -1) {
					state.items[index].config ||= {};
					state.items[index].config.vnc = action.payload.config.vnc;
				}
			});
	},
});

export default vmsSlice.reducer;
export const { selectMachine, deselectMachine } = vmsSlice.actions;