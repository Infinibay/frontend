'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * NumberStepper - A number input with increment/decrement buttons
 *
 * Features:
 * - Click: +/- 1 (or custom step)
 * - Shift + Click: +/- 10 (or custom shiftStep)
 * - Hold to repeat
 * - Deferred validation (validates on blur, not on every keystroke)
 * - Color variants to match sliders
 */
export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  shiftStep = 10,
  color = 'blue', // blue | green | purple
  className,
  disabled = false,
}) {
  // Local state for the input value (allows typing without immediate validation)
  const [inputValue, setInputValue] = useState(value.toString());
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Sync local state when external value changes (e.g., from slider)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Clamp value to min/max bounds
  const clamp = useCallback((val) => {
    return Math.min(max, Math.max(min, val));
  }, [min, max]);

  // Handle increment/decrement
  const handleStep = useCallback((delta) => {
    const newValue = clamp(value + delta);
    setInputValue(newValue.toString());
    onChange(newValue);
  }, [value, onChange, clamp]);

  // Handle button click with shift detection
  const handleButtonClick = (direction, event) => {
    const delta = event.shiftKey ? shiftStep : step;
    handleStep(direction === 'up' ? delta : -delta);
  };

  // Handle hold to repeat
  const startRepeat = (direction, event) => {
    const delta = event.shiftKey ? shiftStep : step;
    const stepFn = () => handleStep(direction === 'up' ? delta : -delta);

    // Initial delay before repeating
    timeoutRef.current = setTimeout(() => {
      // Start repeating
      intervalRef.current = setInterval(stepFn, 75);
    }, 400);
  };

  const stopRepeat = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopRepeat();
  }, []);

  // Handle input change (no validation, just update local state)
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle blur (validate and sync)
  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) {
      // Reset to current value if invalid
      setInputValue(value.toString());
    } else {
      const clamped = clamp(parsed);
      setInputValue(clamped.toString());
      if (clamped !== value) {
        onChange(clamped);
      }
    }
  };

  // Handle Enter key to validate
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
      e.target.blur();
    }
    // Arrow keys for increment/decrement
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleButtonClick('up', e);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleButtonClick('down', e);
    }
  };

  // Color variants
  const colorStyles = {
    blue: {
      input: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20',
      button: 'border-blue-300 hover:bg-blue-50 active:bg-blue-100 text-blue-600',
      buttonDisabled: 'text-blue-300',
    },
    green: {
      input: 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
      button: 'border-green-300 hover:bg-green-50 active:bg-green-100 text-green-600',
      buttonDisabled: 'text-green-300',
    },
    purple: {
      input: 'border-purple-300 focus:border-purple-500 focus:ring-purple-500/20',
      button: 'border-purple-300 hover:bg-purple-50 active:bg-purple-100 text-purple-600',
      buttonDisabled: 'text-purple-300',
    },
  };

  const styles = colorStyles[color] || colorStyles.blue;
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div className={cn('flex items-stretch', className)}>
      {/* Number input */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'w-16 text-center font-medium text-base',
          'border rounded-l-lg rounded-r-none border-r-0',
          'bg-background',
          'focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-150',
          'py-1.5',
          styles.input
        )}
      />

      {/* Stepper buttons */}
      <div className="flex flex-col -ml-px">
        <button
          type="button"
          onClick={(e) => handleButtonClick('up', e)}
          onMouseDown={(e) => startRepeat('up', e)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          disabled={disabled || isAtMax}
          className={cn(
            'px-2 h-1/2 flex items-center justify-center',
            'border border-b-0 rounded-tr-lg',
            'transition-colors duration-150',
            'disabled:cursor-not-allowed',
            disabled || isAtMax ? styles.buttonDisabled : styles.button,
            disabled || isAtMax ? 'hover:bg-transparent' : ''
          )}
          title={`Increase by ${step} (Shift+Click: ${shiftStep})`}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick('down', e)}
          onMouseDown={(e) => startRepeat('down', e)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          disabled={disabled || isAtMin}
          className={cn(
            'px-2 h-1/2 flex items-center justify-center',
            'border rounded-br-lg',
            'transition-colors duration-150',
            'disabled:cursor-not-allowed',
            disabled || isAtMin ? styles.buttonDisabled : styles.button,
            disabled || isAtMin ? 'hover:bg-transparent' : ''
          )}
          title={`Decrease by ${step} (Shift+Click: ${shiftStep})`}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
