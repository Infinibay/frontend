import { Grid2X2, List } from 'lucide-react'
import { ClassValue } from 'clsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export enum ViewModeToggleMode {
  Grid = 'Grid',
  Table = 'Table',
}

export interface ViewModeToggleProps {
  className?: ClassValue
  mode: ViewModeToggleMode
  onValueChange: (mode: ViewModeToggleMode) => void
}

export function ViewModeToggle({ className, mode, onValueChange }: ViewModeToggleProps) {
  return (
    <div className={cn('hidden h-8 items-center gap-1.5 rounded-md border p-[2px] md:flex', className)}>
      <ToggleGroup type="single" value={mode} onValueChange={onValueChange}>
        <ToggleGroupItem className="h-6 rounded-sm" value={ViewModeToggleMode.Grid} aria-label="Toggle bold">
          <Grid2X2 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem className="h-6 rounded-sm" value={ViewModeToggleMode.Table} aria-label="Toggle italic">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
