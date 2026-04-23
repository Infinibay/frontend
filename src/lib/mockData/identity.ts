/**
 * Mock fixtures for the Identity preview. Realistic enough to read as a
 * believable MSP demo; nothing is persisted.
 */

export type IdpType = 'AD' | 'LDAP' | 'AzureAD' | 'GoogleWorkspace' | 'Okta';
export type IdpStatus = 'ok' | 'syncing' | 'error';

export interface IdentityProvider {
  id: string;
  name: string;
  type: IdpType;
  status: IdpStatus;
  lastSyncAt: string;       // ISO
  usersSynced: number;
  groupsSynced: number;
  connection: {
    server: string;
    port: number;
    bindDN?: string;
    tls: boolean;
    baseDN?: string;
  };
  schedule: string;         // human readable
}

export const IDENTITY_PROVIDERS: IdentityProvider[] = [
  {
    id: 'idp-acme-ad',
    name: 'Acme AD (primary)',
    type: 'AD',
    status: 'ok',
    lastSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    usersSynced: 47,
    groupsSynced: 12,
    connection: {
      server: 'dc01.acme.local',
      port: 636,
      bindDN: 'CN=infinibay-svc,OU=Service Accounts,DC=acme,DC=local',
      tls: true,
      baseDN: 'DC=acme,DC=local',
    },
    schedule: 'Every 15 minutes',
  },
  {
    id: 'idp-okta',
    name: 'Okta Corporate',
    type: 'Okta',
    status: 'ok',
    lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    usersSynced: 64,
    groupsSynced: 8,
    connection: {
      server: 'acme.okta.com',
      port: 443,
      tls: true,
    },
    schedule: 'Every hour',
  },
];

export interface SyncRun {
  id: string;
  startedAt: string;
  durationMs: number;
  result: 'ok' | 'error';
  usersAdded: number;
  usersUpdated: number;
  usersRemoved: number;
  errorCount: number;
  errors?: string[];
}

export const SYNC_RUNS: Record<string, SyncRun[]> = {
  'idp-acme-ad': [
    { id: 'run-1', startedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),  durationMs: 1820, result: 'ok',    usersAdded: 0, usersUpdated: 2, usersRemoved: 0, errorCount: 0 },
    { id: 'run-2', startedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), durationMs: 1910, result: 'ok',    usersAdded: 1, usersUpdated: 3, usersRemoved: 0, errorCount: 0 },
    { id: 'run-3', startedAt: new Date(Date.now() - 33 * 60 * 1000).toISOString(), durationMs: 2110, result: 'ok',    usersAdded: 0, usersUpdated: 0, usersRemoved: 1, errorCount: 0 },
    { id: 'run-4', startedAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(), durationMs: 2440, result: 'error', usersAdded: 0, usersUpdated: 0, usersRemoved: 0, errorCount: 1, errors: ["User 'jdoe' missing mail attribute"] },
    { id: 'run-5', startedAt: new Date(Date.now() - 63 * 60 * 1000).toISOString(), durationMs: 1780, result: 'ok',    usersAdded: 0, usersUpdated: 1, usersRemoved: 0, errorCount: 0 },
    { id: 'run-6', startedAt: new Date(Date.now() - 78 * 60 * 1000).toISOString(), durationMs: 1920, result: 'ok',    usersAdded: 2, usersUpdated: 0, usersRemoved: 0, errorCount: 0 },
    { id: 'run-7', startedAt: new Date(Date.now() - 93 * 60 * 1000).toISOString(), durationMs: 1660, result: 'ok',    usersAdded: 0, usersUpdated: 0, usersRemoved: 0, errorCount: 0 },
    { id: 'run-8', startedAt: new Date(Date.now() - 108 * 60 * 1000).toISOString(), durationMs: 1850, result: 'ok',   usersAdded: 0, usersUpdated: 5, usersRemoved: 0, errorCount: 0 },
    { id: 'run-9', startedAt: new Date(Date.now() - 123 * 60 * 1000).toISOString(), durationMs: 1990, result: 'ok',   usersAdded: 1, usersUpdated: 0, usersRemoved: 0, errorCount: 0 },
    { id: 'run-10', startedAt: new Date(Date.now() - 138 * 60 * 1000).toISOString(), durationMs: 2080, result: 'ok',  usersAdded: 0, usersUpdated: 2, usersRemoved: 0, errorCount: 0 },
  ],
  'idp-okta': [
    { id: 'run-o1', startedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), durationMs: 930, result: 'ok', usersAdded: 0, usersUpdated: 1, usersRemoved: 0, errorCount: 0 },
    { id: 'run-o2', startedAt: new Date(Date.now() - 72 * 60 * 1000).toISOString(), durationMs: 880, result: 'ok', usersAdded: 3, usersUpdated: 0, usersRemoved: 0, errorCount: 0 },
    { id: 'run-o3', startedAt: new Date(Date.now() - 132 * 60 * 1000).toISOString(), durationMs: 910, result: 'ok', usersAdded: 0, usersUpdated: 2, usersRemoved: 1, errorCount: 0 },
  ],
};

