import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Info,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createDebugger } from '@/utils/debug';
import {
  formatRuleForDisplay,
  calculateRiskLevel
} from '@/utils/firewallHelpers';

const debug = createDebugger('frontend:components:EffectiveRulesView');

const EffectiveRulesView = ({
  effectiveRules = [],
  vmId,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Debounce search term (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      debug('Search debounced', { searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Categorize rules by origin
  const categorizedRules = useMemo(() => {
    const categories = {
      generic: [],
      custom: [],
      inherited: []
    };

    effectiveRules.forEach(rule => {
      const formatted = formatRuleForDisplay(rule);
      if (formatted.isGeneric) {
        categories.generic.push(rule);
      } else if (formatted.isInherited) {
        categories.inherited.push(rule);
      } else {
        categories.custom.push(rule);
      }
    });

    debug('Categorized rules:', {
      generic: categories.generic.length,
      custom: categories.custom.length,
      inherited: categories.inherited.length
    });

    return categories;
  }, [effectiveRules]);

  // Filter and sort rules
  const filteredRules = useMemo(() => {
    let filtered = [...effectiveRules];

    // Search filter (using debounced term)
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(rule => {
        const formatted = formatRuleForDisplay(rule);
        return (
          formatted.displayName?.toLowerCase().includes(search) ||
          formatted.protocol?.toLowerCase().includes(search) ||
          formatted.port?.toString().includes(search) ||
          formatted.source?.toLowerCase().includes(search) ||
          formatted.destination?.toLowerCase().includes(search)
        );
      });
    }

    // Origin filter
    if (filterOrigin !== 'all') {
      filtered = filtered.filter(rule => {
        const formatted = formatRuleForDisplay(rule);
        if (filterOrigin === 'generic') return formatted.isGeneric;
        if (filterOrigin === 'custom') return !formatted.isGeneric && !formatted.isInherited;
        if (filterOrigin === 'inherited') return formatted.isInherited;
        return true;
      });
    }

    // Direction filter
    if (filterDirection !== 'all') {
      filtered = filtered.filter(rule => rule.direction?.toLowerCase() === filterDirection);
    }

    // Action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(rule => rule.action?.toLowerCase() === filterAction);
    }

    // Sort
    if (sortBy === 'priority') {
      // Robust priority sorting with fallback
      filtered.sort((a, b) => {
        const aPriority = a.priority ?? a.order ?? 999;
        const bPriority = b.priority ?? b.order ?? 999;
        return aPriority - bPriority;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const aFormatted = formatRuleForDisplay(a);
        const bFormatted = formatRuleForDisplay(b);
        return (aFormatted.displayName || '').localeCompare(bFormatted.displayName || '');
      });
    } else if (sortBy === 'origin') {
      filtered.sort((a, b) => {
        const aFormatted = formatRuleForDisplay(a);
        const bFormatted = formatRuleForDisplay(b);
        const getOriginOrder = (formatted) => {
          if (formatted.isGeneric) return 0;
          if (formatted.isInherited) return 1;
          return 2;
        };
        return getOriginOrder(aFormatted) - getOriginOrder(bFormatted);
      });
    }

    return filtered;
  }, [effectiveRules, debouncedSearchTerm, filterOrigin, filterDirection, filterAction, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = effectiveRules.length;
    const allowCount = effectiveRules.filter(r => r.action?.toLowerCase() === 'allow').length;
    const denyCount = effectiveRules.filter(r => r.action?.toLowerCase() === 'deny').length;
    const rejectCount = effectiveRules.filter(r => r.action?.toLowerCase() === 'reject').length;

    return {
      total,
      generic: categorizedRules.generic.length,
      custom: categorizedRules.custom.length,
      inherited: categorizedRules.inherited.length,
      allow: allowCount,
      deny: denyCount,
      reject: rejectCount
    };
  }, [effectiveRules, categorizedRules]);

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilterOrigin('all');
    setFilterDirection('all');
    setFilterAction('all');
    setSortBy('priority');
  };

  const hasActiveFilters = debouncedSearchTerm || filterOrigin !== 'all' || filterDirection !== 'all' || filterAction !== 'all';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-subtle hover:glass-medium transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="size-text flex items-center gap-2">
              <Shield className="size-icon text-blue-500" />
              Total de Reglas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="size-heading">{stats.total}</div>
            <div className="size-text text-muted-foreground mt-1">
              {stats.generic} genéricas, {stats.custom} personalizadas, {stats.inherited} heredadas
            </div>
          </CardContent>
        </Card>

        <Card className="glass-subtle hover:glass-medium transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="size-text flex items-center gap-2">
              <CheckCircle className="size-icon text-green-500" />
              Reglas Permitir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="size-heading">{stats.allow}</div>
            <div className="size-text text-muted-foreground mt-1">
              Tráfico permitido
            </div>
          </CardContent>
        </Card>

        <Card className="glass-subtle hover:glass-medium transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="size-text flex items-center gap-2">
              <AlertTriangle className="size-icon text-red-500" />
              Reglas Denegar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="size-heading">{stats.deny + stats.reject}</div>
            <div className="size-text text-muted-foreground mt-1">
              Tráfico bloqueado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass-medium">
        <CardHeader>
          <CardTitle className="size-heading flex items-center gap-2">
            <Filter className="size-icon" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="size-text">Buscar</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-icon text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, protocolo, puerto, IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 size-text glass-subtle"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="origin" className="size-text">Origen</Label>
              <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                <SelectTrigger id="origin" className="size-text glass-subtle mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="generic">Genéricas</SelectItem>
                  <SelectItem value="custom">Personalizadas</SelectItem>
                  <SelectItem value="inherited">Heredadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="direction" className="size-text">Dirección</Label>
              <Select value={filterDirection} onValueChange={setFilterDirection}>
                <SelectTrigger id="direction" className="size-text glass-subtle mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="inbound">Entrada</SelectItem>
                  <SelectItem value="outbound">Salida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action" className="size-text">Acción</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger id="action" className="size-text glass-subtle mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="allow">Permitir</SelectItem>
                  <SelectItem value="deny">Denegar</SelectItem>
                  <SelectItem value="reject">Rechazar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sort" className="size-text">Ordenar por</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="size-text glass-subtle mt-1 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Prioridad</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="origin">Origen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="glass-subtle"
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules by Category */}
      {filteredRules.length === 0 ? (
        <Card className="glass-subtle">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Shield className="size-icon-xl text-muted-foreground mb-4" />
              <h3 className="size-heading text-muted-foreground mb-2">
                No se encontraron reglas
              </h3>
              <p className="size-text text-muted-foreground mb-4">
                {hasActiveFilters
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay reglas de firewall configuradas'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="glass-subtle">
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Generic Services Category */}
          {categorizedRules.generic.length > 0 && (
            <RuleCategorySection
              title="Servicios Genéricos"
              description="Filtros de servicios predefinidos"
              icon={<Shield className="size-icon text-blue-500" />}
              rules={categorizedRules.generic.filter(rule => filteredRules.includes(rule))}
              badge={<Badge variant="outline" className="bg-blue-500/10 text-blue-500">Genérico</Badge>}
              defaultOpen={true}
            />
          )}

          {/* Custom Rules Category */}
          {categorizedRules.custom.length > 0 && (
            <RuleCategorySection
              title="Reglas Personalizadas"
              description="Reglas creadas manualmente"
              icon={<Eye className="size-icon text-purple-500" />}
              rules={categorizedRules.custom.filter(rule => filteredRules.includes(rule))}
              badge={<Badge variant="outline" className="bg-purple-500/10 text-purple-500">Personalizado</Badge>}
              defaultOpen={true}
            />
          )}

          {/* Inherited Rules Category */}
          {categorizedRules.inherited.length > 0 && (
            <RuleCategorySection
              title="Reglas Heredadas"
              description="Reglas del departamento padre"
              icon={<Info className="size-icon text-amber-500" />}
              rules={categorizedRules.inherited.filter(rule => filteredRules.includes(rule))}
              badge={<Badge variant="outline" className="bg-amber-500/10 text-amber-500">Heredado</Badge>}
              defaultOpen={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Category Section Component
const RuleCategorySection = ({ title, description, icon, rules, badge, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (rules.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="glass-medium">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-accent/10 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <div className="text-left">
                  <CardTitle className="size-heading">{title}</CardTitle>
                  <CardDescription className="size-text">{description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">{rules.length}</Badge>
              </div>
              {isOpen ? <ChevronDown className="size-icon" /> : <ChevronRight className="size-icon" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3 pt-0">
            {rules.map((rule, index) => (
              <RuleCard key={rule.id || index} rule={rule} originBadge={badge} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

// Rule Card Component
const RuleCard = ({ rule, originBadge }) => {
  const formatted = formatRuleForDisplay(rule);
  const risk = calculateRiskLevel(rule);

  const actionColors = {
    allow: 'text-green-500 bg-green-500/10',
    deny: 'text-red-500 bg-red-500/10',
    reject: 'text-orange-500 bg-orange-500/10'
  };

  const directionColors = {
    inbound: 'text-blue-500 bg-blue-500/10',
    outbound: 'text-purple-500 bg-purple-500/10'
  };

  const actionColor = actionColors[rule.action?.toLowerCase()] || 'text-gray-500 bg-gray-500/10';
  const directionColor = directionColors[rule.direction?.toLowerCase()] || 'text-gray-500 bg-gray-500/10';

  return (
    <div className="glass-subtle hover:glass-medium transition-all duration-200 p-4 radius-fluent-lg space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="size-text font-semibold">{formatted.displayName || 'Sin nombre'}</h4>
            {originBadge}
            <Badge className={actionColor}>{rule.action || 'N/A'}</Badge>
            <Badge className={directionColor}>{rule.direction || 'N/A'}</Badge>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 size-text text-muted-foreground">
            <div>
              <span className="font-medium">Protocolo/Puerto:</span>{' '}
              {formatted.protocol || 'N/A'}/{formatted.port || 'N/A'}
            </div>
            {formatted.source && (
              <div>
                <span className="font-medium">Origen:</span> {formatted.source}
              </div>
            )}
            {formatted.destination && (
              <div>
                <span className="font-medium">Destino:</span> {formatted.destination}
              </div>
            )}
            {formatted.isInherited && formatted.departmentName && (
              <div>
                <span className="font-medium">Desde:</span> {formatted.departmentName}
              </div>
            )}
          </div>
        </div>

        {risk && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className={
                    risk.level === 'high'
                      ? 'bg-red-500/10 text-red-500'
                      : risk.level === 'medium'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-green-500/10 text-green-500'
                  }
                >
                  Riesgo {risk.level === 'high' ? 'Alto' : risk.level === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="size-text">{risk.reason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default EffectiveRulesView;
