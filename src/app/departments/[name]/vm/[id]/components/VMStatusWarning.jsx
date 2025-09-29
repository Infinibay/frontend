import React, { useState } from 'react';
import { AlertTriangle, Power, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { usePowerOffMutation } from '@/gql/hooks';

const VMStatusWarning = ({
  vmStatus,
  vmId,
  vmName,
  onVMStopped
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [powerOffMachine, { loading: poweringOff }] = usePowerOffMutation();

  // Don't show warning if VM is already stopped
  if (vmStatus !== 'running') {
    return null;
  }

  const handleStopVM = async () => {
    try {
      await powerOffMachine({
        variables: { id: vmId }
      });
      setIsConfirmOpen(false);
      if (onVMStopped) {
        onVMStopped();
      }
    } catch (error) {
      console.error('Error stopping VM:', error);
      // Error handling will be shown by the mutation component
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Warning Alert */}
      <Alert variant="warning" className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="space-y-3">
          <div className="font-medium text-yellow-800">
            The virtual machine must be turned off to modify the firewall configuration
          </div>

          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>Why is this necessary?</strong> Firewall rules are applied during
              virtual machine startup. Changes made while it is running
              will not take effect until the next restart.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                <Power className="h-3 w-3 mr-1" />
                Current status: Running
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  disabled={poweringOff}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {poweringOff ? 'Shutting down...' : 'Shutdown Virtual Machine'}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Confirm virtual machine shutdown
                  </DialogTitle>
                  <DialogDescription className="space-y-3 text-sm">
                    <p>
                      You are about to shut down the virtual machine <strong>{vmName}</strong>.
                    </p>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        ⚠️ Important precautions:
                      </h4>
                      <ul className="text-yellow-700 space-y-1 text-xs">
                        <li>• Make sure you have saved all your work</li>
                        <li>• Close all important applications</li>
                        <li>• This process may take 1-2 minutes</li>
                        <li>• The VM will shut down safely</li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      Estimated time: 30-120 seconds
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmOpen(false)}
                    disabled={poweringOff}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStopVM}
                    disabled={poweringOff}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {poweringOff ? 'Shutting down...' : 'Shutdown Now'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </AlertDescription>
      </Alert>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm space-y-2">
            <h4 className="font-medium text-blue-800">
              Recommendations for firewall changes
            </h4>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• Make changes during maintenance windows</li>
              <li>• Plan changes during off-peak hours</li>
              <li>• Test rules in a development environment first</li>
              <li>• Document all changes made</li>
              <li>• Have a rollback plan ready</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Impact Notice */}
      <Alert className="border-gray-200 bg-gray-50">
        <Clock className="h-4 w-4 text-gray-500" />
        <AlertDescription className="text-sm text-gray-600">
          <strong>Performance impact:</strong> Firewall changes require a
          temporary restart to apply correctly. This is a limitation of the
          libvirt virtualization system to ensure security.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VMStatusWarning;