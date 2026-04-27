'use client';

import {
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  useCallback,
} from 'react';
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
  updateTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
} from '@/state/slices/templates';
import { BlueprintForm } from './blueprint-form';

const blank = {
  name: '',
  description: '',
  cores: '',
  ram: '',
  storage: '',
  categoryId: '',
  applicationIds: [],
  scriptIds: [],
  wallpaperUrl: '',
  powerPlan: '',
  encryptDisk: false,
  _activeTab: 'basics',
};

/**
 * EditTemplateDialog — Harbor-native Drawer with tabbed BlueprintForm.
 * Supports both trigger-via-children and controlled `open` modes.
 */
export function EditTemplateDialog({ children, template, open, onOpenChange }) {
  const dispatch = useDispatch();
  const [internalOpen, setInternalOpen] = useState(false);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const [form, setForm] = useState(blank);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internalOpen;
  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (isOpen && template) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: template.name || '',
        description: template.description || '',
        cores: String(template.cores ?? ''),
        ram: String(template.ram ?? ''),
        storage: String(template.storage ?? ''),
        categoryId: template.categoryId || '',
        applicationIds: (template.applications ?? []).map((a) => a.applicationId),
        scriptIds: (template.scripts ?? []).map((s) => s.scriptId),
        wallpaperUrl: template.wallpaperUrl || '',
        powerPlan: template.powerPlan || '',
        encryptDisk: !!template.encryptDisk,
        _activeTab: 'basics',
      });
    }
  }, [isOpen, template]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    const cores = Number(form.cores);
    const ram = Number(form.ram);
    const storage = Number(form.storage);
    if (!cores || cores <= 0 || cores > 128) return 'CPU cores must be 1–128';
    if (!ram || ram <= 0 || ram > 512) return 'RAM must be 1–512 GB';
    if (!storage || storage <= 0 || storage > 10000)
      return 'Storage must be 1–10 000 GB';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await dispatch(
        updateTemplate({
          id: template.id,
          input: {
            name: form.name.trim(),
            description: form.description.trim(),
            cores: parseInt(form.cores, 10),
            ram: parseInt(form.ram, 10),
            storage: parseInt(form.storage, 10),
            categoryId: form.categoryId,
            wallpaperUrl: form.wallpaperUrl?.trim() || null,
            powerPlan: form.powerPlan || null,
            encryptDisk: !!form.encryptDisk,
            applications: form.applicationIds.map((id) => ({ applicationId: id })),
            scripts: form.scriptIds.map((id, i) => ({ scriptId: id, order: i })),
          },
        })
      ).unwrap();
      toast.success('Blueprint updated');
      close();
    } catch (err) {
      toast.error(`Could not save: ${err.message || err}`);
    }
  };

  const trigger = useCallback(
    (child) => {
      if (!isValidElement(child)) return null;
      const prev = child.props.onClick;
      return cloneElement(child, {
        onClick: (e) => {
          prev?.(e);
          setOpen(true);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlled]
  );

  return (
    <>
      {!isControlled && trigger(children)}
      <Drawer
        open={isOpen}
        onClose={close}
        side="right"
        size={560}
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Layers size={16} />
            <span>Edit blueprint</span>
          </ResponsiveStack>
        }
        footer={
          <ButtonGroup attached={false}>
            <Button variant="secondary" onClick={close} disabled={loading?.update}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={loading?.update}
              disabled={loading?.update}
            >
              Save changes
            </Button>
          </ButtonGroup>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          <Alert tone="info" size="sm">
            Editing this blueprint does not affect VMs already created from it —
            the change only applies to new VMs.
          </Alert>
          {error?.update ? (
            <Alert tone="danger">{String(error.update)}</Alert>
          ) : null}
          <BlueprintForm form={form} onChange={update} />
        </ResponsiveStack>
      </Drawer>
    </>
  );
}
