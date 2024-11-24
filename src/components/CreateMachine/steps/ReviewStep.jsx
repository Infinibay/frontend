'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { useWizardContext } from '@/components/ui/wizard';
import { MACHINE_TEMPLATES_QUERY } from '@/graphql/queries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Package } from 'lucide-react';
import { useSelector } from 'react-redux';

const operatingSystems = {
  ubuntu20: 'Ubuntu 20.04 LTS',
  ubuntu22: 'Ubuntu 22.04 LTS',
  windows10: 'Windows 10 Pro',
  windows11: 'Windows 11 Pro',
};

export function ReviewStep({ id }) {
  const { values } = useWizardContext();
  const { data } = useQuery(MACHINE_TEMPLATES_QUERY);
  const templates = data?.machineTemplates || [];
  const applications = useSelector((state) => state.applications.items);

  const selectedTemplate = templates.find(t => t.id === values.resources?.templateId);
  const selectedApps = values.applications?.applications || [];
  const selectedAppDetails = applications.filter(app => selectedApps.includes(app.id));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Review Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Review your machine configuration before creation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Basic Information</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="text-sm font-medium">{values.basicInfo?.name}</dd>
              </div>
              {values.basicInfo?.description && (
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Description</dt>
                  <dd className="text-sm font-medium">{values.basicInfo.description}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="font-medium mb-2">Resources</h3>
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-muted-foreground">Selected Template</dt>
                  <dd className="text-sm font-medium">{selectedTemplate.name}</dd>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                  <div className="text-sm text-muted-foreground">
                    This template allocates the following resources:
                  </div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between border-b pb-2 border-primary/10">
                      <dt className="text-sm text-muted-foreground flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6c0 2-1 3-3 3s-3-1-3-3 1-3 3-3 3 1 3 3Z"/>
                          <path d="M6 12c0 2-1 3-3 3s-3-1-3-3 1-3 3-3 3 1 3 3Z"/>
                          <path d="M18 18c0 2-1 3-3 3s-3-1-3-3 1-3 3-3 3 1 3 3Z"/>
                          <path d="M8.59 13.51l6.82 3.98"/>
                          <path d="M15.41 6.51l-6.82 3.98"/>
                        </svg>
                        CPU Cores
                      </dt>
                      <dd className="text-sm font-medium">{selectedTemplate.cores} Cores</dd>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2 border-primary/10">
                      <dt className="text-sm text-muted-foreground flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                        Memory
                      </dt>
                      <dd className="text-sm font-medium">{selectedTemplate.ram} GB RAM</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5z"/>
                          <path d="M9 5v14"/>
                          <path d="M15 5v14"/>
                          <path d="M5 9h14"/>
                          <path d="M5 15h14"/>
                        </svg>
                        Storage
                      </dt>
                      <dd className="text-sm font-medium">{selectedTemplate.storage} GB</dd>
                    </div>
                  </dl>
                </div>
                {selectedTemplate.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {selectedTemplate.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">System Configuration</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Operating System</dt>
                <dd className="text-sm font-medium">
                  {operatingSystems[values.configuration?.os]}
                </dd>
              </div>
            </dl>
          </div>

          {selectedAppDetails.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Applications to Install</h3>
              <div className="space-y-3">
                {selectedAppDetails.map((app) => (
                  <div key={app.id} className="flex items-start gap-3 bg-primary/5 rounded-lg p-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{app.name}</div>
                      {app.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {app.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Additional Features</h3>
            <div className="space-y-2">
              {values.configuration?.backup && (
                <Alert variant="default" className="border-primary/50 bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle>Backup Enabled</AlertTitle>
                  <AlertDescription>
                    Daily backups will be performed automatically
                  </AlertDescription>
                </Alert>
              )}
              
              {values.configuration?.highAvailability && (
                <Alert variant="default" className="border-primary/50 bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle>High Availability</AlertTitle>
                  <AlertDescription>
                    Automatic failover protection is enabled
                  </AlertDescription>
                </Alert>
              )}

              {values.configuration?.gpuEnabled && (
                <Alert variant="default" className="border-primary/50 bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle>GPU Support</AlertTitle>
                  <AlertDescription>
                    GPU acceleration is enabled for this machine
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
