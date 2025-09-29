import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { Switch } from '@components/ui/switch';
import {
  useRemoveSimplifiedFirewallRuleMutation
} from '@/gql/hooks';
import {
  formatRuleForDisplay,
  calculateRiskLevel,
  sortRulesByPriority,
  filterRules
} from '@/utils/firewallHelpers';

const FirewallRulesSection = ({
  customRules = [],
  effectiveRules = [],
  vmId,
  onRuleChange,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const params = useParams();

  const [deleteRule, { loading: deleteLoading }] = useRemoveSimplifiedFirewallRuleMutation();

  const isLoading = deleteLoading;

  // Determine which rules to display
  const displayRules = showAll ? effectiveRules : customRules;

  // Filter and sort rules
  const processedRules = useMemo(() => {
    let filtered = filterRules(displayRules, {
      search: searchTerm,
      enabled: filterBy === 'enabled' ? true : filterBy === 'disabled' ? false : undefined,
      direction: filterBy === 'inbound' ? 'inbound' : filterBy === 'outbound' ? 'outbound' : undefined,
      action: filterBy === 'allow' ? 'allow' : filterBy === 'deny' ? 'deny' : undefined,
      origin: filterBy === 'custom' ? 'custom' : filterBy === 'template' ? 'template' : undefined
    });

    if (sortBy === 'priority') {
      filtered = sortRulesByPriority(filtered);
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => {
        const aFormatted = formatRuleForDisplay(a);
        const bFormatted = formatRuleForDisplay(b);
        return (aFormatted.displayName || '').localeCompare(bFormatted.displayName || '');
      });
    } else if (sortBy === 'risk') {
      filtered = filtered.sort((a, b) => {
        const aRisk = calculateRiskLevel(a);
        const bRisk = calculateRiskLevel(b);
        const riskOrder = { high: 3, medium: 2, low: 1, minimal: 0 };
        return riskOrder[bRisk.level] - riskOrder[aRisk.level];
      });
    }

    return filtered;
  }, [displayRules, searchTerm, filterBy, sortBy]);

  const handleCreateRule = () => {
    const { name: departmentName } = params;
    router.push(`/departments/${departmentName}/vm/${vmId}/firewall/create`);
  };

  // Edit functionality disabled - backend doesn't support updateSimplifiedFirewallRule
  const handleEditRule = (rule) => {
    // Editing is not supported yet
    alert('Rule editing is not currently available. You can delete the rule and create a new one with the desired changes.');
  };

  const handleDeleteRule = async (rule) => {
    if (!confirm(`¿Está seguro que desea eliminar la regla "${rule.displayName || rule.description || 'Sin nombre'}"?`)) {
      return;
    }

    try {
      await deleteRule({
        variables: {
          machineId: vmId,
          ruleId: rule.id
        }
      });

      if (onRuleChange) onRuleChange();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getRuleIcon = (rule) => {
    const risk = calculateRiskLevel(rule);
    if (risk.level === 'high') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (risk.level === 'medium') return <Info className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {showAll ? 'Todas las Reglas de Firewall' : 'Reglas Personalizadas'}
            </h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-sm">
                  {showAll
                    ? 'Muestra todas las reglas activas (plantillas + personalizadas)'
                    : 'Muestra solo las reglas que has creado manualmente'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={showAll}
                onCheckedChange={setShowAll}
                id="show-all"
              />
              <Label htmlFor="show-all" className="text-sm">
                Mostrar todas las reglas
              </Label>
            </div>

            {disabled ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" disabled className="opacity-50 cursor-not-allowed">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Regla
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Detenga la VM para modificar el firewall
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button size="sm" onClick={handleCreateRule}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Regla
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar reglas por nombre, puerto, IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="template">From Templates</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Prioridad</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="risk">Riesgo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rules Table */}
        {processedRules.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Shield className="h-12 w-12 text-gray-300 mx-auto" />
                <div>
                  <p className="text-gray-500 font-medium">No hay reglas que mostrar</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm || filterBy !== 'all'
                      ? 'Try adjusting the search filters'
                      : 'Cree su primera regla de firewall personalizada'
                    }
                  </p>
                </div>
                {!disabled && !searchTerm && filterBy === 'all' && (
                  <Button onClick={handleCreateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Regla
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Protocolo/Puerto</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Riesgo</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRules.map((rule) => {
                  const formatted = formatRuleForDisplay(rule);
                  const risk = calculateRiskLevel(rule);

                  return (
                    <TableRow key={rule.id} className={!formatted.enabled ? 'opacity-60' : ''}>
                      <TableCell>
                        {getRuleIcon(rule)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatted.displayName}</div>
                          {rule.description && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {rule.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {formatted.directionIcon} {formatted.formattedDirection}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            formatted.actionColor === 'green' ? 'border-green-300 text-green-700 bg-green-50' :
                            formatted.actionColor === 'red' ? 'border-red-300 text-red-700 bg-red-50' :
                            formatted.actionColor === 'orange' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                            'border-gray-300 text-gray-700'
                          }`}
                        >
                          {formatted.actionIcon} {formatted.formattedAction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {formatted.formattedProtocol}
                          {rule.port && <div className="text-xs text-gray-500">{formatted.portDisplay}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatted.sourceDisplay}
                          {rule.destinationIp && (
                            <div className="text-xs text-gray-500">→ {formatted.destinationDisplay}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatted.enabled ? (
                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                          ) : (
                            <Circle className="h-2 w-2 fill-gray-300 text-gray-300" />
                          )}
                          <span className="text-xs">
                            {formatted.enabled ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            risk.color === 'red' ? 'border-red-300 text-red-700 bg-red-50' :
                            risk.color === 'yellow' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                            risk.color === 'green' ? 'border-green-300 text-green-700 bg-green-50' :
                            'border-blue-300 text-blue-700 bg-blue-50'
                          }`}
                        >
                          {risk.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!disabled && formatted.origin === 'custom' && (
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRule(rule)}
                                  className="h-8 w-8 p-0 opacity-50 cursor-not-allowed"
                                  disabled
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Editing not available. Delete and create a new rule to make changes.
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRule(rule)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Eliminar regla</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Rules Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{processedRules.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {processedRules.filter(r => formatRuleForDisplay(r).enabled).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inbound</p>
                <p className="text-2xl font-bold text-blue-600">
                  {processedRules.filter(r => formatRuleForDisplay(r).normalizedDirection === 'inbound').length}
                </p>
              </div>
              <ArrowDown className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {processedRules.filter(r => calculateRiskLevel(r).level === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Note: Edit functionality disabled - backend doesn't support updateSimplifiedFirewallRule */}
      </div>
    </TooltipProvider>
  );
};

export default FirewallRulesSection;