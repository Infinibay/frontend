import React from 'react';
import { Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MockDataBadge } from '@/components/ui/mock-data-badge';

const ServicesTab = ({ vm }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md relative">
        <MockDataBadge position="top-right" variant="info" size="sm">
          Coming Soon
        </MockDataBadge>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Server className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Services Control</CardTitle>
          <CardDescription>
            System services management will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This feature is under development. You'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-left inline-block">
            <li>• View running services</li>
            <li>• Start, stop, and restart services</li>
            <li>• Configure service auto-start</li>
            <li>• Monitor service health</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesTab;