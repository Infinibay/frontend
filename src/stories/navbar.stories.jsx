import AppSidebar from "../components/ui/navbar";

export default {
  title: "Navigation/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "280px" }}>
        <Story />
      </div>
    ),
  ],
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
};
