'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createVm, selectVmsLoading, selectVmsError } from '@/state/slices/vms';
import { EmptyState, LoadingOverlay, Page } from '@infinibay/harbor';
import { Wizard } from './wizard/wizard';
import { useToast } from '@/hooks/use-toast';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ResourcesStep } from './steps/ResourcesStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { ApplicationsScriptsStep } from './steps/ApplicationsScriptsStep';
import { ReviewStep } from './steps/ReviewStep';
import { GpuSelectionStep } from './steps/GpuSelectionStep';
import { fetchDepartments, selectDepartments } from '@/state/slices/departments';

export default function CreateMachineWizard({ departmentId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { create: isCreating } = useSelector(selectVmsLoading);
  const { create: createError } = useSelector(selectVmsError);
  const departments = useSelector(selectDepartments);
  const [initialValues, setInitialValues] = useState(null);
  // Track validated departmentId - only set if it exists in departments
  const [validatedDepartmentId, setValidatedDepartmentId] = useState(null);

  // Load departments on mount
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Set initial values once departments are loaded, validating departmentId
  useEffect(() => {
    if (departments.length > 0 && !initialValues) {
      // Check if provided departmentId exists in departments
      const departmentExists = departmentId && departments.some(d => String(d.id) === String(departmentId));

      const selectedDepartmentId = departmentExists
        ? String(departmentId)
        : String(departments[0].id);

      // Intentional: one-shot wizard initialisation when deps load.
      /* eslint-disable react-hooks/set-state-in-effect */
      setValidatedDepartmentId(departmentExists ? departmentId : null);
      setInitialValues({
        basicInfo: {
          departmentId: selectedDepartmentId
        },
        gpu: {
          gpuId: 'no-gpu',
          pciBus: null,
          gpuInfo: null
        }
      });
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [departments, departmentId, initialValues]);

  const handleComplete = async (values) => {
    try {
      // Format the data according to the mutation requirements
      const machineData = {
        name: values.basicInfo.name,
        username: values.basicInfo.username,
        password: values.basicInfo.password,
        os: values.configuration.os,
        productKey: values.configuration.productKey || '',
        pciBus: values.gpu.pciBus,
        departmentId: String(validatedDepartmentId || values.basicInfo.departmentId),
        applications: (values.applications?.applications || []).map(appId => ({
          applicationId: appId,
          parameters: {} // Add any necessary parameters here
        })),
        firstBootScripts: (values.applications?.scripts || []).map(script => ({
          scriptId: script.scriptId,
          inputValues: script.inputValues
        }))
      };

      // Add template or custom hardware data
      if (values.resources.templateId === 'custom') {
        // Using custom hardware
        machineData.templateId = null;
        machineData.customCores = values.resources.customCores;
        machineData.customRam = values.resources.customRam;
        machineData.customStorage = values.resources.customStorage;
      } else {
        // Using template
        machineData.templateId = values.resources.templateId;
      }

      await dispatch(createVm(machineData)).unwrap();

      toast({
        variant: "success",
        title: "Success!",
        description: `Desktop "${values.basicInfo.name}" has been created successfully.`
      });

      router.push('/desktops');
    } catch (error) {
      console.error('Failed to create machine:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: createError || "Failed to create desktop. Please try again."
      });
    }
  };

  // Don't render until initial values are ready
  if (!initialValues) {
    return (
      <Page size="md">
        <EmptyState variant="inline" title="Loading…" />
      </Page>
    );
  }

  return (
    <>
      {isCreating && (
        <LoadingOverlay label="Creating your desktop…" fill size={32} />
      )}
      <Wizard onComplete={handleComplete} initialValues={initialValues}>
        <BasicInfoStep
          id="basicInfo"
          validate={async (values) => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Name is required';
            } else if (values.name.length < 3) {
              errors.name = 'Name must be at least 3 characters';
            }
            if (!values.username) {
              errors.username = 'Username is required';
            }
            if (!values.password) {
              errors.password = 'Password is required';
            }
            if (!values.confirmPassword) {
              errors.confirmPassword = 'Please confirm your password';
            } else if (values.password !== values.confirmPassword) {
              errors.confirmPassword = 'Passwords do not match';
            }
            if (validatedDepartmentId == null && !values.departmentId) {
              errors.departmentId = 'Department is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
          departmentId={validatedDepartmentId}
        />
        <ConfigurationStep
          id="configuration"
          validate={async (values) => {
            const errors = {};
            if (!values.os) {
              errors.os = 'Operating System is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
        />
        <ResourcesStep
          id="resources"
          validate={async (values) => {
            const errors = {};
            if (!values.templateId) {
              errors.templateId = 'Template is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
        />
        <GpuSelectionStep id="gpu" />
        <ApplicationsScriptsStep id="applications" />
        <ReviewStep id="review" />
      </Wizard>
    </>
  );
}
