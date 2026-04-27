'use client';

import { useState, cloneElement, isValidElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Layers } from 'lucide-react';
import {
  Drawer,
  Button,
  ButtonGroup,
  Alert,
  ResponsiveStack,
} from '@infinibay/harbor';

import {
  createTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
} from '@/state/slices/templates';
import { BlueprintForm } from './blueprint-form';

const EMPTY = {
  name: '',
  description: '',
  cores: '',
  ram: '',
  storage: '',
  applicationIds: [],
  scriptIds: [],
  wallpaperUrl: '',
  powerPlan: '',
  encryptDisk: false,
  _activeTab: 'basics',
};

export function CreateTemplateDialog({ children, categoryId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const [form, setForm] = useState(EMPTY);

  const close = () => {
    setOpen(false);
    setForm(EMPTY);
  };

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.description.trim()) return 'Description is required';
    const cores = Number(form.cores);
    const ram = Number(form.ram);
    const storage = Number(form.storage);
    if (!cores || cores <= 0 || cores > 128) return 'CPU cores must be 1–128';
    if (!ram || ram <= 0 || ram > 512) return 'RAM must be 1–512 GB';
    if (!storage || storage <= 0 || storage > 10000)
      return 'Storage must be 1–10 000 GB';
    return null;
  };

  const handleCreate = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await dispatch(
        createTemplate({
          name: form.name.trim(),
          description: form.description.trim(),
          cores: parseInt(form.cores, 10),
          ram: parseInt(form.ram, 10),
          storage: parseInt(form.storage, 10),
          categoryId,
          wallpaperUrl: form.wallpaperUrl?.trim() || null,
          powerPlan: form.powerPlan || null,
          encryptDisk: !!form.encryptDisk,
          applications: form.applicationIds.map((id) => ({ applicationId: id })),
          scripts: form.scriptIds.map((id, i) => ({ scriptId: id, order: i })),
        })
      ).unwrap();
      toast.success(`Blueprint "${form.name}" created`);
      close();
    } catch (err) {
      toast.error(`Could not create: ${err.message || err}`);
    }
  };

  const trigger = useCallback((child) => {
    if (!isValidElement(child)) return null;
    const prev = child.props.onClick;
    return cloneElement(child, {
      onClick: (e) => {
        prev?.(e);
        setOpen(true);
      },
    });
  }, []);

  return (
    <>
      {trigger(children)}
      <Drawer
        open={open}
        onClose={close}
        side="right"
        size={560}
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Layers size={16} />
            <span>New Blueprint</span>
          </ResponsiveStack>
        }
        footer={
          <ButtonGroup attached={false}>
            <Button variant="secondary" onClick={close} disabled={loading?.create}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              loading={loading?.create}
              disabled={loading?.create}
            >
              Create blueprint
            </Button>
          </ButtonGroup>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          {error?.create ? (
            <Alert tone="danger">{String(error.create)}</Alert>
          ) : null}
          <BlueprintForm form={form} onChange={update} />
        </ResponsiveStack>
      </Drawer>
    </>
  );
}
