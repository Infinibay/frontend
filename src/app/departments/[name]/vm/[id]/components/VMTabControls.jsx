import React from "react";
import { TabList, Tab, Button } from "@infinibay/harbor";
import { RefreshCw, Lightbulb, Shield, FileCode } from 'lucide-react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-tab-controls');

/**
 * Tab controls component for the VM detail page
 * Note: Tab state is managed by parent Tabs component from Harbor
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
        <TabList>
          <Tab value="recommendations" icon={<Lightbulb className="size-icon" />}>
            Recommendations
          </Tab>
          <Tab value="firewall" icon={<Shield className="size-icon" />}>
            Security
          </Tab>
          <Tab value="scripts" icon={<FileCode className="size-icon" />}>
            Scripts
          </Tab>
        </TabList>

        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="size-icon" />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default VMTabControls;
