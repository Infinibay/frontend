"use client";

import {
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Cpu, MemoryStick, HardDrive, Layers } from "lucide-react";
import {
  Drawer,
  Button,
  ButtonGroup,
  TextField,
  Textarea,
  Alert,
  ResponsiveStack,
  ResponsiveGrid,
} from "@infinibay/harbor";

import {
  updateTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
} from "@/state/slices/templates";

const blank = {
  name: "",
  description: "",
  cores: "",
  ram: "",
  storage: "",
  categoryId: "",
};

/**
 * EditTemplateDialog — Harbor-native Drawer. Supports both:
 *   • `<EditTemplateDialog template={t}>{trigger}</EditTemplateDialog>`
 *   • `<EditTemplateDialog template={t} open onOpenChange={...} />`
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
      setForm({
        name: template.name || "",
        description: template.description || "",
        cores: String(template.cores ?? ""),
        ram: String(template.ram ?? ""),
        storage: String(template.storage ?? ""),
        categoryId: template.categoryId || "",
      });
    }
  }, [isOpen, template]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    const cores = Number(form.cores);
    const ram = Number(form.ram);
    const storage = Number(form.storage);
    if (!cores || cores <= 0 || cores > 128) return "CPU cores must be 1–128";
    if (!ram || ram <= 0 || ram > 512) return "RAM must be 1–512 GB";
    if (!storage || storage <= 0 || storage > 10000)
      return "Storage must be 1–10 000 GB";
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
          },
        })
      ).unwrap();
      toast.success("Template updated");
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
    [isControlled]
  );

  return (
    <>
      {!isControlled && trigger(children)}
      <Drawer
        open={isOpen}
        onClose={close}
        side="right"
        size={480}
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Layers size={16} />
            <span>Edit template</span>
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
        <ResponsiveStack direction="col" gap={4}>
          <Alert tone="info" size="sm">
            Editing this template does not affect VMs already created from it —
            the change only applies to new VMs.
          </Alert>

          {error?.update ? (
            <Alert tone="danger">{String(error.update)}</Alert>
          ) : null}

          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={2}
          />

          <ResponsiveGrid columns={3} gap={3}>
            <TextField
              label="vCPU"
              type="number"
              min={1}
              max={128}
              icon={<Cpu size={14} />}
              value={form.cores}
              onChange={(e) => update({ cores: e.target.value })}
            />
            <TextField
              label="RAM (GB)"
              type="number"
              min={1}
              max={512}
              icon={<MemoryStick size={14} />}
              value={form.ram}
              onChange={(e) => update({ ram: e.target.value })}
            />
            <TextField
              label="Disk (GB)"
              type="number"
              min={1}
              max={10000}
              icon={<HardDrive size={14} />}
              value={form.storage}
              onChange={(e) => update({ storage: e.target.value })}
            />
          </ResponsiveGrid>
        </ResponsiveStack>
      </Drawer>
    </>
  );
}
