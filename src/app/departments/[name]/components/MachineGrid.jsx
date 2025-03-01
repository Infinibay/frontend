import React from "react";
import { UserPc } from "@/components/ui/user-pc";

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
  size 
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {machines.map((machine) => (
        <UserPc
          key={machine.id}
          pc={machine}
          onSelect={() => onSelect(machine)}
          onPlay={() => onPlay(machine)}
          onPause={() => onPause(machine)}
          onStop={() => onStop(machine)}
          onDelete={() => onDelete(machine.id)}
          size={size}
        />
      ))}
    </div>
  );
};

export default MachineGrid;
