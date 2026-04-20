'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  FileText,
  Info,
  Network,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  Card,
  CodeBlock,
  EmptyState,
  ResponsiveGrid,
  ResponsiveStack,
  Skeleton,
} from '@infinibay/harbor';
import { useDepartmentNetworkDiagnosticsQuery } from '@/gql/hooks';

import NetworkHealthScore from './NetworkHealthScore';
import NetworkFlowDiagram from './NetworkFlowDiagram';
import ComponentStatusCards from './ComponentStatusCards';
import DhcpTrafficCapture from './DhcpTrafficCapture';
import { calculateNetworkHealth } from './networkDiagnosticsHelp';

const DepartmentNetworkTab = ({ departmentId }) => {
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
      <Alert
        tone="danger"
        icon={<AlertCircle size={14} />}
        title="Failed to load network diagnostics"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={handleRefresh}
          >
            Retry
          </Button>
        }
      >
        {error.message}
      </Alert>
    );
  }

  const diagnostics = data?.departmentNetworkDiagnostics;

  if (!diagnostics) {
    return (
      <EmptyState
        variant="dashed"
        icon={<Network size={18} />}
        title="No diagnostics data available"
      />
    );
  }

  const recommendations = diagnostics.recommendations || [];
  const manualCommands = diagnostics.manualCommands || [];
  const recentLogs = diagnostics.dnsmasq?.recentLogLines || [];
  const health = calculateNetworkHealth(diagnostics);
  const showIssues =
    health.status !== 'healthy' && recommendations.length > 0;

  return (
    <ResponsiveStack direction="col" gap={6}>
      <Card
        variant="default"
        spotlight={false}
        glow={false}
        leadingIcon={<Network size={18} />}
        leadingIconTone="sky"
        title="Network diagnostics"
        description={`Last checked: ${new Date(diagnostics.timestamp).toLocaleString()}`}
        footer={
          <ResponsiveStack direction="row" justify="end">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
              loading={isRefreshing}
            >
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
          </ResponsiveStack>
        }
      />

      <NetworkHealthScore diagnostics={diagnostics} />

      {showIssues ? (
        <Alert
          tone="danger"
          icon={<AlertCircle size={14} />}
          title="Issues detected"
        >
          <ResponsiveStack direction="col" gap={1}>
            {recommendations.map((rec, idx) => (
              <span key={idx}>• {rec}</span>
            ))}
          </ResponsiveStack>
        </Alert>
      ) : null}

      <NetworkFlowDiagram diagnostics={diagnostics} />

      <Card
        variant="default"
        spotlight={false}
        glow={false}
        leadingIcon={<Info size={18} />}
        leadingIconTone="neutral"
        title="Component details"
      >
        <ComponentStatusCards diagnostics={diagnostics} />
      </Card>

      <DhcpTrafficCapture departmentId={departmentId} />

      {recentLogs.length > 0 || manualCommands.length > 0 ? (
        <Accordion>
          <AccordionItem
            value="advanced"
            title="Advanced diagnostics"
            icon={<Terminal size={14} />}
          >
            <ResponsiveStack direction="col" gap={4}>
              {recentLogs.length > 0 ? (
                <Card
                  variant="default"
                  spotlight={false}
                  glow={false}
                  leadingIcon={<FileText size={18} />}
                  leadingIconTone="sky"
                  title={
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <span>Recent DHCP logs</span>
                      <Badge tone="neutral">{recentLogs.length} lines</Badge>
                    </ResponsiveStack>
                  }
                  description="Recent activity from the DNSMASQ service. Useful for debugging IP assignment issues."
                >
                  <CodeBlock code={recentLogs.join('\n')} />
                </Card>
              ) : null}

              {manualCommands.length > 0 ? (
                <Card
                  variant="default"
                  spotlight={false}
                  glow={false}
                  leadingIcon={<Terminal size={18} />}
                  leadingIconTone="purple"
                  title="Manual commands"
                  description="Run these commands on the server with administrator privileges for advanced troubleshooting."
                  footer={
                    <ResponsiveStack direction="row" justify="end">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          copiedCommand ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )
                        }
                        onClick={() => copyCommands(manualCommands)}
                      >
                        {copiedCommand ? 'Copied!' : 'Copy all'}
                      </Button>
                    </ResponsiveStack>
                  }
                >
                  <CodeBlock code={manualCommands.join('\n')} />
                </Card>
              ) : null}
            </ResponsiveStack>
          </AccordionItem>
        </Accordion>
      ) : null}
    </ResponsiveStack>
  );
};

const DepartmentNetworkTabSkeleton = () => (
  <ResponsiveStack direction="col" gap={6}>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={4}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
    <Skeleton />
  </ResponsiveStack>
);

export default DepartmentNetworkTab;
