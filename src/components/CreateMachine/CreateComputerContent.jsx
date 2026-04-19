'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDepartmentByName } from '@/state/slices/departments';
import CreateMachineWizard from './CreateMachineWizard';
import { Card, Spinner } from '@infinibay/harbor';

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
      <div className="container mx-auto p-6 relative z-30 flex items-center justify-center min-h-[400px]">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative z-30">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 max-w-7xl mx-auto">
        <div className="w-full space-y-6">
          <Card variant="glass" spotlight={false} glow={false} className="p-6">
            <h1 className="text-2xl font-bold text-fg">Create New Machine</h1>
            <p className="text-sm text-fg-muted mt-1">
              Follow the steps below to provision and configure your virtual machine.
            </p>
          </Card>
          <CreateMachineWizard departmentId={departmentId} />
        </div>
      </div>
    </div>
  );
}
