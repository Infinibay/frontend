import React from 'react';
import {
  Play,
  Pause,
  Power,
  RotateCw,
  Camera,
  HardDrive,
  Monitor,
  MoreVertical,
  Heart,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import useVMActions from '../hooks/useVMActions';
import { useHealthTransformation } from '@/hooks/useHealthTransformation';
import { useRouter } from 'next/navigation';

const VMHeader = ({ vm, onRefresh }) => {
  const router = useRouter();
  const {
    startVM,
    stopVM,
    restartVM,
    forceStopVM,
    pauseVM,
    createSnapshot,
    isLoading
  } = useVMActions(vm?.id);

  // Get health data for the VM
  const {
    overallStatus,
    problems,
    lastUpdate,
    isLoading: healthLoading
  } = useHealthTransformation(vm?.id, {
    refreshInterval: 60000, // 1 minute
    enableRealTime: true
  });

  // Determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
      case 'shut off':
        return 'bg-red-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'building':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Determine status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'success';
      case 'stopped':
      case 'shut off':
        return 'destructive';
      case 'paused':
        return 'warning';
      case 'building':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Handle VM actions
  const handleStart = async () => {
    try {
      await startVM();
      toast({
        title: "VM Started",
        description: `${vm.name} has been started successfully.`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Failed to start VM",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStop = async () => {
    try {
      await stopVM();
      toast({
        title: "VM Stopped",
        description: `${vm.name} has been stopped successfully.`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Failed to stop VM",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRestart = async () => {
    try {
      await restartVM();
      toast({
        title: "VM Restarting",
        description: `${vm.name} is restarting...`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Failed to restart VM",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePause = async () => {
    try {
      await pauseVM();
      toast({
        title: "VM Paused",
        description: `${vm.name} has been paused successfully.`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Failed to pause VM",
        description: error.message,
        variant: "destructive",
      });
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
        onRefresh();
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
          description: `Snapshot "${snapshotName}" has been created successfully.`,
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

  // Health status helpers
  const getHealthIcon = (level) => {
    switch (level) {
      case 'excellent':
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthColor = (level) => {
    switch (level) {
      case 'excellent':
      case 'normal':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const isRunning = vm?.status?.toLowerCase() === 'running';
  const isStopped = vm?.status?.toLowerCase() === 'stopped' || vm?.status?.toLowerCase() === 'shut off';
  const isPaused = vm?.status?.toLowerCase() === 'paused';

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* VM Icon/Status Indicator */}
          <div className="relative">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(vm?.status)} ring-2 ring-background`} />
          </div>

          {/* VM Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{vm?.name}</h1>
              <Badge variant={getStatusVariant(vm?.status)}>
                {vm?.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Department: {vm?.department?.name || 'N/A'}</span>
              <span>•</span>
              <span>User: {vm?.user?.firstName} {vm?.user?.lastName}</span>
              <span>•</span>
              <span>Template: {vm?.template?.name || 'Custom'}</span>
            </div>

            {/* VM Configuration */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-medium">CPU:</span> {vm?.configuration?.cpu || vm?.template?.cores || 0} cores
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">RAM:</span> {vm?.configuration?.memory || vm?.template?.ram || 0} GB
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Storage:</span> {vm?.configuration?.storage || vm?.template?.storage || 0} GB
              </span>
            </div>

            {/* Health Status */}
            {overallStatus && !healthLoading && (
              <div className={`flex items-center gap-3 mt-3 p-2 rounded-md border ${getHealthColor(overallStatus.level)}`}>
                <div className="flex items-center gap-2">
                  {getHealthIcon(overallStatus.level)}
                  <span className="text-sm font-medium">
                    Estado de Salud: {overallStatus.label}
                  </span>
                </div>

                {overallStatus.criticalProblems > 0 && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {overallStatus.criticalProblems} críticos
                  </Badge>
                )}

                {overallStatus.lastCheck && (
                  <div className="flex items-center gap-1 text-xs opacity-75">
                    <Clock className="h-3 w-3" />
                    <span>
                      Última revisión: {new Date(overallStatus.lastCheck).toLocaleTimeString('es-ES')}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {overallStatus.level === 'critical' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 px-2"
                      onClick={() => {
                        // Navigate to problems tab
                        const currentUrl = new URL(window.location);
                        currentUrl.searchParams.set('tab', 'problems');
                        router.replace(currentUrl.pathname + currentUrl.search);
                      }}
                    >
                      Ver Problemas
                    </Button>
                  )}

                  {overallStatus.level !== 'critical' && overallStatus.level !== 'excellent' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 px-2"
                      onClick={() => {
                        // Navigate to maintenance tab
                        const currentUrl = new URL(window.location);
                        currentUrl.searchParams.set('tab', 'maintenance');
                        router.replace(currentUrl.pathname + currentUrl.search);
                      }}
                    >
                      Optimizar
                    </Button>
                  )}
                </div>
              </div>
            )}

            {healthLoading && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600">Verificando estado de salud...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Primary Actions */}
          {isStopped && (
            <Button
              onClick={handleStart}
              disabled={isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}

          {isRunning && (
            <>
              <Button
                onClick={handlePause}
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button
                onClick={handleStop}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Power className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </>
          )}

          {isPaused && (
            <Button
              onClick={handleStart}
              disabled={isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}

          <Button
            onClick={handleRestart}
            disabled={isLoading || isStopped}
            size="sm"
            variant="outline"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Restart
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSnapshot}>
                <Camera className="h-4 w-4 mr-2" />
                Create Snapshot
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Clone VM')}>
                <HardDrive className="h-4 w-4 mr-2" />
                Clone VM
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleForceStop}
                className="text-red-600"
                disabled={isStopped}
              >
                <Power className="h-4 w-4 mr-2" />
                Force Stop
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default VMHeader;