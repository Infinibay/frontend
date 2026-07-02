"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Disc,
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
  IconTile,
  Progress,
  ResponsiveStack,
  ResponsiveGrid,
} from "@infinibay/harbor";

import { useSystemStatus } from "@/hooks/useSystemStatus";

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

// ─── ISOs tab ─────────────────────────────────────────────────────

export default function IsosTab() {
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
    if (isUploading) {
      toast.info("An upload is already in progress");
      return;
    }
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
    if (isUploading) {
      toast.info("An upload is already in progress");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file, osValue, true);
  };
  const openFileDialog = (osValue) => {
    if (isUploading) {
      toast.info("An upload is already in progress");
      return;
    }
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
          onChange={(e) => {
            handleFileSelect(e.target.files?.[0], selectedOS);
            // Reset so re-picking the same .iso (after Clear or a cancel) still fires onChange.
            e.target.value = "";
          }}
        />

        <div
          aria-busy={isUploading}
          style={
            isUploading ? { opacity: 0.6, pointerEvents: "none" } : undefined
          }
        >
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
        </div>
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
