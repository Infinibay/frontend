import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Search, Filter, CheckCircle, AlertTriangle, Lightbulb, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, Button, Badge, TextField, Select } from '@infinibay/harbor';

import useVMRecommendations from '@/hooks/useVMRecommendations';
import RecommendationHelp, { RecommendationsGeneralHelp } from './RecommendationHelp';
import RecommendationActions from './RecommendationActions';
import {
  getRecommendationInfo,
  getPriorityColors,
  getCategoryInfo,
  isFallbackType,
  extractRecommendationMetadata,
  URGENCY_BADGES,
  PRIORITY_LEVELS,
  CATEGORIES
} from '@/utils/recommendationTypeMapper';

const priorityTone = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.CRITICAL: return 'danger';
    case PRIORITY_LEVELS.HIGH: return 'warning';
    case PRIORITY_LEVELS.MEDIUM: return 'info';
    case PRIORITY_LEVELS.LOW: return 'neutral';
    default: return 'neutral';
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    recommendations,
    summary,
    categoryStats,
    requiresImmediateAttention,
    lastUpdateTime,
    isLoading,
    isRefreshing,
    error,
    refreshRecommendations
  } = useVMRecommendations(vmId, { pollInterval: 60000 });

  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(rec => {
        const info = getRecommendationInfo(rec.type);
        return (
          (info.label || '').toLowerCase().includes(search) ||
          (info.description || '').toLowerCase().includes(search) ||
          (rec.text || '').toLowerCase().includes(search) ||
          (info.userFriendlyExplanation || '').toLowerCase().includes(search)
        );
      });
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(rec => {
        const info = getRecommendationInfo(rec.type);
        return info.category === filterCategory;
      });
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(rec => {
        const info = getRecommendationInfo(rec.type);
        return info.priority === filterPriority;
      });
    }

    return filtered;
  }, [recommendations, searchTerm, filterCategory, filterPriority]);

  const toggleExpanded = (recId) => {
    setExpandedRec(expandedRec === recId ? null : recId);
  };

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'All categories' },
    ...Object.values(CATEGORIES).map(category => {
      const info = getCategoryInfo(category);
      return { value: category, label: `${info.label} (${categoryStats[category] || 0})` };
    }),
  ], [categoryStats]);

  const priorityOptions = useMemo(() => [
    { value: 'all', label: 'All priorities' },
    { value: PRIORITY_LEVELS.CRITICAL, label: 'Critical' },
    { value: PRIORITY_LEVELS.HIGH, label: 'High' },
    { value: PRIORITY_LEVELS.MEDIUM, label: 'Medium' },
    { value: PRIORITY_LEVELS.LOW, label: 'Low' },
  ], []);

  const renderRecommendationCard = (recommendation) => {
    const metadata = extractRecommendationMetadata(recommendation);
    const info = getRecommendationInfo(recommendation.type, recommendation);
    const priorityColors = getPriorityColors(info.priority);
    const isExpanded = expandedRec === recommendation.id;

    const urgencyBadgeConfig = info.urgencyBadge ? URGENCY_BADGES[info.urgencyBadge] : null;
    const urgentBorderClass = urgencyBadgeConfig ? `border-l-4 ${urgencyBadgeConfig.borderColor} shadow-lg` : '';
    const urgentAnimateClass = urgencyBadgeConfig?.animate ? 'animate-pulse' : '';

    return (
      <div
        key={recommendation.id}
        className={`border border-white/10 rounded-lg hover:border-white/20 bg-surface-1 transition-all ${priorityColors.border} ${urgentBorderClass} ${urgentAnimateClass}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <info.icon className={`h-5 w-5 ${info.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-fg truncate">
                      {info.label}
                    </h4>
                    <RecommendationHelp
                      recommendationType={recommendation.type}
                      showDetailed={false}
                    />
                  </div>

                  <p className="text-sm text-fg-muted mb-2">
                    {recommendation.text || info.description}
                  </p>

                  {(recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays && (
                    <div className={`mb-3 p-3 rounded-lg flex items-center gap-2 border ${
                      metadata.rebootDays >= 7 ? 'bg-danger/10 border-danger/30' :
                      metadata.rebootDays >= 3 ? 'bg-warning/10 border-warning/30' :
                      'bg-warning/5 border-warning/20'
                    }`}>
                      <AlertTriangle className={`h-5 w-5 shrink-0 ${
                        metadata.rebootDays >= 7 ? 'text-danger' :
                        'text-warning'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          metadata.rebootDays >= 7 ? 'text-danger' : 'text-warning'
                        }`}>
                          ⚠️ Sistema esperando reinicio por {metadata.rebootDays} días
                        </p>
                        {metadata.rebootDays >= 7 && (
                          <p className="text-xs text-danger/80 mt-1">
                            URGENTE: Reinicio inmediato requerido para aplicar actualizaciones de seguridad
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {recommendation.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0 && (
                    <div className="mb-3 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-warning shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-warning">
                          🛡️ {metadata.securityUpdateCount} actualización(es) de seguridad
                        </p>
                        {metadata.totalUpdateCount > metadata.securityUpdateCount && (
                          <p className="text-xs text-warning/80 mt-1">
                            Total: {metadata.totalUpdateCount} actualizaciones disponibles
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {recommendation.type === 'PORT_BLOCKED' && metadata?.blockedPorts?.length > 0 && (
                    <div className="mb-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                      {metadata.blockedPorts.map((port, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-warning">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">
                            Puerto {port.port} ({port.protocol}) - {port.processName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {recommendation.type === 'DEFENDER_THREAT' && metadata?.threatCount > 0 && (
                    <div className="mb-3 p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-danger shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-danger">
                          ⚠️ {metadata.threatCount} amenaza(s) detectada(s)
                        </p>
                        {metadata.activeThreats > 0 && (
                          <p className="text-xs text-danger/80 mt-1">
                            {metadata.activeThreats} activa(s) • {metadata.quarantinedThreats || 0} en cuarentena
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {urgencyBadgeConfig && (
                      <Badge className={urgencyBadgeConfig.color}>
                        {urgencyBadgeConfig.text}
                      </Badge>
                    )}

                    <Badge tone={priorityTone(info.priority)}>
                      {priorityLabel(info.priority)}
                    </Badge>

                    <Badge tone="neutral" className="text-xs">
                      {getCategoryInfo(info.category).label}
                    </Badge>

                    {isFallbackType(recommendation.type) && (
                      <Badge tone="neutral" className="text-xs text-fg-subtle">
                        {recommendation.type}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <RecommendationActions
                      recommendation={recommendation}
                      vmId={vmId}
                      vmStatus={vmStatus}
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      onClick={() => toggleExpanded(recommendation.id)}
                    >
                      {isExpanded ? 'Less details' : 'More details'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <div className="mt-4 pt-4 border-t border-white/10">
                  <RecommendationHelp
                    recommendationType={recommendation.type}
                    recommendation={recommendation}
                    showDetailed={true}
                    className="mb-0"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <div className="p-6 flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-fg-muted">
              <RefreshCw className="h-5 w-5 animate-spin text-accent-2" />
              <span className="text-sm">Loading recommendations from last scan...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error && (!recommendations || recommendations.length === 0)) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <div className="p-6 text-center py-12">
            <AlertTriangle className="h-12 w-12 text-danger mx-auto mb-3" />
            <h3 className="text-lg font-medium text-fg mb-2">
              Error loading recommendations
            </h3>
            <p className="text-sm text-fg-muted mb-4">
              Could not load recommendations from the last health scan for this VM.
            </p>
            <Button
              onClick={refreshRecommendations}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!recommendations?.length) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <div className="p-6 text-center py-12">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="text-lg font-medium text-fg mb-2">
              Excellent! Your VM is optimized
            </h3>
            <p className="text-sm text-fg-muted mb-4">
              No improvement recommendations at this time.
              Your virtual machine is running optimally.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={refreshRecommendations}
                disabled={isRefreshing}
                loading={isRefreshing}
                icon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              >
                {isRefreshing ? 'Scanning...' : 'Run new scan'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecommendationsGeneralHelp />

      <Card>
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-fg">
              <Lightbulb className="h-5 w-5 text-warning" />
              VM Recommendations
              {requiresImmediateAttention && (
                <AlertTriangle className="h-5 w-5 text-danger" />
              )}
            </h3>
            <div className="text-sm text-fg-muted mt-1 flex items-center gap-2 flex-wrap">
              <span>{summary.total} recommendations from last scan</span>
              {summary.urgent > 0 && (
                <span className="flex items-center gap-1 text-danger font-medium">
                  <span className="w-2 h-2 bg-danger rounded-full"></span>
                  {summary.urgent} urgent
                </span>
              )}
              {summary.rebootPending > 0 && (
                <span className="flex items-center gap-1 text-warning font-medium">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  {summary.rebootPending} reboot pending
                </span>
              )}
              {summary.securityUpdates > 0 && (
                <span className="flex items-center gap-1 text-warning font-medium">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  {summary.securityUpdates} security updates
                </span>
              )}
              {summary.activeThreats > 0 && (
                <span className="flex items-center gap-1 text-danger font-bold">
                  <span className="w-2 h-2 bg-danger rounded-full animate-pulse"></span>
                  {summary.activeThreats} active threats
                </span>
              )}
              {summary.blockedPorts > 0 && (
                <span className="flex items-center gap-1 text-warning">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  {summary.blockedPorts} blocked ports
                </span>
              )}
            </div>
            {lastUpdateTime && (
              <p className="text-xs text-fg-subtle mt-2">
                Last recommendation received: {lastUpdateTime.toLocaleString('en-US')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<Filter className="h-4 w-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>

            <Button
              onClick={refreshRecommendations}
              disabled={isRefreshing}
              loading={isRefreshing}
              size="sm"
              icon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              {isRefreshing ? 'Scanning...' : 'Search for new recommendations'}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-1 rounded-lg border border-white/10">
                  <TextField
                    placeholder="Search recommendations..."
                    icon={<Search className="h-4 w-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    value={filterCategory}
                    onChange={setFilterCategory}
                    options={categoryOptions}
                    placeholder="All categories"
                  />
                  <Select
                    value={filterPriority}
                    onChange={setFilterPriority}
                    options={priorityOptions}
                    placeholder="All priorities"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map(renderRecommendationCard)
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-fg-subtle mx-auto mb-2" />
                <p className="text-sm text-fg-muted">
                  No recommendations found matching the applied filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VMRecommendationsTab;
