"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Palette,
  Package as PackageIcon,
  Disc,
  FileCode,
  Sun,
  Moon,
  Monitor as MonitorIcon,
  Upload,
  CheckCircle,
  X as XIcon,
} from "lucide-react";
import { FaUbuntu, FaWindows } from "react-icons/fa";
import { SiFedora } from "react-icons/si";
import {
  Page,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  SegmentedControl,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  IconTile,
  Progress,
  ResponsiveStack,
  ResponsiveGrid,
  TextField,
  ColorPicker,
} from "@infinibay/harbor";

import { usePageHeader } from "@/hooks/usePageHeader";
import { PageHeader } from "@/components/common/PageHeader";
import ScriptsSection from "@/components/settings/ScriptsSection";
import PackagesSection from "@/components/settings/PackagesSection";
import { useAppTheme } from "@/contexts/ThemeProvider";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import {
  fetchAppSettings,
  updateAppSettings,
  selectAppSettings,
  selectAppSettingsInitialized,
  setThemePreference,
  setAccentColor,
  setBrandName,
  setLogoUrl,
} from "@/state/slices/appSettings";

const OS_CARDS = [
  {
    id: "WINDOWS10",
    value: "windows10",
    label: "Windows 10",
    Icon: FaWindows,
    tone: "sky",
    note: "Microsoft Windows 10",
    downloadUrl: "https://www.microsoft.com/es-es/software-download/windows10ISO",
  },
  {
    id: "WINDOWS11",
    value: "windows11",
    label: "Windows 11",
    Icon: FaWindows,
    tone: "sky",
    note: "Latest Windows release",
    downloadUrl: "https://www.microsoft.com/es-es/software-download/windows11",
  },
  {
    id: "UBUNTU",
    value: "ubuntu",
    label: "Ubuntu",
    Icon: FaUbuntu,
    tone: "amber",
    note: "Popular Linux distribution",
    downloadUrl: "https://ubuntu.com/download/desktop",
  },
  {
    id: "FEDORA",
    value: "fedora",
    label: "Fedora",
    Icon: SiFedora,
    tone: "purple",
    note: "Needs the Everything netinstall ISO, not Live.",
    downloadUrl:
      "https://download.fedoraproject.org/pub/fedora/linux/releases/41/Everything/x86_64/iso/",
  },
];

const formatSize = (bytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
};

// ─── Appearance tab ───────────────────────────────────────────────

function AppearanceTab() {
  const dispatch = useDispatch();
  const appSettings = useSelector(selectAppSettings);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  const themeContext = useAppTheme();
  const theme = themeContext?.theme || "system";
  const setTheme = themeContext?.setTheme || (() => {});

  useEffect(() => {
    if (!appSettingsInitialized) {
      dispatch(fetchAppSettings());
    }
  }, [appSettingsInitialized, dispatch]);

  const handleThemeChange = async (next) => {
    const prev = theme;
    const prevStored = appSettings?.theme;
    try {
      dispatch(setThemePreference(next));
      setTheme(next);
      await dispatch(updateAppSettings({ theme: next })).unwrap();
      toast.success(`Theme set to ${next}`);
    } catch (err) {
      dispatch(setThemePreference(prevStored || prev));
      setTheme(prev);
      toast.error(`Could not update theme: ${err.message}`);
    }
  };

  return (
    <ResponsiveStack direction="col" gap={6}>
      <Card
        variant="default"
        leadingIcon={<Palette size={20} />}
        leadingIconTone="purple"
        title="Theme"
        description="Pick the interface tone. Harbor is dark-only today; light is tracked separately."
      >
        <SegmentedControl
          items={[
            {
              value: "light",
              label: (
                <ResponsiveStack direction="row" gap={1} align="center">
                  <Sun size={14} />
                  Light
                </ResponsiveStack>
              ),
            },
            {
              value: "dark",
              label: (
                <ResponsiveStack direction="row" gap={1} align="center">
                  <Moon size={14} />
                  Dark
                </ResponsiveStack>
              ),
            },
            {
              value: "system",
              label: (
                <ResponsiveStack direction="row" gap={1} align="center">
                  <MonitorIcon size={14} />
                  System
                </ResponsiveStack>
              ),
            },
          ]}
          value={theme}
          onChange={handleThemeChange}
        />
      </Card>

      <BrandingSection />
    </ResponsiveStack>
  );
}

// ─── Branding (whitelabel) sub-section ────────────────────────────

