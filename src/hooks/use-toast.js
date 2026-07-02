import { toast as sonnerToast } from "sonner";

function toast({ title, description, variant, duration } = {}) {
  const msg = title || description || "";
  const opts = description && title ? { description, duration } : { duration };

  // Fire (or, when given an `id`, re-render in place) the toast using the
  // variant->method mapping. sonner's id-based API means passing the original
  // id back lets dismiss/update target this exact toast instead of being no-ops.
  const show = (extra) => {
    const o = { ...opts, ...extra };
    switch (variant) {
      case "destructive":
      case "error":
        return sonnerToast.error(msg, o);
      case "success":
        return sonnerToast.success(msg, o);
      case "warning":
        return sonnerToast.warning(msg, o);
      case "info":
        return sonnerToast.info(msg, o);
      default:
        return sonnerToast(msg, o);
    }
  };

  const id = show();

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (updateOpts) => show({ ...updateOpts, id }),
  };
}

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts: [],
  };
}

export { toast };
