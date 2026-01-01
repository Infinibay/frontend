'use client';

/**
 * EmptyState Component
 *
 * Displayed when there are no automations.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Blocks, Plus, Zap } from 'lucide-react';

export function EmptyState({ onCreateClick }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Blocks className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold mb-2">No automations yet</h3>
          <p className="text-muted-foreground mb-6">
            Automations let you create visual rules that monitor your VMs and take action when conditions are met.
            Build your first automation using our visual block editor.
          </p>

          {/* Action */}
          <Button onClick={onCreateClick} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Automation
          </Button>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t w-full">
            <p className="text-sm text-muted-foreground mb-3">Quick tips to get started:</p>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use Health Data blocks to monitor CPU, memory, and disk usage
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Combine with Comparison blocks to set thresholds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Add Action blocks to trigger notifications when conditions match
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyState;
