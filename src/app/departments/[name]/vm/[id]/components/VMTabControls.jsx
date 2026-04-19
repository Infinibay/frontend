import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb, Shield, FileCode } from 'lucide-react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-tab-controls');

/**
 * Tab controls component for the VM detail page
 * Note: Tab state is managed by parent Tabs component from Radix UI
 */
const VMTabControls = ({
  onRefresh
}) => {
  const handleRefresh = () => {
    debug.log('VM refresh requested');
    onRefresh?.();
  };

  return (
    <div className="flex items-center justify-between my-6 py-2">
      <div className="flex items-center size-gap">
        <TabsList className="glass-subtle">
          <TabsTrigger
            value="recommendations"
            className="flex items-center size-gap size-text"
          >
            <Lightbulb className="size-icon" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger
            value="firewall"
            className="flex items-center size-gap size-text"
          >
            <Shield className="size-icon" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="scripts"
            className="flex items-center size-gap size-text"
          >
            <FileCode className="size-icon" />
            Scripts
          </TabsTrigger>
        </TabsList>

        <Button
          variant="outline"
          size="sm"
          className="size-button"
          onClick={handleRefresh}
        >
          <RefreshCw className="size-icon mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default VMTabControls;
