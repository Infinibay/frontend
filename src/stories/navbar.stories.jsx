import AppSidebar from "../components/ui/navbar";
import { UserPc } from "../components/ui/user-pc";

/**
 * Navigation bar component that provides consistent header styling and navigation functionality.
 * 
 * @component
 * @example
 * // How to import the component:
 * import { AppSidebar } from '../components/ui/navbar'
 * 
 * // Basic usage:
 * export default function Layout() {
 *   return (
 *     <div>
 *       <AppSidebar />
 *       {/* Your page content \*\/}
 *     </div>
 *   )
 * }
 */
export default {
  title: "Navigation/AppSidebar",
  component: AppSidebar,
  parameters: {
    componentSubtitle: 'Main navigation component for the application',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { AppSidebar } from '../components/ui/navbar'
\`\`\`

### Usage
\`\`\`jsx
// Basic usage in layout
export default function Layout() {
  return (
    <div>
      <AppSidebar />
      <main>{/* Your page content */}</main>
    </div>
  )
}
\`\`\`
        `,
      },
    },
    layout: "fullscreen",
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description: 'User information to display in the sidebar. It must contain the the following properties: firstName, lastName, avatar, role',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the sidebar',
      defaultValue: 'lg'
    }
  }
};

// Default story with no user
export const Default = {
  args: {
    user: null,
    size: 'md'
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Main Content</h1>
        <p>This is the main content area.</p>
      </div>
    </AppSidebar>
  )
};

// Story with user information
export const WithUser = {
  args: {
    user: {
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Administrator"
    },
    size: 'md'
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Main Content</h1>
        <p>This is the main content area with user information.</p>
      </div>
    </AppSidebar>
  )
};

// Size Variants
export const Small = {
  args: {
    size: 'sm',
    user: {
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Administrator"
    }
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Main Content</h1>
        <p>This is the main content area.</p>
      </div>
    </AppSidebar>
  )
};

export const Medium = {
  args: {
    size: 'md',
    user: {
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Administrator"
    }
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Main Content</h1>
        <p>This is the main content area.</p>
      </div>
    </AppSidebar>
  )
};

export const Large = {
  args: {
    size: 'lg',
    user: {
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Administrator"
    }
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Main Content</h1>
        <p>This is the main content area.</p>
      </div>
    </AppSidebar>
  )
};

// Story with user PCs list
export const WithUserPCs = {
  args: {
    user: {
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Administrator"
    },
    size: 'md'
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div>
        <h1 className="text-2xl font-bold mb-6">User PCs</h1>
        <div className="flex gap-4 flex-wrap">
          <UserPc
            name="Development PC"
            status="running"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
            selected={true}
            onClick={() => console.log('Development PC clicked')}
          />
          <UserPc
            name="Testing Environment"
            status="building"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
            onClick={() => console.log('Testing Environment clicked')}
          />
          <UserPc
            name="Production Server"
            status="idle"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
            onClick={() => console.log('Production Server clicked')}
          />
          <UserPc
            name="Backup Server"
            status="idle"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=David"
            onClick={() => console.log('Backup Server clicked')}
          />
          <UserPc
            name="Database Server"
            status="running"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Eve"
            onClick={() => console.log('Database Server clicked')}
          />
          <UserPc
            name="Load Balancer"
            status="idle"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Frank"
            onClick={() => console.log('Load Balancer clicked')}
          />
        </div>
      </div>
    </AppSidebar>
  )
};
