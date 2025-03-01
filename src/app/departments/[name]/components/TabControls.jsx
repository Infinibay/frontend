import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, List, LayoutGrid } from 'lucide-react';

/**
 * Tab controls component for the department page
 */
const TabControls = ({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  onViewModeToggle, 
  onNewComputer 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <TabsList>
          <TabsTrigger 
            value="computers" 
            onClick={() => onTabChange("computers")}
            data-state={activeTab === "computers" ? "active" : ""}
          >
            Computers
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            onClick={() => onTabChange("security")}
            data-state={activeTab === "security" ? "active" : ""}
          >
            Security
          </TabsTrigger>
        </TabsList>
        <Button 
          variant="default" 
          size="sm"
          className="ml-2"
          onClick={onNewComputer}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Computer
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onViewModeToggle}
          className="ml-2"
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TabControls;
