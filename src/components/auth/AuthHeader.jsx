import React from "react";
import { Image } from "@nextui-org/react";
import { useSizeContext } from "@/components/ui/size-provider";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { getSafeTheme } from "@/utils/form-glass-effects";

const AuthHeader = ({
  text,
  onBack,
  showBackButton = true,
  variant = "default",
  glass = false,
  className
}) => {
  const { size } = useSizeContext();
  const theme = getSafeTheme();

  // Size-responsive classes
  const sizeClasses = {
    sm: {
      container: "gap-2",
      icon: "w-6 h-6",
      text: "text-base",
      spacing: "p-2"
    },
    md: {
      container: "gap-3",
      icon: "w-8 h-8",
      text: "text-lg",
      spacing: "p-3"
    },
    lg: {
      container: "gap-4",
      icon: "w-10 h-10",
      text: "text-xl",
      spacing: "p-4"
    },
    xl: {
      container: "gap-6",
      icon: "w-12 h-12",
      text: "text-2xl",
      spacing: "p-6"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Glass effect classes
  const glassClasses = glass ? "glass-minimal backdrop-blur-sm bg-background/30 rounded-lg" : "";

  // Variant-specific styling
  const variants = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent-foreground",
    minimal: "text-muted-foreground/80"
  };

  const textColorClass = variants[variant] || variants.default;

  // Back button component
  const BackButton = () => (
    <button
      onClick={onBack}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-all duration-200",
        "hover:bg-accent/10 focus:bg-accent/20 active:bg-accent/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        currentSize.spacing,
        glassClasses && "hover:glass-subtle"
      )}
      aria-label="Go back"
      type="button"
    >
      <ChevronLeft
        className={cn(
          currentSize.icon,
          textColorClass,
          "transition-colors duration-200"
        )}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <header
      className={cn(
        "flex items-center transition-all duration-300",
        currentSize.container,
        glassClasses,
        className
      )}
    >
      {showBackButton && onBack && <BackButton />}

      {text && (
        <h1
          className={cn(
            "font-semibold leading-none tracking-tight",
            currentSize.text,
            textColorClass,
            "transition-colors duration-200"
          )}
        >
          {text}
        </h1>
      )}
    </header>
  );
};

export default AuthHeader;

// Export variants for reuse
export const AUTH_HEADER_VARIANTS = {
  default: "default",
  primary: "primary",
  accent: "accent",
  minimal: "minimal"
};

// Export size configurations for external use
export const AUTH_HEADER_SIZES = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl"
};
