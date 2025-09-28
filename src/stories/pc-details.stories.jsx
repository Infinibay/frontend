import { useState } from "react";
import { PcDetails } from "@/components/ui/pc-details";
import { UserPc } from "@/components/ui/user-pc";
import { Button } from "@/components/ui/button";
import { fn } from '@storybook/test';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:stories:pc-details');

/**
 * A detailed view component for displaying and editing PC specifications.
 * 
 * @component
 * @example
 * // How to import the component:
 * import { PcDetails } from '@/components/ui/pc-details'
 * 
 * // Basic usage:
 * export default function PCView({ pc }) {
 *   return (
 *     <PcDetails
 *       pc={pc}
 *       onSave={(updatedPc) => debug.log('save', 'PC Updated:', updatedPc)}
 *     />
 *   )
 * }
 * 
 * // With all props:
 * export default function PCView({ pc }) {
 *   return (
 *     <PcDetails
 *       pc={pc}
 *       onSave={handleSave}
 *       onDelete={handleDelete}
 *       isEditing={true}
 *       className="max-w-2xl mx-auto"
 *     />
 *   )
 * }
 */
export default {
  title: 'Complex/PcDetails',
  component: PcDetails,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'Detailed PC specifications viewer and editor',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { PcDetails } from '@/components/ui/pc-details'
\`\`\`

### Usage
\`\`\`jsx
// Basic view mode
<PcDetails pc={pcData} />

// Edit mode with save handler
<PcDetails
  pc={pcData}
  isEditing={true}
  onSave={handleSave}
/>

// With delete functionality
<PcDetails
  pc={pcData}
  onDelete={handleDelete}
  isEditing={true}
  onSave={handleSave}
/>
\`\`\`
        `,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    pc: {
      control: 'object',
      description: 'VM information object containing name, userName, os, ram, cpu, storage, vmId, status, screenshot, and avatar',
      table: {
        type: { summary: 'PCData' },
      },
    },
    onPlay: {
      action: 'played',
      description: 'Callback when play button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    onPause: {
      action: 'paused',
      description: 'Callback when pause button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    onStop: {
      action: 'stopped',
      description: 'Callback when stop button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    onFullScreen: {
      action: 'fullscreen',
      description: 'Callback when fullscreen button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the size of text and icons throughout the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
  },
};

const defaultPc = {
  name: "Development VM",
  userName: "andres",
  os: "Ubuntu 22.04 LTS",
  template: {
    ram: "16",
    cores: "4",
    storage: "256",
  },
  configuration: {
    graphicProtocol: "spice",
    graphicHost: "127.0.0.1",
    graphicPort: "5900",
    graphicPassword: "123456"
  },
  vmId: "vm-001",
  status: "running",
  screenshot: "https://www.debian.org/Pics/debian-logo-1024x576.png", // Example screenshot
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
};

// Small size story
export const SmallSize = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open VM Details (Small)</Button>
      <PcDetails
        open={open}
        onOpenChange={setOpen}
        size="sm"
        pc={defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};

// Medium size story (default)
export const MediumSize = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open VM Details (Medium)</Button>
      <PcDetails
        open={open}
        onOpenChange={setOpen}
        size="md"
        pc={defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};

// Large size story
export const LargeSize = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open VM Details (Large)</Button>
      <PcDetails
        open={open}
        onOpenChange={setOpen}
        size="lg"
        pc={defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};

// Default story with button trigger
export const WithButtonTrigger = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open VM Details</Button>
      <PcDetails
        open={open}
        onOpenChange={setOpen}
        pc={defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};

// Story with UserPc trigger
export const WithUserPcTrigger = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <UserPc
        name={defaultPc.name}
        status={defaultPc.status}
        avatar={defaultPc.avatar}
        onClick={() => setOpen(true)}
      />
      <PcDetails
        open={open}
        onOpenChange={setOpen}
        pc={defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};

// Story with multiple UserPcs
export const MultipleUserPcs = () => {
  const [selectedPc, setSelectedPc] = useState(null);
  
  const pcs = [
    {
      ...defaultPc,
      name: "Development VM",
      status: "running",
      userName: "andres",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
      vmId: "vm-001",
    },
    {
      ...defaultPc,
      name: "Testing VM",
      status: "paused",
      userName: "test.user",
      template: {
        ram: "8",
        cores: "2",
        storage: "128",
      },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Test",
      vmId: "vm-002",
    },
    {
      ...defaultPc,
      name: "Production VM",
      status: "stopped",
      userName: "prod.user",
      template: {
        cpu: "8",
        cores: "32",
        storage: "512",
      },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prod",
      vmId: "vm-003",
    },
  ];
  
  return (
    <div className="flex gap-4 flex-wrap">
      {pcs.map((pc) => (
        <div key={pc.vmId}>
          <UserPc
            name={pc.name}
            status={pc.status}
            avatar={pc.avatar}
            onClick={() => setSelectedPc(pc)}
          />
        </div>
      ))}
      <PcDetails
        open={!!selectedPc}
        onOpenChange={(open) => !open && setSelectedPc(null)}
        pc={selectedPc || defaultPc}
        onPlay={() => debug.log('play', 'Play clicked')}
        onPause={() => debug.log('pause', 'Pause clicked')}
        onStop={() => debug.log('stop', 'Stop clicked')}
        onFullScreen={() => debug.log('fullscreen', 'Fullscreen clicked')}
      />
    </div>
  );
};
