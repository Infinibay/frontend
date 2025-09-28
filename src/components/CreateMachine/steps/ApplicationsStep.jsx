'use client';

import React from 'react';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { AppStoreInstaller } from '@/components/ui/app-store-installer';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchApplications } from '@/state/slices/applications';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:applications-step');

export function ApplicationsStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  // Use optimized data loading for applications
  const {
    data: applications,
    isLoading: loading,
    error,
    hasData
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000, // 5 minutes
  });

  const selectedAppIds = stepValues.applications || [];

  debug.info('ApplicationsStep state:', {
    applicationsCount: applications?.length || 0,
    selectedCount: selectedAppIds.length,
    loading,
    hasError: !!error,
    hasData
  });

  const allApps = (applications || []).map(app => ({
    id: app.id,
    name: app.name,
    description: app.description || `Add ${app.name} to your machine`,
    icon: app.icon || null,
    iconType: app.iconType || (app.icon && app.icon.startsWith('<svg') ? 'svg' : 'image'),
    fallbackIcon: 'https://cdn.simpleicons.org/package'
  }));

  const handleSelectionChange = async (appId, isSelected) => {
    debug.info('Application selection changed:', { appId, isSelected });
    const currentApps = stepValues.applications || [];
    if (isSelected) {
      if (!currentApps.includes(appId)) {
        setValue(`${id}.applications`, [...currentApps, appId]);
      }
    } else {
      setValue(`${id}.applications`, currentApps.filter(id => id !== appId));
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="min-h-[400px] mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px] mt-4">
      <div className="text-center space-y-2">
        <div className="text-red-500">Error loading applications</div>
        <div className="text-sm text-muted-foreground">
          {error?.message || 'Failed to load available applications'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Applications</h2>
        <p className="text-sm text-muted-foreground">
          Choose the applications you want to add to your machine.
        </p>
      </div>

        <Card glass="subtle" className="p-6">
          <Label
            moreInformation="Applications will be automatically added to the installation list during machine creation. You can browse and select applications from the App Store interface. Additional applications can be added later through the machine's management interface."
          >
            Applications to Add
          </Label>
          {loading ? (
            renderLoadingSkeleton()
          ) : error ? (
            renderErrorState()
          ) : (
            <AppStoreInstaller
              apps={allApps}
              selectedAppIds={selectedAppIds}
              onSelectionChange={handleSelectionChange}
              size="md"
              className="min-h-[400px] mt-4"
            />
          )}
        </Card>

      {getError('applications') && (
        <p className="mt-2 text-sm text-red-500">{getError('applications')}</p>
      )}
    </div>
  );
}
