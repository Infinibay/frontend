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
} from "@infinibay/harbor";

import { usePageHeader } from "@/hooks/usePageHeader";
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
} from "@/state/slices/appSettings";

const OS_CARDS = [
  {
    id: "WINDOWS10",
    value: "windows10",
    label: "Windows 10",
    Icon: FaWindows,
    accent: "sky",
    note: "Microsoft Windows 10",
    downloadUrl: "https://www.microsoft.com/es-es/software-download/windows10ISO",
  },
  {
    id: "WINDOWS11",
    value: "windows11",
    label: "Windows 11",
    Icon: FaWindows,
    accent: "sky",
    note: "Latest Windows release",
    downloadUrl: "https://www.microsoft.com/es-es/software-download/windows11",
  },
  {
    id: "UBUNTU",
    value: "ubuntu",
    label: "Ubuntu",
    Icon: FaUbuntu,
    accent: "amber",
    note: "Popular Linux distribution",
    downloadUrl: "https://ubuntu.com/download/desktop",
  },
  {
    id: "FEDORA",
    value: "fedora",
    label: "Fedora",
    Icon: SiFedora,
    accent: "purple",
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
    <div className="space-y-6">
      <Card variant="default">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
            <Palette className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-fg">Theme</h3>
            <p className="text-sm text-fg-muted">
              Pick the interface tone. Harbor is dark-only today; light is
              tracked separately.
            </p>
          </div>
        </div>
        <SegmentedControl
          items={[
            {
              value: "light",
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </span>
              ),
            },
            {
              value: "dark",
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </span>
              ),
            },
            {
              value: "system",
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <MonitorIcon className="h-3.5 w-3.5" />
                  System
                </span>
              ),
            },
          ]}
          value={theme}
          onChange={handleThemeChange}
        />
      </Card>

      <Alert tone="info">
        Wallpapers and custom logo are tracked for a dedicated revamp — the
        old uploaders are parked while the Harbor equivalents land.
      </Alert>
    </div>
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

  const accentColor = (accent) => {
    switch (accent) {
      case "sky":
        return "text-accent-2 bg-accent-2/10 border-accent-2/30";
      case "amber":
        return "text-warning bg-warning/10 border-warning/30";
      case "purple":
        return "text-accent bg-accent/10 border-accent/30";
      default:
        return "text-fg-muted bg-surface-2 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="default">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-accent-2/15 grid place-items-center shrink-0">
            <Disc className="h-5 w-5 text-accent-2" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-fg">ISO library</h3>
            <p className="text-sm text-fg-muted">
              Upload the installer ISO for each OS you want to provision.
              Drop a file on any card to upload it automatically.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".iso"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0], selectedOS)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {OS_CARDS.map((os) => {
            const available = isOSAvailable(os.id);
            const isDraggingMe = draggedOverOS === os.value;
            const Icon = os.Icon;
            return (
              <button
                type="button"
                key={os.value}
                onClick={() => openFileDialog(os.value)}
                onDragOver={(e) => handleDragOver(e, os.value)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, os.value)}
                className={`text-left rounded-xl p-4 border transition-all ${
                  isDraggingMe
                    ? "border-accent bg-accent/10 scale-[0.99]"
                    : "border-white/10 bg-surface-1 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-lg grid place-items-center border ${accentColor(
                      os.accent
                    )}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {available ? (
                    <Badge tone="success">
                      <CheckCircle className="h-3 w-3 mr-0.5" />
                      Ready
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Missing</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium text-fg">{os.label}</div>
                  <div className="text-xs text-fg-muted mt-0.5 line-clamp-2">
                    {os.note}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-[11px]">
                  <span className="text-fg-subtle">Click or drop ISO</span>
                  <a
                    href={os.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-accent-2 hover:underline"
                  >
                    Download ↗
                  </a>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {(isoFile || selectedOS) && (
        <Card variant="glass">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-fg">Selection</h4>
              <div className="text-sm text-fg-muted mt-1 space-y-0.5">
                {selectedOS && (
                  <div>
                    OS:{" "}
                    <Badge tone="info">
                      {OS_CARDS.find((o) => o.value === selectedOS)?.label}
                    </Badge>
                    {isOSAvailable(
                      OS_CARDS.find((o) => o.value === selectedOS)?.id
                    ) && (
                      <span className="ml-2 text-warning">
                        ⚠ Already uploaded — this will replace the existing
                        ISO.
                      </span>
                    )}
                  </div>
                )}
                {isoFile && (
                  <div>
                    File:{" "}
                    <span className="font-mono text-xs text-fg">
                      {isoFile.name}
                    </span>{" "}
                    <span className="text-fg-subtle">
                      ({formatSize(isoFile.size)})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isUploading ? (
                <>
                  <div className="w-48">
                    <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-accent-2 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-fg-muted mt-1 tabular-nums">
                      {uploadProgress}%
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    icon={<XIcon className="h-4 w-4" />}
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
                    icon={<Upload className="h-4 w-4" />}
                    onClick={() => handleUpload()}
                    disabled={!selectedOS || !isoFile}
                  >
                    Upload ISO
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {isReady === false && (
        <Alert tone="warning">
          No ISOs are available yet. Upload at least one before creating VMs.
        </Alert>
      )}
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");

  const helpConfig = useMemo(
    () => ({
      title: "Settings",
      description: "Configure appearance, ISO library, scripts and packages.",
      icon: <SettingsIcon className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "appearance",
          title: "Appearance",
          icon: <Palette className="h-4 w-4" />,
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
          icon: <Disc className="h-4 w-4" />,
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
    <div className="space-y-6">
      <Card variant="glass">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
            <SettingsIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-fg">Settings</h1>
            <p className="text-sm text-fg-muted mt-1">
              Appearance, ISOs, scripts and packages. Everything the system
              pulls from configuration lives here.
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabList>
          <Tab value="appearance" icon={<Palette className="h-4 w-4" />}>
            Appearance
          </Tab>
          <Tab value="isos" icon={<Disc className="h-4 w-4" />}>
            ISOs
          </Tab>
          <Tab value="scripts" icon={<FileCode className="h-4 w-4" />}>
            Scripts
          </Tab>
          <Tab value="packages" icon={<PackageIcon className="h-4 w-4" />}>
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
          <Card variant="default">
            <ScriptsSection embedded />
          </Card>
        </TabPanel>
        <TabPanel value="packages">
          <Card variant="default">
            <PackagesSection embedded />
          </Card>
        </TabPanel>
      </Tabs>

      <Spinner className="hidden" aria-hidden />
    </div>
  );
}
