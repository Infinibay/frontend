"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Palette, Sun, Moon, Monitor as MonitorIcon } from "lucide-react";
import { Card, SegmentedControl, ResponsiveStack } from "@infinibay/harbor";

import { useAppTheme } from "@/contexts/ThemeProvider";
import {
  fetchAppSettings,
  updateAppSettings,
  selectAppSettings,
  selectAppSettingsInitialized,
  setThemePreference,
} from "@/state/slices/appSettings";
import BrandingSection from "@/components/settings/BrandingSection";

// ─── Appearance tab ───────────────────────────────────────────────

export default function AppearanceTab() {
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
        description="Choose light, dark, or follow the OS."
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
