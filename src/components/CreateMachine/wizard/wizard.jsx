'use client';

import * as React from 'react';
import {
  Button,
  Card,
  ResponsiveStack,
  Stepper,
} from '@infinibay/harbor';
import { createDebugger } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';
import { FormErrorProvider, useFormError } from './form-error-provider';
import {
  User,
  Info,
  Cpu,
  Zap,
  Package,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const debug = createDebugger('frontend:components:create-machine-wizard-shell');

const WizardContext = React.createContext(null);

export function useWizardContext() {
  const context = React.useContext(WizardContext);
  if (context === null) {
    throw new Error('useWizardContext must be used within a Wizard');
  }
  return context;
}

function WizardContent({ children, onComplete, initialValues = {} }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [values, setValues] = React.useState(initialValues);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setFieldError, clearAllErrors, clearFieldError } = useFormError();

  const steps = React.useMemo(() => React.Children.toArray(children), [children]);
  const isLastStep = currentStep === steps.length - 1;
  const currentStepElement = steps[currentStep];

  React.useEffect(() => {
    debug.info('initialization', 'Wizard initialized:', {
      stepCount: steps.length,
      initialValues: Object.keys(initialValues),
    });
  }, [initialValues, steps.length]);

  React.useEffect(() => {
    debug.log('navigation', 'Step changed:', {
      currentStep,
      stepId: currentStepElement?.props?.id,
      isLastStep,
    });
  }, [currentStep, currentStepElement?.props?.id, isLastStep]);

  // Field-level validators throw a plain object of { field: message }. Anything
  // else (a thrown Error/string from a runtime bug or future async validator)
  // has no field to attach to, so surface it as a toast instead of silently
  // swallowing it and leaving Continue looking like a no-op.
  const reportValidationError = (error) => {
    const isFieldErrors =
      error && typeof error === 'object' && !(error instanceof Error);
    const entries = isFieldErrors ? Object.entries(error) : [];
    if (entries.length > 0) {
      entries.forEach(([field, message]) => setFieldError(field, message));
      return;
    }
    toast({
      variant: 'error',
      title: 'Validation failed',
      description:
        (error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : '') || 'Something went wrong validating this step. Please try again.',
    });
  };

  const complete = async () => {
    debug.success('completion', 'Wizard completed successfully:', {
      totalSteps: steps.length,
      finalValues: Object.keys(values),
    });
    try {
      setIsSubmitting(true);
      await onComplete?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = async () => {
    // Guard against double-submit / re-entrancy while validating or creating.
    if (isValidating || isSubmitting) return;

    const stepId = currentStepElement.props.id;
    debug.info('navigation', 'Moving to next step:', {
      stepId,
      currentStep,
      isLastStep,
    });
    clearAllErrors();

    if (currentStepElement.props.validate) {
      setIsValidating(true);
      debug.log('validation', 'Starting step validation:', stepId);
      try {
        const stepValues = values[stepId] || {};
        await currentStepElement.props.validate(stepValues);
        debug.success('validation', 'Step validation passed:', stepId);
      } catch (error) {
        debug.warn('validation', 'Step validation failed:', { stepId, error });
        reportValidationError(error);
        return;
      } finally {
        setIsValidating(false);
      }
    } else {
      debug.log('validation', 'No validation required for step:', stepId);
    }

    // Validation passed (or none required) → advance or complete.
    if (isLastStep) {
      await complete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previous = () => {
    debug.info('navigation', 'Moving to previous step:', {
      from: currentStep,
      to: Math.max(currentStep - 1, 0),
    });
    setCurrentStep((s) => Math.max(s - 1, 0));
    clearAllErrors();
  };

  const setStepValues = React.useCallback(
    (stepId, stepValues) => {
      debug.log('data', 'Step values updated:', {
        stepId,
        keys: Object.keys(stepValues),
      });
      clearAllErrors();
      setValues((prev) => ({
        ...prev,
        [stepId]: { ...(prev[stepId] || {}), ...stepValues },
      }));
    },
    [clearAllErrors],
  );

  const setValue = React.useCallback(
    (name, value) => {
      const [stepId, ...parts] = name.split('.');
      const fieldName = parts.join('.');
      debug.log('data', 'Field value changed:', {
        stepId,
        fieldName,
        valueType: typeof value,
      });
      clearFieldError(fieldName);
      setValues((prev) => ({
        ...prev,
        [stepId]: { ...prev[stepId], [fieldName]: value },
      }));
    },
    [clearFieldError],
  );

  const contextValue = React.useMemo(
    () => ({ currentStep, values, setStepValues, setValue }),
    [currentStep, values, setStepValues, setValue],
  );

  const currentStepConfig = getStepConfig(
    currentStepElement.props.id,
    currentStep,
  );

  const stepperSteps = steps.map((s, i) => {
    const cfg = getStepConfig(s.props.id, i);
    return { label: cfg.title, description: cfg.description };
  });

  return (
    <WizardContext.Provider value={contextValue}>
      <ResponsiveStack direction="col" gap={6}>
        <Card variant="glass" spotlight={false} glow={false}>
          <Stepper steps={stepperSteps} current={currentStep} />
        </Card>

        <Card
          variant="glass"
          spotlight={false}
          glow={false}
          title={currentStepConfig.title}
          description={currentStepConfig.description}
        >
          <ResponsiveStack direction="col" gap={6}>
            {currentStepElement}
          </ResponsiveStack>
        </Card>

        <Card variant="glass" spotlight={false} glow={false}>
          <ResponsiveStack direction="row" align="center" justify="between">
            <Button
              variant="secondary"
              onClick={previous}
              disabled={currentStep === 0 || isValidating || isSubmitting}
              icon={<ChevronLeft size={14} />}
            >
              Previous
            </Button>

            <Button variant="ghost" size="sm" disabled reactive={false} ripple={false}>
              {currentStep + 1} of {steps.length}
            </Button>

            <Button
              variant="primary"
              onClick={next}
              loading={isValidating || isSubmitting}
              disabled={isValidating || isSubmitting}
              iconRight={
                !isValidating && !isSubmitting && !isLastStep ? (
                  <ChevronRight size={14} />
                ) : null
              }
            >
              {isValidating
                ? 'Validating…'
                : isSubmitting
                  ? 'Creating…'
                  : isLastStep
                    ? 'Complete Setup'
                    : 'Continue'}
            </Button>
          </ResponsiveStack>
        </Card>
      </ResponsiveStack>
    </WizardContext.Provider>
  );
}

export function Wizard(props) {
  return (
    <FormErrorProvider>
      <WizardContent {...props} />
    </FormErrorProvider>
  );
}

export function WizardStep({ children }) {
  return children;
}

export default Wizard;

function getStepConfig(stepId, index) {
  const configs = {
    basicInfo: {
      title: 'Basic Information',
      description: 'Set machine name, credentials and department',
      icon: User,
    },
    blueprint: {
      title: 'Blueprint',
      description: 'Choose a pre-configured blueprint or build from scratch',
      icon: Cpu,
    },
    gpu: {
      title: 'GPU Selection',
      description: 'Optional GPU passthrough configuration',
      icon: Zap,
    },
    applications: {
      title: 'Applications & Scripts',
      description: 'Select applications and scripts for first boot',
      icon: Package,
    },
    review: {
      title: 'Review & Create',
      description: 'Review your configuration and create the machine',
      icon: ClipboardCheck,
    },
  };

  return (
    configs[stepId] || {
      title: `Step ${index + 1}`,
      description: 'Complete this step',
      icon: Info,
    }
  );
}
