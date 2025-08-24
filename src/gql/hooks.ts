// Auto-generated hooks file
import { gql, useQuery, useMutation } from '@apollo/client';
import type { QueryHookOptions, MutationHookOptions } from '@apollo/client';

// VM Detail Query
const VM_DETAILED_INFO_QUERY = gql`
  query vmDetailedInfo($id: String!) {
    machine(id: $id) {
      id
      name
      status
      userId
      templateId
      createdAt
      configuration
      department {
        id
        name
      }
      template {
        id
        name
        description
        cores
        ram
        storage
      }
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// List Processes Query
const LIST_PROCESSES_QUERY = gql`
  query listProcesses($machineId: String!, $limit: Int) {
    listProcesses(machineId: $machineId, limit: $limit) {
      pid
      name
      cpuUsage
      memoryUsage
      status
      user
      command
    }
  }
`;

// Power Operations Mutations
const POWER_ON_MUTATION = gql`
  mutation PowerOn($id: String!) {
    PowerOn(id: $id) {
      success
      message
    }
  }
`;

const POWER_OFF_MUTATION = gql`
  mutation PowerOff($id: String!) {
    PowerOff(id: $id) {
      success
      message
    }
  }
`;

const SUSPEND_MUTATION = gql`
  mutation Suspend($id: String!) {
    Suspend(id: $id) {
      success
      message
    }
  }
`;

// Export hooks
export const useVmDetailedInfoQuery = (options?: QueryHookOptions<any, any>) => {
  return useQuery(VM_DETAILED_INFO_QUERY, options);
};

export const useListProcessesQuery = (options?: QueryHookOptions<any, any>) => {
  return useQuery(LIST_PROCESSES_QUERY, options);
};

export const usePowerOnMutation = (options?: MutationHookOptions<any, any>) => {
  return useMutation(POWER_ON_MUTATION, options);
};

export const usePowerOffMutation = (options?: MutationHookOptions<any, any>) => {
  return useMutation(POWER_OFF_MUTATION, options);
};

export const useSuspendMutation = (options?: MutationHookOptions<any, any>) => {
  return useMutation(SUSPEND_MUTATION, options);
};

// Re-export metrics hooks
export { 
  useLatestSystemMetricsQuery,
  useMachineMetricsSummaryQuery,
  useTopProcessesByMachineQuery 
} from './hooks/useMetricsQueries';