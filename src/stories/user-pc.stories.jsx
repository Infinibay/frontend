import * as React from "react";
import { fn } from '@storybook/test';
import { UserPc } from "@/components/ui/user-pc";
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:stories:user-pc');

/**
 * A component for displaying user's PC information in a card format with status indicators.
 * 
 * @component
 * @example
 * // How to import the component:
 * import { UserPc } from '@/components/ui/user-pc'
 * 
 * // Basic usage:
 * export default function PCList() {
 *   return (
 *     <UserPc
 *       name="Gaming PC"
 *       status="idle"
 *       onClick={() => debug.log('click', 'PC clicked')}
 *     />
 *   )
 * }
 * 
 * // With all props:
 * export default function PCList() {
 *   return (
 *     <UserPc
 *       name="Development PC"
 *       status="running"
 *       selected={true}
 *       avatar="/custom-avatar.png"
 *       onClick={handleClick}
 *       onPlay={handlePlay}
 *       onPause={handlePause}
 *       onStop={handleStop}
 *       onDelete={handleDelete}
 *       viewMode="grid"
 *       username="John Doe"
 *       cpuCores="4 Cores"
 *       ram="16 GB"
 *       storage="512 GB"
 *       className="hover:shadow-lg"
 *     />
 *   )
 * }
 */
