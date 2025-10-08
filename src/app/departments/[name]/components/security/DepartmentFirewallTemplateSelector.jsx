'use client';

import React, { useState } from 'react';
import { Globe, Monitor, Code, Database, Server, Lock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCreateDepartmentFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getTemplateSummary
} from '@/config/firewallTemplates';
import TemplatePreviewDialog from '../../../[name]/vm/[id]/components/security/TemplatePreviewDialog';

const debug = createDebugger('frontend:components:department-firewall-template-selector');

const DepartmentFirewallTemplateSelector = ({ departmentId, existingRules, onRefetch }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [applyingTemplateId, setApplyingTemplateId] = useState(null);

  const [createRule] = useCreateDepartmentFirewallRuleMutation();

  const templateIcons = {
    'web-server': { icon: Globe, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
    'web-server-secure': { icon: Lock, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
    'desktop-basic': { icon: Monitor, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
    'desktop-secure': { icon: Lock, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
    'development': { icon: Code, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950' },
    'database-server': { icon: Database, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950' }
  };

  const handleApplyTemplate = async (templateData) => {
    const template = templateData.selectedRules ? templateData : { ...templateData, selectedRules: expandTemplateToRules(templateData) };
    debug.log('Applying template to department:', template.id);
    setApplyingTemplateId(template.id);

    try {
      const rules = template.selectedRules || expandTemplateToRules(template);
      debug.log(`Applying ${rules.length} rules from template to department`);

      // Create each rule from the template
      for (const rule of rules) {
        await createRule({
          variables: {
            departmentId,
            input: {
              name: rule.name,
              description: rule.description || `From template: ${template.displayName}`,
              action: rule.action,
              direction: rule.direction,
              priority: rule.priority,
              protocol: rule.protocol,
              dstPortStart: rule.dstPortStart || null,
              dstPortEnd: rule.dstPortEnd || null,
              srcPortStart: rule.srcPortStart || null,
              srcPortEnd: rule.srcPortEnd || null,
              srcIpAddr: rule.srcIpAddr || null,
              srcIpMask: rule.srcIpMask || null,
              dstIpAddr: rule.dstIpAddr || null,
              dstIpMask: rule.dstIpMask || null,
              overridesDept: false
            }
          }
        });
      }

      toast.success(`Applied ${rules.length} rule${rules.length !== 1 ? 's' : ''} from "${template.displayName}"`);
      debug.success(`Applied template ${template.id} to department`);
      onRefetch();
    } catch (error) {
      debug.error('Failed to apply template:', error);
      toast.error(`Failed to apply template: ${error.message}`);
    } finally {
      setApplyingTemplateId(null);
    }
  };

  const handleCardClick = (template) => {
    debug.log('Opening preview for:', template.id);
    setPreviewTemplate(template);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIREWALL_TEMPLATES.map((template) => {
          const iconConfig = templateIcons[template.id] || {
            icon: Server,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 dark:bg-gray-950'
          };
          const Icon = iconConfig.icon;
          const summary = getTemplateSummary(template);
          const isApplying = applyingTemplateId === template.id;

          return (
            <div
              key={template.id}
              data-template-id={template.id}
              className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all
                hover:shadow-md hover:scale-105 glass-subtle
                flex flex-col
                ${isApplying ? 'opacity-50 cursor-wait' : ''}
              `}
              onClick={() => !isApplying && handleCardClick(template)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconConfig.bgColor}`}>
                  <Icon className={`h-6 w-6 ${iconConfig.color}`} />
                </div>
                <Info className="h-4 w-4 text-gray-400" />
              </div>

              {/* Content */}
              <h4 className="font-semibold mb-2 size-text">
                {template.displayName}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Summary */}
              <div className="text-xs text-muted-foreground space-y-1 mb-3">
                <div>✓ {summary.allowedServices.length} services enabled</div>
                {summary.blockedPorts.length > 0 && (
                  <div>✗ {summary.blockedPorts.length} ports blocked</div>
                )}
                <div className="font-medium">{summary.totalRules} total rules</div>
              </div>

              {/* Spacer to push footer to bottom */}
              <div className="flex-grow"></div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isApplying) handleApplyTemplate(template);
                  }}
                  disabled={isApplying}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>

              {/* Loading overlay */}
              {isApplying && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onApply={(template) => {
          setPreviewTemplate(null);
          handleApplyTemplate(template);
        }}
      />
    </>
  );
};

export default DepartmentFirewallTemplateSelector;
