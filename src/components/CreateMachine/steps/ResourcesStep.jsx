'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { MACHINE_TEMPLATES_QUERY } from '@/graphql/queries';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ResourcesStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const { data, loading, error } = useQuery(MACHINE_TEMPLATES_QUERY);
  const templates = data?.machineTemplates || [];

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error loading templates</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Resources</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template that best fits your needs.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Label
            moreInformation="Templates are predefined configurations of CPU cores, RAM, and storage. Choose a template that matches your workload requirements. You can monitor and adjust resources later if needed."
          >
            Select a Template
          </Label>
          <RadioGroup
            value={stepValues.templateId}
            onValueChange={(value) => setValue(`${id}.templateId`, value)}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {templates.map((template) => (
              <Label
                key={template.id}
                className={`relative flex cursor-pointer rounded-lg border p-4 hover:border-primary ${
                  stepValues.templateId === template.id ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem
                  value={template.id}
                  id={template.id}
                  className="sr-only"
                />
                <div className="space-y-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{template.cores}</span> Cores
                    </div>
                    <div>
                      <span className="font-medium">{template.ram}</span> GB RAM
                    </div>
                    <div>
                      <span className="font-medium">{template.storage}</span> GB Storage
                    </div>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
          {getError('templateId') && (
            <p className="text-sm text-red-500">{getError('templateId')}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
