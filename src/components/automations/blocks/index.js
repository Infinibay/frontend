/**
 * Block Definitions Registry
 *
 * Registers all custom Blockly blocks for the automation system.
 * These must match the backend BlockRegistry definitions.
 */

import { registerHealthBlocks } from './healthBlocks';
import { registerLogicBlocks } from './logicBlocks';
import { registerComparisonBlocks } from './comparisonBlocks';
import { registerMathBlocks } from './mathBlocks';
import { registerTextBlocks } from './textBlocks';
import { registerLoopBlocks } from './loopBlocks';
import { registerActionBlocks } from './actionBlocks';
import { registerVariableBlocks } from './variableBlocks';

let blocksRegistered = false;

/**
 * Register all block definitions with Blockly.
 * Safe to call multiple times - will only register once.
 */
export function registerAllBlocks() {
  if (blocksRegistered) return;

  registerHealthBlocks();
  registerLogicBlocks();
  registerComparisonBlocks();
  registerMathBlocks();
  registerTextBlocks();
  registerLoopBlocks();
  registerActionBlocks();
  registerVariableBlocks();

  blocksRegistered = true;
}

/**
 * Block categories for the toolbox.
 * Colors match the Infinibay theme and backend BlockRegistry.
 */
export const BLOCK_CATEGORIES = {
  health: {
    name: 'Health Data',
    colour: '#10b981', // emerald-500
  },
  logic: {
    name: 'Logic',
    colour: '#3b82f6', // blue-500
  },
  comparison: {
    name: 'Comparison',
    colour: '#6366f1', // indigo-500
  },
  loops: {
    name: 'Loops',
    colour: '#8b5cf6', // violet-500
  },
  math: {
    name: 'Math',
    colour: '#06b6d4', // cyan-500
  },
  text: {
    name: 'Text',
    colour: '#ec4899', // pink-500
  },
  variables: {
    name: 'Variables',
    colour: '#f59e0b', // amber-500
  },
  actions: {
    name: 'Actions',
    colour: '#ef4444', // red-500
  },
};
