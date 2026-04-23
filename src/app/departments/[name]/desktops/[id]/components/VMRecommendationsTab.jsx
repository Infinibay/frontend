import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingOverlay,
  Page,
  ResponsiveStack,
  Select,
  TextField,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Search,
  Shield,
} from 'lucide-react';

import useVMRecommendations from '@/hooks/useVMRecommendations';
import { RecommendationsGeneralHelp } from './RecommendationHelp';
import RecommendationActions from './RecommendationActions';
import {
  CATEGORIES,
  PRIORITY_LEVELS,
  URGENCY_BADGES,
  extractRecommendationMetadata,
  getCategoryInfo,
  getRecommendationInfo,
  isFallbackType,
} from '@/utils/recommendationTypeMapper';

const priorityToBadgeTone = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.CRITICAL:
      return 'danger';
    case PRIORITY_LEVELS.HIGH:
      return 'warning';
    case PRIORITY_LEVELS.MEDIUM:
      return 'info';
    case PRIORITY_LEVELS.LOW:
      return 'neutral';
    default:
      return 'neutral';
  }
};

const priorityToCardTone = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.CRITICAL:
      return 'rose';
    case PRIORITY_LEVELS.HIGH:
      return 'amber';
    case PRIORITY_LEVELS.MEDIUM:
      return 'sky';
    case PRIORITY_LEVELS.LOW:
      return 'neutral';
    default:
      return 'purple';
  }
};

const priorityLabel = (priority) => {
  if (priority === PRIORITY_LEVELS.CRITICAL) return 'Critical';
  if (priority === PRIORITY_LEVELS.HIGH) return 'High';
  if (priority === PRIORITY_LEVELS.MEDIUM) return 'Medium';
  if (priority === PRIORITY_LEVELS.LOW) return 'Low';
  return '';
};

