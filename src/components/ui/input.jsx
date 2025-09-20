import * as React from "react"
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"
import { useSafeResolvedTheme } from "@/utils/safe-theme"
import {
  getFloatingLabelClasses,
  getInputContainerClasses,
  useFloatingLabel,
  useInputStates
} from "@/utils/form-animations"

const Input = React.forwardRef(({
  size: propSize,
  className,
  type = "text",
  glass,
  label,
  error,
  success,
  placeholder,
  floatingLabel = false,
  ...props
}, ref) => {
  const { size: contextSize } = useSizeContext();
  const size = propSize || contextSize;
  const sizes = sizeVariants[size];
  const theme = useSafeResolvedTheme();

  const [value, setValue] = React.useState(props.value || props.defaultValue || "");
  const { isFocused, isHovered, handlers } = useInputStates();
  const { isFloated } = useFloatingLabel(value, isFocused);

  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => inputRef.current);

  const getInputStyles = () => {
    if (glass) {
      return "glass-subtle backdrop-blur-sm bg-background/30"
    }

    // Enhanced contrast for better visibility
    return theme === 'dark'
      ? "bg-background/90 border-border/60 text-foreground"
      : "bg-background border-border/60 text-foreground"
  }

  const handleChange = (e) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleLabelClick = () => {
    inputRef.current?.focus();
  };

  const containerClasses = getInputContainerClasses(isFocused, error, success, isHovered);

  const inputElement = (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={handleChange}
      className={cn(
        // Base styles with better contrast
        "w-full rounded-lg border shadow-sm font-medium text-foreground caret-primary",
        "file:border-0 file:bg-transparent file:font-medium file:text-foreground",
        // Conditional placeholder visibility for floating labels
        floatingLabel
          ? "placeholder:text-transparent focus:placeholder:text-muted-foreground/50"
          : "placeholder:text-muted-foreground/70 placeholder:font-normal",
        "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
        // Dynamic background and animations
        getInputStyles(),
        containerClasses,
        // Size variants
        sizes.input.height,
        floatingLabel ? "pt-6 pb-2 px-4" : sizes.input.padding,
        sizes.input.text,
        className
      )}
      placeholder={floatingLabel ? (isFloated ? placeholder : "") : placeholder}
      {...handlers}
      {...props}
    />
  );

  // If floating label is disabled, return simple input
  if (!floatingLabel || !label) {
    return inputElement;
  }

  // Return input with floating label
  return (
    <div className="relative">
      {inputElement}
      <label
        onClick={handleLabelClick}
        className={cn(
          "absolute left-4 pointer-events-none cursor-text select-none",
          "transition-all duration-200 ease-smooth origin-left",
          getFloatingLabelClasses(isFloated, error, success),
          isFloated
            ? "top-2 transform -translate-y-0 scale-75"
            : "top-1/2 transform -translate-y-1/2 scale-100"
        )}
      >
        {label}
      </label>
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-destructive animate-shake">
          {error}
        </p>
      )}
      {/* Success message */}
      {success && (
        <p className="mt-1 text-sm text-green-600 animate-pulse-once">
          {success}
        </p>
      )}
    </div>
  );
})
Input.displayName = "Input"

export { Input }
