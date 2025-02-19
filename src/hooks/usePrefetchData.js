import { useQuery } from '@apollo/client';

import {
  UsersDocument,
  MachineTemplatesDocument,
  MachinesDocument,
  MachineTemplateCategoriesDocument
} from '@/gql/hooks'

export function usePrefetchData() {
  const { loading: usersLoading, error: usersError } = useQuery(UsersDocument);
  const { loading: templatesLoading, error: templatesError } = useQuery(MachineTemplatesDocument);
  const { loading: machinesLoading, error: machinesError } = useQuery(MachinesDocument);
  const { loading: templateCategoriesLoading, error: templateCategoriesError } = useQuery(MachineTemplateCategoriesDocument);

  const isLoading = usersLoading || templatesLoading || machinesLoading || templateCategoriesLoading;
  const errors = [usersError, templatesError, machinesError, templateCategoriesError].filter(Boolean);

  return { isLoading, errors };
}
