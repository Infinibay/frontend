import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:state:security');

import {
    ListServicesDocument,
    ListSecurityServicesDocument,
    GetVmServiceStatusDocument,
    GetDepartmentServiceStatusDocument,
    GetGlobalServiceStatusDocument,
    GetServiceStatusSummaryDocument,
    ToggleVmServiceDocument,
    ToggleDepartmentServiceDocument,
    ToggleGlobalServiceDocument,
    FindDepartmentByNameDocument,
    // GetDepartmentVmsServiceStatusDocument,
    // ClearVmServiceOverridesDocument,
    // ApplyDepartmentServiceToAllDocument,
    // ResetVmServiceOverridesDocument
} from '@/gql/hooks';

// Helper functions for GraphQL operations
const executeGraphQLMutation = async (document, variables = {}) => {
    debug.log('graphql', 'Executing GraphQL mutation:', document.definitions[0]?.name?.value, variables);
    try {
        const response = await client.mutate({
            mutation: document,
            variables
        });

        // Get the first key in the data object (the operation name)
        const keys = Object.keys(response.data);
        const firstKey = keys[0];

        // Check for errors in the data response
        if (response.data[firstKey]?.errors) {
            const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
            debug.error('graphql', 'GraphQL data error:', errorMessage);
            throw new Error(errorMessage);
        }

        debug.success('graphql', 'GraphQL mutation response:', response.data);
        return response.data;
    } catch (error) {
        debug.error('graphql', 'GraphQL mutation error:', error);
        // Re-throw the error so it can be handled by the calling function
        throw error;
    }
};

