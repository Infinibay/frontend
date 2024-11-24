'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createVm } from '@/state/slices/vms';
import { Wizard } from '@/components/ui/wizard';
import { FormErrorProvider } from '@/components/ui/form-error-provider';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ResourcesStep } from './steps/ResourcesStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { ApplicationsStep } from './steps/ApplicationsStep';
import { ReviewStep } from './steps/ReviewStep';

export default function CreateMachineWizard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleComplete = async (values) => {
    try {
      const machineData = {
        name: values.basicInfo.name,
        templateId: values.resources.templateId,
        config: {
          ...values.configuration,
          applications: values.applications?.applications || []
        }
      };
      
      await dispatch(createVm(machineData)).unwrap();
      router.push('/computers');
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  };

  return (
    <FormErrorProvider>
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
            if (Object.keys(errors).length > 0) throw errors;
          }}
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
        <ApplicationsStep 
          id="applications"
        />
        <ReviewStep id="review" />
      </Wizard>
    </FormErrorProvider>
  );
}
