import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';

/**
 * Avatar Component
 * A simple avatar component that displays an image or fallback initials
 */
export const Avatar = ({ src, alt, className }) => {
  return (
    <div className={cn(
      "relative inline-block h-8 w-8 rounded-full overflow-hidden bg-secondary",
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground">
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string
};


