'use client';

import React, { useState } from 'react';
import { Radio, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { useCaptureDepartmentDhcpTrafficLazyQuery } from '@/gql/hooks';
import { toast } from 'sonner';

const DhcpTrafficCapture = ({ departmentId }) => {
  const [duration, setDuration] = useState('30');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [captureTraffic, { loading }] = useCaptureDepartmentDhcpTrafficLazyQuery({
    onCompleted: (data) => {
      setCaptureData(data.captureDepartmentDhcpTraffic);
      toast.success('DHCP traffic captured successfully');
    },
    onError: (error) => {
      toast.error(`Failed to capture traffic: ${error.message}`);
    }
  });

  const handleStartCapture = () => {
    if (!departmentId) {
      toast.error('Department must be loaded before capturing traffic');
      return;
    }
    setCaptureData(null);
    captureTraffic({
      variables: {
        departmentId,
        durationSeconds: parseInt(duration, 10)
      }
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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Radio className="h-5 w-5" />
        <h3 className="size-heading">DHCP Traffic Capture</h3>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Capture DHCP packets on the department bridge to troubleshoot VM connectivity issues.
          This is useful when VMs are not obtaining IP addresses.
        </AlertDescription>
      </Alert>

      {/* Capture Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Duration:</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleStartCapture}
          disabled={isDisabled}
          variant="default"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Capturing...
            </>
          ) : (
            'Start Capture'
          )}
        </Button>

        {captureData && (
          <Button onClick={() => setCaptureData(null)} variant="outline" disabled={!departmentId}>
            Clear Results
          </Button>
        )}
      </div>

      {/* Notice when department is not loaded */}
      {!departmentId && (
        <p className="text-sm text-muted-foreground">
          Waiting for department to load before capture can be started...
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Capturing DHCP traffic for {duration} seconds...
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Please wait, this operation will complete when the timer expires.
          </p>
        </div>
      )}

      {/* Results */}
      {captureData && !loading && (
        <div className="space-y-4">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total Packets" value={captureData.summary.totalPackets} color="blue" />
            <StatCard label="DISCOVER" value={captureData.summary.discoverPackets} color="purple" />
            <StatCard label="OFFER" value={captureData.summary.offerPackets} color="green" />
            <StatCard label="REQUEST" value={captureData.summary.requestPackets} color="yellow" />
            <StatCard label="ACK" value={captureData.summary.ackPackets} color="green" />
          </div>

          {/* No packets warning */}
          {captureData.summary.totalPackets === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No DHCP packets captured. This could indicate:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>No VMs are requesting IP addresses</li>
                  <li>DNSMASQ service is not running</li>
                  <li>Bridge is not properly configured</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Packet List */}
          {captureData.packets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">Captured Packets ({captureData.packets.length})</h4>
                <Button onClick={handleCopyPackets} variant="outline" size="sm">
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {captureData.packets.join('\n')}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
};

export default DhcpTrafficCapture;
