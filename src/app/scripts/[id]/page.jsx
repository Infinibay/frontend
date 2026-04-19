"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import yaml from "js-yaml";
import { toast } from "sonner";
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
  Code2,
} from "lucide-react";
import {
  Card,
  Button,
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
} from "@infinibay/harbor";

import {
  useScriptQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation,
} from "@/gql/hooks";
import { usePageHeader } from "@/hooks/usePageHeader";
import ScriptInputModal from "@/app/scripts/components/ScriptInputModal";
import { parseScriptError } from "@/utils/parseScriptError";

const OS_OPTIONS = [
  {
    value: "windows",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Monitor className="h-3.5 w-3.5" />
        Windows
      </span>
    ),
  },
  {
    value: "linux",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Server className="h-3.5 w-3.5" />
        Linux
      </span>
    ),
  },
];

const SHELL_BY_OS = {
  windows: [
    { value: "powershell", label: "PowerShell" },
    { value: "cmd", label: "Command Prompt (CMD)" },
  ],
  linux: [
    { value: "bash", label: "Bash" },
    { value: "sh", label: "SH" },
  ],
};

const INPUT_TYPE_TONES = {
  text: "info",
  number: "info",
  boolean: "purple",
  select: "success",
  multiselect: "success",
};

const monacoLanguage = (shell) => {
  switch (shell) {
    case "powershell":
      return "powershell";
    case "bash":
    case "sh":
      return "shell";
    case "cmd":
      return "bat";
    default:
      return "powershell";
  }
};

