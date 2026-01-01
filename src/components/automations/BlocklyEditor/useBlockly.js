/**
 * useBlockly Hook
 *
 * Custom hook for managing a Blockly workspace instance.
 * Handles initialization, serialization, code generation, and cleanup.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { registerAllBlocks } from '../blocks';
import { typescriptGenerator } from '../generators/typescriptGenerator';
import { infinibayTheme, infinibayDarkTheme } from './BlocklyTheme';
import { useSafeResolvedTheme } from '@/utils/safe-theme';

/**
 * Hook for managing a Blockly workspace.
 *
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.containerRef - Ref to the container element
 * @param {Object} options.toolboxConfig - Toolbox configuration from backend
 * @param {Object} options.initialWorkspace - Initial workspace JSON
 * @param {Function} options.onChange - Callback when workspace changes
 * @param {boolean} options.readOnly - Whether the workspace is read-only
 * @returns {Object} Workspace state and controls
 */
export function useBlockly({
  containerRef,
  toolboxConfig,
  initialWorkspace,
  onChange,
  readOnly = false,
}) {
  const workspaceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const resolvedTheme = useSafeResolvedTheme();
  const initialLoadDone = useRef(false);

  // Initialize workspace
  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return;
    if (!toolboxConfig) return; // Wait for toolbox config

    // Register all block definitions
    registerAllBlocks();

    // Create workspace configuration
    const config = {
      toolbox: toolboxConfig,
      theme: resolvedTheme === 'dark' ? infinibayDarkTheme : infinibayTheme,
      grid: {
        spacing: 20,
        length: 3,
        colour: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: !readOnly,
      readOnly,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      renderer: 'zelos', // Modern rounded renderer
      sounds: false,
    };

    // Create workspace
    const workspace = Blockly.inject(containerRef.current, config);
    workspaceRef.current = workspace;

    // Load initial workspace if provided
    if (initialWorkspace && Object.keys(initialWorkspace).length > 0) {
      try {
        Blockly.serialization.workspaces.load(initialWorkspace, workspace);
        initialLoadDone.current = true;
      } catch (e) {
        console.error('Failed to load workspace:', e);
      }
    }

    // Listen for changes
    const changeListener = (event) => {
      // Ignore UI events like scrolling and zooming
      if (event.isUiEvent) return;

      // Generate code
      try {
        const code = typescriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code || '// Empty workspace\nreturn false;');
      } catch (e) {
        console.error('Error generating code:', e);
        setGeneratedCode('// Error generating code');
      }

      // Serialize and emit change
      try {
        const json = Blockly.serialization.workspaces.save(workspace);
        onChange?.({ workspace: json, code: generatedCode });
      } catch (e) {
        console.error('Error serializing workspace:', e);
      }
    };

    workspace.addChangeListener(changeListener);
    setIsReady(true);

    // Generate initial code
    if (initialWorkspace) {
      try {
        const code = typescriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code || '// Empty workspace\nreturn false;');
      } catch (e) {
        setGeneratedCode('// Empty workspace\nreturn false;');
      }
    }

    // Cleanup
    return () => {
      workspace.removeChangeListener(changeListener);
      workspace.dispose();
      workspaceRef.current = null;
      setIsReady(false);
    };
  }, [containerRef, toolboxConfig, readOnly]); // Intentionally omit dependencies that shouldn't trigger re-init

  // Update theme when it changes
  useEffect(() => {
    if (!workspaceRef.current) return;
    workspaceRef.current.setTheme(
      resolvedTheme === 'dark' ? infinibayDarkTheme : infinibayTheme
    );
    // Update grid color
    const gridColour = resolvedTheme === 'dark' ? '#374151' : '#e5e7eb';
    workspaceRef.current.options.gridOptions.colour = gridColour;
  }, [resolvedTheme]);

  // Update toolbox when config changes
  useEffect(() => {
    if (!workspaceRef.current || !toolboxConfig) return;
    try {
      workspaceRef.current.updateToolbox(toolboxConfig);
    } catch (e) {
      console.error('Error updating toolbox:', e);
    }
  }, [toolboxConfig]);

  // ═══════════════════════════════════════════════════════════════
  // WORKSPACE CONTROLS
  // ═══════════════════════════════════════════════════════════════

  const undo = useCallback(() => {
    workspaceRef.current?.undo(false);
  }, []);

  const redo = useCallback(() => {
    workspaceRef.current?.undo(true);
  }, []);

  const zoomIn = useCallback(() => {
    workspaceRef.current?.zoomCenter(1);
  }, []);

  const zoomOut = useCallback(() => {
    workspaceRef.current?.zoomCenter(-1);
  }, []);

  const zoomReset = useCallback(() => {
    if (workspaceRef.current) {
      workspaceRef.current.setScale(1);
      workspaceRef.current.scrollCenter();
    }
  }, []);

  const clear = useCallback(() => {
    workspaceRef.current?.clear();
  }, []);

  const getWorkspaceJson = useCallback(() => {
    if (!workspaceRef.current) return null;
    return Blockly.serialization.workspaces.save(workspaceRef.current);
  }, []);

  const loadWorkspace = useCallback((json) => {
    if (!workspaceRef.current) return;
    try {
      Blockly.serialization.workspaces.load(json, workspaceRef.current);
    } catch (e) {
      console.error('Error loading workspace:', e);
    }
  }, []);

  const getCode = useCallback(() => {
    if (!workspaceRef.current) return '';
    try {
      return typescriptGenerator.workspaceToCode(workspaceRef.current);
    } catch (e) {
      console.error('Error generating code:', e);
      return '';
    }
  }, []);

  return {
    workspace: workspaceRef.current,
    isReady,
    generatedCode,
    // Controls
    undo,
    redo,
    zoomIn,
    zoomOut,
    zoomReset,
    clear,
    // Serialization
    getWorkspaceJson,
    loadWorkspace,
    getCode,
  };
}
