import { useState, useMemo, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetGenericFiltersQuery,
  useGetVMAssignedGenericFiltersQuery,
  useGetDepartmentAssignedGenericFiltersQuery,
  useAssignGenericFilterToVMMutation,
  useUnassignGenericFilterFromVMMutation,
  useAssignGenericFilterToDepartmentMutation,
  useUnassignGenericFilterFromDepartmentMutation,
} from '@/gql/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, X, AlertCircle, Shield } from 'lucide-react';
import { CategoryHeader } from './CategoryHeader';
import { FilterRow } from './FilterRow';
import { categorizeFilter, FILTER_CATEGORIES } from '@/utils/genericFilterCategories';
import { cn } from '@/lib/utils';
import { useSizeContext } from '@/components/ui/size-provider';
import { useSafeResolvedTheme } from '@/utils/safe-theme';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

const debug = createDebugger('frontend:components:GenericFilterLibrary');

/**
 * GenericFilterLibrary - Main component for managing generic firewall filters
 *
 * @param {Object} props
 * @param {string} [props.vmId] - VM ID if viewing VM-specific filters
 * @param {string} [props.departmentId] - Department ID if viewing department filters
 * @param {Function} [props.onFilterChange] - Callback when filters change
 * @param {boolean} [props.disabled] - Whether actions are disabled
 * @param {string} [props.className] - Additional CSS classes
 */
