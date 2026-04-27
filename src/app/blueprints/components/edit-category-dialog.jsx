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
  ResponsiveStack,
} from "@infinibay/harbor";

import {
  updateTemplateCategory,
  selectTemplateCategoriesLoading,
  selectTemplateCategoriesError,
} from "@/state/slices/templateCategories";

/**
 * EditCategoryDialog — Harbor-native. Supports both API shapes:
 *   • `<EditCategoryDialog category={cat}>{trigger}</EditCategoryDialog>`
 *     — internal open state, children act as the trigger.
 *   • `<EditCategoryDialog category={cat} open onOpenChange={...} />`
 *     — controlled mode; no trigger child needed.
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
      // Intentional: prime form state when the dialog opens for a category.
      /* eslint-disable react-hooks/set-state-in-effect */
      setName(category.name || "");
      setDescription(category.description || "");
      /* eslint-enable react-hooks/set-state-in-effect */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <ResponsiveStack direction="row" gap={2} align="center">
            <FolderTree size={16} />
            <span>Edit category</span>
          </ResponsiveStack>
        }
        description="Update the name and description."
        footer={
          <ButtonGroup attached={false}>
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
        <ResponsiveStack direction="col" gap={3}>
          {error?.update ? (
            <Alert tone="danger">{String(error.update)}</Alert>
          ) : null}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </ResponsiveStack>
      </Dialog>
    </>
  );
}
