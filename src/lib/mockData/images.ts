export type ImageVersionStatus = 'draft' | 'published' | 'deprecated';

export interface GoldenImageVersion {
  id: string;
  version: string;
  status: ImageVersionStatus;
  createdAt: string;
  sizeGB: number;
  notes: string;
}

export interface GoldenImage {
  id: string;
  name: string;
  os: string;
  currentVersion: string;
  usedByPools: number;
  versions: GoldenImageVersion[];
}

const now = Date.now();

export const GOLDEN_IMAGES: GoldenImage[] = [
  {
    id: 'img-win11-office',
    name: 'Win11 Office',
    os: 'Windows 11 Pro 23H2',
    currentVersion: 'v3',
    usedByPools: 2,
    versions: [
      { id: 'v1', version: 'v1', status: 'deprecated', createdAt: new Date(now - 210 * 86400000).toISOString(), sizeGB: 42, notes: 'Initial build, Office 2021.' },
      { id: 'v2', version: 'v2', status: 'deprecated', createdAt: new Date(now - 120 * 86400000).toISOString(), sizeGB: 44, notes: 'February cumulative update applied.' },
      { id: 'v3', version: 'v3', status: 'published',  createdAt: new Date(now - 30  * 86400000).toISOString(), sizeGB: 46, notes: 'Microsoft 365 Apps switched to Current channel.' },
      { id: 'v4', version: 'v4', status: 'draft',      createdAt: new Date(now - 2   * 86400000).toISOString(), sizeGB: 46, notes: 'New Defender signature baseline. Pending QA.' },
    ],
  },
  {
    id: 'img-win11-contab',
    name: 'Win11 Contabilidad',
    os: 'Windows 11 Pro 23H2',
    currentVersion: 'v4',
    usedByPools: 1,
    versions: [
      { id: 'v1', version: 'v1', status: 'deprecated', createdAt: new Date(now - 300 * 86400000).toISOString(), sizeGB: 48, notes: 'Initial build, SAP client preinstalled.' },
      { id: 'v2', version: 'v2', status: 'deprecated', createdAt: new Date(now - 180 * 86400000).toISOString(), sizeGB: 49, notes: 'Banking tokens certs renewed.' },
      { id: 'v3', version: 'v3', status: 'deprecated', createdAt: new Date(now - 90  * 86400000).toISOString(), sizeGB: 49, notes: 'A3 tax form plugin updated.' },
      { id: 'v4', version: 'v4', status: 'published',  createdAt: new Date(now - 10  * 86400000).toISOString(), sizeGB: 50, notes: 'SAP 2026.04 release.' },
    ],
  },
  {
    id: 'img-dev-ws',
    name: 'Dev Workstation',
    os: 'Ubuntu 24.04 LTS',
    currentVersion: 'v2',
    usedByPools: 1,
    versions: [
      { id: 'v1', version: 'v1', status: 'deprecated', createdAt: new Date(now - 160 * 86400000).toISOString(), sizeGB: 28, notes: 'Node 20, Python 3.12, Docker.' },
      { id: 'v2', version: 'v2', status: 'published',  createdAt: new Date(now - 45  * 86400000).toISOString(), sizeGB: 30, notes: 'Node 22 LTS, Bun 1.1, updated kernel.' },
    ],
  },
];
