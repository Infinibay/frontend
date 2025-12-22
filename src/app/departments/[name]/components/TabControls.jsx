import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { List, LayoutGrid, FileCode, Network } from 'lucide-react';
import { getGlassClasses } from '@/utils/glass-effects';
import { useSizeContext, sizeVariants } from '@/components/ui/size-provider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/**
 * Tab controls component for the department page
 */
const TabControls = ({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeToggle
}) => {
  const { size } = useSizeContext();

  return (
    <div className={cn(
      getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }),
      "size-padding flex items-center justify-between"
    )}>
      <TabsList className="h-10">
        <TabsTrigger
          value="computers"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "size-padding"
          )}
        >
          Computers
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "size-padding"
          )}
        >
          Security
        </TabsTrigger>
        <TabsTrigger
          value="scripts"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "size-padding"
          )}
        >
          <FileCode className="h-4 w-4 mr-2" />
          Scripts
        </TabsTrigger>
        <TabsTrigger
          value="network"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "size-padding"
          )}
        >
          <Network className="h-4 w-4 mr-2" />
          Network
        </TabsTrigger>
      </TabsList>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onViewModeToggle}
            className="h-10 w-10 hover:bg-accent hover:border-primary/50"
            aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TabControls;
