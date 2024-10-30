import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { DEPARTMENTS_QUERY, DEPARTMENT_QUERY } from '@/graphql/queries';
import { 
    CREATE_DEPARMENT_MUTATION,
    DELETE_DEPARMENT_MUTATION,
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

export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
    async () => {
        const data = await executeGraphQLQuery(DEPARTMENTS_QUERY);
        return data.departments;
    }
);

export const fetchDepartment = createAsyncThunk(
    'departments/fetchDepartment',
    async (id) => {
        const data = await executeGraphQLQuery(DEPARTMENT_QUERY, { id });
        return data.department;
    }
);

export const createDepartment = createAsyncThunk(
    'departments/createDepartment',
    async (name) => {
        const data = await executeGraphQLMutation(CREATE_DEPARMENT_MUTATION, { name });
        return data.createDepartment;
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async (id) => {
        const data = await executeGraphQLMutation(DELETE_DEPARMENT_MUTATION, { id });
        return data.destroyDepartment;
    }
);

const departmentsSlice = createSlice({
    name: 'departments',
    initialState: {
        items: [],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(fetchDepartment.fulfilled, (state, action) => {
                const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.items = state.items.filter((dept) => dept.id !== action.payload.id);
            });
    },
});

export default departmentsSlice.reducer;