function BrandingSection() {
  const dispatch = useDispatch();
  const appSettings = useSelector(selectAppSettings);

  // Local form state. Initialised from appSettings on mount; the post-save
  // update propagates through Redux which already feeds the live preview,
  // so we don't need a sync effect here.
  const [logo, setLogo] = useState(appSettings?.logoUrl || "");
  const [brand, setBrand] = useState(appSettings?.brandName || "");
  const [accent, setAccent] = useState(appSettings?.accentColor || "");

  const dirty =
    (logo || "") !== (appSettings?.logoUrl || "") ||
    (brand || "") !== (appSettings?.brandName || "") ||
    (accent || "") !== (appSettings?.accentColor || "");

  const handleSave = async () => {
    const next = {
      logoUrl: logo || null,
      brandName: brand || null,
      accentColor: accent || null,
    };
    // Optimistic local update — makes the applier react instantly.
    dispatch(setLogoUrl(next.logoUrl));
    dispatch(setBrandName(next.brandName));
    dispatch(setAccentColor(next.accentColor));
    try {
      await dispatch(updateAppSettings(next)).unwrap();
      toast.success("Branding saved");
    } catch (err) {
      toast.error(`Could not save branding: ${err.message || err}`);
    }
  };

  const handleReset = () => {
    setLogo("");
    setBrand("");
    setAccent("");
  };

  return (
    <Card
      variant="default"
      leadingIcon={<Palette size={20} />}
      leadingIconTone="purple"
      title="Branding"
      description="Override the Infinibay look for this instance: logo, brand name and accent color. Applied to every user of this instance."
    >
      <ResponsiveStack direction="col" gap={4}>
        <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
          <TextField
            label="Logo URL"
            placeholder="https://cdn.example.com/logo.svg"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            helper="Shown in the sidebar and on the login page."
          />
          <TextField
            label="Brand name"
            placeholder="Acme Cloud"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            helper="Replaces “Infinibay” in the topbar and tab titles."
          />
        </ResponsiveGrid>

        <ResponsiveStack direction="col" gap={2}>
          <span className="text-fg-muted">Accent color</span>
          <ColorPicker
            value={accent || "#d946ef"}
            onChange={(hex) => setAccent(hex)}
          />
          {accent ? (
            <span className="text-fg-subtle font-mono">{accent}</span>
          ) : null}
        </ResponsiveStack>

        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={!dirty}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!dirty}
          >
            Save branding
          </Button>
        </ResponsiveStack>
      </ResponsiveStack>
    </Card>
  );
}

// ─── ISOs tab ─────────────────────────────────────────────────────

