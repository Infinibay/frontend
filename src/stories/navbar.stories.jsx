import AppSidebar from "@/components/ui/navbar";
import { UserPc } from "../components/ui/user-pc";

const fakeDepartments = [
  { name: "Engineering", totalMachines: 25 },
  { name: "Marketing", totalMachines: 15 },
  { name: "Sales", totalMachines: 20 },
  { name: "HR", totalMachines: 10 },
  { name: "Finance", totalMachines: 12 }
];

const fakeUser = {
  firstName: "John",
  lastName: "Doe",
  role: "Administrator",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
};

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
  title: "Components/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
AppSidebar is the main navigation component of the application. It provides:
- Navigation links to main sections (Computers, Users, Settings)
- Department navigation with machine counts
- User profile information
- Logout functionality

The sidebar supports different sizes (sm, md, lg) and can be collapsed/expanded.
        `,
      },
    },
  },
  args: {
    size: "lg",
    user: fakeUser,
    departments: fakeDepartments,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls the size of the sidebar elements",
    },
    user: {
      control: "object",
      description: "User object containing profile information",
    },
    departments: {
      control: "object",
      description: "Array of department objects with name and machine count",
    },
  },
};

// Default story with no user
export const Default = {
  args: {},
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
    user: fakeUser,
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
    size: "sm",
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
    size: "md",
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
    size: "lg",
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

export const ExtraLarge = {
  args: {
    size: "xl",
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
    user: fakeUser,
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

export const WithoutUser = {
  args: {
    user: null,
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

export const WithoutDepartments = {
  args: {
    departments: [],
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

export const WithManyDepartments = {
  args: {
    departments: [
      ...fakeDepartments,
      { name: "Research", totalMachines: 30 },
      { name: "Development", totalMachines: 45 },
      { name: "QA", totalMachines: 15 },
      { name: "Support", totalMachines: 25 },
      { name: "Operations", totalMachines: 20 },
    ],
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
