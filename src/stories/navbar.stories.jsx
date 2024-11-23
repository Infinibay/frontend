import { AppSidebar } from "@/components/ui/navbar";
import { UserPc } from "../components/ui/user-pc";
import { SizeProvider } from "../components/ui/size-provider";

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

const decorators = [
  (Story, context) => (
    <SizeProvider size={context.args.size}>
      <Story {...context.args} />
    </SizeProvider>
  ),
];

/**
 * Navigation bar component that provides consistent header styling and navigation functionality.
 */
export default {
  title: "Components/AppSidebar",
  component: AppSidebar,
  decorators,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    size: "md",
    user: fakeUser,
    departments: fakeDepartments,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
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
    user: fakeUser,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Small Sidebar</h1>
        <p>This is the main content area with a small sidebar.</p>
      </div>
    </AppSidebar>
  )
};

export const Medium = {
  args: {
    size: "md",
    user: fakeUser,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Medium Sidebar</h1>
        <p>This is the main content area with a medium sidebar.</p>
      </div>
    </AppSidebar>
  )
};

export const Large = {
  args: {
    size: "lg",
    user: fakeUser,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Large Sidebar</h1>
        <p>This is the main content area with a large sidebar.</p>
      </div>
    </AppSidebar>
  )
};

export const ExtraLarge = {
  args: {
    size: "xl",
    user: fakeUser,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Extra Large Sidebar</h1>
        <p>This is the main content area with an extra large sidebar.</p>
      </div>
    </AppSidebar>
  )
};

// Story with user PCs list
export const WithUserPCs = {
  args: {
    user: fakeUser,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">User PCs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserPc
            name="Main Workstation"
            os="Windows 11"
            lastSeen="2 hours ago"
            status="online"
          />
          <UserPc
            name="Development Laptop"
            os="macOS Sonoma"
            lastSeen="5 minutes ago"
            status="online"
          />
          <UserPc
            name="Test Machine"
            os="Ubuntu 22.04"
            lastSeen="3 days ago"
            status="offline"
          />
        </div>
      </div>
    </AppSidebar>
  )
};

export const WithoutUser = {
  args: {
    user: null,
    departments: fakeDepartments,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Without User</h1>
        <p>This is the main content area without user information.</p>
      </div>
    </AppSidebar>
  )
};

export const WithoutDepartments = {
  args: {
    departments: [],
    user: fakeUser,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Without Departments</h1>
        <p>This is the main content area without any departments.</p>
      </div>
    </AppSidebar>
  )
};

export const WithManyDepartments = {
  args: {
    departments: [
      ...fakeDepartments,
      { name: "Research", totalMachines: 8 },
      { name: "Support", totalMachines: 30 },
      { name: "Legal", totalMachines: 5 },
      { name: "Operations", totalMachines: 18 },
      { name: "Design", totalMachines: 22 },
    ],
    user: fakeUser,
  },
  render: (args) => (
    <AppSidebar {...args}>
      <div className="bg-gray-50 p-8 h-full">
        <h1 className="text-2xl font-bold mb-6">Many Departments</h1>
        <p>This is the main content area with many departments.</p>
      </div>
    </AppSidebar>
  )
};
