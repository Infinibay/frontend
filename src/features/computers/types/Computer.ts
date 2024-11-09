import { User } from './User'

export interface Computer {
  id: string
  name: string
  cpu: number
  ram: number
  storage: number
  status: ComputerStatus
  user?: User
  createdAt: Date
  updatedAt: Date
}

export enum ComputerStatus {
  None = 0,
  Building = 1,
  Running = 2,
  Stopped = 3,
}
