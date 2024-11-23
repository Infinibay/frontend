import React from "react"
import { SizeProvider } from "@/components/ui/size-provider"
import { Button } from "@/components/ui/button"
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header"
import { Spinner } from "@/components/ui/spinner"
import { Mail, Search, Bell } from "lucide-react"
import { AppSidebar } from "@/components/ui/navbar"

export default {
  title: "Components/SizeProvider",
  component: SizeProvider,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size context to be provided to child components',
      defaultValue: 'md'
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      }
    }
  }
}

const mockUser = {
  name: "John Doe",
  email: "john@example.com"
}

const mockDepartments = [
  { name: "Engineering", totalMachines: 50 },
  { name: "Marketing", totalMachines: 25 },
  { name: "Sales", totalMachines: 30 }
]

const content = (args) => {
  return (
    <div className="h-[600px]">
      <SizeProvider size={args.size}>
        <AppSidebar user={mockUser} departments={mockDepartments}>
          <Header>
            <HeaderLeft>
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </HeaderLeft>
            <HeaderCenter>Components with Size Context</HeaderCenter>
            <HeaderRight>
              <Button variant="ghost" size="icon">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
            </HeaderRight>
          </Header>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Buttons</h3>
              <div className="flex gap-4">
                <Button>Default Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Spinners</h3>
              <div className="flex items-center gap-4">
                <Spinner />
                <Spinner variant="secondary" />
                <Spinner variant="success" />
                <Spinner variant="destructive" />
              </div>
            </section>
          </div>
        </AppSidebar>
      </SizeProvider>
    </div>
  );
};

export const Default = {
  render: (args) => (
    content(args)
  ),
  args: {
    size: 'md'
  },
  parameters: {
    layout: 'fullscreen'
  }
}

export const Small = {
  render: (args) => (
    content(args)
  ),
  args: {
    size: 'sm'
  },
  parameters: {
    layout: 'fullscreen'
  }
}

export const Large = {
  render: (args) => (
    content(args)
  ),
  args: {
    size: 'lg'
  },
  parameters: {
    layout: 'fullscreen'
  }
}

export const ExtraLarge = {
  render: (args) => (
    content(args)
  ),
  args: {
    size: 'xl'
  },
  parameters: {
    layout: 'fullscreen'
  }
}

