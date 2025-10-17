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
            label: 'Reiniciar Ahora',
            variant: 'destructive',
            icon: AlertTriangle
          });
        } else if (metadata?.rebootDays >= 3) {
          actions.push({
            action: 'schedule_reboot',
            label: 'Programar Reinicio',
            variant: 'default',
            icon: Calendar
          });
        }

        actions.push({
          action: 'install_updates',
          label: 'Instalar Actualizaciones',
          variant: 'default',
          icon: RefreshCw
        });

        actions.push({
          action: 'list',
          label: 'Ver Actualizaciones',
          variant: 'default',
          icon: List
        });
        break;

      case 'APP_UPDATE_AVAILABLE':
        if (metadata?.securityUpdateCount > 0) {
          actions.push({
            action: 'install_security_updates',
            label: `Instalar Actualizaciones de Seguridad (${metadata.securityUpdateCount})`,
            variant: 'destructive',
            icon: Shield
          });
        }

        actions.push({
          action: 'list',
          label: `Ver Todas (${metadata?.totalUpdateCount || 0})`,
          variant: 'default',
          icon: List
        });
        break;

      case 'DEFENDER_THREAT':
        actions.push({
          action: 'view_threats',
          label: 'Ver Amenazas',
          variant: metadata?.activeThreats > 0 ? 'destructive' : 'default',
          icon: AlertTriangle
        });

        actions.push({
          action: 'run_full_scan',
          label: 'Ejecutar Análisis Completo',
          variant: 'default',
          icon: Shield
        });
        break;

      case 'PORT_BLOCKED':
        const firstPort = metadata?.blockedPorts?.[0];

        if (firstPort) {
          actions.push({
            action: 'firewall',
            label: `Configurar Puerto ${firstPort.port}`,
            variant: 'default',
            icon: Settings
          });
        }

        actions.push({
          action: 'firewall',
          label: 'Ver Reglas de Firewall',
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
          label: 'Más Información',
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
          title: 'Reiniciar Máquina Virtual',
          description: `Esta VM requiere reinicio urgentemente (${metadata?.rebootDays} días pendiente). El reinicio aplicará ${metadata?.totalUpdates || 0} actualizaciones pendientes y puede tomar 5-10 minutos. ¿Desea continuar?`,
          confirmLabel: 'Reiniciar Ahora',
          variant: 'destructive'
        });
        setShowConfirmDialog(true);
        break;

      case 'schedule_reboot':
        setDialogContent({
          title: 'Programar Reinicio',
          description: `Sistema esperando reinicio por ${metadata?.rebootDays} días. Programe un reinicio para aplicar ${metadata?.totalUpdates || 0} actualizaciones.`,
          guidanceSteps: [
            'Seleccione una fecha y hora conveniente',
            'El reinicio aplicará todas las actualizaciones pendientes',
            'La VM estará offline por aproximadamente 5-10 minutos',
            'Se enviará una notificación antes del reinicio programado'
          ]
        });
        setShowInfoDialog(true);
        break;

      case 'install_updates':
        setConfirmAction({
          type: 'install_updates',
          title: 'Instalar Actualizaciones de Windows',
          description: `Se instalarán ${metadata?.totalUpdates || 0} actualizaciones (${metadata?.criticalCount || 0} críticas, ${metadata?.securityCount || 0} de seguridad). Esto puede requerir reinicio.`,
          confirmLabel: 'Instalar',
          variant: 'default'
        });
        setShowConfirmDialog(true);
        break;

      case 'install_security_updates':
        setConfirmAction({
          type: 'install_security_updates',
          title: 'Instalar Actualizaciones de Seguridad',
          description: `Se instalarán ${metadata?.securityUpdateCount} actualizaciones de seguridad críticas. Esto protegerá la VM contra vulnerabilidades conocidas.`,
          confirmLabel: 'Instalar Ahora',
          variant: 'destructive'
        });
        setShowConfirmDialog(true);
        break;

      case 'view_threats':
        const items = getRecommendationItems('DEFENDER_THREAT');
        setDialogContent({
          title: 'Amenazas Detectadas',
          description: items && items.length > 0
            ? `${metadata?.threatCount || 0} amenazas detectadas (${metadata?.activeThreats || 0} activas, ${metadata?.quarantinedThreats || 0} en cuarentena)`
            : `${metadata?.activeThreats || 0} amenazas activas, ${metadata?.quarantinedThreats || 0} en cuarentena`,
          items: items || [],
          type: 'threats'
        });
        setShowListDialog(true);
        break;

      case 'run_full_scan':
        setConfirmAction({
          type: 'run_full_scan',
          title: 'Ejecutar Análisis Completo',
          description: 'Windows Defender ejecutará un análisis completo del sistema. Esto puede tomar 30-60 minutos y afectar el rendimiento temporalmente.',
          confirmLabel: 'Ejecutar Análisis',
          variant: 'default'
        });
        setShowConfirmDialog(true);
        break;

      case 'firewall':
        setDialogContent({
          title: 'Configuración de Firewall',
          description: metadata?.blockedPorts?.length > 0
            ? `${metadata.blockedPorts.length} puerto(s) bloqueado(s) detectado(s)`
            : 'Ver y configurar reglas de firewall',
          guidanceSteps: [
            'Navegue a la pestaña "Firewall" de esta VM',
            'Revise las reglas que están bloqueando puertos',
            metadata?.blockedPorts?.[0] ? `Configure una excepción para el puerto ${metadata.blockedPorts[0].port} (${metadata.blockedPorts[0].protocol})` : 'Configure las excepciones necesarias',
            'Reinicie la VM si es necesario para aplicar cambios'
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
          title: `Información: ${info.label}`,
          description: explanation,
          technicalDetails: info.technicalDetails,
          actions: info.actions
        });
        setShowInfoDialog(true);
        break;

      case 'list':
        const listItems = getRecommendationItems(recommendation.type);
        setDialogContent({
          title: `Lista de elementos: ${info.label}`,
          description: listItems && listItems.length > 0
            ? `${listItems.length} elementos encontrados`
            : 'No hay datos estructurados disponibles',
          items: listItems || [],
          type: recommendation.type
        });
        setShowListDialog(true);
        break;

      case 'processes':
        setDialogContent({
          title: "Procesos del sistema",
          description: "Lista de procesos que consumen más recursos",
          processes: getMockProcesses()
        });
        setShowInfoDialog(true);
        break;

      default:
        toast({
          title: "Acción ejecutada",
          description: "La acción se ha ejecutado correctamente",
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
          title: "Reinicio programado",
          description: "La VM se reiniciará en breve. Recibirá una notificación cuando complete.",
          variant: "default"
        });
        // TODO: Implement actual reboot mutation when available
        break;

      case 'install_updates':
      case 'install_security_updates':
        toast({
          title: "Instalación iniciada",
          description: "Las actualizaciones se están instalando. Esto puede tomar varios minutos.",
          variant: "default"
        });
        // TODO: Implement actual update installation when available
        break;

      case 'run_full_scan':
        toast({
          title: "Análisis iniciado",
          description: "Windows Defender está ejecutando un análisis completo.",
          variant: "default"
        });
        // TODO: Implement actual scan trigger when available
        break;

      default:
        toast({
          title: "Acción completada",
          description: "La acción se ejecutó correctamente.",
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
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className={confirmAction?.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}>
              {confirmAction?.confirmLabel || 'Confirmar'}
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
                <h4 className="font-medium text-sm mb-2">Pasos a seguir:</h4>
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
                <h4 className="font-medium text-sm mb-2">Información técnica:</h4>
                <p className="text-sm text-gray-600">{dialogContent.technicalDetails}</p>
              </div>
            )}

            {dialogContent.actions && dialogContent.actions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Acciones recomendadas:</h4>
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
                <h4 className="font-medium text-sm mb-3">Procesos con mayor consumo:</h4>
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
            <Button onClick={() => setShowInfoDialog(false)}>Cerrar</Button>
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
                        <span>Severidad: {item.severity}</span>
                        {item.detectionTime && <span>Detectado: {new Date(item.detectionTime).toLocaleDateString()}</span>}
                      </div>
                      {item.path && <p className="text-xs text-gray-500 mt-1 truncate">Ruta: {item.path}</p>}
                    </div>
                  ) : dialogContent.type === 'PORT_BLOCKED' ? (
                    // Port blocked display
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">Puerto {item.port} ({item.protocol})</h4>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>Proceso: {item.processName} {item.processId && `(PID: ${item.processId})`}</p>
                        {item.ruleName && <p>Regla: {item.ruleName}</p>}
                        {item.lastAttempt && <p>Último intento: {new Date(item.lastAttempt).toLocaleString()}</p>}
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
                              Seguridad
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
                          {item.requiresReboot && <span className="text-orange-600">Requiere reinicio</span>}
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
                <p className="text-sm">No hay datos estructurados disponibles</p>
                <p className="text-xs mt-1">Los datos detallados aparecerán cuando estén disponibles</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowListDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default RecommendationActions;
