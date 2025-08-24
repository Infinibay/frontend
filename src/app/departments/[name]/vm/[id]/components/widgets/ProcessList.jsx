import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import useVMActions from '../../hooks/useVMActions';

const ProcessList = ({ 
  processes = [], 
  loading = false, 
  limit = 5,
  vmId 
}) => {
  const { killProcess } = useVMActions(vmId);

  const handleKillProcess = async (pid, name) => {
    if (window.confirm(`Are you sure you want to kill process "${name}" (PID: ${pid})?`)) {
      try {
        await killProcess(pid);
        toast({
          title: "Process Killed",
          description: `Process ${name} (PID: ${pid}) has been terminated.`,
        });
      } catch (error) {
        toast({
          title: "Failed to kill process",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!processes || processes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No process data available</p>
      </div>
    );
  }

  const displayProcesses = processes.slice(0, limit);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Process</TableHead>
          <TableHead>PID</TableHead>
          <TableHead className="text-right">CPU %</TableHead>
          <TableHead className="text-right">Memory</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayProcesses.map((process) => (
          <TableRow key={process.pid}>
            <TableCell className="font-medium">
              <div>
                <p className="truncate max-w-[200px]" title={process.name}>
                  {process.name}
                </p>
                {process.user && (
                  <p className="text-xs text-muted-foreground">{process.user}</p>
                )}
              </div>
            </TableCell>
            <TableCell>{process.pid}</TableCell>
            <TableCell className="text-right">
              <span className={process.cpuUsage > 50 ? 'text-red-500 font-medium' : ''}>
                {process.cpuUsage?.toFixed(1)}%
              </span>
            </TableCell>
            <TableCell className="text-right">
              {process.memoryMb ? `${process.memoryMb} MB` : 'N/A'}
            </TableCell>
            <TableCell>
              {vmId && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  onClick={() => handleKillProcess(process.pid, process.name)}
                  title="Kill process"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProcessList;