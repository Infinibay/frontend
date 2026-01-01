'use client';

/**
 * BlocklyEditor Component
 *
 * Visual block-based editor for creating automation rules.
 * Supports both visual editing and code preview modes.
 */

import { useRef, useState, useCallback, useMemo } from 'react';
import { useBlockly } from './useBlockly';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Code,
  Blocks,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './styles.css';

/**
 * Build toolbox configuration from backend categories.
 * @param {Array} categories - Categories from backend
 * @returns {Object} Blockly toolbox config
 */
function buildToolboxConfig(categories) {
  if (!categories || categories.length === 0) {
    // Default toolbox if no backend config
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Health Data',
          colour: '#10b981',
          contents: [
            // CPU
            { kind: 'block', type: 'health_cpu_usage' },
            { kind: 'block', type: 'health_cpu_core_usage' },
            { kind: 'block', type: 'health_cpu_temperature' },
            // Memory
            { kind: 'block', type: 'health_memory_usage' },
            { kind: 'block', type: 'health_memory_available_gb' },
            { kind: 'block', type: 'health_swap_usage' },
            // Disk
            { kind: 'block', type: 'health_disk_usage' },
            { kind: 'block', type: 'health_disk_free_gb' },
            { kind: 'block', type: 'health_disk_total_gb' },
            { kind: 'block', type: 'health_all_disks' },
            // Process
            { kind: 'block', type: 'health_process_running' },
            { kind: 'block', type: 'health_process_cpu' },
            { kind: 'block', type: 'health_process_memory' },
            { kind: 'block', type: 'health_high_cpu_processes' },
            { kind: 'block', type: 'health_high_memory_processes' },
            { kind: 'block', type: 'health_process_count' },
            // Defender
            { kind: 'block', type: 'health_defender_enabled' },
            { kind: 'block', type: 'health_defender_realtime' },
            { kind: 'block', type: 'health_defender_threats' },
            { kind: 'block', type: 'health_defender_last_scan_days' },
            // Updates
            { kind: 'block', type: 'health_pending_updates' },
            { kind: 'block', type: 'health_updates_critical' },
            { kind: 'block', type: 'health_days_since_update' },
            // System
            { kind: 'block', type: 'health_uptime_hours' },
            { kind: 'block', type: 'health_vm_name' },
            // Network
            { kind: 'block', type: 'health_blocked_connections' },
            { kind: 'block', type: 'health_blocked_connections_count' },
          ],
        },
        {
          kind: 'category',
          name: 'Logic',
          colour: '#3b82f6',
          contents: [
            { kind: 'block', type: 'logic_and' },
            { kind: 'block', type: 'logic_or' },
            { kind: 'block', type: 'logic_not' },
            { kind: 'block', type: 'logic_true' },
            { kind: 'block', type: 'logic_false' },
            { kind: 'block', type: 'logic_if' },
            { kind: 'block', type: 'logic_if_else' },
          ],
        },
        {
          kind: 'category',
          name: 'Comparison',
          colour: '#6366f1',
          contents: [
            { kind: 'block', type: 'comparison_number' },
            { kind: 'block', type: 'comparison_between' },
            { kind: 'block', type: 'comparison_text' },
            { kind: 'block', type: 'comparison_is_empty' },
            // Arrays
            { kind: 'block', type: 'array_is_empty' },
            { kind: 'block', type: 'array_length' },
            { kind: 'block', type: 'array_contains' },
          ],
        },
        {
          kind: 'category',
          name: 'Loops',
          colour: '#8b5cf6',
          contents: [
            { kind: 'block', type: 'loops_foreach' },
            { kind: 'block', type: 'loops_repeat' },
            { kind: 'block', type: 'loops_while' },
            { kind: 'block', type: 'loops_break' },
            { kind: 'block', type: 'loops_continue' },
            { kind: 'block', type: 'loops_array_length' },
            { kind: 'block', type: 'loops_array_get' },
          ],
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '#06b6d4',
          contents: [
            { kind: 'block', type: 'math_number' },
            { kind: 'block', type: 'math_arithmetic' },
            { kind: 'block', type: 'math_sum' },
            { kind: 'block', type: 'math_average' },
            { kind: 'block', type: 'math_minmax' },
            { kind: 'block', type: 'math_round' },
            { kind: 'block', type: 'math_abs' },
            { kind: 'block', type: 'math_modulo' },
          ],
        },
        {
          kind: 'category',
          name: 'Text',
          colour: '#ec4899',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_join' },
            { kind: 'block', type: 'text_length' },
            { kind: 'block', type: 'text_contains' },
            { kind: 'block', type: 'text_starts_with' },
            { kind: 'block', type: 'text_ends_with' },
            { kind: 'block', type: 'text_uppercase' },
            { kind: 'block', type: 'text_lowercase' },
          ],
        },
        {
          kind: 'category',
          name: 'Variables',
          colour: '#f59e0b',
          contents: [
            { kind: 'block', type: 'variables_set' },
            { kind: 'block', type: 'variables_get' },
            { kind: 'block', type: 'variables_change' },
            { kind: 'block', type: 'variables_increment' },
            { kind: 'block', type: 'variables_decrement' },
          ],
        },
        {
          kind: 'category',
          name: 'Actions',
          colour: '#ef4444',
          contents: [
            { kind: 'block', type: 'actions_trigger' },
            { kind: 'block', type: 'actions_skip' },
            { kind: 'block', type: 'actions_set_severity' },
            { kind: 'block', type: 'actions_set_message' },
            { kind: 'block', type: 'actions_trigger_with_severity' },
            { kind: 'block', type: 'actions_log' },
          ],
        },
      ],
    };
  }

  return {
    kind: 'categoryToolbox',
    contents: categories.map((category) => ({
      kind: 'category',
      name: category.name,
      colour: category.colour,
      contents: category.blocks.map((block) => ({
        kind: 'block',
        type: block.type,
      })),
    })),
  };
}

export function BlocklyEditor({
  initialWorkspace,
  toolboxCategories,
  onChange,
  onCodeGenerated,
  readOnly = false,
  className,
  height = '600px',
}) {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('visual');

  // Build toolbox config
  const toolboxConfig = useMemo(
    () => buildToolboxConfig(toolboxCategories),
    [toolboxCategories]
  );

  // Handle workspace changes
  const handleChange = useCallback(
    ({ workspace, code }) => {
      onChange?.(workspace);
      onCodeGenerated?.(code);
    },
    [onChange, onCodeGenerated]
  );

  // Initialize Blockly
  const {
    isReady,
    generatedCode,
    undo,
    redo,
    zoomIn,
    zoomOut,
    zoomReset,
    clear,
  } = useBlockly({
    containerRef,
    toolboxConfig,
    initialWorkspace,
    onChange: handleChange,
    readOnly,
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Header with tabs and controls */}
        <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30">
          <TabsList className="h-9">
            <TabsTrigger value="visual" className="gap-2 text-sm">
              <Blocks className="h-4 w-4" />
              Visual Editor
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2 text-sm">
              <Code className="h-4 w-4" />
              Generated Code
            </TabsTrigger>
          </TabsList>

          {/* Toolbar */}
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={300}>
              {!readOnly && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={undo}
                        disabled={!isReady}
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={redo}
                        disabled={!isReady}
                      >
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>

                  <div className="w-px h-5 bg-border mx-1" />
                </>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={zoomOut}
                    disabled={!isReady}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={zoomReset}
                    disabled={!isReady}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Zoom</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={zoomIn}
                    disabled={!isReady}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>

              {!readOnly && (
                <>
                  <div className="w-px h-5 bg-border mx-1" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={clear}
                        disabled={!isReady}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear All</TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* Visual Editor */}
        <TabsContent value="visual" className="m-0">
          <div
            ref={containerRef}
            className="blockly-workspace w-full"
            style={{ height }}
          />
        </TabsContent>

        {/* Code Preview */}
        <TabsContent value="code" className="m-0">
          <div
            className="overflow-auto bg-slate-900 p-4"
            style={{ height }}
          >
            <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap">
              <code>
                {generatedCode || '// Create blocks in the visual editor to generate code'}
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default BlocklyEditor;
