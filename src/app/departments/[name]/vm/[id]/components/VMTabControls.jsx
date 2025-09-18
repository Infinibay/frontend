import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb, Shield } from 'lucide-react';

/**
 * Tab controls component for the VM detail page
 * Note: Tab state is managed by parent Tabs component from Radix UI
 */
const VMTabControls = ({
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <TabsList>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger
            value="firewall"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Firewall
          </TabsTrigger>
        </TabsList>
        
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export default VMTabControls;
