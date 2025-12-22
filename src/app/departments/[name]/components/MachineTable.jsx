import React from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { getGlassClasses } from '@/utils/glass-effects';
import { useSizeContext, sizeVariants } from '@/components/ui/size-provider';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { RotateCwIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  getStatusBadgeColors,
  getStatusLabel,
  isActionAvailable,
  isTransitioning,
  VM_ACTIONS
} from "@/utils/vmStatus";

/**
 * Table view for displaying machines
 */
const MachineTable = ({
  machines,
  sortBy,
  sortDirection,
  handleSort,
  handlePcSelect,
  handlePlay,
  handlePause,
  handleStop,
  handleDelete
}) => {
  const { size } = useSizeContext();
  const { resolvedTheme } = useAppTheme();

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;

    return (
      <span className="ml-1 text-xs text-glass-text-secondary">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };


  return (
    <div className={cn(
      getGlassClasses({ glass: 'subtle', elevation: 2, radius: 'lg' }),
      "p-4 overflow-x-auto"
    )}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-glass-surface/50 border-b border-glass-border">
            <th
              className={cn(
                "px-4 py-3 text-left cursor-pointer text-glass-text-primary font-medium"
              )}
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name {renderSortIcon("name")}
              </div>
            </th>
            <th
              className={cn(
                "px-4 py-3 text-left cursor-pointer text-glass-text-primary font-medium"
              )}
              onClick={() => handleSort("username")}
            >
              <div className="flex items-center">
                User {renderSortIcon("username")}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-glass-text-primary font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-right text-glass-text-primary font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr
              key={machine.id}
              className="border-b border-glass-border hover:bg-glass-surface/50 hover:shadow-sm transition-colors"
            >
              <td className="px-4 py-3">
                <button
                  type="button"
                  className={cn(
                    "flex items-center cursor-pointer text-left",
                    "rounded-md px-2 py-1 -mx-2 -my-1",
                    "hover:bg-glass-surface/70 transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                  )}
                  onClick={() => handlePcSelect(machine)}
                  aria-label={`View details for ${machine.name}`}
                >
                  <span className="font-medium text-glass-text-primary">
                    {machine.name}
                  </span>
                </button>
              </td>
              <td className="px-4 py-3 text-glass-text-secondary">
                {machine.user?.name || 'No user'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs border inline-flex items-center gap-1",
                    getStatusBadgeColors(machine.status)
                  )}
                >
                  {isTransitioning(machine.status) && (
                    <RotateCwIcon className="w-3 h-3 animate-spin" />
                  )}
                  {getStatusLabel(machine.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Start button */}
                  {isActionAvailable(machine.status, VM_ACTIONS.START) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="Start this virtual machine"
                          onClick={() => handlePlay(machine)}
                        >
                          Start
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start this virtual machine</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Resume button */}
                  {isActionAvailable(machine.status, VM_ACTIONS.RESUME) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="Resume this virtual machine"
                          onClick={() => handlePlay(machine)}
                        >
                          Resume
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resume this virtual machine</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Pause button */}
                  {isActionAvailable(machine.status, VM_ACTIONS.PAUSE) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="Pause this virtual machine"
                          onClick={() => handlePause(machine)}
                        >
                          Pause
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pause this virtual machine</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Stop button */}
                  {isActionAvailable(machine.status, VM_ACTIONS.STOP) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="Stop this virtual machine"
                          onClick={() => handleStop(machine)}
                        >
                          Stop
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stop this virtual machine</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Delete button */}
                  {isActionAvailable(machine.status, VM_ACTIONS.DELETE) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          aria-label="Permanently delete this virtual machine"
                          onClick={() => handleDelete(machine.id)}
                        >
                          Delete
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Permanently delete this virtual machine</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;
