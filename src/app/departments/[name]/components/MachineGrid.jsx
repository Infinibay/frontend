import React from "react";
import { UserPc } from "@/components/ui/user-pc";
import { getGlassClasses } from '@/utils/glass-effects';
import { useSizeContext, sizeVariants, getGridClasses } from '@/components/ui/size-provider';
import { cn } from '@/lib/utils';

/**
 * Flexible grid view for displaying machines
 * Uses a flex layout that automatically adjusts based on available space
 */
const MachineGrid = ({
  machines,
  onSelect,
  onPlay,
  onPause,
  onStop,
  onDelete,
  size,
  departmentName
}) => {
  const { size: contextSize } = useSizeContext();
  const effectiveSize = size || contextSize;

  return (
    <div className={cn(
      getGridClasses('computers', effectiveSize),
      "justify-start gap-4"
    )}>
      {machines.map((machine) => (
        <UserPc
          key={machine.id}
          pc={machine}
          departmentName={departmentName}
          onSelect={() => onSelect(machine)}
          onPlay={() => onPlay(machine)}
          onPause={() => onPause(machine)}
          onStop={() => onStop(machine)}
          onDelete={() => onDelete(machine.id)}
          size={effectiveSize}
        />
      ))}
    </div>
  );
};

export default MachineGrid;