const VMRecommendationsTab = ({ vmId, vmStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const {
    recommendations = [],
    summary,
    categoryStats,
    requiresImmediateAttention,
    lastUpdateTime,
    isLoading,
    isRefreshing,
    error,
    refreshRecommendations,
  } = useVMRecommendations(vmId, { pollInterval: 60_000 }) || {};

  const filtered = useMemo(() => {
    let list = [...recommendations];
    if (searchTerm.trim()) {
      const needle = searchTerm.toLowerCase();
      list = list.filter((rec) => {
        const info = getRecommendationInfo(rec.type);
        return (
          (info.label || '').toLowerCase().includes(needle) ||
          (info.description || '').toLowerCase().includes(needle) ||
          (rec.text || '').toLowerCase().includes(needle) ||
          (info.userFriendlyExplanation || '').toLowerCase().includes(needle)
        );
      });
    }
    if (filterPriority !== 'all') {
      list = list.filter(
        (rec) => getRecommendationInfo(rec.type).priority === filterPriority,
      );
    }
    if (filterCategory !== 'all') {
      list = list.filter(
        (rec) => getRecommendationInfo(rec.type).category === filterCategory,
      );
    }
    return list;
  }, [recommendations, searchTerm, filterPriority, filterCategory]);

  const priorityCounts = useMemo(() => {
    const counts = {
      [PRIORITY_LEVELS.CRITICAL]: 0,
      [PRIORITY_LEVELS.HIGH]: 0,
      [PRIORITY_LEVELS.MEDIUM]: 0,
      [PRIORITY_LEVELS.LOW]: 0,
    };
    recommendations.forEach((rec) => {
      const p = getRecommendationInfo(rec.type).priority;
      if (counts[p] !== undefined) counts[p] += 1;
    });
    return counts;
  }, [recommendations]);

  const priorityOptions = useMemo(
    () => [
      { value: 'all', label: `All priorities · ${recommendations.length}` },
      {
        value: PRIORITY_LEVELS.CRITICAL,
        label: `Critical · ${priorityCounts[PRIORITY_LEVELS.CRITICAL]}`,
      },
      {
        value: PRIORITY_LEVELS.HIGH,
        label: `High · ${priorityCounts[PRIORITY_LEVELS.HIGH]}`,
      },
      {
        value: PRIORITY_LEVELS.MEDIUM,
        label: `Medium · ${priorityCounts[PRIORITY_LEVELS.MEDIUM]}`,
      },
      {
        value: PRIORITY_LEVELS.LOW,
        label: `Low · ${priorityCounts[PRIORITY_LEVELS.LOW]}`,
      },
    ],
    [recommendations.length, priorityCounts],
  );

  const categoryOptions = useMemo(() => {
    const opts = [{ value: 'all', label: 'All categories' }];
    Object.values(CATEGORIES).forEach((c) => {
      const count = categoryStats?.[c] || 0;
      if (count > 0) {
        opts.push({
          value: c,
          label: `${getCategoryInfo(c).label} · ${count}`,
        });
      }
    });
    return opts;
  }, [categoryStats]);

  const renderHeader = () => (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      leadingIcon={<Lightbulb size={18} />}
      leadingIconTone="amber"
      title={
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          <span>Recommendations</span>
          {requiresImmediateAttention ? (
            <Badge tone="danger" pulse icon={<AlertTriangle size={12} />}>
              Needs attention
            </Badge>
          ) : null}
        </ResponsiveStack>
      }
      description={
        <ResponsiveStack direction="row" gap={3} wrap align="center">
          <span>{summary?.total ?? recommendations.length} from last scan</span>
          {summary?.urgent > 0 ? (
            <Badge tone="danger" pulse>
              {summary.urgent} urgent
            </Badge>
          ) : null}
          {summary?.rebootPending > 0 ? (
            <Badge tone="warning">{summary.rebootPending} reboot pending</Badge>
          ) : null}
          {summary?.securityUpdates > 0 ? (
            <Badge tone="warning" icon={<Shield size={12} />}>
              {summary.securityUpdates} security updates
            </Badge>
          ) : null}
          {summary?.activeThreats > 0 ? (
            <Badge tone="danger" pulse>
              {summary.activeThreats} active threats
            </Badge>
          ) : null}
          {lastUpdateTime ? (
            <span style={{ opacity: 0.7 }}>
              updated {new Date(lastUpdateTime).toLocaleTimeString('en-US')}
            </span>
          ) : null}
        </ResponsiveStack>
      }
      footer={
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          <Button
            size="sm"
            variant="primary"
            icon={<RefreshCw size={14} />}
            onClick={refreshRecommendations}
            disabled={isRefreshing}
            loading={isRefreshing}
          >
            {isRefreshing ? 'Scanning…' : 'Scan now'}
          </Button>
        </ResponsiveStack>
      }
    />
  );

  if (isLoading) {
    return (
      <Page>
        <RecommendationsGeneralHelp />
        <Card variant="default" spotlight={false} glow={false}>
          <LoadingOverlay label="Loading recommendations from last scan…" />
        </Card>
      </Page>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <Page>
        <RecommendationsGeneralHelp />
        <Alert
          tone="danger"
          icon={<AlertTriangle size={14} />}
          title="Could not load recommendations"
          actions={
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              onClick={refreshRecommendations}
            >
              Retry
            </Button>
          }
        >
          We couldn&apos;t load recommendations from the last health scan for this
          VM.
        </Alert>
      </Page>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Page>
        <RecommendationsGeneralHelp />
        <Alert
          tone="success"
          icon={<CheckCircle size={14} />}
          title="Excellent — your desktop is optimised"
          actions={
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              onClick={refreshRecommendations}
              disabled={isRefreshing}
              loading={isRefreshing}
            >
              {isRefreshing ? 'Scanning…' : 'Run new scan'}
            </Button>
          }
        >
          No improvement recommendations at this time. Your desktop is running
          optimally.
        </Alert>
      </Page>
    );
  }

  return (
    <Page>
      <RecommendationsGeneralHelp />

      {renderHeader()}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          background: 'rgb(var(--harbor-bg-elev-1))',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 12,
          padding: 10,
        }}
      >
        <div style={{ flex: '1 1 220px', minWidth: 200, maxWidth: 360 }}>
          <TextField
            placeholder="Search recommendations…"
            icon={<Search size={14} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <Select
            options={priorityOptions}
            value={filterPriority}
            onChange={setFilterPriority}
          />
        </div>
        {categoryOptions.length > 1 ? (
          <div style={{ minWidth: 180 }}>
            <Select
              options={categoryOptions}
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>
        ) : null}
        <div style={{ marginLeft: 'auto', opacity: 0.7, fontSize: 12 }}>
          {filtered.length} of {recommendations.length}
        </div>
      </div>

      <ResponsiveStack direction="col" gap={3}>
        {filtered.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<Search size={18} />}
            title="No matching recommendations"
            description="None of the current recommendations match your filters."
          />
        ) : (
          filtered.map((rec) => {
            const info = getRecommendationInfo(rec.type, rec);
            const metadata = extractRecommendationMetadata(rec);
            const urgencyBadgeConfig = info.urgencyBadge
              ? URGENCY_BADGES[info.urgencyBadge]
              : null;
            const IconComp = info.icon;

            return (
              <Card
                key={rec.id}
                variant="default"
                spotlight={false}
                glow={false}
                leadingIcon={IconComp ? <IconComp size={16} /> : <Lightbulb size={16} />}
                leadingIconTone={priorityToCardTone(info.priority)}
                title={
                  <ResponsiveStack direction="row" gap={2} align="center" wrap>
                    <span>{info.label}</span>
                    <Badge tone={priorityToBadgeTone(info.priority)}>
                      {priorityLabel(info.priority)}
                    </Badge>
                    {urgencyBadgeConfig ? (
                      <Badge tone={priorityToBadgeTone(info.priority)}>
                        {urgencyBadgeConfig.text}
                      </Badge>
                    ) : null}
                    <Badge tone="neutral">
                      {getCategoryInfo(info.category).label}
                    </Badge>
                    {isFallbackType(rec.type) ? (
                      <Badge tone="neutral">{rec.type}</Badge>
                    ) : null}
                  </ResponsiveStack>
                }
                description={
                  <span style={{ display: 'block', lineHeight: 1.5 }}>
                    {rec.text || info.description}
                  </span>
                }
                footer={
                  <RecommendationActions
                    recommendation={rec}
                    vmId={vmId}
                    vmStatus={vmStatus}
                  />
                }
              >
                {(rec.type === 'OS_UPDATE_AVAILABLE' ||
                  rec.type === 'SYSTEM_UPDATE_AVAILABLE') &&
                metadata?.rebootDays ? (
                  <div style={{ marginTop: 8 }}>
                    <Badge tone="warning" icon={<AlertTriangle size={12} />}>
                      Waiting {metadata.rebootDays} day
                      {metadata.rebootDays !== 1 ? 's' : ''} for reboot
                    </Badge>
                  </div>
                ) : null}
                {rec.type === 'APP_UPDATE_AVAILABLE' &&
                metadata?.securityUpdateCount > 0 ? (
                  <div style={{ marginTop: 8 }}>
                    <Badge tone="warning" icon={<Shield size={12} />}>
                      {metadata.securityUpdateCount} security update
                      {metadata.securityUpdateCount !== 1 ? 's' : ''} pending
                      {metadata.totalUpdateCount > metadata.securityUpdateCount
                        ? ` · ${metadata.totalUpdateCount} total`
                        : ''}
                    </Badge>
                  </div>
                ) : null}
                {rec.type === 'PORT_BLOCKED' &&
                metadata?.blockedPorts?.length > 0 ? (
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {metadata.blockedPorts.map((port, idx) => (
                      <Badge
                        key={idx}
                        tone="warning"
                        icon={<Shield size={12} />}
                      >
                        Port {port.port} ({port.protocol}) · {port.processName}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {rec.type === 'DEFENDER_THREAT' && metadata?.threatCount > 0 ? (
                  <div style={{ marginTop: 8 }}>
                    <Badge tone="danger" icon={<AlertTriangle size={12} />}>
                      {metadata.threatCount} threat
                      {metadata.threatCount !== 1 ? 's' : ''} detected
                      {metadata.activeThreats > 0
                        ? ` · ${metadata.activeThreats} active`
                        : ''}
                    </Badge>
                  </div>
                ) : null}
              </Card>
            );
          })
        )}
      </ResponsiveStack>
    </Page>
  );
};

export default VMRecommendationsTab;
