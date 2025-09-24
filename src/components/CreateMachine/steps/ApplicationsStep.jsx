'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { AppStoreInstaller } from '@/components/ui/app-store-installer';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ApplicationsStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const applications = useSelector((state) => state.applications.items) || [];
  const loading = useSelector((state) => state.applications.loading.fetch);
  const error = useSelector((state) => state.applications.error.fetch);

  const selectedAppIds = stepValues.applications || [];

  const allApps = applications.map(app => ({
    id: app.id,
    name: app.name,
    description: app.description || `Add ${app.name} to your machine`,
    icon: app.icon || null,
    iconType: app.iconType || (app.icon && app.icon.startsWith('<svg') ? 'svg' : 'image'),
    fallbackIcon: 'https://cdn.simpleicons.org/package'
  }));

  const handleSelectionChange = async (appId, isSelected) => {
    const currentApps = stepValues.applications || [];
    if (isSelected) {
      if (!currentApps.includes(appId)) {
        setValue(`${id}.applications`, [...currentApps, appId]);
      }
    } else {
      setValue(`${id}.applications`, currentApps.filter(id => id !== appId));
    }
  };

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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-muted-foreground">Loading applications...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-red-500">Error loading applications: {error.message}</div>
            </div>
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
