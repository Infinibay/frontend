import { useQuery } from '@apollo/client';
import { 
  USERS_QUERY, 
  MACHINE_TEMPLATES_QUERY, 
  MACHINES_QUERY,
  MACHINE_TEMPLATE_CATEGORIES_QUERY 
} from '../graphql/queries';

export function usePrefetchData() {
  const { loading: usersLoading, error: usersError } = useQuery(USERS_QUERY);
  const { loading: templatesLoading, error: templatesError } = useQuery(MACHINE_TEMPLATES_QUERY);
  const { loading: machinesLoading, error: machinesError } = useQuery(MACHINES_QUERY);
  const { loading: templateCategoriesLoading, error: templateCategoriesError } = useQuery(MACHINE_TEMPLATE_CATEGORIES_QUERY);

  const isLoading = usersLoading || templatesLoading || machinesLoading || templateCategoriesLoading;
  const errors = [usersError, templatesError, machinesError, templateCategoriesError].filter(Boolean);

  return { isLoading, errors };
}
