'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, CardHeader, Button, Chip, Spinner, Badge } from '@nextui-org/react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MoreVertical } from 'lucide-react';
import { ProblemDetailCard } from './ProblemDetailCard';
import { ProblemFilters } from './ProblemFilters';
import ProblemTransformationService from '../../../services/ProblemTransformationService';
import ProblemPriorityService from '../../../services/ProblemPriorityService';
import { fetchVMHealthData } from '../../../state/slices/health';
import { useProblemStatus } from '../../../hooks/useProblemStatus';

export function ProblemsTab({ vmId, vmName }) {
  const dispatch = useDispatch();
  const { vmHealthData = {}, isLoading: loading, error } = useSelector(state => state.health || {});
  const healthData = vmHealthData?.[vmId];
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const [filters, setFilters] = useState({
    priority: [],
    category: [],
    status: [],
    search: '',
    sortBy: 'priority-desc',
    dateRange: null
  });

  const { updateProblemStatus, bulkUpdateStatus } = useProblemStatus();

  // Transform health data into problems
  const problems = useMemo(() => {
    if (!healthData) return [];

    const transformedProblems = ProblemTransformationService.transformHealthChecks(healthData, { id: vmId, name: vmName });
    const prioritizedProblems = ProblemPriorityService.sortProblemsByPriority(transformedProblems);

    return prioritizedProblems;
  }, [healthData, vmId, vmName]);

  // Apply filters and sorting to problems
  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(problem.priority)) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(problem.category)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(problem.status)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const problemDate = new Date(problem.detectedAt || problem.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);

        if (problemDate < startDate || problemDate > endDate) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return problem.title.toLowerCase().includes(searchLower) ||
          problem.description.toLowerCase().includes(searchLower);
      }

      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'priority-desc':
        filtered = ProblemPriorityService.sortProblemsByPriority(filtered);
        break;
      case 'priority-asc':
        filtered = ProblemPriorityService.sortProblemsByPriority(filtered).reverse();
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.detectedAt || b.createdAt) - new Date(a.detectedAt || a.createdAt));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.detectedAt || a.createdAt) - new Date(b.detectedAt || b.createdAt));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'estimated-time':
        filtered.sort((a, b) => (a.estimatedFixTime || 0) - (b.estimatedFixTime || 0));
        break;
      default:
        // Default to priority sorting
        filtered = ProblemPriorityService.sortProblemsByPriority(filtered);
    }

    return filtered;
  }, [problems, filters]);

  // Problem statistics
  const stats = useMemo(() => {
    const total = problems.length;
    const critical = problems.filter(p => p.priority === 'CRITICAL').length;
    const important = problems.filter(p => p.priority === 'IMPORTANT').length;
    const resolved = problems.filter(p => p.status === 'RESOLVED').length;
    const inProgress = problems.filter(p => p.status === 'IN_PROGRESS').length;

    return { total, critical, important, resolved, inProgress };
  }, [problems]);

  useEffect(() => {
    if (vmId) {
      // Note: This would need Apollo client instance in a real implementation
      // For now, we'll simulate the dispatch
      console.log('Would fetch health data for VM:', vmId);
      // dispatch(fetchVMHealthData({ vmId, client }));
    }
  }, [dispatch, vmId]);

  const handleBulkAction = async (action) => {
    const problemIds = Array.from(selectedProblems);

    try {
      switch (action) {
        case 'mark-progress':
          await bulkUpdateStatus(problemIds, 'IN_PROGRESS');
          break;
        case 'mark-resolved':
          await bulkUpdateStatus(problemIds, 'RESOLVED');
          break;
        case 'mark-dismissed':
          await bulkUpdateStatus(problemIds, 'DISMISSED');
          break;
      }
      setSelectedProblems(new Set());
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleProblemSelect = (problemId, selected) => {
    const newSelection = new Set(selectedProblems);
    if (selected) {
      newSelection.add(problemId);
    } else {
      newSelection.delete(problemId);
    }
    setSelectedProblems(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedProblems.size === filteredProblems.length) {
      setSelectedProblems(new Set());
    } else {
      setSelectedProblems(new Set(filteredProblems.map(p => p.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Cargando problemas..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-danger">
        <CardBody>
          <div className="text-center text-danger">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Error al cargar los problemas: {error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center w-full">
            <div>
              <h2 className="text-xl font-semibold">Problemas de {vmName}</h2>
              <p className="text-small text-default-500">
                Gestión integral de problemas y soluciones
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-danger">{stats.critical}</div>
                <div className="text-tiny text-default-500">Críticos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.important}</div>
                <div className="text-tiny text-default-500">Importantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
                <div className="text-tiny text-default-500">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.resolved}</div>
                <div className="text-tiny text-default-500">Resueltos</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Chip
                startContent={<AlertTriangle className="w-4 h-4" />}
                color={stats.critical > 0 ? "danger" : "default"}
                variant={stats.critical > 0 ? "solid" : "bordered"}
              >
                {stats.total} problemas detectados
              </Chip>
              {stats.critical > 0 && (
                <Chip color="danger" variant="flat">
                  {stats.critical} requieren atención inmediata
                </Chip>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="bordered"
                startContent={<Filter className="w-4 h-4" />}
                onPress={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>
              {selectedProblems.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() => handleBulkAction('mark-progress')}
                  >
                    Marcar en Progreso ({selectedProblems.size})
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    onPress={() => handleBulkAction('mark-resolved')}
                  >
                    Marcar Resuelto ({selectedProblems.size})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      {showFilters && (
        <ProblemFilters
          filters={filters}
          onFiltersChange={setFilters}
          problems={problems}
        />
      )}

      {/* Bulk Selection Controls */}
      {filteredProblems.length > 0 && (
        <Card>
          <CardBody className="py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="light"
                  size="sm"
                  onPress={handleSelectAll}
                >
                  {selectedProblems.size === filteredProblems.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                </Button>
                {selectedProblems.size > 0 && (
                  <span className="text-small text-default-500">
                    {selectedProblems.size} de {filteredProblems.length} seleccionados
                  </span>
                )}
              </div>
              {selectedProblems.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    onPress={() => handleBulkAction('mark-dismissed')}
                  >
                    Descartar
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-lg font-semibold mb-2">
                {problems.length === 0 ? '¡Excelente!' : 'No hay problemas que coincidan'}
              </h3>
              <p className="text-default-500">
                {problems.length === 0
                  ? 'No se han detectado problemas en esta máquina virtual.'
                  : 'Intenta ajustar los filtros para ver más resultados.'
                }
              </p>
            </CardBody>
          </Card>
        ) : (
          filteredProblems.map((problem) => (
            <ProblemDetailCard
              key={problem.id}
              problem={problem}
              vmId={vmId}
              selectable={true}
              selected={selectedProblems.has(problem.id)}
              onSelect={(selected) => handleProblemSelect(problem.id, selected)}
              onStatusChange={updateProblemStatus}
              showDetailedView={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
