import React from 'react';
import { 
  RotateCw, 
  Power, 
  Camera, 
  Terminal,
  Monitor,
  Shield,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import useVMActions from '../../hooks/useVMActions';

const QuickActions = ({ vm }) => {
  const { 
    restartVM, 
    forceStopVM, 
    createSnapshot,
    isLoading 
  } = useVMActions(vm?.id);

  const handleRestart = async () => {
    if (window.confirm('Are you sure you want to restart this VM?')) {
      try {
        await restartVM();
        toast({
          title: "VM Restarting",
          description: `${vm.name} is restarting...`,
        });
      } catch (error) {
        toast({
          title: "Failed to restart VM",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleForceStop = async () => {
    if (window.confirm('Are you sure you want to force stop this VM? This may cause data loss.')) {
      try {
        await forceStopVM();
        toast({
          title: "VM Force Stopped",
          description: `${vm.name} has been forcefully stopped.`,
          variant: "warning",
        });
      } catch (error) {
        toast({
          title: "Failed to force stop VM",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSnapshot = async () => {
    const snapshotName = window.prompt('Enter snapshot name:', `snapshot-${Date.now()}`);
    if (snapshotName) {
      try {
        await createSnapshot(snapshotName);
        toast({
          title: "Snapshot Created",
          description: `Snapshot "${snapshotName}" created successfully.`,
        });
      } catch (error) {
        toast({
          title: "Failed to create snapshot",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleConsole = () => {
    toast({
      title: "Opening Console",
      description: "Console access will be available soon.",
    });
  };

  const handleRemoteDesktop = () => {
    toast({
      title: "Remote Desktop",
      description: "Remote desktop connection will be available soon.",
    });
  };

  const handleBackup = () => {
    toast({
      title: "Backup",
      description: "VM backup functionality will be available soon.",
    });
  };

  const actions = [
    {
      icon: RotateCw,
      label: 'Restart VM',
      description: 'Gracefully restart the virtual machine',
      onClick: handleRestart,
      variant: 'outline',
      disabled: vm?.status?.toLowerCase() !== 'running'
    },
    {
      icon: Power,
      label: 'Force Stop',
      description: 'Forcefully stop the VM (may cause data loss)',
      onClick: handleForceStop,
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700',
      disabled: vm?.status?.toLowerCase() === 'stopped' || vm?.status?.toLowerCase() === 'shut off'
    },
    {
      icon: Camera,
      label: 'Create Snapshot',
      description: 'Create a point-in-time snapshot',
      onClick: handleSnapshot,
      variant: 'outline'
    },
    {
      icon: Terminal,
      label: 'Open Console',
      description: 'Access VM console',
      onClick: handleConsole,
      variant: 'outline',
      disabled: vm?.status?.toLowerCase() !== 'running'
    },
    {
      icon: Monitor,
      label: 'Remote Desktop',
      description: 'Connect via remote desktop',
      onClick: handleRemoteDesktop,
      variant: 'outline',
      disabled: vm?.status?.toLowerCase() !== 'running'
    },
    {
      icon: Download,
      label: 'Backup',
      description: 'Create a full VM backup',
      onClick: handleBackup,
      variant: 'outline'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common VM operations and management tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="text-center">
                <Button
                  variant={action.variant}
                  className={`w-full h-20 flex flex-col gap-2 ${action.className || ''}`}
                  onClick={action.onClick}
                  disabled={isLoading || action.disabled}
                  title={action.description}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;