import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SecurityTab = ({ vm }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Firewall and security configuration coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This feature is under development. You'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-left inline-block">
            <li>• Configure firewall rules</li>
            <li>• Apply security templates</li>
            <li>• View security alerts</li>
            <li>• Manage access control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;