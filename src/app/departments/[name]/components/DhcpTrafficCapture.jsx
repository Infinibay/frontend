'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Radio } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CodeBlock,
  EmptyState,
  FormField,
  LoadingOverlay,
  ResponsiveGrid,
  ResponsiveStack,
  Select,
  Stat,
} from '@infinibay/harbor';
import { useCaptureDepartmentDhcpTrafficLazyQuery } from '@/gql/hooks';
import { toast } from 'sonner';

const DURATION_OPTIONS = [
  { value: '5', label: '5 seconds' },
  { value: '10', label: '10 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '60 seconds' },
  { value: '120', label: '120 seconds' },
];

const DhcpTrafficCapture = ({ departmentId }) => {
  const [duration, setDuration] = useState('30');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [captureTraffic, { loading }] = useCaptureDepartmentDhcpTrafficLazyQuery(
    {
      onCompleted: (data) => {
        setCaptureData(data.captureDepartmentDhcpTraffic);
        toast.success('DHCP traffic captured successfully');
      },
      onError: (error) => {
        toast.error(`Failed to capture traffic: ${error.message}`);
      },
    },
  );

  const handleStartCapture = () => {
    if (!departmentId) {
      toast.error('Department must be loaded before capturing traffic');
      return;
    }
    setCaptureData(null);
    captureTraffic({
      variables: {
        departmentId,
        durationSeconds: parseInt(duration, 10),
      },
    });
  };

  const isDisabled = loading || !departmentId;

  const handleCopyPackets = async () => {
    if (!captureData?.packets) return;
    try {
      await navigator.clipboard.writeText(captureData.packets.join('\n'));
      setCopied(true);
      toast.success('Packets copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy packets');
    }
  };

  return (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      leadingIcon={<Radio size={18} />}
      leadingIconTone="sky"
      title="DHCP Traffic Capture"
    >
      <ResponsiveStack direction="col" gap={4}>
        <Alert
          tone="info"
          icon={<AlertCircle size={14} />}
          title="Why capture DHCP traffic?"
        >
          Capture DHCP packets on the department bridge to troubleshoot VM
          connectivity issues. Useful when VMs are not obtaining IP addresses.
        </Alert>

        <ResponsiveStack direction="row" gap={3} align="end" wrap>
          <FormField label="Duration">
            <Select
              value={duration}
              onChange={setDuration}
              options={DURATION_OPTIONS}
            />
          </FormField>
          <Button
            variant="primary"
            onClick={handleStartCapture}
            disabled={isDisabled}
            loading={loading}
          >
            {loading ? 'Capturing…' : 'Start capture'}
          </Button>
          {captureData ? (
            <Button
              variant="secondary"
              onClick={() => setCaptureData(null)}
              disabled={!departmentId}
            >
              Clear results
            </Button>
          ) : null}
        </ResponsiveStack>

        {!departmentId ? (
          <EmptyState
            variant="inline"
            title="Waiting for department to load before capture can be started…"
          />
        ) : null}

        {loading ? (
          <LoadingOverlay
            label={`Capturing DHCP traffic for ${duration} seconds…`}
          />
        ) : null}

        {captureData && !loading ? (
          <ResponsiveStack direction="col" gap={4}>
            <ResponsiveGrid columns={{ base: 2, md: 5 }} gap={3}>
              <Stat label="Total" value={captureData.summary.totalPackets} />
              <Stat
                label="DISCOVER"
                value={captureData.summary.discoverPackets}
              />
              <Stat label="OFFER" value={captureData.summary.offerPackets} />
              <Stat
                label="REQUEST"
                value={captureData.summary.requestPackets}
              />
              <Stat label="ACK" value={captureData.summary.ackPackets} />
            </ResponsiveGrid>

            {captureData.summary.totalPackets === 0 ? (
              <Alert
                tone="danger"
                icon={<AlertCircle size={14} />}
                title="No DHCP packets captured"
              >
                <ResponsiveStack direction="col" gap={1}>
                  <span>• No VMs are requesting IP addresses</span>
                  <span>• DNSMASQ service is not running</span>
                  <span>• Bridge is not properly configured</span>
                </ResponsiveStack>
              </Alert>
            ) : null}

            {captureData.packets.length > 0 ? (
              <Card
                variant="default"
                spotlight={false}
                glow={false}
                title={
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <span>Captured packets</span>
                    <Badge tone="neutral">{captureData.packets.length}</Badge>
                  </ResponsiveStack>
                }
                footer={
                  <ResponsiveStack direction="row" justify="end">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={
                        copied ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Copy size={14} />
                        )
                      }
                      onClick={handleCopyPackets}
                    >
                      {copied ? 'Copied' : 'Copy all'}
                    </Button>
                  </ResponsiveStack>
                }
              >
                <CodeBlock code={captureData.packets.join('\n')} />
              </Card>
            ) : null}
          </ResponsiveStack>
        ) : null}
      </ResponsiveStack>
    </Card>
  );
};

export default DhcpTrafficCapture;
