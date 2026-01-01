/**
 * Blockly Theme Configuration
 *
 * Custom themes for Infinibay with light and dark mode support.
 * Colors are based on Tailwind CSS palette.
 */

import * as Blockly from 'blockly';

// Block category colors (matching backend BlockRegistry)
const colors = {
  health: { primary: '#10b981', secondary: '#059669', tertiary: '#047857' }, // emerald
  logic: { primary: '#3b82f6', secondary: '#2563eb', tertiary: '#1d4ed8' }, // blue
  loops: { primary: '#8b5cf6', secondary: '#7c3aed', tertiary: '#6d28d9' }, // violet
  variables: { primary: '#f59e0b', secondary: '#d97706', tertiary: '#b45309' }, // amber
  math: { primary: '#06b6d4', secondary: '#0891b2', tertiary: '#0e7490' }, // cyan
  text: { primary: '#ec4899', secondary: '#db2777', tertiary: '#be185d' }, // pink
  actions: { primary: '#ef4444', secondary: '#dc2626', tertiary: '#b91c1c' }, // red
  comparison: { primary: '#6366f1', secondary: '#4f46e5', tertiary: '#4338ca' }, // indigo
};

// Light theme
export const infinibayTheme = Blockly.Theme.defineTheme('infinibay', {
  name: 'infinibay',
  base: Blockly.Themes.Zelos,
  blockStyles: {
    health_blocks: {
      colourPrimary: colors.health.primary,
      colourSecondary: colors.health.secondary,
      colourTertiary: colors.health.tertiary,
      hat: '',
    },
    logic_blocks: {
      colourPrimary: colors.logic.primary,
      colourSecondary: colors.logic.secondary,
      colourTertiary: colors.logic.tertiary,
    },
    loop_blocks: {
      colourPrimary: colors.loops.primary,
      colourSecondary: colors.loops.secondary,
      colourTertiary: colors.loops.tertiary,
    },
    variable_blocks: {
      colourPrimary: colors.variables.primary,
      colourSecondary: colors.variables.secondary,
      colourTertiary: colors.variables.tertiary,
    },
    math_blocks: {
      colourPrimary: colors.math.primary,
      colourSecondary: colors.math.secondary,
      colourTertiary: colors.math.tertiary,
    },
    text_blocks: {
      colourPrimary: colors.text.primary,
      colourSecondary: colors.text.secondary,
      colourTertiary: colors.text.tertiary,
    },
    action_blocks: {
      colourPrimary: colors.actions.primary,
      colourSecondary: colors.actions.secondary,
      colourTertiary: colors.actions.tertiary,
    },
    comparison_blocks: {
      colourPrimary: colors.comparison.primary,
      colourSecondary: colors.comparison.secondary,
      colourTertiary: colors.comparison.tertiary,
    },
  },
  categoryStyles: {
    health_category: { colour: colors.health.primary },
    logic_category: { colour: colors.logic.primary },
    loop_category: { colour: colors.loops.primary },
    variable_category: { colour: colors.variables.primary },
    math_category: { colour: colors.math.primary },
    text_category: { colour: colors.text.primary },
    action_category: { colour: colors.actions.primary },
    comparison_category: { colour: colors.comparison.primary },
  },
  componentStyles: {
    workspaceBackgroundColour: '#f8fafc', // slate-50
    toolboxBackgroundColour: '#f1f5f9', // slate-100
    toolboxForegroundColour: '#334155', // slate-700
    flyoutBackgroundColour: '#e2e8f0', // slate-200
    flyoutForegroundColour: '#334155', // slate-700
    flyoutOpacity: 0.95,
    scrollbarColour: '#94a3b8', // slate-400
    scrollbarOpacity: 0.5,
    insertionMarkerColour: '#3b82f6', // blue-500
    insertionMarkerOpacity: 0.6,
    markerColour: '#3b82f6',
    cursorColour: '#3b82f6',
  },
  fontStyle: {
    family: 'Inter, system-ui, sans-serif',
    weight: '500',
    size: 12,
  },
  startHats: true,
});

// Dark theme
export const infinibayDarkTheme = Blockly.Theme.defineTheme('infinibay-dark', {
  name: 'infinibay-dark',
  base: infinibayTheme,
  componentStyles: {
    workspaceBackgroundColour: '#0f172a', // slate-900
    toolboxBackgroundColour: '#1e293b', // slate-800
    toolboxForegroundColour: '#e2e8f0', // slate-200
    flyoutBackgroundColour: '#334155', // slate-700
    flyoutForegroundColour: '#e2e8f0', // slate-200
    flyoutOpacity: 0.95,
    scrollbarColour: '#64748b', // slate-500
    scrollbarOpacity: 0.5,
    insertionMarkerColour: '#60a5fa', // blue-400
    insertionMarkerOpacity: 0.6,
    markerColour: '#60a5fa',
    cursorColour: '#60a5fa',
  },
});

/**
 * Get the appropriate theme based on the current mode.
 * @param {string} theme - 'light' or 'dark'
 * @returns {Blockly.Theme} The Blockly theme
 */
export function getBlocklyTheme(theme) {
  return theme === 'dark' ? infinibayDarkTheme : infinibayTheme;
}
