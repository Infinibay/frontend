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
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size || 'md';

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }, index) {
        const isTop = index === 0;
        const stackIndex = index;
        const stackOffset = stackIndex * 8; // 8px offset per toast
        const stackScale = 1 - stackIndex * 0.05; // Reduce scale by 5% per toast
        const stackOpacity = isTop ? 1 : 0.7 - stackIndex * 0.15; // Reduce opacity for stacked toasts
        const stackBlur = stackIndex > 0 ? `blur(${stackIndex * 2}px)` : 'none';

        return (
          <Toast
            key={id}
            size={globalSize}
            {...props}
            className={cn(
              'toast-stacked',
              props.className,
              !isTop && 'pointer-events-none'
            )}
            style={{
              '--stack-index': stackIndex,
              '--stack-offset': `${stackOffset}px`,
              '--stack-scale': stackScale,
              '--stack-opacity': stackOpacity,
              '--stack-blur': stackBlur,
              transform: `
                translateY(-${stackOffset}px)
                scale(${stackScale})
                translateZ(${-stackIndex * 10}px)
              `,
              opacity: stackOpacity,
              filter: stackBlur,
              zIndex: 9999 - stackIndex,
              position: stackIndex > 0 ? 'absolute' : 'relative',
              top: stackIndex > 0 ? `${stackOffset}px` : 'auto',
              transition: 'all 0.3s ease-out',
              ...props.style,
            }}
            onMouseEnter={() => {
              // Pause auto-dismiss on hover (for top toast only)
              if (isTop && typeof props.onMouseEnter === 'function') {
                props.onMouseEnter();
              }
            }}
            onMouseLeave={() => {
              // Resume auto-dismiss on mouse leave (for top toast only)
              if (isTop && typeof props.onMouseLeave === 'function') {
                props.onMouseLeave();
              }
            }}
          >
            <div className="grid size-gap">
              {title && <ToastTitle size={globalSize}>{title}</ToastTitle>}
              {description && (
                <ToastDescription size={globalSize}>{description}</ToastDescription>
              )}
            </div>
            {action}
            {isTop && <ToastClose size={globalSize} />}
          </Toast>
        );
      })}
      <ToastViewport size={globalSize} />
    </ToastProvider>
  );
}
