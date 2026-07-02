"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Palette } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  ColorPicker,
  ResponsiveStack,
  ResponsiveGrid,
} from "@infinibay/harbor";

import {
  updateAppSettings,
  selectAppSettings,
  setAccentColor,
  setAccent2Color,
  setAccent3Color,
  setThemePreset,
  setBrandName,
  setLogoUrl,
} from "@/state/slices/appSettings";
import {
  THEME_PRESETS,
  getPreset,
  deriveAccentTrio,
  isValidHex,
} from "@/lib/themePresets";

// ─── Branding (whitelabel) sub-section ────────────────────────────

export default function BrandingSection() {
  const dispatch = useDispatch();
  const appSettings = useSelector(selectAppSettings);

  // Snapshot of what's in the backend. We never want to compare the
  // "dirty" state against the Redux live-preview copy (which this
  // component itself keeps mutating for real-time preview) — we want
  // to compare against what was last persisted. The snapshot refreshes
  // after every successful save.
  const [saved, setSaved] = useState({
    logoUrl: appSettings?.logoUrl || "",
    brandName: appSettings?.brandName || "",
    themePreset: appSettings?.themePreset || "",
    accentColor: appSettings?.accentColor || "",
  });
  const [saving, setSaving] = useState(false);

  const [logo, setLogo] = useState(appSettings?.logoUrl || "");
  const [brand, setBrand] = useState(appSettings?.brandName || "");
  const [preset, setPreset] = useState(appSettings?.themePreset || "");
  const [accent, setAccent] = useState(appSettings?.accentColor || "");
  // Live preview of derived trio for whichever mode is active.
  const derivedTrio = useMemo(() => {
    if (preset) {
      const p = getPreset(preset);
      if (p) return { accent: p.accent, accent2: p.accent2, accent3: p.accent3 };
    }
    if (isValidHex(accent)) return deriveAccentTrio(accent);
    return null;
  }, [preset, accent]);

  const dirty =
    (logo || "") !== saved.logoUrl ||
    (brand || "") !== saved.brandName ||
    (preset || "") !== saved.themePreset ||
    (accent || "") !== saved.accentColor;

  const handleSave = async () => {
    if (saving) return;
    // Exactly one of (preset, custom) wins; the other clears.
    const next = {
      logoUrl: logo || null,
      brandName: brand || null,
      themePreset: preset || null,
      accentColor: preset ? null : accent || null,
      accent2Color: preset ? null : derivedTrio?.accent2 || null,
      accent3Color: preset ? null : derivedTrio?.accent3 || null,
    };
    dispatch(setLogoUrl(next.logoUrl));
    dispatch(setBrandName(next.brandName));
    dispatch(setThemePreset(next.themePreset));
    dispatch(setAccentColor(next.accentColor));
    dispatch(setAccent2Color(next.accent2Color));
    dispatch(setAccent3Color(next.accent3Color));
    setSaving(true);
    try {
      await dispatch(updateAppSettings(next)).unwrap();
      // Refresh the "saved" snapshot so dirty flips back to false and
      // the Save button disables until the next change.
      setSaved({
        logoUrl: next.logoUrl || "",
        brandName: next.brandName || "",
        themePreset: next.themePreset || "",
        accentColor: next.accentColor || "",
      });
      toast.success("Branding saved");
    } catch (err) {
      toast.error(`Could not save branding: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Revert local form AND live Redux preview back to the saved snapshot.
    setLogo(saved.logoUrl);
    setBrand(saved.brandName);
    setPreset(saved.themePreset);
    setAccent(saved.accentColor);
    const p = saved.themePreset ? getPreset(saved.themePreset) : null;
    const derived = !p && isValidHex(saved.accentColor)
      ? deriveAccentTrio(saved.accentColor)
      : null;
    dispatch(setThemePreset(saved.themePreset || null));
    dispatch(setAccentColor(derived ? derived.accent : null));
    dispatch(setAccent2Color(p ? p.accent2 : derived ? derived.accent2 : null));
    dispatch(setAccent3Color(p ? p.accent3 : derived ? derived.accent3 : null));
  };

  // Live preview — each pick dispatches to Redux so the theme is applied
  // immediately across the UI. Save persists to the backend; Reset
  // re-applies whatever is currently stored server-side.
  const pickPreset = (id) => {
    const next = id === preset ? "" : id;
    setPreset(next);
    setAccent("");
    const p = next ? getPreset(next) : null;
    dispatch(setThemePreset(next || null));
    dispatch(setAccentColor(null));
    dispatch(setAccent2Color(p ? p.accent2 : null));
    dispatch(setAccent3Color(p ? p.accent3 : null));
  };

  const pickCustom = (hex) => {
    setAccent(hex);
    setPreset("");
    const derived = isValidHex(hex) ? deriveAccentTrio(hex) : null;
    dispatch(setThemePreset(null));
    dispatch(setAccentColor(derived ? derived.accent : null));
    dispatch(setAccent2Color(derived ? derived.accent2 : null));
    dispatch(setAccent3Color(derived ? derived.accent3 : null));
  };

  return (
    <Card
      variant="default"
      leadingIcon={<Palette size={20} />}
      leadingIconTone="purple"
      title="Branding"
      description="Pick a palette preset or a custom accent. Changes flow through the whole UI — sidebar glow, buttons, status chips, the login animation."
    >
      <ResponsiveStack direction="col" gap={5}>
        <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
          <TextField
            label="Logo URL"
            placeholder="https://cdn.example.com/logo.svg"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            hint="Shown in the sidebar and on the login page."
          />
          <TextField
            label="Brand name"
            placeholder="Acme Cloud"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            hint="Replaces “Infinibay” in the topbar and tab titles."
          />
        </ResponsiveGrid>

        <div>
          <span className="text-fg-muted text-sm">Palette preset</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 10,
              marginTop: 8,
            }}
          >
            {THEME_PRESETS.map((p) => {
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickPreset(p.id)}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderRadius: 10,
                    border: active
                      ? `1px solid ${p.accent}`
                      : "1px solid var(--harbor-border-subtle)",
                    background: active
                      ? `linear-gradient(135deg, ${p.accent}18, ${p.accent2}10)`
                      : "rgb(var(--harbor-bg-elev-1))",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    transition: "border-color 120ms, background 120ms",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: p.accent }} />
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: p.accent2 }} />
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: p.accent3 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                  <div className="text-fg-subtle" style={{ fontSize: 11, lineHeight: 1.3 }}>
                    {p.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <ResponsiveStack direction="col" gap={2}>
          <span className="text-fg-muted text-sm">Custom accent</span>
          <span className="text-fg-subtle text-xs">
            Overrides the preset. Companion colors are derived automatically
            (+150° complement, +30° analogous).
          </span>
          <ResponsiveStack direction="row" gap={3} align="center">
            <ColorPicker
              value={accent || "#A855F7"}
              onChange={pickCustom}
            />
            {derivedTrio && !preset ? (
              <ResponsiveStack direction="row" gap={1} align="center">
                <span className="text-fg-subtle text-xs">Derived:</span>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: derivedTrio.accent }} />
                <span style={{ width: 18, height: 18, borderRadius: 5, background: derivedTrio.accent2 }} />
                <span style={{ width: 18, height: 18, borderRadius: 5, background: derivedTrio.accent3 }} />
              </ResponsiveStack>
            ) : null}
            {accent ? (
              <span className="text-fg-subtle font-mono text-xs">{accent}</span>
            ) : null}
          </ResponsiveStack>
        </ResponsiveStack>

        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={!dirty || saving}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!dirty || saving}
            loading={saving}
          >
            Save branding
          </Button>
        </ResponsiveStack>
      </ResponsiveStack>
    </Card>
  );
}
