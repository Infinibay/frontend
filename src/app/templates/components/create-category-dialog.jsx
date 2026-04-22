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
  ResponsiveStack,
} from "@infinibay/harbor";

import {
  createTemplateCategory,
  selectTemplateCategoriesLoading,
  selectTemplateCategoriesError,
} from "@/state/slices/templateCategories";

/**
 * CreateCategoryDialog — Harbor-native. The `children` prop is cloned
 * and its click handler wired to open the dialog.
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
      <Dialog
        open={open}
        onClose={close}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <FolderTree size={16} />
            <span>New category</span>
          </ResponsiveStack>
        }
        description="Group related templates so they're easier to find."
        footer={
          <ButtonGroup attached={false}>
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
        <ResponsiveStack direction="col" gap={3}>
          {error?.create ? (
            <Alert tone="danger">{String(error.create)}</Alert>
          ) : null}
          <TextField
            label="Name"
            placeholder="Production, Development, Testing…"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
      </Dialog>
    </>
  );
}
