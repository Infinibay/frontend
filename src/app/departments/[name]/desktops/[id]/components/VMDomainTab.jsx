'use client';

import { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Page,
  ResponsiveStack,
  Select,
  Switch,
  TextField } from
'@infinibay/harbor';
import { AlertTriangle, CheckCircle, Network, ShieldCheck } from 'lucide-react';

import client from '@/apollo-client';
import { useIdentityProvidersQuery } from '@/gql/hooks';
import { toast } from '@/hooks/use-toast';

const JOIN_VM_TO_DOMAIN = gql`
  mutation JoinVmToDomain($input: JoinDomainInput!) {
    joinVmToDomain(input: $input) {
      success
      message
      domain
      error
    }
  }
`;

const STATUS_META = {
  JOINED: { tone: 'success', label: 'Joined', icon: <CheckCircle size={12} /> },
  PENDING: { tone: 'info', label: 'Joining…', icon: <Network size={12} /> },
  FAILED: { tone: 'danger', label: 'Failed', icon: <AlertTriangle size={12} /> }
};

function formatDate(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleString();
  } catch {
    return null;
  }
}

const VMDomainTab = ({ vmId, vm, vmStatus, vmSetupComplete, onJoined }) => {
  const cfg = vm?.configuration || {};
  const currentStatus = cfg.domainJoinStatus || null;
  const currentDomain = cfg.domainName || null;
  const joinedAt = formatDate(cfg.domainJoinedAt);
  const joinError = cfg.domainJoinError || null;

  const { data, loading: providersLoading } = useIdentityProvidersQuery({
    fetchPolicy: 'cache-and-network'
  });

  const providers = useMemo(() => {
    const list = data?.identityProviders || [];
    // Only providers that are enabled and actually have a domain can join VMs.
    return list.filter((p) => p.enabled && p.domain);
  }, [data]);

  const [providerId, setProviderId] = useState('');
  const [ou, setOu] = useState('');
  const [computerName, setComputerName] = useState('');
  const [restartAfter, setRestartAfter] = useState(false);
  const [useOverride, setUseOverride] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const vmRunning = vmStatus === 'running';
  const blockedReason = !vmSetupComplete
    ? 'The VM must finish initial setup before joining a domain.'
    : !vmRunning
      ? 'Start the VM before joining it to a domain — the in-VM agent must be reachable.'
      : null;

  const onJoin = async () => {
    if (!providerId) {
      toast({ title: 'Pick a directory', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { data: res } = await client.mutate({
        mutation: JOIN_VM_TO_DOMAIN,
        variables: {
          input: {
            machineId: vmId,
            identityProviderId: providerId,
            ou: ou.trim() || undefined,
            computerName: computerName.trim() || undefined,
            restartAfter,
            username: useOverride ? username.trim() || undefined : undefined,
            password: useOverride ? password || undefined : undefined
          }
        }
      });
      const r = res?.joinVmToDomain;
      if (r?.success) {
        toast({ title: 'Domain join started', description: r.message || `Joining ${r.domain || 'domain'}…` });
        setPassword('');
        onJoined?.();
      } else {
        toast({ title: 'Domain join failed', description: r?.error || 'Unknown error', variant: 'destructive' });
        onJoined?.();
      }
    } catch (err) {
      toast({ title: 'Domain join failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusMeta = currentStatus ? STATUS_META[currentStatus] : null;

  return (
    <Page>
      <Card
        variant="default"
        spotlight={false}
        glow={false}
        leadingIcon={<Network size={18} />}
        leadingIconTone="sky"
        title={
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
            <span>Active Directory</span>
            {statusMeta ?
          <Badge tone={statusMeta.tone} icon={statusMeta.icon}>
                {statusMeta.label}
              </Badge> :
          <Badge tone="neutral">Not joined</Badge>}
          </ResponsiveStack>
        }
        description={
        currentStatus === 'JOINED' && currentDomain ?
        `This desktop is joined to ${currentDomain}${joinedAt ? ` · ${joinedAt}` : ''}` :
        'Join this desktop to a configured directory so domain users can sign in.'
        }>

        <ResponsiveStack direction="col" gap={4}>
          {currentStatus === 'FAILED' && joinError ?
          <Alert tone="danger" icon={<AlertTriangle size={14} />} title="Last join failed">
              {joinError}
            </Alert> :
          null}

          {blockedReason ?
          <Alert tone="warning" icon={<AlertTriangle size={14} />} title="VM not ready">
              {blockedReason}
            </Alert> :
          null}

          {providersLoading && providers.length === 0 ?
          <span className="text-fg-muted text-sm">Loading directories…</span> :
          providers.length === 0 ?
          <EmptyState
            icon={<ShieldCheck size={18} />}
            title="No directories with a domain"
            description="Configure an Active Directory / LDAP connector with a domain on the Identity page first." /> :


          <ResponsiveStack direction="col" gap={3}>
              <Select
              label="Directory"
              value={providerId}
              onChange={setProviderId}
              options={[
              { value: '', label: '— pick a directory —' },
              ...providers.map((p) => ({
                value: p.id,
                label: `${p.name} · ${p.domain}`
              }))]
              } />

              <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={3}>
                <div className="flex-1 min-w-0">
                  <TextField
                  label="Computer name (optional)"
                  value={computerName}
                  onChange={(e) => setComputerName(e.target.value)}
                  placeholder="Defaults to the current hostname" />
                </div>
                <div className="flex-1 min-w-0">
                  <TextField
                  label="OU / container (optional)"
                  value={ou}
                  onChange={(e) => setOu(e.target.value)}
                  placeholder="OU=Desktops,DC=corp,DC=example,DC=com" />
                </div>
              </ResponsiveStack>

              <Switch
              label="Use a different join account"
              description="By default the directory's bind account is used."
              checked={useOverride}
              onChange={(e) => setUseOverride(e.target.checked)} />

              {useOverride ?
            <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={3}>
                  <div className="flex-1 min-w-0">
                    <TextField
                  label="Join username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@corp.example.com" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <TextField
                  label="Join password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </ResponsiveStack> :
            null}

              <Switch
              label="Restart after join"
              description="Reboot the desktop so the domain membership takes effect."
              checked={restartAfter}
              onChange={(e) => setRestartAfter(e.target.checked)} />

              <div className="flex justify-end pt-1">
                <Button
                variant="primary"
                icon={<Network size={14} />}
                loading={submitting}
                disabled={!!blockedReason || !providerId}
                onClick={onJoin}>
                  {currentStatus === 'JOINED' ? 'Re-join domain' : 'Join domain'}
                </Button>
              </div>
            </ResponsiveStack>
          }
        </ResponsiveStack>
      </Card>
    </Page>);

};

export default VMDomainTab;
