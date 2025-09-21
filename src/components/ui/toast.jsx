'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOptionalSizeContext, sizeVariants } from './size-provider';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        sizes.spacing.container,
        className
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden border shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background',
        success: 'border-green-500/50 bg-green-500/10 text-green-600',
        destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
      size: {
        sm: 'rounded-md p-3 pr-6',
        md: 'rounded-md p-4 pr-8',
        lg: 'rounded-lg p-6 pr-10',
        xl: 'rounded-xl p-8 pr-12',
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

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size: currentSize }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center border bg-transparent font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        sizes.height,
        sizes.radius,
        sizes.padding,
        sizes.text,
        className
      )}
      {...props}
    />
  );
});
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        sizes.radius,
        className
      )}
      toast-close=""
      {...props}
    >
      <X className={sizes.icon.size} />
    </ToastPrimitives.Close>
  );
});
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn('font-semibold', sizes.card.title, className)}
      {...props}
    />
  );
});
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, size, ...props }, ref) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn('opacity-90', sizes.card.description, className)}
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
