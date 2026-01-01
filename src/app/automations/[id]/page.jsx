'use client';

/**
 * Automation Editor Page
 *
 * Full-featured editor for creating and editing automations.
 * Supports visual block editing, settings configuration, script linking, testing, and history.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlocklyEditor } from '@/components/automations/BlocklyEditor';
import { AutomationForm } from '@/components/automations/AutomationForm';
import { AutomationPreview } from '@/components/automations/AutomationPreview';
import { ScriptLinker } from '@/components/automations/ScriptLinker';
import { ExecutionHistory } from '@/components/automations/ExecutionHistory';
import { TestPanel } from '@/components/automations/TestPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePageHeader } from '@/hooks/usePageHeader';
import { usePageHelp } from '@/hooks/usePageHelp';
import { toast } from 'sonner';
import {
  useGetAutomationQuery,
  useUpdateAutomationMutation,
  useCreateAutomationMutation,
  useCompileAutomationMutation,
  useSubmitAutomationForApprovalMutation,
  useEnableAutomationMutation,
  useDisableAutomationMutation,
  useBlocklyToolboxQuery,
} from '@/gql/hooks';
import {
  Blocks,
  Settings,
  Link2,
  History,
  Play,
  Power,
  PowerOff,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AutomationEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [activeTab, setActiveTab] = useState('editor');
  const [workspace, setWorkspace] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // QUERIES AND MUTATIONS
  // ═══════════════════════════════════════════════════════════════

  const { data: toolboxData } = useBlocklyToolboxQuery();

  const { data, loading, refetch } = useGetAutomationQuery({
    variables: { id },
    skip: isNew,
  });

  const [createAutomation, { loading: creating }] = useCreateAutomationMutation({
    onCompleted: (result) => {
      const newId = result.createAutomation.id;
      router.replace(`/automations/${newId}`);
      toast.success('Automation created');
      setHasChanges(false);
    },
    onError: (error) => {
      toast.error('Error creating automation', { description: error.message });
    },
  });

  const [updateAutomation, { loading: updating }] = useUpdateAutomationMutation({
    onCompleted: () => {
      toast.success('Automation saved');
      setHasChanges(false);
      refetch();
    },
    onError: (error) => {
      toast.error('Error saving automation', { description: error.message });
    },
  });

  const [compileAutomation, { loading: compiling }] = useCompileAutomationMutation({
    onCompleted: () => {
      toast.success('Automation compiled successfully');
      refetch();
    },
    onError: (error) => {
      toast.error('Compilation failed', { description: error.message });
    },
  });

  const [submitForApproval, { loading: submitting }] = useSubmitAutomationForApprovalMutation({
    onCompleted: () => {
      toast.success('Submitted for approval');
      setShowSubmitDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error('Submission failed', { description: error.message });
    },
  });

  const [enableAutomation] = useEnableAutomationMutation({
    onCompleted: () => {
      toast.success('Automation enabled');
      refetch();
    },
    onError: (error) => {
      toast.error('Error enabling automation', { description: error.message });
    },
  });

  const [disableAutomation] = useDisableAutomationMutation({
    onCompleted: () => {
      toast.success('Automation disabled');
      refetch();
    },
    onError: (error) => {
      toast.error('Error disabling automation', { description: error.message });
    },
  });

  const automation = data?.automation;

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleWorkspaceChange = useCallback((newWorkspace) => {
    setWorkspace(newWorkspace);
    setHasChanges(true);
  }, []);

  const handleCodeGenerated = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  const handleSave = async () => {
    if (isNew) {
      await createAutomation({
        variables: {
          input: {
            name: 'New Automation',
            blocklyWorkspace: workspace || {},
          },
        },
      });
    } else {
      await updateAutomation({
        variables: {
          id,
          input: { blocklyWorkspace: workspace },
        },
      });
    }
  };

  const handleCompile = async () => {
    // Save first if there are changes
    if (hasChanges) {
      await handleSave();
    }
    await compileAutomation({ variables: { id } });
  };

  const handleSubmitForApproval = async () => {
    await submitForApproval({ variables: { id } });
  };

  const handleToggleEnabled = async () => {
    if (automation?.isEnabled) {
      await disableAutomation({ variables: { id } });
    } else {
      await enableAutomation({ variables: { id } });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PAGE HEADER
  // ═══════════════════════════════════════════════════════════════

  const actions = useMemo(() => {
    const result = [];

    if (!isNew && automation) {
      // Compile button
      result.push({
        id: 'compile',
        label: 'Compile',
        icon: 'Check',
        variant: 'outline',
        onClick: handleCompile,
        loading: compiling,
        disabled: automation.isCompiled && !hasChanges,
        tooltip: 'Compile automation to verify syntax',
      });

      // Submit for approval (only if draft and compiled)
      if (automation.status === 'DRAFT' && automation.isCompiled) {
        result.push({
          id: 'submit',
          label: 'Submit for Approval',
          icon: 'Send',
          variant: 'outline',
          onClick: () => setShowSubmitDialog(true),
        });
      }

      // Enable/Disable (only if approved)
      if (automation.status === 'APPROVED') {
        result.push({
          id: 'toggle',
          label: automation.isEnabled ? 'Disable' : 'Enable',
          icon: automation.isEnabled ? 'PowerOff' : 'Power',
          variant: automation.isEnabled ? 'outline' : 'default',
          onClick: handleToggleEnabled,
        });
      }
    }

    // Save button
    result.push({
      id: 'save',
      label: 'Save',
      icon: 'Save',
      variant: 'default',
      onClick: handleSave,
      loading: creating || updating,
      disabled: !hasChanges && !isNew,
    });

    return result;
  }, [isNew, automation, hasChanges, compiling, creating, updating]);

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Automations', href: '/automations' },
        {
          label: isNew ? 'New Automation' : automation?.name || 'Loading...',
          isCurrent: true,
        },
      ],
      title: isNew ? 'New Automation' : automation?.name || 'Loading...',
      subtitle: automation?.description
        ? { text: automation.description }
        : undefined,
      actions,
    },
    [isNew, automation, actions]
  );

  // ═══════════════════════════════════════════════════════════════
  // HELP CONFIG
  // ═══════════════════════════════════════════════════════════════

  const helpConfig = useMemo(
    () => ({
      title: 'Automation Editor Help',
      description: 'Build visual automation rules using blocks',
      icon: <Blocks className="h-5 w-5 text-primary" />,
      sections: [
        {
          id: 'editor',
          title: 'Visual Editor',
          icon: <Blocks className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <p>
                Drag blocks from the toolbox on the left to build your automation logic.
              </p>
              <p>
                Connect blocks together to create conditions and actions.
              </p>
            </div>
          ),
        },
        {
          id: 'workflow',
          title: 'Publishing Workflow',
          icon: <Check className="h-4 w-4" />,
          content: (
            <ol className="list-decimal list-inside space-y-1">
              <li>Build your automation logic</li>
              <li>Click &ldquo;Compile&rdquo; to verify syntax</li>
              <li>Test with the Test tab</li>
              <li>Submit for approval</li>
              <li>Once approved, enable to start running</li>
            </ol>
          ),
        },
      ],
      quickTips: [
        'Use Ctrl+Z to undo, Ctrl+Y to redo',
        'Drag blocks to the trash to delete them',
        'Click the code tab to see generated code',
      ],
    }),
    []
  );

  usePageHelp(helpConfig);

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card className="animate-pulse">
          <CardContent className="h-[700px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReadOnly = automation?.status === 'APPROVED' && automation?.isEnabled;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Status indicators */}
      {automation && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={automation.status === 'APPROVED' ? 'default' : 'secondary'}
          >
            {automation.status.replace('_', ' ')}
          </Badge>
          {automation.isEnabled && (
            <Badge variant="outline" className="text-green-600 border-green-500">
              <Power className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          )}
          {automation.isCompiled && (
            <Badge variant="outline" className="text-blue-600 border-blue-500">
              <Check className="h-3 w-3 mr-1" />
              Compiled
            </Badge>
          )}
          {automation.compilationError && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Compilation Error
            </Badge>
          )}
        </div>
      )}

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor" className="gap-2">
            <Blocks className="h-4 w-4" />
            Visual Editor
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="scripts" className="gap-2" disabled={isNew}>
            <Link2 className="h-4 w-4" />
            Scripts
          </TabsTrigger>
          <TabsTrigger
            value="test"
            className="gap-2"
            disabled={isNew || !automation?.isCompiled}
          >
            <Play className="h-4 w-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2" disabled={isNew}>
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4 mt-4">
          <BlocklyEditor
            initialWorkspace={automation?.blocklyWorkspace}
            toolboxCategories={toolboxData?.blocklyToolbox?.categories}
            onChange={handleWorkspaceChange}
            onCodeGenerated={handleCodeGenerated}
            readOnly={isReadOnly}
          />

          {/* Plain language preview */}
          <AutomationPreview code={generatedCode} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <AutomationForm
            automation={automation}
            isNew={isNew}
            onSave={async (formData) => {
              if (isNew) {
                await createAutomation({
                  variables: {
                    input: {
                      ...formData,
                      blocklyWorkspace: workspace || {},
                    },
                  },
                });
              } else {
                await updateAutomation({
                  variables: { id, input: formData },
                });
              }
            }}
            saving={creating || updating}
          />
        </TabsContent>

        <TabsContent value="scripts" className="mt-4">
          <ScriptLinker automationId={id} />
        </TabsContent>

        <TabsContent value="test" className="mt-4">
          <TestPanel automationId={id} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ExecutionHistory automationId={id} />
        </TabsContent>
      </Tabs>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit for Approval?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send your automation to an administrator for review.
              Once approved, you can enable it to start monitoring VMs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitForApproval}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
