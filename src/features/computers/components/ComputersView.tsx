import { ClassValue } from 'clsx'
import { Computer } from '@/features/computers/types/Computer'
import { cn } from '@/lib/utils'
import { ComputersGrid } from './ComputersGrid'
import { ComputersTable } from './ComputersTable'
import { ViewModeToggleMode } from './ViewModeToggle'

interface ComputersViewProps {
  className?: ClassValue
  computers: Computer[]
  activeComputer?: Computer
  mode: ViewModeToggleMode
  onEdit: (computer: Computer) => void
  onDelete: (computer: Computer) => void
}

export function ComputersView({ className, activeComputer, computers, mode, onEdit, onDelete }: ComputersViewProps) {
  return (
    <div className={cn(className)}>
      {mode === ViewModeToggleMode.Table ? (
        <ComputersTable computers={computers} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <ComputersGrid activeComputer={activeComputer} computers={computers} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  )
}
