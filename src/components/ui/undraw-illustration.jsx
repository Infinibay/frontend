'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { InboxIcon, AlertCircle, CloudDownload, FileQuestion, ServerCrash } from 'lucide-react';

/**
 * Map of context names to custom illustration images
 */
const IMAGE_MAP = {
  'computer': '/images/icons/computer.svg',
  'department': '/images/icons/department.svg',
  'empty': '/images/icons/empty-state.svg',
  'health': '/images/icons/health.svg',
  'network': '/images/icons/network.svg',
  'script': '/images/icons/script.svg',
  'security': '/images/icons/security.svg',
  'server-rack': '/images/icons/server-rack.svg',
  'settings': '/images/icons/settings.svg',
  'storage': '/images/icons/storage.svg',
  'template': '/images/icons/template.svg',
  'users': '/images/icons/users.svg',
};

/**
 * Map of context names to their appropriate lucide icons (fallback)
 */
const ICON_MAP = {
  'not-found': InboxIcon,
  'no-data': InboxIcon,
  'void': FileQuestion,
  'error': ServerCrash,
  'warning': AlertCircle,
  'alert': AlertCircle,
  'download': CloudDownload,
  'cloud-sync': CloudDownload,
  'cloud': CloudDownload,
};

const SIZE_PX = {
  small: 80,
  medium: 120,
  large: 160,
  xlarge: 200,
};

/**
 * SimpleIllustration Component
 * Displays custom SVG illustrations from the icon pack, or falls back to lucide-react icons.
 *
 * Priority: IMAGE_MAP (custom illustrations) > icon prop > ICON_MAP (lucide fallback)
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
    small: 'w-20 h-20',
    medium: 'w-30 h-30',
    large: 'w-40 h-40',
    xlarge: 'w-50 h-50',
  };

  const imageSrc = IMAGE_MAP[name];

  // If we have a custom illustration image, render it
  if (imageSrc) {
    const px = SIZE_PX[size] || SIZE_PX.medium;
    return (
      <div
        className={cn(
          'flex items-center justify-center select-none pointer-events-none',
          className
        )}
        role="img"
        aria-label={`${name} illustration`}
        {...props}
      >
        <Image
          src={imageSrc}
          alt={`${name} illustration`}
          width={px}
          height={px}
          className="object-contain"
          style={{ opacity: opacity / 100 }}
          draggable={false}
        />
      </div>
    );
  }

  // Fallback to lucide icon
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
