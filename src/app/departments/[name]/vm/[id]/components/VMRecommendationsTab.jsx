import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, Filter, CheckCircle, AlertTriangle, Clock, Lightbulb, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Import our custom components and utilities
import useVMRecommendations from '@/hooks/useVMRecommendations';
import RecommendationHelp, { RecommendationsGeneralHelp } from './RecommendationHelp';
import RecommendationActions from './RecommendationActions';
import {
  getRecommendationInfo,
  getPriorityColors,
  getCategoryInfo,
  isFallbackType,
  extractRecommendationMetadata,
  getRebootUrgencyText,
  URGENCY_BADGES,
  PRIORITY_LEVELS,
  CATEGORIES
} from '@/utils/recommendationTypeMapper';

/**
 * VM Recommendations Tab Component
 * Displays and manages VM recommendations with filtering, actions, and help
 */
const VMRecommendationsTab = ({ vmId, vmStatus }) => {
  // State management
  const [expandedRec, setExpandedRec] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Hook for recommendations data
  const {
    recommendations,
    categorizedRecommendations,
    highPriorityRecommendations,
    summary,
    categoryStats,
    requiresImmediateAttention,
    lastUpdateTime,
    isLoading,
    isRefreshing,
    error,
    refreshRecommendations
  } = useVMRecommendations(vmId, {
    pollInterval: 60000 // Poll every minute
  });

  // Filter and search recommendations
  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations];

    // Apply search filter
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

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(rec => {
        const info = getRecommendationInfo(rec.type);
        return info.category === filterCategory;
      });
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(rec => {
        const info = getRecommendationInfo(rec.type);
        return info.priority === filterPriority;
      });
    }

    return filtered;
  }, [recommendations, searchTerm, filterCategory, filterPriority]);

  // Handle recommendation expansion
  const toggleExpanded = (recId) => {
    setExpandedRec(expandedRec === recId ? null : recId);
  };

  // Render recommendation card
  const renderRecommendationCard = (recommendation) => {
    const metadata = extractRecommendationMetadata(recommendation);
    const info = getRecommendationInfo(recommendation.type, recommendation);
    const priorityColors = getPriorityColors(info.priority);
    const isExpanded = expandedRec === recommendation.id;

    // Determine urgency styling
    const isUrgent = info.urgencyBadge === 'IMMEDIATE' || info.urgencyBadge === 'URGENT';
    const urgencyBadgeConfig = info.urgencyBadge ? URGENCY_BADGES[info.urgencyBadge] : null;
    const urgentBorderClass = urgencyBadgeConfig ? `border-l-4 ${urgencyBadgeConfig.borderColor} shadow-lg` : '';
    const urgentAnimateClass = urgencyBadgeConfig?.animate ? 'animate-pulse' : '';

    return (
      <div
        key={recommendation.id}
        className={`border rounded-lg hover:shadow-sm transition-all ${priorityColors.border} ${urgentBorderClass} ${urgentAnimateClass}`}
      >
        {/* Card Header */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Recommendation icon */}
            <div className="flex-shrink-0 mt-0.5">
              <info.icon className={`h-5 w-5 ${info.color}`} />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {info.label}
                    </h4>
                    <RecommendationHelp
                      recommendationType={recommendation.type}
                      showDetailed={false}
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {recommendation.text || info.description}
                  </p>

                  {/* Enhanced data display for OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE */}
                  {(recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays && (
                    <div className={`mb-3 p-3 rounded-lg flex items-center gap-2 ${
                      metadata.rebootDays >= 7 ? 'bg-red-50 border border-red-200' :
                      metadata.rebootDays >= 3 ? 'bg-orange-50 border border-orange-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        metadata.rebootDays >= 7 ? 'text-red-600' :
                        metadata.rebootDays >= 3 ? 'text-orange-600' :
                        'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          metadata.rebootDays >= 7 ? 'text-red-900' :
                          metadata.rebootDays >= 3 ? 'text-orange-900' :
                          'text-yellow-900'
                        }`}>
                          ⚠️ Sistema esperando reinicio por {metadata.rebootDays} días
                        </p>
                        {metadata.rebootDays >= 7 && (
                          <p className="text-xs text-red-700 mt-1">
                            URGENTE: Reinicio inmediato requerido para aplicar actualizaciones de seguridad
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced data display for APP_UPDATE_AVAILABLE */}
                  {recommendation.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0 && (
                    <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">
                          🛡️ {metadata.securityUpdateCount} actualización(es) de seguridad
                        </p>
                        {metadata.totalUpdateCount > metadata.securityUpdateCount && (
                          <p className="text-xs text-orange-700 mt-1">
                            Total: {metadata.totalUpdateCount} actualizaciones disponibles
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced data display for PORT_BLOCKED */}
                  {recommendation.type === 'PORT_BLOCKED' && metadata?.blockedPorts?.length > 0 && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      {metadata.blockedPorts.map((port, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-yellow-900">
                          <Shield className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">
                            Puerto {port.port} ({port.protocol}) - {port.processName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Enhanced data display for DEFENDER_THREAT */}
                  {recommendation.type === 'DEFENDER_THREAT' && metadata?.threatCount > 0 && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">
                          ⚠️ {metadata.threatCount} amenaza(s) detectada(s)
                        </p>
                        {metadata.activeThreats > 0 && (
                          <p className="text-xs text-red-700 mt-1">
                            {metadata.activeThreats} activa(s) • {metadata.quarantinedThreats || 0} en cuarentena
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    {/* Urgency badge */}
                    {urgencyBadgeConfig && (
                      <Badge className={urgencyBadgeConfig.color}>
                        {urgencyBadgeConfig.text}
                      </Badge>
                    )}

                    <Badge className={priorityColors.badge}>
                      {info.priority === PRIORITY_LEVELS.CRITICAL && 'Critical'}
                      {info.priority === PRIORITY_LEVELS.HIGH && 'High'}
                      {info.priority === PRIORITY_LEVELS.MEDIUM && 'Medium'}
                      {info.priority === PRIORITY_LEVELS.LOW && 'Low'}
                    </Badge>

                    <Badge variant="outline" className="text-xs">
                      {getCategoryInfo(info.category).label}
                    </Badge>

                    {/* Show raw type if using fallback mapping */}
                    {isFallbackType(recommendation.type) && (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        {recommendation.type}
                      </Badge>
                    )}

                  </div>

                  <div className="flex items-center justify-between">
                    <RecommendationActions
                      recommendation={recommendation}
                      vmId={vmId}
                      vmStatus={vmStatus}
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(recommendation.id)}
                      className="flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Less details
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          More details
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <RecommendationHelp
                recommendationType={recommendation.type}
                recommendation={recommendation}
                showDetailed={true}
                className="mb-0"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Loading recommendations from last scan...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - only show when there is no usable data
  if (error && (!recommendations || recommendations.length === 0)) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading recommendations
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Could not load recommendations from the last health scan for this VM.
              </p>
              <Button onClick={refreshRecommendations} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!recommendations?.length) {
    return (
      <div className="space-y-6">
        <RecommendationsGeneralHelp />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Excellent! Your VM is optimized
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                No improvement recommendations at this time.
                Your virtual machine is running optimally.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={refreshRecommendations}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Scanning...' : 'Run new scan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General help section */}
      <RecommendationsGeneralHelp />

      {/* Main recommendations card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                VM Recommendations
                {requiresImmediateAttention && (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </CardTitle>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                <span>{summary.total} recommendations from last scan</span>
                {summary.urgent > 0 && (
                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    {summary.urgent} urgent
                  </span>
                )}
                {summary.rebootPending > 0 && (
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                    {summary.rebootPending} reboot pending
                  </span>
                )}
                {summary.securityUpdates > 0 && (
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                    {summary.securityUpdates} security updates
                  </span>
                )}
                {summary.activeThreats > 0 && (
                  <span className="flex items-center gap-1 text-red-600 font-bold">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    {summary.activeThreats} active threats
                  </span>
                )}
                {summary.blockedPorts > 0 && (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                    {summary.blockedPorts} blocked ports
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              <Button
                onClick={refreshRecommendations}
                disabled={isRefreshing}
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Scanning...' : 'Search for new recommendations'}
              </Button>
            </div>
          </div>

          {/* Last update info */}
          {lastUpdateTime && (
            <p className="text-xs text-gray-500">
              Last recommendation received: {lastUpdateTime.toLocaleString('en-US')}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and filters */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Search */}
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search recommendations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Category filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {Object.values(CATEGORIES).map(category => {
                      const categoryInfo = getCategoryInfo(category);
                      return (
                        <SelectItem key={category} value={category}>
                          {categoryInfo.label} ({categoryStats[category] || 0})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Priority filter */}
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.CRITICAL}>Critical</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.HIGH}>High</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>


          {/* Recommendations list */}
          <div className="space-y-3">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map(renderRecommendationCard)
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  No recommendations found matching the applied filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VMRecommendationsTab;