function IsosTab() {
  const { isReady, availableOS, checkStatus } = useSystemStatus({
    checkOnMount: true,
  });
  const fileInputRef = useRef(null);
  const [selectedOS, setSelectedOS] = useState("");
  const [isoFile, setIsoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadController, setUploadController] = useState(null);
  const [draggedOverOS, setDraggedOverOS] = useState(null);

  const isOSAvailable = (id) =>
    availableOS ? availableOS.includes(id) : false;

  const handleFileSelect = (file, osValue = null, autoUpload = false) => {
    if (!file || !file.name.toLowerCase().endsWith(".iso")) {
      toast.error("Please select a valid ISO file");
      return;
    }
    setIsoFile(file);
    if (osValue) setSelectedOS(osValue);
    if (autoUpload && osValue) {
      setTimeout(() => handleUpload(file, osValue), 100);
    }
  };

  const handleUpload = async (fileArg, osArg) => {
    const file = fileArg || isoFile;
    const os = osArg || selectedOS;
    if (!file || !os) {
      toast.error("Pick an OS and an ISO file first");
      return;
    }
    const MAX = 100 * 1024 * 1024 * 1024;
    if (file.size > MAX) {
      toast.error("ISO must be under 100 GB");
      return;
    }

    const controller = new AbortController();
    setUploadController(controller);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("os", os);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/isoUpload`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal,
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      if (res.status !== 200) throw new Error(res.data);
      await checkStatus();
      setIsoFile(null);
      setSelectedOS("");
      toast.success("ISO uploaded successfully");
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.info("Upload cancelled");
      } else {
        toast.error(`Upload failed: ${err.message}`);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadController(null);
    }
  };

  const cancelUpload = () => {
    uploadController?.abort();
  };

  const handleDragOver = (e, osValue) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(osValue);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(null);
  };
  const handleDrop = (e, osValue) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file, osValue, true);
  };
  const openFileDialog = (osValue) => {
    setSelectedOS(osValue);
    fileInputRef.current?.click();
  };

  return (
    <ResponsiveStack direction="col" gap={6}>
      <Card
        variant="default"
        leadingIcon={<Disc size={20} />}
        leadingIconTone="sky"
        title="ISO library"
        description="Upload the installer ISO for each OS you want to provision. Drop a file on any card to upload it automatically."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".iso"
          hidden
          onChange={(e) => handleFileSelect(e.target.files?.[0], selectedOS)}
        />

        <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
          {OS_CARDS.map((os) => {
            const available = isOSAvailable(os.id);
            const isDraggingMe = draggedOverOS === os.value;
            const Icon = os.Icon;
            return (
              <Card
                key={os.value}
                variant="default"
                interactive
                selected={isDraggingMe}
                onClick={() => openFileDialog(os.value)}
                onDragOver={(e) => handleDragOver(e, os.value)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, os.value)}
              >
                <ResponsiveStack direction="row" justify="between" align="center">
                  <IconTile icon={<Icon />} tone={os.tone} size="md" />
                  {available ? (
                    <Badge tone="success" icon={<CheckCircle size={12} />}>
                      Ready
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Missing</Badge>
                  )}
                </ResponsiveStack>
                <ResponsiveStack direction="col" gap={0}>
                  <strong>{os.label}</strong>
                  <span style={{ fontSize: 12, opacity: 0.65 }}>{os.note}</span>
                </ResponsiveStack>
                <ResponsiveStack direction="row" justify="between" align="center">
                  <span style={{ fontSize: 11, opacity: 0.5 }}>
                    Click or drop ISO
                  </span>
                  <a
                    href={os.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 11 }}
                  >
                    Download ↗
                  </a>
                </ResponsiveStack>
              </Card>
            );
          })}
        </ResponsiveGrid>
      </Card>

      {(isoFile || selectedOS) && (
        <Card variant="default" title="Selection">
          <ResponsiveStack
            direction={{ base: "col", md: "row" }}
            gap={4}
            justify="between"
            align="stretch"
          >
            <ResponsiveStack direction="col" gap={1}>
              {selectedOS && (
                <ResponsiveStack direction="row" gap={2} align="center" wrap>
                  <span>OS:</span>
                  <Badge tone="info">
                    {OS_CARDS.find((o) => o.value === selectedOS)?.label}
                  </Badge>
                  {isOSAvailable(
                    OS_CARDS.find((o) => o.value === selectedOS)?.id
                  ) && (
                    <Badge tone="warning">
                      ⚠ Already uploaded — this will replace the existing ISO.
                    </Badge>
                  )}
                </ResponsiveStack>
              )}
              {isoFile && (
                <ResponsiveStack direction="row" gap={2} align="center" wrap>
                  <span>File:</span>
                  <code>{isoFile.name}</code>
                  <span style={{ opacity: 0.5 }}>
                    ({formatSize(isoFile.size)})
                  </span>
                </ResponsiveStack>
              )}
            </ResponsiveStack>
            <ResponsiveStack direction="row" gap={2} align="center">
              {isUploading ? (
                <>
                  <Progress
                    value={uploadProgress}
                    showValue
                    tone="sky"
                    label="Uploading"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    icon={<XIcon size={16} />}
                    onClick={cancelUpload}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsoFile(null);
                      setSelectedOS("");
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    icon={<Upload size={16} />}
                    onClick={() => handleUpload()}
                    disabled={!selectedOS || !isoFile}
                  >
                    Upload ISO
                  </Button>
                </>
              )}
            </ResponsiveStack>
          </ResponsiveStack>
        </Card>
      )}

      {isReady === false && (
        <Alert tone="warning">
          No ISOs are available yet. Upload at least one before creating VMs.
        </Alert>
      )}
    </ResponsiveStack>
  );
}

// ─── Page root ────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");

  const helpConfig = useMemo(
    () => ({
      title: "Settings",
      description: "Configure appearance, ISO library, scripts and packages.",
      icon: <SettingsIcon size={20} />,
      sections: [
        {
          id: "appearance",
          title: "Appearance",
          icon: <Palette size={16} />,
          content: (
            <p>
              Theme selection lives here. Wallpapers and a custom logo will
              ship in a follow-up revamp.
            </p>
          ),
        },
        {
          id: "isos",
          title: "ISO library",
          icon: <Disc size={16} />,
          content: (
            <p>
              Upload installer ISOs per OS. You can drop a file on the OS
              card to upload it automatically.
            </p>
          ),
        },
      ],
      quickTips: [
        "Drop an ISO on the card to skip the dialog",
        "Windows ISOs must come from Microsoft's official site",
        "Fedora needs the Everything net-install, not Live",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Settings", isCurrent: true },
      ],
      title: "Settings",
      actions: [],
      helpConfig,
      helpTooltip: "Settings help",
    },
    []
  );

  return (
    <Page gap="lg">
      <PageHeader title="Settings" />

      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabList>
          <Tab value="appearance" icon={<Palette size={16} />}>
            Appearance
          </Tab>
          <Tab value="isos" icon={<Disc size={16} />}>
            ISOs
          </Tab>
          <Tab value="scripts" icon={<FileCode size={16} />}>
            Scripts
          </Tab>
          <Tab value="packages" icon={<PackageIcon size={16} />}>
            Packages
          </Tab>
        </TabList>

        <TabPanel value="appearance">
          <AppearanceTab />
        </TabPanel>
        <TabPanel value="isos">
          <IsosTab />
        </TabPanel>
        <TabPanel value="scripts">
          <ScriptsSection embedded />
        </TabPanel>
        <TabPanel value="packages">
          <PackagesSection embedded />
        </TabPanel>
      </Tabs>

      <Spinner hidden aria-hidden />
    </Page>
  );
}
