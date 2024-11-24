'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { Badge } from '@/components/ui/badge';
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';

const osOptions = [
  {
    id: 'WINDOWS_10',
    name: 'Windows 10',
    icon: FaWindows,
    color: '#00A4EF',
    description: 'Microsoft Windows 10 operating system',
  },
  {
    id: 'WINDOWS_11',
    name: 'Windows 11',
    icon: FaWindows,
    color: '#00A4EF',
    description: 'Latest version of Microsoft Windows',
  },
  {
    id: 'UBUNTU',
    name: 'Ubuntu',
    icon: FaUbuntu,
    color: '#E95420',
    description: 'Popular Linux distribution known for its ease of use',
  },
  {
    id: 'FEDORA',
    name: 'Fedora',
    icon: SiFedora,
    color: '#294172',
    description: 'Advanced Linux distribution with latest features',
  },
];

const features = [
  {
    id: 'backup',
    name: 'Backup',
    description: 'Automatic daily backups of your machine',
    status: 'mock',
  },
  {
    id: 'gpu',
    name: 'GPU Support',
    description: 'Enable GPU acceleration for better performance',
    status: 'mock',
  },
];

export function ConfigurationStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Choose your operating system and additional features.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            moreInformation="The operating system determines which software and features will be available on your machine. Choose based on your requirements and familiarity."
          >
            Operating System
          </Label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {osOptions.map((os) => {
              const Icon = os.icon;
              return (
                <Card
                  key={os.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-10 ${
                    stepValues.os === os.id
                      ? 'shadow-lg shadow-primary/25 bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setValue(`${id}.os`, os.id)}
                >
                  <div className="p-6">
                    <div className="aspect-square flex items-center justify-center mb-4">
                      <Icon 
                        className="w-20 h-20 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: os.color }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-1">{os.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {os.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {getError('os') && (
            <p className="mt-2 text-sm text-red-500">{getError('os')}</p>
          )}
        </div>

        <div className="mt-8">
          <Label
            moreInformation="Additional features may affect the performance and cost of your machine. Enable only the features you need."
          >
            Additional Features
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`p-4 cursor-pointer transition-all hover:border-primary ${
                  stepValues[feature.id]
                    ? 'border-2 border-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
                onClick={() =>
                  setValue(`${id}.${feature.id}`, !stepValues[feature.id])
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  {feature.status === 'mock' && (
                    <Badge variant="secondary">Mock</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
