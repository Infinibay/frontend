import React, { useState, useMemo } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Textarea } from '@components/ui/textarea';
import { Switch } from '@components/ui/switch';
import {
  useCreateSimplifiedFirewallRuleMutation,
  useRemoveSimplifiedFirewallRuleMutation
} from '@/gql/hooks';
import {
  formatRuleForDisplay,
  validateRule,
  calculateRiskLevel,
  sortRulesByPriority,
  filterRules,
  denormalizeAction,
  denormalizeDirection,
  COMMON_SERVICES,
  ACTIONS,
  DIRECTIONS,
  PROTOCOLS
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
  const [editingRule, setEditingRule] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // Form state for rule creation/editing
  const [ruleForm, setRuleForm] = useState({
    name: '',
    direction: 'inbound',
    action: 'allow',
    protocol: 'tcp',
    port: '',
    sourceIp: '',
    destinationIp: '',
    description: '',
    enabled: true
  });

  const [createRule, { loading: createLoading }] = useCreateSimplifiedFirewallRuleMutation();
  const [deleteRule, { loading: deleteLoading }] = useRemoveSimplifiedFirewallRuleMutation();

  const isLoading = createLoading || deleteLoading;

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

  const resetForm = () => {
    setRuleForm({
      name: '',
      direction: 'inbound',
      action: 'allow',
      protocol: 'tcp',
      port: '',
      sourceIp: '',
      destinationIp: '',
      description: '',
      enabled: true
    });
    setSelectedService('');
  };

  const handleServiceSelect = (serviceKey) => {
    const service = COMMON_SERVICES[serviceKey];
    if (service) {
      const firstPort = service.ports[0];
      setRuleForm(prev => ({
        ...prev,
        name: `${service.name} - ${firstPort.name}`,
        port: firstPort.port,
        protocol: firstPort.protocol,
        description: service.description
      }));
    }
    setSelectedService(serviceKey);
  };

  const handleCreateRule = async () => {
    const validation = validateRule(ruleForm);
    if (!validation.isValid) {
      alert(`Error de validación:\n${validation.errors.join('\n')}`);
      return;
    }

    try {
      await createRule({
        variables: {
          input: {
            machineId: vmId,
            action: denormalizeAction(ruleForm.action),
            direction: denormalizeDirection(ruleForm.direction),
            protocol: ruleForm.protocol,
            port: ruleForm.port || 'all',
            description: ruleForm.description || null
          }
        }
      });

      setIsCreateDialogOpen(false);
      resetForm();
      if (onRuleChange) onRuleChange();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  // Edit functionality disabled - backend doesn't support updateSimplifiedFirewallRule
  const handleEditRule = (rule) => {
    // Editing is not supported yet
    alert('La edición de reglas no está disponible actualmente. Puede eliminar la regla y crear una nueva con los cambios deseados.');
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
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Regla
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Regla de Firewall</DialogTitle>
                    <DialogDescription>
                      Configure una nueva regla personalizada para controlar el tráfico de red.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Service Template Selection */}
                    <div>
                      <Label>Plantilla de Servicio (Opcional)</Label>
                      <Select value={selectedService} onValueChange={handleServiceSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un servicio común..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(COMMON_SERVICES).map(([key, service]) => (
                            <SelectItem key={key} value={key}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rule Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rule-name">Nombre de la Regla *</Label>
                        <Input
                          id="rule-name"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Permitir HTTP"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rule-direction">Dirección *</Label>
                        <Select value={ruleForm.direction} onValueChange={(value) => setRuleForm(prev => ({ ...prev, direction: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DIRECTIONS).map(([key, dir]) => (
                              <SelectItem key={key} value={key}>
                                {dir.icon} {dir.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="rule-action">Acción *</Label>
                        <Select value={ruleForm.action} onValueChange={(value) => setRuleForm(prev => ({ ...prev, action: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ACTIONS).map(([key, action]) => (
                              <SelectItem key={key} value={key}>
                                {action.icon} {action.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="rule-protocol">Protocolo *</Label>
                        <Select value={ruleForm.protocol} onValueChange={(value) => setRuleForm(prev => ({ ...prev, protocol: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PROTOCOLS).map(([key, protocol]) => (
                              <SelectItem key={key} value={key}>
                                {protocol.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="rule-port">Puerto</Label>
                        <Input
                          id="rule-port"
                          value={ruleForm.port}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, port: e.target.value }))}
                          placeholder="Ej: 80, 80-90, 80,443"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rule-source">IP Origen</Label>
                        <Input
                          id="rule-source"
                          value={ruleForm.sourceIp}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, sourceIp: e.target.value }))}
                          placeholder="Ej: 192.168.1.0/24"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rule-description">Descripción</Label>
                      <Textarea
                        id="rule-description"
                        value={ruleForm.description}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción opcional de la regla..."
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="rule-enabled"
                        checked={ruleForm.enabled}
                        onCheckedChange={(checked) => setRuleForm(prev => ({ ...prev, enabled: checked }))}
                      />
                      <Label htmlFor="rule-enabled">Regla habilitada</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateRule} disabled={isLoading}>
                      {createLoading ? 'Creando...' : 'Crear Regla'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="enabled">Habilitadas</SelectItem>
                  <SelectItem value="disabled">Deshabilitadas</SelectItem>
                  <SelectItem value="inbound">Entrantes</SelectItem>
                  <SelectItem value="outbound">Salientes</SelectItem>
                  <SelectItem value="allow">Permitir</SelectItem>
                  <SelectItem value="deny">Denegar</SelectItem>
                  <SelectItem value="custom">Personalizadas</SelectItem>
                  <SelectItem value="template">De Plantillas</SelectItem>
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
                      ? 'Intente ajustar los filtros de búsqueda'
                      : 'Cree su primera regla de firewall personalizada'
                    }
                  </p>
                </div>
                {!disabled && !searchTerm && filterBy === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                                Edición no disponible. Elimine y cree una nueva regla para hacer cambios.
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
                <p className="text-sm text-gray-600">Activas</p>
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
                <p className="text-sm text-gray-600">Entrantes</p>
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
                <p className="text-sm text-gray-600">Alto Riesgo</p>
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