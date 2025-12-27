"use client"

import React from "react"
import { useSelector } from "react-redux"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWizardContext } from "@/components/ui/wizard"
import { useFormError } from "@/components/ui/form-error-provider"
import { selectDepartments, selectDepartmentsLoading } from "@/state/slices/departments"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"
import { Building2, User, Lock, KeyRound, Server, Eye, EyeOff } from "lucide-react"

const debug = createDebugger('frontend:components:basic-info-step')

/**
 * BasicInfoStep component for machine creation wizard
 * Handles machine name, credentials, and department selection
 */
export function BasicInfoStep({ id, departmentId = null }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);

  // Password visibility state
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Password mismatch detection
  const passwordMismatch = React.useMemo(() => {
    if (!stepValues.confirmPassword || !stepValues.password) return false;
    return stepValues.confirmPassword !== stepValues.password;
  }, [stepValues.confirmPassword, stepValues.password]);

  const passwordsMatch = React.useMemo(() => {
    if (!stepValues.confirmPassword || !stepValues.password) return false;
    return stepValues.confirmPassword === stepValues.password;
  }, [stepValues.confirmPassword, stepValues.password]);

  // Only consider departmentId valid if it exists in the departments list
  const isDepartmentIdValid = React.useMemo(() => {
    return departmentId != null && departments.some(d => String(d.id) === String(departmentId));
  }, [departmentId, departments]);

  React.useEffect(() => {
    debug.log('render', 'BasicInfoStep rendered:', {
      stepId: id,
      departmentId,
      departmentCount: departments.length,
      isLoading,
      hasValues: Object.keys(stepValues).length > 0
    })
  }, [id, departmentId, departments.length, isLoading, stepValues])

  // Auto-select department logic
  React.useEffect(() => {
    if (departments.length > 0 && !isLoading) {
      // If a specific departmentId is provided, use it
      if (departmentId && !stepValues.departmentId) {
        const targetDept = departments.find(dept => String(dept.id) === String(departmentId));
        if (targetDept) {
          debug.info('selection', 'Department auto-selected:', { departmentId, departmentName: targetDept.name })
          setValue(`${id}.departmentId`, String(departmentId));
          return;
        }
      }

      // Otherwise, auto-select first department if no department is selected
      if (!stepValues.departmentId) {
        debug.log('selection', 'First department auto-selected:', departments[0].name)
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
        <Card
          glass="subtle"
          className="p-6"
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
            {isDepartmentIdValid && (
              <p className="text-sm text-muted-foreground -mt-2 mb-2">
                Department preselected from navigation
              </p>
            )}
            <Select
              value={stepValues.departmentId || ''}
              onValueChange={(value) => {
                debug.info('selection', 'Department manually selected:', { departmentId: value })
                setValue(`${id}.departmentId`, value)
              }}
              disabled={isDepartmentIdValid || isLoading}
              aria-describedby="Select department for this machine"
            >
              <SelectTrigger
                id="departmentId"
                glass="subtle"
                error={!!getError('departmentId')}
                aria-label="Select department"
                aria-describedby={getError('departmentId') ? 'departmentId-error' : undefined}
                className={cn("size-input", isDepartmentIdValid && "border-primary/50")}
              >
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent loading={isLoading} glass="medium">
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

        <Card
          glass="subtle"
          className="p-6"
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
                onChange={(e) => {
                  debug.log('input', 'Machine name changed:', e.target.value)
                  setValue(`${id}.name`, e.target.value)
                }}
                className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${getError('name') ? 'border-red-500' : ''}`}
              />
              {getError('name') && (
                <p className="text-sm text-red-500" role="alert">{getError('name')}</p>
              )}
            </div>
          </div>
        </Card>

        <Card
          glass="subtle"
          className="p-6"
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
                onChange={(e) => {
                  debug.log('input', 'Username changed:', e.target.value)
                  setValue(`${id}.username`, e.target.value)
                }}
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a secure password"
                  value={stepValues.password || ''}
                  onChange={(e) => {
                    debug.log('input', 'Password changed:', { hasValue: e.target.value.length > 0 })
                    setValue(`${id}.password`, e.target.value)
                  }}
                  className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md pr-10 ${getError('password') ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {getError('password') && (
                <p className="text-sm text-red-500" role="alert">{getError('password')}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-base font-semibold"
                  >
                    Confirm Password
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Re-enter your password to confirm
                  </p>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={stepValues.confirmPassword || ''}
                  onChange={(e) => setValue(`${id}.confirmPassword`, e.target.value)}
                  className={cn(
                    "bg-background hover:bg-accent/50 transition-all focus:shadow-md pr-10",
                    (passwordMismatch || getError('confirmPassword')) && "border-red-500",
                    passwordsMatch && !getError('confirmPassword') && "border-green-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {(passwordMismatch || getError('confirmPassword')) && (
                <p className="text-sm text-red-500" role="alert">
                  {getError('confirmPassword') || 'Passwords do not match'}
                </p>
              )}
              {passwordsMatch && !getError('confirmPassword') && (
                <p className="text-sm text-green-600">Passwords match</p>
              )}
            </div>
          </div>
        </Card>

        {values.configuration?.os?.startsWith('WINDOWS') && (
          <Card
            glass="subtle"
            className="p-6"
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
