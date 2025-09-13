'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
  Divider,
  CheckboxGroup,
  Checkbox,
  Accordion,
  AccordionItem,
  Badge
} from '@nextui-org/react';
import {
  Search,
  Filter,
  X,
  Calendar,
  Download,
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle,
  Pause,
  HardDrive,
  Shield,
  Zap,
  ExternalLink,
  Info
} from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: 'CRITICAL', label: 'Crítico', color: 'danger', icon: AlertTriangle },
  { value: 'IMPORTANT', label: 'Importante', color: 'warning', icon: Clock },
  { value: 'INFORMATIONAL', label: 'Informativo', color: 'default', icon: Info }
];

const CATEGORY_OPTIONS = [
  { value: 'STORAGE', label: 'Almacenamiento', icon: HardDrive },
  { value: 'SECURITY', label: 'Seguridad', icon: Shield },
  { value: 'PERFORMANCE', label: 'Rendimiento', icon: Zap },
  { value: 'NETWORK', label: 'Red', icon: ExternalLink },
  { value: 'SYSTEM', label: 'Sistema', icon: Info }
];

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Nuevo', color: 'default', icon: AlertTriangle },
  { value: 'IN_PROGRESS', label: 'En Progreso', color: 'primary', icon: Clock },
  { value: 'RESOLVED', label: 'Resuelto', color: 'success', icon: CheckCircle },
  { value: 'DISMISSED', label: 'Descartado', color: 'warning', icon: Pause }
];

const QUICK_FILTERS = [
  {
    id: 'critical-problems',
    label: 'Problemas Críticos',
    description: 'Solo problemas de prioridad crítica',
    filters: { priority: ['CRITICAL'], status: ['NEW', 'IN_PROGRESS'] }
  },
  {
    id: 'pending-resolution',
    label: 'Pendientes de Resolver',
    description: 'Problemas nuevos y en progreso',
    filters: { status: ['NEW', 'IN_PROGRESS'] }
  },
  {
    id: 'resolved-today',
    label: 'Resueltos Hoy',
    description: 'Problemas resueltos en las últimas 24 horas',
    filters: { status: ['RESOLVED'], dateRange: 'today' }
  },
  {
    id: 'security-issues',
    label: 'Problemas de Seguridad',
    description: 'Solo problemas relacionados con seguridad',
    filters: { category: ['SECURITY'] }
  },
  {
    id: 'performance-issues',
    label: 'Problemas de Rendimiento',
    description: 'Solo problemas de rendimiento',
    filters: { category: ['PERFORMANCE'] }
  }
];

const SORT_OPTIONS = [
  { value: 'priority-desc', label: 'Prioridad (Mayor a Menor)' },
  { value: 'priority-asc', label: 'Prioridad (Menor a Mayor)' },
  { value: 'date-desc', label: 'Fecha (Más Reciente)' },
  { value: 'date-asc', label: 'Fecha (Más Antigua)' },
  { value: 'category', label: 'Categoría' },
  { value: 'status', label: 'Estado' },
  { value: 'estimated-time', label: 'Tiempo Estimado' }
];

