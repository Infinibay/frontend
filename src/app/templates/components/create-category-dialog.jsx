"use client";

import { useState, cloneElement, isValidElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FolderTree } from "lucide-react";
import {
  Dialog,
  Button,
  ButtonGroup,
  TextField,
  Textarea,
  Alert,
} from "@infinibay/harbor";

import {
  createTemplateCategory,
  selectTemplateCategoriesLoading,
  selectTemplateCategoriesError,
} from "@/state/slices/templateCategories";

/**
 * CreateCategoryDialog — Harbor-native. Accepts a single `children`
 * that acts as the trigger; click it to open. Exposes the same
 * children-as-trigger API the caller expects.
 */
export function CreateCategoryDialog({ children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplateCategoriesLoading);
  const error = useSelector(selectTemplateCategoriesError);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const close = () => {
    setOpen(false);
    setName("");
    setDescription("");
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await dispatch(
        createTemplateCategory({ name: name.trim(), description: description.trim() })
      ).unwrap();
      toast.success(`Category "${name}" created`);
      close();
    } catch (err) {
      toast.error(`Could not create category: ${err.message || err}`);
    }
  };

  // Wire the trigger `children` so clicking it opens the dialog.
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
    []
  );

  return (
    <>
      {trigger(children)}
      <Dialog
        open={open}
        onClose={close}
        size="sm"
        title={
          <span className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-accent-2" />
            New category
          </span>
        }
        description="Group related templates so they're easier to find."
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={close} disabled={loading?.create}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              loading={loading?.create}
              disabled={loading?.create || !name.trim()}
            >
              Create
            </Button>
          </ButtonGroup>
        }
      >
        <div className="space-y-3">
          {error?.create && <Alert tone="danger">{String(error.create)}</Alert>}
          <TextField
            label="Name"
            placeholder="Production, Development, Testing…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short blurb so other admins understand when to use this category"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
