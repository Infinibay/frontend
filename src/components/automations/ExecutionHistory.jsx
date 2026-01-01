'use client';

/**
 * ExecutionHistory Component
 *
 * Displays the execution history of an automation.
 */

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetAutomationExecutionsQuery } from '@/gql/hooks';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  PlayCircle,
  SkipForward,
  Loader2,
  Eye,
  RefreshCw,
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: 'text-slate-500', label: 'Pending' },
  EVALUATING: { icon: Loader2, color: 'text-blue-500', label: 'Evaluating' },
  TRIGGERED: { icon: PlayCircle, color: 'text-green-500', label: 'Triggered' },
  EXECUTING_SCRIPT: { icon: Loader2, color: 'text-amber-500', label: 'Executing' },
  COMPLETED: { icon: CheckCircle, color: 'text-green-500', label: 'Completed' },
  FAILED: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
  SKIPPED: { icon: SkipForward, color: 'text-slate-500', label: 'Skipped' },
};

export function ExecutionHistory({ automationId }) {
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data, loading, refetch } = useGetAutomationExecutionsQuery({
    variables: {
      filters: { automationId },
      limit: 50,
      offset: 0,
    },
  });

  const executions = data?.automationExecutions || [];

  const handleViewDetails = (execution) => {
    setSelectedExecution(execution);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>
                Recent executions of this automation
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No executions yet.</p>
              <p className="text-sm">
                Executions will appear here once the automation runs.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>VM</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Triggered</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => {
                  const statusConfig = STATUS_CONFIG[execution.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConfig.icon;
                  const duration = execution.completedAt && execution.triggeredAt
                    ? Math.round(
                        (new Date(execution.completedAt) - new Date(execution.triggeredAt)) / 1000
                      )
                    : null;

                  return (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            className={`h-4 w-4 ${statusConfig.color} ${
                              execution.status === 'EVALUATING' ||
                              execution.status === 'EXECUTING_SCRIPT'
                                ? 'animate-spin'
                                : ''
                            }`}
                          />
                          <span className="text-sm">{statusConfig.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {execution.machine?.name || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {execution.evaluationResult === true ? (
                          <Badge variant="outline" className="text-green-600 border-green-500">
                            Triggered
                          </Badge>
                        ) : execution.evaluationResult === false ? (
                          <Badge variant="outline" className="text-slate-500">
                            Not triggered
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(execution.triggeredAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {duration !== null ? (
                          <span className="text-sm text-muted-foreground">
                            {duration < 1 ? '<1s' : `${duration}s`}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(execution)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
          </DialogHeader>
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedExecution.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VM</p>
                  <p className="font-medium">
                    {selectedExecution.machine?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Triggered At</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedExecution.triggeredAt),
                      'PPpp',
                      { locale: es }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">
                    {selectedExecution.completedAt
                      ? format(
                          new Date(selectedExecution.completedAt),
                          'PPpp',
                          { locale: es }
                        )
                      : '-'}
                  </p>
                </div>
              </div>

              {selectedExecution.triggerReason && (
                <div>
                  <p className="text-sm text-muted-foreground">Trigger Reason</p>
                  <p className="font-medium">{selectedExecution.triggerReason}</p>
                </div>
              )}

              {selectedExecution.error && (
                <div>
                  <p className="text-sm text-muted-foreground">Error</p>
                  <pre className="mt-1 p-3 bg-red-50 dark:bg-red-950 rounded-lg text-sm text-red-600 dark:text-red-400 overflow-auto">
                    {selectedExecution.error}
                  </pre>
                </div>
              )}

              {selectedExecution.contextSnapshot && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Context Snapshot
                  </p>
                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedExecution.contextSnapshot, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExecutionHistory;