export function ProblemFilters({ filters, onFiltersChange, problems = [] }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState('priority-desc');

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    const stats = {
      priority: {},
      category: {},
      status: {}
    };

    problems.forEach(problem => {
      // Priority stats
      stats.priority[problem.priority] = (stats.priority[problem.priority] || 0) + 1;

      // Category stats
      stats.category[problem.category] = (stats.category[problem.category] || 0) + 1;

      // Status stats
      stats.status[problem.status] = (stats.status[problem.status] || 0) + 1;
    });

    return stats;
  }, [problems]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    onFiltersChange(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const newFilters = {
      ...filters,
      sortBy: newSortBy
    };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    handleFilterChange('search', value);
  };

  const handleQuickFilter = (quickFilter) => {
    const newFilters = {
      ...filters,
      ...quickFilter.filters
    };

    // Handle date range for "Resueltos hoy"
    if (quickFilter.id === 'resolved-today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      newFilters.dateRange = {
        start: today.toISOString(),
        end: new Date().toISOString()
      };
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    setSortBy('priority-desc');
    onFiltersChange({
      priority: [],
      category: [],
      status: [],
      search: '',
      dateRange: null
    });
  };

  const exportFilteredResults = () => {
    // This would implement export functionality
    console.log('Exporting filtered results...');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priority?.length > 0) count++;
    if (filters.category?.length > 0) count++;
    if (filters.status?.length > 0) count++;
    if (filters.search) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card>
      <CardBody className="space-y-4">
        {/* Search and Quick Actions */}
        <div className="flex gap-3">
          <Input
            placeholder="Buscar problemas..."
            value={searchValue}
            onValueChange={handleSearchChange}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            className="flex-1"
            isClearable
            onClear={() => handleSearchChange('')}
          />

          <Select
            placeholder="Ordenar por"
            selectedKeys={[sortBy]}
            onSelectionChange={(keys) => handleSortChange(Array.from(keys)[0])}
            className="w-48"
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <Button
            variant="bordered"
            startContent={<Filter className="w-4 h-4" />}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            Filtros Avanzados
            {activeFilterCount > 0 && (
              <Badge content={activeFilterCount} color="primary" size="sm" />
            )}
          </Button>
        </div>

        {/* Quick Filters */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Filtros Rápidos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((quickFilter) => (
              <Button
                key={quickFilter.id}
                variant="bordered"
                size="sm"
                onPress={() => handleQuickFilter(quickFilter)}
                className="text-xs"
              >
                {quickFilter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Filtros Activos:</span>
              <Button
                variant="light"
                size="sm"
                startContent={<RotateCcw className="w-3 h-3" />}
                onPress={clearAllFilters}
              >
                Limpiar Todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.priority?.map((priority) => {
                const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
                return (
                  <Chip
                    key={priority}
                    color={option?.color}
                    variant="flat"
                    onClose={() => handleFilterChange('priority', filters.priority.filter(p => p !== priority))}
                  >
                    {option?.label}
                  </Chip>
                );
              })}

              {filters.category?.map((category) => {
                const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
                return (
                  <Chip
                    key={category}
                    variant="flat"
                    onClose={() => handleFilterChange('category', filters.category.filter(c => c !== category))}
                  >
                    {option?.label}
                  </Chip>
                );
              })}

              {filters.status?.map((status) => {
                const option = STATUS_OPTIONS.find(opt => opt.value === status);
                return (
                  <Chip
                    key={status}
                    color={option?.color}
                    variant="flat"
                    onClose={() => handleFilterChange('status', filters.status.filter(s => s !== status))}
                  >
                    {option?.label}
                  </Chip>
                );
              })}

              {filters.search && (
                <Chip
                  variant="flat"
                  onClose={() => handleSearchChange('')}
                >
                  Búsqueda: "{filters.search}"
                </Chip>
              )}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Divider />
            <Accordion variant="bordered">
              <AccordionItem
                key="priority"
                aria-label="Filtrar por Prioridad"
                title={
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Prioridad</span>
                    {filters.priority?.length > 0 && (
                      <Badge content={filters.priority.length} color="primary" size="sm" />
                    )}
                  </div>
                }
              >
                <CheckboxGroup
                  value={filters.priority || []}
                  onValueChange={(value) => handleFilterChange('priority', value)}
                >
                  {PRIORITY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const count = filterStats.priority[option.value] || 0;
                    return (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </div>
                          <Chip size="sm" variant="bordered">
                            {count}
                          </Chip>
                        </div>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              </AccordionItem>

              <AccordionItem
                key="category"
                aria-label="Filtrar por Categoría"
                title={
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Categoría</span>
                    {filters.category?.length > 0 && (
                      <Badge content={filters.category.length} color="primary" size="sm" />
                    )}
                  </div>
                }
              >
                <CheckboxGroup
                  value={filters.category || []}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  {CATEGORY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const count = filterStats.category[option.value] || 0;
                    return (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </div>
                          <Chip size="sm" variant="bordered">
                            {count}
                          </Chip>
                        </div>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              </AccordionItem>

              <AccordionItem
                key="status"
                aria-label="Filtrar por Estado"
                title={
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Estado</span>
                    {filters.status?.length > 0 && (
                      <Badge content={filters.status.length} color="primary" size="sm" />
                    )}
                  </div>
                }
              >
                <CheckboxGroup
                  value={filters.status || []}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  {STATUS_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const count = filterStats.status[option.value] || 0;
                    return (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </div>
                          <Chip size="sm" variant="bordered">
                            {count}
                          </Chip>
                        </div>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              </AccordionItem>
            </Accordion>

            {/* Export and Actions */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-default-500">
                {problems.length} problemas encontrados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="bordered"
                  size="sm"
                  startContent={<Download className="w-4 h-4" />}
                  onPress={exportFilteredResults}
                >
                  Exportar Resultados
                </Button>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
