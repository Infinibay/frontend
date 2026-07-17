'use client';

import { useState } from 'react';
import { Check, Copy, Cpu, Download, MonitorPlay } from 'lucide-react';
import { Alert, Button, Card, ResponsiveStack } from '@infinibay/harbor';
import { useGpuConsoleStreamLazyQuery } from '@/gql/hooks';

// Pick the viewer build for the browser's OS (the viewer runs on the USER's machine).
const viewerOs = () => {
  if (typeof navigator === 'undefined') return 'linux';
  return navigator.userAgent.toLowerCase().includes('win') ? 'windows' : 'linux';
};

const backendHost = () => process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:4000';

/**
 * GPU VMs render over infiniPixel (a native viewer connecting to a ws:// relay),
 * NOT SPICE — so the regular console/.vv button doesn't apply. This panel opens the
 * per-VM stream (lazily, since resolving it starts a relay session) and shows the URL
 * + a viewer download. Renders a "no GPU" note for non-GPU VMs.
 */
const GpuStreamPanel = ({ vmId }) => {
  const [copied, setCopied] = useState(false);
  const [fetchStream, { data, loading, called, error }] = useGpuConsoleStreamLazyQuery({
    fetchPolicy: 'network-only',
  });
  const stream = data?.gpuConsoleStream;
  const os = viewerOs();

  const copy = () => {
    if (!stream?.url) return;
    navigator.clipboard.writeText(stream.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-6">
      <ResponsiveStack gap="md">
        <div className="flex items-center gap-2">
          <Cpu size={18} />
          <h2 className="text-base font-semibold m-0">GPU stream (infinigpu)</h2>
        </div>
        <p className="text-sm opacity-70 m-0">
          GPU VMs render over infiniPixel — connect the native viewer to the stream URL
          below. (The regular console / .vv button is for non-GPU VMs.)
        </p>

        {!called && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={<MonitorPlay size={14} />}
              loading={loading}
              onClick={() => fetchStream({ variables: { machineId: vmId } })}
            >
              Connect GPU viewer
            </Button>
          </div>
        )}

        {called && !loading && !stream && !error && (
          <Alert variant="info" title="No GPU stream for this VM">
            This VM has no GPU attached (its department has GPUs disabled) or it isn’t running.
          </Alert>
        )}

        {error && (
          <Alert variant="error" title="Could not open the GPU stream">
            {error.message}
          </Alert>
        )}

        {stream?.url && (
          <ResponsiveStack gap="sm">
            <label className="text-xs uppercase opacity-60 m-0">Stream URL</label>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="px-2 py-1 rounded bg-black/20 text-sm break-all">{stream.url}</code>
              <Button
                variant="ghost"
                icon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={copy}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div>
              <a href={`${backendHost()}/gpu-viewer/${os}/binary`} download>
                <Button variant="secondary" icon={<Download size={14} />}>
                  Download viewer ({os})
                </Button>
              </a>
            </div>
            <p className="text-xs opacity-60 m-0">
              Run the viewer and paste the URL, or launch it as{' '}
              <code>infinigpu-viewer {stream.url}</code>
            </p>
          </ResponsiveStack>
        )}
      </ResponsiveStack>
    </Card>
  );
};

export default GpuStreamPanel;
