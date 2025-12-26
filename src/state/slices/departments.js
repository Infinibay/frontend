import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:state:departments');

import {
    DepartmentsDocument,
    DepartmentDocument,
    FindDepartmentByNameDocument,
    CreateDepartmentDocument,
    DestroyDepartmentDocument,
    UpdateDepartmentNameDocument,
    UpdateDepartmentFirewallPolicyDocument
} from '@/gql/hooks';

const executeGraphQLMutation = async (mutation, variables) => {
    try {
        const { data } = await client.mutate({ mutation, variables });
        return data;
    } catch (error) {
        debug.error('mutation', 'GraphQL mutation error:', error);
        throw error;
    }
};

const executeGraphQLQuery = async (query, variables = {}) => {
    try {
        const response = await client.query({
            query,
            variables,
            fetchPolicy: 'network-only' // Force network request
        });

        // Check for GraphQL errors in the response
        if (response.errors) {
            const errorMessage = response.errors.map(err => err.message).join(', ');
            debug.error('query', 'GraphQL query error:', errorMessage);
            throw new Error(errorMessage);
        }

        // Get the first key in the data object (e.g., 'departments', 'findDepartmentByName')
        const firstKey = Object.keys(response.data)[0];

        // Check if the data exists
        if (response.data[firstKey] === undefined) {
            debug.warn('query', `GraphQL query returned undefined for ${firstKey}`);
            return { [firstKey]: null };
        }

        // Check for errors in the data response
        if (response.data[firstKey]?.errors) {
            const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
            debug.error('query', 'GraphQL data error:', errorMessage);
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error) {
        debug.error('query', 'GraphQL query error:', error);
        // Re-throw the error so it can be handled by the calling function
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
    async (name, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLQuery(FindDepartmentByNameDocument, { name });
            return data.findDepartmentByName;
        } catch (error) {
            debug.error('fetchByName', `Error fetching department by name "${name}":`, error);
            return rejectWithValue(error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'departments/createDepartment',
    async (input) => {
        const variables = {
            name: input.name,
            firewallConfig: input.firewallConfig || null
        };
        const data = await executeGraphQLMutation(CreateDepartmentDocument, variables);
        return data.createDepartment;
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async ({ id }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLMutation(DestroyDepartmentDocument, { id });
            return data.destroyDepartment;
        } catch (error) {
            debug.error('deleteDepartment', `Error deleting department with id "${id}":`, error);
            return rejectWithValue(error.message || 'Failed to delete department');
        }
    }
);

export const updateDepartmentName = createAsyncThunk(
    'departments/updateDepartmentName',
    async (input) => {
        const data = await executeGraphQLMutation(UpdateDepartmentNameDocument, { input });
        return data.updateDepartmentName;
    }
);

export const updateDepartmentFirewallPolicy = createAsyncThunk(
    'departments/updateDepartmentFirewallPolicy',
    async ({ departmentId, input }) => {
        const data = await executeGraphQLMutation(
            UpdateDepartmentFirewallPolicyDocument,
            { departmentId, input }
        );
        return data.updateDepartmentFirewallPolicy;
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
            delete: false,
            updateName: false,
            updateFirewallPolicy: false
        },
        error: {
            fetch: null,
            fetchOne: null,
            fetchByName: null,
            create: null,
            delete: null,
            updateName: null,
            updateFirewallPolicy: null
        }
    },
    reducers: {
        // Real-time event handlers
        realTimeDepartmentCreated: (state, action) => {
            const newDepartment = action.payload;
            // Check if department already exists to avoid duplicates
            const existingIndex = state.items.findIndex(dept => dept.id === newDepartment.id);
            if (existingIndex === -1) {
                state.items.push(newDepartment);
                debug.success('realtime', 'Department created', newDepartment.name);
            }
        },
        realTimeDepartmentUpdated: (state, action) => {
            const updatedDepartment = action.payload;
            const index = state.items.findIndex(dept => dept.id === updatedDepartment.id);
            if (index !== -1) {
                // Store old department data for VM updates
                const oldDepartment = state.items[index];
                state.items[index] = updatedDepartment;
                debug.success('realtime', 'Department updated', updatedDepartment.name);

                // If the department name changed, we need to update VMs too
                // This will be handled by a separate action to the VMs slice
                if (oldDepartment.name !== updatedDepartment.name) {
                    debug.info('realtime', 'Department name changed, VMs will be updated separately');
                }
            }
        },
        realTimeDepartmentDeleted: (state, action) => {
            const deletedDepartment = action.payload;
            const deptId = deletedDepartment.id || deletedDepartment;
            state.items = state.items.filter(dept => dept.id !== deptId);
            debug.success('realtime', 'Department deleted', deptId);
        }
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

                // Check if payload exists before accessing its properties
                if (action.payload) {
                    const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                    if (index !== -1) {
                        state.items[index] = action.payload;
                    } else {
                        state.items.push(action.payload);
                    }
                }
                // If payload is null, we don't need to update the state
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
            })

            // Update Department Name
            .addCase(updateDepartmentName.pending, (state) => {
                state.loading.updateName = true;
                state.error.updateName = null;
            })
            .addCase(updateDepartmentName.fulfilled, (state, action) => {
                state.loading.updateName = false;
                const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateDepartmentName.rejected, (state, action) => {
                state.loading.updateName = false;
                state.error.updateName = action.error.message;
            })

            // Update Department Firewall Policy
            .addCase(updateDepartmentFirewallPolicy.pending, (state) => {
                state.loading.updateFirewallPolicy = true;
                state.error.updateFirewallPolicy = null;
            })
            .addCase(updateDepartmentFirewallPolicy.fulfilled, (state, action) => {
                state.loading.updateFirewallPolicy = false;
                const index = state.items.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateDepartmentFirewallPolicy.rejected, (state, action) => {
                state.loading.updateFirewallPolicy = false;
                state.error.updateFirewallPolicy = action.error.message;
            });
    },
});

export default departmentsSlice.reducer;

// Export action creators
export const {
    realTimeDepartmentCreated,
    realTimeDepartmentUpdated,
    realTimeDepartmentDeleted
} = departmentsSlice.actions;

// Selectors
export const selectDepartments = (state) => state.departments.items;
export const selectDepartmentsLoading = (state) => state.departments.loading.fetch;
export const selectDepartmentError = (state) => state.departments.error.fetch;
export const selectDepartmentDeleteError = (state) => state.departments.error.delete;
export const selectFirewallPolicyLoading = (state) => state.departments.loading.updateFirewallPolicy;
export const selectFirewallPolicyError = (state) => state.departments.error.updateFirewallPolicy;
