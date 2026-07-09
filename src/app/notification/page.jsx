"use client";

import { useMemo } from "react";
import {
  Page,
  Card,
  Alert,
  EmptyState,
  Stat,
  IconTile,
  ResponsiveStack,
  ResponsiveGrid,
  Spinner,
  Button,
} from "@infinibay/harbor";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { useGlobalPendingRecommendationsQuery } from "@/gql/hooks";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { useRealtimeRefetch } from "@/hooks/useRealtimeRefetch";

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

/**
 * Notifications center. Reads the fleet-wide pending recommendations from the
 * backend via the same Apollo query that powers the header bell/dropdown
 * (globalPendingRecommendations) and renders them as a Harbor-native feed.
 * Each item exposes real dismiss / snooze actions through RecommendationCard;
 * acting on one refetches the list so the feed and header stay in sync.
 */
export default function NotificationsPage() {
  const { data, loading, error, refetch } =
    useGlobalPendingRecommendationsQuery({
      // Don't let a transient error blank out the last good list.
      notifyOnNetworkStatusChange: true,
    });
  // No polling: refetch when the backend finishes regenerating a VM's
  // recommendations ('recommendations:completed') instead of every 30s.
  useRealtimeRefetch("recommendations", refetch, { actions: ["completed"], minIntervalMs: 1000 });

  // Memoize so the `?? []` fallback doesn't produce a fresh array reference on
  // every render (which would invalidate the useMemo below each time).
  const recommendations = useMemo(
    () => data?.globalPendingRecommendations ?? [],
    [data],
  );

  // Only trust "empty"/"error" once we actually have (or lack) data.
  const isLoading = loading && recommendations.length === 0;
  const hasError = Boolean(error) && recommendations.length === 0;

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
              Recommendations and alerts surfaced by the backend arrive here
              and refresh automatically. Snooze or dismiss an item with its
              inline actions.
            </p>
          ),
        },
      ],
      quickTips: [
        "Critical items stay until dismissed or snoozed",
        "Use an item's actions to snooze or dismiss it",
        "The bell icon in the header shows the pending count",
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

  const summaryLabel = () => {
    if (isLoading) return "Loading notifications…";
    if (hasError) return "Unable to load notifications";
    return stats.total === 0
      ? "All clear across your fleet"
      : `${stats.total} item${stats.total !== 1 ? "s" : ""} to review`;
  };

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
                label={summaryLabel()}
                value={stats.total}
                variant="plain"
              />
            </ResponsiveStack>
          </ResponsiveStack>
        </ResponsiveStack>

        <ResponsiveGrid columns={{ base: 2, md: 4 }} gap={3}>
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

      {isLoading ? (
        <Card variant="default">
          <ResponsiveStack direction="row" gap={2} align="center" justify="center">
            <Spinner />
            <span className="text-fg-muted">Loading notifications…</span>
          </ResponsiveStack>
        </Card>
      ) : hasError ? (
        <Card variant="default">
          <ResponsiveStack direction="col" gap={3} align="center">
            <EmptyState
              icon={<AlertTriangle size={40} />}
              title="Couldn't load notifications"
              description={
                error?.message ||
                "Something went wrong fetching your notifications. Please try again."
              }
            />
            <Button size="sm" variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </ResponsiveStack>
        </Card>
      ) : recommendations.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={<CheckCircle size={40} />}
            title="All clear"
            description="No notifications right now. Your fleet is in a healthy state."
          />
        </Card>
      ) : (
        <Card variant="default">
          <ResponsiveStack direction="col" gap={0}>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onActionComplete={() => refetch()}
              />
            ))}
          </ResponsiveStack>
        </Card>
      )}

      <Alert tone="info">
        Snooze and dismiss actions apply immediately and update the header
        bell. One-click remediation is actioned from each VM&apos;s Scripts
        tab.
      </Alert>
    </Page>
  );
}
