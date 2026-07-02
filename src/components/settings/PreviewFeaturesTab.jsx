"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FlaskConical } from "lucide-react";
import { Card, ResponsiveStack, Switch } from "@infinibay/harbor";

import {
  selectFeatureFlagMeta,
  fetchFeatureFlags,
} from "@/state/slices/featureFlags";
import auth from "@/utils/auth";

// ─── Preview features tab ─────────────────────────────────────────

export default function PreviewFeaturesTab() {
  const dispatch = useDispatch();
  const flags = useSelector(selectFeatureFlagMeta);
  const role = useSelector((s) => s.auth.user?.role);
  const canToggle = role === "SUPER_ADMIN";
  // Per-flag optimistic override while a toggle is in flight ({ [key]: bool }).
  // Lets the knob move immediately and disables the switch until the round-trip
  // settles, preventing double-toggles.
  const [pending, setPending] = useState({});

  useEffect(() => {
    dispatch(fetchFeatureFlags());
  }, [dispatch]);

  const handleToggle = async (flag, checked) => {
    if (pending[flag.key] !== undefined) return;
    setPending((p) => ({ ...p, [flag.key]: checked }));
    try {
      await auth.setFeatureFlag(flag.key, checked);
      await dispatch(fetchFeatureFlags());
      toast.success(
        `${flag.label} ${checked ? "enabled" : "disabled"}`
      );
    } catch (err) {
      toast.error(
        `Could not update ${flag.label}: ${err.message || err}`
      );
    } finally {
      setPending((p) => {
        const next = { ...p };
        delete next[flag.key];
        return next;
      });
    }
  };

  return (
    <ResponsiveStack direction="col" gap={6}>
      <Card
        variant="default"
        leadingIcon={<FlaskConical size={20} />}
        leadingIconTone="amber"
        title="Preview features"
        description="Enable experimental / not-yet-complete features. Off by default."
      >
        <ResponsiveStack direction="col" gap={4}>
          {!canToggle && (
            <span className="text-fg-subtle text-xs">
              Only a super admin can change feature flags.
            </span>
          )}
          {flags.map((flag) => {
            const isPending = pending[flag.key] !== undefined;
            return (
              <Switch
                key={flag.key}
                label={flag.label}
                description={flag.description}
                checked={isPending ? pending[flag.key] : flag.enabled}
                disabled={!canToggle || isPending}
                onChange={(e) => handleToggle(flag, e.target.checked)}
              />
            );
          })}
        </ResponsiveStack>
      </Card>
    </ResponsiveStack>
  );
}
