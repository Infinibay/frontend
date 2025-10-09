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
import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useDeleteFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { playErrorTone } from '@/utils/audioFeedback';
import { toast } from 'sonner';
import {
  getActionInfo,
  getDirectionInfo,
  getPortLabel,
  getPriorityLabel
} from '@/utils/firewallHelpers';

const debug = createDebugger('frontend:components:firewall-rules-list');

/**
 * Unified FirewallRulesList component
 * Works for both Department and VM based on entityType
 * For Department: shows only department rules
 * For VM: shows inherited department rules + custom VM rules in one unified list
 */
const FirewallRulesList = ({
  entityType,
  entityId,
  rules,
  departmentRules = [],
  onRefetch
}) => {
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [shakeRuleId, setShakeRuleId] = useState(null);
  const [hasShownInheritedToast, setHasShownInheritedToast] = useState(false);
  const [deleteRule] = useDeleteFirewallRuleMutation();

  const isDepartment = entityType === ENTITY_TYPES.DEPARTMENT;

  // For VM: combine department rules (inherited) + VM custom rules
  // For Department: just use rules
  const allRules = useMemo(() => {
    if (isDepartment) {
      return rules.map(r => ({ ...r, isInherited: false }));
    }
    // VM: mark which rules are inherited
    const deptWithFlag = departmentRules.map(r => ({ ...r, isInherited: true }));
    const customWithFlag = rules.map(r => ({ ...r, isInherited: false }));
    return [...deptWithFlag, ...customWithFlag];
  }, [isDepartment, rules, departmentRules]);

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
    // Only select custom/editable rules (not inherited for VM)
    const selectableRules = allRules
      .filter(r => !r.isInherited)
      .map(r => r.id);

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

  const handleInheritedRuleClick = (ruleId) => {
    debug.log('Attempted to select inherited rule:', ruleId);

    // Trigger shake animation
    setShakeRuleId(ruleId);
    setTimeout(() => setShakeRuleId(null), 500);

    // Show toast only once per session
    if (!hasShownInheritedToast) {
      toast.info('Inherited rules are read-only', {
        description: 'Department rules cannot be deleted from VM view. Edit them in the department settings.',
        duration: 4000,
      });
      setHasShownInheritedToast(true);
    }

    // Play subtle low-frequency error tone
    playErrorTone();
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
    const isShaking = shakeRuleId === rule.id;

    const handleRowClick = () => {
      if (isInherited) {
        handleInheritedRuleClick(rule.id);
      } else {
        toggleRuleSelection(rule.id);
      }
    };

    return (
      <TableRow
        key={rule.id}
        className={`
          ${isSelected ? 'bg-primary/5' : ''}
          ${!isInherited ? 'cursor-pointer hover:bg-muted/20' : 'cursor-not-allowed opacity-60'}
          ${isShaking ? 'animate-shake' : ''}
          transition-all duration-200
        `}
        onClick={handleRowClick}
        title={isInherited ? 'Inherited from Department - Read only' : 'Click to select'}
      >
        <TableCell onClick={(e) => e.stopPropagation()}>
          {!isInherited && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleRuleSelection(rule.id)}
            />
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-start gap-2">
            <Shield className="size-icon text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <div className="font-medium size-text">{rule.name}</div>
              {rule.description && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {rule.description}
                </div>
              )}
              {/* Badge showing rule type */}
              <Badge
                variant="outline"
                className={`mt-1 text-xs ${
                  isDepartment
                    ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                    : isInherited
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                }`}
              >
                {isDepartment
                  ? 'Department-wide'
                  : isInherited
                  ? 'Inherited from Department'
                  : 'VM-specific'}
              </Badge>
              {rule.overridesDept && !isDepartment && (
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
        <TableCell onClick={(e) => e.stopPropagation()}>
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

  const allSelected = allRules.filter(r => !r.isInherited).length > 0 &&
                      selectedRules.length === allRules.filter(r => !r.isInherited).length;
  const someSelected = selectedRules.length > 0 &&
                       selectedRules.length < allRules.filter(r => !r.isInherited).length;

  if (allRules.length === 0) {
    return (
      <div className="text-center py-12 glass-subtle rounded-lg border border-border/20">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="size-heading mb-2">No {isDepartment ? 'Department' : 'Firewall'} Rules</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start by applying a security template or create custom {isDepartment ? 'department-wide ' : ''}rules
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
            <AlertDialogTitle>Delete {isDepartment ? 'Department ' : ''}Firewall Rule?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete this {isDepartment ? 'department-level ' : ''}firewall rule.
                This action cannot be undone.
              </p>
              {isDepartment && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                  <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Warning:</strong> This rule is inherited by all VMs in this department.
                    Deleting it will affect network traffic for all VMs.
                  </p>
                </div>
              )}
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
            <AlertDialogTitle>Delete {selectedRules.length} {isDepartment ? 'Department ' : ''}Firewall Rules?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete {selectedRules.length} {isDepartment ? 'department-level ' : ''}firewall rule{selectedRules.length !== 1 ? 's' : ''}.
                This action cannot be undone.
              </p>
              {isDepartment && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                  <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Warning:</strong> These rules are inherited by all VMs in this department.
                    Deleting them will affect network traffic for all VMs.
                  </p>
                </div>
              )}
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

export default FirewallRulesList;
