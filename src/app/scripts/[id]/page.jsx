'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  Lock,
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
  CodeBlock,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogButtons } from
'@infinibay/harbor';

import {
  useScriptQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation } from
'@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useResolvedTheme } from '@/contexts/ThemeProvider';
import ScriptInputModal from '@/app/scripts/components/ScriptInputModal';
import { parseScriptError } from '@/utils/parseScriptError';

/** Stable serialization of the editable form used for dirty-tracking. */
const snapshotForm = (v) =>
JSON.stringify({
  scriptName: v.scriptName,
  scriptDescription: v.scriptDescription,
  scriptTags: v.scriptTags,
  scriptInputs: v.scriptInputs,
  scriptContent: v.scriptContent,
  selectedOS: v.selectedOS,
  selectedShell: v.selectedShell
});

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
  const searchParams = useSearchParams();
  const scriptId = params.id;
  const isNew = scriptId === 'new';
  // When duplicating, /scripts/new?from=<id> seeds the form from <id>.
  const sourceId = isNew ? searchParams.get('from') : null;
  const queryId = sourceId || scriptId;

  const resolvedTheme = useResolvedTheme();
  const editorTheme = resolvedTheme === 'light' ? 'vs' : 'vs-dark';

  const editorRef = useRef(null);
  // Prevents a background refetch (cache-and-network) from clobbering in-progress
  // edits, and gates Save until the source script has actually hydrated.
  const seededRef = useRef(false);
  const pristineRef = useRef(null);
  const dirtyRef = useRef(false);

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
  const [hydrated, setHydrated] = useState(isNew && !sourceId);
  const [draftToRestore, setDraftToRestore] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const { data, loading, error, refetch } = useScriptQuery({
    variables: { id: queryId },
    skip: isNew && !sourceId
  });

  // System scripts are read-only — but only when editing them in place.
  // When duplicating (isNew + sourceId), the new script is editable.
  const isSystem = !isNew && !!data?.script?.isSystem;
  const readOnly = isSystem;

  const [createScript, { loading: creating }] = useCreateScriptMutation();
  const [updateScript, { loading: updating }] = useUpdateScriptMutation();

  useEffect(() => {
    // Seed exactly once. A cache-and-network refetch fires this effect again with
    // fresh `data`; without this guard it would overwrite the user's live edits.
    if (seededRef.current) return;
    if (data?.script?.content) {
      try {
        const parsed = yaml.load(data.script.content);

        setOriginalYamlData(parsed);
        // When duplicating, suffix the name so the user knows which one they're on
        // and avoids fileName collision on the server side.
        const baseName = parsed?.name || 'New Script';
        const name = sourceId ? `${baseName} (Copy)` : baseName;
        const description = parsed?.description || '';
        const tags = data.script.tags || [];
        const content = parsed?.script || '# Write your script here\n';

        const normalized = (parsed?.inputs || []).map((i) => ({
          ...i,
          type: i.type === 'checkbox' ? 'boolean' : i.type
        }));

        const os = Array.isArray(parsed?.os) ?
        parsed.os[0] || 'windows' :
        parsed?.os || 'windows';
        const shell = parsed?.shell || (os === 'linux' ? 'bash' : 'powershell');

        setScriptName(name);
        setScriptDescription(description);
        setScriptTags(tags);
        setScriptContent(content);
        setScriptInputs(normalized);
        setSelectedOS(os);
        setSelectedShell(shell);
        setEditorLanguage(monacoLanguage(shell));

        seededRef.current = true;
        pristineRef.current = snapshotForm({
          scriptName: name,
          scriptDescription: description,
          scriptTags: tags,
          scriptInputs: normalized,
          scriptContent: content,
          selectedOS: os,
          selectedShell: shell
        });
        setHydrated(true);
      } catch (err) {
        toast.error(`Failed to load script: ${err.message || err}`);
      }
    } else if (data?.script) {
      // Script exists but carries no YAML content — hydrate with what we have so
      // the editor is usable and Save doesn't stay permanently disabled.
      const tags = data.script.tags || [];
      setScriptTags(tags);
      seededRef.current = true;
      pristineRef.current = snapshotForm({
        scriptName,
        scriptDescription,
        scriptTags: tags,
        scriptInputs,
        scriptContent,
        selectedOS,
        selectedShell
      });
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sourceId]);

  // Establish the pristine snapshot for a brand-new (non-duplicate) script so
  // dirty-tracking works from the first keystroke.
  useEffect(() => {
    if (isNew && !sourceId && pristineRef.current === null) {
      pristineRef.current = snapshotForm({
        scriptName,
        scriptDescription,
        scriptTags,
        scriptInputs,
        scriptContent,
        selectedOS,
        selectedShell
      });
    }
    // Run once on mount; initial state is the intended pristine baseline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Offer to restore a locally auto-saved draft (captured once on mount, before
  // the 30s interval writes a fresh one).
  useEffect(() => {
    if (readOnly) return;
    try {
      const raw = localStorage.getItem(`script-draft-${scriptId}`);
      if (raw) setDraftToRestore(JSON.parse(raw));
    } catch {
      /* malformed draft — ignore */
    }
  }, [scriptId, readOnly]);

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
    if (errors.length === 0) return;
    // Only auto-clear the *metadata* errors this effect can actually verify.
    // Input-level errors (missing input name/label, duplicate names) must stay
    // visible until they are genuinely fixed — clearing them here would let the
    // user save an invalid script with no feedback.
    setErrors((prev) => {
      const next = prev.filter((e) => {
        if (e.message === 'Script name is required' && scriptName.trim()) return false;
        if (e.message === 'Operating system is required' && selectedOS) return false;
        if (e.message === 'Shell type is required' && selectedShell) return false;
        if (e.message === 'Script content cannot be empty' && scriptContent.trim())
        return false;
        return true;
      });
      return next.length === prev.length ? prev : next;
    });
  }, [scriptName, selectedOS, selectedShell, scriptContent, errors.length]);

  const isDirty = useCallback(
    () =>
    pristineRef.current !== null &&
    snapshotForm({
      scriptName,
      scriptDescription,
      scriptTags,
      scriptInputs,
      scriptContent,
      selectedOS,
      selectedShell
    }) !== pristineRef.current,
    [
    scriptName,
    scriptDescription,
    scriptTags,
    scriptInputs,
    scriptContent,
    selectedOS,
    selectedShell]

  );

  // Keep a ref in sync so the native beforeunload handler never reads stale state.
  useEffect(() => {
    dirtyRef.current = !readOnly && isDirty();
  });

  useEffect(() => {
    const beforeUnload = (e) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

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

      // Reflect the just-saved content in the pristine baseline so the page is no
      // longer considered dirty (prevents a false unsaved-changes prompt).
      const savedSnapshot = snapshotForm({
        scriptName,
        scriptDescription,
        scriptTags,
        scriptInputs,
        scriptContent: currentContent,
        selectedOS,
        selectedShell
      });

      if (isNew) {
        const res = await createScript({
          variables: {
            input: {
              content: yamlContent,
              format: 'YAML',
              name: scriptName,
              tags: scriptTags
            }
          }
        });
        // These mutations resolve HTTP 200 with a { success, message, error }
        // envelope and do NOT throw on a business-rule failure. Treat
        // success:false as an error and keep the editor open so edits survive.
        const payload = res?.data?.createScript;
        if (!payload?.success) {
          toast.error(payload?.error || payload?.message || 'Failed to create script');
          return;
        }
        localStorage.removeItem(`script-draft-${scriptId}`);
        pristineRef.current = savedSnapshot;
        dirtyRef.current = false;
        toast.success('Script created');
        router.push('/scripts');
      } else {
        const res = await updateScript({
          variables: {
            input: {
              id: scriptId,
              name: scriptName,
              content: yamlContent,
              tags: scriptTags
            }
          }
        });
        const payload = res?.data?.updateScript;
        if (!payload?.success) {
          toast.error(payload?.error || payload?.message || 'Failed to update script');
          return;
        }
        localStorage.removeItem(`script-draft-${scriptId}`);
        pristineRef.current = savedSnapshot;
        dirtyRef.current = false;
        toast.success('Script updated');
      }
    } catch (err) {
      const msg = parseScriptError(err, isNew ? 'create' : 'update');
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (!readOnly && isDirty()) {
      setConfirmLeave(true);
      return;
    }
    router.push('/scripts');
  };

  const restoreDraft = () => {
    const d = draftToRestore;
    if (!d) return;
    const shell = d.selectedShell ?? 'powershell';
    setScriptContent(d.scriptContent ?? '# Write your script here\n');
    setScriptName(d.scriptName ?? 'New Script');
    setScriptDescription(d.scriptDescription ?? '');
    setScriptTags(d.scriptTags ?? []);
    setScriptInputs(d.scriptInputs ?? []);
    setSelectedOS(d.selectedOS ?? 'windows');
    setSelectedShell(shell);
    setEditorLanguage(monacoLanguage(shell));
    setDraftToRestore(null);
    toast.success('Draft restored');
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(`script-draft-${scriptId}`);
    } catch {
      /* ignore */
    }
    setDraftToRestore(null);
  };

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
  const duplicateInput = useCallback((i) => {
    const orig = scriptInputs[i];
    setScriptInputs((prev) => [
    ...prev,
    { ...orig, name: `${orig.name}_copy`, label: `${orig.label} (Copy)` }]
    );
    toast.success('Input duplicated');
  }, [scriptInputs]);

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
    ...(readOnly ? [] : [{
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
    }])],

    [scriptInputs, readOnly, duplicateInput]
  );

  // Show the loading state whenever we're fetching a source script — both when
  // editing (!isNew) and when duplicating (isNew + sourceId) — so the form never
  // renders with defaults that the incoming source would overwrite.
  if ((!isNew || sourceId) && loading && !seededRef.current) {
    return (
      <Page size="xl" gap="lg">
        <Card variant="default">
          <ResponsiveStack direction="row" gap={2} align="center" justify="center">
            <Spinner />
            <span>Loading script…</span>
          </ResponsiveStack>
        </Card>
      </Page>);

  }

  // The fetch resolved but failed (network/auth/deleted id) — never fall back to a
  // blank "New Script" editor whose Save could overwrite the real script. Once the
  // script has hydrated we keep the editor mounted (a later background-refetch
  // error must not discard in-progress edits).
  if ((!isNew || sourceId) && !loading && !seededRef.current && (error || !data?.script)) {
    return (
      <Page size="xl" gap="lg">
        <Alert
          tone="danger"
          title="Couldn't load this script"
          icon={<XIcon size={14} />}
          actions={
          <ResponsiveStack direction="row" gap={2}>
              <Button size="sm" variant="secondary" onClick={() => router.push('/scripts')}>
                Back to scripts
              </Button>
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </ResponsiveStack>
          }>

          {error ?
          String(error.message || error) :
          'This script no longer exists or you do not have access to it.'}
        </Alert>
      </Page>);

  }

  const fileExtension =
  selectedShell === 'powershell' ? 'ps1' : selectedShell === 'cmd' ? 'bat' : 'sh';

  return (
    <Page size="xl" gap="lg">
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

              {readOnly ? 'Back' : 'Cancel'}
            </Button>
            {readOnly ? (
              <Button
              size="sm"
              icon={<Copy size={14} />}
              onClick={() => router.push(`/scripts/new?from=${scriptId}`)}>
                Duplicate to edit
              </Button>
            ) : (
              <Button
              size="sm"
              icon={<Save size={14} />}
              onClick={handleSave}
              loading={creating || updating}
              disabled={creating || updating || !hydrated}>

                Save
              </Button>
            )}
          </ResponsiveStack>
        } />

      {readOnly ? (
        <Alert
          tone="warning"
          title="System script — read-only"
          icon={<Lock size={14} />}
        >
          This script ships with Infinibay and stays in sync with system updates.
          Use <strong>Duplicate to edit</strong> to create your own copy.
        </Alert>
      ) : null}

      {draftToRestore && !readOnly ? (
        <Alert
          tone="info"
          title="Unsaved draft found"
          actions={
          <ResponsiveStack direction="row" gap={2}>
              <Button size="sm" variant="secondary" onClick={discardDraft}>
                Discard
              </Button>
              <Button size="sm" onClick={restoreDraft}>
                Restore draft
              </Button>
            </ResponsiveStack>
          }>

          A locally auto-saved draft of this script exists from a previous session.
          Restore it to continue where you left off, or discard it.
        </Alert>
      ) : null}

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
                      placeholder="e.g. Rotate logs nightly"
                      disabled={readOnly} />

                  </FormField>
                  <FormField label="Description">
                    <TextField
                      value={scriptDescription}
                      onChange={(e) => setScriptDescription(e.target.value)}
                      placeholder="What does this script do?"
                      disabled={readOnly} />

                  </FormField>
                </ResponsiveGrid>

                <FormField
                  label="Tags"
                  helper={readOnly ? undefined : 'Up to 10 tags. Enter to add.'}>

                  {readOnly ?
                  scriptTags.length > 0 ?
                  <ResponsiveStack direction="row" gap={1} wrap>
                        {scriptTags.map((t) =>
                    <Badge key={t} tone="neutral">
                            {t}
                          </Badge>
                    )}
                      </ResponsiveStack> :

                  <span className="text-fg-muted text-sm">No tags</span> :


                  <TagInput
                    value={scriptTags}
                    onChange={(next) => setScriptTags(next.slice(0, 10))}
                    placeholder="Type a tag, press Enter…" />
                  }
                </FormField>

                <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <FormField label="Target OS">
                    {readOnly ?
                    <Badge tone="neutral">{selectedOS}</Badge> :

                    <SegmentedControl
                      items={OS_OPTIONS}
                      value={selectedOS}
                      onChange={handleOSChange} />
                    }
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
                      options={availableShells}
                      disabled={readOnly} />

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
              readOnly ? null : (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Plus size={14} />}
                  onClick={openAddInput}>

                  Add input
                </Button>
              )
              }>
              
              {scriptInputs.length === 0 ?
              <EmptyState
                variant="dashed"
                icon={<Terminal size={24} />}
                title="No inputs defined"
                description="Scripts without inputs run with no extra prompts."
                actions={
                readOnly ? null : (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Plus size={14} />}
                    onClick={openAddInput}>

                      Add input
                    </Button>
                )
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
                theme={editorTheme}
                onMount={(editor) => editorRef.current = editor}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  folding: true,
                  wordWrap: 'on',
                  automaticLayout: true,
                  readOnly: readOnly
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
                    align="center"
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

      <Dialog open={confirmLeave} onClose={() => setConfirmLeave(false)} size="sm">
        <DialogTitle>Discard unsaved changes?</DialogTitle>
        <DialogDescription>
          You have unsaved changes to this script. Leaving now will discard them.
        </DialogDescription>
        <DialogButtons align="end">
          <Button variant="secondary" onClick={() => setConfirmLeave(false)}>
            Keep editing
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setConfirmLeave(false);
              dirtyRef.current = false;
              router.push('/scripts');
            }}>

            Discard changes
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>);

}
