'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
  Badge,
  Card,
  FormField,
  IconButton,
  Page,
  PasswordStrength,
  ResponsiveStack,
  Select,
  TextField,
} from '@infinibay/harbor';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import {
  selectDepartments,
  selectDepartmentsLoading,
} from '@/state/slices/departments';
import { createDebugger } from '@/utils/debug';
import {
  Building2,
  User,
  Lock,
  KeyRound,
  Server,
  Eye,
  EyeOff,
} from 'lucide-react';

const debug = createDebugger('frontend:components:basic-info-step');

export function BasicInfoStep({ id, departmentId = null }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const passwordMismatch = React.useMemo(() => {
    if (!stepValues.confirmPassword || !stepValues.password) return false;
    return stepValues.confirmPassword !== stepValues.password;
  }, [stepValues.confirmPassword, stepValues.password]);

  const passwordsMatch = React.useMemo(() => {
    if (!stepValues.confirmPassword || !stepValues.password) return false;
    return stepValues.confirmPassword === stepValues.password;
  }, [stepValues.confirmPassword, stepValues.password]);

  const isDepartmentIdValid = React.useMemo(
    () =>
      departmentId != null &&
      departments.some((d) => String(d.id) === String(departmentId)),
    [departmentId, departments],
  );

  React.useEffect(() => {
    debug.log('render', 'BasicInfoStep rendered:', {
      stepId: id,
      departmentId,
      departmentCount: departments.length,
      isLoading,
      hasValues: Object.keys(stepValues).length > 0,
    });
  }, [id, departmentId, departments.length, isLoading, stepValues]);

  React.useEffect(() => {
    if (departments.length > 0 && !isLoading) {
      if (departmentId && !stepValues.departmentId) {
        const targetDept = departments.find(
          (dept) => String(dept.id) === String(departmentId),
        );
        if (targetDept) {
          debug.info('selection', 'Department auto-selected:', {
            departmentId,
            departmentName: targetDept.name,
          });
          setValue(`${id}.departmentId`, String(departmentId));
          return;
        }
      }
      if (!stepValues.departmentId) {
        debug.log('selection', 'First department auto-selected:', departments[0].name);
        setValue(`${id}.departmentId`, String(departments[0].id));
      }
    }
  }, [departments, isLoading, stepValues.departmentId, setValue, id, departmentId]);

  const departmentOptions = departments.map((dept) => ({
    value: String(dept.id),
    label: dept.name,
  }));

  const isWindows = values.configuration?.os?.startsWith('WINDOWS');

  const confirmError =
    passwordMismatch && !getError('confirmPassword')
      ? 'Passwords do not match'
      : getError('confirmPassword') || undefined;

  return (
    <Page size="lg">
        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Department"
          description={
            isDepartmentIdValid
              ? 'Department preselected from navigation'
              : 'Select the department this machine will belong to'
          }
          leadingIcon={<Building2 size={18} />}
          leadingIconTone="purple"
        >
          <FormField error={getError('departmentId')}>
            <Select
              options={departmentOptions}
              value={stepValues.departmentId || ''}
              onChange={(value) => {
                debug.info('selection', 'Department manually selected:', {
                  departmentId: value,
                });
                setValue(`${id}.departmentId`, value);
              }}
              disabled={isDepartmentIdValid || isLoading}
              placeholder={isLoading ? 'Loading departments…' : 'Select a department'}
            />
          </FormField>
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Machine Name"
          description="Choose a unique name that helps you identify this machine"
          leadingIcon={<Server size={18} />}
          leadingIconTone="sky"
        >
          <TextField
            id="name"
            icon={<Server size={14} />}
            placeholder="e.g., dev-server-01, web-app-prod"
            value={stepValues.name || ''}
            onChange={(e) => {
              debug.log('input', 'Machine name changed:', e.target.value);
              setValue(`${id}.name`, e.target.value);
            }}
            error={getError('name') || undefined}
          />
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Credentials"
          description="Main user account for the machine"
          leadingIcon={<User size={18} />}
          leadingIconTone="purple"
        >
          <ResponsiveStack direction="col" gap={5}>
            <FormField label="Username">
              <TextField
                id="username"
                icon={<User size={14} />}
                placeholder="e.g., admin, developer"
                value={stepValues.username || ''}
                onChange={(e) => {
                  debug.log('input', 'Username changed:', e.target.value);
                  setValue(`${id}.username`, e.target.value);
                }}
                error={getError('username') || undefined}
              />
            </FormField>

            <FormField label="Password" helper="Choose a strong password for the user account">
              <ResponsiveStack direction="col" gap={2}>
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  icon={<Lock size={14} />}
                  placeholder="Enter a secure password"
                  value={stepValues.password || ''}
                  onChange={(e) => {
                    debug.log('input', 'Password changed:', {
                      hasValue: e.target.value.length > 0,
                    });
                    setValue(`${id}.password`, e.target.value);
                  }}
                  error={getError('password') || undefined}
                  suffix={
                    <IconButton
                      size="sm"
                      variant="ghost"
                      reactive={false}
                      label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {stepValues.password ? (
                  <PasswordStrength value={stepValues.password} />
                ) : null}
              </ResponsiveStack>
            </FormField>

            <FormField label="Confirm Password">
              <ResponsiveStack direction="col" gap={2}>
                <TextField
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={<Lock size={14} />}
                  placeholder="Confirm your password"
                  value={stepValues.confirmPassword || ''}
                  onChange={(e) => setValue(`${id}.confirmPassword`, e.target.value)}
                  valid={
                    passwordsMatch && !getError('confirmPassword') ? true : undefined
                  }
                  error={confirmError}
                  suffix={
                    <IconButton
                      size="sm"
                      variant="ghost"
                      reactive={false}
                      label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={
                        showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />
                      }
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
                {passwordsMatch && !getError('confirmPassword') && (
                  <Badge tone="success">Passwords match</Badge>
                )}
              </ResponsiveStack>
            </FormField>
          </ResponsiveStack>
        </Card>

        {isWindows && (
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Product Key (Optional)"
            description="If you have a Windows product key, enter it here"
            leadingIcon={<KeyRound size={18} />}
            leadingIconTone="amber"
          >
            <TextField
              id="productKey"
              icon={<KeyRound size={14} />}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
              value={stepValues.productKey || ''}
              onChange={(e) => setValue(`${id}.productKey`, e.target.value)}
              error={getError('productKey') || undefined}
            />
          </Card>
        )}
    </Page>
  );
}
