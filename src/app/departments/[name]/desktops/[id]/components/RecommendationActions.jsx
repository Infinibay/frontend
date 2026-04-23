import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Info,
  List,
  RefreshCw,
  Settings,
  Shield,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  PropertyList,
  ResponsiveStack,
  Tooltip,
} from '@infinibay/harbor';
import { toast } from '@/hooks/use-toast';
import {
  extractRecommendationMetadata,
  getRecommendationInfo,
} from '@/utils/recommendationTypeMapper';
import useResolveRecommendation from '@/hooks/useResolveRecommendation';
import RecommendationResolutionBadge from './RecommendationResolutionBadge';

const variantMap = {
  default: 'primary',
  destructive: 'destructive',
  secondary: 'secondary',
  ghost: 'ghost',
};

const RecommendationActions = ({ recommendation }) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
    items: [],
  });
  const [confirmAction, setConfirmAction] = useState(null);

  const info = getRecommendationInfo(recommendation.type, recommendation);
  const metadata = extractRecommendationMetadata(recommendation);
  const { resolve, resolution, isStarting, isRunning } = useResolveRecommendation(recommendation.id);

  const getActionConfig = (type) => {
    const actions = [];
    switch (type) {
      case 'OS_UPDATE_AVAILABLE':
      case 'SYSTEM_UPDATE_AVAILABLE':
        if (metadata?.rebootDays >= 7) {
          actions.push({
            action: 'reboot',
            label: 'Reboot Now',
            variant: 'destructive',
            icon: AlertTriangle,
          });
        } else if (metadata?.rebootDays >= 3) {
          actions.push({
            action: 'schedule_reboot',
            label: 'Schedule Reboot',
            variant: 'default',
            icon: Calendar,
          });
        }
        actions.push({
          action: 'install_updates',
          label: 'Install Updates',
          variant: 'default',
          icon: RefreshCw,
        });
        actions.push({
          action: 'list',
          label: 'View Updates',
          variant: 'default',
          icon: List,
        });
        break;
      case 'APP_UPDATE_AVAILABLE':
        if (metadata?.securityUpdateCount > 0) {
          actions.push({
            action: 'install_security_updates',
            label: `Install Security Updates (${metadata.securityUpdateCount})`,
            variant: 'destructive',
            icon: Shield,
          });
        }
        actions.push({
          action: 'install_updates',
          label: 'Install All Updates',
          variant: 'default',
          icon: RefreshCw,
        });
        actions.push({
          action: 'list',
          label: `View All (${metadata?.totalUpdateCount || 0})`,
          variant: 'default',
          icon: List,
        });
        break;
      case 'DEFENDER_THREAT':
        actions.push({
          action: 'view_threats',
          label: 'View Threats',
          variant: metadata?.activeThreats > 0 ? 'destructive' : 'default',
          icon: AlertTriangle,
        });
        actions.push({
          action: 'run_full_scan',
          label: 'Run Full Scan',
          variant: 'default',
          icon: Shield,
          comingSoon: true, // requires RunDefenderFullScan in infiniservice (phase 2)
        });
        break;
      case 'PORT_BLOCKED': {
        const firstPort = metadata?.blockedPorts?.[0];
        if (firstPort) {
          actions.push({
            action: 'firewall',
            label: `Configure Port ${firstPort.port}`,
            variant: 'default',
            icon: Settings,
          });
        }
        actions.push({
          action: 'firewall',
          label: 'View Firewall Rules',
          variant: 'default',
          icon: ExternalLink,
        });
        break;
      }
      case 'DEFENDER_DISABLED':
        actions.push({
          action: 'enable_defender',
          label: 'Enable Defender',
          variant: 'default',
          icon: Shield,
        });
        actions.push({
          label: 'View Details',
          icon: Info,
          variant: 'default',
          action: 'info',
        });
        break;
      case 'FIREWALL_DISABLED':
      case 'ANTIVIRUS_OUTDATED':
        actions.push({
          label: 'View Details',
          icon: Info,
          variant: 'default',
          action: 'info',
        });
        break;
      case 'HIGH_CPU_APP':
      case 'HIGH_RAM_APP':
        actions.push({
          label: 'View Processes',
          icon: Activity,
          variant: 'default',
          action: 'processes',
        });
        break;
      case 'DISK_SPACE_LOW':
      case 'TEMP_FILES_CLEANUP':
      case 'LOG_FILES_LARGE':
      case 'SLOW_DISK_PERFORMANCE':
      case 'OVER_PROVISIONED':
      case 'UNDER_PROVISIONED':
      case 'SCHEDULED_RESTART':
      case 'BACKUP_RECOMMENDED':
      case 'MAINTENANCE_WINDOW':
      case 'DRIVER_UPDATE_AVAILABLE':
        actions.push({
          label: 'View Details',
          icon: Info,
          variant: 'default',
          action: 'info',
        });
        break;
      default:
        actions.push({
          label: 'More Information',
          icon: Info,
          variant: 'default',
          action: 'info',
        });
    }
    return { actions };
  };

  const getRecommendationItems = (type) => {
    if (!recommendation.data) return null;
    let data;
    try {
      data =
        typeof recommendation.data === 'string'
          ? JSON.parse(recommendation.data)
          : recommendation.data;
    } catch (error) {
      console.error('Failed to parse recommendation data:', error);
      return null;
    }
    switch (type) {
      case 'OS_UPDATE_AVAILABLE':
      case 'SYSTEM_UPDATE_AVAILABLE':
        if (Array.isArray(data.updates)) {
          return data.updates.map((update) => ({
            title: update.title || update.name,
            kb: update.kb || update.kbNumber,
            type:
              update.type ||
              (update.isSecurity
                ? 'Security'
                : update.isQuality
                  ? 'Quality'
                  : 'Update'),
            size: update.size || update.downloadSize,
            requiresReboot:
              update.requiresReboot !== undefined ? update.requiresReboot : true,
          }));
        }
        return null;
      case 'APP_UPDATE_AVAILABLE': {
        const apps = data.applications || data.apps || data.updates;
        if (Array.isArray(apps)) {
          return apps.map((app) => ({
            name: app.name || app.appName,
            currentVersion: app.currentVersion || app.version,
            newVersion: app.newVersion || app.availableVersion,
            size: app.size || app.downloadSize,
            isSecurity: app.isSecurity || app.securityUpdate || false,
          }));
        }
        return null;
      }
      case 'DEFENDER_THREAT':
        if (Array.isArray(data.threats)) {
          return data.threats.map((threat) => ({
            name: threat.name || threat.threatName,
            severity: threat.severity || threat.severityLevel || 'Unknown',
            status:
              threat.status || (threat.quarantined ? 'Quarantined' : 'Active'),
            detectionTime: threat.detectionTime || threat.detected || null,
            path: threat.path || threat.filePath,
          }));
        }
        return null;
      case 'PORT_BLOCKED':
        return metadata?.blockedPorts || null;
      default:
        return null;
    }
  };

  const getMockProcesses = () => [
    { name: 'chrome.exe', cpu: 25.4, memory: 512, pid: 1234 },
    { name: 'devenv.exe', cpu: 18.2, memory: 1024, pid: 2345 },
    { name: 'firefox.exe', cpu: 12.1, memory: 768, pid: 3456 },
    { name: 'code.exe', cpu: 8.7, memory: 456, pid: 4567 },
    { name: 'teams.exe', cpu: 6.3, memory: 892, pid: 5678 },
  ];

  const handleAction = (actionType) => {
    switch (actionType) {
      case 'reboot':
        setConfirmAction({
          type: 'reboot',
          title: 'Reboot desktop',
          description: `This desktop urgently requires a reboot (${metadata?.rebootDays} days pending). The reboot will apply ${metadata?.totalUpdates || 0} pending updates and may take 5–10 minutes. Do you want to continue?`,
          confirmLabel: 'Reboot Now',
          variant: 'destructive',
        });
        setShowConfirmDialog(true);
        break;
      case 'schedule_reboot':
        setDialogContent({
          title: 'Schedule Reboot',
          description: `System waiting for reboot for ${metadata?.rebootDays} days. Schedule a reboot to apply ${metadata?.totalUpdates || 0} updates.`,
          guidanceSteps: [
            'Select a convenient date and time',
            'The reboot will apply all pending updates',
            'The desktop will be offline for approximately 5–10 minutes',
            'A notification will be sent before the scheduled reboot',
          ],
        });
        setShowInfoDialog(true);
        break;
      case 'install_updates':
        setConfirmAction({
          type: 'install_updates',
          title: 'Install System Updates',
          description: `${metadata?.totalUpdates || 0} updates will be installed (${metadata?.criticalCount || 0} critical, ${metadata?.securityCount || 0} security). This may require a reboot.`,
          confirmLabel: 'Install',
          variant: 'default',
        });
        setShowConfirmDialog(true);
        break;
      case 'install_security_updates':
        setConfirmAction({
          type: 'install_security_updates',
          title: 'Install Security Updates',
          description: `${metadata?.securityUpdateCount} critical security updates will be installed. This will protect the desktop against known vulnerabilities.`,
          confirmLabel: 'Install Now',
          variant: 'destructive',
        });
        setShowConfirmDialog(true);
        break;
      case 'view_threats': {
        const items = getRecommendationItems('DEFENDER_THREAT');
        setDialogContent({
          title: 'Detected Threats',
          description:
            items && items.length > 0
              ? `${metadata?.threatCount || 0} threats detected (${metadata?.activeThreats || 0} active, ${metadata?.quarantinedThreats || 0} quarantined)`
              : `${metadata?.activeThreats || 0} active threats, ${metadata?.quarantinedThreats || 0} quarantined`,
          items: items || [],
          type: 'DEFENDER_THREAT',
        });
        setShowListDialog(true);
        break;
      }
      case 'run_full_scan':
        setConfirmAction({
          type: 'run_full_scan',
          title: 'Run Full Scan',
          description:
            'Windows Defender will run a full system scan. This may take 30–60 minutes and temporarily affect performance.',
          confirmLabel: 'Run Scan',
          variant: 'default',
        });
        setShowConfirmDialog(true);
        break;
      case 'enable_defender':
        resolve('enable_defender').catch(() => {});
        break;
      case 'firewall':
        setDialogContent({
          title: 'Firewall Configuration',
          description:
            metadata?.blockedPorts?.length > 0
              ? `${metadata.blockedPorts.length} blocked port(s) detected`
              : 'View and configure firewall rules',
          guidanceSteps: [
            'Navigate to the "Firewall" tab of this desktop',
            'Review the rules that are blocking ports',
            metadata?.blockedPorts?.[0]
              ? `Configure an exception for port ${metadata.blockedPorts[0].port} (${metadata.blockedPorts[0].protocol})`
              : 'Configure the necessary exceptions',
            'Restart the desktop if necessary to apply changes',
          ],
          type: 'firewall',
        });
        setShowInfoDialog(true);
        break;
      case 'info': {
        const explanation =
          typeof info.userFriendlyExplanation === 'function'
            ? info.userFriendlyExplanation(recommendation)
            : info.userFriendlyExplanation;
        setDialogContent({
          title: `Information: ${info.label}`,
          description: explanation,
          technicalDetails: info.technicalDetails,
          actions: info.actions,
        });
        setShowInfoDialog(true);
        break;
      }
      case 'list': {
        const listItems = getRecommendationItems(recommendation.type);
        setDialogContent({
          title: `Item List: ${info.label}`,
          description:
            listItems && listItems.length > 0
              ? `${listItems.length} items found`
              : 'No structured data available',
          items: listItems || [],
          type: recommendation.type,
        });
        setShowListDialog(true);
        break;
      }
      case 'processes':
        setDialogContent({
          title: 'System Processes',
          description: 'List of processes consuming the most resources',
          processes: getMockProcesses(),
        });
        setShowInfoDialog(true);
        break;
      default:
        toast({
          title: 'Action executed',
          description: 'The action was executed successfully',
          variant: 'default',
        });
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setShowConfirmDialog(false);
    const action = confirmAction.type;
    setConfirmAction(null);

    const resolvableActions = new Set([
      'reboot',
      'install_updates',
      'install_security_updates',
    ]);

    if (resolvableActions.has(action)) {
      try {
        await resolve(action, { confirmed: true });
      } catch {
        // toast already shown by the hook
      }
      return;
    }

    // Non-auto-resolvable confirmations keep the legacy informational toast
    toast({
      title: 'Action completed',
      description: 'The action was executed successfully.',
      variant: 'default',
    });
  };

  const actionConfig = getActionConfig(recommendation.type);

  return (
    <>
      <ResponsiveStack direction="col" gap={2}>
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          {actionConfig.actions.map((action, index) => {
            const IconComp = action.icon;
            const busy = isStarting || isRunning;
            const btn = (
              <Button
                key={index}
                size="sm"
                variant={variantMap[action.variant] || 'primary'}
                disabled={action.comingSoon || busy}
                icon={IconComp ? <IconComp size={12} /> : undefined}
                onClick={
                  action.comingSoon || busy ? undefined : () => handleAction(action.action)
                }
              >
                {action.label}
              </Button>
            );
            return action.comingSoon ? (
              <Tooltip key={index} content="Coming soon">
                <span>{btn}</span>
              </Tooltip>
            ) : (
              btn
            );
          })}
        </ResponsiveStack>
        {resolution ? <RecommendationResolutionBadge resolution={resolution} /> : null}
      </ResponsiveStack>

      <Dialog
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }}
        size="md"
        title={confirmAction?.title}
        description={confirmAction?.description}
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirmDialog(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmAction?.variant === 'destructive' ? 'destructive' : 'primary'
              }
              onClick={handleConfirm}
            >
              {confirmAction?.confirmLabel || 'Confirm'}
            </Button>
          </ResponsiveStack>
        }
      />

      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        size="lg"
        title={dialogContent.title}
        description={dialogContent.description}
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="primary" onClick={() => setShowInfoDialog(false)}>
              Close
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={4}>
          {dialogContent.guidanceSteps ? (
            <Alert tone="info" icon={<Info size={14} />} title="Steps to follow">
              <ResponsiveStack direction="col" gap={1}>
                {dialogContent.guidanceSteps.map((step, index) => (
                  <span key={index}>{index + 1}. {step}</span>
                ))}
              </ResponsiveStack>
            </Alert>
          ) : null}
          {dialogContent.technicalDetails ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Technical information"
            >
              <span>{dialogContent.technicalDetails}</span>
            </Card>
          ) : null}
          {dialogContent.actions && dialogContent.actions.length > 0 ? (
            <Alert
              tone="info"
              icon={<Info size={14} />}
              title="Recommended actions"
            >
              <ResponsiveStack direction="col" gap={1}>
                {dialogContent.actions.map((action, index) => (
                  <span key={index}>• {action}</span>
                ))}
              </ResponsiveStack>
            </Alert>
          ) : null}
          {dialogContent.processes ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Top resource-consuming processes"
            >
              <PropertyList
                items={dialogContent.processes.map((process, idx) => ({
                  key: `p-${idx}`,
                  label: process.name,
                  value: `CPU ${process.cpu}% · RAM ${process.memory} MB · PID ${process.pid}`,
                }))}
              />
            </Card>
          ) : null}
        </ResponsiveStack>
      </Dialog>

      <Dialog
        open={showListDialog}
        onClose={() => setShowListDialog(false)}
        size="lg"
        title={dialogContent.title}
        description={dialogContent.description}
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="primary" onClick={() => setShowListDialog(false)}>
              Close
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          {dialogContent.items && dialogContent.items.length > 0 ? (
            dialogContent.items.map((item, index) => {
              if (dialogContent.type === 'DEFENDER_THREAT') {
                return (
                  <Card
                    key={index}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    title={
                      <ResponsiveStack direction="row" gap={2} align="center">
                        <span>{item.name}</span>
                        <Badge
                          tone={item.status === 'Active' ? 'danger' : 'neutral'}
                        >
                          {item.status}
                        </Badge>
                      </ResponsiveStack>
                    }
                  >
                    <PropertyList
                      items={[
                        { key: 'sev', label: 'Severity', value: item.severity },
                        item.detectionTime && {
                          key: 'det',
                          label: 'Detected',
                          value: new Date(item.detectionTime).toLocaleDateString(),
                        },
                        item.path && {
                          key: 'path',
                          label: 'Path',
                          value: item.path,
                        },
                      ].filter(Boolean)}
                    />
                  </Card>
                );
              }
              if (dialogContent.type === 'PORT_BLOCKED') {
                return (
                  <Card
                    key={index}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    title={`Port ${item.port} (${item.protocol})`}
                  >
                    <PropertyList
                      items={[
                        {
                          key: 'proc',
                          label: 'Process',
                          value: item.processId
                            ? `${item.processName} (PID ${item.processId})`
                            : item.processName,
                        },
                        item.ruleName && {
                          key: 'rule',
                          label: 'Rule',
                          value: item.ruleName,
                        },
                        item.lastAttempt && {
                          key: 'last',
                          label: 'Last attempt',
                          value: new Date(item.lastAttempt).toLocaleString(),
                        },
                      ].filter(Boolean)}
                    />
                  </Card>
                );
              }
              if (dialogContent.type === 'APP_UPDATE_AVAILABLE') {
                return (
                  <Card
                    key={index}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    title={
                      <ResponsiveStack direction="row" gap={2} align="center">
                        <span>{item.name}</span>
                        {item.isSecurity ? (
                          <Badge tone="danger">Security</Badge>
                        ) : null}
                      </ResponsiveStack>
                    }
                  >
                    <PropertyList
                      items={[
                        item.currentVersion && item.newVersion && {
                          key: 'ver',
                          label: 'Version',
                          value: `${item.currentVersion} → ${item.newVersion}`,
                        },
                        item.size && {
                          key: 'size',
                          label: 'Size',
                          value: item.size,
                        },
                      ].filter(Boolean)}
                    />
                  </Card>
                );
              }
              return (
                <Card
                  key={index}
                  variant="default"
                  spotlight={false}
                  glow={false}
                  title={
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <span>{item.title || item.name}</span>
                      {item.type ? (
                        <Badge
                          tone={item.type === 'Security' ? 'danger' : 'neutral'}
                        >
                          {item.type}
                        </Badge>
                      ) : null}
                      {item.requiresReboot ? (
                        <Badge tone="warning">Requires reboot</Badge>
                      ) : null}
                    </ResponsiveStack>
                  }
                >
                  <PropertyList
                    items={[
                      item.kb && { key: 'kb', label: 'KB', value: item.kb },
                      item.size && { key: 'size', label: 'Size', value: item.size },
                    ].filter(Boolean)}
                  />
                </Card>
              );
            })
          ) : (
            <Alert tone="info" title="No structured data available">
              Detailed data will appear when available.
            </Alert>
          )}
        </ResponsiveStack>
      </Dialog>
    </>
  );
};

export default RecommendationActions;
