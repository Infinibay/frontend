'use client';

/**
 * AutomationForm Component
 *
 * Form for editing automation metadata like name, description, scope, and severity.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDepartmentsQuery } from '@/gql/hooks';
import { Loader2, Save } from 'lucide-react';

const SEVERITY_OPTIONS = [
  { value: 'LOW', label: 'Low', description: 'Minor issue, informational' },
  { value: 'MEDIUM', label: 'Medium', description: 'Should be addressed soon' },
  { value: 'HIGH', label: 'High', description: 'Urgent, needs attention' },
  { value: 'CRITICAL', label: 'Critical', description: 'Critical issue, immediate action' },
];

const SCOPE_OPTIONS = [
  { value: 'ALL_VMS', label: 'All VMs', description: 'Apply to all virtual machines' },
  { value: 'DEPARTMENT', label: 'Department', description: 'Apply to VMs in a specific department' },
  { value: 'SPECIFIC_VMS', label: 'Specific VMs', description: 'Apply only to selected VMs' },
  { value: 'EXCLUDE_VMS', label: 'Exclude VMs', description: 'Apply to all except selected VMs' },
];

const COOLDOWN_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 7200, label: '2 hours' },
  { value: 14400, label: '4 hours' },
  { value: 28800, label: '8 hours' },
  { value: 86400, label: '24 hours' },
];

export function AutomationForm({ automation, isNew, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'ALL_VMS',
    departmentId: null,
    severity: 'MEDIUM',
    cooldownSeconds: 3600,
    recommendationTitle: '',
    recommendationDescription: '',
    priority: 100,
  });

  const { data: departmentsData } = useDepartmentsQuery();

  // Initialize form with automation data
  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name || '',
        description: automation.description || '',
        scope: automation.scope || 'ALL_VMS',
        departmentId: automation.department?.id || null,
        severity: automation.severity || 'MEDIUM',
        cooldownSeconds: automation.cooldownSeconds || 3600,
        recommendationTitle: automation.recommendationTitle || '',
        recommendationDescription: automation.recommendationDescription || '',
        priority: automation.priority || 100,
      });
    }
  }, [automation]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  const departments = departmentsData?.departments || [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Name and description for this automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., High CPU Alert"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what this automation does..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Targeting */}
        <Card>
          <CardHeader>
            <CardTitle>Target VMs</CardTitle>
            <CardDescription>Which VMs should this automation apply to?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Select
                value={formData.scope}
                onValueChange={(v) => handleChange('scope', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCOPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {opt.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.scope === 'DEPARTMENT' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.departmentId || ''}
                  onValueChange={(v) => handleChange('departmentId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendation Settings</CardTitle>
            <CardDescription>How the recommendation appears when triggered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) => handleChange('severity', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooldown">Cooldown</Label>
                <Select
                  value={String(formData.cooldownSeconds)}
                  onValueChange={(v) => handleChange('cooldownSeconds', Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COOLDOWN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Time before the automation can trigger again for the same VM
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendationTitle">Recommendation Title</Label>
              <Input
                id="recommendationTitle"
                value={formData.recommendationTitle}
                onChange={(e) => handleChange('recommendationTitle', e.target.value)}
                placeholder="e.g., High CPU Usage Detected"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the automation name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendationDescription">Recommendation Description</Label>
              <Textarea
                id="recommendationDescription"
                value={formData.recommendationDescription}
                onChange={(e) => handleChange('recommendationDescription', e.target.value)}
                placeholder="e.g., CPU usage has been above 90% for an extended period..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority (1-1000)</Label>
              <Input
                id="priority"
                type="number"
                min={1}
                max={1000}
                value={formData.priority}
                onChange={(e) => handleChange('priority', Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers = higher priority. Used when multiple automations trigger.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default AutomationForm;
