import React from 'react';
import { Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NetworkTab = ({ vm }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Network className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Network Configuration</CardTitle>
          <CardDescription>
            Network settings and diagnostics coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This feature is under development. You'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-left inline-block">
            <li>• View network interfaces</li>
            <li>• Configure IP settings</li>
            <li>• Monitor network traffic</li>
            <li>• Run network diagnostics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTab;