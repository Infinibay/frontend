import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';
import { useOptionalSizeContext } from './size-provider';
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar';
import { Loader2 } from 'lucide-react';

/**
 * Avatar Component
 * Enhanced avatar component that displays an image with fallback behavior and loading states
 */
export const Avatar = ({
  src,
  alt,
  className,
  size,
  fallback,
  loading = false,
  onClick
}) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const getSizeClassName = sizeContext?.getSizeClassName;

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Process the avatar URL through our utility function
  const processedSrc = src ? getAvatarUrl(src) : DEFAULT_AVATAR_URL;

  // Handle image load error with better fallback behavior
  const handleImageError = (e) => {
    console.warn('Avatar image failed to load:', {
      src: processedSrc,
      originalSrc: src,
      alt,
      error: e?.target?.error
    });

    setImageError(true);
    setImageLoading(false);

    // Try fallback to default avatar if original src wasn't already default
    if (processedSrc !== DEFAULT_AVATAR_URL) {
      e.target.src = DEFAULT_AVATAR_URL;
      setImageError(false); // Give default avatar a chance
    }
  };

  // Generate better alt text
  const getAltText = () => {
    if (alt) return alt;
    if (fallback) return `Avatar for ${fallback}`;
    return 'User avatar';
  };

  // Generate fallback initials
  const getFallbackInitials = () => {
    if (fallback) {
      // Extract initials from fallback text
      return fallback
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (alt) {
      return alt.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <div
      className={cn(
        "relative inline-block rounded-full overflow-hidden bg-secondary transition-all duration-200",
        "size-avatar",
        "size-radius",
        size && getSizeClassName && getSizeClassName(size),
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        loading && "opacity-70",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Loading State */}
      {(loading || imageLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/90 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Avatar Image */}
      {!imageError ? (
        <Image
          src={processedSrc}
          alt={getAltText()}
          fill
          className={cn(
            "object-cover transition-all duration-300",
            onClick && "hover:scale-110"
          )}
          onError={handleImageError}
          onLoad={() => setImageLoading(false)}
          priority={false}
        />
      ) : (
        /* Fallback Display */
        <div className={cn(
          "h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold",
          "size-card-description transition-all duration-300",
          onClick && "hover:bg-secondary/80"
        )}>
          {getFallbackInitials()}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fallback: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func
};


