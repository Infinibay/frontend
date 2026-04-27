'use client';

import * as React from 'react';
import {
  Button,
  Card,
  ResponsiveStack,
  Stepper,
} from '@infinibay/harbor';
import { createDebugger } from '@/utils/debug';
import { FormErrorProvider, useFormError } from './form-error-provider';
import {
  User,
  Mail,
  Settings,
  Info,
  Cpu,
  Zap,
  Package,
  ClipboardCheck,
  ArrowRight,
  Shield,
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
  const { setFieldError, clearAllErrors, clearFieldError } = useFormError();

  const steps = React.Children.toArray(children);
  const isLastStep = currentStep === steps.length - 1;
  const currentStepElement = steps[currentStep];

  React.useEffect(() => {
    debug.info('initialization', 'Wizard initialized:', {
      stepCount: steps.length,
      initialValues: Object.keys(initialValues),
    });
  }, []);

  React.useEffect(() => {
    debug.log('navigation', 'Step changed:', {
      currentStep,
      stepId: currentStepElement?.props?.id,
      isLastStep,
    });
  }, [currentStep]);

  const next = async () => {
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
        if (isLastStep) {
          debug.success('completion', 'Wizard completed successfully:', {
            totalSteps: steps.length,
            finalValues: Object.keys(values),
          });
          onComplete?.(values);
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      } catch (error) {
        debug.warn('validation', 'Step validation failed:', { stepId, error });
        if (error && typeof error === 'object') {
          Object.entries(error).forEach(([field, message]) => {
            setFieldError(field, message);
          });
        }
      } finally {
        setIsValidating(false);
      }
    } else {
      debug.log('validation', 'No validation required for step:', stepId);
      if (isLastStep) {
        debug.success(
          'completion',
          'Wizard completed without validation:',
          Object.keys(values),
        );
        onComplete?.(values);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
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
              disabled={currentStep === 0}
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
              loading={isValidating}
              disabled={isValidating}
              iconRight={
                !isValidating && !isLastStep ? <ChevronRight size={14} /> : null
              }
            >
              {isValidating
                ? 'Validating…'
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
    personal: {
      title: 'Personal Info',
      description: 'Tell us about yourself',
      icon: User,
    },
    contact: {
      title: 'Contact Details',
      description: 'How can we reach you?',
      icon: Mail,
    },
    preferences: {
      title: 'Preferences',
      description: 'Customize your experience',
      icon: Settings,
    },
    project: {
      title: 'Project Details',
      description: 'Set up your project',
      icon: Info,
    },
    team: {
      title: 'Team Setup',
      description: 'Configure your team',
      icon: User,
    },
    settings: {
      title: 'Final Settings',
      description: 'Complete your setup',
      icon: Settings,
    },
    direction: {
      title: 'What & Where',
      description: 'Choose what you want to do and which direction',
      icon: ArrowRight,
    },
    service: {
      title: 'Service Type',
      description: 'Select the service or application',
      icon: Shield,
    },
    customization: {
      title: 'Customize Rule',
      description: 'Fine-tune the rule settings',
      icon: Settings,
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
