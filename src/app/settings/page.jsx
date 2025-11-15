"use client"

import SettingMain from "@/components/settings/SettingMain"
import React, { useMemo } from "react"
import { usePageHeader } from "@/hooks/usePageHeader"
import { Settings as SettingsIcon, Palette, FileCode, Disc, Wrench } from "lucide-react"

export default function SettingsPage() {
  const helpConfig = useMemo(() => ({
    title: "Settings Help",
    description: "Learn how to configure your Infinibay system preferences",
    icon: <SettingsIcon className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "theme",
        title: "Theme Preferences",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Theme Selection</p>
            <p>Choose between light, dark, or system-based themes. The system theme automatically follows your operating system preference.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Wallpapers</p>
            <p>Customize your background with built-in wallpapers or upload custom images to personalize your Infinibay experience.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Glass Effects</p>
            <p>Adjust transparency and blur intensity for UI elements. Higher values create more pronounced glass effects.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Live Preview</p>
            <p>Changes apply immediately, giving you instant feedback on your theme customizations without needing to save.</p>
          </div>
        )
      },
      {
        id: "scripts",
        title: "Scripts Management",
        icon: <FileCode className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Script Library</p>
            <p>Create and manage automation scripts for VMs. Scripts can automate maintenance tasks, configuration, security checks, and monitoring.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Categories</p>
            <p>Organize scripts by category: Maintenance, Security, Configuration, and Monitoring. This helps keep your automation organized.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Import/Export</p>
            <p>Backup and share scripts between installations. Export your script library for safekeeping or sharing with team members.</p>

            <p className="font-medium text-foreground mb-1 mt-3">OS Compatibility</p>
            <p>Scripts can target Windows, Linux, or both operating systems. Make sure to select the appropriate OS when creating scripts.</p>
          </div>
        )
      },
      {
        id: "iso",
        title: "ISO Management",
        icon: <Disc className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Upload ISOs</p>
            <p>Add operating system installation media to your library. Supported formats include ISO files for Windows, Linux, and other operating systems.</p>

            <p className="font-medium text-foreground mb-1 mt-3">ISO Library</p>
            <p>View and manage all available ISO files. You can see file sizes, upload dates, and which templates use each ISO.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Template Creation</p>
            <p>Use uploaded ISOs to create VM templates. Templates define the base configuration for new virtual machines.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Storage</p>
            <p>Monitor disk space usage for ISO files. Large ISO files can consume significant storage, so manage them carefully.</p>
          </div>
        )
      },
      {
        id: "system",
        title: "System Configuration",
        icon: <Wrench className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Global Settings</p>
            <p>Configure system-wide preferences that apply to all users and virtual machines. These are foundational settings for your Infinibay installation.</p>

            <p className="font-medium text-foreground mb-1 mt-3">User Management</p>
            <p>Admins can manage user accounts and permissions. Control who has access to VMs and what actions they can perform.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Network Settings</p>
            <p>Configure network defaults for new VMs. This includes IP addressing, DNS settings, and default firewall rules.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Backup Settings</p>
            <p>Configure automatic backup schedules for your virtual machines. Regular backups help protect against data loss.</p>
          </div>
        )
      }
    ],
    quickTips: [
      "Use the refresh button to reload settings after external changes",
      "Theme changes apply immediately without saving",
      "Export scripts regularly to backup your automation library",
      "System theme follows your OS preference automatically"
    ]
  }), []);

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', isCurrent: true }
    ],
    title: 'Settings',
    actions: [],
    helpConfig: helpConfig,
    helpTooltip: 'Settings help'
  }, []);

  return (
    <div className="pb-4 lg:pb-0">
      <SettingMain />
    </div>
  );
}
