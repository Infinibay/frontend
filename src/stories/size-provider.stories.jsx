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
  firstName: "John",
  lastName: "Doe",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  role: "Administrator"
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

          <div className="space-y-8">
            {/* Components that respect user preferences */}
            <section className="border rounded-lg p-6 bg-blue-50/30">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                Components Respecting User Size Preferences
                <div className="text-sm font-normal text-blue-700">These components will adapt to user's size preference ({args.size})</div>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Adaptive Buttons</h3>
                  <div className="flex gap-4">
                  <Button>Default</Button>
                    <Button variant="primary">Primary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="error">Error</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Adaptive Spinners</h3>
                  <div className="flex items-center gap-4">
                    <Spinner style="circular" speed="medium" />
                    <Spinner style="windows" speed="fast" />
                    <Spinner style="beat" speed="slow" />
                    <Spinner style="pulse" speed="medium" />
                  </div>
                </div>
              </div>
            </section>

            {/* Components with specific sizes */}
            <section className="border rounded-lg p-6 bg-amber-50/30">
              <h2 className="text-lg font-semibold text-amber-900 mb-4">
                Components with Specific Sizes
                <div className="text-sm font-normal text-amber-700">These components maintain their own size regardless of user preference</div>
              </h2>

              <div className="space-y-6">
                {/* Manual size props */}
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Fixed-Size Buttons</h3>
                  <div className="flex gap-4">
                    <Button size="sm" variant="info">Info Small</Button>
                    <Button size="md" variant="warning">Warning Medium</Button>
                    <Button size="lg" variant="success">Success Large</Button>
                    <Button size="xl" variant="error">Error XL</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Fixed-Size Spinners</h3>
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" style="circular" speed="fast" />
                    <Spinner size="md" style="dots" speed="medium" />
                    <Spinner size="lg" style="bars" speed="medium" />
                    <Spinner size="xl" style="circular" speed="slow" />
                  </div>
                </div>

                {/* Nested provider with fixed size */}
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Fixed-Size Section (Always Large)</h3>
                  <div className="border rounded bg-white/50 p-4">
                    <SizeProvider size="lg">
                      <div className="flex items-center gap-4">
                        <Button variant="secondary">Secondary Large</Button>
                        <Spinner style="dots" speed="fast" />
                        <Button variant="link">Link Large</Button>
                      </div>
                    </SizeProvider>
                  </div>
                </div>
              </div>
            </section>

            {/* Mixed usage example */}
            <section className="border rounded-lg p-6 bg-purple-50/30">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">
                Mixed Usage Example
                <div className="text-sm font-normal text-purple-700">Combining adaptive and fixed-size components</div>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost">Ghost Adaptive</Button>
                  <Button size="sm" variant="outline">Outline Small</Button>
                  <Spinner style="circular" speed="medium" />
                  <Spinner size="lg" style="bars" speed="slow" />
                </div>

                <SizeProvider size="xl">
                  <div className="border rounded bg-white/50 p-4">
                    <div className="text-sm text-purple-800 mb-2">Fixed XL Section</div>
                    <div className="flex items-center gap-4">
                      <Button variant="primary">Primary XL</Button>
                      <Button size="sm" variant="warning">Warning Small</Button>
                      <Spinner style="dots" speed="fast" />
                    </div>
                  </div>
                </SizeProvider>
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

export const Medium = {
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
