import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, Filter, CheckCircle, AlertTriangle, Clock, Lightbulb } from 'lucide-react';
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
    const info = getRecommendationInfo(recommendation.type);
    const priorityColors = getPriorityColors(info.priority);
    const isExpanded = expandedRec === recommendation.id;

    return (
      <div
        key={recommendation.id}
        className={`border rounded-lg hover:shadow-sm transition-all ${priorityColors.border}`}
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

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={priorityColors.badge}>
                      {info.priority === PRIORITY_LEVELS.CRITICAL && 'Crítico'}
                      {info.priority === PRIORITY_LEVELS.HIGH && 'Alto'}
                      {info.priority === PRIORITY_LEVELS.MEDIUM && 'Medio'}
                      {info.priority === PRIORITY_LEVELS.LOW && 'Bajo'}
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
                          Menos detalles
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          Más detalles
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
                <span className="text-sm text-gray-600">Cargando recomendaciones del último escaneo...</span>
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
                Error al cargar recomendaciones
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                No se pudieron cargar las recomendaciones del último escaneo de salud para esta VM.
              </p>
              <Button onClick={refreshRecommendations} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reintentar
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
                ¡Excelente! Su VM está optimizada
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                No hay recomendaciones de mejora en este momento.
                Su máquina virtual está funcionando de manera óptima.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={refreshRecommendations}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Escaneando...' : 'Ejecutar nuevo escaneo'}
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
                Recomendaciones de la VM
                {requiresImmediateAttention && (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {summary.total} recomendaciones del último escaneo
                {summary.highPriority > 0 && (
                  <span className="text-red-600 font-medium">
                    {' '}• {summary.highPriority} de alta prioridad
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>

              <Button
                onClick={refreshRecommendations}
                disabled={isRefreshing}
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Escaneando...' : 'Buscar nuevas recomendaciones'}
              </Button>
            </div>
          </div>

          {/* Last update info */}
          {lastUpdateTime && (
            <p className="text-xs text-gray-500">
              Última recomendación recibida: {lastUpdateTime.toLocaleString('es-ES')}
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
                    placeholder="Buscar recomendaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Category filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
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
                    <SelectValue placeholder="Todas las prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las prioridades</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.CRITICAL}>Crítica</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.HIGH}>Alta</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.MEDIUM}>Media</SelectItem>
                    <SelectItem value={PRIORITY_LEVELS.LOW}>Baja</SelectItem>
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
                  No se encontraron recomendaciones que coincidan con los filtros aplicados.
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
