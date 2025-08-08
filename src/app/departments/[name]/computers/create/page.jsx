'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDepartmentByName } from '@/state/slices/departments';
import CreateMachineWizard from '@/components/CreateMachine/CreateMachineWizard';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

export default function CreateMachinePage({ params }) {
  const dispatch = useDispatch();
  const [departmentId, setDepartmentId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const getDepartment = async () => {
      try {
        const result = await dispatch(fetchDepartmentByName(params.name)).unwrap();
        setDepartmentId(result.id);
      } catch (error) {
        // Error will be handled by the Redux error state
      } finally {
        setLoading(false);
      }
    };

    getDepartment();
  }, [dispatch, params.name]);

  if (loading) {
    return <LoadingOverlay message="Loading department information..." />;
  }

  return <CreateMachineWizard departmentId={departmentId} />;
}
