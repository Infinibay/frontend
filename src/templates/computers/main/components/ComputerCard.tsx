import { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'
import AllInOneSvg from '/images/all-in-one.svg'

interface ComputerCardProps {
  className?: ClassValue
  active?: boolean
  name: string
  avatarUrl: string
}

export function ComputerCard({ className, name, avatarUrl, active = false }: ComputerCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg bg-muted/50',
        active &&
          'before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:rounded-lg before:border before:border-dashed',
        className,
      )}
    >
      <div className="center flex justify-center p-4">
        <img src={AllInOneSvg} />
      </div>
      <div className="bg-gray-950 pb-1 pl-2 pr-4 pt-1 dark:bg-black">{name}</div>
      <img
        src={avatarUrl}
        className="absolute bottom-0 right-0 w-10 translate-x-1/2 translate-y-2 rounded-full border-2 border-white"
      />
    </div>
  )
}
