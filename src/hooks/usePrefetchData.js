import { useQuery } from '@apollo/client';
import { USERS_QUERY, MACHINE_TEMPLATES_QUERY, MACHINES_QUERY } from '../graphql/queries';

export function usePrefetchData() {
  const { loading: usersLoading, error: usersError } = useQuery(USERS_QUERY);
  const { loading: templatesLoading, error: templatesError } = useQuery(MACHINE_TEMPLATES_QUERY);
  const { loading: machinesLoading, error: machinesError } = useQuery(MACHINES_QUERY);

  const isLoading = usersLoading || templatesLoading || machinesLoading;
  const errors = [usersError, templatesError, machinesError].filter(Boolean);

  return { isLoading, errors };
}
