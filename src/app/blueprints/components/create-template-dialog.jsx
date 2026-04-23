"use client";

import { useState, cloneElement, isValidElement, useCallback } from "react";
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
  createTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
} from "@/state/slices/templates";

const EMPTY = {
  name: "",
  description: "",
  cores: "",
  ram: "",
  storage: "",
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
    if (!form.name.trim()) return "Name is required";
    if (!form.description.trim()) return "Description is required";
    const cores = Number(form.cores);
    const ram = Number(form.ram);
    const storage = Number(form.storage);
    if (!cores || cores <= 0 || cores > 128) return "CPU cores must be 1–128";
    if (!ram || ram <= 0 || ram > 512) return "RAM must be 1–512 GB";
    if (!storage || storage <= 0 || storage > 10000)
      return "Storage must be 1–10 000 GB";
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
        size={480}
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
        <ResponsiveStack direction="col" gap={4}>
          <Alert tone="info" size="sm">
            Reusable desktop configuration. Each new desktop created from this
            blueprint inherits these resources and the OS its ISO provides.
          </Alert>

          {error?.create ? (
            <Alert tone="danger">{String(error.create)}</Alert>
          ) : null}

          <TextField
            label="Name"
            placeholder="e.g. Ubuntu · small"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            autoFocus
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={2}
            placeholder="What is this template for?"
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
