'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

/**
 * LottieAnimation Component
 * A reusable Lottie animation wrapper with built-in UX best practices:
 * - Respects user preferences for reduced motion
 * - Lazy loads animations for performance
 * - Provides smooth fade-in transitions
 * - Ensures animations don't interfere with content
 */
export function LottieAnimation({
  animationPath,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  style,
  onComplete,
  fallback = null,
  ariaLabel = "Decorative animation",
  ...props
}) {
  const [animationData, setAnimationData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load animation data
  useEffect(() => {
    if (!animationPath || prefersReducedMotion) return;

    const loadAnimation = async () => {
      try {
        const response = await fetch(animationPath);
        const data = await response.json();
        setAnimationData(data);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setIsLoaded(true); // Still set as loaded to show fallback
      }
    };

    loadAnimation();
  }, [animationPath, prefersReducedMotion]);

  // If user prefers reduced motion, don't show animation
  if (prefersReducedMotion) {
    return fallback;
  }

  // Show nothing while loading (or fallback if provided)
  if (!animationData) {
    return fallback || <div className={cn("animate-pulse bg-muted rounded-lg", className)} style={style} />;
  }

  return (
    <div
      className={cn(
        "relative select-none pointer-events-none",
        isLoaded && "animate-in fade-in duration-500",
        className
      )}
      style={style}
      aria-label={ariaLabel}
      role="img"
      {...props}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        onComplete={onComplete}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true,
        }}
      />
    </div>
  );
}

/**
 * WizardStepAnimation Component
 * Specialized Lottie animation for wizard steps with optimal positioning
 */
export function WizardStepAnimation({
  animationPath,
  position = 'static', // static, top-right, top-left, center-top, background
  size = 'medium', // small, medium, large, xlarge
  opacity = 0.8,
  className,
  ...props
}) {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
    xlarge: 'w-80 h-80',
  };

  const positionClasses = {
    'static': '',
    'top-right': 'absolute -top-8 -right-8',
    'top-left': 'absolute -top-8 -left-8',
    'center-top': 'mx-auto mb-6',
    'background': 'absolute inset-0 flex items-center justify-center',
    'right-center': 'absolute top-1/2 right-8 -translate-y-1/2',
    'right-area': 'absolute top-32 right-12',
  };

  const isBackground = position === 'background';

  return (
    <LottieAnimation
      animationPath={animationPath}
      className={cn(
        sizeClasses[size],
        positionClasses[position],
        isBackground && 'opacity-10',
        !isBackground && `opacity-${Math.round(opacity * 100)}`,
        className
      )}
      style={{
        opacity: isBackground ? 0.1 : opacity,
        zIndex: isBackground ? 0 : 1,
      }}
      ariaLabel="Step illustration"
      {...props}
    />
  );
}