export interface GroupMapping {
  id: string;
  group: string;      // LDAP DN or Okta group name
  maps: string;       // destination in Infinibay
  type: 'role' | 'department';
}

export const GROUP_MAPPINGS: Record<string, GroupMapping[]> = {
  'idp-acme-ad': [
    { id: 'm1', group: 'CN=IT Admins,OU=Groups,DC=acme,DC=local',   maps: 'Operator',     type: 'role' },
    { id: 'm2', group: 'CN=Contabilidad,OU=Groups,DC=acme,DC=local', maps: 'Contabilidad', type: 'department' },
    { id: 'm3', group: 'CN=Ventas,OU=Groups,DC=acme,DC=local',       maps: 'Ventas',       type: 'department' },
    { id: 'm4', group: 'CN=Marketing,OU=Groups,DC=acme,DC=local',    maps: 'Marketing',    type: 'department' },
    { id: 'm5', group: 'CN=Executives,OU=Groups,DC=acme,DC=local',   maps: 'Executive',    type: 'role' },
  ],
  'idp-okta': [
    { id: 'mo1', group: 'acme-operators', maps: 'Operator', type: 'role' },
    { id: 'mo2', group: 'acme-devs',      maps: 'Engineering', type: 'department' },
  ],
};

export interface SyncedUser {
  id: string;
  samAccountName: string;
  email: string;
  givenName: string;
  surname: string;
  groups: string[];
  lastLoginAt: string;
  enabled: boolean;
}

const firstNames = ['María', 'Juan', 'Carmen', 'Andrés', 'Lucía', 'Pablo', 'Elena', 'Diego', 'Sofía', 'Javier', 'Valentina', 'Mateo', 'Paula', 'Daniel', 'Camila', 'Sergio', 'Gabriela', 'Alejandro', 'Ana', 'Luis', 'Isabel', 'Carlos', 'Natalia', 'Rafael', 'Clara'];
const surnames = ['García', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Fernández', 'Romero', 'Ruiz', 'Torres', 'Jiménez', 'Vargas', 'Castro', 'Ortega'];

function slug(s: string) { return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]/g, ''); }

export const SYNCED_USERS: Record<string, SyncedUser[]> = {
  'idp-acme-ad': Array.from({ length: 25 }).map((_, i) => {
    const fn = firstNames[i % firstNames.length];
    const sn = surnames[i % surnames.length];
    const sam = `${slug(fn)[0]}${slug(sn)}`;
    const groups = [
      'CN=Users',
      i % 3 === 0 ? 'CN=Contabilidad' : i % 3 === 1 ? 'CN=Ventas' : 'CN=Marketing',
      i % 7 === 0 ? 'CN=IT Admins' : null,
    ].filter(Boolean) as string[];
    return {
      id: `u-ad-${i}`,
      samAccountName: sam,
      email: `${sam}@acme.local`,
      givenName: fn,
      surname: sn,
      groups,
      lastLoginAt: new Date(Date.now() - (i * 37 + 5) * 60 * 1000).toISOString(),
      enabled: i !== 11,
    };
  }),
  'idp-okta': Array.from({ length: 12 }).map((_, i) => {
    const fn = firstNames[(i + 5) % firstNames.length];
    const sn = surnames[(i + 3) % surnames.length];
    const sam = `${slug(fn)}.${slug(sn)}`;
    return {
      id: `u-okta-${i}`,
      samAccountName: sam,
      email: `${sam}@acme.com`,
      givenName: fn,
      surname: sn,
      groups: ['acme-operators'],
      lastLoginAt: new Date(Date.now() - (i * 51 + 20) * 60 * 1000).toISOString(),
      enabled: true,
    };
  }),
};
