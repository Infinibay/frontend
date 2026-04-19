import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Shield,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  TextField,
  Alert,
  SegmentedControl,
} from '@infinibay/harbor';

import useVMRecommendations from '@/hooks/useVMRecommendations';
import RecommendationHelp, { RecommendationsGeneralHelp } from './RecommendationHelp';
import RecommendationActions from './RecommendationActions';
import {
  getRecommendationInfo,
  getCategoryInfo,
  isFallbackType,
  extractRecommendationMetadata,
  URGENCY_BADGES,
  PRIORITY_LEVELS,
  CATEGORIES,
} from '@/utils/recommendationTypeMapper';

/** Map internal priority levels → Alert tone. */
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

/** Map internal priority levels → Badge tone. */
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
      list = list.filter((rec) => getRecommendationInfo(rec.type).priority === filterPriority);
    }
    if (filterCategory !== 'all') {
      list = list.filter((rec) => getRecommendationInfo(rec.type).category === filterCategory);
    }

    return list;
  }, [recommendations, searchTerm, filterPriority, filterCategory]);

  const toggleExpanded = (id) => setExpandedRec((prev) => (prev === id ? null : id));

  const priorityItems = useMemo(
    () => [
      { value: 'all', label: `All (${recommendations.length})` },
      { value: PRIORITY_LEVELS.CRITICAL, label: 'Critical' },
      { value: PRIORITY_LEVELS.HIGH, label: 'High' },
      { value: PRIORITY_LEVELS.MEDIUM, label: 'Medium' },
      { value: PRIORITY_LEVELS.LOW, label: 'Low' },
    ],
    [recommendations.length]
  );

  const categoryItems = useMemo(() => {
    const base = [{ value: 'all', label: 'All categories' }];
    Object.values(CATEGORIES).forEach((c) => {
      const count = categoryStats?.[c] || 0;
      if (count > 0) {
        base.push({ value: c, label: `${getCategoryInfo(c).label} · ${count}` });
      }
    });
    return base;
  }, [categoryStats]);

  // ---- Loading / error / empty states ----------------------------

  if (isLoading) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card variant="glass" className="p-10">
          <div className="flex items-center justify-center gap-3 text-fg-muted">
            <RefreshCw className="h-5 w-5 animate-spin text-accent-2" />
            <span className="text-sm">Loading recommendations from last scan…</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Alert
          tone="danger"
          title="Could not load recommendations"
          actions={
            <Button
              size="sm"
              onClick={refreshRecommendations}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          }
        >
          We couldn&apos;t load recommendations from the last health scan for this VM.
        </Alert>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Alert
          tone="success"
          title="Excellent — your VM is optimised"
          actions={
            <Button
              size="sm"
              onClick={refreshRecommendations}
              disabled={isRefreshing}
              loading={isRefreshing}
              icon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              {isRefreshing ? 'Scanning…' : 'Run new scan'}
            </Button>
          }
        >
          No improvement recommendations at this time.
          Your virtual machine is running optimally.
        </Alert>
      </div>
    );
  }

  // ---- Main render -----------------------------------------------

  return (
    <div className="space-y-6">
      <RecommendationsGeneralHelp />

      {/* Summary strip + controls */}
      <Card variant="glass" className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-fg">
              <Lightbulb className="h-5 w-5 text-warning" />
              Recommendations
              {requiresImmediateAttention && (
                <AlertTriangle className="h-5 w-5 text-danger animate-pulse" />
              )}
            </h2>
            <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-fg-muted">
              <span>{summary?.total ?? recommendations.length} from last scan</span>
              {summary?.urgent > 0 && (
                <span className="inline-flex items-center gap-1 text-danger font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  {summary.urgent} urgent
                </span>
              )}
              {summary?.rebootPending > 0 && (
                <span className="inline-flex items-center gap-1 text-warning font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  {summary.rebootPending} reboot pending
                </span>
              )}
              {summary?.securityUpdates > 0 && (
                <span className="inline-flex items-center gap-1 text-warning font-medium">
                  <Shield className="h-3 w-3" />
                  {summary.securityUpdates} security updates
                </span>
              )}
              {summary?.activeThreats > 0 && (
                <span className="inline-flex items-center gap-1 text-danger font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  {summary.activeThreats} active threats
                </span>
              )}
              {lastUpdateTime && (
                <span className="text-fg-subtle">
                  · updated {new Date(lastUpdateTime).toLocaleTimeString('en-US')}
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            onClick={refreshRecommendations}
            disabled={isRefreshing}
            loading={isRefreshing}
            icon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            {isRefreshing ? 'Scanning…' : 'Scan now'}
          </Button>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <SegmentedControl
            items={priorityItems}
            value={filterPriority}
            onChange={setFilterPriority}
            size="sm"
          />
          {categoryItems.length > 1 && (
            <SegmentedControl
              items={categoryItems}
              value={filterCategory}
              onChange={setFilterCategory}
              size="sm"
              className="max-w-full overflow-x-auto"
            />
          )}
          <div className="md:ml-auto md:w-72">
            <TextField
              placeholder="Search recommendations…"
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Recommendation list — each row is a Harbor Alert with tone
          derived from the priority. Expand/collapse animates inline
          via framer-motion. */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card variant="default" className="p-10 text-center text-fg-muted text-sm">
            <Search className="h-8 w-8 mx-auto mb-2 text-fg-subtle" />
            No recommendations match the current filters.
          </Card>
        ) : (
          filtered.map((rec) => {
            const info = getRecommendationInfo(rec.type, rec);
            const metadata = extractRecommendationMetadata(rec);
            const urgencyBadgeConfig = info.urgencyBadge ? URGENCY_BADGES[info.urgencyBadge] : null;
            const isExpanded = expandedRec === rec.id;
            const IconComp = info.icon;

            return (
              <Alert
                key={rec.id}
                tone={priorityToAlertTone(info.priority)}
                title={
                  <div className="flex items-center gap-2 flex-wrap">
                    {IconComp && <IconComp className="h-4 w-4 shrink-0" />}
                    <span>{info.label}</span>
                    {urgencyBadgeConfig && (
                      <Badge tone={priorityToBadgeTone(info.priority)}>
                        {urgencyBadgeConfig.text}
                      </Badge>
                    )}
                    <Badge tone={priorityToBadgeTone(info.priority)}>{priorityLabel(info.priority)}</Badge>
                    <Badge tone="neutral">{getCategoryInfo(info.category).label}</Badge>
                    {isFallbackType(rec.type) && (
                      <Badge tone="neutral" className="text-[10px] text-fg-subtle">{rec.type}</Badge>
                    )}
                  </div>
                }
                actions={
                  <>
                    <RecommendationActions
                      recommendation={rec}
                      vmId={vmId}
                      vmStatus={vmStatus}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      onClick={() => toggleExpanded(rec.id)}
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </Button>
                  </>
                }
              >
                <div className="space-y-2">
                  <p>{rec.text || info.description}</p>

                  {/* Enhanced metadata blocks per recommendation type. */}
                  {(rec.type === 'OS_UPDATE_AVAILABLE' || rec.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays && (
                    <div className="text-xs text-fg-muted flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Waiting {metadata.rebootDays} day{metadata.rebootDays !== 1 ? 's' : ''} for reboot
                    </div>
                  )}
                  {rec.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0 && (
                    <div className="text-xs text-fg-muted flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      {metadata.securityUpdateCount} security update{metadata.securityUpdateCount !== 1 ? 's' : ''} pending
                      {metadata.totalUpdateCount > metadata.securityUpdateCount && (
                        <span className="text-fg-subtle">
                          · {metadata.totalUpdateCount} total
                        </span>
                      )}
                    </div>
                  )}
                  {rec.type === 'PORT_BLOCKED' && metadata?.blockedPorts?.length > 0 && (
                    <div className="space-y-1">
                      {metadata.blockedPorts.map((port, idx) => (
                        <div key={idx} className="text-xs text-fg-muted flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5" />
                          Port {port.port} ({port.protocol}) · {port.processName}
                        </div>
                      ))}
                    </div>
                  )}
                  {rec.type === 'DEFENDER_THREAT' && metadata?.threatCount > 0 && (
                    <div className="text-xs text-fg-muted flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {metadata.threatCount} threat{metadata.threatCount !== 1 ? 's' : ''} detected
                      {metadata.activeThreats > 0 && (
                        <span className="text-danger/80">
                          · {metadata.activeThreats} active
                        </span>
                      )}
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10">
                          <RecommendationHelp
                            recommendationType={rec.type}
                            recommendation={rec}
                            showDetailed={true}
                            className="mb-0"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Alert>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <div className="text-center text-xs text-fg-subtle">
          <CheckCircle className="h-4 w-4 inline mr-1 -mt-0.5" />
          Showing {filtered.length} of {recommendations.length} recommendations
        </div>
      )}
    </div>
  );
};

export default VMRecommendationsTab;
