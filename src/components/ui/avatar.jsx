import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';
import { useOptionalSizeContext } from './size-provider';

/**
 * Avatar Component
 * A simple avatar component that displays an image or fallback initials
 */
export const Avatar = ({ src, alt, className, size }) => {
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;
  const currentSize = size || globalSize || "md";
  const getSizeClassName = sizeContext?.getSizeClassName;

  return (
    <div className={cn(
      "relative inline-block rounded-full overflow-hidden bg-secondary",
      "size-avatar",
      "size-radius",
      size && getSizeClassName && getSizeClassName(size),
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className={cn(
          "h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground",
          "size-card-description"
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


