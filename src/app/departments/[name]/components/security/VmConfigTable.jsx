import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor, CheckCircle2, AlertTriangle, Download, Upload } from 'lucide-react';

/**
 * VmConfigTable Component
 * Displays a table of VMs with toggles to enable/disable using or providing services
 */
const VmConfigTable = ({ 
  enableAllToUse, 
  setEnableAllToUse,
  enableAllToProvide,
  setEnableAllToProvide,
  mockVms, 
  selectedService, 
  isVmEnabledToUse, 
  isVmEnabledToProvide,
  handleToggleUse,
  handleToggleProvide,
  isLoading = false
}) => {
  if (isLoading && mockVms.length === 0) {
    return (
      <div className="border rounded-md overflow-hidden shadow-sm">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border-b">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">VM Configuration</h4>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="enable-all-use" 
                checked={enableAllToUse}
                onCheckedChange={setEnableAllToUse}
                disabled={isLoading || mockVms.length === 0}
              />
              <label htmlFor="enable-all-use" className="text-sm cursor-pointer flex items-center whitespace-nowrap">
                <Download className="h-3 w-3 mr-1" />
                Enable all VMs to use
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="enable-all-provide" 
                checked={enableAllToProvide}
                onCheckedChange={setEnableAllToProvide}
                disabled={isLoading || mockVms.length === 0}
              />
              <label htmlFor="enable-all-provide" className="text-sm cursor-pointer flex items-center whitespace-nowrap">
                <Upload className="h-3 w-3 mr-1" />
                Enable all VMs to provide
              </label>
            </div>
          </div>
        </div>
      </div>
      {mockVms.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No VMs found in this department
        </div>
      ) : (
        <table className="w-full">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead className="bg-blue-50 dark:bg-blue-900/20">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-sm">Computer</th>
              <th className="px-4 py-3 text-center font-medium text-sm whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <Download className="h-3 w-3" />
                  Use {selectedService}
                </div>
              </th>
              <th className="px-4 py-3 text-center font-medium text-sm whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <Upload className="h-3 w-3" />
                  Provide {selectedService}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockVms.map((vm, index) => (
              <tr key={vm.id} className={`border-t ${index % 2 === 0 ? 'bg-white dark:bg-blue-900/5' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Monitor className={`h-4 w-4 ${vm.running ? 'text-green-500' : 'text-muted-foreground'}`} />
                    {vm.name}
                  </div>
                </td>
                {/* Use Service Toggle */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span className="text-xs font-medium w-14 text-right">
                        {isVmEnabledToUse(vm.id) ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center justify-end">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enabled
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center justify-end">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Disabled
                          </span>
                        )}
                      </span>
                      <Switch 
                        checked={isVmEnabledToUse(vm.id)} 
                        onCheckedChange={() => handleToggleUse(vm.id)}
                        disabled={enableAllToUse || isLoading}
                        className={(enableAllToUse || isLoading) ? "opacity-50 cursor-not-allowed" : ""}
                      />
                    </div>
                  </div>
                </td>
                {/* Provide Service Toggle */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span className="text-xs font-medium w-14 text-right">
                        {isVmEnabledToProvide(vm.id) ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center justify-end">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enabled
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center justify-end">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Disabled
                          </span>
                        )}
                      </span>
                      <Switch 
                        checked={isVmEnabledToProvide(vm.id)} 
                        onCheckedChange={() => handleToggleProvide(vm.id)}
                        disabled={enableAllToProvide || isLoading}
                        className={(enableAllToProvide || isLoading) ? "opacity-50 cursor-not-allowed" : ""}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VmConfigTable;
