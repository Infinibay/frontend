'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createVm, fetchVms } from '@/state/slices/vms';
import { Alert, Button, EmptyState, Page } from '@infinibay/harbor';
import { Wizard } from './wizard/wizard';
import { useToast } from '@/hooks/use-toast';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BlueprintStep } from './steps/BlueprintStep';
import { ApplicationsScriptsStep } from './steps/ApplicationsScriptsStep';
import { ReviewStep } from './steps/ReviewStep';
import { GpuSelectionStep } from './steps/GpuSelectionStep';
import {
  fetchDepartments,
  selectDepartments,
  selectDepartmentsLoading,
  selectDepartmentError,
} from '@/state/slices/departments';

export default function CreateMachineWizard({ departmentId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const departments = useSelector(selectDepartments);
  const departmentsLoading = useSelector(selectDepartmentsLoading);
  const departmentsError = useSelector(selectDepartmentError);
  // Timestamp of the last successful departments fetch — lets us distinguish a
  // genuinely-empty result from the "not fetched yet" first render.
  const departmentsLastUpdated = useSelector((state) => state.departments.lastUpdated);
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
       
    }
  }, [departments, departmentId, initialValues]);

  const handleComplete = async (values) => {
    try {
      // Format the data according to the mutation requirements
      const machineData = {
        name: values.basicInfo.name,
        username: values.basicInfo.username,
        password: values.basicInfo.password,
        os: values.blueprint?.os,
        productKey: values.blueprint?.productKey || '',
        pciBus: values.gpu.pciBus,
        departmentId: String(validatedDepartmentId || values.basicInfo.departmentId),
        applications: (values.applications?.applications || []).map(appId => ({
          applicationId: appId,
          parameters: {}
        })),
        firstBootScripts: (values.applications?.scripts || []).map(script => ({
          scriptId: script.scriptId,
          inputValues: script.inputValues
        }))
      };

      const blueprint = values.blueprint || {};
      if (blueprint.mode === 'custom' || blueprint.templateId === 'custom') {
        machineData.templateId = null;
        machineData.customCores = blueprint.customCores;
        machineData.customRam = blueprint.customRam;
        machineData.customStorage = blueprint.customStorage;
      } else {
        machineData.templateId = blueprint.templateId;
      }

      await dispatch(createVm(machineData)).unwrap();

      // createVm only optimistically updates the Redux vms slice. Re-fetch so the
      // Apollo `machines` cache (written by fetchVms's network-only query) reconciles
      // too — the script-scheduler pickers read m.status from that cache, so without
      // this they can show a stale schedulable set right after a create. Fire-and-forget
      // so it doesn't block the redirect below.
      dispatch(fetchVms());

      toast({
        variant: "success",
        title: "Success!",
        description: `Desktop "${values.basicInfo.name}" has been created successfully.`
      });

      router.push('/desktops');
    } catch (error) {
      console.error('Failed to create machine:', error?.message || error);
      toast({
        variant: "error",
        title: "Error",
        description:
          (typeof error === 'string' ? error : error?.message) ||
          "Failed to create desktop. Please try again."
      });
    }
  };

  // Don't render the wizard until initial values are ready. Departments are
  // required to create a desktop, so distinguish loading, error and the
  // genuinely-empty case instead of hanging on "Loading…" forever.
  if (!initialValues) {
    if (departmentsError) {
      return (
        <Page size="md">
          <Alert
            tone="danger"
            title="Couldn't load departments"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => dispatch(fetchDepartments())}
              >
                Retry
              </Button>
            }
          >
            {departmentsError}
          </Alert>
        </Page>
      );
    }

    if (!departmentsLoading && departmentsLastUpdated && departments.length === 0) {
      return (
        <Page size="md">
          <EmptyState
            variant="dashed"
            title="No departments yet"
            description="Create a department before adding a desktop."
            actions={
              <Button
                variant="primary"
                onClick={() => router.push('/departments')}
              >
                Go to Departments
              </Button>
            }
          />
        </Page>
      );
    }

    return (
      <Page size="md">
        <EmptyState variant="inline" title="Loading…" />
      </Page>
    );
  }

  return (
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
        <BlueprintStep
          id="blueprint"
          validate={async (values) => {
            const errors = {};
            if (values.mode === 'blueprint') {
              if (!values.templateId) {
                errors.templateId = 'Please select a blueprint';
              }
            } else {
              if (!values.customOs) {
                errors.os = 'Please select an operating system';
              }
              // Hardware (cores/RAM/storage) always carries a clamped default
              // from the sliders, so there is no reachable empty state to guard
              // here — and BlueprintStep has no field bound to a `hardware`
              // error key, which would make it a dead-end message anyway.
            }
            if (Object.keys(errors).length > 0) throw errors;
          }}
        />
        <GpuSelectionStep id="gpu" />
        <ApplicationsScriptsStep id="applications" />
        <ReviewStep id="review" />
      </Wizard>
  );
}
