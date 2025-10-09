'use client';

import React from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Info, Settings, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getActionInfo,
  getDirectionInfo,
  getPortLabel,
  getPriorityLabel,
  sortRulesByPriority
} from '@/utils/firewallHelpers';

const FirewallAdvancedView = ({
  effectiveRules,
  departmentRules,
  vmRules,
  conflicts,
  isExpanded,
  onToggle
}) => {
  const sortedRules = sortRulesByPriority(effectiveRules || []);
  const hasConflicts = conflicts && conflicts.length > 0;

  const renderRuleRow = (rule, index) => {
    const actionInfo = getActionInfo(rule.action);
    const directionInfo = getDirectionInfo(rule.direction);
    const priorityInfo = getPriorityLabel(rule.priority);
    const portLabel = getPortLabel(rule.dstPortStart, rule.dstPortEnd, rule.protocol);

    // Determine origin
    let origin = 'Unknown';
    let originBadgeClass = 'bg-gray-100 text-gray-700';
    if (vmRules.some(r => r.id === rule.id)) {
      origin = 'VM';
      originBadgeClass = 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    } else if (departmentRules.some(r => r.id === rule.id)) {
      origin = 'Department';
      originBadgeClass = 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }

    return (
      <TableRow key={rule.id || index}>
        <TableCell className="text-sm font-mono text-muted-foreground">
          #{index + 1}
        </TableCell>
        <TableCell>
          <div className="font-medium size-text">{rule.name}</div>
          {rule.description && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {rule.description}
            </div>
          )}
        </TableCell>
        <TableCell>
          <Badge className={`${originBadgeClass} border`} variant="outline">
            {origin}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={`${actionInfo.bgColor} ${actionInfo.color} border-0`}>
            {actionInfo.icon} {actionInfo.label}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {directionInfo.icon} {directionInfo.label}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {rule.protocol.toUpperCase()}
          </Badge>
        </TableCell>
        <TableCell>
          <span className="text-sm">{portLabel}</span>
        </TableCell>
        <TableCell>
          <Badge className={`${priorityInfo.color} border-current`} variant="outline">
            {priorityInfo.label}
          </Badge>
          <div className="text-xs text-muted-foreground mt-0.5">
            ({rule.priority})
          </div>
        </TableCell>
        <TableCell>
          {rule.srcIpAddr && (
            <div className="text-xs">
              <div className="font-medium">Source:</div>
              <div className="text-muted-foreground font-mono">
                {rule.srcIpAddr}{rule.srcIpMask ? `/${rule.srcIpMask}` : ''}
              </div>
            </div>
          )}
          {rule.dstIpAddr && (
            <div className="text-xs mt-1">
              <div className="font-medium">Dest:</div>
              <div className="text-muted-foreground font-mono">
                {rule.dstIpAddr}{rule.dstIpMask ? `/${rule.dstIpMask}` : ''}
              </div>
            </div>
          )}
          {!rule.srcIpAddr && !rule.dstIpAddr && (
            <span className="text-xs text-muted-foreground">Any</span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderConflictWarning = (conflict, index) => {
    const typeIcons = {
      DUPLICATE: '🔄',
      CONTRADICTORY: '⚠️',
      PORT_OVERLAP: '🔀',
      PRIORITY_CONFLICT: '⚡'
    };

    const typeBadges = {
      DUPLICATE: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      CONTRADICTORY: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      PORT_OVERLAP: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      PRIORITY_CONFLICT: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };

    return (
      <div
        key={index}
        className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950"
      >
        <span className="text-xl">{typeIcons[conflict.type] || '⚠️'}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${typeBadges[conflict.type]} border`} variant="outline">
              {conflict.type}
            </Badge>
          </div>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            {conflict.message}
          </p>
          {conflict.affectedRules && conflict.affectedRules.length > 0 && (
            <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
              Affected rules: {conflict.affectedRules.map(r => r.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="glass-medium rounded-lg border border-border/20">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
            <div className="flex items-center gap-2">
              <Settings className="size-icon text-muted-foreground" />
              <h3 className="size-heading">Advanced View</h3>
              <Badge variant="outline" className="ml-2">
                {sortedRules.length} effective rules
              </Badge>
              {hasConflicts && (
                <Badge className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 border">
                  <AlertTriangle className="size-icon mr-1" />
                  {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="size-button">
              {isExpanded ? (
                <ChevronUp className="size-icon" />
              ) : (
                <ChevronDown className="size-icon" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border/20 p-4 space-y-4">
            {/* Info Box */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <Info className="size-icon text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">How firewall rules work:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Rules are processed in order of priority (lower number = higher priority)</li>
                  <li>First matching rule wins - no further rules are checked</li>
                  <li>VM rules can override department rules</li>
                  <li>If no rule matches, traffic is allowed by default (permissive mode)</li>
                </ul>
              </div>
            </div>

            {/* Conflicts */}
            {hasConflicts && (
              <div className="space-y-2">
                <h4 className="font-semibold size-text flex items-center gap-2">
                  <AlertTriangle className="size-icon text-orange-600" />
                  Detected Conflicts
                </h4>
                {conflicts.map((conflict, idx) => renderConflictWarning(conflict, idx))}
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 glass-subtle rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {departmentRules.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Department Rules</div>
              </div>
              <div className="text-center p-3 glass-subtle rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {vmRules.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">VM Rules</div>
              </div>
              <div className="text-center p-3 glass-subtle rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {sortedRules.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total Effective</div>
              </div>
            </div>

            {/* Effective Rules Table */}
            <div>
              <h4 className="font-semibold size-text mb-2 flex items-center gap-2">
                <Shield className="size-icon" />
                Effective Rules (Processing Order)
              </h4>
              {sortedRules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No firewall rules configured</p>
                  <p className="text-xs mt-1">Apply a template or create custom rules to get started</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Rule Name</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Ports</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>IP Filters</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRules.map((rule, index) => renderRuleRow(rule, index))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default FirewallAdvancedView;
