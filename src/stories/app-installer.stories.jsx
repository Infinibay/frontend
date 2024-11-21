import React from 'react';
import AppInstaller, { APP_STATUS } from '../components/ui/app-installer';

const meta = {
  title: 'Components/AppInstaller',
  component: AppInstaller,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A drag-and-drop interface for installing and uninstalling applications. Features smooth animations,
status indicators, and intuitive interactions.

\`\`\`jsx
import AppInstaller from '@/components/ui/app-installer';

export function Example() {
  return (
    <AppInstaller
      availableApps={[
        {
          id: 'app1',
          name: 'My App',
          icon: '/path/to/icon.png',
          description: 'A cool app',
          status: 'not-installed'
        }
      ]}
      installedApps={[]}
      onInstall={(app) => console.log('Installing', app)}
      onUninstall={(app) => console.log('Uninstalling', app)}
    />
  );
}
\`\`\`

**Note:** Drag and drop animations may not work properly in the documentation view. 
For the best experience, please view the examples in isolation mode by clicking the example you want to see at the left panel.
`
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

// Sample apps data with image URLs
const availableApps = [
  {
    id: 'browser',
    name: 'Web Browser',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlechrome.svg',
    description: 'A fast and secure web browser with built-in privacy features.',
    status: APP_STATUS.NOT_INSTALLED
  },
  {
    id: 'mail',
    name: 'Mail Client',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gmail.svg',
    description: 'Powerful email client with support for multiple accounts and offline access.',
    status: APP_STATUS.NOT_INSTALLED
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlecalendar.svg',
    description: 'Keep track of your schedule with this intuitive calendar application.',
    status: APP_STATUS.NOT_INSTALLED
  },
  {
    id: 'music',
    name: 'Music Player',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/spotify.svg',
    description: 'Stream and manage your music library with this feature-rich player.',
    status: APP_STATUS.NOT_INSTALLED
  }
];

const installedApps = [
  {
    id: 'notes',
    name: 'Notes',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/evernote.svg',
    description: 'Simple yet powerful note-taking app with cloud sync.',
    status: APP_STATUS.INSTALLED
  },
  {
    id: 'photos',
    name: 'Photo Editor',
    icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/adobephotoshop.svg',
    description: 'Edit and organize your photos with professional-grade tools.',
    status: APP_STATUS.INSTALLED
  }
];

// Simulate async installation/uninstallation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const Basic = {
  args: {
    availableApps,
    installedApps,
    async onInstall(app) {
      // Simulate installation delay
      await delay(2000);
      return { ...app, status: APP_STATUS.INSTALLED };
    },
    async onUninstall(app) {
      // Simulate uninstallation delay
      await delay(2000);
      return { ...app, status: APP_STATUS.NOT_INSTALLED };
    }
  }
};

// Example with empty states
export const EmptyStates = {
  args: {
    availableApps: [],
    installedApps: [],
    async onInstall(app) {
      await delay(2000);
      return { ...app, status: APP_STATUS.INSTALLED };
    },
    async onUninstall(app) {
      await delay(2000);
      return { ...app, status: APP_STATUS.NOT_INSTALLED };
    }
  }
};

// Example with many apps
export const ManyApps = {
  args: {
    availableApps: [
      ...availableApps,
      {
        id: 'chat',
        name: 'Chat App',
        icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/discord.svg',
        description: 'Stay connected with friends and colleagues.',
        status: APP_STATUS.NOT_INSTALLED
      },
      {
        id: 'video',
        name: 'Video Editor',
        icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/adobepremierepro.svg',
        description: 'Professional video editing suite.',
        status: APP_STATUS.NOT_INSTALLED
      },
      {
        id: 'tasks',
        name: 'Task Manager',
        icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/todoist.svg',
        description: 'Organize and track your tasks efficiently.',
        status: APP_STATUS.NOT_INSTALLED
      }
    ],
    installedApps: [
      ...installedApps,
      {
        id: 'calculator',
        name: 'Calculator',
        icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/wolframmathematica.svg',
        description: 'Scientific calculator with advanced functions.',
        status: APP_STATUS.INSTALLED
      },
      {
        id: 'weather',
        name: 'Weather',
        icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googleearth.svg',
        description: 'Real-time weather updates and forecasts.',
        status: APP_STATUS.INSTALLED
      }
    ],
    async onInstall(app) {
      await delay(2000);
      return { ...app, status: APP_STATUS.INSTALLED };
    },
    async onUninstall(app) {
      await delay(2000);
      return { ...app, status: APP_STATUS.NOT_INSTALLED };
    }
  }
};
