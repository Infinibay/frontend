"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Settings as SettingsIcon,
  Palette,
  Package as PackageIcon,
  Disc,
  FileCode,
  FlaskConical,
  MonitorPlay,
} from "lucide-react";
import { Page, Tabs, TabList, Tab, TabPanel } from "@infinibay/harbor";

import { usePageHeader } from "@/hooks/usePageHeader";
import { PageHeader } from "@/components/common/PageHeader";
import ScriptsSection from "@/components/settings/ScriptsSection";
import PackagesSection from "@/components/settings/PackagesSection";
import AppearanceTab from "@/components/settings/AppearanceTab";
import IsosTab from "@/components/settings/IsosTab";
import PreviewFeaturesTab from "@/components/settings/PreviewFeaturesTab";
import GpuViewerSection from "@/components/settings/GpuViewerSection";

// ─── Page root ────────────────────────────────────────────────────

const VALID_TABS = ["appearance", "isos", "scripts", "packages", "preview", "downloads"];
const DEFAULT_TAB = "appearance";

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive the initial tab from the URL so refresh / back / deep-links land
  // on the requested tab instead of always resetting to Appearance.
  const tabFromUrl = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(() =>
    VALID_TABS.includes(tabFromUrl) ? tabFromUrl : DEFAULT_TAB
  );

  // Keep the active tab in sync with browser navigation (back/forward, or an
  // externally-changed ?tab= value).
  useEffect(() => {
    const next = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
    setActiveTab((current) => (current === next ? current : next));
  }, [tabFromUrl]);

  const handleTabChange = useCallback(
    (value) => {
      const next = VALID_TABS.includes(value) ? value : DEFAULT_TAB;
      setActiveTab(next);
      const params = new URLSearchParams(searchParams?.toString());
      params.set("tab", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

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
        {
          id: "preview",
          title: "Preview features",
          icon: <FlaskConical size={16} />,
          content: (
            <p>
              Toggle experimental, not-yet-complete features. They are off
              by default; only a super admin can change them.
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

      <Tabs value={activeTab} onValueChange={handleTabChange} variant="underline">
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
          <Tab value="preview" icon={<FlaskConical size={16} />}>
            Preview features
          </Tab>
          <Tab value="downloads" icon={<MonitorPlay size={16} />}>
            Downloads
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
        <TabPanel value="preview">
          <PreviewFeaturesTab />
        </TabPanel>
        <TabPanel value="downloads">
          <GpuViewerSection />
        </TabPanel>
      </Tabs>
    </Page>
  );
}
