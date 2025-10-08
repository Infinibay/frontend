import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';
import { useOptionalSizeContext } from './size-provider';
import { getGravatarUrl } from '@/utils/gravatar';
import { Loader2 } from 'lucide-react';

/**
 * Avatar Component
 * Displays user avatar using Gravatar based on email address
 */
export const Avatar = ({
  email,
  alt,
  className,
  size,
  fallback,
  loading = false,
  onClick,
  gravatarOptions = {}
}) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const getSizeClassName = sizeContext?.getSizeClassName;

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate Gravatar URL from email
  const gravatarUrl = getGravatarUrl(email, {
    size: 200,
    default: 'identicon',
    ...gravatarOptions
  });

  // Handle image load error
  const handleImageError = (e) => {
    setImageError(true);
    setImageLoading(false);
  };

  // Generate better alt text
  const getAltText = () => {
    if (alt) return alt;
    if (fallback) return `Avatar for ${fallback}`;
    if (email) return `Avatar for ${email}`;
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
    if (email) {
      return email.charAt(0).toUpperCase();
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
          src={gravatarUrl}
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
  email: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fallback: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  gravatarOptions: PropTypes.object
};


