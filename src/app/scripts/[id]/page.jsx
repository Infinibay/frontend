'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';
import { toast } from 'sonner';
import {
  FileCode,
  Monitor,
  Server,
  Terminal,
  Plus,
  Trash2,
  Edit,
  Save,
  X as XIcon,
  Copy,
  Settings as SettingsIcon,
  Eye,
  Code2 } from
'lucide-react';
import {
  Page,
  Card,
  Button,
  IconButton,
  Badge,
  TextField,
  Select,
  SegmentedControl,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Spinner,
  FormField,
  TagInput,
  ResponsiveStack,
  ResponsiveGrid,
  EmptyState,
  DataTable,
  PropertyList,
  CodeBlock } from
'@infinibay/harbor';

import {
  useScriptQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation } from
'@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';
import ScriptInputModal from '@/app/scripts/components/ScriptInputModal';
import { parseScriptError } from '@/utils/parseScriptError';

const OS_OPTIONS = [
{
  value: 'windows',
  label:
  <ResponsiveStack direction="row" gap={1} align="center">
        <Monitor size={14} />
        <span>Windows</span>
      </ResponsiveStack>

},
{
  value: 'linux',
  label:
  <ResponsiveStack direction="row" gap={1} align="center">
        <Server size={14} />
        <span>Linux</span>
      </ResponsiveStack>

}];


const SHELL_BY_OS = {
  windows: [
  { value: 'powershell', label: 'PowerShell' },
  { value: 'cmd', label: 'Command Prompt (CMD)' }],

  linux: [
  { value: 'bash', label: 'Bash' },
  { value: 'sh', label: 'SH' }]

};

const INPUT_TYPE_TONES = {
  text: 'info',
  number: 'info',
  boolean: 'purple',
  select: 'success',
  multiselect: 'success'
};

const monacoLanguage = (shell) => {
  switch (shell) {
    case 'powershell':
      return 'powershell';
    case 'bash':
    case 'sh':
      return 'shell';
    case 'cmd':
      return 'bat';
    default:
      return 'powershell';
  }
};

