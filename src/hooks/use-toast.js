import { toast as sonnerToast } from "sonner";

function toast({ title, description, variant, duration } = {}) {
  const msg = title || description || "";
  const opts = description && title ? { description, duration } : { duration };

  switch (variant) {
    case "destructive":
    case "error":
      return { id: sonnerToast.error(msg, opts), dismiss: () => {}, update: () => {} };
    case "success":
      return { id: sonnerToast.success(msg, opts), dismiss: () => {}, update: () => {} };
    case "warning":
      return { id: sonnerToast.warning(msg, opts), dismiss: () => {}, update: () => {} };
    case "info":
      return { id: sonnerToast.info(msg, opts), dismiss: () => {}, update: () => {} };
    default:
      return { id: sonnerToast(msg, opts), dismiss: () => {}, update: () => {} };
  }
}

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts: [],
  };
}

export { toast };
