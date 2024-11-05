import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import Layout from '@/features/layout/layout'
import { ComputerCard } from './components/ComputerCard'

const computers = [
  {
    id: 1,
    name: 'Computer 1',
    cpu: 4,
    ram: 8,
    storage: 50,
    user: {
      id: 1,
      name: 'Andres Borek',
      email: 'andres@infinibay.com',
      avatar: '/images/user-avatar-02.png',
    },
  },
  {
    id: 2,
    name: 'Computer 2',
    cpu: 8,
    ram: 16,
    storage: 100,
    user: {
      id: 2,
      name: 'Danilo Borek',
      email: 'danilo@infinibay.com',
      avatar: '/images/user-avatar-02.png',
    },
  },
  {
    id: 3,
    name: 'Computer 3',
    cpu: 16,
    ram: 32,
    storage: 200,
    user: {
      id: 3,
      name: 'John Doe',
      email: 'john@doe.com',
      avatar: '/images/user-avatar-02.png',
    },
  },
]

interface TemplateComputerMainProps {}

export function TemplateComputerMain({ ...props }: TemplateComputerMainProps) {
  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4">
        <TypographyH2>Computers</TypographyH2>
        <div className="flex flex-1 flex-col">
          <div className="flex gap-8">
            {computers.map((computer, index) => (
              <ComputerCard
                key={computer.id}
                className="w-36"
                active={index === 0}
                name={computer.name}
                avatarUrl={computer.user.avatar}
              />
            ))}{' '}
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
        </div>
      </div>
    </Layout>
  )
}
