import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';
import { useOptionalSizeContext, sizeVariants } from './size-provider';

/**
 * Avatar Component
 * A simple avatar component that displays an image or fallback initials
 */
export const Avatar = ({ src, alt, className, size }) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const sizes = sizeVariants[currentSize];

  // Extract dimensions from avatar size class
  const getDimensions = (sizeClass) => {
    if (sizeClass.includes('w-8')) return { width: 32, height: 32 };
    if (sizeClass.includes('w-10')) return { width: 40, height: 40 };
    if (sizeClass.includes('w-12')) return { width: 48, height: 48 };
    if (sizeClass.includes('w-14')) return { width: 56, height: 56 };
    return { width: 32, height: 32 }; // default
  };

  const dimensions = getDimensions(sizes.avatar);

  return (
    <div className={cn(
      "relative inline-block rounded-full overflow-hidden bg-secondary",
      sizes.avatar,
      sizes.radius,
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className={cn(
          "h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground",
          sizes.card.description
        )}>
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};


