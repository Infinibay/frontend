/**
 * Mock data for departments and VMs
 * Used as a fallback when the API is unavailable
 */

export const mockDepartments = [
  {
    id: "dept-1",
    name: "Engineering",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-02-10T14:30:00Z"
  },
  {
    id: "dept-2",
    name: "Marketing",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-02-12T11:45:00Z"
  },
  {
    id: "dept-3",
    name: "Finance",
    createdAt: "2024-01-22T10:30:00Z",
    updatedAt: "2024-02-14T16:20:00Z"
  },
  {
    id: "dept-4",
    name: "Human Resources",
    createdAt: "2024-01-25T11:45:00Z",
    updatedAt: "2024-02-15T09:10:00Z"
  },
  {
    id: "dept-5",
    name: "Research & Development",
    createdAt: "2024-01-28T13:00:00Z",
    updatedAt: "2024-02-18T15:30:00Z"
  },
  {
    id: "dept-6",
    name: "Customer Support",
    createdAt: "2024-02-01T14:15:00Z",
    updatedAt: "2024-02-20T10:45:00Z"
  }
];

export const mockVMs = [
  {
    id: "vm-1",
    vmId: "vm-001",
    name: "Engineering Server 1",
    status: "running",
    department: { id: "dept-1", name: "Engineering" },
    cpuCores: 4,
    ram: 8,
    storage: 256
  },
  {
    id: "vm-2",
    vmId: "vm-002",
    name: "Engineering Server 2",
    status: "paused",
    department: { id: "dept-1", name: "Engineering" },
    cpuCores: 8,
    ram: 16,
    storage: 512
  },
  {
    id: "vm-3",
    vmId: "vm-003",
    name: "Marketing Server",
    status: "running",
    department: { id: "dept-2", name: "Marketing" },
    cpuCores: 2,
    ram: 4,
    storage: 128
  },
  {
    id: "vm-4",
    vmId: "vm-004",
    name: "Finance Server 1",
    status: "stopped",
    department: { id: "dept-3", name: "Finance" },
    cpuCores: 4,
    ram: 8,
    storage: 256
  },
  {
    id: "vm-5",
    vmId: "vm-005",
    name: "Finance Server 2",
    status: "running",
    department: { id: "dept-3", name: "Finance" },
    cpuCores: 2,
    ram: 4,
    storage: 128
  },
  {
    id: "vm-6",
    vmId: "vm-006",
    name: "HR Server",
    status: "running",
    department: { id: "dept-4", name: "Human Resources" },
    cpuCores: 2,
    ram: 4,
    storage: 128
  },
  {
    id: "vm-7",
    vmId: "vm-007",
    name: "R&D Server 1",
    status: "running",
    department: { id: "dept-5", name: "Research & Development" },
    cpuCores: 16,
    ram: 64,
    storage: 1024
  },
  {
    id: "vm-8",
    vmId: "vm-008",
    name: "R&D Server 2",
    status: "running",
    department: { id: "dept-5", name: "Research & Development" },
    cpuCores: 8,
    ram: 32,
    storage: 512
  },
  {
    id: "vm-9",
    vmId: "vm-009",
    name: "Support Server",
    status: "running",
    department: { id: "dept-6", name: "Customer Support" },
    cpuCores: 4,
    ram: 8,
    storage: 256
  }
];
