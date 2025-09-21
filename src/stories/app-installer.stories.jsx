import React from 'react';
import { AppStoreInstaller } from "../components/ui/app-store-installer";
import { deriveAppCategory } from "../utils/app-categories";

// Helper function to simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const meta = {
  title: 'Complex/AppStoreInstaller',
  component: AppStoreInstaller,
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
    showSelectedPanel: {
      control: 'boolean',
      defaultValue: true,
    },
    selectedPanelPosition: {
      control: 'select',
      options: ['right', 'bottom'],
      defaultValue: 'right',
    },
  },
};

export default meta;

// Transform mock data to single apps array with categories
const allMockApps = [
  {
    id: 'app1',
    name: 'Blender',
    description: 'Create and edit 3D models with professional tools',
    icon: 'https://cdn.simpleicons.org/blender',
    category: deriveAppCategory({ name: 'Blender', description: 'Create and edit 3D models' }),
    version: '4.0.2',
  },
  {
    id: 'app2',
    name: 'File Manager',
    description: 'Manage your files and folders with ease',
    icon: 'https://cdn.simpleicons.org/files',
    category: deriveAppCategory({ name: 'File Manager', description: 'Manage your files and folders' }),
    version: '2.1.0',
  },
  {
    id: 'app3',
    name: 'Terminal',
    description: 'Command-line interface for power users',
    icon: 'https://cdn.simpleicons.org/gnometerminal',
    category: deriveAppCategory({ name: 'Terminal', description: 'Command-line interface' }),
    version: '1.5.3',
  },
  {
    id: 'app4',
    name: 'Git',
    description: 'Version control made simple',
    icon: 'https://cdn.simpleicons.org/git',
    category: deriveAppCategory({ name: 'Git', description: 'Version control' }),
    version: '2.42.0',
  },
  {
    id: 'app5',
    name: 'NPM',
    description: 'Manage your project dependencies',
    icon: 'https://cdn.simpleicons.org/npm',
    category: deriveAppCategory({ name: 'NPM', description: 'package manager' }),
    version: '10.2.3',
  },
  {
    id: 'app6',
    name: 'Chrome',
    description: 'Fast, secure, and modern web browser',
    icon: 'https://cdn.simpleicons.org/googlechrome',
    category: deriveAppCategory({ name: 'Chrome', description: 'web browser' }),
    version: '119.0.6045.199',
  },
  {
    id: 'app7',
    name: 'Visual Studio Code',
    description: 'Lightweight but powerful source code editor',
    icon: 'https://cdn.simpleicons.org/visualstudiocode',
    category: deriveAppCategory({ name: 'Visual Studio Code', description: 'code editor' }),
    version: '1.84.2',
  },
  {
    id: 'app8',
    name: 'Slack',
    description: 'Team communication and collaboration platform',
    icon: 'https://cdn.simpleicons.org/slack',
    category: deriveAppCategory({ name: 'Slack', description: 'communication platform' }),
    version: '4.35.131',
  },
  {
    id: 'app9',
    name: 'VLC Media Player',
    description: 'Free and open-source media player',
    icon: 'https://cdn.simpleicons.org/vlc',
    category: deriveAppCategory({ name: 'VLC', description: 'media player' }),
    version: '3.0.18',
  },
  {
    id: 'app10',
    name: 'Steam',
    description: 'Gaming platform and digital distribution service',
    icon: 'https://cdn.simpleicons.org/steam',
    category: deriveAppCategory({ name: 'Steam', description: 'gaming platform' }),
    version: '2023.11.1',
  },
];

