'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingOverlay, Page } from '@infinibay/harbor';
import { fetchDepartmentByName } from '@/state/slices/departments';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageHeader } from '@/components/common/PageHeader';
import { toast } from '@/hooks/use-toast';
import { createDebugger } from '@/utils/debug';
import CreateMachineWizard from './CreateMachineWizard';

const debug = createDebugger('frontend:components:create-computer-content');

export default function CreateComputerContent({ departmentSlug = null }) {
  const dispatch = useDispatch();
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(!!departmentSlug);

  // title omitted here — the in-page <PageHeader> below renders the <h1>;
  // setting title here too would emit a duplicate heading in GlobalHeader.
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Desktops', href: '/desktops' },
        { label: 'New', isCurrent: true },
      ],
      actions: [],
    },
    [],
  );

  useEffect(() => {
    if (departmentSlug) {
      const getDepartment = async () => {
        try {
          const result = await dispatch(fetchDepartmentByName(departmentSlug)).unwrap();
          setDepartmentId(result?.id ?? null);
        } catch (error) {
          debug.warn('lookup', 'Failed to fetch department by slug:', {
            departmentSlug,
            error: typeof error === 'string' ? error : error?.message,
          });
          // Make the silent fallback explicit: the department Select stays
          // enabled/unset so the user can pick one instead of quietly getting
          // the first department in the list.
          toast({
            variant: 'warning',
            title: 'Department not found',
            description: `Couldn't load the department "${departmentSlug}". Please pick one below.`,
          });
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
      <PageHeader
        title="New Desktop"
        description="Follow the steps below to provision and configure the desktop."
      />
      <CreateMachineWizard departmentId={departmentId} />
    </Page>
  );
}
