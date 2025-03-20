import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  handleToggleProvide
}) => {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className="font-medium">VM Configuration</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="enable-all-use" 
                checked={enableAllToUse}
                onCheckedChange={setEnableAllToUse}
              />
              <label htmlFor="enable-all-use" className="text-sm cursor-pointer flex items-center">
                <Download className="h-3 w-3 mr-1" />
                Enable all VMs to use
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="enable-all-provide" 
                checked={enableAllToProvide}
                onCheckedChange={setEnableAllToProvide}
              />
              <label htmlFor="enable-all-provide" className="text-sm cursor-pointer flex items-center">
                <Upload className="h-3 w-3 mr-1" />
                Enable all VMs to provide
              </label>
            </div>
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-blue-50 dark:bg-blue-900/20">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-sm">Computer</th>
            <th className="px-4 py-3 text-center font-medium text-sm">
              <div className="flex items-center justify-center gap-1">
                <Download className="h-3 w-3" />
                Use {selectedService}
              </div>
            </th>
            <th className="px-4 py-3 text-center font-medium text-sm">
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
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  {vm.name}
                </div>
              </td>
              {/* Use Service Toggle */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium mr-2">
                    {isVmEnabledToUse(vm.id) ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </span>
                  <Switch 
                    checked={isVmEnabledToUse(vm.id)} 
                    onCheckedChange={() => handleToggleUse(vm.id)}
                    disabled={enableAllToUse}
                    className={enableAllToUse ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
              </td>
              {/* Provide Service Toggle */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium mr-2">
                    {isVmEnabledToProvide(vm.id) ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </span>
                  <Switch 
                    checked={isVmEnabledToProvide(vm.id)} 
                    onCheckedChange={() => handleToggleProvide(vm.id)}
                    disabled={enableAllToProvide}
                    className={enableAllToProvide ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VmConfigTable;
