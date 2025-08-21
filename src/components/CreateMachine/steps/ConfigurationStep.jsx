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
import { LottieAnimation } from '@/components/ui/lottie-animation';

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
                  className={cn(
                    'relative transition-all duration-300',
                    !isDisabled && 'cursor-pointer hover:scale-105 hover:shadow-xl hover:z-10',
                    isDisabled && 'opacity-60 cursor-not-allowed',
                    stepValues.os === os.id && !isDisabled && 'shadow-lg shadow-primary/25 bg-primary/5',
                    !isDisabled && 'hover:border-primary/50'
                  )}
                  onClick={() => !isDisabled && setValue(`${id}.os`, os.id)}
                >
                  <div className="p-6">
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
        <div className="relative p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-visible">
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
          {/* Animation emerging from the right side, bottom aligned with text */}
          <div className="absolute -right-8 bottom-0">
            <LottieAnimation
              animationPath="/lottie/man-downloading-from-cloud.json"
              className="w-60 h-60"
              loop={true}
              autoplay={true}
              speed={0.8}
              ariaLabel="Download animation"
            />
          </div>
        </div>
      )}

      {/* Warning message if no ISOs available */}
      {!loading && !isReady && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
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
