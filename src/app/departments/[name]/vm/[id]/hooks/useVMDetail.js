import { useState, useEffect } from 'react';
import { useVmDetailedInfoQuery } from '@/gql/hooks';
import { useDispatch } from 'react-redux';

const useVMDetail = (vmId) => {
  const [vm, setVm] = useState(null);
  const dispatch = useDispatch();

  // Fetch VM details using GraphQL query
  const { data, loading, error, refetch } = useVmDetailedInfoQuery({
    variables: { id: vmId },
    skip: !vmId,
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000, // Poll every 10 seconds to get status updates
  });

  useEffect(() => {
    if (data?.machine) {
      setVm(data.machine);
    }
  }, [data]);

  // Refetch function with loading state
  const handleRefetch = async () => {
    try {
      const result = await refetch();
      if (result.data?.machine) {
        setVm(result.data.machine);
      }
      return result;
    } catch (err) {
      console.error('Error refetching VM details:', err);
      throw err;
    }
  };

  return {
    vm,
    loading,
    error,
    refetch: handleRefetch,
  };
};

export default useVMDetail;