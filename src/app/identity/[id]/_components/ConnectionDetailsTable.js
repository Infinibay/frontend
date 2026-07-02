'use client';

import { DataTable } from '@infinibay/harbor';

export function ConnectionDetailsTable({ provider }) {
  const connectionRows = [
    { id: 'host', label: 'Host', value: provider.host },
    { id: 'port', label: 'Port', value: String(provider.port), mono: true },
    { id: 'tls', label: 'TLS', value: provider.useTls ? 'Enabled' : 'Disabled' },
    ...(provider.useTls
      ? [
          {
            id: 'tlsCa',
            label: 'TLS CA',
            value: provider.tlsCa ? 'Configured' : 'System default'
          },
          {
            id: 'tlsVerify',
            label: 'Certificate validation',
            value: provider.tlsInsecureSkipVerify ? 'Skipped (insecure)' : 'Enabled',
            warn: !!provider.tlsInsecureSkipVerify
          }
        ]
      : []),
    { id: 'domain', label: 'Domain', value: provider.domain },
    { id: 'baseDn', label: 'Base DN', value: provider.baseDn, mono: true },
    { id: 'bindDn', label: 'Bind DN', value: provider.bindDn, mono: true },
    { id: 'password', label: 'Bind password', value: provider.hasBindPassword ? 'Stored' : 'Not configured' },
    { id: 'userFilter', label: 'User filter', value: provider.userFilter, mono: true },
    { id: 'groupFilter', label: 'Group filter', value: provider.groupFilter, mono: true }
  ];
  const providerColumns = [
    {
      id: 'label',
      header: 'Setting',
      width: 180,
      cell: ({ row }) => <span className="text-sm text-fg-muted">{row.label}</span>
    },
    {
      id: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <span
          className={[
            row.mono ? 'font-mono text-xs break-all' : 'text-sm',
            row.warn ? 'text-[rgb(var(--harbor-warning))] font-medium' : ''
          ].filter(Boolean).join(' ')}
        >
          {row.value || '—'}
        </span>
      )
    }
  ];
  return (
    <DataTable
      rows={connectionRows}
      columns={providerColumns}
      rowId={(r) => r.id}
      defaultDensity="compact"
    />
  );
}
