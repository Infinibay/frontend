'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SelectionCard } from '@/components/ui/selection-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import {
  Globe,
  Monitor,
  FolderOpen,
  Mail,
  Database,
  Settings,
  Search,
  Wifi,
  Network,
  Server,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMON_SERVICES, PROTOCOLS } from '@/utils/firewallHelpers';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:service-step');

/**
 * ServiceStep - Second step of the firewall wizard
 *
 * Presents common services in user-friendly language with auto-configuration
 * of technical details. Users can select from predefined services or create
 * custom ones. Technical details are shown in tooltips, not as primary info.
 *
 * @param {string} context - Context type ('department' or 'vm') for customizing text
 */
export function ServiceStep({ id, context = 'department' }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const [searchQuery, setSearchQuery] = useState('');

  // Service categories with user-friendly descriptions
  const serviceCategories = [
    {
      key: 'web',
      title: 'Web Services',
      description: 'Allow web browsing and websites',
      icon: Globe,
      service: COMMON_SERVICES.web,
      defaultPorts: '80,443'
    },
    {
      key: 'ssh',
      title: 'Remote Access',
      description: 'Connect to computers remotely (SSH)',
      icon: Monitor,
      service: COMMON_SERVICES.ssh,
      defaultPorts: '22'
    },
    {
      key: 'rdp',
      title: 'Windows Remote Desktop',
      description: 'Connect to Windows computers remotely',
      icon: Monitor,
      service: COMMON_SERVICES.rdp,
      defaultPorts: '3389'
    },
    {
      key: 'ftp',
      title: 'File Sharing',
      description: 'Share files between computers (FTP/SFTP)',
      icon: FolderOpen,
      service: COMMON_SERVICES.ftp,
      defaultPorts: '21,22'
    },
    {
      key: 'email',
      title: 'Email Services',
      description: 'Send and receive emails',
      icon: Mail,
      service: COMMON_SERVICES.email,
      defaultPorts: '25,110,143,993,995'
    },
    {
      key: 'database',
      title: 'Database Access',
      description: 'Connect to databases',
      icon: Database,
      service: COMMON_SERVICES.database,
      defaultPorts: '3306,5432,1433,27017'
    },
    {
      key: 'dns',
      title: 'DNS Resolution',
      description: 'Allow domain name lookups',
      icon: Network,
      service: COMMON_SERVICES.dns,
      defaultPorts: '53'
    },
    {
      key: 'custom',
      title: 'Custom Service',
      description: 'I need something specific',
      icon: Settings,
      service: null,
      defaultPorts: ''
    }
  ];

  // Filter services based on search query
  const filteredServices = serviceCategories.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceSelect = (serviceKey) => {
    const service = serviceCategories.find(s => s.key === serviceKey);

    if (service) {
      debug.info('Service selected', {
        serviceKey,
        serviceName: service.title,
        defaultPorts: service.defaultPorts,
        context
      });

      setValue(`${id}.serviceType`, serviceKey);

      if (serviceKey === 'custom') {
        // Clear values for custom service
        debug.info('Custom service selected, clearing values');
        setValue(`${id}.protocol`, 'tcp');
        setValue(`${id}.ports`, '');
      } else {
        // Auto-configure service defaults
        debug.info('Auto-configuring service defaults', {
          protocol: 'tcp',
          ports: service.defaultPorts
        });
        setValue(`${id}.protocol`, 'tcp'); // Most services use TCP
        setValue(`${id}.ports`, service.defaultPorts);

        // Special handling for DNS which uses both TCP and UDP
        if (serviceKey === 'dns') {
          debug.info('DNS service detected, using TCP as default protocol');
          setValue(`${id}.protocol`, 'tcp'); // Start with TCP, user can change
        }
      }
    }
  };

  const protocolOptions = [
    {
      value: 'tcp',
      label: 'TCP',
      description: 'Most applications (web, email, databases)'
    },
    {
      value: 'udp',
      label: 'UDP',
      description: 'Streaming, gaming, DNS queries'
    },
    {
      value: 'icmp',
      label: 'ICMP',
      description: 'Network diagnostics (ping, traceroute)'
    }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-8">
      {/* Search bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold tracking-tight">
            What service do you need?
          </h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-2">Service Types:</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Web Services:</strong> HTTP (port 80) and HTTPS (port 443)</li>
                  <li><strong>Remote Access:</strong> SSH (port 22) and RDP (port 3389)</li>
                  <li><strong>File Sharing:</strong> FTP, SFTP, SMB protocols</li>
                  <li><strong>Custom:</strong> Specify your own ports and protocols</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Each service automatically configures the correct ports and protocols.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground">
          Choose from common services or create a custom rule
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const IconComponent = service.icon;
          const isSelected = stepValues.serviceType === service.key;

          return (
            <SelectionCard
              key={service.key}
              selected={isSelected}
              onSelect={() => handleServiceSelect(service.key)}
              selectionIndicator
              className="p-6 bg-background/50 border border-border/30"
            >
              <div className="space-y-4">
                <div className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center mx-auto",
                  isSelected ? "bg-primary/20" : "bg-muted"
                )}>
                  <IconComponent className={cn(
                    "h-6 w-6",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-base">
                    {service.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  {service.defaultPorts && (
                    <p className="text-xs text-muted-foreground">
                      Ports: {service.defaultPorts}
                    </p>
                  )}
                </div>
              </div>
            </SelectionCard>
          );
        })}
      </div>

      {/* Custom Service Configuration */}
      {stepValues.serviceType === 'custom' && (
        <Card
          className="p-6 bg-background/60 border border-border/40"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Custom Service Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Specify the technical details for your custom service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Protocol Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="protocol">Connection Type</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <ul className="space-y-1 text-sm">
                          <li><strong>TCP:</strong> Reliable connection for web apps, email, databases</li>
                          <li><strong>UDP:</strong> Fast connection for streaming, gaming, DNS</li>
                          <li><strong>ICMP:</strong> Network diagnostics like ping and traceroute</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={stepValues.protocol || 'tcp'}
                  onValueChange={(value) => setValue(`${id}.protocol`, value)}
                >
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    {protocolOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('protocol') && (
                  <p className="text-sm text-destructive">{getError('protocol')}</p>
                )}
              </div>

              {/* Port Configuration */}
              {stepValues.protocol !== 'icmp' && (
                <div className="space-y-2">
                  <Label htmlFor="ports">Port Number(s)</Label>
                  <Input
                    id="ports"
                    placeholder="e.g., 80 or 80,443 or 8000-8080"
                    value={stepValues.ports || ''}
                    onChange={(e) => setValue(`${id}.ports`, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Single port (80), multiple ports (80,443), or range (8000-8080)
                  </p>
                  {getError('ports') && (
                    <p className="text-sm text-destructive">{getError('ports')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Common port suggestions */}
            {stepValues.protocol !== 'icmp' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Common ports:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { port: '80', name: 'HTTP' },
                    { port: '443', name: 'HTTPS' },
                    { port: '22', name: 'SSH' },
                    { port: '21', name: 'FTP' },
                    { port: '25', name: 'SMTP' },
                    { port: '53', name: 'DNS' },
                    { port: '3389', name: 'RDP' }
                  ].map((suggestion) => (
                    <button
                      key={suggestion.port}
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                      onClick={() => setValue(`${id}.ports`, suggestion.port)}
                    >
                      {suggestion.port} ({suggestion.name})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Selected Service Summary */}
      {stepValues.serviceType && stepValues.serviceType !== 'custom' && (
        <Card
          className="p-4 bg-background/30 border border-border/20"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Selected service:{' '}
              <span className="font-semibold text-primary">
                {serviceCategories.find(s => s.key === stepValues.serviceType)?.title}
              </span>
              {stepValues.ports && (
                <>
                  {' '}using ports{' '}
                  <span className="font-mono text-primary">{stepValues.ports}</span>
                </>
              )}
            </p>
          </div>
        </Card>
      )}

      {stepValues.serviceType === 'custom' && stepValues.protocol && (
        <Card
          className="p-4 bg-background/30 border border-border/20"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Custom service using{' '}
              <span className="font-semibold text-primary">
                {stepValues.protocol.toUpperCase()}
              </span>
              {stepValues.ports && (
                <>
                  {' '}on ports{' '}
                  <span className="font-mono text-primary">{stepValues.ports}</span>
                </>
              )}
            </p>
          </div>
        </Card>
      )}
      </div>
    </TooltipProvider>
  );
}