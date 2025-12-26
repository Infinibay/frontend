'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createVm, selectVmsLoading, selectVmsError } from '@/state/slices/vms';
import { Wizard } from '@/components/ui/wizard';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
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

  // Load departments on mount
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Set initial values once departments are loaded or if departmentId is provided
  useEffect(() => {
    // If departmentId is provided, we can set initial values immediately
    if (departmentId && !initialValues) {
      setInitialValues({
        basicInfo: {
          departmentId: departmentId
        },
        gpu: {
          gpuId: 'no-gpu',
          pciBus: null,
          gpuInfo: null
        }
      });
    } else if (departments.length > 0 && !initialValues) {
      // Otherwise, wait for departments to be loaded
      setInitialValues({
        basicInfo: {
          departmentId: departments[0].id
        },
        gpu: {
          gpuId: 'no-gpu',
          pciBus: null,
          gpuInfo: null
        }
      });
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
        departmentId: (departmentId || values.basicInfo.departmentId),
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
        description: `Virtual machine "${values.basicInfo.name}" has been created successfully.`
      });

      router.push('/computers');
    } catch (error) {
      console.error('Failed to create machine:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: createError || "Failed to create virtual machine. Please try again."
      });
    }
  };

  // Don't render until initial values are ready
  if (!initialValues) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isCreating && (
        <LoadingOverlay
          message="Creating your virtual machine..."
          variant="pulse"
          size="xl"
        />
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
            if (departmentId == null && !values.departmentId) {
              errors.departmentId = 'Department is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
          departmentId={departmentId}
          className="glass-strong"
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
          className="glass-strong"
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
          className="glass-strong"
        />
        <GpuSelectionStep
          id="gpu"
          className="glass-strong"
        />
        <ApplicationsScriptsStep
          id="applications"
          className="glass-strong"
        />
        <ReviewStep
          id="review"
          className="glass-strong" />
      </Wizard>
    </>
  );
}