export default {
  title: 'Complex/UserPc',
  component: UserPc,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'PC information card component with status indicators and interactive features',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { UserPc } from '@/components/ui/user-pc'
\`\`\`

### Features
- Supports both grid view and table view
- Shows PC status with color indicators
- Interactive control buttons (Play, Pause, Stop, Delete)
- Customizable appearance and behavior
`,
      },
    },
  },
  argTypes: {
    name: {
      description: 'The display name of the PC',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    status: {
      description: 'Current status of the PC',
      control: { type: 'select', options: ['idle', 'running', 'paused', 'stopped', 'building'] },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'idle' },
      },
    },
    selected: {
      description: 'Whether the PC card is in a selected state',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    avatar: {
      description: 'The URL to the avatar image for the PC owner',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/images/avatar.png' },
      },
    },
    viewMode: {
      description: 'The display mode for the PC component',
      control: { type: 'select', options: ['grid', 'table'] },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'grid' },
      },
    },
    username: {
      description: 'The name of the user who owns the PC',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'User' },
      },
    },
    cpuCores: {
      description: 'CPU core information for the PC',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    ram: {
      description: 'RAM information for the PC',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    storage: {
      description: 'Storage information for the PC',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onClick: {
      description: 'Function that triggers when the PC card is clicked',
      action: 'clicked',
      table: {
        type: { summary: 'function' },
      },
    },
    onPlay: {
      description: 'Function that triggers when the Play button is clicked',
      action: 'play',
      table: {
        type: { summary: 'function' },
      },
    },
    onPause: {
      description: 'Function that triggers when the Pause button is clicked',
      action: 'pause',
      table: {
        type: { summary: 'function' },
      },
    },
    onStop: {
      description: 'Function that triggers when the Stop button is clicked',
      action: 'stop',
      table: {
        type: { summary: 'function' },
      },
    },
    onDelete: {
      description: 'Function that triggers when the Delete button is clicked',
      action: 'delete',
      table: {
        type: { summary: 'function' },
      },
    },
  },
};

// Basic Grid View
export const GridView = {
  args: {
    name: 'Development PC',
    status: 'running',
    selected: false,
    onClick: fn(),
    onPlay: fn(),
    onPause: fn(),
    onStop: fn(),
    onDelete: fn(),
    viewMode: 'grid',
  },
};

// Selected Grid View
export const SelectedGridView = {
  args: {
    name: 'Gaming PC',
    status: 'running',
    selected: true,
    onClick: fn(),
    onPlay: fn(),
    onPause: fn(),
    onStop: fn(),
    onDelete: fn(),
    viewMode: 'grid',
  },
};

// Table View
export const TableView = {
  args: {
    name: 'Office PC',
    status: 'stopped',
    selected: false,
    onClick: fn(),
    onPlay: fn(),
    onPause: fn(),
    onStop: fn(),
    onDelete: fn(),
    viewMode: 'table',
    username: 'John Doe',
    cpuCores: '4 Cores',
    ram: '16 GB',
    storage: '512 GB',
  },
  decorators: [
    (Story) => (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Hardware</th>
            <th className="py-2 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

// Status Variations
export const StatusVariations = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Grid View</h2>
      <div className="flex flex-wrap gap-4">
        <UserPc
          name="Running PC"
          status="running"
          onClick={fn()}
          onPlay={fn()}
          onPause={fn()}
          onStop={fn()}
          onDelete={fn()}
          viewMode="grid"
        />
        <UserPc
          name="Paused PC"
          status="paused"
          onClick={fn()}
          onPlay={fn()}
          onPause={fn()}
          onStop={fn()}
          onDelete={fn()}
          viewMode="grid"
        />
        <UserPc
          name="Stopped PC"
          status="stopped"
          onClick={fn()}
          onPlay={fn()}
          onPause={fn()}
          onStop={fn()}
          onDelete={fn()}
          viewMode="grid"
        />
        <UserPc
          name="Building PC"
          status="building"
          onClick={fn()}
          onPlay={fn()}
          onPause={fn()}
          onStop={fn()}
          onDelete={fn()}
          viewMode="grid"
        />
      </div>
      
      <h2 className="text-lg font-medium mt-6">Table View</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Hardware</th>
            <th className="py-2 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <UserPc
            name="Running PC"
            status="running"
            onClick={fn()}
            onPlay={fn()}
            onPause={fn()}
            onStop={fn()}
            onDelete={fn()}
            viewMode="table"
            username="Admin User"
            cpuCores="8 Cores"
            ram="32 GB"
            storage="1 TB"
          />
          <UserPc
            name="Paused PC"
            status="paused"
            onClick={fn()}
            onPlay={fn()}
            onPause={fn()}
            onStop={fn()}
            onDelete={fn()}
            viewMode="table"
            username="Guest User"
            cpuCores="4 Cores"
            ram="8 GB"
            storage="256 GB"
          />
          <UserPc
            name="Stopped PC"
            status="stopped"
            onClick={fn()}
            onPlay={fn()}
            onPause={fn()}
            onStop={fn()}
            onDelete={fn()}
            viewMode="table"
            username="Test User"
            cpuCores="2 Cores"
            ram="4 GB"
            storage="128 GB"
          />
        </tbody>
      </table>
    </div>
  ),
};

// Interactive Example
export const Interactive = () => {
  const [selectedPC, setSelectedPC] = React.useState(null);
  const [statuses, setStatuses] = React.useState({
    pc1: 'stopped',
    pc2: 'running',
    pc3: 'paused',
  });

  const handleClick = (pcId) => {
    setSelectedPC(pcId === selectedPC ? null : pcId);
  };

  const handlePlay = (pcId) => {
    setStatuses(prev => ({ ...prev, [pcId]: 'running' }));
  };

  const handlePause = (pcId) => {
    setStatuses(prev => ({ ...prev, [pcId]: 'paused' }));
  };

  const handleStop = (pcId) => {
    setStatuses(prev => ({ ...prev, [pcId]: 'stopped' }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const [viewMode, setViewMode] = React.useState('grid');

  if (viewMode === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            onClick={() => handleViewModeChange('grid')}
          >
            Grid View
          </button>
          <button 
            className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            onClick={() => handleViewModeChange('table')}
          >
            Table View
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          <UserPc
            name="Office PC"
            status={statuses.pc1}
            selected={selectedPC === 'pc1'}
            onClick={() => handleClick('pc1')}
            onPlay={() => handlePlay('pc1')}
            onPause={() => handlePause('pc1')}
            onStop={() => handleStop('pc1')}
            onDelete={() => {}}
            viewMode="grid"
          />
          <UserPc
            name="Gaming PC"
            status={statuses.pc2}
            selected={selectedPC === 'pc2'}
            onClick={() => handleClick('pc2')}
            onPlay={() => handlePlay('pc2')}
            onPause={() => handlePause('pc2')}
            onStop={() => handleStop('pc2')}
            onDelete={() => {}}
            viewMode="grid"
          />
          <UserPc
            name="Test PC"
            status={statuses.pc3}
            selected={selectedPC === 'pc3'}
            onClick={() => handleClick('pc3')}
            onPlay={() => handlePlay('pc3')}
            onPause={() => handlePause('pc3')}
            onStop={() => handleStop('pc3')}
            onDelete={() => {}}
            viewMode="grid"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            onClick={() => handleViewModeChange('grid')}
          >
            Grid View
          </button>
          <button 
            className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            onClick={() => handleViewModeChange('table')}
          >
            Table View
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Hardware</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <UserPc
              name="Office PC"
              status={statuses.pc1}
              selected={selectedPC === 'pc1'}
              onClick={() => handleClick('pc1')}
              onPlay={() => handlePlay('pc1')}
              onPause={() => handlePause('pc1')}
              onStop={() => handleStop('pc1')}
              onDelete={() => {}}
              viewMode="table"
              username="Admin User"
              cpuCores="8 Cores"
              ram="32 GB"
              storage="1 TB"
            />
            <UserPc
              name="Gaming PC"
              status={statuses.pc2}
              selected={selectedPC === 'pc2'}
              onClick={() => handleClick('pc2')}
              onPlay={() => handlePlay('pc2')}
              onPause={() => handlePause('pc2')}
              onStop={() => handleStop('pc2')}
              onDelete={() => {}}
              viewMode="table"
              username="Power User"
              cpuCores="16 Cores"
              ram="64 GB"
              storage="2 TB"
            />
            <UserPc
              name="Test PC"
              status={statuses.pc3}
              selected={selectedPC === 'pc3'}
              onClick={() => handleClick('pc3')}
              onPlay={() => handlePlay('pc3')}
              onPause={() => handlePause('pc3')}
              onStop={() => handleStop('pc3')}
              onDelete={() => {}}
              viewMode="table"
              username="Test User"
              cpuCores="4 Cores"
              ram="8 GB"
              storage="256 GB"
            />
          </tbody>
        </table>
      </div>
    );
  }
};
