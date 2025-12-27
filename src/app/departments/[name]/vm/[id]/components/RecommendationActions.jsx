import React, { useState } from 'react';
import { Info, List, Settings, Activity, AlertTriangle, RefreshCw, Calendar, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { getRecommendationInfo, requiresImmediateAction, extractRecommendationMetadata } from '@/utils/recommendationTypeMapper';


/**
 * Recommendation action handler component that manages user interactions with recommendations
 */
const RecommendationActions = ({
  recommendation,
  vmId,
  vmStatus,
  className = ""
}) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '', items: [] });
  const [confirmAction, setConfirmAction] = useState(null);

  const info = getRecommendationInfo(recommendation.type, recommendation);
  const metadata = extractRecommendationMetadata(recommendation);


  // Get action button configuration with urgency-aware actions
  const getActionConfig = (type) => {
    const actions = [];

    switch (type) {
      case 'OS_UPDATE_AVAILABLE':
      case 'SYSTEM_UPDATE_AVAILABLE':
        // Urgent reboot actions based on days
        if (metadata?.rebootDays >= 7) {
          actions.push({
            action: 'reboot',
            label: 'Reboot Now',
            variant: 'destructive',
            icon: AlertTriangle,
            comingSoon: true
          });
        } else if (metadata?.rebootDays >= 3) {
          actions.push({
            action: 'schedule_reboot',
            label: 'Schedule Reboot',
            variant: 'default',
            icon: Calendar,
            comingSoon: true
          });
        }

        actions.push({
          action: 'install_updates',
          label: 'Install Updates',
          variant: 'default',
          icon: RefreshCw,
          comingSoon: true
        });

        actions.push({
          action: 'list',
          label: 'View Updates',
          variant: 'default',
          icon: List,
          comingSoon: true
        });
        break;

      case 'APP_UPDATE_AVAILABLE':
        if (metadata?.securityUpdateCount > 0) {
          actions.push({
            action: 'install_security_updates',
            label: `Install Security Updates (${metadata.securityUpdateCount})`,
            variant: 'destructive',
            icon: Shield,
            comingSoon: true
          });
        }

        actions.push({
          action: 'list',
          label: `View All (${metadata?.totalUpdateCount || 0})`,
          variant: 'default',
          icon: List
        });
        break;

      case 'DEFENDER_THREAT':
        actions.push({
          action: 'view_threats',
          label: 'View Threats',
          variant: metadata?.activeThreats > 0 ? 'destructive' : 'default',
          icon: AlertTriangle
        });

        actions.push({
          action: 'run_full_scan',
          label: 'Run Full Scan',
          variant: 'default',
          icon: Shield,
          comingSoon: true
        });
        break;

      case 'PORT_BLOCKED':
        const firstPort = metadata?.blockedPorts?.[0];

        if (firstPort) {
          actions.push({
            action: 'firewall',
            label: `Configure Port ${firstPort.port}`,
            variant: 'default',
            icon: Settings
          });
        }

        actions.push({
          action: 'firewall',
          label: 'View Firewall Rules',
          variant: 'default',
          icon: ExternalLink
        });
        break;

      case 'DEFENDER_DISABLED':
      case 'FIREWALL_DISABLED':
      case 'ANTIVIRUS_OUTDATED':
        actions.push({
          label: 'View Details',
          icon: Info,
          variant: 'default',
          action: 'info'
        });
        break;

      case 'HIGH_CPU_APP':
      case 'HIGH_RAM_APP':
        actions.push({
          label: 'View Processes',
          icon: Activity,
          variant: 'default',
          action: 'processes'
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
          action: 'info'
        });
        break;

      default:
        actions.push({
          label: 'More Information',
          icon: Info,
          variant: 'default',
          action: 'info'
        });
        break;
    }

    return { actions };
  };


  // Handle action button clicks
  const handleAction = (actionType) => {
    switch (actionType) {
      case 'reboot':
        setConfirmAction({
          type: 'reboot',
          title: 'Reboot Virtual Machine',
          description: `This VM urgently requires a reboot (${metadata?.rebootDays} days pending). The reboot will apply ${metadata?.totalUpdates || 0} pending updates and may take 5-10 minutes. Do you want to continue?`,
          confirmLabel: 'Reboot Now',
          variant: 'destructive'
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
            'The VM will be offline for approximately 5-10 minutes',
            'A notification will be sent before the scheduled reboot'
          ]
        });
        setShowInfoDialog(true);
        break;

      case 'install_updates':
        setConfirmAction({
          type: 'install_updates',
          title: 'Install System Updates',
          description: `${metadata?.totalUpdates || 0} updates will be installed (${metadata?.criticalCount || 0} critical, ${metadata?.securityCount || 0} security). This may require a reboot.`,
          confirmLabel: 'Install',
          variant: 'default'
        });
        setShowConfirmDialog(true);
        break;

      case 'install_security_updates':
        setConfirmAction({
          type: 'install_security_updates',
          title: 'Install Security Updates',
          description: `${metadata?.securityUpdateCount} critical security updates will be installed. This will protect the VM against known vulnerabilities.`,
          confirmLabel: 'Install Now',
          variant: 'destructive'
        });
        setShowConfirmDialog(true);
        break;

      case 'view_threats':
        const items = getRecommendationItems('DEFENDER_THREAT');
        setDialogContent({
          title: 'Detected Threats',
          description: items && items.length > 0
            ? `${metadata?.threatCount || 0} threats detected (${metadata?.activeThreats || 0} active, ${metadata?.quarantinedThreats || 0} quarantined)`
            : `${metadata?.activeThreats || 0} active threats, ${metadata?.quarantinedThreats || 0} quarantined`,
          items: items || [],
          type: 'threats'
        });
        setShowListDialog(true);
        break;

      case 'run_full_scan':
        setConfirmAction({
          type: 'run_full_scan',
          title: 'Run Full Scan',
          description: 'Windows Defender will run a full system scan. This may take 30-60 minutes and temporarily affect performance.',
          confirmLabel: 'Run Scan',
          variant: 'default'
        });
        setShowConfirmDialog(true);
        break;

      case 'firewall':
        setDialogContent({
          title: 'Firewall Configuration',
          description: metadata?.blockedPorts?.length > 0
            ? `${metadata.blockedPorts.length} blocked port(s) detected`
            : 'View and configure firewall rules',
          guidanceSteps: [
            'Navigate to the "Firewall" tab of this VM',
            'Review the rules that are blocking ports',
            metadata?.blockedPorts?.[0] ? `Configure an exception for port ${metadata.blockedPorts[0].port} (${metadata.blockedPorts[0].protocol})` : 'Configure the necessary exceptions',
            'Restart the VM if necessary to apply changes'
          ],
          type: 'firewall'
        });
        setShowInfoDialog(true);
        break;

      case 'info':
        const explanation = typeof info.userFriendlyExplanation === 'function'
          ? info.userFriendlyExplanation(recommendation)
          : info.userFriendlyExplanation;
        setDialogContent({
          title: `Information: ${info.label}`,
          description: explanation,
          technicalDetails: info.technicalDetails,
          actions: info.actions
        });
        setShowInfoDialog(true);
        break;

      case 'list':
        const listItems = getRecommendationItems(recommendation.type);
        setDialogContent({
          title: `Item List: ${info.label}`,
          description: listItems && listItems.length > 0
            ? `${listItems.length} items found`
            : 'No structured data available',
          items: listItems || [],
          type: recommendation.type
        });
        setShowListDialog(true);
        break;

      case 'processes':
        setDialogContent({
          title: "System Processes",
          description: "List of processes consuming the most resources",
          processes: getMockProcesses()
        });
        setShowInfoDialog(true);
        break;

      default:
        toast({
          title: "Action executed",
          description: "The action was executed successfully",
          variant: "default"
        });
    }
  };

  // Handle confirmation dialog actions
  const handleConfirm = async () => {
    if (!confirmAction) return;

    setShowConfirmDialog(false);

    switch (confirmAction.type) {
      case 'reboot':
        toast({
          title: "Reboot scheduled",
          description: "The VM will reboot shortly. You will receive a notification when complete.",
          variant: "default"
        });
        // TODO: Implement actual reboot mutation when available
        break;

      case 'install_updates':
      case 'install_security_updates':
        toast({
          title: "Installation started",
          description: "Updates are being installed. This may take several minutes.",
          variant: "default"
        });
        // TODO: Implement actual update installation when available
        break;

      case 'run_full_scan':
        toast({
          title: "Scan started",
          description: "Windows Defender is running a full scan.",
          variant: "default"
        });
        // TODO: Implement actual scan trigger when available
        break;

      default:
        toast({
          title: "Action completed",
          description: "The action was executed successfully.",
          variant: "default"
        });
    }

    setConfirmAction(null);
  };

  // Get recommendation-specific items list from real data
  const getRecommendationItems = (type) => {
    if (!recommendation.data) {
      return null;
    }

    let data;
    try {
      data = typeof recommendation.data === 'string'
        ? JSON.parse(recommendation.data)
        : recommendation.data;
    } catch (error) {
      console.error('Failed to parse recommendation data:', error);
      return null;
    }

    switch (type) {
      case 'OS_UPDATE_AVAILABLE':
      case 'SYSTEM_UPDATE_AVAILABLE':
        // Extract OS updates from data.updates array
        if (Array.isArray(data.updates)) {
          return data.updates.map(update => ({
            title: update.title || update.name,
            kb: update.kb || update.kbNumber,
            type: update.type || (update.isSecurity ? 'Security' : update.isQuality ? 'Quality' : 'Update'),
            size: update.size || update.downloadSize,
            requiresReboot: update.requiresReboot !== undefined ? update.requiresReboot : true
          }));
        }
        return null;

      case 'APP_UPDATE_AVAILABLE':
        // Extract app updates from data.applications or data.updates
        const apps = data.applications || data.apps || data.updates;
        if (Array.isArray(apps)) {
          return apps.map(app => ({
            name: app.name || app.appName,
            currentVersion: app.currentVersion || app.version,
            newVersion: app.newVersion || app.availableVersion,
            size: app.size || app.downloadSize,
            isSecurity: app.isSecurity || app.securityUpdate || false
          }));
        }
        return null;

      case 'DEFENDER_THREAT':
        // Extract threats from data.threats array
        if (Array.isArray(data.threats)) {
          return data.threats.map(threat => ({
            name: threat.name || threat.threatName,
            severity: threat.severity || threat.severityLevel || 'Unknown',
            status: threat.status || (threat.quarantined ? 'Quarantined' : 'Active'),
            detectionTime: threat.detectionTime || threat.detected || null,
            path: threat.path || threat.filePath
          }));
        }
        return null;

      case 'PORT_BLOCKED':
        // Already extracted in metadata.blockedPorts
        return metadata?.blockedPorts || null;

      default:
        return null;
    }
  };

  // Get mock process data for performance recommendations
  const getMockProcesses = () => {
    return [
      { name: 'chrome.exe', cpu: 25.4, memory: 512, pid: 1234 },
      { name: 'devenv.exe', cpu: 18.2, memory: 1024, pid: 2345 },
      { name: 'firefox.exe', cpu: 12.1, memory: 768, pid: 3456 },
      { name: 'code.exe', cpu: 8.7, memory: 456, pid: 4567 },
      { name: 'teams.exe', cpu: 6.3, memory: 892, pid: 5678 }
    ];
  };


  const actionConfig = getActionConfig(recommendation.type);

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Action Buttons */}
        {actionConfig.actions.map((action, index) => (
          action.comingSoon ? (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      size="sm"
                      variant={action.variant}
                      disabled
                      className="flex items-center gap-1 opacity-50 cursor-not-allowed"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.label}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              key={index}
              size="sm"
              variant={action.variant}
              onClick={() => handleAction(action.action)}
              className="flex items-center gap-1"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </Button>
          )
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className={confirmAction?.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}>
              {confirmAction?.confirmLabel || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Information Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              {dialogContent.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">{dialogContent.description}</p>

            {dialogContent.guidanceSteps && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Steps to follow:</h4>
                <ol className="space-y-2">
                  {dialogContent.guidanceSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 font-semibold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {dialogContent.technicalDetails && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Technical information:</h4>
                <p className="text-sm text-gray-600">{dialogContent.technicalDetails}</p>
              </div>
            )}

            {dialogContent.actions && dialogContent.actions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Recommended actions:</h4>
                <ul className="space-y-1">
                  {dialogContent.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dialogContent.processes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-3">Top resource-consuming processes:</h4>
                <div className="space-y-2">
                  {dialogContent.processes.map((process, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-mono">{process.name}</span>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>CPU: {process.cpu}%</span>
                        <span>RAM: {process.memory} MB</span>
                        <span>PID: {process.pid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Dialog */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600" />
              {dialogContent.title}
            </DialogTitle>
            <DialogDescription>
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dialogContent.items && dialogContent.items.length > 0 ? (
              dialogContent.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  {dialogContent.type === 'DEFENDER_THREAT' ? (
                    // Threat display
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <Badge variant={item.status === 'Active' ? 'destructive' : 'outline'} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Severity: {item.severity}</span>
                        {item.detectionTime && <span>Detected: {new Date(item.detectionTime).toLocaleDateString()}</span>}
                      </div>
                      {item.path && <p className="text-xs text-gray-500 mt-1 truncate">Path: {item.path}</p>}
                    </div>
                  ) : dialogContent.type === 'PORT_BLOCKED' ? (
                    // Port blocked display
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">Port {item.port} ({item.protocol})</h4>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>Process: {item.processName} {item.processId && `(PID: ${item.processId})`}</p>
                        {item.ruleName && <p>Rule: {item.ruleName}</p>}
                        {item.lastAttempt && <p>Last attempt: {new Date(item.lastAttempt).toLocaleString()}</p>}
                      </div>
                    </div>
                  ) : dialogContent.type === 'APP_UPDATE_AVAILABLE' ? (
                    // App update display
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.isSecurity && (
                            <Badge variant="destructive" className="text-xs">
                              Security
                            </Badge>
                          )}
                        </div>
                        {item.currentVersion && item.newVersion && (
                          <p className="text-xs text-gray-600">
                            {item.currentVersion} → {item.newVersion}
                          </p>
                        )}
                      </div>
                      {item.size && (
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{item.size}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // OS update display
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{item.title || item.name}</h4>
                          {item.type && (
                            <Badge
                              variant={item.type === 'Security' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {item.type}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-gray-600">
                          {item.kb && <span>KB: {item.kb}</span>}
                          {item.requiresReboot && <span className="text-orange-600">Requires reboot</span>}
                        </div>
                      </div>
                      {item.size && (
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{item.size}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No structured data available</p>
                <p className="text-xs mt-1">Detailed data will appear when available</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowListDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default RecommendationActions;
