'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { selectDepartments, selectDepartmentsLoading } from '@/state/slices/departments';
import { Building2, User, Lock, KeyRound, Server } from 'lucide-react';
import { useSafeResolvedTheme } from '@/utils/safe-theme';
import { getWizardStepCardClasses, getWizardStepCardStyles } from '@/utils/wizard-glass-helpers';
import { cn } from '@/lib/utils';

export function BasicInfoStep({ id, departmentId = null }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);
  const theme = useSafeResolvedTheme();

  // Auto-select department logic
  React.useEffect(() => {
    if (departments.length > 0 && !isLoading) {
      // If a specific departmentId is provided, use it
      if (departmentId && !stepValues.departmentId) {
        const targetDept = departments.find(dept => dept.id === departmentId);
        if (targetDept) {
          setValue(`${id}.departmentId`, String(departmentId));
          return;
        }
      }

      // Otherwise, auto-select first department if no department is selected
      if (!stepValues.departmentId) {
        setValue(`${id}.departmentId`, String(departments[0].id));
      }
    }
  }, [departments, isLoading, stepValues.departmentId, setValue, id, departmentId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Provide basic information about your machine.
        </p>
      </div>

      <div className="space-y-6">
        {departmentId == null && (
          <Card
            className={cn("p-6", getWizardStepCardClasses(theme))}
            style={getWizardStepCardStyles(theme)}
            glow="none"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label
                    htmlFor="departmentId"
                    className="text-base font-semibold"
                    moreInformation="Select the department this machine will belong to"
                  >
                    Department
                  </Label>
                </div>
              </div>
              <Select
                searchable
                value={stepValues.departmentId || ''}
                onValueChange={(value) => setValue(`${id}.departmentId`, value)}
                disabled={isLoading}
                aria-describedby="Select department for this machine"
              >
                <SelectTrigger
                  id="departmentId"
                  placeholder="Type to search departments..."
                  error={!!getError('departmentId')}
                  aria-label="Search and select department"
                  aria-describedby={getError('departmentId') ? 'departmentId-error' : undefined}
                >
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent loading={isLoading}>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError('departmentId') && (
                <p id="departmentId-error" className="text-sm text-red-500" role="alert">
                  {getError('departmentId')}
                </p>
              )}
            </div>
          </Card>
        )}

        <Card
          className={cn("p-6", getWizardStepCardClasses(theme))}
          style={getWizardStepCardStyles(theme)}
          glow="none"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Server className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold"
                    moreInformation="The machine name must be unique across your organization. Use a descriptive name that helps identify the machine's purpose."
                  >
                    Machine Name
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a unique name that helps you identify this machine
                  </p>
                </div>
              </div>
              <Input
                id="name"
                placeholder="e.g., dev-server-01, web-app-prod"
                value={stepValues.name || ''}
                onChange={(e) => setValue(`${id}.name`, e.target.value)}
                className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${getError('name') ? 'border-red-500' : ''}`}
              />
              {getError('name') && (
                <p className="text-sm text-red-500" role="alert">{getError('name')}</p>
              )}
            </div>
          </div>
        </Card>

        <Card
          className={cn("p-6", getWizardStepCardClasses(theme))}
          style={getWizardStepCardStyles(theme)}
          glow="none"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="username"
                    className="text-base font-semibold"
                    moreInformation="This username will be used to log into the machine. Choose a username that follows your organization's naming conventions."
                  >
                    Username
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be the main user account for the machine
                  </p>
                </div>
              </div>
              <Input
                id="username"
                placeholder="e.g., admin, developer"
                value={stepValues.username || ''}
                onChange={(e) => setValue(`${id}.username`, e.target.value)}
                className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${getError('username') ? 'border-red-500' : ''}`}
              />
              {getError('username') && (
                <p className="text-sm text-red-500" role="alert">{getError('username')}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="password"
                    className="text-base font-semibold"
                    moreInformation="Password must be secure. Use a combination of uppercase, lowercase, numbers, and special characters."
                  >
                    Password
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a strong password for the user account
                  </p>
                </div>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter a secure password"
                value={stepValues.password || ''}
                onChange={(e) => setValue(`${id}.password`, e.target.value)}
                className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${getError('password') ? 'border-red-500' : ''}`}
              />
              {getError('password') && (
                <p className="text-sm text-red-500" role="alert">{getError('password')}</p>
              )}
            </div>
          </div>
        </Card>

        {values.configuration?.os?.startsWith('WINDOWS') && (
          <Card
            className={cn("p-6", getWizardStepCardClasses(theme))}
            style={getWizardStepCardStyles(theme)}
            glow="none"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="productKey"
                    className="text-base font-semibold"
                    moreInformation="A valid Windows product key is required to activate Windows. If you don't have one now, you can add it later."
                  >
                    Product Key (Optional)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you have a Windows product key, enter it here
                  </p>
                </div>
              </div>
              <Input
                id="productKey"
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                value={stepValues.productKey || ''}
                onChange={(e) => setValue(`${id}.productKey`, e.target.value)}
                className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${getError('productKey') ? 'border-red-500' : ''}`}
              />
              {getError('productKey') && (
                <p className="text-sm text-red-500" role="alert">{getError('productKey')}</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
