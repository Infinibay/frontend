'use client';

// First-run onboarding (/setup, Phase B). Renders chrome-free inside the existing
// providers (Apollo/Redux/Harbor). Gated by the backend setupStatus: reachable
// pre-login while setup is open, and self-closing (redirects to the app) once
// completeSetup has run. Uses inline gql ops (see @/lib/setupOps) — no codegen.

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Wizard, Button, Alert, Card, TextField, SecretsInput, PasswordStrength, Select, Badge,
} from '@infinibay/harbor';
import auth from '@/utils/auth';
import IsoStep from '@/components/setup/IsoStep';
import {
  SETUP_STATUS, COMPLETE_SETUP, SETUP_CHANGE_ADMIN_PASSWORD,
  SETUP_CREATE_USER, SETUP_ROLES,
} from '@/lib/setupOps';

function Centered({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white/70">
      {children}
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(SETUP_STATUS, { fetchPolicy: 'cache-and-network' });
  const [authed, setAuthed] = React.useState(
    () => (typeof window !== 'undefined' ? !!auth.getToken?.() : false),
  );

  const status = data?.setupStatus;

  React.useEffect(() => {
    if (status?.completed) router.replace('/');
  }, [status?.completed, router]);

  if (loading && !data) return <Centered>Loading setup…</Centered>;
  if (status?.completed) return <Centered>Setup already completed. Redirecting…</Centered>;

  return (
    <div className="min-h-screen w-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome to Infinibay</h1>
          <p className="mt-1 text-sm text-white/60">
            First-run setup — a few steps to secure and provision your VDI platform.
          </p>
        </div>

        {!authed ? (
          <SignInPanel onSignedIn={async () => { await refetch(); setAuthed(true); }} />
        ) : (
          <SetupWizard
            devModeAdmin={!!status?.devModeAdmin}
            onDone={() => router.replace('/')}
          />
        )}
      </div>
    </div>
  );
}

// ── Sign-in (standalone, before the wizard) ──────────────────────────────────
function SignInPanel({ onSignedIn }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e?.preventDefault?.();
    setError(''); setBusy(true);
    try {
      const token = await auth.login(email, password);
      if (!token) throw new Error('Invalid credentials');
      await onSignedIn?.();
    } catch (err) {
      setError(err?.message || 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium text-white">Sign in as administrator</h2>
      <p className="mt-1 mb-4 text-sm text-white/60">
        Use the administrator credentials configured during install (Phase A).
      </p>
      <form onSubmit={submit} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <SecretsInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <Alert tone="danger" size="sm" title="Sign-in failed">{error}</Alert>}
        <Button type="submit" variant="primary" loading={busy} disabled={busy} fullWidth>
          Sign in
        </Button>
      </form>
    </Card>
  );
}

// ── The wizard (after auth) ──────────────────────────────────────────────────
function SetupWizard({ devModeAdmin, onDone }) {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [finishError, setFinishError] = React.useState('');

  // Snapshot devModeAdmin at mount. The password step's mutation clears it
  // server-side; if we rebuilt `steps` from the live value the array would shrink
  // mid-flow and Harbor's Wizard (which tracks its index internally) would skip
  // the next step. A stable step list keeps navigation correct.
  const [showPasswordStep] = React.useState(!!devModeAdmin);

  const [changePassword] = useMutation(SETUP_CHANGE_ADMIN_PASSWORD);
  const [completeSetup] = useMutation(COMPLETE_SETUP);

  const steps = [];

  if (showPasswordStep) {
    steps.push({
      id: 'password',
      label: 'Secure the admin',
      description: 'Replace the insecure default password',
      content: (
        <div className="space-y-4">
          <Alert tone="warning" title="Default administrator password in use">
            This system was bootstrapped with the insecure dev default
            (admin@example.com / password). Set a strong password before continuing —
            setup cannot be completed until you do.
          </Alert>
          <SecretsInput
            label="New password (min 12 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordStrength value={newPassword} />
          <SecretsInput
            label="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      ),
      validate: async () => {
        if (!newPassword || newPassword.length < 12) return 'Use at least 12 characters.';
        if (newPassword !== confirm) return 'Passwords do not match.';
        try {
          await changePassword({ variables: { newPassword } });
          // Do NOT refetch setup status here — that would flip devModeAdmin and,
          // via the parent re-render, disturb the wizard. completeSetup re-checks
          // server-side at the end anyway.
          return true;
        } catch (err) {
          return err?.message || 'Could not update the password.';
        }
      },
    });
  }

  steps.push({
    id: 'permissions',
    label: 'Permissions',
    description: 'Review the default roles',
    content: <PermissionsStep />,
  });

  steps.push({
    id: 'users',
    label: 'Users',
    description: 'Optionally add teammates',
    content: <UsersStep />,
  });

  steps.push({
    id: 'isos',
    label: 'OS images',
    description: 'Install ISOs',
    content: <IsoStep />,
  });

  steps.push({
    id: 'migration',
    label: 'Migration',
    description: 'How VMs move between hosts',
    content: <MigrationStep />,
  });

  steps.push({
    id: 'review',
    label: 'Finish',
    description: 'Complete setup',
    content: (
      <div className="space-y-4">
        <Alert tone="success" title="Almost done">
          Finishing setup closes this onboarding permanently. You can manage users,
          permissions and ISOs anytime from the app afterwards.
        </Alert>
        {finishError && <Alert tone="danger" size="sm" title="Could not finish">{finishError}</Alert>}
      </div>
    ),
    validate: async () => {
      setFinishError('');
      try {
        const { data } = await completeSetup();
        if (!data?.completeSetup?.completed) return 'Setup did not complete — please retry.';
        return true;
      } catch (err) {
        const msg = err?.message || 'Could not complete setup.';
        setFinishError(msg);
        return msg;
      }
    },
  });

  return <Wizard steps={steps} onComplete={onDone} />;
}

// ── Steps ────────────────────────────────────────────────────────────────────
function PermissionsStep() {
  const { data } = useQuery(SETUP_ROLES, { fetchPolicy: 'cache-and-network' });
  const roles = data?.roles || [];
  return (
    <div className="space-y-4">
      <Alert tone="info" title="Default roles are ready to use">
        Infinibay ships three system roles. Leaving the defaults is the recommended
        path — you can customize per-role permissions later from the Policies page.
      </Alert>
      <div className="grid gap-3">
        {roles.length === 0 && <Card className="p-4 text-sm text-white/60">Loading roles…</Card>}
        {roles.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{r.name}</span>
              {r.isSystem && <Badge tone="purple">system</Badge>}
            </div>
            {r.description && <p className="mt-1 text-sm text-white/60">{r.description}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function UsersStep() {
  const [form, setForm] = React.useState({ firstName: '', lastName: '', email: '', password: '', role: 'USER' });
  const [added, setAdded] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [createUser] = useMutation(SETUP_CREATE_USER);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const add = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (form.password.length < 12) { setError('Use a password of at least 12 characters.'); return; }
    setBusy(true);
    try {
      await createUser({
        variables: {
          input: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            passwordConfirmation: form.password,
            role: form.role,
          },
        },
      });
      setAdded((a) => [...a, { email: form.email, role: form.role }]);
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'USER' });
    } catch (err) {
      setError(err?.message || 'Could not create the user.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert tone="info" title="Add users (optional)">
        Create accounts for your team now, or skip and add them later. Passwords must be
        at least 12 characters.
      </Alert>

      {added.length > 0 && (
        <Card className="p-4">
          <div className="text-sm text-white/60 mb-2">Added</div>
          <ul className="space-y-1 text-sm">
            {added.map((u) => (
              <li key={u.email} className="flex items-center gap-2">
                <Badge tone="success">{u.role}</Badge>
                <span className="text-white/80">{u.email}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4">
        {/* Explicit wrapper div owns the vertical rhythm — space-y on the Card's
            own className does not reach children rendered in its content slot. */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="First name" value={form.firstName} onChange={set('firstName')} />
            <TextField label="Last name" value={form.lastName} onChange={set('lastName')} />
          </div>
          <TextField label="Email" type="email" value={form.email} onChange={set('email')} />
          <SecretsInput label="Password (min 12)" value={form.password} onChange={set('password')} />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => setForm((f) => ({ ...f, role: v }))}
            options={[
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'SUPER_ADMIN', label: 'Super admin' },
            ]}
          />
          {error && <Alert tone="danger" size="sm" title="Failed">{error}</Alert>}
          <div><Button variant="secondary" loading={busy} disabled={busy} onClick={add}>Add user</Button></div>
        </div>
      </Card>
    </div>
  );
}

function MigrationStep() {
  return (
    <div className="space-y-4">
      <Alert tone="info" title="Migration mode">
        How VMs move between hosts in a multi-node cluster.
      </Alert>
      <div className="grid gap-3">
        <Card className="p-4 border border-emerald-400/30">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">Cold migration</span>
            <Badge tone="success">enabled (default)</Badge>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Moves a VM between hosts while it is powered off. Simple and robust — it works
            even across hosts with different CPUs/hardware, because the VM boots fresh on the
            target. With shared storage the move is near-instant; without it, Infinibay copies
            and verifies the disk first.
          </p>
        </Card>
        <Card className="p-4 opacity-60">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">Live migration</span>
            <Badge tone="neutral">coming soon (WIP)</Badge>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Zero-downtime migration needs compatible CPUs/machine types, shared-or-mirrored
            storage and a fast host-to-host link, and is not yet available in Infinibay.
          </p>
        </Card>
      </div>
    </div>
  );
}
