'use client';

/**
 * ScriptLinker Component
 *
 * Links scripts (regular or system) to an automation for remediation.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  useGetAutomationQuery,
  useScriptsQuery,
  useSystemScriptsQuery,
  useLinkScriptToAutomationMutation,
  useUnlinkScriptFromAutomationMutation,
} from '@/gql/hooks';
import { Plus, Trash2, Terminal, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ScriptLinker({ automationId }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedScriptType, setSelectedScriptType] = useState('regular'); // 'regular' | 'system'
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [selectedOS, setSelectedOS] = useState('WINDOWS');
  const [executeOnTrigger, setExecuteOnTrigger] = useState(true);

  // Queries
  const { data: automationData, refetch } = useGetAutomationQuery({
    variables: { id: automationId },
  });

  const { data: scriptsData } = useScriptsQuery();
  const { data: systemScriptsData } = useSystemScriptsQuery();

  // Mutations
  const [linkScript, { loading: linking }] = useLinkScriptToAutomationMutation({
    onCompleted: () => {
      toast.success('Script linked');
      setShowAddDialog(false);
      setSelectedScriptId('');
      refetch();
    },
    onError: (error) => {
      toast.error('Error linking script', { description: error.message });
    },
  });

  const [unlinkScript, { loading: unlinking }] = useUnlinkScriptFromAutomationMutation({
    onCompleted: () => {
      toast.success('Script unlinked');
      refetch();
    },
    onError: (error) => {
      toast.error('Error unlinking script', { description: error.message });
    },
  });

  const automation = automationData?.automation;
  const linkedScripts = automation?.scripts || [];
  const regularScripts = scriptsData?.scripts || [];
  const systemScripts = systemScriptsData?.systemScripts || [];

  const handleLink = async () => {
    await linkScript({
      variables: {
        input: {
          automationId,
          os: selectedOS,
          scriptId: selectedScriptType === 'regular' ? selectedScriptId : undefined,
          systemScriptId: selectedScriptType === 'system' ? selectedScriptId : undefined,
          executeOnTrigger,
          executionOrder: linkedScripts.length + 1,
        },
      },
    });
  };

  const handleUnlink = async (automationScript) => {
    await unlinkScript({
      variables: {
        automationId,
        os: automationScript.os,
        scriptId: automationScript.script?.id,
        systemScriptId: automationScript.systemScript?.id,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linked Scripts</CardTitle>
              <CardDescription>
                Scripts that run when this automation triggers
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Link Script
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link a Script</DialogTitle>
                  <DialogDescription>
                    Choose a script to run when this automation triggers.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Script Type</Label>
                    <Select
                      value={selectedScriptType}
                      onValueChange={setSelectedScriptType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            Regular Script
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            System Script
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Operating System</Label>
                    <Select value={selectedOS} onValueChange={setSelectedOS}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WINDOWS">Windows</SelectItem>
                        <SelectItem value="LINUX">Linux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Script</Label>
                    <Select
                      value={selectedScriptId}
                      onValueChange={setSelectedScriptId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a script" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedScriptType === 'regular'
                          ? regularScripts.map((script) => (
                              <SelectItem key={script.id} value={script.id}>
                                {script.name}
                              </SelectItem>
                            ))
                          : systemScripts.map((script) => (
                              <SelectItem key={script.id} value={script.id}>
                                {script.displayName}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="executeOnTrigger"
                      checked={executeOnTrigger}
                      onCheckedChange={setExecuteOnTrigger}
                    />
                    <Label htmlFor="executeOnTrigger">
                      Execute automatically when triggered
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLink}
                    disabled={!selectedScriptId || linking}
                  >
                    {linking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Linking...
                      </>
                    ) : (
                      'Link Script'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {linkedScripts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Terminal className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No scripts linked yet.</p>
              <p className="text-sm">
                Link a script to run when this automation triggers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedScripts.map((as, index) => (
                <div
                  key={as.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {as.script?.name || as.systemScript?.displayName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {as.os}
                        </Badge>
                        {as.systemScript && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            System
                          </Badge>
                        )}
                        {as.executeOnTrigger && (
                          <span className="text-green-600">Auto-execute</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUnlink(as)}
                    disabled={unlinking}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ScriptLinker;
