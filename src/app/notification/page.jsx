"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Page,
  Card,
  Badge,
  Alert,
  EmptyState,
  Stat,
  IconTile,
  ResponsiveStack,
  ResponsiveGrid,
  Timestamp,
} from "@infinibay/harbor";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";

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

// Map semantic severity tones to IconTile's palette.
const toneToIconTile = (tone) => {
  switch (tone) {
    case "danger":
      return "rose";
    case "warning":
      return "amber";
    case "success":
      return "green";
    case "info":
      return "sky";
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
 * NotificationBell) and renders them as a chronological Harbor-native
 * feed. Dismiss / snooze actions still live on each individual
 * recommendation's detail view.
 */
export default function NotificationsPage() {
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
      icon: <Bell size={20} />,
      sections: [
        {
          id: "stream",
          title: "Notifications feed",
          icon: <Bell size={16} />,
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
    <Page size="xl" gap="lg">
      <Card variant="default">
        <ResponsiveStack
          direction={{ base: "col", lg: "row" }}
          gap={4}
          align="start"
          justify="between"
        >
          <ResponsiveStack direction="row" gap={3} align="start">
            <IconTile icon={<Bell size={20} />} tone="sky" size="md" />
            <ResponsiveStack direction="col" gap={1}>
              <Stat
                label={
                  stats.total === 0
                    ? "All clear across your fleet"
                    : `${stats.total} item${stats.total !== 1 ? "s" : ""} to review`
                }
                value={stats.total}
                variant="plain"
              />
            </ResponsiveStack>
          </ResponsiveStack>
        </ResponsiveStack>

        <ResponsiveGrid minItemWidth={160} gap={3}>
          <Stat
            label="Critical"
            value={stats.danger}
            icon={<AlertTriangle size={14} />}
          />
          <Stat label="Warnings" value={stats.warning} />
          <Stat label="Info" value={stats.info} />
          <Stat label="Resolved" value={stats.success} />
        </ResponsiveGrid>
      </Card>

      {recommendations.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={<CheckCircle size={40} />}
            title="All clear"
            description="No notifications right now. Your fleet is in a healthy state."
          />
        </Card>
      ) : (
        <ResponsiveStack direction="col" gap={3}>
          {recommendations.map((rec) => {
            const tone = severityTone(rec.severity);
            const Icon = severityIcon(rec.severity);
            return (
              <Card key={rec.id} variant="default" interactive>
                <ResponsiveStack direction="row" gap={4} align="start">
                  <IconTile
                    icon={<Icon size={20} />}
                    tone={toneToIconTile(tone)}
                    size="md"
                  />
                  <ResponsiveStack direction="col" gap={2} align="stretch">
                    <ResponsiveStack
                      direction={{ base: "col", md: "row" }}
                      gap={2}
                      justify="between"
                      align="start"
                      wrap
                    >
                      <ResponsiveStack direction="col" gap={1}>
                        <strong>
                          {rec.title || rec.type || "Notification"}
                        </strong>
                        <span>
                          {rec.description || rec.text || "No description"}
                        </span>
                      </ResponsiveStack>
                      <ResponsiveStack direction="row" gap={2} align="center">
                        <Badge tone={tone}>{rec.severity || "INFO"}</Badge>
                        {rec.machine?.name ? (
                          <Badge tone="neutral">{rec.machine.name}</Badge>
                        ) : null}
                      </ResponsiveStack>
                    </ResponsiveStack>
                    {rec.createdAt ? (
                      <Timestamp value={rec.createdAt} relative />
                    ) : null}
                  </ResponsiveStack>
                </ResponsiveStack>
              </Card>
            );
          })}
        </ResponsiveStack>
      )}

      <Alert tone="info">
        One-click actions for individual notifications (execute / dismiss /
        snooze) live on each recommendation&apos;s detail. Execution from
        this feed will be wired when the executeRecommendation mutation
        lands on the backend.
      </Alert>
    </Page>
  );
}
