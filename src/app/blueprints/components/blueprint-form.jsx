'use client';

/**
 * BlueprintForm — shared form body for /blueprints/new + /blueprints/[id]/edit.
 *
 * UX principles applied:
 *   1. Progressive disclosure: tabs 2–4 are hidden until OS is picked.
 *   2. Meaningful grouping: Hardening scripts split by Privacy/Bloatware/
 *      Performance via tag-derived buckets.
 *   3. Visible state: tab labels carry live counts of selected entries.
 *   4. OS-gated controls: BitLocker shown only on Windows; LUKS notice
 *      shown only on Linux.
 *   5. Filtered catalogs: Apps and hardening Scripts are filtered to
 *      those compatible with the selected OS. Presets also filter.
 *   6. No dead ends: empty states are tight and obvious.
 *
 * Fully controlled: parent owns `form` state + `onChange(patch)`.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  TextField,
  Textarea,
  Alert,
  ResponsiveStack,
  ResponsiveGrid,
  FieldRow,
  FormField,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  Checkbox,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  IconButton,
  Button,
  Spinner,
} from '@infinibay/harbor';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Settings2,
  Package,
  ShieldCheck,
  Monitor,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useScriptsQuery } from '@/gql/hooks';
import { toast } from '@/hooks/use-toast';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { fetchApplications } from '@/state/slices/applications';
import { getScriptDetails } from './script-details';
import { createSanitizedSVGMarkup } from '@/utils/svg-sanitizer';

// ---------------------------------------------------------------------------
// OS model
// ---------------------------------------------------------------------------

const OS_OPTIONS = [
  { value: '', label: '— pick an OS —' },
  { value: 'windows10', label: 'Windows 10' },
  { value: 'windows11', label: 'Windows 11' },
  { value: 'ubuntu', label: 'Ubuntu' },
  { value: 'fedora', label: 'Fedora' },
];

// Maps a blueprint osType → the OS family used for filtering. Returns 'windows'
// for any windows* osType, 'linux' for ubuntu/fedora. DB values like 'windows',
// 'ubuntu', 'fedora' are normalised to lowercase for comparison.
function osFamily(osType) {
  if (!osType) return null;
  if (osType.startsWith('windows')) return 'windows';
  return 'linux';
}

// ---------------------------------------------------------------------------
// Hardening: presets + tag-based grouping
// ---------------------------------------------------------------------------

const HARDENING_PRESETS = {
  'Calm Office': [
    'golden-image/windows-disable-telemetry.yaml',
    'golden-image/windows-disable-ads-suggestions.yaml',
    'golden-image/ubuntu-disable-telemetry.yaml',
    'golden-image/fedora-disable-telemetry.yaml',
  ],
  'Locked Down': [
    'golden-image/windows-disable-telemetry.yaml',
    'golden-image/windows-disable-cortana.yaml',
    'golden-image/windows-disable-ads-suggestions.yaml',
    'golden-image/windows-remove-bloatware.yaml',
    'golden-image/ubuntu-disable-telemetry.yaml',
    'golden-image/ubuntu-remove-snap-bloat.yaml',
    'golden-image/fedora-disable-telemetry.yaml',
    'golden-image/fedora-remove-tracker.yaml',
  ],
};

// Tag-based bucketing: each script's `tags` array drives which group it
// lives in. Falls back to "Other" if no tag matches.
const HARDENING_GROUPS = [
  { id: 'privacy', label: 'Privacy', matches: (s) => (s.tags ?? []).some((t) => ['privacy', 'telemetry', 'ads'].includes(t)) },
  { id: 'bloatware', label: 'Bloatware', matches: (s) => (s.tags ?? []).some((t) => ['bloatware', 'snap'].includes(t)) },
  { id: 'performance', label: 'Performance', matches: (s) => (s.tags ?? []).some((t) => ['performance', 'tracker'].includes(t)) },
];

const POWER_PLAN_OPTIONS = [
  { value: '', label: '— OS default —' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'high-performance', label: 'High performance' },
  { value: 'power-saver', label: 'Power saver' },
];

// ---------------------------------------------------------------------------
// Validation — shared by /blueprints/new and /blueprints/[id]/edit.
// Returns a map of { field: message }; empty object means valid.
// ---------------------------------------------------------------------------

export function validateBlueprint(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Name is required';
  if (!form.osType) errors.osType = 'Operating system is required';
  if (!form.categoryId) errors.categoryId = 'Category is required';
  const cores = Number(form.cores);
  const ram = Number(form.ram);
  const storage = Number(form.storage);
  if (!cores || cores <= 0 || cores > 128) errors.cores = 'CPU cores must be 1–128';
  if (!ram || ram <= 0 || ram > 512) errors.ram = 'RAM must be 1–512 GB';
  if (!storage || storage <= 0 || storage > 10000) errors.storage = 'Storage must be 1–10 000 GB';
  return errors;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function BlueprintForm({ form, onChange, errors = {}, categories = [], onSubmit }) {
  const osType = form.osType ?? '';
  const family = osFamily(osType);

  // Ensure the applications catalog is loaded (it may not have finished the
  // background init fetch when a user deep-links straight to this form). This
  // also gives us honest loading/error states so the Apps tab never flashes a
  // false "No applications" empty state while the catalog is still in flight.
  const {
    data: apps = [],
    isLoading: appsLoading,
    error: appsError,
    refresh: refreshApps,
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
  });
  const {
    data: scriptsData,
    loading: scriptsLoading,
    error: scriptsError,
    refetch: refetchScripts,
  } = useScriptsQuery();
  const scripts = useMemo(() => scriptsData?.scripts ?? [], [scriptsData]);

  const categoryOptions = useMemo(
    () => [
      { value: '', label: '— pick a category —' },
      ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
    ],
    [categories]
  );

  // Catalogs filtered by OS family.
  // Scripts use enum OS { WINDOWS, LINUX } — family-based match is enough.
  // Apps use String[] with specific distros ('ubuntu', 'fedora', 'windows') —
  // we match against both the family AND the concrete osType so that picking
  // "Ubuntu" finds apps tagged 'ubuntu' and picking "Windows 11" finds apps
  // tagged 'windows'.
  const filteredApps = useMemo(() => {
    if (!family) return [];
    return apps.filter((a) =>
      (a.os ?? []).some((o) => {
        const v = o.toLowerCase();
        return v === family || v === osType;
      })
    );
  }, [apps, family, osType]);

  const goldenImageScripts = useMemo(() => {
    if (!family) return [];
    return scripts.filter(
      (s) =>
        (s.category === 'Golden Image' || s.fileName?.startsWith('golden-image/')) &&
        (s.os ?? []).some((o) => o.toLowerCase() === family)
    );
  }, [scripts, family]);

  const otherScripts = useMemo(() => {
    if (!family) return [];
    return scripts.filter(
      (s) =>
        !(s.category === 'Golden Image' || s.fileName?.startsWith('golden-image/')) &&
        (s.os ?? []).some((o) => o.toLowerCase() === family)
    );
  }, [scripts, family]);

  const scriptsByGroup = useMemo(() => {
    const out = HARDENING_GROUPS.map((g) => ({ ...g, items: [] }));
    const other = { id: 'other', label: 'Other', items: [] };
    for (const s of goldenImageScripts) {
      const group = out.find((g) => g.matches(s));
      if (group) group.items.push(s);
      else other.items.push(s);
    }
    const result = out.filter((g) => g.items.length > 0);
    if (other.items.length > 0) result.push(other);
    return result;
  }, [goldenImageScripts]);

  const toggleId = (key, id) => {
    const cur = new Set(form[key] ?? []);
    if (cur.has(id)) cur.delete(id);
    else cur.add(id);
    onChange({ [key]: Array.from(cur) });
  };

  // Changing the OS re-filters compatible apps/scripts. Prune any previously
  // selected IDs that are not valid for the newly chosen OS so we never submit
  // hidden, incompatible selections (they'd be invisible in the filtered tabs
  // but still counted and sent on save).
  const handleOsChange = (newOsType) => {
    const newFamily = osFamily(newOsType);
    if (!newFamily) {
      // No OS selected — the Apps/Scripts tabs are hidden and submission is
      // blocked by validation, so keep selections until an OS is picked.
      onChange({ osType: newOsType });
      return;
    }
    const validApps = new Set(
      apps
        .filter((a) =>
          (a.os ?? []).some((o) => {
            const v = o.toLowerCase();
            return v === newFamily || v === newOsType;
          })
        )
        .map((a) => a.id)
    );
    const validScripts = new Set(
      scripts
        .filter((s) => (s.os ?? []).some((o) => o.toLowerCase() === newFamily))
        .map((s) => s.id)
    );
    const prevApps = form.applicationIds ?? [];
    const prevScripts = form.scriptIds ?? [];
    // Only prune against a catalog we've actually loaded — otherwise a slow
    // apps/scripts fetch would silently wipe the user's existing selections
    // (e.g. on the edit page) just because the catalog isn't in yet.
    const nextApps = apps.length > 0 ? prevApps.filter((id) => validApps.has(id)) : prevApps;
    const nextScripts = scripts.length > 0 ? prevScripts.filter((id) => validScripts.has(id)) : prevScripts;
    const dropped =
      prevApps.length - nextApps.length + (prevScripts.length - nextScripts.length);
    onChange({ osType: newOsType, applicationIds: nextApps, scriptIds: nextScripts });
    if (dropped > 0) {
      toast({
        variant: 'warning',
        title: `${dropped} selection${dropped !== 1 ? 's' : ''} removed`,
        description: 'They were not compatible with the newly selected operating system.',
      });
    }
  };

  const applyPreset = (presetName) => {
    const fileNames = HARDENING_PRESETS[presetName] ?? [];
    // Only map fileNames that match the currently-selected OS family.
    const presetIds = goldenImageScripts.filter((s) => fileNames.includes(s.fileName)).map((s) => s.id);
    if (presetIds.length === 0) {
      // Scripts catalog not loaded yet, or none of the preset's scripts are
      // seeded for this OS — don't silently blow away existing selections.
      toast({
        variant: 'info',
        title: 'Nothing to apply',
        description: `No "${presetName}" hardening scripts are available for this operating system yet.`,
      });
      return;
    }
    // Preserve any custom (non-hardening) scripts the user already picked;
    // a preset should set the hardening baseline, not wipe unrelated choices.
    const hardeningIds = new Set(goldenImageScripts.map((s) => s.id));
    const customPicks = (form.scriptIds ?? []).filter((id) => !hardeningIds.has(id));
    onChange({ scriptIds: [...customPicks, ...presetIds] });
  };

  const activeTab = form._activeTab || 'basics';

  // Live counts rendered in tab labels.
  const appsCount = (form.applicationIds ?? []).length;
  const scriptsCount = (form.scriptIds ?? []).length;

  const [infoScript, setInfoScript] = useState(null);
  const infoDetails = infoScript ? getScriptDetails(infoScript) : null;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onChange({ _activeTab: v })}
      variant="underline"
    >
      <TabList>
        <Tab value="basics" icon={<Settings2 size={14} />}>Basics</Tab>
        {family ? (
          <Tab value="apps" icon={<Package size={14} />}>
            Apps{appsCount > 0 ? ` · ${appsCount}` : ''}
          </Tab>
        ) : null}
        {family ? (
          <Tab value="hardening" icon={<ShieldCheck size={14} />}>
            First-boot scripts{scriptsCount > 0 ? ` · ${scriptsCount}` : ''}
          </Tab>
        ) : null}
        {family ? (
          <Tab value="os" icon={<Monitor size={14} />}>OS</Tab>
        ) : null}
      </TabList>

      {/* ----------------------------- Basics ----------------------------- */}
      <TabPanel value="basics">
        <ResponsiveStack direction="col" gap={4}>
          {!family ? (
            <Alert tone="info" size="sm">
              Pick an <strong>operating system</strong> to unlock the Apps,
              Hardening, and OS tabs. Changing it later re-filters the apps and
              scripts to those compatible with the new OS.
            </Alert>
          ) : null}
          <FieldRow template="1fr 1fr">
            <FormField label="Name" required error={errors.name}>
              <TextField
                placeholder="e.g. Win11 Contabilidad"
                value={form.name ?? ''}
                onChange={(e) => onChange({ name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                autoFocus
                required
              />
            </FormField>
            <FormField label="Operating system" required error={errors.osType}>
              <Select
                value={osType}
                onChange={handleOsChange}
                options={OS_OPTIONS}
              />
            </FormField>
          </FieldRow>

          <FormField label="Category" required error={errors.categoryId}>
            <Select
              value={form.categoryId ?? ''}
              onChange={(v) => onChange({ categoryId: v })}
              options={categoryOptions}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={form.description ?? ''}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              placeholder="What is this blueprint for?"
            />
          </FormField>

          <FieldRow template="1fr 1fr 1fr">
            <FormField label="vCPU" error={errors.cores}>
              <TextField
                type="number"
                min={1}
                max={128}
                icon={<Cpu size={14} />}
                value={form.cores ?? ''}
                onChange={(e) => onChange({ cores: e.target.value })}
              />
            </FormField>
            <FormField label="RAM (GB)" error={errors.ram}>
              <TextField
                type="number"
                min={1}
                max={512}
                icon={<MemoryStick size={14} />}
                value={form.ram ?? ''}
                onChange={(e) => onChange({ ram: e.target.value })}
              />
            </FormField>
            <FormField label="Disk (GB)" error={errors.storage}>
              <TextField
                type="number"
                min={1}
                max={10000}
                icon={<HardDrive size={14} />}
                value={form.storage ?? ''}
                onChange={(e) => onChange({ storage: e.target.value })}
              />
            </FormField>
          </FieldRow>
        </ResponsiveStack>
      </TabPanel>

      {/* ------------------------------ Apps ------------------------------ */}
      {family ? (
        <TabPanel value="apps">
          <ResponsiveStack direction="col" gap={3}>
            <Alert tone="info" size="sm">
              Apps installed on every desktop created from this blueprint, as
              first-boot tasks via InfiniService. Showing {filteredApps.length}
              {' '}compatible with <Badge tone="neutral">{osType}</Badge>.
            </Alert>
            {appsLoading && apps.length === 0 ? (
              <ResponsiveStack direction="row" gap={3} align="center" justify="center" className="py-8">
                <Spinner />
                <span className="text-sm text-fg-muted">Loading applications…</span>
              </ResponsiveStack>
            ) : appsError && apps.length === 0 ? (
              <Alert
                tone="danger"
                title="Couldn't load applications"
                actions={
                  <Button size="sm" icon={<RefreshCw size={14} />} onClick={() => refreshApps().catch(() => {})}>
                    Retry
                  </Button>
                }
              >
                {String(appsError?.message || appsError)}
              </Alert>
            ) : filteredApps.length === 0 ? (
              <div className="text-sm text-fg-muted py-6 text-center">
                No applications registered for this OS. Add some from the{' '}
                <Link className="text-accent underline underline-offset-2 hover:no-underline" href="/applications">
                  Applications
                </Link>
                {' '}page.
              </div>
            ) : (
              <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={2}>
                {filteredApps.map((app) => (
                  <AppTile
                    key={app.id}
                    app={app}
                    checked={(form.applicationIds ?? []).includes(app.id)}
                    onToggle={() => toggleId('applicationIds', app.id)}
                  />
                ))}
              </ResponsiveGrid>
            )}
          </ResponsiveStack>
        </TabPanel>
      ) : null}

      {/* ------------------------ First-boot scripts ---------------------- */}
      {family ? (
        <TabPanel value="hardening">
          <ResponsiveStack direction="col" gap={5}>
            <Alert tone="info" size="sm">
              Scripts in this tab run as first-boot tasks on every desktop
              created from this blueprint. Hardening below, plus any custom
              scripts you've authored.
            </Alert>

            {scriptsLoading ? (
              <ResponsiveStack direction="row" gap={3} align="center" justify="center" className="py-8">
                <Spinner />
                <span className="text-sm text-fg-muted">Loading scripts…</span>
              </ResponsiveStack>
            ) : scriptsError ? (
              <Alert
                tone="danger"
                title="Couldn't load scripts"
                actions={
                  <Button size="sm" icon={<RefreshCw size={14} />} onClick={() => refetchScripts()}>
                    Retry
                  </Button>
                }
              >
                {scriptsError.message || 'The scripts catalog failed to load.'}
              </Alert>
            ) : (
            <>
            {/* ----- Hardening section ----- */}
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center" justify="between" wrap>
                <h3 className="text-sm font-semibold m-0">Hardening</h3>
                <ResponsiveStack direction="row" gap={2} align="center" wrap>
                  <span className="text-xs text-fg-muted whitespace-nowrap">Presets:</span>
                  {Object.keys(HARDENING_PRESETS).map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="px-2.5 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 border border-white/5 whitespace-nowrap"
                      onClick={() => applyPreset(name)}
                    >
                      {name}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="px-2.5 py-1 text-xs rounded-md text-fg-muted hover:bg-white/5 whitespace-nowrap"
                    onClick={() => {
                      // Clear hardening selections only — keep custom script picks.
                      const hardeningIds = new Set(goldenImageScripts.map((s) => s.id));
                      const next = (form.scriptIds ?? []).filter((id) => !hardeningIds.has(id));
                      onChange({ scriptIds: next });
                    }}
                  >
                    Clear hardening
                  </button>
                </ResponsiveStack>
              </ResponsiveStack>

              {goldenImageScripts.length === 0 ? (
                <div className="text-sm text-fg-muted py-4">
                  No hardening scripts seeded for {osType}. Run the backend seed
                  (scripts live in <code>scripts/templates/golden-image/</code>).
                </div>
              ) : (
                <ResponsiveStack direction="col" gap={4}>
                  {scriptsByGroup.map((group) => (
                    <ScriptGroup
                      key={group.id}
                      title={group.label}
                      scripts={group.items}
                      selected={form.scriptIds ?? []}
                      onToggle={(id) => toggleId('scriptIds', id)}
                      onShowInfo={setInfoScript}
                    />
                  ))}
                </ResponsiveStack>
              )}
            </ResponsiveStack>

            <div className="border-t border-white/5" />

            {/* ----- Custom scripts section ----- */}
            <ResponsiveStack direction="col" gap={3}>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold m-0">Custom scripts</h3>
                <span className="text-xs text-fg-muted">
                  Scripts you've authored under <code>/scripts</code> matching
                  this OS. Pick any to run at first boot alongside hardening.
                </span>
              </div>

              {otherScripts.length === 0 ? (
                <div className="text-sm text-fg-muted py-4">
                  No custom scripts available for {osType}.{' '}
                  <Link className="text-accent underline underline-offset-2 hover:no-underline" href="/scripts/new">
                    Create one
                  </Link>
                  .
                </div>
              ) : (
                <ScriptGroup
                  title="Available"
                  scripts={otherScripts}
                  selected={form.scriptIds ?? []}
                  onToggle={(id) => toggleId('scriptIds', id)}
                  onShowInfo={setInfoScript}
                />
              )}
            </ResponsiveStack>
            </>
            )}
          </ResponsiveStack>
        </TabPanel>
      ) : null}

      {/* ------------------------------ OS -------------------------------- */}
      {family ? (
        <TabPanel value="os">
          <ResponsiveStack direction="col" gap={4}>
            <FieldRow template="1fr 1fr">
              <FormField label="Desktop wallpaper URL">
                <TextField
                  placeholder="https://…  or  /wallpapers/empresa.jpg"
                  value={form.wallpaperUrl ?? ''}
                  onChange={(e) => onChange({ wallpaperUrl: e.target.value })}
                />
              </FormField>
              <FormField label="Power plan">
                <Select
                  value={form.powerPlan ?? ''}
                  onChange={(v) => onChange({ powerPlan: v })}
                  options={POWER_PLAN_OPTIONS}
                />
              </FormField>
            </FieldRow>

            {family === 'windows' ? (
              <ResponsiveStack direction="col" gap={2} className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={!!form.encryptDisk}
                    onChange={(e) => onChange({ encryptDisk: !!e.target.checked })}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Enable BitLocker</span>
                    <span className="text-xs text-fg-muted">
                      Full-disk encryption on C: with TPM protection. Recovery
                      key written to{' '}
                      <code className="text-xs">C:\BitLockerRecoveryKey.txt</code>
                      {' '}(demo escrow — replace with AD/Intune for production).
                    </span>
                  </div>
                </label>
              </ResponsiveStack>
            ) : (
              <ResponsiveStack direction="col" gap={1} className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                <span className="text-sm font-medium text-fg-muted">Disk encryption</span>
                <span className="text-xs text-warning">
                  LUKS on Linux requires install-time partitioning (preseed /
                  cloud-init) and isn&apos;t yet wired. Tracked as follow-up 6.G.ii.
                </span>
              </ResponsiveStack>
            )}
          </ResponsiveStack>
        </TabPanel>
      ) : null}
      {/* --------------------- Script info dialog --------------------- */}
      <Dialog
        open={!!infoScript}
        onClose={() => setInfoScript(null)}
        size="md"
      >
        <DialogTitle>{infoScript?.name ?? ''}</DialogTitle>
        <DialogDescription>{infoScript?.description ?? ''}</DialogDescription>
        <DialogBody>
        <ResponsiveStack direction="col" gap={4}>
          {infoDetails?.whatItDoes ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-fg-muted mb-1">
                What it does
              </div>
              <div className="text-sm">{infoDetails.whatItDoes}</div>
            </div>
          ) : infoScript ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-fg-muted mb-1">
                What it does
              </div>
              <div className="text-sm">{infoScript.description}</div>
            </div>
          ) : null}

          {infoDetails?.pros?.length ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-fg-muted mb-1">
                Pros
              </div>
              <ul className="list-disc list-inside text-sm text-success">
                {infoDetails.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {infoDetails?.cons?.length ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-fg-muted mb-1">
                Cons
              </div>
              <ul className="list-disc list-inside text-sm text-danger">
                {infoDetails.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {infoDetails?.notes ? (
            <div className="p-3 rounded-md bg-white/[0.02] border border-white/5">
              <div className="text-xs uppercase tracking-wide text-fg-muted mb-1">
                Notes
              </div>
              <div className="text-sm text-warning">{infoDetails.notes}</div>
            </div>
          ) : null}
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="secondary" onClick={() => setInfoScript(null)}>
            Close
          </Button>
        </DialogButtons>
      </Dialog>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

function AppTile({ app, checked, onToggle }) {
  return (
    <label className="flex items-start gap-2 px-3 py-2 rounded-md hover:bg-white/[0.03] cursor-pointer border border-white/5">
      <Checkbox checked={checked} onChange={onToggle} />
      {app.icon ? (
        <div className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center">
          {app.icon.startsWith('<svg') ? (
            <span dangerouslySetInnerHTML={createSanitizedSVGMarkup(app.icon)} className="w-5 h-5 flex items-center justify-center" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.icon} alt="" className="w-5 h-5 object-contain" />
          )}
        </div>
      ) : null}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">{app.name}</span>
        {app.description ? (
          <Tooltip content={app.description}>
            <span className="text-xs text-fg-muted truncate block">
              {app.description}
            </span>
          </Tooltip>
        ) : null}
      </div>
    </label>
  );
}

function ScriptGroup({ title, scripts, selected, onToggle, onShowInfo }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="text-xs uppercase tracking-wide text-fg-muted">{title}</div>
        <div className="flex-1 border-b border-white/5" />
        <span className="text-xs text-fg-muted">{scripts.length}</span>
      </div>
      <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={2}>
        {scripts.map((s) => (
          <label
            key={s.id}
            className="group flex items-start gap-2 px-3 py-2 rounded-md hover:bg-white/[0.03] cursor-pointer border border-white/5"
          >
            <Checkbox checked={selected.includes(s.id)} onChange={() => onToggle(s.id)} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{s.name}</span>
              {s.description ? (
                <Tooltip content={s.description}>
                  <span className="text-xs text-fg-muted truncate block">
                    {s.description}
                  </span>
                </Tooltip>
              ) : null}
            </div>
            {onShowInfo ? (
              <IconButton
                size="sm"
                variant="ghost"
                label="More info"
                icon={<Info size={14} />}
                className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo(s);
                }}
              />
            ) : null}
          </label>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
