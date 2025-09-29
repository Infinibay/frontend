import React, { useState } from 'react';
import { Info, List, Settings, Activity } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { getRecommendationInfo, requiresImmediateAction } from '@/utils/recommendationTypeMapper';


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
  const [dialogContent, setDialogContent] = useState({ title: '', description: '', items: [] });
  const info = getRecommendationInfo(recommendation.type);


  // Get action button configuration (only secondary actions, no automation)
  const getActionConfig = (type) => {
    const configs = {
      // Security actions
      DEFENDER_DISABLED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      FIREWALL_DISABLED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      ANTIVIRUS_OUTDATED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },

      // Performance actions
      HIGH_CPU_APP: {
        actions: [
          { label: 'View Processes', icon: Activity, variant: 'default', action: 'processes' }
        ]
      },
      HIGH_RAM_APP: {
        actions: [
          { label: 'View Processes', icon: Activity, variant: 'default', action: 'processes' }
        ]
      },
      SLOW_DISK_PERFORMANCE: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },

      // Storage actions
      DISK_SPACE_LOW: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      TEMP_FILES_CLEANUP: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      LOG_FILES_LARGE: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },

      // Update actions
      APP_UPDATE_AVAILABLE: {
        actions: [
          { label: 'View List', icon: List, variant: 'default', action: 'list' }
        ]
      },
      SYSTEM_UPDATE_AVAILABLE: {
        actions: [
          { label: 'View List', icon: List, variant: 'default', action: 'list' }
        ]
      },
      DRIVER_UPDATE_AVAILABLE: {
        actions: [
          { label: 'View List', icon: List, variant: 'default', action: 'list' }
        ]
      },

      // Resource optimization
      OVER_PROVISIONED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      UNDER_PROVISIONED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },

      // Network
      PORT_BLOCKED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },

      // Maintenance actions
      SCHEDULED_RESTART: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      BACKUP_RECOMMENDED: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      },
      MAINTENANCE_WINDOW: {
        actions: [
          { label: 'View Details', icon: Info, variant: 'default', action: 'info' }
        ]
      }
    };

    return configs[type] || {
      actions: [
        { label: 'Más Información', icon: Info, variant: 'default', action: 'info' }
      ]
    };
  };


  // Handle action button clicks
  const handleAction = (actionType) => {
    switch (actionType) {
      case 'info':
        setDialogContent({
          title: `Información: ${info.label}`,
          description: info.userFriendlyExplanation,
          technicalDetails: info.technicalDetails,
          actions: info.actions
        });
        setShowInfoDialog(true);
        break;

      case 'list':
        const items = getRecommendationItems(recommendation.type);
        setDialogContent({
          title: `Lista de elementos: ${info.label}`,
          description: `Found ${items?.length || 0} available items`,
          items: items || []
        });
        setShowListDialog(true);
        break;

      case 'configure':
        toast({
          title: "Configuración",
          description: "Configuration options will be shown in a future version",
          variant: "default"
        });
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

  // Get recommendation-specific items list
  const getRecommendationItems = (type) => {
    const mockData = {
      'APP_UPDATE_AVAILABLE': [
        { name: 'Google Chrome', version: '120.0.6099.130', size: '95.2 MB' },
        { name: 'Microsoft Office', version: '2021', size: '2.1 GB' },
        { name: 'Adobe Acrobat Reader', version: '23.008.20470', size: '156 MB' }
      ],
      'SYSTEM_UPDATE_AVAILABLE': [
        { name: 'Windows Security Update', kb: 'KB5034441', size: '45.2 MB', type: 'Security' },
        { name: 'Cumulative Update', kb: 'KB5034203', size: '127 MB', type: 'Quality' }
      ],
      'DRIVER_UPDATE_AVAILABLE': [
        { name: 'Intel Graphics Driver', version: '31.0.101.3430', size: '425 MB' },
        { name: 'Realtek Audio Driver', version: '6.0.9420.1', size: '15.8 MB' }
      ]
    };
    return mockData[type] || null;
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
            {dialogContent.items && dialogContent.items.map((item, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {item.version && (
                      <p className="text-xs text-gray-600">Version: {item.version}</p>
                    )}
                    {item.kb && (
                      <p className="text-xs text-gray-600">KB: {item.kb}</p>
                    )}
                    {item.type && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Tamaño: {item.size}</p>
                  </div>
                </div>
              </div>
            ))}
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