import { ClassValue } from 'clsx'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Computer } from '../types/Computer'

interface ComputersTableProps {
  className?: ClassValue
  computers: Computer[]
  onEdit: (computer: Computer) => void
  onDelete: (computer: Computer) => void
}

/// Takes a number and print it in a human readable format, like 12Tb, 1Gb, 100Mb,
const parseStorageNumber = (storage: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (storage >= 1024 && i < units.length - 1) {
    storage /= 1024
    i++
  }
  return `${storage.toFixed(2)} ${units[i]}`
}

export function ComputersTable({ className, computers, onEdit, onDelete }: ComputersTableProps) {
  return (
    <Table className={cn('w-full', className)}>
      <TableCaption>A list of all your Computers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>CPU</TableHead>
          <TableHead>RAM</TableHead>
          <TableHead>Storage</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {computers.map((computer) => (
          <TableRow key={computer.id}>
            <TableCell>{computer.id}</TableCell>
            <TableCell className="font-medium">{computer.user?.name ?? '-'}</TableCell>
            <TableCell>{computer.cpu}</TableCell>
            <TableCell>{computer.ram}</TableCell>
            <TableCell>{parseStorageNumber(computer.storage)}</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
