'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createVm, selectVmsLoading, selectVmsError } from '@/state/slices/vms';
import { Wizard } from '@/components/ui/wizard';
import { FormErrorProvider } from '@/components/ui/form-error-provider';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useToast } from '@/hooks/use-toast';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ResourcesStep } from './steps/ResourcesStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { ApplicationsStep } from './steps/ApplicationsStep';
import { ReviewStep } from './steps/ReviewStep';
import { GpuSelectionStep } from './steps/GpuSelectionStep';

export default function CreateMachineWizard({ departmentId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { create: isCreating } = useSelector(selectVmsLoading);
  const { create: createError } = useSelector(selectVmsError);
  console.log("Department id is", departmentId);

  const handleComplete = async (values) => {
    try {
      // Format the data according to the mutation requirements
      const machineData = {
        name: values.basicInfo.name,
        username: values.basicInfo.username,
        password: values.basicInfo.password,
        templateId: values.resources.templateId,
        os: values.configuration.os,
        productKey: values.configuration.productKey || '',
        pciBus: values.gpu.pciBus,
        departmentId: (departmentId || values.basicInfo.departmentId),
        applications: (values.applications?.applications || []).map(appId => ({
          applicationId: appId,
          parameters: {} // Add any necessary parameters here
        }))
      };
      
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

  return (
    <FormErrorProvider>
      {isCreating && (
        <LoadingOverlay 
          message="Creating your virtual machine..." 
          variant="pulse"
          size="xl"
        />
      )}
      <Wizard onComplete={handleComplete}>
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
            if (departmentId == null && !values.departmentId) {
              errors.departmentId = 'Department is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
          departmentId={departmentId}
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
        <GpuSelectionStep
          id="gpu"
          validate={async (values) => {
            const errors = {};
            if (!values.gpuId) {
              errors.gpuId = 'GPU selection is required';
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
        />
        <ApplicationsStep 
          id="applications"
        />
        <ReviewStep id="review" />
      </Wizard>
    </FormErrorProvider>
  );
}
