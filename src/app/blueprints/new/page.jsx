'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Page, Button, ButtonGroup, Alert, IconButton, ResponsiveStack } from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { usePageHeader } from '@/hooks/usePageHeader';
import { BlueprintForm, validateBlueprint } from '../components/blueprint-form';
import {
  createTemplate,
  selectTemplatesLoading,
} from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';

const EMPTY = {
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

export default function NewBlueprintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const loading = useSelector(selectTemplatesLoading);
  const categories = useSelector((s) => s.templateCategories?.items ?? []);
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    categoryId: searchParams?.get('category') ?? '',
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  // usePageHeader intentionally does not reset on unmount; set it here so the
  // top chrome (breadcrumbs/back/help) reflects this page rather than the
  // previous /blueprints screen. Title is omitted — the in-page PageHeader
  // below owns the h1.
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Blueprints', href: '/blueprints' },
        { label: 'New blueprint', isCurrent: true },
      ],
      backButton: { href: '/blueprints', label: 'Back to blueprints' },
      actions: [],
    },
    []
  );

  // Categories power the required Category select in the form.
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchTemplateCategories());
  }, [dispatch, categories.length]);

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
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

  const handleCreate = async () => {
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
        createTemplate({
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
          scripts: form.scriptIds.map((id, i) => ({ scriptId: id, order: i })),
        })
      ).unwrap();
      toast.success(`Blueprint "${form.name}" created`);
      router.push('/blueprints');
    } catch (err) {
      const message = err?.message || String(err);
      setSubmitError(message);
      toast.error(`Could not create: ${message}`);
    }
  };

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
            title="New blueprint"
            primary={
              <ButtonGroup attached={false}>
                <Button variant="secondary" onClick={() => router.push('/blueprints')} disabled={loading?.create}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} loading={loading?.create} disabled={loading?.create}>
                  Create blueprint
                </Button>
              </ButtonGroup>
            }
          />
        </ResponsiveStack>

        {submitError ? <Alert tone="danger">{submitError}</Alert> : null}

        <BlueprintForm form={form} onChange={update} errors={errors} categories={categories} onSubmit={handleCreate} />
      </ResponsiveStack>
    </Page>
  );
}
