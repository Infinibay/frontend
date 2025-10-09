'use client';

import React, { useState } from 'react';
import { Globe, Monitor, Code, Database, Server, Lock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCreateVmFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getTemplateSummary
} from '@/config/firewallTemplates';
import TemplatePreviewDialog from './TemplatePreviewDialog';

const debug = createDebugger('frontend:components:firewall-template-selector');

const FirewallTemplateSelector = ({ vmId, existingRules, onRefetch }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [applyingTemplateId, setApplyingTemplateId] = useState(null);

  // Mutation without refetchQueries - real-time events handle updates
  const [createRule] = useCreateVmFirewallRuleMutation();

  const templateIcons = {
    'web-server': { icon: Globe, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
    'web-server-secure': { icon: Lock, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
    'desktop-basic': { icon: Monitor, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
    'desktop-secure': { icon: Lock, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
    'development': { icon: Code, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950' },
    'database-server': { icon: Database, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950' }
  };

  const handleApplyTemplate = async (template) => {
    debug.log('Applying template:', template.id);
    setApplyingTemplateId(template.id);

    try {
      const rules = expandTemplateToRules(template);
      debug.log(`Applying ${rules.length} rules from template`);

      // Create each rule from the template
      for (const rule of rules) {
        await createRule({
          variables: {
            vmId,
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

      toast.success(`Template "${template.displayName}" applied successfully`);
      debug.success(`Applied template ${template.id}`);
      onRefetch();
    } catch (error) {
      debug.error('Failed to apply template:', error);
      toast.error(`Failed to apply template: ${error.message}`);
    } finally {
      setApplyingTemplateId(null);
    }
  };

  const handlePreview = (template, e) => {
    e.stopPropagation();
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
                ${isApplying ? 'opacity-50 cursor-wait' : ''}
              `}
              onClick={() => !isApplying && handleApplyTemplate(template)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconConfig.bgColor}`}>
                  <Icon className={`h-6 w-6 ${iconConfig.color}`} />
                </div>
                <button
                  onClick={(e) => handlePreview(template, e)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Preview template rules"
                  disabled={isApplying}
                >
                  <Info className="h-4 w-4" />
                </button>
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

              {/* Footer */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <span className="text-xs text-primary font-medium">
                  Click to apply
                </span>
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

export default FirewallTemplateSelector;