const executeGraphQLQuery = async (document, variables = {}) => {
    debug.log('graphql', 'Executing GraphQL query:', document.definitions[0]?.name?.value || 'unnamed query', variables);
    try {
        const response = await client.query({
            query: document,
            variables,
            fetchPolicy: 'network-only' // Skip cache to get fresh data
        });

        console.log("GraphQL raw response:", response);

        // Get the first key in the data object (the operation name)
        const keys = Object.keys(response.data);
        const firstKey = keys[0];

        console.log("GraphQL response for operation:", firstKey, "data:", response.data[firstKey]);

        // Check for errors in the data response
        if (response.data[firstKey]?.errors) {
            const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
            console.error('GraphQL data error:', errorMessage);
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error) {
        console.error('GraphQL query error:', error);
        // Re-throw the error so it can be handled by the calling function
        throw error;
    }
};

// Async thunks for services
export const fetchServices = createAsyncThunk(
    'security/fetchServices',
    async () => {
        const data = await executeGraphQLQuery(ListSecurityServicesDocument);
        return data.listSecurityServices;
    }
);

export const fetchDepartmentByName = createAsyncThunk(
    'security/fetchDepartmentByName',
    async (name, { rejectWithValue }) => {
        console.log("Fetching department by name:", name);
        try {
            const data = await executeGraphQLQuery(FindDepartmentByNameDocument, { name });
            console.log("Department data received:", data.findDepartmentByName);
            return data.findDepartmentByName;
        } catch (error) {
            console.error(`Error fetching department by name "${name}":`, error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchVmServiceStatus = createAsyncThunk(
    'security/fetchVmServiceStatus',
    async ({ serviceId, vmId }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLQuery(GetVmServiceStatusDocument, { serviceId, vmId });
            return data.getVmServiceStatus;
        } catch (error) {
            console.error('Error fetching VM service status:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchDepartmentServiceStatus = createAsyncThunk(
    'security/fetchDepartmentServiceStatus',
    async ({ serviceId, departmentId }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLQuery(GetDepartmentServiceStatusDocument, { serviceId, departmentId });
            return data.getDepartmentServiceStatus;
        } catch (error) {
            console.error('Error fetching department service status:', error);
            return rejectWithValue(error.message);
        }
    }
);

// TODO: Uncomment when GetDepartmentVmsServiceStatusDocument is available in backend
// export const fetchDepartmentVmsServiceStatus = createAsyncThunk(
//     'security/fetchDepartmentVmsServiceStatus',
//     async ({ serviceId, departmentId }, { rejectWithValue }) => {
//         console.log("Fetching VM service status with:", { serviceId, departmentId });
//         try {
//             const data = await executeGraphQLQuery(GetDepartmentVmsServiceStatusDocument, { serviceId, departmentId });
//             console.log("VM service status response:", data.getDepartmentVmsServiceStatus);
//             return data.getDepartmentVmsServiceStatus;
//         } catch (error) {
//             console.error('Error fetching department VMs service status:', error);
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Temporary placeholder - returns empty array until backend implements this
export const fetchDepartmentVmsServiceStatus = createAsyncThunk(
    'security/fetchDepartmentVmsServiceStatus',
    async ({ serviceId, departmentId }, { rejectWithValue }) => {
        console.log("Fetching VM service status with:", { serviceId, departmentId });
        // Return empty array for now
        return [];
    }
);

export const fetchGlobalServiceStatus = createAsyncThunk(
    'security/fetchGlobalServiceStatus',
    async (serviceId, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLQuery(GetGlobalServiceStatusDocument, { serviceId });
            return data.getGlobalServiceStatus;
        } catch (error) {
            console.error('Error fetching global service status:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchServiceStatusSummary = createAsyncThunk(
    'security/fetchServiceStatusSummary',
    async (_, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLQuery(GetServiceStatusSummaryDocument);
            return data.getServiceStatusSummary;
        } catch (error) {
            console.error('Error fetching service status summary:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Mutations
export const toggleVmService = createAsyncThunk(
    'security/toggleVmService',
    async ({ vmId, serviceId, enabled, action }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLMutation(ToggleVmServiceDocument, {
                vmId,
                serviceId,
                enabled,
                action
            });
            return data.toggleVmService;
        } catch (error) {
            console.error('Error toggling VM service:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const toggleDepartmentService = createAsyncThunk(
    'security/toggleDepartmentService',
    async ({ departmentId, serviceId, enabled, action }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLMutation(ToggleDepartmentServiceDocument, {
                departmentId,
                serviceId,
                enabled,
                action
            });
            return data.toggleDepartmentService;
        } catch (error) {
            console.error('Error toggling department service:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const toggleGlobalService = createAsyncThunk(
    'security/toggleGlobalService',
    async ({ serviceId, enabled, action }, { rejectWithValue }) => {
        try {
            const data = await executeGraphQLMutation(ToggleGlobalServiceDocument, {
                serviceId,
                enabled,
                action
            });
            return data.toggleGlobalService;
        } catch (error) {
            console.error('Error toggling global service:', error);
            return rejectWithValue(error.message);
        }
    }
);

// TODO: Uncomment when ClearVmServiceOverridesDocument is available in backend
// export const clearVmServiceOverrides = createAsyncThunk(
//     'security/clearVmServiceOverrides',
//     async ({ vmId, serviceId }, { rejectWithValue }) => {
//         try {
//             const data = await executeGraphQLMutation(ClearVmServiceOverridesDocument, { vmId, serviceId });
//             return data.clearVmServiceOverrides;
//         } catch (error) {
//             console.error('Error clearing VM overrides:', error);
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Temporary placeholder
export const clearVmServiceOverrides = createAsyncThunk(
    'security/clearVmServiceOverrides',
    async ({ vmId, serviceId }, { rejectWithValue }) => {
        console.warn('clearVmServiceOverrides not implemented in backend');
        return [];
    }
);

// TODO: Uncomment when ApplyDepartmentServiceToAllDocument is available in backend
// export const applyDepartmentServiceToAll = createAsyncThunk(
//     'security/applyDepartmentServiceToAll',
//     async ({ departmentId, serviceId, action, enabled }, { rejectWithValue }) => {
//         try {
//             const data = await executeGraphQLMutation(ApplyDepartmentServiceToAllDocument, { departmentId, serviceId, action, enabled });
//             return data.applyDepartmentServiceToAll;
//         } catch (error) {
//             console.error('Error applying department service to all VMs:', error);
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Temporary placeholder
export const applyDepartmentServiceToAll = createAsyncThunk(
    'security/applyDepartmentServiceToAll',
    async ({ departmentId, serviceId, action, enabled }, { rejectWithValue }) => {
        console.warn('applyDepartmentServiceToAll not implemented in backend');
        return {};
    }
);

// TODO: Uncomment when ResetVmServiceOverridesDocument is available in backend
// export const resetVmServiceOverrides = createAsyncThunk(
//     'security/resetVmServiceOverrides',
//     async ({ departmentId, serviceId, vmIds }, { rejectWithValue }) => {
//         try {
//             const data = await executeGraphQLMutation(ResetVmServiceOverridesDocument, { departmentId, serviceId, vmIds });
//             return data.resetVmServiceOverrides;
//         } catch (error) {
//             console.error('Error resetting VM overrides:', error);
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Temporary placeholder
export const resetVmServiceOverrides = createAsyncThunk(
    'security/resetVmServiceOverrides',
    async ({ departmentId, serviceId, vmIds }, { rejectWithValue }) => {
        console.warn('resetVmServiceOverrides not implemented in backend');
        return {};
    }
);

const securitySlice = createSlice({
    name: 'security',
    initialState: {
        services: [],
        selectedDepartment: null,
        vmServiceStatus: {},
        departmentServiceStatus: {},
        departmentVmsServiceStatus: {}, // Added logging here
        globalServiceStatus: {},
        serviceStatusSummary: null,
        loading: {
            services: false,
            vmService: false,
            departmentService: false,
            departmentVmsService: false,
            globalService: false,
            summary: false,
            toggleVm: false,
            toggleDepartment: false,
            toggleGlobal: false,
            departmentByName: false
        },
        error: {
            services: null,
            vmService: null,
            departmentService: null,
            departmentVmsService: null,
            globalService: null,
            summary: null,
            toggleVm: null,
            toggleDepartment: null,
            toggleGlobal: null,
            departmentByName: null
        }
    },
    reducers: {
        setSelectedService: (state, action) => {
            state.selectedService = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Services
            .addCase(fetchServices.pending, (state) => {
                state.loading.services = true;
                state.error.services = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading.services = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading.services = false;
                state.error.services = action.error.message;
            })

            // Fetch VM Service Status
            .addCase(fetchVmServiceStatus.pending, (state) => {
                state.loading.vmService = true;
                state.error.vmService = null;
            })
            .addCase(fetchVmServiceStatus.fulfilled, (state, action) => {
                state.loading.vmService = false;
                state.vmServiceStatus = {
                    ...state.vmServiceStatus,
                    [action.meta.arg.serviceId]: action.payload
                };
            })
            .addCase(fetchVmServiceStatus.rejected, (state, action) => {
                state.loading.vmService = false;
                state.error.vmService = action.error.message;
            })

            // Fetch Department Service Status
            .addCase(fetchDepartmentServiceStatus.pending, (state) => {
                state.loading.departmentService = true;
                state.error.departmentService = null;
            })
            .addCase(fetchDepartmentServiceStatus.fulfilled, (state, action) => {
                state.loading.departmentService = false;
                state.departmentServiceStatus = {
                    ...state.departmentServiceStatus,
                    [action.meta.arg.serviceId]: action.payload
                };
            })
            .addCase(fetchDepartmentServiceStatus.rejected, (state, action) => {
                state.loading.departmentService = false;
                state.error.departmentService = action.error.message;
            })

            // Fetch Department VMs Service Status
            .addCase(fetchDepartmentVmsServiceStatus.pending, (state) => {
                state.loading.departmentVmsService = true;
                state.error.departmentVmsService = null;
            })
            .addCase(fetchDepartmentVmsServiceStatus.fulfilled, (state, action) => {
                state.loading.departmentVmsService = false;
                state.departmentVmsServiceStatus = {
                    ...state.departmentVmsServiceStatus,
                    [action.meta.arg.serviceId]: action.payload
                };
            })
            .addCase(fetchDepartmentVmsServiceStatus.rejected, (state, action) => {
                state.loading.departmentVmsService = false;
                state.error.departmentVmsService = action.error.message;
            })

            // Fetch Global Service Status
            .addCase(fetchGlobalServiceStatus.pending, (state) => {
                state.loading.globalService = true;
                state.error.globalService = null;
            })
            .addCase(fetchGlobalServiceStatus.fulfilled, (state, action) => {
                state.loading.globalService = false;
                state.globalServiceStatus = {
                    ...state.globalServiceStatus,
                    [action.meta.arg]: action.payload
                };
            })
            .addCase(fetchGlobalServiceStatus.rejected, (state, action) => {
                state.loading.globalService = false;
                state.error.globalService = action.error.message;
            })

            // Fetch Service Status Summary
            .addCase(fetchServiceStatusSummary.pending, (state) => {
                state.loading.statusSummary = true;
                state.error.statusSummary = null;
            })
            .addCase(fetchServiceStatusSummary.fulfilled, (state, action) => {
                state.loading.statusSummary = false;
                state.serviceStatusSummary = action.payload;
            })
            .addCase(fetchServiceStatusSummary.rejected, (state, action) => {
                state.loading.statusSummary = false;
                state.error.statusSummary = action.error.message;
            })

            // Toggle VM Service
            .addCase(toggleVmService.pending, (state) => {
                state.loading.toggleVm = true;
                state.error.toggleVm = null;
            })
            .addCase(toggleVmService.fulfilled, (state, action) => {
                state.loading.toggleVm = false;
                // Update the VM service status in state
                const { serviceId } = action.meta.arg;
                if (state.vmServiceStatus[serviceId]) {
                    const vmIndex = state.vmServiceStatus[serviceId].findIndex(
                        vm => vm.vmId === action.payload.vmId
                    );
                    if (vmIndex !== -1) {
                        state.vmServiceStatus[serviceId][vmIndex] = action.payload;
                    } else {
                        state.vmServiceStatus[serviceId] = [
                            ...(state.vmServiceStatus[serviceId] || []),
                            action.payload
                        ];
                    }
                }
            })
            .addCase(toggleVmService.rejected, (state, action) => {
                state.loading.toggleVm = false;
                state.error.toggleVm = action.error.message;
            })

            // Clear VM Overrides
            .addCase(clearVmServiceOverrides.pending, (state) => {
                state.loading.toggleVm = true;
                state.error.toggleVm = null;
            })
            .addCase(clearVmServiceOverrides.fulfilled, (state, action) => {
                state.loading.toggleVm = false;
                // Replace VM status list for the service if provided in meta
                const { serviceId } = action.meta.arg;
                if (serviceId) {
                    state.vmServiceStatus[serviceId] = action.payload;
                }
            })
            .addCase(clearVmServiceOverrides.rejected, (state, action) => {
                state.loading.toggleVm = false;
                state.error.toggleVm = action.error.message;
            })

            // Apply department to all
            .addCase(applyDepartmentServiceToAll.pending, (state) => {
                state.loading.toggleDepartment = true;
                state.error.toggleDepartment = null;
            })
            .addCase(applyDepartmentServiceToAll.fulfilled, (state, action) => {
                state.loading.toggleDepartment = false;
                const { serviceId } = action.meta.arg;
                state.departmentServiceStatus[serviceId] = action.payload;
            })
            .addCase(applyDepartmentServiceToAll.rejected, (state, action) => {
                state.loading.toggleDepartment = false;
                state.error.toggleDepartment = action.error.message;
            })

            // Reset VM overrides (bulk)
            .addCase(resetVmServiceOverrides.pending, (state) => {
                state.loading.toggleDepartment = true;
            })
            .addCase(resetVmServiceOverrides.fulfilled, (state) => {
                state.loading.toggleDepartment = false;
            })
            .addCase(resetVmServiceOverrides.rejected, (state, action) => {
                state.loading.toggleDepartment = false;
                state.error.toggleDepartment = action.error.message;
            })

            // Toggle Department Service
            .addCase(toggleDepartmentService.pending, (state) => {
                state.loading.toggleDepartment = true;
                state.error.toggleDepartment = null;
            })
            .addCase(toggleDepartmentService.fulfilled, (state, action) => {
                state.loading.toggleDepartment = false;
                // Update the department service status in state
                const { serviceId } = action.meta.arg;
                if (state.departmentServiceStatus[serviceId]) {
                    state.departmentServiceStatus[serviceId] = action.payload;
                }
            })
            .addCase(toggleDepartmentService.rejected, (state, action) => {
                state.loading.toggleDepartment = false;
                state.error.toggleDepartment = action.error.message;
            })

            // Toggle Global Service
            .addCase(toggleGlobalService.pending, (state) => {
                state.loading.toggleGlobal = true;
                state.error.toggleGlobal = null;
            })
            .addCase(toggleGlobalService.fulfilled, (state, action) => {
                state.loading.toggleGlobal = false;
                // Update the global service status in state
                const { serviceId } = action.meta.arg;
                state.globalServiceStatus[serviceId] = action.payload;
            })
            .addCase(toggleGlobalService.rejected, (state, action) => {
                state.loading.toggleGlobal = false;
                state.error.toggleGlobal = action.error.message;
            })

            // Fetch Department By Name
            .addCase(fetchDepartmentByName.pending, (state) => {
                state.loading.departmentByName = true;
                state.error.departmentByName = null;
            })
            .addCase(fetchDepartmentByName.fulfilled, (state, action) => {
                console.log("Department lookup fulfilled with data:", action.payload);
                state.loading.departmentByName = false;
                state.selectedDepartment = action.payload;
            })
            .addCase(fetchDepartmentByName.rejected, (state, action) => {
                console.error("Department lookup rejected with error:", action.error);
                state.loading.departmentByName = false;
                state.error.departmentByName = action.error.message;
            });
    },
});

export const { setSelectedService } = securitySlice.actions;

export default securitySlice.reducer;

// Selectors
export const selectServices = (state) => state.security.services;
export const selectServicesLoading = (state) => state.security.loading.services;
export const selectVmServiceStatus = (state, serviceId) => state.security.vmServiceStatus[serviceId] || [];
export const selectDepartmentServiceStatus = (state, serviceId) => state.security.departmentServiceStatus[serviceId];
export const selectDepartmentVmsServiceStatus = (state, serviceId) => {
    debug.log("selectors", "Selecting department VMs for serviceId:", serviceId);
    debug.log("selectors", "Available VM statuses:", state.security.departmentVmsServiceStatus);
    const result = state.security.departmentVmsServiceStatus[serviceId] || [];
    debug.log("selectors", "Result:", result);
    return result;
};
export const selectGlobalServiceStatus = (state, serviceId) => state.security.globalServiceStatus[serviceId];
export const selectServiceStatusSummary = (state) => state.security.serviceStatusSummary;
export const selectSelectedDepartment = (state) => {
    debug.log("selectors", "Selected department in state:", state.security.selectedDepartment);
    return state.security.selectedDepartment;
};
export const selectServiceLoading = (state) => ({
    services: state.security.loading.services,
    vmService: state.security.loading.vmService,
    departmentService: state.security.loading.departmentService,
    departmentVmsService: state.security.loading.departmentVmsService,
    globalService: state.security.loading.globalService,
    statusSummary: state.security.loading.statusSummary,
    toggleVm: state.security.loading.toggleVm,
    toggleDepartment: state.security.loading.toggleDepartment,
    toggleGlobal: state.security.loading.toggleGlobal,
    departmentByName: state.security.loading.departmentByName,
});
export const selectServiceError = (state) => ({
    services: state.security.error.services,
    vmService: state.security.error.vmService,
    departmentService: state.security.error.departmentService,
    departmentVmsService: state.security.error.departmentVmsService,
    globalService: state.security.error.globalService,
    statusSummary: state.security.error.statusSummary,
    toggleVm: state.security.error.toggleVm,
    toggleDepartment: state.security.error.toggleDepartment,
    toggleGlobal: state.security.error.toggleGlobal,
    departmentByName: state.security.error.departmentByName,
});
