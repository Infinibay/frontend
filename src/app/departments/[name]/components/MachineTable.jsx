import React from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { getGlassClasses } from '@/utils/glass-effects';
import { useSizeContext, sizeVariants } from '@/components/ui/size-provider';
import { useAppTheme } from '@/contexts/ThemeProvider';

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

  // Get theme-aware status colors with WCAG 4.5:1 compliance
  const getStatusColors = (status) => {
    const colors = {
      running: "bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border-emerald-500/30 ring-1 ring-emerald-600/40",
      paused: "bg-amber-500/30 text-amber-800 dark:text-amber-200 border-amber-500/30 ring-1 ring-amber-600/40",
      stopped: "bg-red-500/30 text-red-800 dark:text-red-200 border-red-500/30 ring-1 ring-red-600/40"
    };
    return colors[status] || colors.stopped;
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
              className="border-b border-glass-border hover:bg-glass-surface/30 transition-colors"
            >
              <td className="px-4 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePcSelect(machine)}
                >
                  <span className="font-medium text-glass-text-primary">
                    {machine.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-glass-text-secondary">
                {machine.user?.name || 'No user'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs border",
                    getStatusColors(machine.status)
                  )}
                >
                  {machine.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {machine.status !== "running" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(machine)}
                    >
                      Start
                    </Button>
                  )}
                  {machine.status === "running" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePause(machine)}
                    >
                      Pause
                    </Button>
                  )}
                  {machine.status === "running" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStop(machine)}
                    >
                      Stop
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(machine.id)}
                  >
                    Delete
                  </Button>
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
