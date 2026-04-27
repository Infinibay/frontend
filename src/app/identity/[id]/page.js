'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  StatusDot } from
'@infinibay/harbor';
import {
  Fingerprint,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  RefreshCw } from
'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import {
  IDENTITY_PROVIDERS,
  SYNC_RUNS,
  GROUP_MAPPINGS,
  SYNCED_USERS } from
'@/lib/mockData/identity';

const TYPE_LABEL = {
  AD: 'Active Directory',
  LDAP: 'LDAP',
  AzureAD: 'Azure AD',
  GoogleWorkspace: 'Google Workspace',
  Okta: 'Okta'
};

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-28 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>);

}

export default function IdentityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idp = IDENTITY_PROVIDERS.find((p) => p.id === params.id);

  const [tab, setTab] = useState('connection');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const mappingColumns = useMemo(() => [
  { id: 'group', header: 'Source group', cell: ({ row: r }) => <span className="font-mono text-xs">{r.group}</span> },
  { id: 'type', header: 'Type', width: 130, cell: ({ row: r }) => <Badge tone="neutral">{r.type}</Badge> },
  { id: 'maps', header: 'Maps to', cell: ({ row: r }) => <span>{r.maps}</span> }],
  []);

  const userColumns = useMemo(() => [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row: r }) =>
    <ResponsiveStack direction="row" gap={2} align="center">
          <StatusDot status={r.enabled ? 'online' : 'offline'} size={8} />
          <span className="font-medium">{r.givenName} {r.surname}</span>
        </ResponsiveStack>

  },
  { id: 'samAccountName', header: 'Login', width: 180, cell: ({ row: r }) => <span className="font-mono text-xs">{r.samAccountName}</span> },
  { id: 'email', header: 'Email', cell: ({ row: r }) => <span className="text-sm">{r.email}</span> },
  { id: 'lastLoginAt', header: 'Last login', width: 120, cell: ({ row: r }) => <span className="text-sm">{timeAgo(r.lastLoginAt)}</span> }],
  []);

  const runColumns = useMemo(() => [
  {
    id: 'result',
    header: 'Result',
    width: 110,
    cell: ({ row: r }) =>
    <ResponsiveStack direction="row" gap={2} align="center">
          <StatusDot status={r.result === 'ok' ? 'online' : 'degraded'} size={8} />
          <span className="capitalize text-sm">{r.result}</span>
        </ResponsiveStack>

  },
  { id: 'startedAt', header: 'Started', width: 150, cell: ({ row: r }) => <span className="text-sm">{timeAgo(r.startedAt)}</span> },
  { id: 'durationMs', header: 'Duration', width: 100, cell: ({ row: r }) => <span className="font-mono text-xs">{r.durationMs} ms</span> },
  { id: 'usersAdded', header: '+', width: 60, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersAdded}</span> },
  { id: 'usersUpdated', header: '~', width: 60, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersUpdated}</span> },
  { id: 'usersRemoved', header: '−', width: 60, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersRemoved}</span> },
  { id: 'errors', header: 'Errors', cell: ({ row: r }) => r.errors?.length ? <span className="text-sm text-danger">{r.errors[0]}</span> : <span className="text-fg-subtle">—</span> }],
  []);

  const runTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        ok: true,
        message: idp?.type === 'Okta' ?
        `Connection OK — reached ${idp.connection.server} in 180ms. SAML metadata valid.` :
        'Connection OK — 2 domain controllers reachable (dc01.acme.local, dc02.acme.local).'
      });
    }, 820);
  };

  if (!idp) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PreviewBanner />
          <EmptyState
            icon={<Fingerprint size={18} />}
            title="Provider not found"
            actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/identity')}>
              
                Back to identity
              </Button>
            } />
          
        </ResponsiveStack>
      </Page>);

  }

  const runs = SYNC_RUNS[idp.id] || [];
  const mappings = GROUP_MAPPINGS[idp.id] || [];
  const users = SYNCED_USERS[idp.id] || [];

  const tabs = [
  { id: 'connection', header: 'Connection' },
  { id: 'sync', header: 'Sync' },
  { id: 'mapping', header: 'Mapping' },
  { id: 'users', header: `Users · ${users.length}` },
  { id: 'logs', header: 'Logs' }];


  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title={idp.name}
          count={`${TYPE_LABEL[idp.type]} · ${idp.usersSynced} users · last sync ${timeAgo(idp.lastSyncAt)}`}
          primary={
          <Button
            size="sm"
            variant="primary"
            icon={<RefreshCw size={14} />}
            loading={testing}
            onClick={runTest}>
            
              Test connection
            </Button>
          } />
        

        {testResult ?
        <Alert
          tone={testResult.ok ? 'success' : 'danger'}
          icon={testResult.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          title={testResult.ok ? 'Connection successful' : 'Connection failed'}>
          
            <span className="font-mono text-xs">{testResult.message}</span>
          </Alert> :
        null}

        {/* Tabs (manual, keeping it light) */}
        <ResponsiveStack direction="row" gap={1} align="center" wrap>
          {tabs.map((t) =>
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
            'text-sm px-3 py-1.5 rounded-md transition-colors',
            tab === t.id ? 'bg-white/10 text-fg' : 'text-fg-muted hover:text-fg hover:bg-white/5'].
            join(' ')}>
            
              {t.label}
            </button>
          )}
        </ResponsiveStack>

        {tab === 'connection' &&
        <section className="flex flex-col gap-3">
            <KV label="Server" value={idp.connection.server} mono />
            <KV label="Port" value={idp.connection.port} mono />
            {idp.connection.bindDN ? <KV label="Bind DN" value={idp.connection.bindDN} mono /> : null}
            {idp.connection.baseDN ? <KV label="Base DN" value={idp.connection.baseDN} mono /> : null}
            <KV label="TLS" value={idp.connection.tls ? 'Enabled' : 'Disabled'} />
            <KV label="Schedule" value={idp.schedule} />
          </section>
        }

        {tab === 'sync' &&
        <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0">
                Recent runs <span className="text-fg-muted text-xs font-normal">· {runs.length}</span>
              </h2>
            </div>
            <DataTable rows={runs} columns={runColumns} rowId={(r) => r.id} defaultDensity="compact" />
          </section>
        }

        {tab === 'mapping' &&
        <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0">
                Group → Infinibay mappings <span className="text-fg-muted text-xs font-normal">· {mappings.length}</span>
              </h2>
            </div>
            <DataTable rows={mappings} columns={mappingColumns} rowId={(r) => r.id} defaultDensity="compact" />
          </section>
        }

        {tab === 'users' &&
        <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0">
                Synced users <span className="text-fg-muted text-xs font-normal">· {users.length}</span>
              </h2>
            </div>
            <DataTable
            rows={users}
            columns={userColumns}
            rowId={(r) => r.id}
            defaultDensity="compact"
            onRowClick={() =>
            toast.info('Preview user — backend not wired yet.')
            } />
          
          </section>
        }

        {tab === 'logs' &&
        <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0">Logs</h2>
            </div>
            <div className="font-mono text-xs text-fg-muted flex flex-col gap-1 py-2">
              {runs.flatMap((r) =>
            (r.errors || []).map((e, i) =>
            <div key={`${r.id}-${i}`} className="flex gap-3">
                    <span className="text-fg-subtle">{timeAgo(r.startedAt)}</span>
                    <span className="text-danger">ERROR</span>
                    <span>{e}</span>
                  </div>
            )
            )}
              {runs.every((r) => !r.errors?.length) ?
            <span className="text-fg-subtle">No errors in recent runs.</span> :
            null}
            </div>
          </section>
        }
      </ResponsiveStack>
    </Page>);

}