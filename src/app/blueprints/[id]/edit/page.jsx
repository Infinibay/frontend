'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Page, Button, ButtonGroup, Alert, IconButton, ResponsiveStack, Spinner } from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { usePageHeader } from '@/hooks/usePageHeader';
import { BlueprintForm, validateBlueprint } from '../../components/blueprint-form';
import {
  updateTemplate,
  fetchTemplates,
  selectTemplatesLoading,
  selectTemplatesError,
} from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';

export default function EditBlueprintPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const categories = useSelector((s) => s.templateCategories?.items ?? []);
  const template = templates.find((t) => t.id === id);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const ready = form !== null;

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Blueprints', href: '/blueprints' },
        { label: 'Edit blueprint', isCurrent: true },
      ],
      backButton: { href: '/blueprints', label: 'Back to blueprints' },
      actions: [],
    },
    []
  );

  // Make sure templates + categories are loaded — the user may have navigated
  // directly to /blueprints/abc/edit without passing through /blueprints first.
  useEffect(() => {
    if (templates.length === 0) dispatch(fetchTemplates());
  }, [dispatch, templates.length]);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchTemplateCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (!template || ready) return;
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
      encryptDisk: !!template.encryptDisk,
      _activeTab: 'basics',
    });
  }, [template, ready]);

  const update = (patch) => {
    setForm((prev) => ({ ...(prev ?? {}), ...patch }));
    setErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const next = { ...prev };
      let changed = false;
      for (const k of Object.keys(patch)) {
        if (k in next) {
          delete next[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  };

  const handleSave = async () => {
    const fieldErrors = validateBlueprint(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      update({ _activeTab: 'basics' });
      toast.error(Object.values(fieldErrors)[0]);
      return;
    }
    setErrors({});
    setSubmitError(null);
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
            applications: form.applicationIds.map((appId) => ({ applicationId: appId })),
            scripts: form.scriptIds.map((sid, i) => ({ scriptId: sid, order: i })),
          },
        })
      ).unwrap();
      toast.success('Blueprint updated');
      router.push('/blueprints');
    } catch (err) {
      const message = err?.message || String(err);
      setSubmitError(message);
      toast.error(`Could not save: ${message}`);
    }
  };

  // The template is not (yet) in the store. Distinguish "still fetching" from
  // "fetch settled and it genuinely isn't there" so a deep link never hangs on
  // an eternal "Loading…".
  if (!template && !ready) {
    if (loading?.fetch) {
      return (
        <Page>
          <ResponsiveStack direction="row" gap={3} align="center" justify="center" className="py-12">
            <Spinner />
            <span className="text-fg-muted text-sm">Loading blueprint…</span>
          </ResponsiveStack>
        </Page>
      );
    }
    if (error?.fetch) {
      return (
        <Page>
          <Alert
            tone="danger"
            title="Couldn't load blueprint"
            actions={
              <Button size="sm" icon={<RefreshCw size={14} />} onClick={() => dispatch(fetchTemplates())}>
                Retry
              </Button>
            }
          >
            {String(error.fetch)}
          </Alert>
        </Page>
      );
    }
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
            label="Back to blueprints"
            icon={<ArrowLeft size={14} />}
            onClick={() => router.push('/blueprints')}
          />
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

        {submitError ? <Alert tone="danger">{submitError}</Alert> : null}

        {ready ? (
          <BlueprintForm form={form} onChange={update} errors={errors} categories={categories} onSubmit={handleSave} />
        ) : (
          <ResponsiveStack direction="row" gap={3} align="center" justify="center" className="py-12">
            <Spinner />
            <span className="text-fg-muted text-sm">Loading blueprint…</span>
          </ResponsiveStack>
        )}
      </ResponsiveStack>
    </Page>
  );
}
