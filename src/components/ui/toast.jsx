'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOptionalSizeContext } from './size-provider';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, size, ...props }, ref) => {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        'size-spacing-container toast-stack-container',
        className
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden border shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:toast-animate-in data-[state=closed]:toast-animate-out data-[swipe=end]:toast-animate-out',
  {
    variants: {
      variant: {
        default: 'glass-strong border border-sidebar-border/30 text-foreground backdrop-blur-md',
        success: 'glass-strong border border-green-500/40 text-green-700 dark:text-green-300 backdrop-blur-md',
        destructive: 'glass-strong border border-destructive/40 text-destructive dark:text-red-300 backdrop-blur-md',
      },
      size: {
        sm: 'size-padding size-radius size-gap',
        md: 'size-padding size-radius size-gap',
        lg: 'size-padding size-radius size-gap',
        xl: 'size-padding size-radius size-gap',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const Toast = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const getSizeClassName = sizeContext?.getSizeClassName;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant, size: currentSize }),
        size && getSizeClassName && getSizeClassName(size),
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const getSizeClassName = sizeContext?.getSizeClassName;

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center border bg-transparent font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        'size-height',
        'size-radius',
        'size-padding',
        'size-text',
        size && getSizeClassName && getSizeClassName(size),
        className
      )}
      {...props}
    />
  );
});
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, size, ...props }, ref) => {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 p-1 text-foreground/70 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 hover:bg-background/20 rounded-md',
        'group-[.destructive]:text-red-600 group-[.destructive]:hover:text-red-700 group-[.destructive]:focus:ring-red-400',
        'size-radius',
        className
      )}
      toast-close=""
      {...props}
    >
      <X className="size-icon" />
    </ToastPrimitives.Close>
  );
});
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, size, ...props }, ref) => {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn('font-semibold text-foreground', 'size-card-title', className)}
      {...props}
    />
  );
});
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, size, ...props }, ref) => {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn('text-foreground/80', 'size-card-description', className)}
      {...props}
    />
  );
});
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
