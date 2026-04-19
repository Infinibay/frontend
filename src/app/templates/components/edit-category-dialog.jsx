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
  updateTemplateCategory,
  selectTemplateCategoriesLoading,
  selectTemplateCategoriesError,
} from "@/state/slices/templateCategories";

/**
 * EditCategoryDialog — Harbor-native. Supports both API shapes the
 * callers use:
 *   • `<EditCategoryDialog category={cat}>{trigger}</EditCategoryDialog>`
 *     — children click opens the dialog (internal state).
 *   • `<EditCategoryDialog category={cat} open onOpenChange={...} />`
 *     — controlled mode; no children trigger needed.
 */
export function EditCategoryDialog({ children, category, open, onOpenChange }) {
  const dispatch = useDispatch();
  const [internalOpen, setInternalOpen] = useState(false);
  const loading = useSelector(selectTemplateCategoriesLoading);
  const error = useSelector(selectTemplateCategoriesError);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internalOpen;
  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [isOpen, category]);

  const close = () => setOpen(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await dispatch(
        updateTemplateCategory({
          id: category.id,
          input: { name: name.trim(), description: description.trim() },
        })
      ).unwrap();
      toast.success("Category updated");
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
      <Dialog
        open={isOpen}
        onClose={close}
        size="sm"
        title={
          <span className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-accent-2" />
            Edit category
          </span>
        }
        description="Update the name and description."
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={close}
              disabled={loading?.update}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              loading={loading?.update}
              disabled={loading?.update || !name.trim()}
            >
              Save changes
            </Button>
          </ButtonGroup>
        }
      >
        <div className="space-y-3">
          {error?.update && <Alert tone="danger">{String(error.update)}</Alert>}
          <TextField
            label="Name"
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
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
