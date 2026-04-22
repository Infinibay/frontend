'use client';

import { useRouter } from 'next/navigation';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  IconTile,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
} from '@infinibay/harbor';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { AlertCircle, AlertTriangle, CloudDownload, Upload } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';

const osOptions = [
  {
    id: 'WINDOWS10',
    name: 'Windows 10',
    icon: FaWindows,
    tone: 'sky',
    description: 'Microsoft Windows 10 operating system',
  },
  {
    id: 'WINDOWS11',
    name: 'Windows 11',
    icon: FaWindows,
    tone: 'sky',
    description: 'Latest version of Microsoft Windows',
  },
  {
    id: 'UBUNTU',
    name: 'Ubuntu',
    icon: FaUbuntu,
    tone: 'amber',
    description: 'Popular Linux distribution known for its ease of use',
  },
  {
    id: 'FEDORA',
    name: 'Fedora',
    icon: SiFedora,
    tone: 'purple',
    description: 'Advanced Linux distribution with latest features',
  },
];

export function ConfigurationStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const router = useRouter();

  const { isOSAvailable, loading, isReady } = useSystemStatus({ checkOnMount: true });

  return (
    <Page size="lg">
        <FormField
          label="Operating System"
          helper="Choose based on your requirements and familiarity."
          error={getError('os')}
        >
          <ResponsiveGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
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
                  selected={isSelected}
                  disabled={isDisabled}
                  fullHeight
                  onClick={() => !isDisabled && setValue(`${id}.os`, os.id)}
                  footer={
                    <ResponsiveStack direction="col" gap={1} align="center">
                      {!available ? (
                        <Badge tone="danger" icon={<AlertCircle size={12} />}>
                          ISO Required
                        </Badge>
                      ) : null}
                      {isDisabled && (
                        <Button
                          variant="link"
                          size="sm"
                          icon={<Upload size={12} />}
                          reactive={false}
                          ripple={false}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/settings?tab=iso');
                          }}
                        >
                          Upload ISO
                        </Button>
                      )}
                    </ResponsiveStack>
                  }
                >
                  <ResponsiveStack direction="col" gap={3} align="center">
                    <IconTile icon={<Icon size={40} />} tone={os.tone} size="lg" />
                    <ResponsiveStack direction="col" gap={1} align="center">
                      <span>{os.name}</span>
                      <span>{isDisabled ? 'ISO not available' : os.description}</span>
                    </ResponsiveStack>
                  </ResponsiveStack>
                </Card>
              );
            })}
          </ResponsiveGrid>
        </FormField>

        {!loading && osOptions.some((os) => !isOSAvailable(os.id)) && (
          <Alert
            tone="info"
            icon={<CloudDownload size={14} />}
            title='"ISO Required" means no disc image has been uploaded for that OS yet.'
            actions={
              <Button
                variant="link"
                size="sm"
                reactive={false}
                ripple={false}
                onClick={() => router.push('/settings?tab=iso')}
              >
                Manage ISOs
              </Button>
            }
          />
        )}

        {!loading && !isReady && (
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title="No ISOs Available"
            actions={
              <Button
                variant="link"
                size="sm"
                reactive={false}
                ripple={false}
                onClick={() => router.push('/settings?tab=iso')}
              >
                Go to Settings
              </Button>
            }
          >
            You need to upload at least one ISO image to create virtual machines.
          </Alert>
        )}

        {loading && (
          <EmptyState variant="inline" title="Checking ISO availability…" />
        )}
    </Page>
  );
}
