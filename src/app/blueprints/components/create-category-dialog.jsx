"use client";

import { useState, cloneElement, isValidElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FolderTree } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  Button,
  TextField,
  Textarea,
  Alert,
  ResponsiveStack,
} from "@infinibay/harbor";

import {
  createTemplateCategory,
  selectTemplateCategoriesLoading,
} from "@/state/slices/templateCategories";

/**
 * CreateCategoryDialog — Harbor-native. The `children` prop is cloned
 * and its click handler wired to open the dialog.
 */
export function CreateCategoryDialog({ children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplateCategoriesLoading);
  // Local error captured from the rejected unwrap — reading the global slice
  // error would resurface a stale banner from an unrelated previous attempt
  // when this dialog is reopened.
  const [createError, setCreateError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const close = () => {
    setOpen(false);
    setName("");
    setDescription("");
    setCreateError(null);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setCreateError(null);
    try {
      await dispatch(
        createTemplateCategory({ name: name.trim(), description: description.trim() })
      ).unwrap();
      toast.success(`Category "${name}" created`);
      close();
    } catch (err) {
      const message = err?.message || String(err);
      setCreateError(message);
      toast.error(`Could not create category: ${message}`);
    }
  };

  const trigger = useCallback((child) => {
    if (!isValidElement(child)) return null;
    const prev = child.props.onClick;
    return cloneElement(child, {
      onClick: (e) => {
        prev?.(e);
        setCreateError(null);
        setOpen(true);
      },
    });
  }, []);

  return (
    <>
      {trigger(children)}
      <Dialog
        open={open}
        onClose={close}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <FolderTree size={16} />
            <span>New Category</span>
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          Group related templates so they're easier to find.
        </DialogDescription>
        <DialogBody>
          <ResponsiveStack direction="col" gap={3}>
            {createError ? (
              <Alert tone="danger">{String(createError)}</Alert>
            ) : null}
            <TextField
              label="Name"
              placeholder="Production, Development, Testing…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              autoFocus
            />
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short blurb so other admins understand when to use this category"
            />
          </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
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
        </DialogButtons>
      </Dialog>
    </>
  );
}
