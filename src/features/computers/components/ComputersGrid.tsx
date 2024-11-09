import { ClassValue } from 'clsx'
import { Computer } from '@/features/computers/types/Computer'
import { cn } from '@/lib/utils'
import { ComputerCard } from './ComputerCard'

interface ComputersGridProps {
  className?: ClassValue
  computers: Computer[]
  activeComputer?: Computer
  onEdit: (computer: Computer) => void
  onDelete: (computer: Computer) => void
}

export function ComputersGrid({ className, computers, activeComputer, onEdit, onDelete }: ComputersGridProps) {
  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      <div className="flex gap-8">
        {computers.map((computer, index) => (
          <ComputerCard
            key={computer.id}
            className="w-36"
            active={activeComputer?.id === computer.id}
            name={computer.name}
            avatarUrl={computer.user?.avatar}
            onClick={() => onEdit(computer)}
          />
        ))}
      </div>
    </div>
  )
}
