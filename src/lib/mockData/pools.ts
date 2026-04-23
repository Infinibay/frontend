export type PoolType = 'persistent' | 'non-persistent';

export interface Pool {
  id: string;
  name: string;
  department: string;
  blueprint: string;      // blueprint name
  imageVersion: string;
  type: PoolType;
  minSize: number;
  maxSize: number;
  activeSessions: number;
  idleDesktops: number;
  health: 'ok' | 'degraded' | 'error';
  idleTimeoutMin: number;
  assignedGroups: string[];
}

export const POOLS: Pool[] = [
  {
    id: 'pool-contab',
    name: 'Contabilidad',
    department: 'Contabilidad',
    blueprint: 'Win11 Contabilidad',
    imageVersion: 'v4 (published)',
    type: 'non-persistent',
    minSize: 5,
    maxSize: 20,
    activeSessions: 7,
    idleDesktops: 4,
    health: 'ok',
    idleTimeoutMin: 30,
    assignedGroups: ['CN=Contabilidad,OU=Groups,DC=acme,DC=local'],
  },
  {
    id: 'pool-ventas',
    name: 'Ventas-Office',
    department: 'Ventas',
    blueprint: 'Win11 Office',
    imageVersion: 'v3 (published)',
    type: 'non-persistent',
    minSize: 3,
    maxSize: 15,
    activeSessions: 4,
    idleDesktops: 2,
    health: 'ok',
    idleTimeoutMin: 30,
    assignedGroups: ['CN=Ventas,OU=Groups,DC=acme,DC=local'],
  },
  {
    id: 'pool-devs',
    name: 'Engineering',
    department: 'Engineering',
    blueprint: 'Dev Workstation',
    imageVersion: 'v2 (published)',
    type: 'persistent',
    minSize: 2,
    maxSize: 8,
    activeSessions: 5,
    idleDesktops: 0,
    health: 'ok',
    idleTimeoutMin: 120,
    assignedGroups: ['acme-devs'],
  },
  {
    id: 'pool-cx',
    name: 'Call Center',
    department: 'Atención al Cliente',
    blueprint: 'Win11 Call Center',
    imageVersion: 'v1 (published)',
    type: 'non-persistent',
    minSize: 10,
    maxSize: 40,
    activeSessions: 22,
    idleDesktops: 6,
    health: 'degraded',
    idleTimeoutMin: 10,
    assignedGroups: ['CN=CallCenter,OU=Groups,DC=acme,DC=local'],
  },
];
