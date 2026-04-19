"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button, Breadcrumbs } from "@infinibay/harbor";

import { useHelp } from "@/hooks/useHelp";
import { HelpSheet } from "@/components/ui/help-sheet";
import { useHeaderActions } from "@/contexts/HeaderActionContext";
import { NotificationBell } from "@/components/recommendations/NotificationBell";
import { selectUser } from "@/state/slices/auth";
import {
  selectHeaderBreadcrumbs,
  selectHeaderTitle,
  selectHeaderSubtitle,
  selectHeaderActions,
  selectHeaderHelpTooltip,
  selectHeaderBackButton,
} from "@/state/slices/header";

const iconMap = {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle,
};

/** Map shadcn-era action variants to Harbor Button variants. */
function harborVariant(v) {
  switch (v) {
    case "destructive":
      return "destructive";
    case "outline":
    case "secondary":
      return "secondary";
    case "ghost":
    case "link":
      return "ghost";
    default:
      return "primary";
  }
}

export function GlobalHeader() {
  const breadcrumbs = useSelector(selectHeaderBreadcrumbs);
  // Title is intentionally read but never rendered in the header —
  // pages own their own hero <h1>. The selector stays wired so
  // existing usePageHeader calls don't break.
  // eslint-disable-next-line no-unused-vars
  const _title = useSelector(selectHeaderTitle);
  const subtitle = useSelector(selectHeaderSubtitle);
  const actions = useSelector(selectHeaderActions);
  const helpTooltip = useSelector(selectHeaderHelpTooltip);
  const backButton = useSelector(selectHeaderBackButton);
  const user = useSelector(selectUser);

  const isAdmin = user?.role === "ADMIN";
  const { helpConfig } = useHelp();
  const { triggerAction } = useHeaderActions();
  const [helpSheetOpen, setHelpSheetOpen] = useState(false);

  // No header config? Render nothing.
  if (!breadcrumbs.length && !actions.length && !helpConfig && !backButton) {
    return null;
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-white/8 px-6 py-3 flex items-center gap-4"
      >
        {/* Left — back button + breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {backButton ? (
            <Link href={backButton.href} legacyBehavior passHref>
              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                {backButton.label || "Back"}
              </Button>
            </Link>
          ) : null}

          <div className="min-w-0 flex items-center gap-3">
            {breadcrumbs.length > 0 ? (
              <Breadcrumbs
                items={breadcrumbs.map((c) => ({
                  label: c.label,
                  href: c.isCurrent ? undefined : c.href,
                }))}
              />
            ) : null}
            {subtitle ? (
              <span className={subtitle.className || "text-xs text-fg-muted truncate"}>
                {subtitle.text}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right — notifications, help, page actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? <NotificationBell /> : null}

          {helpConfig ? (
            <Button
              variant="ghost"
              size="sm"
              icon={<HelpCircle className="h-4 w-4" />}
              onClick={() => setHelpSheetOpen(true)}
              title={helpTooltip || "Help"}
            >
              {""}
            </Button>
          ) : null}

          {actions.map((action) => {
            const IconComponent = action.icon ? iconMap[action.icon] : null;
            const iconEl = action.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : IconComponent ? (
              <IconComponent className="h-4 w-4" />
            ) : undefined;

            return (
              <Button
                key={action.id}
                variant={harborVariant(action.variant)}
                size="sm"
                loading={action.loading || undefined}
                disabled={action.disabled || false}
                icon={iconEl}
                onClick={() => triggerAction(action.id)}
                title={action.tooltip}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </header>

      <HelpSheet
        open={helpSheetOpen}
        onOpenChange={setHelpSheetOpen}
        config={helpConfig}
      />
    </>
  );
}
