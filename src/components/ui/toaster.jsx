'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { useOptionalSizeContext } from '@/components/ui/size-provider';

export function Toaster() {
  const { toasts } = useToast();
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size || 'md';

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} size={globalSize} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle size={globalSize}>{title}</ToastTitle>}
              {description && (
                <ToastDescription size={globalSize}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose size={globalSize} />
          </Toast>
        );
      })}
      <ToastViewport size={globalSize} />
    </ToastProvider>
  );
}
