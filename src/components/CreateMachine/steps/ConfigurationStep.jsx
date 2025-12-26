'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { Badge } from '@/components/ui/badge';
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { AlertCircle, Upload } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SimpleIllustration } from '@/components/ui/undraw-illustration';
import { CloudDownload } from 'lucide-react';

const osOptions = [
  {
    id: 'WINDOWS10',
    name: 'Windows 10',
    icon: FaWindows,
    color: '#00A4EF',
    description: 'Microsoft Windows 10 operating system',
  },
  {
    id: 'WINDOWS11',
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


export function ConfigurationStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const router = useRouter();

  // Check ISO availability - checkOnMount: true handles the initial check
  const {
    isOSAvailable,
    loading,
    isReady
  } = useSystemStatus({ checkOnMount: true });

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
              const available = isOSAvailable(os.id);
              const isDisabled = !available;

              return (
                <Card
                  key={os.id}
                  glass="subtle"
                  className={cn(
                    'relative transition-all duration-300',
                    "glass-subtle border border-border/20",
                    !isDisabled && 'cursor-pointer hover:scale-105 hover:z-10',
                    isDisabled && 'opacity-60 cursor-not-allowed',
                    stepValues.os === os.id && !isDisabled && 'ring-2 ring-primary border-primary bg-primary/20 scale-[1.02]',
                    !isDisabled && stepValues.os !== os.id && 'hover:border-primary/50'
                  )}
                  onClick={() => !isDisabled && setValue(`${id}.os`, os.id)}
                >
                  <div className="p-6">
                    {/* Selection checkmark */}
                    {stepValues.os === os.id && !isDisabled && (
                      <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center z-10">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* ISO status badge */}
                    {!available && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          ISO Required
                        </Badge>
                      </div>
                    )}

                    <div className="aspect-square flex items-center justify-center mb-4">
                      <Icon
                        className={cn(
                          "w-20 h-20 transition-transform duration-300",
                          !isDisabled && "group-hover:scale-110"
                        )}
                        style={{ color: isDisabled ? '#6b7280' : os.color }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-1">{os.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isDisabled ? 'ISO not available' : os.description}
                      </p>
                      {isDisabled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/settings?tab=iso');
                          }}
                          className="mt-2 text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Upload className="h-3 w-3" />
                          Upload ISO
                        </button>
                      )}
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
      </div>

      {/* Informational message if some ISOs are missing */}
      {!loading && osOptions.some(os => !isOSAvailable(os.id)) && (
        <div className={cn("relative p-4 rounded-lg overflow-visible", "glass-subtle border border-border/20", "bg-blue-500/10 border-blue-500/20")}>
          <div className="space-y-2 pr-40">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              What does "ISO Required" mean?
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              An ISO file is a disc image that contains the installation files for an operating system.
              To create a virtual machine with an operating system marked as "ISO Required", you need to upload the corresponding ISO file first.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-slate-100">How to fix this:</span> Click on "Upload ISO" under the operating system you want to use,
              or go to <button
                onClick={() => router.push('/settings?tab=iso')}
                className="underline hover:no-underline font-medium text-blue-700 dark:text-blue-400"
              >
                Settings → ISO Management
              </button> to upload multiple ISO files at once. Once uploaded, the operating system will become available for selection.
            </p>
          </div>
          {/* Illustration emerging from the right side, bottom aligned with text */}
          <div className="absolute -right-8 bottom-0">
            <SimpleIllustration
              icon={CloudDownload}
              size="large"
              opacity={15}
              className="w-60 h-60"
            />
          </div>
        </div>
      )}

      {/* Warning message if no ISOs available */}
      {!loading && !isReady && (
        <div className={cn("p-4 rounded-lg", "glass-subtle border border-border/20", "bg-yellow-500/10 border-yellow-500/20")}>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                No ISOs Available
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                You need to upload at least one ISO image to create virtual machines.
                <button
                  onClick={() => router.push('/settings?tab=iso')}
                  className="ml-1 underline hover:no-underline"
                >
                  Go to Settings
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
