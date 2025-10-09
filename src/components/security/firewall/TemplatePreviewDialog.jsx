'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { expandTemplateToRules } from '@/config/firewallTemplates';
import {
  getActionInfo,
  getDirectionInfo,
  getPortLabel,
  getPriorityLabel
} from '@/utils/firewallHelpers';

const TemplatePreviewDialog = ({ template, isOpen, onClose, onApply }) => {
  const [selectedRules, setSelectedRules] = useState([]);

  useEffect(() => {
    if (template) {
      const rules = expandTemplateToRules(template);
      setSelectedRules(rules.map((_, idx) => idx));
    }
  }, [template]);

  if (!template) return null;

  const rules = expandTemplateToRules(template);

  const toggleRule = (idx) => {
    setSelectedRules(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const toggleAllRules = () => {
    if (selectedRules.length === rules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(rules.map((_, idx) => idx));
    }
  };

  const handleApply = () => {
    const selectedRulesList = rules.filter((_, idx) => selectedRules.includes(idx));
    const templateWithSelectedRules = {
      ...template,
      selectedRules: selectedRulesList
    };
    onApply(templateWithSelectedRules);
  };

  const allSelected = selectedRules.length === rules.length;
  const someSelected = selectedRules.length > 0 && selectedRules.length < rules.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.icon} {template.displayName}
          </DialogTitle>
          <DialogDescription>
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={allSelected}
                data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                onCheckedChange={toggleAllRules}
              />
              <label htmlFor="select-all" className="font-semibold cursor-pointer">
                Template Rules ({selectedRules.length}/{rules.length} selected)
              </label>
            </div>
            <Badge>{template.category}</Badge>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rules.map((rule, idx) => {
              const actionInfo = getActionInfo(rule.action);
              const directionInfo = getDirectionInfo(rule.direction);
              const priorityInfo = getPriorityLabel(rule.priority);
              const portLabel = getPortLabel(rule.dstPortStart, rule.dstPortEnd, rule.protocol);
              const isSelected = selectedRules.includes(idx);

              return (
                <div
                  key={idx}
                  className={`glass-subtle p-3 rounded-lg border text-sm transition-all ${
                    isSelected ? 'border-primary/50 bg-primary/5' : 'border-border/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`rule-${idx}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleRule(idx)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={`rule-${idx}`} className="font-medium mb-1 cursor-pointer block">
                        {rule.name}
                      </label>
                      {rule.description && (
                        <div className="text-xs text-muted-foreground mb-2">
                          {rule.description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <Badge className={`${actionInfo.bgColor} ${actionInfo.color} border-0`}>
                          {actionInfo.icon} {actionInfo.label}
                        </Badge>
                        <Badge variant="outline">
                          {directionInfo.icon} {directionInfo.label}
                        </Badge>
                        <Badge variant="outline">
                          {rule.protocol.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {portLabel}
                        </Badge>
                        <Badge className={`${priorityInfo.color} border-current`} variant="outline">
                          {priorityInfo.label} ({rule.priority})
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={selectedRules.length === 0}>
            Apply {selectedRules.length} Rule{selectedRules.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
