import React from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { MockDataBadge, MockDataSection } from '@/components/ui/mock-data-badge';

// Widget Components
import ResourceGauge from '../widgets/ResourceGauge';
import ProcessList from '../widgets/ProcessList';
import QuickActions from '../widgets/QuickActions';
import MetricsCard from '../widgets/MetricsCard';
import AlertBanner from '../widgets/AlertBanner';

// Hooks
import useVMMetrics from '../../hooks/useVMMetrics';
import useVMProcesses from '../../hooks/useVMProcesses';

const OverviewTab = ({ vm }) => {
  // Check if VM is running
  const isRunning = vm?.status?.toLowerCase() === 'running';
  
  // Fetch real-time metrics only if VM is running
  const { metrics, loading: metricsLoading, isMockData } = useVMMetrics(isRunning ? vm?.id : null);
  const { processes, loading: processesLoading } = useVMProcesses(isRunning ? vm?.id : null);

  // Calculate health status
  const getHealthStatus = () => {
    if (!metrics) return 'unknown';
    
    const cpuUsage = metrics.cpuUsage || 0;
    const memoryUsage = metrics.memoryUsage || 0;
    const diskUsage = metrics.diskUsage || 0;
    
    if (cpuUsage > 90 || memoryUsage > 90 || diskUsage > 90) {
      return 'critical';
    }
    if (cpuUsage > 70 || memoryUsage > 70 || diskUsage > 80) {
      return 'warning';
    }
    return 'healthy';
  };

  const healthStatus = getHealthStatus();

  // If VM is not running, show a different view
  if (!isRunning) {
    return (
      <div className="space-y-6">
        <AlertBanner 
          variant="default"
          title="VM is not running"
          description={`This virtual machine is currently ${vm?.status || 'stopped'}. Start the VM to view metrics and manage processes.`}
          actions={[
            {
              label: 'Start VM',
              variant: 'default',
              onClick: () => {
                // This would trigger the start VM action
                window.location.reload(); // Temporary
              }
            }
          ]}
        />
        
        {/* Quick Actions - still available when VM is off */}
        <QuickActions vm={vm} />
        
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>VM Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm capitalize">{vm?.status || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-sm">{vm?.department?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Template</p>
                <p className="text-sm">{vm?.template?.name || 'Custom'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{vm?.createdAt ? new Date(vm.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Status Alert */}
      {healthStatus === 'critical' && (
        <AlertBanner 
          variant="destructive"
          title="Critical Resource Usage"
          description="One or more resources are critically high. Immediate attention required."
        />
      )}
      
      {healthStatus === 'warning' && (
        <AlertBanner 
          variant="warning"
          title="High Resource Usage"
          description="Some resources are running high. Consider monitoring closely."
        />
      )}

      {/* Quick Actions */}
      <QuickActions vm={vm} />

      {/* Main Metrics Grid */}
      <MockDataSection 
        showBadge={isMockData}
        message="Metrics are simulated"
        badgeProps={{ size: 'sm' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <MetricsCard
          title="CPU Usage"
          value={`${metrics?.cpuUsage || 0}%`}
          description="Current CPU utilization"
          icon={<Cpu className="h-4 w-4" />}
          trend={metrics?.cpuTrend}
          loading={metricsLoading}
        />

        {/* Memory Usage */}
        <MetricsCard
          title="Memory Usage"
          value={`${metrics?.memoryUsage || 0}%`}
          description={`${metrics?.memoryUsed || 0} GB / ${metrics?.memoryTotal || 0} GB`}
          icon={<MemoryStick className="h-4 w-4" />}
          trend={metrics?.memoryTrend}
          loading={metricsLoading}
        />

        {/* Disk Usage */}
        <MetricsCard
          title="Disk Usage"
          value={`${metrics?.diskUsage || 0}%`}
          description={`${metrics?.diskUsed || 0} GB / ${metrics?.diskTotal || 0} GB`}
          icon={<HardDrive className="h-4 w-4" />}
          trend={metrics?.diskTrend}
          loading={metricsLoading}
        />

        {/* Network I/O */}
        <MetricsCard
          title="Network I/O"
          value={`${metrics?.networkRate || '0 Mbps'}`}
          description={`↓ ${metrics?.networkIn || 0} MB ↑ ${metrics?.networkOut || 0} MB`}
          icon={<Network className="h-4 w-4" />}
          loading={metricsLoading}
        />
      </div>
      </MockDataSection>

      {/* Resource Gauges and Process List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Gauges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Resource Utilization
            </CardTitle>
            <CardDescription>
              Real-time resource usage visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResourceGauge 
              label="CPU" 
              value={metrics?.cpuUsage || 0} 
              max={100}
              unit="%"
              color="blue"
            />
            <ResourceGauge 
              label="Memory" 
              value={metrics?.memoryUsage || 0} 
              max={100}
              unit="%"
              color="green"
            />
            <ResourceGauge 
              label="Disk" 
              value={metrics?.diskUsage || 0} 
              max={100}
              unit="%"
              color="yellow"
            />
          </CardContent>
        </Card>

        {/* Top Processes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Top Processes
            </CardTitle>
            <CardDescription>
              Processes consuming the most resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProcessList 
              processes={processes} 
              loading={processesLoading}
              limit={5}
              vmId={vm?.id}
            />
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Information
            </span>
            {isMockData && <MockDataBadge size="sm" variant="subtle">Simulated</MockDataBadge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Operating System</p>
              <p className="text-sm">{metrics?.os || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Uptime</p>
              <p className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {metrics?.uptime || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Boot</p>
              <p className="text-sm">{metrics?.lastBoot || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">IP Address</p>
              <p className="text-sm">{metrics?.ipAddress || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
              <p className="text-sm">{metrics?.macAddress || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Hostname</p>
              <p className="text-sm">{metrics?.hostname || vm?.internalName || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card className="relative">
        <MockDataBadge position="top-right" size="sm" variant="info">
          Sample Events
        </MockDataBadge>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Latest system events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">VM Started Successfully</p>
                <p className="text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">High Memory Usage Detected</p>
                <p className="text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Snapshot Created</p>
                <p className="text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;