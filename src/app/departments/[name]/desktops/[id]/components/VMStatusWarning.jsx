import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  ResponsiveStack,
} from '@infinibay/harbor';
import { AlertTriangle, Clock, Info, Power } from 'lucide-react';
import { usePowerOffMutation } from '@/gql/hooks';
import { toast } from '@/hooks/use-toast';

const VMStatusWarning = ({ vmStatus, vmSetupComplete, vmId, vmName, onVMStopped }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [powerOffMachine, { loading: poweringOff }] = usePowerOffMutation();

  // Only warn when the VM is fully up and the user could meaningfully change
  // firewall rules. While still installing there's nothing to warn about.
  if (vmStatus !== 'running' || !vmSetupComplete) return null;

  const handleStopVM = async () => {
    try {
      // powerOff returns SuccessType { success, message } and only THROWS on a
      // transport/GraphQL error — a resolver failure (e.g. QEMU refused to stop)
      // comes back as success:false with HTTP 200. Inspect it explicitly so we
      // don't close the dialog and report a shutdown that never happened.
      const { data } = await powerOffMachine({ variables: { id: vmId } });
      const result = data?.powerOff;
      if (result && result.success === false) {
        toast({
          title: 'Could not shut down desktop',
          description: result.message || 'The desktop could not be stopped.',
          variant: 'error',
        });
        return;
      }
      toast({
        title: 'Shutting down',
        description: 'The desktop is powering off. This may take up to 2 minutes.',
        variant: 'success',
      });
      setIsConfirmOpen(false);
      onVMStopped?.();
    } catch (error) {
      toast({
        title: 'Could not shut down desktop',
        description: error?.message || 'The desktop could not be stopped.',
        variant: 'error',
      });
    }
  };

  return (
    <ResponsiveStack direction="col" gap={3}>
      <Alert
        tone="warning"
        icon={<AlertTriangle size={14} />}
        title="The desktop must be turned off to modify the firewall configuration"
        actions={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Badge tone="warning" icon={<Power size={12} />}>
              Current status: Running
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              icon={<Power size={14} />}
              disabled={poweringOff}
              onClick={() => setIsConfirmOpen(true)}
            >
              {poweringOff ? 'Shutting down…' : 'Shutdown desktop'}
            </Button>
          </ResponsiveStack>
        }
      >
        Firewall rules are applied during desktop startup. Changes made while it
        is running will not take effect until the next restart.
      </Alert>

      <Alert
        tone="info"
        icon={<Info size={14} />}
        title="Recommendations for firewall changes"
      >
        <ResponsiveStack direction="col" gap={1}>
          <span>• Make changes during maintenance windows</span>
          <span>• Plan changes during off-peak hours</span>
          <span>• Test rules in a development environment first</span>
          <span>• Document all changes made</span>
          <span>• Have a rollback plan ready</span>
        </ResponsiveStack>
      </Alert>

      <Alert
        tone="info"
        icon={<Clock size={14} />}
        title="Performance impact"
      >
        Firewall changes require a temporary restart to apply correctly. This
        guarantees the new rules are loaded cleanly at boot.
      </Alert>

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        size="md"
      >
        <DialogTitle>Confirm desktop shutdown</DialogTitle>
        <DialogDescription>{`You are about to shut down the desktop "${vmName}".`}</DialogDescription>
        <DialogBody>
        <ResponsiveStack direction="col" gap={3}>
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title="Important precautions"
          >
            <ResponsiveStack direction="col" gap={1}>
              <span>• Make sure you have saved all your work</span>
              <span>• Close all important applications</span>
              <span>• This process may take 1–2 minutes</span>
              <span>• The VM will shut down safely</span>
            </ResponsiveStack>
          </Alert>
          <Badge tone="neutral" icon={<Clock size={12} />}>
            Estimated time: 30–120 seconds
          </Badge>
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setIsConfirmOpen(false)}
            disabled={poweringOff}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            icon={<Power size={14} />}
            onClick={handleStopVM}
            disabled={poweringOff}
            loading={poweringOff}
          >
            {poweringOff ? 'Shutting down…' : 'Shutdown now'}
          </Button>
        </DialogButtons>
      </Dialog>
    </ResponsiveStack>
  );
};

export default VMStatusWarning;
