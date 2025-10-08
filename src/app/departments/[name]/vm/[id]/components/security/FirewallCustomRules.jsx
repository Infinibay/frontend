'use client';

import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Shield, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useDeleteFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  getActionInfo,
  getDirectionInfo,
  getPortLabel,
  getPriorityLabel
} from '@/utils/firewallHelpers';

const debug = createDebugger('frontend:components:firewall-custom-rules');

const FirewallCustomRules = ({ vmId, customRules, departmentRules, onRefetch }) => {
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteRule] = useDeleteFirewallRuleMutation();

  const handleDeleteClick = (ruleId) => {
    debug.log('Delete clicked for rule:', ruleId);
    setDeleteRuleId(ruleId);
  };

  const handleDeleteConfirm = async () => {
    debug.log('Confirming delete for rule:', deleteRuleId);
    try {
      await deleteRule({
        variables: { ruleId: deleteRuleId }
      });
      toast.success('Firewall rule deleted');
      setDeleteRuleId(null);
      onRefetch();
    } catch (error) {
      debug.error('Failed to delete rule:', error);
      toast.error(`Failed to delete rule: ${error.message}`);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedRules.length === 0) return;
    debug.log('Bulk delete clicked for rules:', selectedRules);
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeleteConfirm = async () => {
    debug.log('Confirming bulk delete for rules:', selectedRules);
    try {
      for (const ruleId of selectedRules) {
        await deleteRule({
          variables: { ruleId }
        });
      }
      toast.success(`Deleted ${selectedRules.length} firewall rule${selectedRules.length !== 1 ? 's' : ''}`);
      setSelectedRules([]);
      setShowBulkDeleteDialog(false);
      onRefetch();
    } catch (error) {
      debug.error('Failed to bulk delete rules:', error);
      toast.error(`Failed to delete rules: ${error.message}`);
    }
  };

  const toggleRuleSelection = (ruleId) => {
    setSelectedRules(prev =>
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const toggleAllRules = () => {
    if (selectedRules.length === customRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(customRules.map(r => r.id));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomRules = useMemo(() => {
    if (!sortConfig.key) return customRules;

    return [...customRules].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === 'ports') {
        aValue = a.dstPortStart || 0;
        bValue = b.dstPortStart || 0;
      }

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customRules, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const renderRuleRow = (rule, isInherited = false) => {
    const actionInfo = getActionInfo(rule.action);
    const directionInfo = getDirectionInfo(rule.direction);
    const priorityInfo = getPriorityLabel(rule.priority);
    const portLabel = getPortLabel(rule.dstPortStart, rule.dstPortEnd, rule.protocol);
    const isSelected = selectedRules.includes(rule.id);

    return (
      <TableRow
        key={rule.id}
        className={isInherited ? 'bg-muted/20' : isSelected ? 'bg-primary/5' : ''}
      >
        <TableCell>
          {!isInherited && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleRuleSelection(rule.id)}
            />
          )}
        </TableCell>
        <TableCell
          onClick={() => !isInherited && toggleRuleSelection(rule.id)}
          className={!isInherited ? 'cursor-pointer' : ''}
        >
          <div className="flex items-start gap-2">
            {isInherited && (
              <Shield className="size-icon text-muted-foreground mt-0.5" />
            )}
            <div>
              <div className="font-medium size-text">{rule.name}</div>
              {rule.description && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {rule.description}
                </div>
              )}
              {isInherited && (
                <Badge variant="outline" className="mt-1 text-xs">
                  Inherited from Department
                </Badge>
              )}
              {rule.overridesDept && (
                <Badge className="mt-1 text-xs bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 border">
                  <AlertCircle className="size-icon mr-1" />
                  Overrides Department
                </Badge>
              )}
            </div>
          </div>
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
          {!isInherited && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="size-button h-8 w-8 p-0"
                title="Edit rule"
                onClick={() => debug.log('Edit not implemented yet')}
              >
                <Pencil className="size-icon" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="size-button h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Delete rule"
                onClick={() => handleDeleteClick(rule.id)}
              >
                <Trash2 className="size-icon" />
              </Button>
            </div>
          )}
          {isInherited && (
            <span className="text-xs text-muted-foreground">Read-only</span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const allSelected = customRules.length > 0 && selectedRules.length === customRules.length;
  const someSelected = selectedRules.length > 0 && selectedRules.length < customRules.length;

  const hasRules = customRules.length > 0 || departmentRules.length > 0;

  if (!hasRules) {
    return (
      <div className="text-center py-12 glass-subtle rounded-lg border border-border/20">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="size-heading mb-2">No Firewall Rules</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start by applying a security template or create custom rules
        </p>
      </div>
    );
  }

  return (
    <>
      {selectedRules.length > 0 && (
        <div className="flex items-center justify-between p-3 mb-2 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium">
            {selectedRules.length} rule{selectedRules.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDeleteClick}
          >
            <Trash2 className="size-icon mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                <span className="text-xs font-normal text-muted-foreground">Select</span>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Rule Name
                  <SortIcon columnKey="name" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('action')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Action
                  <SortIcon columnKey="action" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('direction')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Direction
                  <SortIcon columnKey="direction" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('protocol')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Protocol
                  <SortIcon columnKey="protocol" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('ports')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Ports
                  <SortIcon columnKey="ports" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Priority
                  <SortIcon columnKey="priority" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Department Rules (Inherited) */}
            {departmentRules.length > 0 && (
              <>
                <TableRow className="bg-muted/10">
                  <TableCell colSpan={8} className="font-semibold text-xs uppercase tracking-wide">
                    Department Rules ({departmentRules.length})
                  </TableCell>
                </TableRow>
                {departmentRules.map(rule => renderRuleRow(rule, true))}
              </>
            )}

            {/* VM Custom Rules */}
            {customRules.length > 0 && (
              <>
                <TableRow className="bg-muted/10">
                  <TableCell colSpan={1} className="font-semibold text-xs uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                        onCheckedChange={toggleAllRules}
                      />
                      <button
                        onClick={toggleAllRules}
                        className="text-xs font-normal hover:text-foreground transition-colors whitespace-nowrap"
                      >
                        Select all
                      </button>
                    </div>
                  </TableCell>
                  <TableCell colSpan={7} className="font-semibold text-xs uppercase tracking-wide">
                    VM-Specific Rules ({customRules.length})
                  </TableCell>
                </TableRow>
                {sortedCustomRules.map(rule => renderRuleRow(rule, false))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRuleId} onOpenChange={() => setDeleteRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Firewall Rule?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete this firewall rule. This action cannot be undone.
                The VM's network traffic will no longer match this rule.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedRules.length} Firewall Rules?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete {selectedRules.length} firewall rule{selectedRules.length !== 1 ? 's' : ''}.
                This action cannot be undone.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Warning:</strong> The VM's network traffic will no longer match these rules.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRules.length} Rules
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FirewallCustomRules;
