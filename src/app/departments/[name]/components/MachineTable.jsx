import React from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

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
  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1 text-xs">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th 
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name {renderSortIcon("name")}
              </div>
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("username")}
            >
              <div className="flex items-center">
                User {renderSortIcon("username")}
              </div>
            </th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr 
              key={machine.id} 
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePcSelect(machine)}
                >
                  <span className="font-medium">{machine.name}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                {machine.user?.name || 'No user'}
              </td>
              <td className="px-4 py-2">
                <span 
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    machine.status === "running" && "bg-green-100 text-green-800",
                    machine.status === "paused" && "bg-yellow-100 text-yellow-800",
                    machine.status === "stopped" && "bg-red-100 text-red-800"
                  )}
                >
                  {machine.status}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex items-center justify-end space-x-2">
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
                    onClick={() => handleDelete(machine.vmId)}
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
