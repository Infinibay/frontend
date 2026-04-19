'use client';

import React from 'react';
import { Badge, Card } from '@infinibay/harbor';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { AlertCircle, Check, CloudDownload, Upload } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SimpleIllustration } from '@/components/ui/undraw-illustration';

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

export function ConfigurationStep({ id, className }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const router = useRouter();

  // Check ISO availability
  const { isOSAvailable, loading, isReady } = useSystemStatus({ checkOnMount: true });

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <label className="text-sm font-medium text-fg">Operating System</label>
        <p className="text-xs text-fg-muted mt-0.5">
          Choose based on your requirements and familiarity.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {osOptions.map((os) => {
            const Icon = os.icon;
            const available = isOSAvailable(os.id);
            const isDisabled = !available;
            const isSelected = stepValues.os === os.id && !isDisabled;

            return (
              <Card
                key={os.id}
                variant="default"
                spotlight={false}
                glow={false}
                interactive={!isDisabled}
                className={cn(
                  'relative p-0 transition-all duration-300',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                  isSelected && 'ring-2 ring-accent border-accent/60 bg-accent/10',
                  !isDisabled && !isSelected && 'hover:border-accent/40'
                )}
                onClick={() => !isDisabled && setValue(`${id}.os`, os.id)}
              >
                <div className="p-6">
                  {isSelected && (
                    <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center z-10 shadow-harbor-sm">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                  )}

                  {!available && (
                    <div className="absolute top-2 right-2">
                      <Badge tone="danger" icon={<AlertCircle className="h-3 w-3" />}>
                        ISO Required
                      </Badge>
                    </div>
                  )}

                  <div className="aspect-square flex items-center justify-center mb-4">
                    <Icon
                      className="w-20 h-20 transition-transform duration-300"
                      style={{ color: isDisabled ? 'rgb(var(--harbor-text-subtle))' : os.color }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-fg mb-1">{os.name}</h3>
                    <p className="text-sm text-fg-muted">
                      {isDisabled ? 'ISO not available' : os.description}
                    </p>
                    {isDisabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/settings?tab=iso');
                        }}
                        className="mt-2 text-xs text-accent hover:underline inline-flex items-center gap-1"
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
          <p className="mt-2 text-sm text-danger">{getError('os')}</p>
        )}
      </div>

      {/* Some ISOs missing info */}
      {!loading && osOptions.some(os => !isOSAvailable(os.id)) && (
        <Card variant="default" spotlight={false} glow={false} className="relative overflow-visible border-info/25 bg-info/10">
          <div className="space-y-2 pr-40">
            <h4 className="font-medium text-fg">
              What does &quot;ISO Required&quot; mean?
            </h4>
            <p className="text-sm text-fg-muted">
              An ISO file is a disc image that contains the installation files for an operating system.
              To create a virtual machine with an operating system marked as &quot;ISO Required&quot;, you need to upload the corresponding ISO file first.
            </p>
            <p className="text-sm text-fg-muted">
              <span className="font-medium text-fg">How to fix this:</span> Click on &quot;Upload ISO&quot; under the operating system you want to use,
              or go to{' '}
              <button
                onClick={() => router.push('/settings?tab=iso')}
                className="underline hover:no-underline font-medium text-accent-2"
              >
                Settings → ISO Management
              </button>{' '}
              to upload multiple ISO files at once. Once uploaded, the operating system will become available for selection.
            </p>
          </div>
          <div className="absolute -right-8 bottom-0 pointer-events-none">
            <SimpleIllustration
              icon={CloudDownload}
              size="large"
              opacity={15}
              className="w-60 h-60"
            />
          </div>
        </Card>
      )}

      {/* No ISOs warning */}
      {!loading && !isReady && (
        <Card variant="default" spotlight={false} glow={false} className="border-warning/30 bg-warning/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-fg">No ISOs Available</h4>
              <p className="text-sm text-fg-muted mt-1">
                You need to upload at least one ISO image to create virtual machines.
                <button
                  onClick={() => router.push('/settings?tab=iso')}
                  className="ml-1 underline hover:no-underline text-accent-2"
                >
                  Go to Settings
                </button>
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
