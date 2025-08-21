import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import DualList from './dual-list';
import { Spinner } from './spinner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";

// App status constants
export const APP_STATUS = {
  INSTALLED: 'installed',
  NOT_INSTALLED: 'not-installed',
  INSTALLING: 'installing',
  UNINSTALLING: 'uninstalling'
};

const AppInstaller = ({
  className,
  onInstall,
  onUninstall,
  apps = {
    available: [],
    installed: []
  },
  size = "md"
}) => {
  const [processingApps, setProcessingApps] = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 16,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 16,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 16,
      },
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

    const sizeClasses = {
      sm: "p-2 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
      xl: "p-8 text-xl"
    };

    return (
      <div
        className={cn(
          "relative rounded-lg border p-4 transition-colors hover:bg-accent bg-white",
          {
            "cursor-grab": !isProcessing,
            "cursor-not-allowed": isProcessing,
          }
        )}
      >
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/20 backdrop-blur-[1px]">
            <Spinner 
              speed="medium"
              className={cn({
                "w-6 h-6": size === "sm",
                "w-8 h-8": size === "md",
                "w-10 h-10": size === "lg",
                "w-12 h-12": size === "xl",
              })} 
            />
          </div>
        )}
        <div className={cn(
          "flex gap-4",
          { "blur-[0.5px]": isProcessing }
        )}>
          <div className={cn(
            "relative flex items-center justify-center rounded-md border bg-background",
            {
              "w-8 h-8": size === "sm",
              "w-10 h-10": size === "md",
              "w-12 h-12": size === "lg",
              "w-14 h-14": size === "xl",
            }
          )}>
            <div className="flex items-center justify-center">
              {app.iconType === 'svg' && app.icon ? (
                <div 
                  className={cn(
                    "flex items-center justify-center overflow-hidden",
                    {
                      "w-6 h-6": size === "sm",
                      "w-8 h-8": size === "md",
                      "w-10 h-10": size === "lg",
                      "w-12 h-12": size === "xl",
                    }
                  )}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: app.icon.replace('<svg', '<svg style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;"') 
                  }}
                />
              ) : (
                <Image 
                  src={app.icon || app.fallbackIcon || 'https://cdn.simpleicons.org/2k'} 
                  alt={`${app.name} icon`}
                  width={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
                  height={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
                  className={cn(
                    "object-contain",
                    {
                      "w-6 h-6": size === "sm",
                      "w-8 h-8": size === "md",
                      "w-10 h-10": size === "lg",
                      "w-12 h-12": size === "xl",
                    }
                  )}
                />
              )}
            </div>
          </div>
          <div>
            <h3 className={cn(
              "font-semibold",
              {
                "text-sm": size === "sm",
                "text-base": size === "md",
                "text-lg": size === "lg",
                "text-xl": size === "xl",
              }
            )}>
              {app.name}
            </h3>
            <p className={cn(
              "text-muted-foreground",
              {
                "text-xs": size === "sm",
                "text-sm": size === "md",
                "text-base": size === "lg",
                "text-lg": size === "xl",
              }
            )}>
              {app.description}
            </p>
          </div>
        </div>
      </div>
    );
  }, [processingApps, size]);

  const canDrag = useCallback((item) => {
    return !['installing', 'uninstalling'].includes(item.status);
  }, []);

  const handleChange = async ({ leftItems, rightItems }) => {
    // Find all apps that were moved by comparing with the previous state
    const newlyInstalled = rightItems.filter(
      app => !apps.installed.find(a => a.id === app.id)
    );
    const newlyUninstalled = leftItems.filter(
      app => !apps.available.find(a => a.id === app.id)
    );

    // Process installations in parallel
    if (newlyInstalled.length > 0) {
      const installPromises = newlyInstalled.map(app => 
        handleStatusChange(app.id, APP_STATUS.INSTALLING, async () => {
          if (onInstall) {
            await onInstall(app);
          }
          apps.installed.push(app);
          apps.available = apps.available.filter(a => a.id !== app.id);
        })
      );
      await Promise.all(installPromises);
    }

    // Process uninstallations in parallel
    if (newlyUninstalled.length > 0) {
      const uninstallPromises = newlyUninstalled.map(app =>
        handleStatusChange(app.id, APP_STATUS.UNINSTALLING, async () => {
          if (onUninstall) {
            await onUninstall(app);
          }
          apps.available.push(app);
          apps.installed = apps.installed.filter(a => a.id !== app.id);
        })
      );
      await Promise.all(uninstallPromises);
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
        apps.installed.push(activeApp);
        apps.available = apps.available.filter(a => a.id !== activeApp.id);
      });
    } else {
      handleStatusChange(activeApp.id, APP_STATUS.UNINSTALLING, async () => {
        if (onUninstall) {
          await onUninstall(activeApp);
        }
        apps.available.push(activeApp);
        apps.installed = apps.installed.filter(a => a.id !== activeApp.id);
      });
    }
  };

  let moveRight = (
    <>
      <DownloadIcon className="mr-2 h-4 w-4" />
      Install
    </>
  );

  let moveLeft = (
    <>
      <TrashIcon className="mr-2 h-4 w-4" />
      Uninstall
    </>
  );

  return (
    <DndContext
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
          sensors={sensors}
          moveRight={moveRight}
          moveLeft={moveLeft}
        />
      </div>
    </DndContext>
  );
};

AppInstaller.propTypes = {
  apps: PropTypes.shape({
    available: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    installed: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string
      })
    )
  }),
  onInstall: PropTypes.func,
  onUninstall: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default AppInstaller;
