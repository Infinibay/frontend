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
  CheckCircle,
  Building
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
import { useCreateFilterMutation, useDeleteFilterMutation } from '@/gql/hooks';
import { formatRuleForDisplay } from '@/utils/firewallHelpers';

const DepartmentFirewallTemplateSection = ({
  availableTemplates = [],
  appliedTemplates = [],
  departmentFilters = [],
  onTemplateChange,
  departmentId,
  departmentName
}) => {
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [createFilter, { loading: createLoading }] = useCreateFilterMutation();
  const [deleteFilter, { loading: deleteLoading }] = useDeleteFilterMutation();

  const isLoading = createLoading || deleteLoading;

  const isTemplateApplied = (templateName) => {
    return appliedTemplates.includes(templateName);
  };

  const findDeptTemplateFilter = (templateName) => {
    return departmentFilters.find(f => f.name === templateName);
  };

  const toggleTemplateDetails = (templateName) => {
    setExpandedTemplate(expandedTemplate === templateName ? null : templateName);
  };

  const handleApplyTemplate = async (template) => {
    try {
      await createFilter({
        variables: {
          input: {
            name: template.template,
            description: `${template.description} - Applied at department level`,
            type: 'DEPARTMENT',
            departmentId: departmentId
          }
        }
      });

      setConfirmDialog(null);
      if (onTemplateChange) {
        onTemplateChange();
      }
    } catch (error) {
      console.error('Error applying department template:', error);
    }
  };

  const handleRemoveTemplate = async (template) => {
    try {
      const filter = findDeptTemplateFilter(template.template);
      if (!filter) {
        console.error('Filter not found for template:', template.template);
        return;
      }

      await deleteFilter({
        variables: { id: filter.id }
      });

      setConfirmDialog(null);
      if (onTemplateChange) {
        onTemplateChange();
      }
    } catch (error) {
      console.error('Error removing department template:', error);
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
            <p className="text-sm text-gray-500">No firewall templates available</p>
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
          <h3 className="text-lg font-semibold">Department Firewall Templates</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p className="text-sm">
                Templates applied at the department level will be automatically executed on all
                virtual machines in the department and will take priority over rules
                configured individually on each VM.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Department-specific warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Department-Level Impact</h4>
              <p className="text-sm text-amber-700 mt-1">
                Templates applied here will affect <strong>all VMs</strong> in the
                <strong>{departmentName}</strong> department. These rules will take priority
                over rules configured on individual VMs.
              </p>
            </div>
          </div>
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
                              Applied to Dept.
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
                      <span>{template.rules?.length || 0} rules</span>
                      {isApplied && (
                        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                          Dept. Wide
                        </Badge>
                      )}
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
                                Remove
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Apply to Dept.
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
                                  Remove template from department
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  Apply template to department
                                </>
                              )}
                            </DialogTitle>
                            <DialogDescription className="space-y-3">
                              <p>
                                {isApplied
                                  ? `Are you sure you want to remove the template "${template.name}" from department ${departmentName}?`
                                  : `Are you sure you want to apply the template "${template.name}" to the entire ${departmentName} department?`
                                }
                              </p>

                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <h4 className="font-medium text-sm text-amber-800 mb-2">
                                  <Building className="h-4 w-4 inline mr-1" />
                                  Impact on department:
                                </h4>
                                <p className="text-xs text-amber-700">
                                  {isApplied
                                    ? `Rules will be removed from ALL VMs in department ${departmentName}.`
                                    : `Rules will be automatically applied to ALL VMs in department ${departmentName}.`
                                  }
                                </p>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">Rules to be {isApplied ? 'removed' : 'applied'}:</h4>
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
                                        {rule.port && <span>port {rule.port}</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {!isApplied && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Rules will be applied immediately
                                    to all VMs in the department and will take priority over
                                    individually configured rules.
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
                              Cancel
                            </Button>
                            <Button
                              variant={isApplied ? "destructive" : "default"}
                              onClick={() => isApplied ? handleRemoveTemplate(template) : handleApplyTemplate(template)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Processing...' : (isApplied ? 'Remove from Dept.' : 'Apply to Dept.')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && template.rules && (
                  <CardContent className="pt-0 border-t">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Included rules:</h4>
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
              <h4 className="font-medium text-green-800">Active Templates in Department</h4>
            </div>
            <p className="text-xs text-green-700 mb-3">
              These templates are applied to all VMs in department {departmentName}
            </p>
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

export default DepartmentFirewallTemplateSection;