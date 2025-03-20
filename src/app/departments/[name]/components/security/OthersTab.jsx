import React from 'react';
import { Card } from "@/components/ui/card";
import { Monitor } from 'lucide-react';

/**
 * OthersTab Component
 * Displays the other security settings tab
 */
const OthersTab = () => {
  return (
    <Card className="p-6 border-2 border-muted shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Other Security Settings</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        This section will contain additional security settings in future implementations.
      </p>
    </Card>
  );
};

export default OthersTab;
