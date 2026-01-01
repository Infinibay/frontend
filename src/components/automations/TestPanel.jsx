'use client';

/**
 * TestPanel Component
 *
 * Test automation against a VM or mock context.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useTestAutomationMutation,
  useTestAutomationWithContextMutation,
  useMachinesQuery,
} from '@/gql/hooks';
import {
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Monitor,
  Code,
} from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_CONTEXT = {
  metrics: {
    cpuUsagePercent: 45,
    usedMemoryKB: 8000000,
    totalMemoryKB: 16000000,
  },
  disks: [
    { drive: 'C:', usedBytes: 100000000000, totalBytes: 500000000000 },
  ],
  defender: {
    isEnabled: true,
    threatCount: 0,
    lastScanDate: new Date().toISOString(),
  },
  updates: {
    pendingCount: 3,
    daysSinceLastUpdate: 7,
  },
  processes: [
    { name: 'chrome', cpuPercent: 15 },
    { name: 'code', cpuPercent: 8 },
  ],
};

export function TestPanel({ automationId }) {
  const [testMode, setTestMode] = useState('vm'); // 'vm' | 'context'
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [contextJson, setContextJson] = useState(
    JSON.stringify(DEFAULT_CONTEXT, null, 2)
  );
  const [result, setResult] = useState(null);

  const { data: machinesData } = useMachinesQuery();

  const [testWithVm, { loading: testingVm }] = useTestAutomationMutation({
    onCompleted: (data) => {
      setResult(data.testAutomation);
      if (data.testAutomation.evaluationResult) {
        toast.success('Automation would trigger!');
      } else {
        toast.info('Automation would NOT trigger');
      }
    },
    onError: (error) => {
      setResult({ error: error.message });
      toast.error('Test failed', { description: error.message });
    },
  });

  const [testWithContext, { loading: testingContext }] = useTestAutomationWithContextMutation({
    onCompleted: (data) => {
      setResult(data.testAutomationWithContext);
      if (data.testAutomationWithContext.evaluationResult) {
        toast.success('Automation would trigger!');
      } else {
        toast.info('Automation would NOT trigger');
      }
    },
    onError: (error) => {
      setResult({ error: error.message });
      toast.error('Test failed', { description: error.message });
    },
  });

  const machines = machinesData?.machines || [];
  const loading = testingVm || testingContext;

  const handleTest = async () => {
    setResult(null);

    if (testMode === 'vm') {
      if (!selectedMachineId) {
        toast.error('Please select a VM');
        return;
      }
      await testWithVm({
        variables: {
          automationId,
          machineId: selectedMachineId,
        },
      });
    } else {
      try {
        const context = JSON.parse(contextJson);
        await testWithContext({
          variables: {
            automationId,
            context,
          },
        });
      } catch (e) {
        toast.error('Invalid JSON context');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Automation</CardTitle>
          <CardDescription>
            Run a test to see if your automation would trigger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={testMode} onValueChange={setTestMode}>
            <TabsList className="mb-4">
              <TabsTrigger value="vm" className="gap-2">
                <Monitor className="h-4 w-4" />
                Test with VM
              </TabsTrigger>
              <TabsTrigger value="context" className="gap-2">
                <Code className="h-4 w-4" />
                Test with Mock Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vm" className="space-y-4">
              <div className="space-y-2">
                <Label>Select a VM</Label>
                <Select
                  value={selectedMachineId}
                  onValueChange={setSelectedMachineId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a VM to test against" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              machine.status === 'RUNNING'
                                ? 'bg-green-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {machine.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The automation will be evaluated using the VM&apos;s current health data.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="context" className="space-y-4">
              <div className="space-y-2">
                <Label>Mock Context (JSON)</Label>
                <Textarea
                  value={contextJson}
                  onChange={(e) => setContextJson(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Edit the JSON to simulate different health conditions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setContextJson(JSON.stringify(DEFAULT_CONTEXT, null, 2))
                }
              >
                Reset to Default
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={handleTest} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.error ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Test Error
                </>
              ) : result.evaluationResult ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Would Trigger
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-slate-500" />
                  Would NOT Trigger
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <pre className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-sm text-red-600 dark:text-red-400 overflow-auto">
                {result.error}
              </pre>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Result</p>
                  <Badge
                    variant={result.evaluationResult ? 'default' : 'secondary'}
                  >
                    {result.evaluationResult
                      ? 'Automation would trigger'
                      : 'Conditions not met'}
                  </Badge>
                </div>

                {result.executionTime && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Execution Time
                    </p>
                    <p className="font-medium">{result.executionTime}ms</p>
                  </div>
                )}

                {result.logs && result.logs.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Logs</p>
                    <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto">
                      {result.logs.join('\n')}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TestPanel;
