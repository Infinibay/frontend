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
  Spinner,
  FormField,
  ResponsiveStack,
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
  { id: "windows", label: "Windows" },
  { id: "ubuntu", label: "Ubuntu" },
  { id: "fedora", label: "Fedora" },
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
    // Intentional: loading flag flips on id change while we refetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    dispatch(fetchApplicationById(id)).finally(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => {
    if (!application) return;
    // Intentional: hydrate local form state when the record arrives.
    /* eslint-disable react-hooks/set-state-in-effect */
    setName(application.name || "");
    setDescription(application.description || "");
    setParams(
      Object.keys(application.parameters || {}).map((key) => ({
        name: key,
        type: application.parameters[key].type,
        required: !!application.parameters[key].required,
      }))
    );
    const raw = application.installCommand;
    const cmd =
      typeof raw === "string"
        ? (() => {
            try {
              return JSON.parse(raw || "{}");
            } catch {
              return {};
            }
          })()
        : raw || {};
    setScripts({
      windows: cmd.windows || "",
      ubuntu: cmd.ubuntu || "",
      fedora: cmd.fedora || "",
    });
    /* eslint-enable react-hooks/set-state-in-effect */
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
            installCommand: scripts,
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
      <Page size="lg" gap="lg">
        <Card variant="default">
          <ResponsiveStack direction="row" gap={3} justify="center" align="center">
            <Spinner /> Loading application…
          </ResponsiveStack>
        </Card>
      </Page>
    );
  }

  if (!application) {
    return (
      <Page size="lg" gap="lg">
        <Alert
          tone="warning"
          title="Application not found"
          actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={16} />}
              onClick={() => router.push("/applications")}
            >
              Back to applications
            </Button>
          }
        >
          We couldn&apos;t find an application with id <strong>{id}</strong>.
        </Alert>
      </Page>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Page size="lg" gap="lg">
        <Card
          variant="default"
          leadingIcon={<AppWindow size={20} />}
          leadingIconTone="purple"
          title={name || application.name}
          description="Edit the install scripts and parameter schema. Changes take effect on the next desktop that pulls this app."
        >
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeft size={16} />}
              type="button"
              onClick={() => router.push("/applications")}
            >
              Back
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
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
            <p>No parameters configured.</p>
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
            <Alert tone="info">
              No scripts defined for any OS yet.
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
            Save changes
          </Button>
        </ResponsiveStack>
      </Page>
    </form>
  );
}
