import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { List, LayoutGrid } from 'lucide-react';
import { getGlassClasses } from '@/utils/glass-effects';
import { useSizeContext, sizeVariants } from '@/components/ui/size-provider';
import { cn } from '@/lib/utils';

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
      "p-4 flex items-center justify-between"
    )}>
      <TabsList className="h-10">
        <TabsTrigger
          value="computers"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "px-4 py-2"
          )}
        >
          Computers
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className={cn(
            "data-[state=active]:text-glass-text-primary",
            "data-[state=inactive]:text-glass-text-secondary",
            "px-4 py-2"
          )}
        >
          Security
        </TabsTrigger>
      </TabsList>

      <Button
        variant="outline"
        size="icon"
        onClick={onViewModeToggle}
        className="h-10 w-10"
      >
        {viewMode === "grid" ? (
          <List className="h-4 w-4" />
        ) : (
          <LayoutGrid className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default TabControls;
