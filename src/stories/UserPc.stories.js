import * as React from "react";
import { fn } from '@storybook/test';
import { UserPc } from "@/components/ui/user-pc";

export default {
  title: 'Components/UserPc',
  component: UserPc,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the PC',
    },
    status: {
      control: 'select',
      options: ['idle', 'running', 'building'],
      description: 'Current status of the PC',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the PC is currently selected',
    },
    avatar: {
      control: 'text',
      description: 'URL of the user avatar image. Defaults to "/images/avatar.png"',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the PC card is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
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
    { id: 1, name: "Gaming PC", status: "running", avatar: "https://github.com/shadcn.png" },
    { id: 2, name: "Work Station", status: "building" },
    { id: 3, name: "Development PC", status: "running", avatar: "https://avatars.githubusercontent.com/u/124599" },
    { id: 4, name: "Test PC", status: "idle" },
  ];

  return (
    <div className="flex gap-4 flex-wrap">
      {pcs.map((pc) => (
        <UserPc
          key={pc.id}
          name={pc.name}
          status={pc.status}
          avatar={pc.avatar}
          selected={selectedId === pc.id}
          onClick={() => {
            console.log(`Clicked ${pc.name}`);
            setSelectedId(pc.id === selectedId ? null : pc.id);
          }}
        />
      ))}
    </div>
  );
};

// Multiple States Example
export const AllStates = () => (
  <div className="flex gap-4 flex-wrap">
    <UserPc
      name="Gaming PC"
      status="running"
      onClick={() => console.log('Gaming PC clicked')}
    />
    <UserPc
      name="Work Station"
      status="building"
      avatar="https://github.com/shadcn.png"
      onClick={() => console.log('Work Station clicked')}
    />
    <UserPc
      name="Development PC"
      status="running"
      selected={true}
      avatar="https://avatars.githubusercontent.com/u/124599"
      onClick={() => console.log('Development PC clicked')}
    />
    <UserPc
      name="Test PC"
      status="idle"
      onClick={() => console.log('Test PC clicked')}
    />
  </div>
);
