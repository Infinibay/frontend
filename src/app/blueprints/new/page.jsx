'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Page, Button, ButtonGroup, Alert, IconButton, ResponsiveStack } from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { BlueprintForm } from '../components/blueprint-form';
import {
  createTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
} from '@/state/slices/templates';

const EMPTY = {
  name: '',
  description: '',
  cores: '',
  ram: '',
  storage: '',
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

export default function NewBlueprintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = useMemo(() => searchParams?.get('category') ?? null, [searchParams]);
  const dispatch = useDispatch();
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const [form, setForm] = useState(EMPTY);
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleCreate = async () => {
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await dispatch(
        createTemplate({
          name: form.name.trim(),
          description: (form.description ?? '').trim(),
          cores: parseInt(form.cores, 10),
          ram: parseInt(form.ram, 10),
          storage: parseInt(form.storage, 10),
          categoryId,
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
      toast.error(`Could not create: ${err.message || err}`);
    }
  };

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

        {error?.create ? <Alert tone="danger">{String(error.create)}</Alert> : null}

        <BlueprintForm form={form} onChange={update} />
      </ResponsiveStack>
    </Page>
  );
}
