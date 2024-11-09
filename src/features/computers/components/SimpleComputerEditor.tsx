import { StopIcon } from '@radix-ui/react-icons'
import {
  EditIcon,
  PanelLeft,
  PauseIcon,
  PlayIcon,
  ScreenShareIcon,
  SearchIcon,
  SpaceIcon,
  TrashIcon,
} from 'lucide-react'
import { ClassValue } from 'clsx'
import { Button, ButtonProps } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { TypographyH2, TypographyH3 } from '@/components/ui/typography'
import { Computer, ComputerStatus } from '@/features/computers/types/Computer'
import { cn } from '@/lib/utils'
import { ComputerCard } from './ComputerCard'
import ComputerScreenshotPng from '/images/pc-screenshot.png'

interface SimpleComputerEditorProps extends React.ComponentPropsWithoutRef<'div'> {
  computer: Computer
  onSave: (computer: Computer) => void
  onClose: (computer: Computer) => void
}

export function SimpleComputerEditor({ className, computer, onSave, onClose }: SimpleComputerEditorProps) {
  const user = computer.user
  const status = computer.status

  return (
    <div className={cn('flex w-[500px] flex-col', className)}>
      <div className="flex items-center justify-between pb-2">
        <TypographyH3>
          <Button variant="ghost" size="icon" className={cn('mr-2 h-7 w-7')} onClick={() => onClose(computer)}>
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          {user ? `${user.name}'s Computer` : 'Unassigned Computer'}
        </TypographyH3>
        <span
          className={cn(
            'rounded-sm border px-4',
            status === ComputerStatus.Running && 'border-green-500 bg-green-200 text-green-500',
            status === ComputerStatus.Stopped && 'border-yellow-500 bg-yellow-100 text-yellow-500',
            status === ComputerStatus.Building && 'border-blue-500 bg-blue-200 text-blue-500',
          )}
        >
          {status === ComputerStatus.Running ? 'Online' : status === ComputerStatus.Stopped ? 'Stopped' : 'Building'}
        </span>
      </div>

      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          alt="React Rendezvous"
          loading="lazy"
          decoding="async"
          className="aspect-video h-auto w-auto object-cover transition-all hover:scale-105"
          src={ComputerScreenshotPng}
        />
      </div>
      {/* Add Play/Pause, Stop, Screen Cast, (Space), Edit and Delete control buttons */}
      <div className="flex items-center justify-center gap-2 rounded-b-lg bg-white px-4 py-2">
        <MediaButton pressed={status === ComputerStatus.Running}>
          {status === ComputerStatus.Running ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </MediaButton>
        <MediaButton disabled={status === ComputerStatus.Stopped}>
          <StopIcon className="h-4 w-4" />
        </MediaButton>
        <MediaButton>
          <ScreenShareIcon className="h-4 w-4" />
        </MediaButton>
        <div className="grow"></div>
        <MediaButton>
          <EditIcon className="h-4 w-4" />
        </MediaButton>
        <MediaButton>
          <TrashIcon className="h-4 w-4" />
        </MediaButton>
      </div>

      <div className="flex flex-col gap-2 pt-4 text-sm">
        <div className="flex flex-row justify-between">
          <span className="font-bold">Computer Name</span>
          <span>{computer.name}</span>
        </div>

        {user && (
          <div className="flex flex-row justify-between">
            <span className="font-bold">User</span>
            <span>{user.name}</span>
          </div>
        )}

        <div className="flex flex-row justify-between">
          <span className="font-bold">Template Name</span>
          <span>Office Medium</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Applications */}
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between pb-2">
          <span className="font-bold">Applications</span>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 w-4" />
            <Input type="text" placeholder="Search..." className="w-[180px] pl-7" />
          </div>
        </div>

        <div className="h-64 rounded-lg bg-white"></div>
      </div>

      {/* Actions */}
      <div className="flex flex-row justify-end gap-2 pt-4">
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          onClick={() => onSave(computer)}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

interface MediaButtonProps {
  pressed?: boolean
  disabled?: boolean
  children: React.ReactNode
}

function MediaButton({ children, pressed = false, disabled = false }: MediaButtonProps) {
  return (
    <Toggle
      className="border-gray-400 bg-transparent text-gray-800 hover:bg-transparent hover:text-gray-800 data-[state=on]:border-green-500 data-[state=on]:bg-green-100 data-[state=on]:text-green-500"
      variant="outline"
      pressed={pressed}
      disabled={disabled}
    >
      {children}
    </Toggle>
  )
}