const Template = (args) => {
  const [selectedAppIds, setSelectedAppIds] = React.useState(args.selectedAppIds || []);

  const handleSelectionChange = async (appId, isSelected) => {
    // Simulate async operation
    await delay(500);

    setSelectedAppIds(prev =>
      isSelected
        ? [...prev, appId]
        : prev.filter(id => id !== appId)
    );
  };

  return (
    <AppStoreInstaller
      {...args}
      selectedAppIds={selectedAppIds}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export const Default = {
  render: (args) => <Template {...args} />,
  args: {
    apps: allMockApps,
    selectedAppIds: ['app4', 'app5'], // Git and NPM are pre-selected
    size: 'md',
    showSelectedPanel: true,
    selectedPanelPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default App Store Installer with a variety of applications categorized automatically. Shows search, category filtering, and selected apps panel.',
      },
    },
  },
};

export const Small = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant with compact grid layout and smaller UI elements.',
      },
    },
  },
};

export const Large = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant with more grid columns and larger UI elements.',
      },
    },
  },
};

export const ExtraLarge = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    size: 'xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Extra large size variant with maximum grid columns for wide displays.',
      },
    },
  },
};

export const Empty = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: [],
    selectedAppIds: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no applications are available to install.',
      },
    },
  },
};

export const NoSelection = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    selectedAppIds: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'App Store with no applications selected, showing all available apps.',
      },
    },
  },
};

export const AllSelected = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    selectedAppIds: allMockApps.map(app => app.id),
  },
  parameters: {
    docs: {
      description: {
        story: 'App Store with all applications selected, demonstrating bulk selection state.',
      },
    },
  },
};

export const Processing = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    processingApps: ['app1', 'app7'], // Blender and VS Code are processing
  },
  parameters: {
    docs: {
      description: {
        story: 'App Store showing applications in processing state (installing/uninstalling).',
      },
    },
  },
};

export const WithoutSelectedPanel = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    showSelectedPanel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'App Store without the selected apps panel, focusing only on the main grid.',
      },
    },
  },
};

export const BottomSelectedPanel = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    selectedPanelPosition: 'bottom',
  },
  parameters: {
    docs: {
      description: {
        story: 'App Store with selected apps panel positioned at the bottom.',
      },
    },
  },
};

export const LargeAppCatalog = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: [
      ...allMockApps,
      // Add more apps for demonstration
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `extra-${i}`,
        name: `Sample App ${i + 1}`,
        description: `A sample application for demonstration purposes`,
        icon: 'https://cdn.simpleicons.org/genericapp',
        category: deriveAppCategory({ name: `Sample App ${i + 1}`, description: 'utility tool' }),
        version: `1.${i}.0`,
      })),
    ],
    selectedAppIds: ['app1', 'app6', 'app8'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Large app catalog demonstrating search and category filtering with many applications.',
      },
    },
  },
};

export const CategoryFiltering = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    apps: [
      // Development apps
      {
        id: 'dev1',
        name: 'IntelliJ IDEA',
        description: 'Professional IDE for Java development',
        icon: 'https://cdn.simpleicons.org/intellijidea',
        category: 'DESARROLLO',
        version: '2023.3',
      },
      {
        id: 'dev2',
        name: 'Docker',
        description: 'Containerization platform',
        icon: 'https://cdn.simpleicons.org/docker',
        category: 'DESARROLLO',
        version: '24.0.7',
      },
      // Communication apps
      {
        id: 'comm1',
        name: 'Discord',
        description: 'Voice and text chat for gamers',
        icon: 'https://cdn.simpleicons.org/discord',
        category: 'COMUNICACION',
        version: '0.0.308',
      },
      {
        id: 'comm2',
        name: 'Zoom',
        description: 'Video conferencing solution',
        icon: 'https://cdn.simpleicons.org/zoom',
        category: 'COMUNICACION',
        version: '5.17.0',
      },
      // Browser apps
      {
        id: 'browser1',
        name: 'Firefox',
        description: 'Open-source web browser',
        icon: 'https://cdn.simpleicons.org/firefox',
        category: 'NAVEGADORES',
        version: '120.0',
      },
    ],
    selectedAppIds: ['dev1', 'comm1'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates category filtering with apps from different categories. Try selecting different categories in the filter.',
      },
    },
  },
};
