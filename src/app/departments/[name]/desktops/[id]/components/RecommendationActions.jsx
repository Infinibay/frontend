import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Info,
  List,
  RefreshCw,
  Search,
  Settings,
  Shield,
  XCircle,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  ResponsiveStack,
  TextField,
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

/**
 * Compact single-line row for the item-list dialog. Keeps each update/threat/port
 * to ~2 lines (primary + muted metadata) so a long list fits in a modest, scrollable
 * modal instead of a wall of large Cards. Badges carry the at-a-glance signals.
 */
function renderCompactListRow(item, index, type) {
  let primary;
  const secondary = [];
  const badges = [];

  if (type === 'DEFENDER_THREAT') {
    primary = item.name;
    badges.push(
      <Badge key="st" tone={item.status === 'Active' ? 'danger' : 'neutral'}>
        {item.status}
      </Badge>,
    );
    if (item.severity) secondary.push(`Severity: ${item.severity}`);
    if (item.detectionTime)
      secondary.push(`Detected ${new Date(item.detectionTime).toLocaleDateString()}`);
    if (item.path) secondary.push(item.path);
  } else if (type === 'PORT_BLOCKED') {
    primary = `Port ${item.port} (${item.protocol})`;
    if (item.processName)
      secondary.push(
        item.processId ? `${item.processName} (PID ${item.processId})` : item.processName,
      );
    if (item.ruleName) secondary.push(`Rule: ${item.ruleName}`);
    if (item.lastAttempt)
      secondary.push(`Last ${new Date(item.lastAttempt).toLocaleString()}`);
  } else if (type === 'APP_UPDATE_AVAILABLE') {
    primary = item.name;
    if (item.isSecurity) badges.push(<Badge key="sec" tone="danger">Security</Badge>);
    if (item.currentVersion && item.newVersion)
      secondary.push(`${item.currentVersion} → ${item.newVersion}`);
    if (item.size) secondary.push(item.size);
  } else {
    primary = item.title || item.name;
    if (item.type)
      badges.push(
        <Badge key="ty" tone={item.type === 'Security' ? 'danger' : 'neutral'}>
          {item.type}
        </Badge>,
      );
    if (item.requiresReboot)
      badges.push(<Badge key="rb" tone="warning">Requires reboot</Badge>);
    if (item.kb) secondary.push(`KB ${item.kb}`);
    if (item.size) secondary.push(item.size);
  }

  return (
    <div
      key={index}
      className="flex items-start justify-between gap-3 rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] px-3 py-2"
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-fg">{primary}</div>
        {secondary.length > 0 ? (
          <div className="truncate text-xs text-fg-muted">{secondary.join(' · ')}</div>
        ) : null}
      </div>
      {badges.length > 0 ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          {badges}
        </div>
      ) : null}
    </div>
  );
}

