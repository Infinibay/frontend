"use client";

import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Trash2,
  Save,
  AppWindow,
  ArrowLeft,
} from "lucide-react";
import {
  Page,
  Card,
  Button,
  IconButton,
  TextField,
  Textarea,
  Select,
  Checkbox,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Alert,
  FormField,
  ResponsiveStack,
} from "@infinibay/harbor";

import { createApplication } from "@/state/slices/applications";
import { usePageHeader } from "@/hooks/usePageHeader";

const PARAM_TYPE_OPTIONS = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
];

const OS_TABS = [
  { id: "windows", label: "Windows" },
  { id: "ubuntu", label: "Ubuntu" },
  { id: "fedora", label: "Fedora" },
];

export default function NewApplicationPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [params, setParams] = useState([
    { name: "", type: "string", required: false },
  ]);
  const [scripts, setScripts] = useState({
    windows: "",
    ubuntu: "",
    fedora: "",
  });
  const [activeTab, setActiveTab] = useState("windows");
  const [saving, setSaving] = useState(false);

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Applications", href: "/applications" },
        { label: "New", isCurrent: true },
      ],
      title: "New Application",
      backButton: { href: "/applications", label: "Back" },
      actions: [],
    },
    []
  );

  const addParam = () =>
    setParams((prev) => [...prev, { name: "", type: "string", required: false }]);
  const removeParam = (i) =>
    setParams((prev) => prev.filter((_, idx) => idx !== i));
  const updateParam = (i, patch) =>
    setParams((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const scriptHasContent = useMemo(
    () => Object.values(scripts).some((s) => s.trim().length > 0),
    [scripts]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!scriptHasContent) {
      toast.error("At least one OS script is required");
      return;
    }

    const filtered = params.filter((p) => p.name.trim() !== "");
    const parameters = filtered.reduce((acc, p) => {
      acc[p.name] = { type: p.type, required: p.required };
      return acc;
    }, {});

    setSaving(true);
    try {
      const created = await dispatch(
        createApplication({
          name: name.trim(),
          description: description.trim(),
          parameters,
          os: ["windows", "ubuntu", "fedora"],
          installCommand: JSON.stringify(scripts),
        })
      ).unwrap();
      toast.success(`Application "${name}" created`);
      router.push(created?.id ? `/applications/${created.id}` : "/applications");
    } catch (err) {
      toast.error(`Could not create: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Page size="lg" gap="lg">
        <Card
          variant="default"
          leadingIcon={<AppWindow size={20} />}
          leadingIconTone="purple"
          title="New Application"
          description="Register an install-script catalogue entry that desktops can pull and run with parameters."
        >
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeft size={16} />}
              type="button"
              onClick={() => router.push("/applications")}
            >
              Cancel
            </Button>
          </ResponsiveStack>
        </Card>

        <Card
          variant="default"
          leadingIcon={<Package size={18} />}
          title="Identity"
        >
          <ResponsiveStack direction="col" gap={3}>
            <FormField label="Name" required>
              <TextField
                placeholder="e.g. VSCode, Postman, OBS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Description" required>
              <Textarea
                placeholder="Short blurb shown to anyone picking this app"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
              />
            </FormField>
          </ResponsiveStack>
        </Card>

        <Card variant="default" title="Parameters">
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              size="sm"
              variant="secondary"
              type="button"
              icon={<Plus size={16} />}
              onClick={addParam}
            >
              Add parameter
            </Button>
          </ResponsiveStack>

          {params.length === 0 ? (
            <p>No parameters — this app installs with zero inputs.</p>
          ) : (
            <ResponsiveStack direction="col" gap={2}>
              {params.map((p, i) => (
                <Card key={i} variant="default">
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <TextField
                      placeholder="name"
                      value={p.name}
                      onChange={(e) => updateParam(i, { name: e.target.value })}
                    />
                    <Select
                      value={p.type}
                      onChange={(v) => updateParam(i, { type: v })}
                      options={PARAM_TYPE_OPTIONS}
                    />
                    <Checkbox
                      checked={p.required}
                      onChange={(e) => updateParam(i, { required: e.target.checked })}
                      label="Required"
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      type="button"
                      icon={<Trash2 size={14} />}
                      onClick={() => removeParam(i)}
                      aria-label="Remove parameter"
                    />
                  </ResponsiveStack>
                </Card>
              ))}
            </ResponsiveStack>
          )}

          <Alert tone="info" size="sm">
            Use <code>{"{{param_name}}"}</code> inside any script to interpolate values at install time.
          </Alert>
        </Card>

        <Card
          variant="default"
          leadingIcon={<AppWindow size={18} />}
          title="Install scripts"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="pill">
            <TabList>
              {OS_TABS.map((os) => (
                <Tab key={os.id} value={os.id}>
                  {os.label}
                  {scripts[os.id]?.trim() ? " ●" : ""}
                </Tab>
              ))}
            </TabList>

            {OS_TABS.map((os) => (
              <TabPanel key={os.id} value={os.id}>
                <Textarea
                  placeholder={`${os.label} install script`}
                  value={scripts[os.id]}
                  onChange={(e) =>
                    setScripts((prev) => ({ ...prev, [os.id]: e.target.value }))
                  }
                  rows={10}
                />
              </TabPanel>
            ))}
          </Tabs>

          {!scriptHasContent && (
            <Alert tone="warning">
              Provide at least one OS script before saving.
            </Alert>
          )}
        </Card>

        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/applications")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<Save size={16} />}
            loading={saving}
            disabled={saving}
          >
            Create application
          </Button>
        </ResponsiveStack>
      </Page>
    </form>
  );
}
