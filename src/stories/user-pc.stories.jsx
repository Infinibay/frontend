import * as React from "react";
import { fn } from '@storybook/test';
import { UserPc } from "@/components/ui/user-pc";

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
 *       onClick={() => console.log('PC clicked')}
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

### Usage
\`\`\`jsx
// Basic card
<UserPc 
  name="Gaming PC"
  status="idle"
/>

// Running PC with click handler
<UserPc
  name="Development PC"
  status="running"
  onClick={handlePcClick}
/>

// Selected PC with custom avatar
<UserPc
  name="Work Station"
  status="building"
  selected={true}
  avatar="/custom-avatar.png"
  onClick={handleClick}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the PC',
      table: {
        type: { summary: 'string' },
      },
    },
    status: {
      control: 'select',
      options: ['idle', 'running', 'building'],
      description: 'Current status of the PC',
      table: {
        type: { summary: "'idle' | 'running' | 'building'" },
        defaultValue: { summary: 'idle' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the PC is currently selected',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    avatar: {
      control: 'text',
      description: 'URL of the user avatar image',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"/images/avatar.png"' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the PC card is clicked',
      table: {
        type: { summary: '(event: React.MouseEvent) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

// Basic Example
export const Default = {
  args: {
    name: 'Gaming PC',
    status: 'idle',
    selected: false,
    onClick: fn(),
  },
};

// Running PC
export const Running = {
  args: {
    name: 'Development PC',
    status: 'running',
    selected: false,
    onClick: fn(),
  },
};

// Building PC
export const Building = {
  args: {
    name: 'Work Station',
    status: 'building',
    selected: false,
    onClick: fn(),
  },
};

// Selected PC
export const Selected = {
  args: {
    name: 'Gaming PC',
    status: 'running',
    selected: true,
    onClick: fn(),
  },
};

// Custom Avatar Example
export const CustomAvatar = {
  args: {
    name: 'Custom Avatar PC',
    status: 'running',
    selected: false,
    avatar: 'https://github.com/shadcn.png',
    onClick: fn(),
  },
};

// Long Name Example
export const LongName = {
  args: {
    name: 'My Super Awesome Gaming and Development Workstation',
    status: 'running',
    selected: false,
    onClick: fn(),
  },
};

// Interactive Example
export const Interactive = () => {
  const [selectedId, setSelectedId] = React.useState(null);
  
  const pcs = [
    { id: 1, name: 'Gaming PC', status: 'idle' },
    { id: 2, name: 'Development PC', status: 'running' },
    { id: 3, name: 'Work Station', status: 'building' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pcs.map((pc) => (
        <UserPc
          key={pc.id}
          name={pc.name}
          status={pc.status}
          selected={selectedId === pc.id}
          onClick={() => setSelectedId(pc.id)}
        />
      ))}
    </div>
  );
};
