"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@infinibay/harbor";

/**
 * Bridge between the legacy (show / title / description / variant)
 * props API that useVMDetail exposes and Harbor's push-based
 * `useToast().push()` API. Fires a toast once when `show` flips from
 * false → true, then immediately closes the legacy flag via
 * onOpenChange so the parent's state stays consistent.
 */
const ToastNotification = ({ show, variant, title, description, onOpenChange }) => {
  const toast = useToast();
  const wasShown = useRef(false);

  useEffect(() => {
    if (show && !wasShown.current) {
      wasShown.current = true;
      toast?.push?.({
        title,
        description,
        tone:
          variant === "destructive"
            ? "danger"
            : variant === "success"
              ? "success"
              : variant === "warning"
                ? "warning"
                : "neutral",
      });
      // Release the legacy flag immediately — Harbor handles its own
      // lifecycle after the push.
      onOpenChange?.(false);
    } else if (!show) {
      wasShown.current = false;
    }
  }, [show, title, description, variant, onOpenChange, toast]);

  return null;
};

export default ToastNotification;
