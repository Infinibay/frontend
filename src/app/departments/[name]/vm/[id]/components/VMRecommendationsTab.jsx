import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  LoadingOverlay,
  Page,
  ResponsiveStack,
  SegmentedControl,
  TextField,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  Search,
  Shield,
} from 'lucide-react';

import useVMRecommendations from '@/hooks/useVMRecommendations';
import RecommendationHelp, {
  RecommendationsGeneralHelp,
} from './RecommendationHelp';
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

const priorityToAlertTone = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.CRITICAL:
      return 'danger';
    case PRIORITY_LEVELS.HIGH:
      return 'warning';
    case PRIORITY_LEVELS.MEDIUM:
      return 'info';
    default:
      return 'info';
  }
};

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

const priorityLabel = (priority) => {
  if (priority === PRIORITY_LEVELS.CRITICAL) return 'Critical';
  if (priority === PRIORITY_LEVELS.HIGH) return 'High';
  if (priority === PRIORITY_LEVELS.MEDIUM) return 'Medium';
  if (priority === PRIORITY_LEVELS.LOW) return 'Low';
  return '';
};

const VMRecommendationsTab = ({ vmId, vmStatus }) => {
  const [expandedRec, setExpandedRec] = useState(null);
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

  const toggleExpanded = (id) =>
    setExpandedRec((prev) => (prev === id ? null : id));

  const priorityItems = useMemo(
    () => [
      { value: 'all', label: `All (${recommendations.length})` },
      { value: PRIORITY_LEVELS.CRITICAL, label: 'Critical' },
      { value: PRIORITY_LEVELS.HIGH, label: 'High' },
      { value: PRIORITY_LEVELS.MEDIUM, label: 'Medium' },
      { value: PRIORITY_LEVELS.LOW, label: 'Low' },
    ],
    [recommendations.length],
  );

  const categoryItems = useMemo(() => {
    const base = [{ value: 'all', label: 'All categories' }];
    Object.values(CATEGORIES).forEach((c) => {
      const count = categoryStats?.[c] || 0;
      if (count > 0) {
        base.push({
          value: c,
          label: `${getCategoryInfo(c).label} · ${count}`,
        });
      }
    });
    return base;
  }, [categoryStats]);

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
          title="Excellent — your VM is optimised"
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
          No improvement recommendations at this time. Your virtual machine is
          running optimally.
        </Alert>
      </Page>
    );
  }

  return (
    <Page>
        <RecommendationsGeneralHelp />

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Lightbulb size={18} />}
          leadingIconTone="amber"
          title={
            <ResponsiveStack direction="row" gap={2} align="center">
              <span>Recommendations</span>
              {requiresImmediateAttention ? (
                <Badge tone="danger" pulse icon={<AlertTriangle size={12} />}>
                  Attention
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
                <span>
                  updated {new Date(lastUpdateTime).toLocaleTimeString('en-US')}
                </span>
              ) : null}
            </ResponsiveStack>
          }
          footer={
            <ResponsiveStack
              direction={{ base: 'col', md: 'row' }}
              gap={3}
              align={{ base: 'stretch', md: 'center' }}
            >
              <SegmentedControl
                items={priorityItems}
                value={filterPriority}
                onChange={setFilterPriority}
                size="sm"
              />
              {categoryItems.length > 1 ? (
                <SegmentedControl
                  items={categoryItems}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  size="sm"
                />
              ) : null}
              <TextField
                placeholder="Search recommendations…"
                icon={<Search size={14} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              const isExpanded = expandedRec === rec.id;
              const IconComp = info.icon;

              return (
                <Alert
                  key={rec.id}
                  tone={priorityToAlertTone(info.priority)}
                  icon={IconComp ? <IconComp size={14} /> : undefined}
                  title={
                    <ResponsiveStack direction="row" gap={2} align="center" wrap>
                      <span>{info.label}</span>
                      {urgencyBadgeConfig ? (
                        <Badge tone={priorityToBadgeTone(info.priority)}>
                          {urgencyBadgeConfig.text}
                        </Badge>
                      ) : null}
                      <Badge tone={priorityToBadgeTone(info.priority)}>
                        {priorityLabel(info.priority)}
                      </Badge>
                      <Badge tone="neutral">
                        {getCategoryInfo(info.category).label}
                      </Badge>
                      {isFallbackType(rec.type) ? (
                        <Badge tone="neutral">{rec.type}</Badge>
                      ) : null}
                    </ResponsiveStack>
                  }
                  actions={
                    <ResponsiveStack direction="row" gap={2} wrap>
                      <RecommendationActions
                        recommendation={rec}
                        vmId={vmId}
                        vmStatus={vmStatus}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )
                        }
                        onClick={() => toggleExpanded(rec.id)}
                      >
                        {isExpanded ? 'Less' : 'More'}
                      </Button>
                    </ResponsiveStack>
                  }
                >
                  <ResponsiveStack direction="col" gap={2}>
                    <span>{rec.text || info.description}</span>

                    {(rec.type === 'OS_UPDATE_AVAILABLE' ||
                      rec.type === 'SYSTEM_UPDATE_AVAILABLE') &&
                      metadata?.rebootDays ? (
                      <Badge tone="warning" icon={<AlertTriangle size={12} />}>
                        Waiting {metadata.rebootDays} day
                        {metadata.rebootDays !== 1 ? 's' : ''} for reboot
                      </Badge>
                    ) : null}
                    {rec.type === 'APP_UPDATE_AVAILABLE' &&
                      metadata?.securityUpdateCount > 0 ? (
                      <Badge tone="warning" icon={<Shield size={12} />}>
                        {metadata.securityUpdateCount} security update
                        {metadata.securityUpdateCount !== 1 ? 's' : ''} pending
                        {metadata.totalUpdateCount > metadata.securityUpdateCount
                          ? ` · ${metadata.totalUpdateCount} total`
                          : ''}
                      </Badge>
                    ) : null}
                    {rec.type === 'PORT_BLOCKED' &&
                    metadata?.blockedPorts?.length > 0 ? (
                      <ResponsiveStack direction="col" gap={1}>
                        {metadata.blockedPorts.map((port, idx) => (
                          <Badge
                            key={idx}
                            tone="warning"
                            icon={<Shield size={12} />}
                          >
                            Port {port.port} ({port.protocol}) · {port.processName}
                          </Badge>
                        ))}
                      </ResponsiveStack>
                    ) : null}
                    {rec.type === 'DEFENDER_THREAT' && metadata?.threatCount > 0 ? (
                      <Badge tone="danger" icon={<AlertTriangle size={12} />}>
                        {metadata.threatCount} threat
                        {metadata.threatCount !== 1 ? 's' : ''} detected
                        {metadata.activeThreats > 0
                          ? ` · ${metadata.activeThreats} active`
                          : ''}
                      </Badge>
                    ) : null}

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Divider />
                          <RecommendationHelp
                            recommendationType={rec.type}
                            recommendation={rec}
                            showDetailed
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </ResponsiveStack>
                </Alert>
              );
            })
          )}
        </ResponsiveStack>

        {filtered.length > 0 ? (
          <EmptyState
            variant="inline"
            icon={<CheckCircle size={14} />}
            title={`Showing ${filtered.length} of ${recommendations.length} recommendations`}
          />
        ) : null}
    </Page>
  );
};

export default VMRecommendationsTab;
