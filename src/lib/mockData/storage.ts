export type StorageType =
  | 'internal'
  | 'smb'
  | 'nfs'
  | 'iscsi'
  | 's3'
  | 'azure_blob'
  | 'gcs'
  | 'backblaze'
  | 'wasabi'
  | 'dropbox'
  | 'gdrive';

export interface StorageMount {
  id: string;
  name: string;
  type: StorageType;
  endpoint: string;
  bucket?: string;
  totalGB: number;
  usedGB: number;
  latencyMs: number;
  bindings: string[]; // department names
  status: 'ok' | 'degraded' | 'error';
}

export const STORAGE_MOUNTS: StorageMount[] = [
  { id: 's-1', name: 'local-ssd-0',     type: 'internal',   endpoint: '/var/lib/infinibay/storage',                totalGB: 2048, usedGB: 820,  latencyMs: 0,  bindings: ['*'], status: 'ok' },
  { id: 's-2', name: 'file-server-01',  type: 'smb',        endpoint: 'smb://fs01.acme.local/profiles',            totalGB: 4096, usedGB: 1340, latencyMs: 2,  bindings: ['Contabilidad', 'Ventas'], status: 'ok' },
  { id: 's-3', name: 'backups-b2',      type: 'backblaze',  endpoint: 'b2://infinibay-backups',                    bucket: 'infinibay-backups', totalGB: 10240, usedGB: 3820, latencyMs: 46, bindings: ['*'], status: 'ok' },
  { id: 's-4', name: 'cold-storage-wa', type: 'wasabi',     endpoint: 's3.wasabisys.com/infinibay-cold',           bucket: 'infinibay-cold', totalGB: 20480, usedGB: 7210, latencyMs: 38, bindings: ['Backup'], status: 'ok' },
  { id: 's-5', name: 'legal-shared',    type: 'dropbox',    endpoint: 'https://api.dropboxapi.com/legal-team',     totalGB: 1024, usedGB: 612,  latencyMs: 88, bindings: ['Legal'], status: 'degraded' },
  { id: 's-6', name: 'gcs-artifacts',   type: 'gcs',        endpoint: 'gs://acme-artifacts',                       bucket: 'acme-artifacts', totalGB: 5120, usedGB: 2100, latencyMs: 24, bindings: ['Engineering'], status: 'ok' },
  { id: 's-7', name: 'azure-compliance',type: 'azure_blob', endpoint: 'https://acme.blob.core.windows.net/compliance', totalGB: 2048, usedGB: 440, latencyMs: 30, bindings: ['Compliance'], status: 'ok' },
];

export const TYPE_META: Record<StorageType, { label: string; family: 'internal' | 'network' | 'cloud' | 'third-party' }> = {
  internal:   { label: 'Internal',          family: 'internal' },
  smb:        { label: 'SMB / CIFS',        family: 'network' },
  nfs:        { label: 'NFS',               family: 'network' },
  iscsi:      { label: 'iSCSI',             family: 'network' },
  s3:         { label: 'Amazon S3',         family: 'cloud' },
  azure_blob: { label: 'Azure Blob',        family: 'cloud' },
  gcs:        { label: 'Google Cloud',      family: 'cloud' },
  backblaze:  { label: 'Backblaze B2',      family: 'third-party' },
  wasabi:     { label: 'Wasabi',            family: 'third-party' },
  dropbox:    { label: 'Dropbox Business',  family: 'third-party' },
  gdrive:     { label: 'Google Drive',      family: 'third-party' },
};
