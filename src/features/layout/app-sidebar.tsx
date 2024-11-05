import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Computer,
  Frame,
  GalleryVerticalEnd,
  Layers,
  Logs,
  Map,
  PieChart,
  Plus,
  PlusIcon,
  Settings2,
  SquareTerminal,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavMain } from '@/features/layout/nav-main'
import { NavProjects } from '@/features/layout/nav-projects'
import { NavUser } from '@/features/layout/nav-user'
import { TeamSwitcher } from '@/features/layout/team-switcher'

// This is sample data.
const data = {
  user: {
    name: 'Andres Borek',
    email: 'andres@infinibay.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Infinibay Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Infinibay Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Computers',
      url: '#',
      icon: Computer,
    },
    {
      title: 'Departments',
      url: '#',
      icon: Layers,
      isActive: true,
      items: [
        {
          title: 'Sales',
          url: '#',
        },
        {
          title: 'Add more',
          url: '#',
          icon: PlusIcon,
        },
      ],
    },
    {
      title: 'Users',
      url: '#',
      icon: Users,
    },
    {
      title: 'Registers',
      url: '#',
      icon: Logs,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
