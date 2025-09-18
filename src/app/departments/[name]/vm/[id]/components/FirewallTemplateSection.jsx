import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldX,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { useApplyFirewallTemplateMutation, useRemoveFirewallTemplateMutation } from '@/gql/hooks';
import { ACTIONS, DIRECTIONS, PROTOCOLS, formatRuleForDisplay } from '@/utils/firewallHelpers';

const FirewallTemplateSection = ({
  availableTemplates = [],
  appliedTemplates = [],
  onTemplateChange,
  disabled = false,
  vmId
}) => {
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [applyTemplate, { loading: applyLoading }] = useApplyFirewallTemplateMutation();
  const [removeTemplate, { loading: removeLoading }] = useRemoveFirewallTemplateMutation();

  const isLoading = applyLoading || removeLoading;

  const isTemplateApplied = (templateName) => {
    return appliedTemplates.includes(templateName);
  };

  const toggleTemplateDetails = (templateName) => {
    setExpandedTemplate(expandedTemplate === templateName ? null : templateName);
  };

  const handleApplyTemplate = async (template) => {
    try {
      await applyTemplate({
        variables: {
          input: {
            machineId: vmId,
            template: template.template
          }
        }
      });

      setConfirmDialog(null);
      if (onTemplateChange) {
        onTemplateChange();
      }
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  const handleRemoveTemplate = async (template) => {
    try {
      await removeTemplate({
        variables: {
          machineId: vmId,
          template: template.template
        }
      });

      setConfirmDialog(null);
      if (onTemplateChange) {
        onTemplateChange();
      }
    } catch (error) {
      console.error('Error removing template:', error);
    }
  };

  const getTemplateIcon = (template) => {
    const isApplied = isTemplateApplied(template.template);
    if (isApplied) {
      return <ShieldCheck className="h-5 w-5 text-green-600" />;
    }
    return <Shield className="h-5 w-5 text-gray-400" />;
  };


  if (!availableTemplates.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <ShieldX className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500">No hay plantillas de firewall disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Plantillas de Firewall</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p className="text-sm">
                Las plantillas son configuraciones predefinidas que incluyen reglas de firewall
                comunes para diferentes tipos de servicios. Aplique una plantilla para configurar
                automáticamente las reglas necesarias.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableTemplates.map((template) => {
            const isApplied = isTemplateApplied(template.template);
            const isExpanded = expandedTemplate === template.template;

            return (
              <Card
                key={template.template}
                className={`transition-all ${
                  isApplied
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTemplateIcon(template)}
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {template.name}
                          {isApplied && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Aplicada
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{template.rules?.length || 0} reglas</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTemplateDetails(template.template)}
                        className="h-8 px-2"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>

                      {disabled ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant={isApplied ? "outline" : "default"}
                              disabled={true}
                              className={`${isApplied ? "border-red-300 text-red-700" : ""} opacity-50 cursor-not-allowed`}
                            >
                              {isApplied ? (
                                <>
                                  <Minus className="h-4 w-4 mr-1" />
                                  Remover
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Aplicar
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Detenga la VM para modificar el firewall
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Dialog open={confirmDialog?.template === template.template} onOpenChange={(open) => {
                          setConfirmDialog(open ? { template: template.template, action: isApplied ? 'remove' : 'apply' } : null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={isApplied ? "outline" : "default"}
                              disabled={isLoading}
                              className={isApplied ? "border-red-300 text-red-700 hover:bg-red-50" : ""}
                            >
                              {isApplied ? (
                                <>
                                  <Minus className="h-4 w-4 mr-1" />
                                  Remover
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Aplicar
                                </>
                              )}
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {isApplied ? (
                                  <>
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    Remover plantilla de firewall
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Aplicar plantilla de firewall
                                  </>
                                )}
                              </DialogTitle>
                              <DialogDescription className="space-y-3">
                                <p>
                                  {isApplied
                                    ? `¿Está seguro que desea remover la plantilla "${template.name}"?`
                                    : `¿Está seguro que desea aplicar la plantilla "${template.name}"?`
                                  }
                                </p>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <h4 className="font-medium text-sm mb-2">Reglas que se {isApplied ? 'removerán' : 'aplicarán'}:</h4>
                                  <div className="space-y-1">
                                    {template.rules?.map((rule, index) => {
                                      const formatted = formatRuleForDisplay(rule);
                                      return (
                                        <div key={index} className="text-xs flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              formatted.actionColor === 'green' ? 'border-green-300 text-green-700' :
                                              formatted.actionColor === 'red' ? 'border-red-300 text-red-700' :
                                              'border-gray-300 text-gray-700'
                                            }`}
                                          >
                                            {formatted.formattedAction}
                                          </Badge>
                                          <span>{formatted.formattedDirection}</span>
                                          <span>{formatted.formattedProtocol}</span>
                                          {rule.port && <span>puerto {rule.port}</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {!isApplied && (
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                      <strong>Nota:</strong> Las reglas se aplicarán inmediatamente
                                      y afectarán el tráfico de red de la máquina virtual.
                                    </p>
                                  </div>
                                )}
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setConfirmDialog(null)}
                                disabled={isLoading}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant={isApplied ? "destructive" : "default"}
                                onClick={() => isApplied ? handleRemoveTemplate(template) : handleApplyTemplate(template)}
                                disabled={isLoading}
                              >
                                {isLoading ? 'Procesando...' : (isApplied ? 'Remover' : 'Aplicar')}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && template.rules && (
                  <CardContent className="pt-0 border-t">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Reglas incluidas:</h4>
                      <div className="space-y-2">
                        {template.rules.map((rule, index) => {
                          const formatted = formatRuleForDisplay(rule);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    formatted.actionColor === 'green' ? 'border-green-300 text-green-700 bg-green-50' :
                                    formatted.actionColor === 'red' ? 'border-red-300 text-red-700 bg-red-50' :
                                    'border-gray-300 text-gray-700'
                                  }`}
                                >
                                  {formatted.formattedAction}
                                </Badge>
                                <span className="text-gray-600">{formatted.formattedDirection}</span>
                                <span className="font-mono text-gray-800">
                                  {formatted.formattedProtocol}
                                  {rule.port && `:${rule.port}`}
                                </span>
                              </div>
                              {rule.description && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">{rule.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {appliedTemplates.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-800">Plantillas Activas</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {appliedTemplates.map((templateName) => {
                const template = availableTemplates.find(t => t.template === templateName);
                return (
                  <Badge key={templateName} variant="secondary" className="bg-green-100 text-green-800">
                    {template?.name || templateName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default FirewallTemplateSection;