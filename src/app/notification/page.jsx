"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Badge,
  Alert,
  EmptyState,
  Stat,
} from "@infinibay/harbor";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { usePageHeader } from "@/hooks/usePageHeader";

const severityTone = (severity) => {
  switch ((severity || "").toUpperCase()) {
    case "CRITICAL":
    case "ERROR":
      return "danger";
    case "HIGH":
    case "WARNING":
      return "warning";
    case "MEDIUM":
    case "INFO":
      return "info";
    case "LOW":
    case "SUCCESS":
      return "success";
    default:
      return "neutral";
  }
};

const severityIcon = (severity) => {
  switch ((severity || "").toUpperCase()) {
    case "CRITICAL":
    case "ERROR":
    case "HIGH":
    case "WARNING":
      return AlertTriangle;
    case "LOW":
    case "SUCCESS":
      return CheckCircle;
    case "INFO":
    default:
      return Info;
  }
};

/**
 * Notifications center. Reads system-generated recommendations from
 * Redux (populated by the socket subscription in the app chrome's
 * NotificationBell) and renders them as a chronological feed of
 * lightweight status Cards. No new mutations — dismiss / snooze
 * actions still live on each individual recommendation's detail view.
 */
export default function NotificationsPage() {
  // Recommendations stream into Redux via the recommendations slice.
  const recommendations = useSelector(
    (state) =>
      state.health?.recommendations ||
      state.recommendations?.items ||
      []
  );

  const stats = useMemo(() => {
    const byTone = {
      danger: 0,
      warning: 0,
      info: 0,
      success: 0,
      total: recommendations.length,
    };
    recommendations.forEach((r) => {
      const tone = severityTone(r.severity);
      if (byTone[tone] !== undefined) byTone[tone] += 1;
    });
    return byTone;
  }, [recommendations]);

  const helpConfig = useMemo(
    () => ({
      title: "Notifications",
      description: "Everything the system flagged across your fleet.",
      icon: <Bell className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "stream",
          title: "Notifications feed",
          icon: <Bell className="h-4 w-4" />,
          content: (
            <p>
              Recommendations, alerts and status changes surfaced by the
              backend arrive here in real time. Click any item to open
              its source VM or resource.
            </p>
          ),
        },
      ],
      quickTips: [
        "Critical items stay until acknowledged",
        "Click an item to jump to its context",
        "The bell icon in the header shows unread count",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Notifications", isCurrent: true },
      ],
      title: "Notifications",
      actions: [],
      helpConfig,
      helpTooltip: "Notifications help",
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Hero + stats */}
      <Card variant="glass" className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-fg">Notifications</h1>
              <p className="text-sm text-fg-muted mt-1">
                {stats.total === 0
                  ? "All clear across your fleet."
                  : `${stats.total} item${stats.total !== 1 ? "s" : ""} to review.`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Stat label="Critical" value={stats.danger} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
          <Stat label="Warnings" value={stats.warning} />
          <Stat label="Info" value={stats.info} />
          <Stat label="Resolved" value={stats.success} />
        </div>
      </Card>

      {/* Feed */}
      {recommendations.length === 0 ? (
        <Card variant="default" className="p-0">
          <EmptyState
            icon={<CheckCircle className="h-10 w-10 text-success" />}
            title="All clear"
            description="No notifications right now. Your fleet is in a healthy state."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const tone = severityTone(rec.severity);
            const Icon = severityIcon(rec.severity);
            return (
              <Card key={rec.id} variant="default" interactive className="!p-0">
                <div className="p-4 flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                      tone === "danger"
                        ? "bg-danger/15 text-danger"
                        : tone === "warning"
                          ? "bg-warning/15 text-warning"
                          : tone === "success"
                            ? "bg-success/15 text-success"
                            : "bg-accent-2/15 text-accent-2"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-fg truncate">
                          {rec.title || rec.type || "Notification"}
                        </h3>
                        <p className="text-xs text-fg-muted mt-0.5 line-clamp-2">
                          {rec.description || rec.text || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge tone={tone}>{rec.severity || "INFO"}</Badge>
                        {rec.machine?.name ? (
                          <Badge tone="neutral">{rec.machine.name}</Badge>
                        ) : null}
                      </div>
                    </div>
                    {rec.createdAt ? (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-fg-subtle">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(rec.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Alert tone="info">
        One-click actions for individual notifications (execute /
        dismiss / snooze) live on each recommendation&apos;s detail.
        Execution from this feed will be wired when the
        <code className="mx-1 px-1 bg-surface-1 rounded text-[11px]">
          executeRecommendation
        </code>
        mutation lands on the backend.
      </Alert>
    </div>
  );
}
