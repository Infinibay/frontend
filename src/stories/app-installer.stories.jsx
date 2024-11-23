import React from 'react';
import AppInstaller from "../components/ui/app-installer";
import { DndContext } from '@dnd-kit/core';

// Helper function to simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const meta = {
  title: 'Complex/AppInstaller',
  component: AppInstaller,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-[600px] min-w-[800px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
  },
};

export default meta;

const mockApps = {
  available: [
    {
      id: 'app1',
      name: '3D Modeler',
      description: 'Create and edit 3D models',
      icon: 'https://cdn.simpleicons.org/blender',
    },
    {
      id: 'app2',
      name: 'File Manager',
      description: 'Manage your files and folders with ease',
      icon: 'https://cdn.simpleicons.org/files',
    },
    {
      id: 'app3',
      name: 'Terminal',
      description: 'Command-line interface for power users',
      icon: 'https://cdn.simpleicons.org/gnometerminal',
    },
  ],
  installed: [
    {
      id: 'app4',
      name: 'Git Client',
      description: 'Version control made simple',
      icon: 'https://cdn.simpleicons.org/git',
    },
    {
      id: 'app5',
      name: 'Package Manager',
      description: 'Manage your project dependencies',
      icon: 'https://cdn.simpleicons.org/npm',
    },
  ],
};

const Template = (args) => <AppInstaller {...args} />;

export const Default = {
  render: (args) => <Template {...args} />,
  args: {
    apps: mockApps,
    size: 'md',
    async onInstall(app) {
      await delay(2000); // 2 second delay
      return app;
    },
    async onUninstall(app) {
      await delay(2000); // 2 second delay
      return app;
    }
  },
};

export const Small = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'sm',
  },
};

export const Large = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'lg',
  },
};

export const ExtraLarge = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'xl',
  },
};

export const Empty = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: {
      available: [],
      installed: [],
    },
  },
};

export const OnlyAvailable = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: {
      available: mockApps.available,
      installed: [],
    },
  },
};

export const OnlyInstalled = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: {
      available: [],
      installed: mockApps.installed,
    },
  },
};

export const Processing = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: {
      available: [
        ...mockApps.available,
        {
          id: 'app6',
          name: 'Processing App',
          description: 'This app is currently being processed',
          status: 'installing',
        },
      ],
      installed: mockApps.installed,
    },
  },
};

export const CustomStyle = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    className: 'bg-slate-100 p-8 rounded-xl shadow-lg',
  },
};

export const ManyApps = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: {
      available: Array.from({ length: 10 }, (_, i) => ({
        id: `available-${i}`,
        name: `Available App ${i + 1}`,
        description: `Description for available app ${i + 1}`,
      })),
      installed: Array.from({ length: 10 }, (_, i) => ({
        id: `installed-${i}`,
        name: `Installed App ${i + 1}`,
        description: `Description for installed app ${i + 1}`,
      })),
    },
  },
};
