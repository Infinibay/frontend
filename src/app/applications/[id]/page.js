"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
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
  Card,
  Button,
  TextField,
  Textarea,
  Select,
  Checkbox,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Alert,
  Badge,
  Spinner,
} from "@infinibay/harbor";

import {
  fetchApplicationById,
  updateApplication,
} from "@/state/slices/applications";
import { usePageHeader } from "@/hooks/usePageHeader";

const PARAM_TYPE_OPTIONS = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
];

const OS_TABS = [
  { id: "windows", label: "Windows", tone: "info" },
  { id: "ubuntu", label: "Ubuntu", tone: "success" },
  { id: "fedora", label: "Fedora", tone: "success" },
];

export default function EditApplicationPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const urlParams = useParams();
  const id = urlParams.id;

  const application = useSelector((state) =>
    state.applications.items.find((a) => a.id === id)
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [params, setParams] = useState([]);
  const [scripts, setScripts] = useState({
    windows: "",
    ubuntu: "",
    fedora: "",
  });
  const [activeTab, setActiveTab] = useState("windows");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dispatch(fetchApplicationById(id)).finally(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => {
    if (!application) return;
    setName(application.name || "");
    setDescription(application.description || "");
    setParams(
      Object.keys(application.parameters || {}).map((key) => ({
        name: key,
        type: application.parameters[key].type,
        required: !!application.parameters[key].required,
      }))
    );
    try {
      const cmd = JSON.parse(application.installCommand || "{}");
      setScripts({
        windows: cmd.windows || "",
        ubuntu: cmd.ubuntu || "",
        fedora: cmd.fedora || "",
      });
    } catch (_err) {
      setScripts({ windows: "", ubuntu: "", fedora: "" });
    }
  }, [application]);

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Applications", href: "/applications" },
        { label: application?.name || "Application", isCurrent: true },
      ],
      title: application?.name || "Application",
      backButton: { href: "/applications", label: "Back" },
      actions: [],
    },
    [application?.name]
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

    const filtered = params.filter((p) => p.name.trim() !== "");
    const parameters = filtered.reduce((acc, p) => {
      acc[p.name] = { type: p.type, required: p.required };
      return acc;
    }, {});

    setSaving(true);
    try {
      await dispatch(
        updateApplication({
          id,
          input: {
            name: name.trim(),
            description: description.trim(),
            parameters,
            os: ["windows", "ubuntu", "fedora"],
            installCommand: JSON.stringify(scripts),
          },
        })
      ).unwrap();
      toast.success("Application updated");
    } catch (err) {
      toast.error(`Could not save: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !application) {
    return (
      <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
        <Spinner /> Loading application…
      </div>
    );
  }

  if (!application) {
    return (
      <Alert
        tone="warning"
        title="Application not found"
        actions={
          <Button
            size="sm"
            variant="secondary"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push("/applications")}
          >
            Back to applications
          </Button>
        }
      >
        We couldn&apos;t find an application with id <strong>{id}</strong>.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card variant="glass">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
            <AppWindow className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-fg truncate">
              {name || application.name}
            </h1>
            <p className="text-sm text-fg-muted mt-1">
              Edit the install scripts and parameter schema. Changes take
              effect on the next VM that pulls this app.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            type="button"
            onClick={() => router.push("/applications")}
          >
            Back
          </Button>
        </div>
      </Card>

      <Card variant="default">
        <h2 className="text-sm font-semibold text-fg mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-accent-2" />
          Identity
        </h2>
        <div className="space-y-3">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </Card>

      <Card variant="default">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-fg">Parameters</h2>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            icon={<Plus className="h-4 w-4" />}
            onClick={addParam}
          >
            Add parameter
          </Button>
        </div>

        {params.length === 0 ? (
          <p className="text-sm text-fg-muted">No parameters configured.</p>
        ) : (
          <div className="space-y-2">
            {params.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-surface-1 border border-white/8 p-2"
              >
                <div className="flex-1 min-w-0">
                  <TextField
                    placeholder="name"
                    value={p.name}
                    onChange={(e) => updateParam(i, { name: e.target.value })}
                  />
                </div>
                <div className="w-28 shrink-0">
                  <Select
                    value={p.type}
                    onChange={(v) => updateParam(i, { type: v })}
                    options={PARAM_TYPE_OPTIONS}
                  />
                </div>
                <div className="w-28 shrink-0">
                  <Checkbox
                    checked={p.required}
                    onChange={(e) => updateParam(i, { required: e.target.checked })}
                    label="Required"
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => removeParam(i)}
                  aria-label="Remove parameter"
                >
                  {""}
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-fg-muted mt-3">
          Use <code className="px-1 bg-surface-2 rounded">{"{{param_name}}"}</code>
          {" "}inside any script to interpolate values at install time.
        </p>
      </Card>

      <Card variant="default">
        <h2 className="text-sm font-semibold text-fg mb-3 flex items-center gap-2">
          <AppWindow className="h-4 w-4 text-accent-2" />
          Install scripts
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} variant="pill">
          <TabList>
            {OS_TABS.map((os) => (
              <Tab
                key={os.id}
                value={os.id}
                icon={
                  scripts[os.id]?.trim() ? (
                    <Badge
                      tone={os.tone}
                      className="h-2 w-2 !p-0 rounded-full border-none"
                    />
                  ) : null
                }
              >
                {os.label}
              </Tab>
            ))}
          </TabList>

          {OS_TABS.map((os) => (
            <TabPanel key={os.id} value={os.id} className="mt-3">
              <Textarea
                placeholder={`${os.label} install script`}
                value={scripts[os.id]}
                onChange={(e) =>
                  setScripts((prev) => ({ ...prev, [os.id]: e.target.value }))
                }
                rows={10}
                className="font-mono text-sm"
              />
            </TabPanel>
          ))}
        </Tabs>

        {!scriptHasContent && (
          <Alert tone="info" className="mt-3">
            No scripts defined for any OS yet.
          </Alert>
        )}
      </Card>

      <div className="flex items-center justify-end gap-2 pt-2">
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
          icon={<Save className="h-4 w-4" />}
          loading={saving}
          disabled={saving}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
