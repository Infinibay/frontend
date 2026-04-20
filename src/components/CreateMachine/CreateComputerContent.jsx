'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, LoadingOverlay, Page } from '@infinibay/harbor';
import { fetchDepartmentByName } from '@/state/slices/departments';
import CreateMachineWizard from './CreateMachineWizard';

export default function CreateComputerContent({ departmentSlug = null }) {
  const dispatch = useDispatch();
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(!!departmentSlug);

  useEffect(() => {
    if (departmentSlug) {
      const getDepartment = async () => {
        try {
          const result = await dispatch(fetchDepartmentByName(departmentSlug)).unwrap();
          setDepartmentId(result?.id ?? null);
        } catch (error) {
          console.error('Failed to fetch department:', error);
        } finally {
          setLoading(false);
        }
      };
      getDepartment();
    }
  }, [dispatch, departmentSlug]);

  if (loading) {
    return (
      <Page>
        <LoadingOverlay label="Loading department…" size={32} />
      </Page>
    );
  }

  return (
    <Page>
      <Card
        variant="glass"
        spotlight={false}
        glow={false}
        title="Create New Machine"
        description="Follow the steps below to provision and configure your virtual machine."
      />
      <CreateMachineWizard departmentId={departmentId} />
    </Page>
  );
}
