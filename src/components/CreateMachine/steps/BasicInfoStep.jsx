'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { fetchDepartments, selectDepartments, selectDepartmentsLoading } from '@/state/slices/departments';

export function BasicInfoStep({ id, departmentId=null }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);
  console.log("first step, department id is", departmentId);

  // useEffect(() => {
  //   if (!values.basicInfo?.departmentId) {
  //     dispatch(fetchDepartments());
  //   }
  // }, [dispatch]);

  // If departmentId is provided in the URL, set it once when the component mounts
  // useEffect(() => {
  //   const urlDepartmentId = values.departmentId;
  //   if (urlDepartmentId && !stepValues.departmentId) {
  //     setValue(`${id}.departmentId`, urlDepartmentId);
  //   }
  // }, [values.departmentId, stepValues.departmentId, setValue, id]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Provide basic information about your machine.
        </p>
      </div>

      <Card className="p-6 border-primary/10 bg-primary/5">
        <div className="space-y-4">
          {departmentId == null && (
            <div className="space-y-2">
              <Label 
                htmlFor="departmentId"
                moreInformation="Select the department this machine will belong to"
              >
                Department
              </Label>
              <Select
                value={stepValues.departmentId || ''}
                onValueChange={(value) => setValue(`${id}.departmentId`, value)}
                disabled={isLoading}
              >
                <SelectTrigger id="departmentId" className={`bg-background ${getError('departmentId') ? 'border-red-500' : ''}`}>
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
              {getError('departmentId') && (
                <p className="text-sm text-red-500">{getError('departmentId')}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label 
              htmlFor="name"
              moreInformation="The machine name must be unique across your organization. Use a descriptive name that helps identify the machine's purpose."
            >
              Machine Name
            </Label>
            <Input
              id="name"
              placeholder="Enter machine name"
              value={stepValues.name || ''}
              onChange={(e) => setValue(`${id}.name`, e.target.value)}
              className={`bg-background ${getError('name') ? 'border-red-500' : ''}`}
            />
            {getError('name') && (
              <p className="text-sm text-red-500">{getError('name')}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Choose a unique name that helps you identify this machine.
            </p>
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="username"
              moreInformation="This username will be used to log into the machine. Choose a username that follows your organization's naming conventions."
            >
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={stepValues.username || ''}
              onChange={(e) => setValue(`${id}.username`, e.target.value)}
              className={`bg-background ${getError('username') ? 'border-red-500' : ''}`}
            />
            {getError('username') && (
              <p className="text-sm text-red-500">{getError('username')}</p>
            )}
            <p className="text-sm text-muted-foreground">
              This will be the main user account for the machine.
            </p>
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="password"
              moreInformation="Password must be secure. Use a combination of uppercase, lowercase, numbers, and special characters."
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={stepValues.password || ''}
              onChange={(e) => setValue(`${id}.password`, e.target.value)}
              className={`bg-background ${getError('password') ? 'border-red-500' : ''}`}
            />
            {getError('password') && (
              <p className="text-sm text-red-500">{getError('password')}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Choose a strong password for the user account.
            </p>
          </div>

          {values.configuration?.os?.startsWith('WINDOWS') && (
            <div className="space-y-2">
              <Label 
                htmlFor="productKey"
                moreInformation="A valid Windows product key is required to activate Windows. If you don't have one now, you can add it later."
              >
                Product Key (Optional)
              </Label>
              <Input
                id="productKey"
                placeholder="Enter Windows product key"
                value={stepValues.productKey || ''}
                onChange={(e) => setValue(`${id}.productKey`, e.target.value)}
                className={`bg-background ${getError('productKey') ? 'border-red-500' : ''}`}
              />
              {getError('productKey') && (
                <p className="text-sm text-red-500">{getError('productKey')}</p>
              )}
              <p className="text-sm text-muted-foreground">
                If you have a Windows product key, enter it here.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
