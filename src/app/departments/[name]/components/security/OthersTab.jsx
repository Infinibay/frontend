import React from 'react';
import { Card } from "@/components/ui/card";
import Image from 'next/image';

/**
 * OthersTab Component
 * Displays the other security settings tab
 */
const OthersTab = () => {
  return (
    <Card className="p-12 border-2 border-muted shadow-md">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-48 h-48 flex items-center justify-center">
          <Image
            src="/images/under-construction.svg"
            alt="Under Construction"
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">Under Construction</h3>
          <p className="text-lg text-muted-foreground max-w-md">
            This section is currently being developed. New security features will be available here soon.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Stay tuned for updates!
        </div>
      </div>
    </Card>
  );
};

export default OthersTab;