const RecommendationActions = ({ recommendation, vmStatus, vmSetupComplete, agentOnline, activeResolution = null }) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [listFilter, setListFilter] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
    items: [],
  });
  const [confirmAction, setConfirmAction] = useState(null);

  // Recommendations need a fully-ready VM (process running AND OS finished setup);
  // running an action against a still-installing VM would queue indefinitely.
  const vmReady = (vmStatus === 'running' && !!vmSetupComplete) || vmStatus === 'poweredOn';

  const info = getRecommendationInfo(recommendation.type, recommendation);
  const metadata = extractRecommendationMetadata(recommendation);
  // The hook exposes `isRunning` = a resolution is in progress (non-terminal).
  // Alias it to `isResolving` so it is never confused with the VM-readiness flag
  // above — mixing the two previously disabled every button whenever the VM was up.
  const { resolve, cancel, resolution, isStarting, isCancelling, isRunning: isResolving } =
    useResolveRecommendation(recommendation.id);

  // The click-time hook only knows about a resolution it started; after a refresh
  // its state is empty. `activeResolution` (from the server, via the parent) fills
  // that gap so a running action still disables its buttons and shows a badge.
  const effectiveResolution = resolution || activeResolution;
  const hasActiveResolution = Boolean(
    activeResolution || (resolution && isResolving),
  );

  const getActionConfig = (type, canInstallUpdates) => {
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
          disabled: !canInstallUpdates,
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
            disabled: !canInstallUpdates,
          });
        }
        actions.push({
          action: 'install_updates',
          label: 'Install All Updates',
          variant: 'default',
          icon: RefreshCw,
          disabled: !canInstallUpdates,
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
        setListFilter('');
        setShowListDialog(true);
        break;
      }
      case 'processes':
        // Live per-process data isn't streamed to the console yet, so guide the
        // operator to inspect it inside the VM instead of showing fabricated rows.
        setDialogContent({
          title: 'Check running processes',
          description:
            'Live process data is not available from here yet — inspect it inside the desktop.',
          guidanceSteps: [
            'Connect to the desktop using the Connect button in the header.',
            'Open Task Manager (Ctrl+Shift+Esc) on Windows, or run top/htop on Linux.',
            'Sort by CPU or Memory to find the heaviest process.',
            'Close or restart the offending application if it is not needed.',
          ],
        });
        setShowInfoDialog(true);
        break;
      default:
        toast({
          title: 'Not automated yet',
          description:
            "This action can't be run automatically yet. Use the recommendation details to complete it inside the desktop.",
          variant: 'info',
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

    // Non-auto-resolvable confirmations have no backend automation — be honest
    // rather than claiming a fake success.
    toast({
      title: 'Not automated yet',
      description:
        "This action can't be run automatically yet. Complete it inside the desktop.",
      variant: 'info',
    });
  };

  // Client-side filter for the item-list dialog so a long update list stays
  // navigable inside the (now height-capped, scrollable) modal.
  const filteredListItems = useMemo(() => {
    const items = dialogContent.items || [];
    const q = listFilter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [
        item.title, item.name, item.kb, item.type, item.size,
        item.currentVersion, item.newVersion, item.severity, item.status,
        item.path, item.processName, item.ruleName, item.port, item.protocol,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [dialogContent.items, listFilter]);

  const actionConfig = getActionConfig(recommendation.type, vmReady && agentOnline);

  return (
    <>
      <ResponsiveStack direction="col" gap={2}>
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          {actionConfig.actions.map((action, index) => {
            const IconComp = action.icon;
            const busy = isStarting || isResolving || hasActiveResolution;
            const isDisabled = action.comingSoon || action.disabled || busy;
            // Distinguish WHY a plainly-disabled install action is unavailable.
            const disabledReason = !vmReady
              ? 'Start the desktop to run this action.'
              : 'Agent offline — waiting for connection.';
            const btn = (
              <Button
                key={index}
                size="sm"
                variant={variantMap[action.variant] || 'primary'}
                disabled={isDisabled}
                icon={IconComp ? <IconComp size={12} /> : undefined}
                onClick={
                  isDisabled ? undefined : () => handleAction(action.action)
                }
              >
                {action.label}
              </Button>
            );
            return action.comingSoon ? (
              <Tooltip key={index} content="Coming soon">
                <span>{btn}</span>
              </Tooltip>
            ) : action.disabled ? (
              <Tooltip key={index} content={disabledReason}>
                <span>{btn}</span>
              </Tooltip>
            ) : (
              btn
            );
          })}
        </ResponsiveStack>
        {effectiveResolution ? (
          <ResponsiveStack direction="row" gap={2} align="center" wrap>
            <RecommendationResolutionBadge resolution={effectiveResolution} />
            {hasActiveResolution ? (
              <Button
                size="sm"
                variant="ghost"
                icon={<XCircle size={12} />}
                disabled={isCancelling}
                loading={isCancelling}
                onClick={() => cancel(effectiveResolution.id)}
              >
                Cancel
              </Button>
            ) : null}
          </ResponsiveStack>
        ) : null}
      </ResponsiveStack>

      <Dialog
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }}
        size="md"
      >
        <DialogTitle>{confirmAction?.title}</DialogTitle>
        <DialogDescription>{confirmAction?.description}</DialogDescription>
        <DialogButtons align="end">
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
        </DialogButtons>
      </Dialog>

      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        size="lg"
      >
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogDescription>{dialogContent.description}</DialogDescription>
        <DialogBody>
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
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="primary" onClick={() => setShowInfoDialog(false)}>
            Close
          </Button>
        </DialogButtons>
      </Dialog>

      <Dialog
        open={showListDialog}
        onClose={() => setShowListDialog(false)}
        size="md"
      >
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogDescription>{dialogContent.description}</DialogDescription>
        {/* Filter row lives OUTSIDE DialogBody so it stays pinned while the list
            scrolls. Only shown once the list is long enough to warrant it. */}
        {(dialogContent.items?.length || 0) > 8 ? (
          <div className="px-[calc(var(--harbor-target-panel-padding)+4px)] pt-2">
            <TextField
              value={listFilter}
              onChange={(e) => setListFilter(e.target.value)}
              placeholder="Filter…"
              icon={<Search size={14} />}
            />
            <p className="mt-1 text-xs text-fg-muted">
              Showing {filteredListItems.length} of {dialogContent.items.length}
            </p>
          </div>
        ) : null}
        <DialogBody>
        <ResponsiveStack direction="col" gap={2}>
          {dialogContent.items && dialogContent.items.length > 0 ? (
            filteredListItems.length > 0 ? (
              filteredListItems.map((item, index) =>
                renderCompactListRow(item, index, dialogContent.type),
              )
            ) : (
              <Alert tone="info" title="No matches">
                No items match “{listFilter}”.
              </Alert>
            )
          ) : (
            <Alert tone="info" title="No structured data available">
              Detailed data will appear when available.
            </Alert>
          )}
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="primary" onClick={() => setShowListDialog(false)}>
            Close
          </Button>
        </DialogButtons>
      </Dialog>
    </>
  );
};

export default RecommendationActions;
