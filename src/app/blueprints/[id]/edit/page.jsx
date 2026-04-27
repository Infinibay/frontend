'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Page, Button, ButtonGroup, Alert, IconButton, ResponsiveStack } from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { BlueprintForm } from '../../components/blueprint-form';
import {
  updateTemplate,
  fetchTemplates,
  selectTemplatesLoading,
  selectTemplatesError,
} from '@/state/slices/templates';

const blank = {
  name: '',
  description: '',
  cores: '',
  ram: '',
  storage: '',
  categoryId: '',
  osType: '',
  applicationIds: [],
  scriptIds: [],
  wallpaperUrl: '',
  powerPlan: '',
  encryptDisk: false,
  _activeTab: 'basics',
};

function validate(form) {
  if (!form.name.trim()) return 'Name is required';
  if (!form.osType) return 'Operating system is required';
  const cores = Number(form.cores);
  const ram = Number(form.ram);
  const storage = Number(form.storage);
  if (!cores || cores <= 0 || cores > 128) return 'CPU cores must be 1–128';
  if (!ram || ram <= 0 || ram > 512) return 'RAM must be 1–512 GB';
  if (!storage || storage <= 0 || storage > 10000) return 'Storage must be 1–10 000 GB';
  return null;
}

export default function EditBlueprintPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const template = templates.find((t) => t.id === id);
  const [form, setForm] = useState(blank);
  const [ready, setReady] = useState(false);

  // Make sure templates are loaded — if the user navigated directly to
  // /blueprints/abc/edit without passing through /blueprints first.
  useEffect(() => {
    if (templates.length === 0) dispatch(fetchTemplates());
  }, [dispatch, templates.length]);

  // Initialize form once when template loads (no cascading renders).
  useEffect(() => {
    if (!template || form.name) return; // Already initialized or no template.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: template.name || '',
      description: template.description || '',
      cores: String(template.cores ?? ''),
      ram: String(template.ram ?? ''),
      storage: String(template.storage ?? ''),
      categoryId: template.categoryId || '',
      osType: template.osType || '',
      applicationIds: (template.applications ?? []).map((a) => a.applicationId),
      scriptIds: (template.scripts ?? []).map((s) => s.scriptId),
      wallpaperUrl: template.wallpaperUrl || '',
      powerPlan: template.powerPlan || '',
      _activeTab: 'basics',
    });
  }, [template]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await dispatch(
        updateTemplate({
          id,
          input: {
            name: form.name.trim(),
            description: (form.description ?? '').trim(),
            cores: parseInt(form.cores, 10),
            ram: parseInt(form.ram, 10),
            storage: parseInt(form.storage, 10),
            categoryId: form.categoryId,
            osType: form.osType,
            wallpaperUrl: form.wallpaperUrl?.trim() || null,
            powerPlan: form.powerPlan || null,
            encryptDisk: !!form.encryptDisk,
            applications: form.applicationIds.map((id) => ({ applicationId: id })),
            scripts: form.scriptIds.map((sid, i) => ({ scriptId: sid, order: i })),
          },
        })
      ).unwrap();
      toast.success('Blueprint updated');
      router.push('/blueprints');
    } catch (err) {
      toast.error(`Could not save: ${err.message || err}`);
    }
  };

  if (!template && ready === false && templates.length > 0) {
    return (
      <Page>
        <Alert tone="danger" title="Blueprint not found">
          <Button onClick={() => router.push('/blueprints')}>Back to blueprints</Button>
        </Alert>
      </Page>
    );
  }

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <ResponsiveStack direction="row" gap={2} align="center">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Back to blueprints"
            onClick={() => router.push('/blueprints')}
          >
            <ArrowLeft size={14} />
          </IconButton>
          <PageHeader
            title={template ? `Edit "${template.name}"` : 'Edit blueprint'}
            description={template ? 'Changes apply only to new desktops created from this blueprint.' : undefined}
            primary={
              <ButtonGroup attached={false}>
                <Button variant="secondary" onClick={() => router.push('/blueprints')} disabled={loading?.update}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={loading?.update} disabled={loading?.update || !ready}>
                  Save changes
                </Button>
              </ButtonGroup>
            }
          />
        </ResponsiveStack>

        {error?.update ? <Alert tone="danger">{String(error.update)}</Alert> : null}

        {ready ? <BlueprintForm form={form} onChange={update} /> : (
          <div className="text-fg-muted text-sm">Loading blueprint…</div>
        )}
      </ResponsiveStack>
    </Page>
  );
}