export const GenericFilterLibrary = forwardRef(function GenericFilterLibrary({
  vmId,
  departmentId,
  onFilterChange,
  disabled = false,
  className
}, ref) {
  const { size } = useSizeContext();
  const theme = useSafeResolvedTheme();

  // Get user role from Redux
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Refs for keyboard navigation
  const rowRefs = useRef([]);
  const currentFocusIndex = useRef(-1);

  // Track open dialogs for Escape key handling
  const [criticalDialogOpen, setCriticalDialogOpen] = useState(null); // filterId or null

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // GraphQL queries
  const {
    data: catalogData,
    loading: catalogLoading,
    error: catalogError,
    refetch: refetchCatalog
  } = useGetGenericFiltersQuery();

  const {
    data: assignedVMData,
    loading: assignedVMLoading,
    refetch: refetchAssignedVM
  } = useGetVMAssignedGenericFiltersQuery({
    variables: { vmId },
    skip: !vmId
  });

  const {
    data: assignedDeptData,
    loading: assignedDeptLoading,
    refetch: refetchAssignedDept
  } = useGetDepartmentAssignedGenericFiltersQuery({
    variables: { departmentId },
    skip: !departmentId
  });

  const assignedData = vmId ? assignedVMData : assignedDeptData;
  const assignedLoading = vmId ? assignedVMLoading : assignedDeptLoading;
  const refetchAssigned = vmId ? refetchAssignedVM : refetchAssignedDept;

  const isLoading = catalogLoading || assignedLoading;

  // Mutation handlers
  const handleMutationSuccess = (data, toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    }
    toast.success('Filtro actualizado correctamente');
    refetchAssigned();
    if (onFilterChange) {
      onFilterChange();
    }
    debug('Filter mutation completed successfully');
  };

  const handleMutationError = (error, toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    }
    toast.error(`Error al actualizar filtro: ${error.message}`);
    debug('Filter mutation error:', error);
  };

  // GraphQL mutations - we'll pass toastId via context
  const [assignToVM] = useAssignGenericFilterToVMMutation();
  const [unassignFromVM] = useUnassignGenericFilterFromVMMutation();
  const [assignToDept] = useAssignGenericFilterToDepartmentMutation();
  const [unassignFromDept] = useUnassignGenericFilterFromDepartmentMutation();

  // Process and categorize filters
  const categorizedFilters = useMemo(() => {
    const filters = catalogData?.getGenericFilters || [];
    const assigned = vmId
      ? assignedData?.getVMAssignedGenericFilters || []
      : assignedData?.getDepartmentAssignedGenericFilters || [];

    // Create assignment map
    const assignmentMap = {};
    assigned.forEach(filter => {
      assignmentMap[filter.id] = {
        isAssigned: true,
        isInherited: filter.isInherited || false,
        inheritedFrom: filter.inheritedFrom || null
      };
    });

    // Filter and categorize
    let processedFilters = filters.map(filter => ({
      ...filter,
      category: categorizeFilter(filter.name),
      ...assignmentMap[filter.id] || { isAssigned: false, isInherited: false, inheritedFrom: null }
    }));

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      processedFilters = processedFilters.filter(filter => {
        // Search in name and description
        if (filter.name.toLowerCase().includes(searchLower)) return true;
        if (filter.description?.toLowerCase().includes(searchLower)) return true;

        // Search in rules - expanded to include more fields
        if (filter.rules) {
          return filter.rules.some(rule => {
            const protocol = rule.protocol?.toLowerCase() || '';
            const dstportstart = rule.dstportstart?.toString() || '';
            const dstportend = rule.dstportend?.toString() || '';
            const action = rule.action?.toLowerCase() || '';
            const direction = rule.direction?.toLowerCase() || '';
            const srcipaddr = rule.srcipaddr?.toLowerCase() || '';
            const dstipaddr = rule.dstipaddr?.toLowerCase() || '';

            return protocol.includes(searchLower) ||
                   dstportstart.includes(searchLower) ||
                   dstportend.includes(searchLower) ||
                   action.includes(searchLower) ||
                   direction.includes(searchLower) ||
                   srcipaddr.includes(searchLower) ||
                   dstipaddr.includes(searchLower);
          });
        }

        return false;
      });
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      processedFilters = processedFilters.filter(f => f.category === selectedCategory);
    }

    // Apply assigned-only filter
    if (showAssignedOnly) {
      processedFilters = processedFilters.filter(f => f.isAssigned);
    }

    // Group by category
    const grouped = {};
    Object.keys(FILTER_CATEGORIES).forEach(cat => {
      grouped[cat] = [];
    });

    processedFilters.forEach(filter => {
      if (grouped[filter.category]) {
        grouped[filter.category].push(filter);
      }
    });

    // Sort within each category: assigned first, then alphabetically
    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => {
        if (a.isAssigned && !b.isAssigned) return -1;
        if (!a.isAssigned && b.isAssigned) return 1;
        return a.name.localeCompare(b.name);
      });
    });

    debug('Categorized filters:', grouped);
    return grouped;
  }, [catalogData, assignedData, debouncedSearch, selectedCategory, showAssignedOnly, vmId]);

  // Initialize expanded categories with assigned filters (only once on mount)
  const [hasInitializedCategories, setHasInitializedCategories] = useState(false);
  useEffect(() => {
    if (!hasInitializedCategories && Object.keys(categorizedFilters).length > 0) {
      const categoriesToExpand = new Set(expandedCategories);
      Object.keys(categorizedFilters).forEach(category => {
        const hasAssigned = categorizedFilters[category].some(f => f.isAssigned);
        if (hasAssigned) {
          categoriesToExpand.add(category);
        }
      });
      setExpandedCategories(categoriesToExpand);
      setHasInitializedCategories(true);
    }
  }, [categorizedFilters, hasInitializedCategories]); // Only run once when data is available

  // Handle filter toggle
  const handleFilterToggle = async (filterId, currentlyAssigned) => {
    debug(`Toggling filter ${filterId}, currently assigned: ${currentlyAssigned}`);

    const toastId = toast.loading(
      currentlyAssigned ? 'Desactivando filtro...' : 'Activando filtro...'
    );

    try {
      if (vmId) {
        if (currentlyAssigned) {
          await unassignFromVM({
            variables: { vmId, genericFilterId: filterId }
          });
        } else {
          await assignToVM({
            variables: { vmId, genericFilterId: filterId }
          });
        }
      } else if (departmentId) {
        if (currentlyAssigned) {
          await unassignFromDept({
            variables: { departmentId, genericFilterId: filterId }
          });
        } else {
          await assignToDept({
            variables: { departmentId, genericFilterId: filterId }
          });
        }
      }
      handleMutationSuccess(null, toastId);
    } catch (error) {
      handleMutationError(error, toastId);
    }
  };

  // Handle category toggle (used by Collapsible onOpenChange)
  const handleCategoryToggle = (categoryKey, isOpen) => {
    const newExpanded = new Set(expandedCategories);
    if (isOpen) {
      newExpanded.add(categoryKey);
    } else {
      newExpanded.delete(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  // Expose keyboard navigation methods and dialog control via ref
  useImperativeHandle(ref, () => ({
    focusNextRow: () => {
      const rows = rowRefs.current.filter(Boolean);
      if (rows.length === 0) return;

      currentFocusIndex.current = (currentFocusIndex.current + 1) % rows.length;
      rows[currentFocusIndex.current]?.focus();
    },
    focusPrevRow: () => {
      const rows = rowRefs.current.filter(Boolean);
      if (rows.length === 0) return;

      currentFocusIndex.current = currentFocusIndex.current <= 0
        ? rows.length - 1
        : currentFocusIndex.current - 1;
      rows[currentFocusIndex.current]?.focus();
    },
    toggleFocusedRow: () => {
      const rows = rowRefs.current.filter(Boolean);
      if (currentFocusIndex.current >= 0 && currentFocusIndex.current < rows.length) {
        const focusedRow = rows[currentFocusIndex.current];
        // Trigger Space key event on the focused row
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        focusedRow?.dispatchEvent(event);
      }
    },
    closeAllDialogs: () => {
      setCriticalDialogOpen(null);
    },
    hasOpenDialogs: () => {
      return criticalDialogOpen !== null;
    }
  }));

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-12 w-full glass-subtle" />
        <Skeleton className="h-20 w-full glass-subtle" />
        <Skeleton className="h-20 w-full glass-subtle" />
        <Skeleton className="h-20 w-full glass-subtle" />
      </div>
    );
  }

  // Error state
  if (catalogError) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Error al cargar los servicios de firewall</p>
            <p className="text-sm">{catalogError.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchCatalog()}
            >
              Reintentar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Check if we have any filters after filtering
  const totalFilters = Object.values(categorizedFilters).reduce(
    (sum, filters) => sum + filters.length,
    0
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and filter bar */}
      <div className="sticky top-0 z-10 glass-medium elevation-2 radius-fluent-md size-padding">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-subtle"
            />
          </div>

          {/* Category filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] glass-subtle">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {Object.keys(FILTER_CATEGORIES).map(catKey => (
                <SelectItem key={catKey} value={catKey}>
                  {FILTER_CATEGORIES[catKey].icon} {FILTER_CATEGORIES[catKey].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assigned-only toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="assigned-only"
              checked={showAssignedOnly}
              onCheckedChange={setShowAssignedOnly}
            />
            <label
              htmlFor="assigned-only"
              className="text-sm font-medium cursor-pointer"
            >
              Solo asignados
            </label>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {totalFilters === 0 && (
        <Card className="glass-medium size-padding text-center space-y-4">
          <Shield className="size-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-semibold size-text">No se encontraron servicios</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
          {(searchTerm || selectedCategory !== 'all' || showAssignedOnly) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setShowAssignedOnly(false);
              }}
            >
              <X className="size-4 mr-2" />
              Limpiar filtros
            </Button>
          )}
        </Card>
      )}

      {/* Filter categories */}
      <div className="space-y-4">
        {Object.keys(FILTER_CATEGORIES).map(categoryKey => {
          const categoryFilters = categorizedFilters[categoryKey] || [];
          if (categoryFilters.length === 0) return null;

          const assignedCount = categoryFilters.filter(f => f.isAssigned).length;
          const isOpen = expandedCategories.has(categoryKey);

          return (
            <Collapsible
              key={categoryKey}
              open={isOpen}
              onOpenChange={(open) => handleCategoryToggle(categoryKey, open)}
            >
              <CategoryHeader
                category={categoryKey}
                isOpen={isOpen}
                assignedCount={assignedCount}
                totalCount={categoryFilters.length}
              />

              <CollapsibleContent>
                <div className="space-y-3 pl-4 pt-2">
                  {categoryFilters.map((filter, index) => (
                    <FilterRow
                      key={filter.id}
                      filter={filter}
                      isAssigned={filter.isAssigned}
                      isInherited={filter.isInherited}
                      inheritedFrom={filter.inheritedFrom}
                      onToggle={handleFilterToggle}
                      disabled={disabled}
                      isAdmin={isAdmin}
                      rowRef={(el) => {
                        if (el) {
                          rowRefs.current.push(el);
                        }
                      }}
                      criticalDialogOpen={criticalDialogOpen === filter.id}
                      onCriticalDialogChange={(open) => {
                        setCriticalDialogOpen(open ? filter.id : null);
                      }}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
