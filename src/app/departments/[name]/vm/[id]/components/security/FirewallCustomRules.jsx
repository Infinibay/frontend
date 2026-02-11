'use client';

import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Shield, Trash2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

/**
 * FirewallCustomRules - Shows ALL rules (department + custom) in unified list
 * Redesigned to match DepartmentFirewallRulesList visual layout
 * Single simple table like department view
 */
const FirewallCustomRules = ({ vmId, customRules, departmentRules, onRefetch }) => {
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteRule] = useDeleteFirewallRuleMutation();

  // Combine all rules into one array
  const allRules = useMemo(() => {
    const deptWithFlag = departmentRules.map(r => ({ ...r, isInherited: true }));
    const customWithFlag = customRules.map(r => ({ ...r, isInherited: false }));
    return [...deptWithFlag, ...customWithFlag];
  }, [departmentRules, customRules]);

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
    // Only select custom rules (not inherited)
    const selectableRules = customRules.map(r => r.id);
    if (selectedRules.length === selectableRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(selectableRules);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRules = useMemo(() => {
    if (!sortConfig.key) return allRules;

    return [...allRules].sort((a, b) => {
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
  }, [allRules, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const renderRuleRow = (rule) => {
    const actionInfo = getActionInfo(rule.action);
    const directionInfo = getDirectionInfo(rule.direction);
    const priorityInfo = getPriorityLabel(rule.priority);
    const portLabel = getPortLabel(rule.dstPortStart, rule.dstPortEnd, rule.protocol);
    const isSelected = selectedRules.includes(rule.id);
    const isInherited = rule.isInherited;

    return (
      <TableRow key={rule.id} className={isSelected ? 'bg-primary/5' : ''}>
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
            <Shield className="size-icon text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <div className="font-medium size-text">{rule.name}</div>
              {rule.description && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {rule.description}
                </div>
              )}
              <Badge
                variant="outline"
                className={`mt-1 text-xs ${
                  isInherited
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                }`}
              >
                {isInherited ? 'Inherited from Department' : 'VM-specific'}
              </Badge>
              {rule.overridesDept && (
                <Badge className="mt-1 text-xs bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 border ml-1">
                  <AlertCircle className="size-icon mr-1" />
                  Overrides Department
                </Badge>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge className={`${actionInfo.bgColor} ${actionInfo.color} border-0`}>
            <actionInfo.icon className="h-3.5 w-3.5 mr-1" />
            {actionInfo.label}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            <directionInfo.icon className={`h-3.5 w-3.5 mr-1 ${directionInfo.color}`} />
            {directionInfo.label}
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
          {!isInherited ? (
            <div className="flex items-center gap-1">
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
          ) : (
            <span className="text-xs text-muted-foreground">Read-only</span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const allSelected = customRules.length > 0 && selectedRules.length === customRules.length;
  const someSelected = selectedRules.length > 0 && selectedRules.length < customRules.length;

  if (allRules.length === 0) {
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
            {sortedRules.map(rule => renderRuleRow(rule))}
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
