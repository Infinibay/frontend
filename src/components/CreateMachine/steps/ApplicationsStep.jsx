'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import AppInstaller from '@/components/ui/app-installer';
import { Label } from '@/components/ui/label';

const APP_ICON = 'https://cdn.simpleicons.org/2k';

export function ApplicationsStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  
  const applications = useSelector((state) => state.applications.items);
  const loading = useSelector((state) => state.applications.loading.fetch);
  const error = useSelector((state) => state.applications.error.fetch);

  const availableApps = applications.map(app => ({
    id: app.id,
    name: app.name,
    description: app.description || `Install ${app.name} on your machine`,
    icon: APP_ICON
  }));

  const installedApps = [];

  const handleInstall = async (app) => {
    const currentApps = stepValues.applications || [];
    setValue(`${id}.applications`, [...currentApps, app.id]);
  };

  const handleUninstall = async (app) => {
    const currentApps = stepValues.applications || [];
    setValue(`${id}.applications`, currentApps.filter(id => id !== app.id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Applications</h2>
        <p className="text-sm text-muted-foreground">
          Choose the applications you want to install on your machine.
        </p>
      </div>

      <div>
        <Label
          moreInformation="Applications will be automatically installed during machine creation. You can drag applications from the available list to the installed list. Additional applications can be installed later through the machine's management interface."
        >
          Applications to Install
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
          <AppInstaller
            apps={{
              available: availableApps,
              installed: installedApps
            }}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
            size="md"
            className="min-h-[400px]"
          />
        )}
      </div>

      {getError('applications') && (
        <p className="mt-2 text-sm text-red-500">{getError('applications')}</p>
      )}
    </div>
  );
}