export default function ScriptEditorPage() {
  const params = useParams();
  const router = useRouter();
  const scriptId = params.id;
  const isNew = scriptId === 'new';

  const editorRef = useRef(null);

  const [scriptName, setScriptName] = useState('New Script');
  const [scriptDescription, setScriptDescription] = useState('');
  const [scriptTags, setScriptTags] = useState([]);
  const [scriptInputs, setScriptInputs] = useState([]);
  const [scriptContent, setScriptContent] = useState('# Write your script here\n');
  const [selectedOS, setSelectedOS] = useState('windows');
  const [selectedShell, setSelectedShell] = useState('powershell');
  const [editorLanguage, setEditorLanguage] = useState('powershell');
  const [originalYamlData, setOriginalYamlData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('edit');
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [editingInputIndex, setEditingInputIndex] = useState(null);

  const { data, loading } = useScriptQuery({
    variables: { id: scriptId },
    skip: isNew
  });

  const [createScript, { loading: creating }] = useCreateScriptMutation();
  const [updateScript, { loading: updating }] = useUpdateScriptMutation();

  useEffect(() => {
    if (data?.script?.content) {
      try {
        const parsed = yaml.load(data.script.content);
        setOriginalYamlData(parsed);
        setScriptName(parsed?.name || 'New Script');
        setScriptDescription(parsed?.description || '');
        setScriptTags(data.script.tags || []);
        setScriptContent(parsed?.script || '# Write your script here\n');

        const normalized = (parsed?.inputs || []).map((i) => ({
          ...i,
          type: i.type === 'checkbox' ? 'boolean' : i.type
        }));
        setScriptInputs(normalized);

        const os = Array.isArray(parsed?.os) ?
        parsed.os[0] || 'windows' :
        parsed?.os || 'windows';
        setSelectedOS(os);
        const shell = parsed?.shell || (os === 'linux' ? 'bash' : 'powershell');
        setSelectedShell(shell);
        setEditorLanguage(monacoLanguage(shell));
      } catch (err) {
        toast.error(`Failed to load script: ${err.message || err}`);
      }
    }
  }, [data]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!scriptContent) return;
      try {
        localStorage.setItem(
          `script-draft-${scriptId}`,
          JSON.stringify({
            scriptContent,
            scriptName,
            scriptDescription,
            scriptTags,
            scriptInputs,
            selectedOS,
            selectedShell
          })
        );
      } catch {

        /* localStorage quota — silent */}
    }, 30_000);
    return () => clearInterval(t);
  }, [
  scriptContent,
  scriptName,
  scriptDescription,
  scriptTags,
  scriptInputs,
  selectedOS,
  selectedShell,
  scriptId]
  );

  useEffect(() => {
    if (
    errors.length > 0 &&
    scriptName.trim() &&
    selectedOS &&
    selectedShell &&
    scriptContent.trim())
    {
      setErrors([]);
    }
  }, [scriptName, selectedOS, selectedShell, scriptContent, errors.length]);

  const validate = useCallback(() => {
    const errs = [];
    if (!scriptName.trim()) errs.push({ message: 'Script name is required' });
    if (!selectedOS) errs.push({ message: 'Operating system is required' });
    if (!selectedShell) errs.push({ message: 'Shell type is required' });
    if (!scriptContent.trim()) errs.push({ message: 'Script content cannot be empty' });

    scriptInputs.forEach((input, idx) => {
      if (!input.name?.trim())
      errs.push({ message: `Input #${idx + 1}: name is required` });
      if (!input.label?.trim())
      errs.push({ message: `Input #${idx + 1}: label is required` });
      if (scriptInputs.filter((i) => i.name && i.name === input.name).length > 1) {
        errs.push({ message: `Duplicate input name: "${input.name}"` });
      }
    });

    setErrors(errs);
    return errs.length === 0;
  }, [scriptName, selectedOS, selectedShell, scriptContent, scriptInputs]);

  const handleOSChange = (next) => {
    setSelectedOS(next);
    const shells = SHELL_BY_OS[next] || [];
    if (!shells.find((s) => s.value === selectedShell)) {
      const newShell = shells[0]?.value || 'bash';
      setSelectedShell(newShell);
      setEditorLanguage(monacoLanguage(newShell));
    }
  };
  const handleShellChange = (next) => {
    setSelectedShell(next);
    setEditorLanguage(monacoLanguage(next));
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix validation errors before saving');
      setActiveTab('edit');
      return;
    }
    try {
      const currentContent = editorRef.current ?
      editorRef.current.getValue() :
      scriptContent;
      const yamlData = originalYamlData ? { ...originalYamlData } : {};
      yamlData.name = scriptName;
      yamlData.description = scriptDescription;
      yamlData.os = [selectedOS];
      yamlData.shell = selectedShell;
      if (scriptInputs.length > 0) {
        yamlData.inputs = scriptInputs;
      } else {
        delete yamlData.inputs;
      }
      yamlData.script = currentContent;

      const yamlContent = yaml.dump(yamlData);

      if (isNew) {
        await createScript({
          variables: {
            input: {
              content: yamlContent,
              format: 'YAML',
              name: scriptName,
              tags: scriptTags
            }
          }
        });
        toast.success('Script created');
        router.push('/scripts');
      } else {
        await updateScript({
          variables: {
            input: {
              id: scriptId,
              name: scriptName,
              content: yamlContent,
              tags: scriptTags
            }
          }
        });
        toast.success('Script updated');
      }
      localStorage.removeItem(`script-draft-${scriptId}`);
    } catch (err) {
      const msg = parseScriptError(err, isNew ? 'create' : 'update');
      toast.error(msg);
    }
  };

  const handleCancel = () => router.push('/scripts');

  const openAddInput = () => {
    setEditingInputIndex(null);
    setInputModalOpen(true);
  };
  const openEditInput = (i) => {
    setEditingInputIndex(i);
    setInputModalOpen(true);
  };
  const handleInputSave = (inputData) => {
    if (editingInputIndex !== null) {
      setScriptInputs((prev) => {
        const next = [...prev];
        next[editingInputIndex] = inputData;
        return next;
      });
      toast.success('Input updated');
    } else {
      setScriptInputs((prev) => [...prev, inputData]);
      toast.success('Input added');
    }
  };
  const removeInput = (i) => {
    setScriptInputs((prev) => prev.filter((_, idx) => idx !== i));
    toast.success('Input removed');
  };
  const duplicateInput = (i) => {
    const orig = scriptInputs[i];
    setScriptInputs((prev) => [
    ...prev,
    { ...orig, name: `${orig.name}_copy`, label: `${orig.label} (Copy)` }]
    );
    toast.success('Input duplicated');
  };

  usePageHeader(
    {
      breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Scripts', href: '/scripts' },
      {
        label: isNew ? 'New script' : scriptName || 'Edit script',
        isCurrent: true
      }],

      title: isNew ? 'New script' : 'Edit script',
      backButton: { href: '/scripts', label: 'Scripts' },
      actions: []
    },
    [isNew, scriptName]
  );

  const availableShells = useMemo(
    () => SHELL_BY_OS[selectedOS] || [],
    [selectedOS]
  );

  const inputColumns = useMemo(
    () => [
    {
      id: 'label',
      header: 'Input',
      cell: ({ row }) =>
      <ResponsiveStack direction="col" gap={0}>
            <ResponsiveStack direction="row" gap={2} align="center">
              <Terminal size={14} />
              <span>{row.label || row.name}</span>
            </ResponsiveStack>
            {row.description ? <span>{row.description}</span> : null}
          </ResponsiveStack>

    },
    {
      id: 'name',
      header: 'Variable',
      width: 200,
      cell: ({ row }) => <Badge tone="neutral">{row.name}</Badge>
    },
    {
      id: 'type',
      header: 'Type',
      width: 130,
      align: 'center',
      cell: ({ row }) =>
      <Badge tone={INPUT_TYPE_TONES[row.type] || 'neutral'}>{row.type}</Badge>

    },
    {
      id: 'required',
      header: 'Required',
      width: 110,
      align: 'center',
      cell: ({ row }) =>
      row.required ? <Badge tone="danger">Yes</Badge> : <Badge tone="neutral">No</Badge>
    },
    {
      id: 'actions',
      header: '',
      width: 140,
      align: 'right',
      cell: ({ row }) => {
        const i = scriptInputs.indexOf(row);
        return (
          <ResponsiveStack direction="row" gap={1} justify="end">
              <IconButton
              size="sm"
              variant="ghost"
              label="Edit"
              icon={<Edit size={14} />}
              onClick={() => openEditInput(i)} />
            
              <IconButton
              size="sm"
              variant="ghost"
              label="Duplicate"
              icon={<Copy size={14} />}
              onClick={() => duplicateInput(i)} />
            
              <IconButton
              size="sm"
              variant="ghost"
              label="Remove"
              icon={<Trash2 size={14} />}
              onClick={() => removeInput(i)} />
            
            </ResponsiveStack>);

      }
    }],

    [scriptInputs]
  );

  if (!isNew && loading) {
    return (
      <Page size="xl" gap={6}>
        <Card variant="default">
          <ResponsiveStack direction="row" gap={2} align="center" justify="center">
            <Spinner />
            <span>Loading script…</span>
          </ResponsiveStack>
        </Card>
      </Page>);

  }

  const fileExtension =
  selectedShell === 'powershell' ? 'ps1' : selectedShell === 'cmd' ? 'bat' : 'sh';

  return (
    <Page size="xl" gap={6}>
      <Card
        variant="default"
        leadingIcon={<FileCode size={20} />}
        leadingIconTone="sky"
        title={scriptName || (isNew ? 'New script' : 'Edit script')}
        description="Reusable automation with parametrised inputs, versioned in YAML. Drafts auto-save every 30 s."
        header={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
            variant="secondary"
            size="sm"
            icon={<XIcon size={14} />}
            onClick={handleCancel}>
            
              Cancel
            </Button>
            <Button
            size="sm"
            icon={<Save size={14} />}
            onClick={handleSave}
            loading={creating || updating}
            disabled={creating || updating}>
            
              Save
            </Button>
          </ResponsiveStack>
        } />
      

      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabList>
          <Tab value="edit" icon={<Code2 size={14} />}>
            Edit
          </Tab>
          <Tab value="preview" icon={<Eye size={14} />}>
            Preview
          </Tab>
        </TabList>

        <TabPanel value="edit">
          <ResponsiveStack direction="col" gap={4}>
            <Card
              variant="default"
              leadingIcon={<SettingsIcon size={16} />}
              leadingIconTone="sky"
              title="Metadata"
              description="Name, description, target OS and shell.">
              
              <ResponsiveStack direction="col" gap={4}>
                <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <FormField label="Name" required>
                    <TextField
                      value={scriptName}
                      onChange={(e) => setScriptName(e.target.value)}
                      placeholder="e.g. Rotate logs nightly" />
                    
                  </FormField>
                  <FormField label="Description">
                    <TextField
                      value={scriptDescription}
                      onChange={(e) => setScriptDescription(e.target.value)}
                      placeholder="What does this script do?" />
                    
                  </FormField>
                </ResponsiveGrid>

                <FormField label="Tags" helper="Up to 10 tags. Enter to add.">
                  <TagInput
                    value={scriptTags}
                    onChange={(next) => setScriptTags(next.slice(0, 10))}
                    placeholder="Type a tag, press Enter…" />
                  
                </FormField>

                <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <FormField label="Target OS">
                    <SegmentedControl
                      items={OS_OPTIONS}
                      value={selectedOS}
                      onChange={handleOSChange} />
                    
                  </FormField>
                  <FormField
                    label={
                    <ResponsiveStack direction="row" gap={1} align="center">
                        <Terminal size={14} />
                        <span>Shell</span>
                      </ResponsiveStack>
                    }>
                    
                    <Select
                      value={selectedShell}
                      onChange={handleShellChange}
                      options={availableShells} />
                    
                  </FormField>
                </ResponsiveGrid>
              </ResponsiveStack>
            </Card>

            <Card
              variant="default"
              title="Script inputs"
              description={
              <ResponsiveStack direction="row" gap={1} align="center" wrap>
                  <span>Parameters collected at runtime. Reference with</span>
                  <Badge tone="neutral">{'${{ inputs.name }}'}</Badge>
                </ResponsiveStack>
              }
              header={
              <Button
                size="sm"
                variant="secondary"
                icon={<Plus size={14} />}
                onClick={openAddInput}>
                
                  Add input
                </Button>
              }>
              
              {scriptInputs.length === 0 ?
              <EmptyState
                variant="dashed"
                icon={<Terminal size={24} />}
                title="No inputs defined"
                description="Scripts without inputs run with no extra prompts."
                actions={
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Plus size={14} />}
                  onClick={openAddInput}>
                  
                      Add input
                    </Button>
                } /> :


              <DataTable
                rows={scriptInputs}
                columns={inputColumns}
                rowId={(r) => r.name}
                defaultDensity="compact" />

              }
            </Card>

            <Card
              variant="default"
              leadingIcon={<Code2 size={16} />}
              leadingIconTone="purple"
              title={`${scriptName || 'script'}.${fileExtension}`}
              description={`Monaco editor — ${editorLanguage}`}
              header={<Badge tone="neutral">{editorLanguage}</Badge>}>
              
              <Editor
                height="600px"
                defaultLanguage="powershell"
                language={editorLanguage}
                value={scriptContent}
                onChange={(v) => setScriptContent(v ?? '')}
                theme="vs-dark"
                onMount={(editor) => editorRef.current = editor}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  folding: true,
                  wordWrap: 'on',
                  automaticLayout: true
                }} />
              
            </Card>

            {errors.length > 0 ?
            <Alert
              tone="danger"
              title={`${errors.length} validation error${errors.length === 1 ? '' : 's'}`}>
              
                <ResponsiveStack direction="col" gap={1}>
                  {errors.map((e, i) =>
                <span key={i}>
                      {e.line && e.column ?
                  `Line ${e.line}, column ${e.column}: ${e.message}` :
                  e.message}
                    </span>
                )}
                </ResponsiveStack>
              </Alert> :
            null}
          </ResponsiveStack>
        </TabPanel>

        <TabPanel value="preview">
          <ResponsiveStack direction="col" gap={4}>
            <Card
              variant="default"
              title={scriptName || 'Untitled script'}
              description={scriptDescription || undefined}>
              
              <ResponsiveStack direction="col" gap={4}>
                {scriptTags.length > 0 ?
                <ResponsiveStack direction="row" gap={1} wrap>
                    {scriptTags.map((t) =>
                  <Badge key={t} tone="purple">
                        {t}
                      </Badge>
                  )}
                  </ResponsiveStack> :
                null}

                <PropertyList
                  items={[
                  { label: 'Target OS', value: selectedOS },
                  { label: 'Shell', value: selectedShell }]
                  } />
                
              </ResponsiveStack>
            </Card>

            {scriptInputs.length > 0 ?
            <Card variant="default" title="Inputs">
                <ResponsiveStack direction="col" gap={2}>
                  {scriptInputs.map((input, i) =>
                <Card key={i} variant="default">
                      <ResponsiveStack
                    direction={{ base: 'col', md: 'row' }}
                    gap={2}
                    align={{ base: 'start', md: 'center' }}
                    justify="between">
                    
                        <ResponsiveStack direction="col" gap={1}>
                          <ResponsiveStack direction="row" gap={2} align="center" wrap>
                            <span>{input.label || input.name}</span>
                            {input.required ? <Badge tone="danger">Required</Badge> : null}
                            <Badge tone={INPUT_TYPE_TONES[input.type] || 'neutral'}>
                              {input.type}
                            </Badge>
                          </ResponsiveStack>
                          {input.description ? <span>{input.description}</span> : null}
                          <Badge tone="neutral">
                            {`\${{ inputs.${input.name} }}`}
                          </Badge>
                        </ResponsiveStack>
                        {input.default ?
                    <span>default: {String(input.default)}</span> :
                    null}
                      </ResponsiveStack>
                    </Card>
                )}
                </ResponsiveStack>
              </Card> :
            null}

            <Card variant="default" title="Script content">
              <CodeBlock
                code={scriptContent || '# No content'}
                lang={editorLanguage}
                showLineNumbers />
              
            </Card>
          </ResponsiveStack>
        </TabPanel>
      </Tabs>

      <ScriptInputModal
        open={inputModalOpen}
        onOpenChange={setInputModalOpen}
        input={editingInputIndex !== null ? scriptInputs[editingInputIndex] : null}
        onSave={handleInputSave}
        mode={editingInputIndex !== null ? 'edit' : 'create'} />
      
    </Page>);

}