export default function ScriptEditorPage() {
  const params = useParams();
  const router = useRouter();
  const scriptId = params.id;
  const isNew = scriptId === "new";

  const editorRef = useRef(null);

  const [scriptName, setScriptName] = useState("New Script");
  const [scriptDescription, setScriptDescription] = useState("");
  const [scriptTags, setScriptTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [scriptInputs, setScriptInputs] = useState([]);
  const [scriptContent, setScriptContent] = useState("# Write your script here\n");
  const [selectedOS, setSelectedOS] = useState("windows");
  const [selectedShell, setSelectedShell] = useState("powershell");
  const [editorLanguage, setEditorLanguage] = useState("powershell");
  const [originalYamlData, setOriginalYamlData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState("edit");
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [editingInputIndex, setEditingInputIndex] = useState(null);

  const { data, loading } = useScriptQuery({
    variables: { id: scriptId },
    skip: isNew,
  });

  const [createScript, { loading: creating }] = useCreateScriptMutation();
  const [updateScript, { loading: updating }] = useUpdateScriptMutation();

  // ── Populate from existing script ────────────────────────────
  useEffect(() => {
    if (data?.script?.content) {
      try {
        const parsed = yaml.load(data.script.content);
        setOriginalYamlData(parsed);
        setScriptName(parsed?.name || "New Script");
        setScriptDescription(parsed?.description || "");
        setScriptTags(data.script.tags || []);
        setScriptContent(parsed?.script || "# Write your script here\n");

        const normalized = (parsed?.inputs || []).map((i) => ({
          ...i,
          type: i.type === "checkbox" ? "boolean" : i.type,
        }));
        setScriptInputs(normalized);

        const os = Array.isArray(parsed?.os)
          ? parsed.os[0] || "windows"
          : parsed?.os || "windows";
        setSelectedOS(os);
        const shell = parsed?.shell || (os === "linux" ? "bash" : "powershell");
        setSelectedShell(shell);
        setEditorLanguage(monacoLanguage(shell));
      } catch (err) {
        toast.error(`Failed to load script: ${err.message || err}`);
      }
    }
  }, [data]);

  // ── Draft autosave ───────────────────────────────────────────
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
            selectedShell,
          })
        );
      } catch {
        /* localStorage quota — silent */
      }
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
    scriptId,
  ]);

  // Clear errors once inputs become valid.
  useEffect(() => {
    if (
      errors.length > 0 &&
      scriptName.trim() &&
      selectedOS &&
      selectedShell &&
      scriptContent.trim()
    ) {
      setErrors([]);
    }
  }, [scriptName, selectedOS, selectedShell, scriptContent, errors.length]);

  // ── Validation ───────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs = [];
    if (!scriptName.trim()) errs.push({ message: "Script name is required" });
    if (!selectedOS) errs.push({ message: "Operating system is required" });
    if (!selectedShell) errs.push({ message: "Shell type is required" });
    if (!scriptContent.trim()) errs.push({ message: "Script content cannot be empty" });

    scriptInputs.forEach((input, idx) => {
      if (!input.name?.trim())
        errs.push({ message: `Input #${idx + 1}: name is required` });
      if (!input.label?.trim())
        errs.push({ message: `Input #${idx + 1}: label is required` });
      if (
        scriptInputs.filter((i) => i.name && i.name === input.name).length > 1
      ) {
        errs.push({ message: `Duplicate input name: "${input.name}"` });
      }
    });

    setErrors(errs);
    return errs.length === 0;
  }, [scriptName, selectedOS, selectedShell, scriptContent, scriptInputs]);

  // ── OS / shell coordination ──────────────────────────────────
  const handleOSChange = (next) => {
    setSelectedOS(next);
    const shells = SHELL_BY_OS[next] || [];
    if (!shells.find((s) => s.value === selectedShell)) {
      const newShell = shells[0]?.value || "bash";
      setSelectedShell(newShell);
      setEditorLanguage(monacoLanguage(newShell));
    }
  };
  const handleShellChange = (next) => {
    setSelectedShell(next);
    setEditorLanguage(monacoLanguage(next));
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix validation errors before saving");
      setActiveTab("edit");
      return;
    }
    try {
      const currentContent = editorRef.current
        ? editorRef.current.getValue()
        : scriptContent;
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
              format: "YAML",
              name: scriptName,
              tags: scriptTags,
            },
          },
        });
        toast.success("Script created");
        router.push("/scripts");
      } else {
        await updateScript({
          variables: {
            input: {
              id: scriptId,
              name: scriptName,
              content: yamlContent,
              tags: scriptTags,
            },
          },
        });
        toast.success("Script updated");
      }
      localStorage.removeItem(`script-draft-${scriptId}`);
    } catch (err) {
      const msg = parseScriptError(err, isNew ? "create" : "update");
      toast.error(msg);
    }
  };

  const handleCancel = () => router.push("/scripts");

  // ── Tag input ────────────────────────────────────────────────
  const addTag = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (scriptTags.length >= 10) {
      toast.error("Up to 10 tags per script");
      return;
    }
    if (scriptTags.includes(trimmed)) return;
    setScriptTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };
  const removeTag = (t) =>
    setScriptTags((prev) => prev.filter((x) => x !== t));
  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // ── Inputs management ────────────────────────────────────────
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
      toast.success("Input updated");
    } else {
      setScriptInputs((prev) => [...prev, inputData]);
      toast.success("Input added");
    }
  };
  const removeInput = (i) => {
    setScriptInputs((prev) => prev.filter((_, idx) => idx !== i));
    toast.success("Input removed");
  };
  const duplicateInput = (i) => {
    const orig = scriptInputs[i];
    setScriptInputs((prev) => [
      ...prev,
      { ...orig, name: `${orig.name}_copy`, label: `${orig.label} (Copy)` },
    ]);
    toast.success("Input duplicated");
  };

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Scripts", href: "/scripts" },
        {
          label: isNew ? "New script" : scriptName || "Edit script",
          isCurrent: true,
        },
      ],
      title: isNew ? "New script" : "Edit script",
      backButton: { href: "/scripts", label: "Scripts" },
      actions: [],
    },
    [isNew, scriptName]
  );

  const availableShells = useMemo(
    () => SHELL_BY_OS[selectedOS] || [],
    [selectedOS]
  );

  // ── Render ───────────────────────────────────────────────────

  if (!isNew && loading) {
    return (
      <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
        <Spinner /> Loading script…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card variant="glass">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-accent-2/15 grid place-items-center shrink-0">
              <FileCode className="h-5 w-5 text-accent-2" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-fg truncate">
                {scriptName || (isNew ? "New script" : "Edit script")}
              </h1>
              <p className="text-sm text-fg-muted mt-1">
                Reusable automation with parametrised inputs, versioned in
                YAML. Drafts auto-save every 30 s.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<XIcon className="h-4 w-4" />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              icon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              loading={creating || updating}
              disabled={creating || updating}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit / Preview tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabList>
          <Tab value="edit" icon={<Code2 className="h-4 w-4" />}>
            Edit
          </Tab>
          <Tab value="preview" icon={<Eye className="h-4 w-4" />}>
            Preview
          </Tab>
        </TabList>

        <TabPanel value="edit">
          <div className="space-y-4">
            {/* Metadata */}
            <Card variant="default">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-fg mb-4">
                <SettingsIcon className="h-4 w-4 text-accent-2" />
                Metadata
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label="Name *"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                  placeholder="e.g. Rotate logs nightly"
                />
                <TextField
                  label="Description"
                  value={scriptDescription}
                  onChange={(e) => setScriptDescription(e.target.value)}
                  placeholder="What does this script do?"
                />
              </div>

              <div className="mt-3 space-y-2">
                <label className="text-sm font-medium text-fg">Tags</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-surface-1 border border-white/10 min-h-[44px]">
                  {scriptTags.map((tag) => (
                    <Badge key={tag} tone="purple" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-danger ml-0.5"
                        aria-label={`Remove ${tag}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={onTagKeyDown}
                    onBlur={() => tagInput.trim() && addTag(tagInput)}
                    placeholder={scriptTags.length === 0 ? "Type a tag, press Enter…" : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-fg placeholder:text-fg-subtle"
                  />
                </div>
                <p className="text-xs text-fg-subtle">
                  Up to 10 tags. Enter or comma to add.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-fg">Target OS</label>
                  <SegmentedControl
                    items={OS_OPTIONS}
                    value={selectedOS}
                    onChange={handleOSChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-fg flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5" />
                    Shell
                  </label>
                  <Select
                    value={selectedShell}
                    onChange={handleShellChange}
                    options={availableShells}
                  />
                </div>
              </div>
            </Card>

            {/* Inputs */}
            <Card variant="default">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-fg">Script inputs</h2>
                  <p className="text-xs text-fg-muted">
                    Parameters collected at runtime. Reference them with{" "}
                    <code className="px-1 rounded bg-surface-2 text-[11px]">
                      ${"{{"} inputs.name {"}}"}
                    </code>
                    .
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={openAddInput}
                >
                  Add input
                </Button>
              </div>

              {scriptInputs.length === 0 ? (
                <div className="py-6 text-center text-sm text-fg-muted">
                  No inputs defined. Scripts without inputs run with no extra
                  prompts.
                </div>
              ) : (
                <div className="rounded-lg border border-white/8 bg-surface-1 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2/60 border-b border-white/8">
                      <tr>
                        <th className="text-left text-[11px] uppercase tracking-wider text-fg-muted px-4 py-2">
                          Input
                        </th>
                        <th className="text-left text-[11px] uppercase tracking-wider text-fg-muted px-4 py-2">
                          Variable
                        </th>
                        <th className="text-center text-[11px] uppercase tracking-wider text-fg-muted px-4 py-2">
                          Type
                        </th>
                        <th className="text-center text-[11px] uppercase tracking-wider text-fg-muted px-4 py-2">
                          Required
                        </th>
                        <th className="text-right text-[11px] uppercase tracking-wider text-fg-muted px-4 py-2">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {scriptInputs.map((input, i) => (
                        <tr
                          key={i}
                          className="group hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                              <span className="font-medium text-fg">
                                {input.label || input.name}
                              </span>
                            </div>
                            {input.description ? (
                              <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                                {input.description}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-surface-2 px-2 py-0.5 rounded text-fg-muted font-mono">
                              {input.name}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge tone={INPUT_TYPE_TONES[input.type] || "neutral"}>
                              {input.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {input.required ? (
                              <Badge tone="danger">Yes</Badge>
                            ) : (
                              <span className="text-xs text-fg-muted">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                icon={<Edit className="h-3.5 w-3.5" />}
                                onClick={() => openEditInput(i)}
                                aria-label="Edit"
                              >
                                {""}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                icon={<Copy className="h-3.5 w-3.5" />}
                                onClick={() => duplicateInput(i)}
                                aria-label="Duplicate"
                              >
                                {""}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                icon={<Trash2 className="h-3.5 w-3.5" />}
                                onClick={() => removeInput(i)}
                                aria-label="Remove"
                              >
                                {""}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Monaco editor */}
            <Card variant="default" className="!p-0 overflow-hidden">
              <div className="px-4 py-2 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-fg-muted">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>{scriptName || "script"}.{selectedShell === "powershell" ? "ps1" : selectedShell === "cmd" ? "bat" : "sh"}</span>
                </div>
                <Badge tone="neutral">{editorLanguage}</Badge>
              </div>
              <Editor
                height="600px"
                defaultLanguage="powershell"
                language={editorLanguage}
                value={scriptContent}
                onChange={(v) => setScriptContent(v ?? "")}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: "on",
                  folding: true,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </Card>

            {errors.length > 0 && (
              <Alert
                tone="danger"
                title={`${errors.length} validation error${errors.length === 1 ? "" : "s"}`}
              >
                <ul className="space-y-0.5 mt-1">
                  {errors.map((e, i) => (
                    <li key={i} className="text-sm">
                      {e.line && e.column
                        ? `Line ${e.line}, column ${e.column}: ${e.message}`
                        : e.message}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        </TabPanel>

        <TabPanel value="preview">
          <Card variant="default">
            <h2 className="text-lg font-semibold text-fg">
              {scriptName || "Untitled script"}
            </h2>
            {scriptDescription ? (
              <p className="text-sm text-fg-muted mt-1">{scriptDescription}</p>
            ) : null}

            {scriptTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {scriptTags.map((t) => (
                  <Badge key={t} tone="purple">
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="rounded-lg bg-surface-1 p-3">
                <div className="text-[11px] uppercase tracking-wider text-fg-muted">
                  Target OS
                </div>
                <div className="font-medium text-fg capitalize">
                  {selectedOS}
                </div>
              </div>
              <div className="rounded-lg bg-surface-1 p-3">
                <div className="text-[11px] uppercase tracking-wider text-fg-muted">
                  Shell
                </div>
                <div className="font-medium text-fg">{selectedShell}</div>
              </div>
            </div>

            {scriptInputs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-fg mb-2">Inputs</h3>
                <div className="space-y-2">
                  {scriptInputs.map((input, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-surface-1 p-3 text-sm flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-fg">
                          {input.label || input.name}
                        </span>
                        {input.required && (
                          <span className="text-danger ml-1">*</span>
                        )}
                        <Badge
                          tone={INPUT_TYPE_TONES[input.type] || "neutral"}
                          className="ml-2"
                        >
                          {input.type}
                        </Badge>
                        {input.description ? (
                          <p className="text-xs text-fg-muted mt-0.5">
                            {input.description}
                          </p>
                        ) : null}
                        <code className="text-[11px] text-fg-muted mt-1 block font-mono">
                          ${"{{"} inputs.{input.name} {"}}"}
                        </code>
                      </div>
                      {input.default ? (
                        <span className="text-[11px] text-fg-subtle shrink-0">
                          default: {String(input.default)}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-fg mb-2">
                Script content
              </h3>
              <pre className="text-sm bg-surface-1 p-4 rounded-lg overflow-x-auto border border-white/8 whitespace-pre-wrap font-mono">
                {scriptContent || "# No content"}
              </pre>
            </div>
          </Card>
        </TabPanel>
      </Tabs>

      <ScriptInputModal
        open={inputModalOpen}
        onOpenChange={setInputModalOpen}
        input={editingInputIndex !== null ? scriptInputs[editingInputIndex] : null}
        onSave={handleInputSave}
        mode={editingInputIndex !== null ? "edit" : "create"}
      />
    </div>
  );
}
