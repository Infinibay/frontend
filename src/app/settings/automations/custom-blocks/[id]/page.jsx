'use client';

/**
 * Custom Block Editor Page
 *
 * Admin interface for creating and editing custom Blockly blocks.
 * Includes generator code editor (Monaco), input definition, and testing.
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';
import {
  useGetCustomBlockQuery,
  useCreateCustomBlockMutation,
  useUpdateCustomBlockMutation,
  useTestCustomBlockMutation,
} from '@/gql/hooks';
import {
  Save,
  Plus,
  Trash2,
  Play,
  Eye,
  Settings,
  Code,
  Puzzle,
  Loader2,
  Lock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Dynamic import for Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Constants
const CATEGORIES = [
  'Health Data',
  'Logic',
  'Comparison',
  'Math',
  'Text',
  'Variables',
  'Actions',
  'Custom',
];

const OUTPUT_TYPES = [
  { value: 'BOOLEAN', label: 'Boolean (true/false)' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'STRING', label: 'Text' },
  { value: 'ARRAY', label: 'List' },
  { value: 'VOID', label: 'None (statement block)' },
];

const INPUT_TYPES = [
  { value: 'Number', label: 'Number' },
  { value: 'String', label: 'Text' },
  { value: 'Boolean', label: 'Boolean' },
];

const CATEGORY_COLOURS = {
  'Health Data': 160,
  Logic: 210,
  Comparison: 230,
  Loops: 120,
  Math: 180,
  Text: 160,
  Variables: 330,
  Actions: 0,
  Custom: 290,
};

const DEFAULT_GENERATOR_CODE = `// Access inputs via block.getFieldValue('INPUT_NAME')
// Return [code, precedence] or just a code string

const value = block.getFieldValue('VALUE');
return [\`context.customFunction(\${value})\`, 0];`;

export default function CustomBlockEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isNew = id === 'new';

  const [activeTab, setActiveTab] = useState('settings');
  const [showDeleteInput, setShowDeleteInput] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    category: 'Custom',
    outputType: 'NUMBER',
    inputs: [],
    generatorCode: DEFAULT_GENERATOR_CODE,
    supportedOS: ['WINDOWS', 'LINUX'],
    isEnabled: true,
  });

  // Test state
  const [testInputs, setTestInputs] = useState({});
  const [testResult, setTestResult] = useState(null);

  // Validation state
  const [nameError, setNameError] = useState('');

  // ═══════════════════════════════════════════════════════════════
  // QUERIES AND MUTATIONS
  // ═══════════════════════════════════════════════════════════════

  const { data, loading, error: queryError } = useGetCustomBlockQuery({
    variables: { id },
    skip: isNew,
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  // Debug: log query result
  useEffect(() => {
    if (!isNew) {
      console.log('Query result - data:', data, 'loading:', loading, 'error:', queryError);
    }
  }, [data, loading, queryError, isNew]);

  const [createBlock, { loading: creating }] = useCreateCustomBlockMutation({
    onCompleted: (result) => {
      toast({ title: 'Block created successfully' });
      router.replace(
        `/settings/automations/custom-blocks/${result.createCustomBlock.id}`
      );
    },
    onError: (err) => {
      toast({
        title: 'Error creating block',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const [updateBlock, { loading: updating }] = useUpdateCustomBlockMutation({
    onCompleted: () => {
      toast({ title: 'Block updated successfully' });
    },
    onError: (err) => {
      toast({
        title: 'Error updating block',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const [testBlock, { loading: testing }] = useTestCustomBlockMutation({
    onCompleted: (result) => {
      setTestResult({ success: true, result: result.testCustomBlock });
    },
    onError: (err) => {
      setTestResult({ success: false, error: err.message });
    },
  });

  const block = data?.customBlock;
  const isBuiltIn = block?.isBuiltIn;

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════

  // Load existing block data
  useEffect(() => {
    if (block) {
      console.log('Loading block data:', JSON.stringify(block, null, 2));
      setFormData({
        name: block.name,
        displayName: block.displayName,
        description: block.description || '',
        category: block.category,
        outputType: block.outputType,
        inputs: block.inputs || [],
        generatorCode: block.generatorCode || DEFAULT_GENERATOR_CODE,
        supportedOS: block.supportedOS || ['WINDOWS', 'LINUX'],
        isEnabled: block.isEnabled,
      });
    }
  }, [block]);

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════

  // Build message0 from inputs
  const message0 = useMemo(() => {
    if (formData.inputs.length === 0) {
      return formData.displayName || 'Custom Block';
    }
    return formData.inputs.reduce((msg, inp, i) => {
      return `${msg} ${inp.label}: %${i + 1}`;
    }, formData.displayName || 'Custom Block');
  }, [formData.displayName, formData.inputs]);

  // Get block color
  const blockColor = useMemo(() => {
    const hue = CATEGORY_COLOURS[formData.category] || 290;
    return `hsl(${hue}, 70%, 40%)`;
  }, [formData.category]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  // Validate block name
  const validateName = (name) => {
    // Trim whitespace
    const trimmedName = (name || '').trim();

    if (!trimmedName) {
      setNameError('Name is required');
      return false;
    }

    // Check format: must start with lowercase letter, only lowercase, numbers, underscores
    const validPattern = /^[a-z][a-z0-9_]*$/;
    if (!validPattern.test(trimmedName)) {
      setNameError(
        'Must start with lowercase letter, contain only lowercase letters, numbers, and underscores'
      );
      return false;
    }

    // Check reserved prefixes
    const reservedPrefixes = [
      'health_',
      'logic_',
      'math_',
      'text_',
      'loop_',
      'action_',
      'compare_',
    ];
    if (reservedPrefixes.some((prefix) => trimmedName.startsWith(prefix))) {
      setNameError('Cannot use reserved prefix');
      return false;
    }

    // Clear error - validation passed
    setNameError('');
    return true;
  };

  // Auto-generate name from display name
  const generateName = (displayName) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .replace(/^(\d)/, '_$1'); // Prefix with _ if starts with number
  };

  // Add input
  const addInput = () => {
    console.log('Adding input, current count:', formData.inputs.length);
    setFormData((f) => ({
      ...f,
      inputs: [
        ...f.inputs,
        {
          name: `input${f.inputs.length + 1}`,
          type: 'Number',
          label: 'Value',
          required: false,
          defaultValue: null,
        },
      ],
    }));
  };

  // Remove input
  const removeInput = (index) => {
    setFormData((f) => ({
      ...f,
      inputs: f.inputs.filter((_, i) => i !== index),
    }));
    setShowDeleteInput(null);
  };

  // Update input
  const updateInput = (index, field, value) => {
    setFormData((f) => ({
      ...f,
      inputs: f.inputs.map((inp, i) =>
        i === index ? { ...inp, [field]: value } : inp
      ),
    }));
  };

  // Move input up/down
  const moveInput = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.inputs.length) return;

    setFormData((f) => {
      const inputs = [...f.inputs];
      [inputs[index], inputs[newIndex]] = [inputs[newIndex], inputs[index]];
      return { ...f, inputs };
    });
  };

  // Handle save
  const handleSave = async () => {
    // DEBUG: Log current form state
    console.log('=== FORM STATE AT SAVE TIME ===');
    console.log('formData:', JSON.stringify(formData, null, 2));

    // Auto-generate name if empty
    let name = formData.name;
    if (!name && formData.displayName) {
      name = generateName(formData.displayName);
      setFormData((f) => ({ ...f, name }));
    }

    if (!validateName(name)) {
      toast({
        title: 'Invalid block name',
        description: nameError,
        variant: 'destructive',
      });
      return;
    }

    if (!formData.displayName) {
      toast({
        title: 'Display name is required',
        variant: 'destructive',
      });
      return;
    }

    // Build block definition
    const blockDefinition = {
      type: name,
      message0,
      colour: CATEGORY_COLOURS[formData.category] || 290,
      tooltip: formData.description || formData.displayName,
      helpUrl: '',
    };

    // Add args0 if there are inputs
    if (formData.inputs.length > 0) {
      blockDefinition.args0 = formData.inputs.map((inp) => ({
        type:
          inp.type === 'Number'
            ? 'field_number'
            : inp.type === 'Boolean'
              ? 'field_checkbox'
              : 'field_input',
        name: inp.name,
        ...(inp.type === 'Number' && { value: inp.defaultValue ?? 0 }),
        ...(inp.type === 'String' && { text: inp.defaultValue ?? '' }),
        ...(inp.type === 'Boolean' && { checked: inp.defaultValue ?? false }),
      }));
    }

    // Set output or statements based on output type
    if (formData.outputType !== 'VOID') {
      blockDefinition.output = formData.outputType;
    } else {
      blockDefinition.previousStatement = null;
      blockDefinition.nextStatement = null;
    }

    const input = {
      name,
      displayName: formData.displayName,
      description: formData.description || null,
      category: formData.category,
      outputType: formData.outputType,
      inputs: formData.inputs,
      generatorCode: formData.generatorCode,
      blockDefinition,
      supportedOS: formData.supportedOS,
    };

    console.log('Saving block with input:', JSON.stringify(input, null, 2));

    if (isNew) {
      await createBlock({ variables: { input } });
    } else {
      // Remove name from update input (cannot change name after creation)
      const { name: _, ...updateInput } = input;
      await updateBlock({
        variables: {
          id,
          input: {
            ...updateInput,
            isEnabled: formData.isEnabled,
          },
        },
      });
    }
  };

  // Handle test
  const handleTest = async () => {
    if (isNew) {
      toast({
        title: 'Save the block first',
        description: 'You need to save the block before testing',
        variant: 'destructive',
      });
      return;
    }

    setTestResult(null);
    await testBlock({
      variables: {
        id,
        sampleInputs: testInputs,
        sampleContext: {},
      },
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // HELP CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  const helpConfig = useMemo(
    () => ({
      title: 'Block Editor Help',
      description: 'Create custom blocks for visual automations',
      icon: <Puzzle className="h-5 w-5 text-primary" />,
      sections: [
        {
          id: 'generator-code',
          title: 'Generator Code',
          icon: <Code className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <p>
                Generator code is TypeScript that runs when the visual editor
                converts blocks to code.
              </p>
              <p>Available methods:</p>
              <ul className="list-disc list-inside text-sm">
                <li>
                  <code>block.getFieldValue(&apos;NAME&apos;)</code> - Get input
                  value
                </li>
              </ul>
              <p className="text-sm">
                Return <code>[code, precedence]</code> or just{' '}
                <code>code</code>
              </p>
            </div>
          ),
        },
        {
          id: 'output-types',
          title: 'Output Types',
          icon: <Settings className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <ul className="list-disc list-inside text-sm">
                <li>
                  <strong>Boolean</strong> - For conditions (true/false)
                </li>
                <li>
                  <strong>Number</strong> - For numeric values
                </li>
                <li>
                  <strong>String</strong> - For text values
                </li>
                <li>
                  <strong>Array</strong> - For lists
                </li>
                <li>
                  <strong>Void</strong> - For action blocks that don&apos;t
                  return a value
                </li>
              </ul>
            </div>
          ),
        },
      ],
      quickTips: [
        'Use lowercase names with underscores (e.g., my_block)',
        'Test your generator code with sample inputs',
        'Choose the correct output type for block connections',
        'Add helpful descriptions for users',
      ],
    }),
    []
  );

  usePageHelp(helpConfig);

  // ═══════════════════════════════════════════════════════════════
  // PAGE HEADER
  // ═══════════════════════════════════════════════════════════════

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Settings', href: '/settings' },
        {
          label: 'Custom Blocks',
          href: '/settings/automations/custom-blocks',
        },
        {
          label: isNew ? 'New Block' : formData.displayName || 'Edit Block',
          isCurrent: true,
        },
      ],
      title: isNew ? 'New Custom Block' : formData.displayName || 'Edit Block',
      subtitle: isBuiltIn
        ? { text: 'Built-in blocks cannot be modified', icon: 'Lock' }
        : undefined,
      actions: isBuiltIn
        ? []
        : [
            {
              id: 'save',
              label: 'Save',
              icon: 'Save',
              variant: 'default',
              onClick: handleSave,
              loading: creating || updating,
            },
          ],
    },
    [router, isNew, formData.displayName, isBuiltIn, creating, updating]
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isNew && !block) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Block not found</h3>
            <Button
              variant="outline"
              onClick={() => router.push('/settings/automations/custom-blocks')}
            >
              Back to Custom Blocks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Built-in warning */}
      {isBuiltIn && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="py-3 flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-500" />
            <span className="text-sm">
              This is a built-in block and cannot be modified. You can view its
              configuration but not save changes.
            </span>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="inputs" className="gap-2">
            <Puzzle className="h-4 w-4" />
            Inputs
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2">
            <Code className="h-4 w-4" />
            Generator Code
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          {!isNew && (
            <TabsTrigger value="test" className="gap-2">
              <Play className="h-4 w-4" />
              Test
            </TabsTrigger>
          )}
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name (ID) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/\s/g, '_');
                      setFormData((f) => ({ ...f, name: value }));
                      // Only validate if user has typed something
                      if (value) {
                        validateName(value);
                      } else {
                        setNameError('');
                      }
                    }}
                    onBlur={() => {
                      // Auto-generate from displayName if empty
                      if (!formData.name && formData.displayName) {
                        const name = generateName(formData.displayName);
                        setFormData((f) => ({ ...f, name }));
                        validateName(name);
                      } else if (formData.name) {
                        validateName(formData.name);
                      }
                    }}
                    placeholder="my_custom_block"
                    disabled={!isNew || isBuiltIn}
                    className={nameError ? 'border-destructive' : ''}
                  />
                  {nameError && (
                    <p className="text-xs text-destructive">{nameError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Lowercase with underscores. Auto-generated from display
                    name if empty.
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    Display Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, displayName: e.target.value }))
                    }
                    placeholder="My Custom Block"
                    disabled={isBuiltIn}
                  />
                  <p className="text-xs text-muted-foreground">
                    User-friendly name shown in the block editor.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    console.log('Description changed to:', e.target.value);
                    setFormData((f) => ({ ...f, description: e.target.value }));
                  }}
                  placeholder="What does this block do?"
                  rows={2}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => {
                      console.log('Category changed to:', v);
                      setFormData((f) => ({ ...f, category: v }));
                    }}
                    disabled={isBuiltIn}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-sm"
                              style={{
                                backgroundColor: `hsl(${CATEGORY_COLOURS[cat]}, 70%, 40%)`,
                              }}
                            />
                            {cat}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Output Type */}
                <div className="space-y-2">
                  <Label htmlFor="outputType">Output Type</Label>
                  <Select
                    value={formData.outputType}
                    onValueChange={(v) =>
                      setFormData((f) => ({ ...f, outputType: v }))
                    }
                    disabled={isBuiltIn}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTPUT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enabled toggle */}
              {!isNew && (
                <div className="flex items-center gap-3">
                  <Switch
                    id="isEnabled"
                    checked={formData.isEnabled}
                    onCheckedChange={(v) =>
                      setFormData((f) => ({ ...f, isEnabled: v }))
                    }
                    disabled={isBuiltIn}
                  />
                  <Label htmlFor="isEnabled">
                    Block is enabled and available in the editor
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inputs Tab */}
        <TabsContent value="inputs" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Input Parameters</CardTitle>
              {!isBuiltIn && (
                <Button variant="outline" size="sm" onClick={addInput}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Input
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {formData.inputs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No inputs defined.</p>
                  <p className="text-sm">
                    This block will be a simple value getter with no parameters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.inputs.map((input, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Input {index + 1}: {input.label}
                        </span>
                        {!isBuiltIn && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveInput(index, 'up')}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveInput(index, 'down')}
                              disabled={index === formData.inputs.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setShowDeleteInput(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Name (ID)</Label>
                          <Input
                            value={input.name}
                            onChange={(e) =>
                              updateInput(index, 'name', e.target.value)
                            }
                            placeholder="input_name"
                            disabled={isBuiltIn}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={input.type}
                            onValueChange={(v) => updateInput(index, 'type', v)}
                            disabled={isBuiltIn}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INPUT_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={input.label}
                            onChange={(e) =>
                              updateInput(index, 'label', e.target.value)
                            }
                            placeholder="Value"
                            disabled={isBuiltIn}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Value</Label>
                          <Input
                            type={input.type === 'Number' ? 'number' : 'text'}
                            value={input.defaultValue ?? ''}
                            onChange={(e) =>
                              updateInput(
                                index,
                                'defaultValue',
                                input.type === 'Number'
                                  ? Number(e.target.value)
                                  : e.target.value
                              )
                            }
                            placeholder={
                              input.type === 'Number' ? '0' : 'default'
                            }
                            disabled={isBuiltIn}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={input.required}
                          onCheckedChange={(v) =>
                            updateInput(index, 'required', v)
                          }
                          disabled={isBuiltIn}
                        />
                        <Label className="text-sm">Required</Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generator Code Tab */}
        <TabsContent value="code" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generator Code (TypeScript)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="400px"
                  language="typescript"
                  theme="vs-dark"
                  value={formData.generatorCode}
                  onChange={(value) => {
                    console.log('Generator code changed, length:', value?.length);
                    setFormData((f) => ({ ...f, generatorCode: value || '' }));
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    readOnly: isBuiltIn,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This code runs when converting visual blocks to TypeScript.
                Return <code className="bg-muted px-1 rounded">[code, precedence]</code>{' '}
                or just a code string.
              </p>
              {formData.inputs.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Available inputs:</p>
                  <ul className="list-disc list-inside">
                    {formData.inputs.map((inp) => (
                      <li key={inp.name}>
                        <code className="bg-muted px-1 rounded">
                          block.getFieldValue(&apos;{inp.name}&apos;)
                        </code>{' '}
                        → {inp.type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Block Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual Preview */}
              <div className="p-8 bg-muted rounded-lg flex items-center justify-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded text-white font-medium shadow-lg"
                  style={{ backgroundColor: blockColor }}
                >
                  {message0}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This is an approximation. The actual block may look slightly
                different in the Blockly editor.
              </p>

              {/* Block Definition JSON */}
              <div className="space-y-2">
                <h4 className="font-medium">Block Definition (JSON)</h4>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                  {JSON.stringify(
                    {
                      type: formData.name || 'custom_block',
                      message0,
                      args0:
                        formData.inputs.length > 0
                          ? formData.inputs.map((inp) => ({
                              type:
                                inp.type === 'Number'
                                  ? 'field_number'
                                  : inp.type === 'Boolean'
                                    ? 'field_checkbox'
                                    : 'field_input',
                              name: inp.name,
                            }))
                          : undefined,
                      output:
                        formData.outputType !== 'VOID'
                          ? formData.outputType
                          : undefined,
                      colour: CATEGORY_COLOURS[formData.category] || 290,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        {!isNew && (
          <TabsContent value="test" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Test Block</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={testing}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Run Test
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Inputs */}
                {formData.inputs.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Sample Inputs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.inputs.map((inp) => (
                        <div key={inp.name} className="space-y-2">
                          <Label>{inp.label}</Label>
                          <Input
                            type={inp.type === 'Number' ? 'number' : 'text'}
                            value={testInputs[inp.name] ?? ''}
                            onChange={(e) =>
                              setTestInputs((t) => ({
                                ...t,
                                [inp.name]:
                                  inp.type === 'Number'
                                    ? Number(e.target.value)
                                    : e.target.value,
                              }))
                            }
                            placeholder={`${inp.type} value`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Result */}
                {testResult && (
                  <div
                    className={`p-4 rounded-lg ${testResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
                  >
                    <p className="font-medium mb-2">
                      {testResult.success ? '✓ Success' : '✗ Error'}
                    </p>
                    <pre className="text-sm overflow-auto">
                      {testResult.success
                        ? JSON.stringify(testResult.result, null, 2)
                        : testResult.error}
                    </pre>
                  </div>
                )}

                {!testResult && formData.inputs.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    This block has no inputs. Click &quot;Run Test&quot; to test
                    the generator code.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Input Dialog */}
      <AlertDialog
        open={showDeleteInput !== null}
        onOpenChange={() => setShowDeleteInput(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Input?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the input parameter from the block definition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeInput(showDeleteInput)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
