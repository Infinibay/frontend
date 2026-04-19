"use client"

import React from "react"
import { useSelector } from "react-redux"
import { Card, Select, TextField } from "@infinibay/harbor"
import { useWizardContext } from "@/components/ui/wizard"
import { useFormError } from "@/components/ui/form-error-provider"
import { selectDepartments, selectDepartmentsLoading } from "@/state/slices/departments"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"
import { Building2, User, Lock, KeyRound, Server, Eye, EyeOff } from "lucide-react"

const debug = createDebugger('frontend:components:basic-info-step')

/**
 * BasicInfoStep component for machine creation wizard.
 * Handles machine name, credentials, and department selection.
 */
export function BasicInfoStep({ id, departmentId = null, className }) {
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
      if (departmentId && !stepValues.departmentId) {
        const targetDept = departments.find(dept => String(dept.id) === String(departmentId));
        if (targetDept) {
          debug.info('selection', 'Department auto-selected:', { departmentId, departmentName: targetDept.name })
          setValue(`${id}.departmentId`, String(departmentId));
          return;
        }
      }

      if (!stepValues.departmentId) {
        debug.log('selection', 'First department auto-selected:', departments[0].name)
        setValue(`${id}.departmentId`, String(departments[0].id));
      }
    }
  }, [departments, isLoading, stepValues.departmentId, setValue, id, departmentId]);

  const departmentOptions = departments.map(dept => ({
    value: String(dept.id),
    label: dept.name,
  }));

  const isWindows = values.configuration?.os?.startsWith('WINDOWS');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Department */}
      <Card variant="default" spotlight={false} glow={false} className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/25">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <label className="text-base font-semibold text-fg">
                Department
              </label>
              <p className="text-xs text-fg-muted mt-0.5">
                {isDepartmentIdValid
                  ? "Department preselected from navigation"
                  : "Select the department this machine will belong to"}
              </p>
            </div>
          </div>
          <Select
            options={departmentOptions}
            value={stepValues.departmentId || ''}
            onChange={(value) => {
              debug.info('selection', 'Department manually selected:', { departmentId: value })
              setValue(`${id}.departmentId`, value)
            }}
            disabled={isDepartmentIdValid || isLoading}
            placeholder={isLoading ? "Loading departments..." : "Select a department"}
          />
          {getError('departmentId') && (
            <p className="text-sm text-danger" role="alert">
              {getError('departmentId')}
            </p>
          )}
        </div>
      </Card>

      {/* Machine name */}
      <Card variant="default" spotlight={false} glow={false} className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent-2/15 flex items-center justify-center border border-accent-2/25">
              <Server className="h-5 w-5 text-accent-2" />
            </div>
            <div className="flex-1">
              <label className="text-base font-semibold text-fg">
                Machine Name
              </label>
              <p className="text-xs text-fg-muted mt-0.5">
                Choose a unique name that helps you identify this machine
              </p>
            </div>
          </div>
          <TextField
            id="name"
            icon={<Server className="h-4 w-4" />}
            placeholder="e.g., dev-server-01, web-app-prod"
            value={stepValues.name || ''}
            onChange={(e) => {
              debug.log('input', 'Machine name changed:', e.target.value)
              setValue(`${id}.name`, e.target.value)
            }}
            error={getError('name') || undefined}
          />
        </div>
      </Card>

      {/* Credentials */}
      <Card variant="default" spotlight={false} glow={false} className="p-6">
        <div className="space-y-6">
          {/* Username */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/25">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <label className="text-base font-semibold text-fg">
                  Username
                </label>
                <p className="text-xs text-fg-muted mt-0.5">
                  This will be the main user account for the machine
                </p>
              </div>
            </div>
            <TextField
              id="username"
              icon={<User className="h-4 w-4" />}
              placeholder="e.g., admin, developer"
              value={stepValues.username || ''}
              onChange={(e) => {
                debug.log('input', 'Username changed:', e.target.value)
                setValue(`${id}.username`, e.target.value)
              }}
              error={getError('username') || undefined}
            />
          </div>

          {/* Password */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/25">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <label className="text-base font-semibold text-fg">
                  Password
                </label>
                <p className="text-xs text-fg-muted mt-0.5">
                  Choose a strong password for the user account
                </p>
              </div>
            </div>
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-4 w-4" />}
              placeholder="Enter a secure password"
              value={stepValues.password || ''}
              onChange={(e) => {
                debug.log('input', 'Password changed:', { hasValue: e.target.value.length > 0 })
                setValue(`${id}.password`, e.target.value)
              }}
              error={getError('password') || undefined}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-fg-muted hover:text-fg transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/25">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <label className="text-base font-semibold text-fg">
                  Confirm Password
                </label>
                <p className="text-xs text-fg-muted mt-0.5">
                  Re-enter your password to confirm
                </p>
              </div>
            </div>
            <TextField
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={<Lock className="h-4 w-4" />}
              placeholder="Confirm your password"
              value={stepValues.confirmPassword || ''}
              onChange={(e) => setValue(`${id}.confirmPassword`, e.target.value)}
              valid={passwordsMatch && !getError('confirmPassword') ? true : undefined}
              error={
                (passwordMismatch && !getError('confirmPassword'))
                  ? 'Passwords do not match'
                  : getError('confirmPassword') || undefined
              }
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-fg-muted hover:text-fg transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            {passwordsMatch && !getError('confirmPassword') && (
              <p className="text-xs text-success">Passwords match</p>
            )}
          </div>
        </div>
      </Card>

      {/* Windows product key */}
      {isWindows && (
        <Card variant="default" spotlight={false} glow={false} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/15 flex items-center justify-center border border-warning/25">
                <KeyRound className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <label className="text-base font-semibold text-fg">
                  Product Key (Optional)
                </label>
                <p className="text-xs text-fg-muted mt-0.5">
                  If you have a Windows product key, enter it here
                </p>
              </div>
            </div>
            <TextField
              id="productKey"
              icon={<KeyRound className="h-4 w-4" />}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
              value={stepValues.productKey || ''}
              onChange={(e) => setValue(`${id}.productKey`, e.target.value)}
              error={getError('productKey') || undefined}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
