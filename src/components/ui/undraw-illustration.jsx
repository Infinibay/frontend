'use client';

import { cn } from '@/lib/utils';
import { InboxIcon, AlertCircle, CloudDownload, FileQuestion, ServerCrash } from 'lucide-react';

/**
 * Map of context names to their appropriate icons
 * Using lucide-react icons for a clean, consistent look
 */
const ICON_MAP = {
  'empty': InboxIcon,
  'void': FileQuestion,
  'not-found': InboxIcon,
  'no-data': InboxIcon,
  'error': ServerCrash,
  'warning': AlertCircle,
  'alert': AlertCircle,
  'download': CloudDownload,
  'cloud-sync': CloudDownload,
  'cloud': CloudDownload,
};

/**
 * SimpleIllustration Component
 * Displays clean icon-based illustrations using lucide-react
 *
 * This replaces Lottie animations with simple, accessible icons
 * that respect user preferences (reduced motion) and have better performance.
 */
export function SimpleIllustration({
  name,
  icon,
  className,
  size = 'medium',
  opacity = 20,
  strokeWidth = 1,
  ...props
}) {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
    xlarge: 'w-80 h-80',
  };

  // Use provided icon or look up by name
  const Icon = icon || ICON_MAP[name] || InboxIcon;

  return (
    <div
      className={cn(
        'flex items-center justify-center select-none pointer-events-none',
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={`${name} illustration`}
      {...props}
    >
      <Icon
        className={cn(
          'w-full h-full text-muted-foreground',
          `opacity-${opacity}`
        )}
        strokeWidth={strokeWidth}
        style={{ opacity: opacity / 100 }}
      />
    </div>
  );
}
