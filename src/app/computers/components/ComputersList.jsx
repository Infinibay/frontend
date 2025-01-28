"use client";

import { cn } from "@/lib/utils";
import { UserPc } from "@/components/ui/user-pc";

export function ComputersList({
  loading,
  error,
  groupedMachines,
  byDepartment,
  grid,
  selectedPc,
  onSelectMachine,
  size,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div>Loading machines...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading machines: {error}
      </div>
    );
  }

  const machineCount = Object.values(groupedMachines).reduce(
    (count, group) => count + (group.machines?.length || group.length || 0),
    0
  );

  if (machineCount === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No machines found
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedMachines).map(([departmentId, departmentData]) => (
        <div key={departmentId} className="space-y-4">
          {byDepartment && (
            <h2 className="text-2xl font-semibold tracking-tight">
              {departmentData.name || "Uncategorized"}
            </h2>
          )}
          <div
            className={cn(
              "grid gap-4",
              grid
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            {(departmentData.machines || departmentData).map((machine) => (
              <UserPc
                key={machine.id}
                pc={machine}
                name={machine.name}
                status={machine.status?.toLowerCase()}
                selected={selectedPc?.id === machine.id}
                onClick={() => onSelectMachine(machine)}
                size={size}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
