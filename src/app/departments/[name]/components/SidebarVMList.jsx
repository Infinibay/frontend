import React from 'react';
import { cn } from "@/lib/utils";
import { VM_STATES, getStatusBgClass, BUSY_STATES } from "@/constants/vmStates";

/**
 * SidebarVMList Component
 * Displays a list of virtual machines in the sidebar
 * 
 * @param {Object} props
 * @param {Array} props.machines - List of VMs to display
 * @param {Object} props.menuStyles - Styling options for the menu items
 */
const SidebarVMList = ({ machines = [], menuStyles = {} }) => {
  if (!machines || machines.length === 0) {
    return (
      <div className="px-3 py-2 text-white/60 text-sm italic text-center">
        No virtual machines available
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto pr-1 space-y-1">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className={cn(
            "px-3 py-2 text-white/80 hover:text-white text-sm",
            "flex items-center gap-2 rounded-md",
            "transition-colors duration-200 hover:bg-white/10"
          )}
        >
          {/* Status indicator */}
          <div className="relative">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full flex-shrink-0",
              getStatusBgClass(machine.status || machine.state)
            )} />
            {(machine.status || machine.state) === VM_STATES.RUNNING && (
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping bg-green-400/50"
                   style={{ animationDuration: '2s' }} />
            )}
            {BUSY_STATES.includes(machine.status || machine.state) && (
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-pulse bg-blue-400/50" />
            )}
          </div>
          
          {/* Machine name */}
          <span className="truncate">{machine.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarVMList;
