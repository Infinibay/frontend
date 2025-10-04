import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Shield, Lock, Info, X, Plus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSizeContext } from '@/components/ui/size-provider';
import { useSafeResolvedTheme } from '@/utils/safe-theme';
import { isCriticalFilter } from '@/utils/genericFilterCategories';
import { formatRuleForDisplay } from '@/utils/firewallHelpers';
import { getDataGlassAnimation, getReducedTransparencyForm } from '@/utils/form-glass-effects';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * FilterRow - Individual filter row with two-line layout and inline rule expansion
 *
 * @param {Object} props
 * @param {Object} props.filter - NWFilter object with id, name, description, rules
 * @param {boolean} props.isAssigned - Whether filter is currently assigned
 * @param {boolean} props.isInherited - Whether filter is inherited from department
 * @param {string} [props.inheritedFrom] - Department name if inherited
 * @param {Function} props.onToggle - Callback (filterId, currentState)
 * @param {boolean} props.disabled - Whether actions are disabled
 * @param {boolean} props.isAdmin - Whether current user is admin
 * @param {string} [props.className] - Additional CSS classes
 */
export function FilterRow({
  filter,
  isAssigned,
  isInherited,
  inheritedFrom,
  onToggle,
  disabled,
  isAdmin,
  className,
  rowRef,
  criticalDialogOpen = false,
  onCriticalDialogChange
}) {
  const { size } = useSizeContext();
  const theme = useSafeResolvedTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCritical = isCriticalFilter(filter.name);
  const canUnassign = !isInherited && (!isCritical || isAdmin);
  const checkboxDisabled = disabled || isInherited || (isAssigned && isCritical && !isAdmin);

  // Handle checkbox toggle with confirmation for critical filters
  const handleCheckboxToggle = () => {
    if (isAssigned && isCritical && isAdmin) {
      // Show confirmation dialog for critical filter unassignment by admin
      onCriticalDialogChange?.(true);
    } else {
      // Direct toggle for non-critical or assignment cases
      onToggle(filter.id, isAssigned);
    }
  };

  // Handle keyboard activation (Space/Enter)
  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      if (!checkboxDisabled) {
        handleCheckboxToggle();
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!checkboxDisabled) {
        handleCheckboxToggle();
      }
    }
  };

  const hasRules = filter.rules && filter.rules.length > 0;

  // Extract protocol/port info from first rule for preview
  const firstRule = hasRules ? filter.rules[0] : null;
  const protocolInfo = firstRule
    ? `${firstRule.protocol || 'all'}${firstRule.dstportstart ? `:${firstRule.dstportstart}` : ''}`
    : null;

  return (
    <div
      ref={rowRef}
      data-row="filter-row"
      data-filter-id={filter.id}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${filter.name} - ${isAssigned ? 'Asignado' : 'No asignado'}`}
      className={cn(
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-celeste-500 focus:ring-offset-2',
        isExpanded
          ? 'glass-medium border-l-4 border-brand-celeste-500'
          : 'glass-subtle hover:glass-medium hover:shadow-lg hover:scale-[1.01]',
        'radius-fluent-md',
        'size-padding',
        'space-y-2',
        getDataGlassAnimation(),
        className
      )}
    >
      {/* Line 1 - Header row */}
      <div className="flex items-center justify-between">
        {/* Left side: Checkbox + Icon + Name */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={isAssigned}
                    disabled={checkboxDisabled}
                    onCheckedChange={handleCheckboxToggle}
                    aria-label={`${isAssigned ? 'Desactivar' : 'Activar'} ${filter.name}`}
                  />
                </div>
              </TooltipTrigger>
              {isInherited && (
                <TooltipContent>
                  <p>Heredado de {inheritedFrom}. No se puede modificar.</p>
                </TooltipContent>
              )}
              {isCritical && isAssigned && !isAdmin && (
                <TooltipContent>
                  <p>Filtro crítico. Solo administradores pueden desactivarlo.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <Shield className="size-5 text-brand-celeste-500" aria-hidden="true" />
          <span className="font-semibold size-text">{filter.name}</span>
        </div>

        {/* Right side: Badges */}
        <div className="flex items-center gap-2">
          {isCritical && (
            <Badge variant="destructive" className="gap-1">
              <Lock className="size-3" />
              CRÍTICO
            </Badge>
          )}
          {isInherited && (
            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
              Heredado
            </Badge>
          )}
          {isAssigned && !isInherited && (
            <Badge variant="default">
              Activo
            </Badge>
          )}
        </div>
      </div>

      {/* Line 2 - Description row */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {/* Left side: Description + metadata */}
        <div className="flex items-center gap-2">
          <span>{filter.description || 'Sin descripción'}</span>
          {protocolInfo && (
            <>
              <span>•</span>
              <span className="font-mono text-xs">{protocolInfo}</span>
            </>
          )}
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-2">
          {isInherited ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs">
                    <span>Desde: {inheritedFrom}</span>
                    <Info className="size-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este filtro está heredado del departamento {inheritedFrom}.</p>
                  <p>No se puede modificar a nivel de VM.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : isAssigned ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled || (isCritical && !isAdmin)}
                    onClick={() => {
                      if (isCritical && isAdmin) {
                        setShowCriticalDialog(true);
                      } else {
                        onToggle(filter.id, true);
                      }
                    }}
                    className="gap-1"
                    aria-label={`Quitar ${filter.name}`}
                  >
                    <X className="size-4" />
                    Quitar
                  </Button>
                </TooltipTrigger>
                {isCritical && !isAdmin && (
                  <TooltipContent>
                    <p>Solo administradores pueden desactivar filtros críticos</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onToggle(filter.id, false)}
              className="gap-1"
              aria-label={`Activar ${filter.name}`}
            >
              <Plus className="size-4" />
              Activar
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible section - Rule details */}
      {hasRules && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mt-2"
              aria-label={`${isExpanded ? 'Ocultar' : 'Mostrar'} reglas de ${filter.name}`}
            >
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              REGLAS ({filter.rules.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="glass-strong size-padding border-t border-border space-y-2">
              {filter.rules.map((rule, index) => {
                const formatted = formatRuleForDisplay(rule);
                return (
                  <div
                    key={index}
                    className="text-xs p-2 glass-subtle radius-fluent-sm space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={rule.action === 'accept' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {rule.action || 'accept'}
                      </Badge>
                      {rule.direction && (
                        <Badge variant="outline" className="text-xs">
                          {rule.direction}
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-muted-foreground">
                      {formatted.protocol && <div>Protocolo: {formatted.protocol}</div>}
                      {formatted.ports && <div>Puerto: {formatted.ports}</div>}
                      {formatted.srcipaddr && <div>IP origen: {formatted.srcipaddr}</div>}
                      {formatted.dstipaddr && <div>IP destino: {formatted.dstipaddr}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Critical Filter Unassignment Confirmation Dialog */}
      <AlertDialog open={criticalDialogOpen} onOpenChange={onCriticalDialogChange}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              ⚠️ Desasignar Filtro Crítico
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{filter.name}</strong> es un filtro de seguridad crítico. Desasignarlo puede dejar la VM vulnerable. ¿Está seguro que desea continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onCriticalDialogChange?.(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onToggle(filter.id, true);
                onCriticalDialogChange?.(false);
              }}
            >
              Confirmar (Admin)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
