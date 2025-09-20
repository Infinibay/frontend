/**
 * Wizard-specific glassmorphism utilities and helper functions
 * Provides consistent glass styling for wizard components with theme contrast
 */

import { getSidebarGlass, getGlassNavContainer, getReducedTransparencyFallback } from './navigation-glass';
import { cn } from '@/lib/utils';

/**
 * Get the opposite theme for creating contrast
 * @param {string} theme - Current theme (light/dark)
 * @returns {string} Opposite theme
 */
export const getOppositeTheme = (theme) => {
  return theme === 'light' ? 'dark' : 'light';
};

/**
 * Get elegant classes for wizard step cards with solid contrast styling
 * @param {string} theme - Current theme
 * @returns {string} Classes for step cards
 */
export const getWizardStepCardClasses = (theme) => {
  // Simple classes that work with inline styles for elegant contrast
  return cn(
    'rounded-lg',
    'transition-all',
    'duration-200',
    'hover:shadow-lg',
    // Override Card component defaults to let inline styles take effect
    '!bg-transparent',
    '!border-transparent'
  );
};

/**
 * Get enhanced glass classes for the main wizard container
 * @param {string} theme - Current theme
 * @returns {string} Glass classes for wizard container
 */
export const getWizardContainerClasses = (theme) => {
  return cn(
    getGlassNavContainer({
      variant: 'elevated',
      theme: theme
    }),
    // Enhanced styling for modern wizard
    '!bg-transparent',
    'backdrop-blur-2xl',
    'border border-border/30',
    'shadow-2xl shadow-black/10',
    theme === 'dark' && 'shadow-black/20'
  );
};

/**
 * Get enhanced glass classes for wizard progress indicators
 * @param {string} theme - Current theme
 * @returns {string} Glass classes for progress elements
 */
export const getWizardProgressClasses = (theme) => {
  return cn(
    getSidebarGlass(theme, 'subtle'),
    'backdrop-blur-lg border border-border/20',
    'bg-gradient-to-r from-background/50 to-background/30'
  );
};

/**
 * Get glass classes for wizard navigation buttons
 * @param {string} theme - Current theme
 * @returns {string} Glass classes for navigation buttons
 */
export const getWizardNavButtonClasses = (theme) => {
  return getSidebarGlass(theme, 'minimal');
};

/**
 * Get enhanced glass classes for wizard step content
 * @param {string} theme - Current theme
 * @returns {string} Glass classes for step content
 */
export const getWizardStepClasses = (theme) => {
  return cn(
    getSidebarGlass(theme, 'subtle'),
    'backdrop-blur-xl border border-border/20'
  );
};

/**
 * Get inline styles for wizard step cards with elegant contrast
 * @param {string} theme - Current theme
 * @returns {Object} Inline styles for step cards
 */
export const getWizardStepCardStyles = (theme) => {
  return theme === 'dark'
    ? {
        backgroundColor: 'rgba(248, 250, 252, 0.95)', // Almost solid light background for dark theme
        borderColor: 'rgba(226, 232, 240, 0.8)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        color: 'rgba(15, 23, 42, 0.9)', // Dark text on light background
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    : {
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Almost solid dark background for light theme
        borderColor: 'rgba(51, 65, 85, 0.8)',
        border: '1px solid rgba(51, 65, 85, 0.8)',
        color: 'rgba(248, 250, 252, 0.9)', // Light text on dark background
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      };
};