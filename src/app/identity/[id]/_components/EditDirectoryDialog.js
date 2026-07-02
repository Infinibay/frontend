'use client';

import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogTitle,
  FieldRow,
  FormField,
  Select,
  Switch,
  Textarea,
  TextField } from
'@infinibay/harbor';

export function EditDirectoryDialog({
  form,
  onChange,
  onClose,
  onSave,
  saving,
  hasBindPassword
}) {
  return (
    <Dialog open size="lg" onClose={onClose}>
      <DialogTitle>Edit Directory</DialogTitle>
      <DialogBody>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(event) => {
            event.preventDefault();
            if (!saving) onSave();
          }}
        >
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-raised px-3 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Enabled</span>
              <span className="text-xs text-fg-muted">
                Disabled directories cannot be synced.
              </span>
            </div>
            <Switch
              aria-label="Enabled"
              checked={form.enabled}
              onChange={(event) => onChange('enabled', event.target.checked)}
            />
          </div>

          <FieldRow>
            <FormField label="Type">
              <Select
                aria-label="Type"
                value={form.providerType}
                onChange={(value) => onChange('providerType', value)}
                options={[
                  { value: 'ACTIVE_DIRECTORY', label: 'Active Directory' },
                  { value: 'LDAP', label: 'LDAP' }
                ]}
              />
            </FormField>
            <FormField label="Name" required>
              <TextField
                value={form.name}
                onChange={(event) => onChange('name', event.target.value)}
                placeholder="Corporate AD"
              />
            </FormField>
          </FieldRow>

          <FieldRow>
            <FormField label="Host" required>
              <TextField
                value={form.host}
                onChange={(event) => onChange('host', event.target.value)}
                placeholder="dc01.example.com"
              />
            </FormField>
            <FormField label="Port" required>
              <TextField
                value={form.port}
                onChange={(event) => onChange('port', event.target.value)}
                placeholder={form.useTls ? '636' : '389'}
              />
            </FormField>
          </FieldRow>

          <Checkbox
            label="Use TLS"
            checked={form.useTls}
            onChange={(event) => {
              const nextUseTls = event.target.checked;
              onChange('useTls', nextUseTls);
              // Only swap to the scheme default when the field is empty or still
              // holds the other scheme's default, so a custom port isn't wiped.
              const current = String(form.port ?? '').trim();
              if (current === '' || current === '389' || current === '636') {
                onChange('port', nextUseTls ? '636' : '389');
              }
            }}
          />

          <FormField label="TLS CA certificate (PEM)">
            <Textarea
              rows={4}
              value={form.tlsCa}
              onChange={(event) => onChange('tlsCa', event.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----"
            />
          </FormField>
          <Checkbox
            label="Skip TLS certificate validation (insecure — disables cert validation; ignored in production)"
            checked={form.tlsInsecureSkipVerify}
            onChange={(event) => onChange('tlsInsecureSkipVerify', event.target.checked)}
          />

          <FormField label="Domain">
            <TextField
              value={form.domain}
              onChange={(event) => onChange('domain', event.target.value)}
              placeholder="example.com"
            />
          </FormField>
          <FormField label="Base DN" required>
            <TextField
              value={form.baseDn}
              onChange={(event) => onChange('baseDn', event.target.value)}
              placeholder="DC=example,DC=com"
            />
          </FormField>
          <FormField label="Bind DN">
            <TextField
              value={form.bindDn}
              onChange={(event) => onChange('bindDn', event.target.value)}
              placeholder="CN=infinibay,OU=Service Accounts,DC=example,DC=com"
            />
          </FormField>
          <FormField label="Bind password">
            <TextField
              type="password"
              value={form.bindPassword}
              onChange={(event) => onChange('bindPassword', event.target.value)}
              placeholder={hasBindPassword ? '•••••• (unchanged)' : 'Stored encrypted in the backend'}
            />
          </FormField>

          <FieldRow>
            <FormField label="User filter">
              <TextField
                value={form.userFilter}
                onChange={(event) => onChange('userFilter', event.target.value)}
              />
            </FormField>
            <FormField label="Group filter">
              <TextField
                value={form.groupFilter}
                onChange={(event) => onChange('groupFilter', event.target.value)}
              />
            </FormField>
          </FieldRow>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
            >
              Save changes
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
}
