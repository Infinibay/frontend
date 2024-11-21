import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';
import DualList from './dual-list';
import { Spinner } from './spinner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// App status constants
export const APP_STATUS = {
  INSTALLED: 'installed',
  NOT_INSTALLED: 'not-installed',
  INSTALLING: 'installing',
  UNINSTALLING: 'uninstalling'
};

const AppInstaller = ({
  availableApps = [],
  installedApps = [],
  onInstall,
  onUninstall,
  className
}) => {
  const [apps, setApps] = useState({
    available: availableApps,
    installed: installedApps
  });

  const [processingApps, setProcessingApps] = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleStatusChange = useCallback(async (appId, newStatus, callback) => {
    setProcessingApps(prev => new Set([...prev, appId]));
    
    try {
      await callback();
    } finally {
      setProcessingApps(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }
  }, []);

  const renderApp = useCallback((app, { isDragging, overlay } = {}) => {
    const isProcessing = processingApps.has(app.id);

    console.log('Rendering app:', app.name, 'isDragging:', isDragging); // Debug log

    if (isDragging) {
      return null;
    }

    return (
      <div
        className={cn(
          "relative p-4 bg-white rounded-lg border transition-all",
          "hover:shadow-lg hover:border-primary/20",
          overlay && "shadow-xl shadow-gray-400/20 dark:shadow-black/50 scale-105",
          isProcessing ? "opacity-75" : "hover:scale-[1.02]",
        )}
      >
        <div className="flex items-start gap-3">
          {app.icon && (
            <img 
              src={app.icon} 
              alt={`${app.name} icon`}
              className="w-12 h-12 object-contain"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-foreground/90 truncate">
              {app.name}
            </h3>
            {app.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {app.description}
              </p>
            )}
          </div>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
              <Spinner className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    );
  }, [processingApps]);

  const canDrag = useCallback((item) => {
    return !['installing', 'uninstalling'].includes(item.status);
  }, []);

  const handleChange = async ({ leftItems, rightItems }) => {
    // Find which app was moved by comparing the previous state
    const newlyInstalled = rightItems.find(
      app => !apps.installed.find(a => a.id === app.id)
    );
    const newlyUninstalled = leftItems.find(
      app => !apps.available.find(a => a.id === app.id)
    );

    if (newlyInstalled) {
      handleStatusChange(newlyInstalled.id, APP_STATUS.INSTALLING, async () => {
        if (onInstall) {
          await onInstall(newlyInstalled);
        }
        setApps({
          available: leftItems,
          installed: rightItems
        });
      });
    } else if (newlyUninstalled) {
      handleStatusChange(newlyUninstalled.id, APP_STATUS.UNINSTALLING, async () => {
        if (onUninstall) {
          await onUninstall(newlyUninstalled);
        }
        setApps({
          available: leftItems,
          installed: rightItems
        });
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeApp = [...apps.available, ...apps.installed].find(app => app.id === active.id);
    if (!activeApp) return;

    const isMovingToInstalled = apps.available.find(app => app.id === active.id);
    
    if (isMovingToInstalled) {
      handleStatusChange(activeApp.id, APP_STATUS.INSTALLING, async () => {
        if (onInstall) {
          await onInstall(activeApp);
        }
        setApps(prev => ({
          available: prev.available.filter(a => a.id !== activeApp.id),
          installed: [...prev.installed, activeApp]
        }));
      });
    } else {
      handleStatusChange(activeApp.id, APP_STATUS.UNINSTALLING, async () => {
        if (onUninstall) {
          await onUninstall(activeApp);
        }
        setApps(prev => ({
          installed: prev.installed.filter(a => a.id !== activeApp.id),
          available: [...prev.available, activeApp]
        }));
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("grid gap-8", className)}>
        <DualList
          leftTitle="Available Apps"
          rightTitle="Installed Apps"
          leftItems={apps.available}
          rightItems={apps.installed}
          renderItem={renderApp}
          onChange={handleChange}
          canDrag={canDrag}
        />
      </div>
    </DndContext>
  );
};

AppInstaller.propTypes = {
  availableApps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.string
    })
  ),
  installedApps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.string
    })
  ),
  onInstall: PropTypes.func,
  onUninstall: PropTypes.func,
  className: PropTypes.string
};

export default AppInstaller;
