'use client';

import React, { useState } from 'react';
import {
  Network,
  RefreshCw,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useDepartmentNetworkDiagnosticsQuery } from '@/gql/hooks';
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

// New dashboard components
import NetworkHealthScore from './NetworkHealthScore';
import NetworkFlowDiagram from './NetworkFlowDiagram';
import ComponentStatusCards from './ComponentStatusCards';
import DhcpTrafficCapture from './DhcpTrafficCapture';
import { calculateNetworkHealth } from './networkDiagnosticsHelp';

const DepartmentNetworkTab = ({ departmentId }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, error, refetch } = useDepartmentNetworkDiagnosticsQuery({
    variables: { departmentId },
    skip: !departmentId,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyCommands = (commands) => {
    navigator.clipboard.writeText(commands.join('\n'));
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  if (loading) {
    return <DepartmentNetworkTabSkeleton />;
  }

  if (error) {
    return (
      <div className={cn(getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'lg' }), 'p-6 text-center')}>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">Failed to load network diagnostics</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={handleRefresh} variant="default">
          Retry
        </Button>
      </div>
    );
  }

  const diagnostics = data?.departmentNetworkDiagnostics;

  if (!diagnostics) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No diagnostics data available</p>
      </div>
    );
  }

  // Guard optional arrays
  const recommendations = diagnostics.recommendations || [];
  const manualCommands = diagnostics.manualCommands || [];
  const recentLogs = diagnostics.dnsmasq?.recentLogLines || [];

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="size-heading flex items-center gap-2">
            <Network className="size-icon" />
            Network Diagnostics
          </h2>
          <p className="text-sm text-muted-foreground">
            Last checked: {new Date(diagnostics.timestamp).toLocaleString()}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Network Health Score - The main status indicator */}
      <NetworkHealthScore diagnostics={diagnostics} />

      {/* Critical Issues Alert - only show when network is not healthy */}
      {(() => {
        const health = calculateNetworkHealth(diagnostics);
        // Only show issues when network status is degraded or critical
        if (health.status === 'healthy' || recommendations.length === 0) return null;
        return (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Issues Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        );
      })()}

      {/* Network Flow Diagram */}
      <NetworkFlowDiagram diagnostics={diagnostics} />

      {/* Component Status Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          Component Details
        </h3>
        <ComponentStatusCards diagnostics={diagnostics} />
      </div>

      {/* DHCP Traffic Capture */}
      <div className={cn(getGlassClasses({ glass: 'medium', elevation: 2, radius: 'lg' }), 'p-6')}>
        <DhcpTrafficCapture departmentId={departmentId} />
      </div>

      {/* Advanced Section - Logs and Manual Commands */}
      {(recentLogs.length > 0 || manualCommands.length > 0) && (
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Advanced Diagnostics
              </span>
              {isAdvancedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {/* Recent DNSMASQ Logs */}
            {recentLogs.length > 0 && (
              <div className={cn(getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }), 'p-4')}>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Recent DHCP Logs</h4>
                  <Badge variant="secondary" className="text-xs">
                    {recentLogs.length} lines
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Recent activity from the DNSMASQ service. Useful for debugging IP assignment issues.
                </p>
                <div className="bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {recentLogs.join('\n')}
                  </pre>
                </div>
              </div>
            )}

            {/* Manual Commands */}
            {manualCommands.length > 0 && (
              <div className={cn(getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }), 'p-4')}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold">Manual Commands</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCommands(manualCommands)}
                    className="text-xs"
                  >
                    {copiedCommand ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Run these commands on the server with administrator privileges for advanced troubleshooting.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {manualCommands.join('\n')}
                  </pre>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

const DepartmentNetworkTabSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>

    {/* Health score skeleton */}
    <Skeleton className="h-24 w-full rounded-xl" />

    {/* Flow diagram skeleton */}
    <Skeleton className="h-40 w-full rounded-xl" />

    {/* Cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>

    {/* DHCP capture skeleton */}
    <Skeleton className="h-32 w-full rounded-xl" />
  </div>
);

export default DepartmentNetworkTab;
