import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';

import {
    DepartmentsDocument,
    DepartmentDocument,
    FindDepartmentByNameDocument,
    CreateDepartmentDocument,
    DestroyDepartmentDocument
} from '@/gql/hooks';

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
        const data = await executeGraphQLQuery(DepartmentsDocument);
        return data.departments;
    }
);

export const fetchDepartment = createAsyncThunk(
    'departments/fetchDepartment',
    async (id) => {
        const data = await executeGraphQLQuery(DepartmentDocument, { id });
        return data.department;
    }
);

export const fetchDepartmentByName = createAsyncThunk(
	'departments/fetchDepartmentByName',
	async (name) => {
		const data = await executeGraphQLQuery(FindDepartmentByNameDocument, { name });
		return data.findDepartmentByName;
	}
);

export const createDepartment = createAsyncThunk(
    'departments/createDepartment',
    async (input) => {
        console.log(name);
        const data = await executeGraphQLMutation(CreateDepartmentDocument, { name: input.name });
        return data.createDepartment;
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async (id) => {
        const data = await executeGraphQLMutation(DestroyDepartmentDocument, { id });
        return data.destroyDepartment;
    }
);

const departmentsSlice = createSlice({
    name: 'departments',
    initialState: {
        items: [],
        loading: {
            fetch: false,
            fetchOne: false,
            fetchByName: false,
            create: false,
            delete: false
        },
        error: {
            fetch: null,
            fetchOne: null,
            fetchByName: null,
            create: null,
            delete: null
        }
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Fetch Departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.items = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error.fetch = action.error.message;
            })

            // Fetch Single Department
            .addCase(fetchDepartment.pending, (state) => {
                state.loading.fetchOne = true;
                state.error.fetchOne = null;
            })
            .addCase(fetchDepartment.fulfilled, (state, action) => {
                state.loading.fetchOne = false;
                const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchDepartment.rejected, (state, action) => {
                state.loading.fetchOne = false;
                state.error.fetchOne = action.error.message;
            })

            // Fetch Department by Name
            .addCase(fetchDepartmentByName.pending, (state) => {
                state.loading.fetchByName = true;
                state.error.fetchByName = null;
            })
            .addCase(fetchDepartmentByName.fulfilled, (state, action) => {
                state.loading.fetchByName = false;
                const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchDepartmentByName.rejected, (state, action) => {
                state.loading.fetchByName = false;
                state.error.fetchByName = action.error.message;
            })

            // Create Department
            .addCase(createDepartment.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading.create = false;
                state.items.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.error.message;
            })

            // Delete Department
            .addCase(deleteDepartment.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.items = state.items.filter((dept) => dept.id !== action.payload.id);
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.error.message;
            });
    },
});

export default departmentsSlice.reducer;

// Selectors
export const selectDepartments = (state) => state.departments.items;
export const selectDepartmentsLoading = (state) => state.departments.loading.fetch;
export const selectDepartmentError = (state) => state.departments.error.fetch;
