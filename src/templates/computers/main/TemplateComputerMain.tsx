import { useState } from 'react'
import { TypographyH2 } from '@/components/ui/typography'
import { ComputersView } from '@/features/computers/components/ComputersView'
import { SimpleComputerEditor } from '@/features/computers/components/SimpleComputerEditor'
import { Computer, ComputerStatus } from '@/features/computers/types/Computer'
import Layout from '@/features/layout/layout'
import { cn } from '@/lib/utils'
import { ComputerCard } from '../../../features/computers/components/ComputerCard'
import { ViewModeToggle, ViewModeToggleMode } from '../../../features/computers/components/ViewModeToggle'

const computers: Computer[] = [
  {
    id: '1',
    name: 'Computer 1',
    status: ComputerStatus.Running,
    cpu: 4,
    ram: 8,
    storage: 5000000000,
    user: {
      id: '1',
      name: 'Andres Borek',
      email: 'andres@infinibay.com',
      avatar: '/images/user-avatar-02.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Computer 2',
    status: ComputerStatus.Stopped,
    cpu: 8,
    ram: 16,
    storage: 3400000000,
    user: {
      id: '2',
      name: 'Danilo Borek',
      email: 'danilo@infinibay.com',
      avatar: '/images/user-avatar-02.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Computer 3',
    status: ComputerStatus.Building,
    cpu: 16,
    ram: 32,
    storage: 12000000000,
    user: {
      id: '3',
      name: 'John Doe',
      email: 'john@doe.com',
      avatar: '/images/user-avatar-02.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function TemplateComputerMain() {
  const [viewMode, setViewMode] = useState<ViewModeToggleMode>(ViewModeToggleMode.Grid)
  const [activeComputer, setActiveComputer] = useState<Computer | null>(null)

  const handleEdit = (computer: Computer) => {
    setActiveComputer(computer)
  }

  const handleDelete = (computer: Computer) => {}

  const handleCloseComputerEditor = (computer: Computer) => {
    setActiveComputer(null)
  }

  const handleSaveEdit = (computer: Computer) => {}

  return (
    <Layout>
      <div className="flex h-full flex-row p-4">
        <div className="flex grow flex-col gap-4 p-4">
          <div className="flex items-center justify-between border-b pb-2">
            <TypographyH2>Computers</TypographyH2>
            <ViewModeToggle mode={viewMode} onValueChange={setViewMode} />
          </div>
          <ComputersView
            activeComputer={activeComputer}
            computers={computers}
            mode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        {!!activeComputer && (
          <SimpleComputerEditor
            className="border-l pl-4"
            computer={activeComputer}
            onSave={handleSaveEdit}
            onClose={handleCloseComputerEditor}
          />
        )}
      </div>
    </Layout>
  )
}
