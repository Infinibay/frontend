"use client";

import { Cpu, Download } from "lucide-react";
import { Alert, Button, Card, ResponsiveStack } from "@infinibay/harbor";

const backendHost = () => process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:4000";

const PLATFORMS = [
  { os: "linux", label: "Linux (x86_64)" },
  { os: "windows", label: "Windows (x86_64)" },
];

/**
 * Download the infinigpu native viewer — the desktop client users run to watch a
 * GPU VM's accelerated display (infiniPixel), since GPU VMs don't use SPICE. The
 * per-VM stream URL comes from the VM's Overview → "Connect GPU viewer".
 */
export default function GpuViewerSection() {
  return (
    <ResponsiveStack gap="lg">
      <Card className="p-6">
        <ResponsiveStack gap="md">
          <div className="flex items-center gap-2">
            <Cpu size={18} />
            <h2 className="text-base font-semibold m-0">infinigpu viewer</h2>
          </div>
          <p className="text-sm opacity-70 m-0">
            The native client for a GPU VM’s accelerated display (infiniPixel). Download
            the build for your OS, then open a GPU VM → <b>Overview → Connect GPU viewer</b>
            {" "}to get its stream URL and launch the viewer against it.
          </p>
          <div className="flex gap-3 flex-wrap">
            {PLATFORMS.map((p) => (
              <a key={p.os} href={`${backendHost()}/gpu-viewer/${p.os}/binary`} download>
                <Button variant="secondary" icon={<Download size={14} />}>
                  {p.label}
                </Button>
              </a>
            ))}
          </div>
          <Alert variant="info" title="Availability">
            Builds are served once staged by the infinigpu build (GPU-enabled hosts). The
            Windows viewer is pending; the Linux build is available today.
          </Alert>
        </ResponsiveStack>
      </Card>
    </ResponsiveStack>
  );
}
