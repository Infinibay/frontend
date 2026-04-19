"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"
import { Button, Card } from "@infinibay/harbor"
import { FormErrorProvider, useFormError } from "./form-error-provider"
import {
  Check,
  User,
  Mail,
  Settings,
  Info,
  Monitor,
  Cpu,
  Zap,
  Package,
  ClipboardCheck,
  ArrowRight,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const debug = createDebugger('frontend:components:wizard')

const WizardContext = React.createContext(null)

export function useWizardContext() {
  const context = React.useContext(WizardContext)
  if (context === null) {
    throw new Error("useWizardContext must be used within a Wizard")
  }
  return context
}

/**
 * Wizard component with step management, validation, and progress tracking.
 * Uses Harbor primitives for the chrome while preserving the full context API.
 */
function WizardContent({
  children,
  className,
  onComplete,
  initialValues = {},
  ...props
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [values, setValues] = React.useState(initialValues)
  const [isValidating, setIsValidating] = React.useState(false)
  const { setFieldError, clearAllErrors, clearFieldError } = useFormError()

  const steps = React.Children.toArray(children)
  const isLastStep = currentStep === steps.length - 1
  const currentStepElement = steps[currentStep]

  React.useEffect(() => {
    debug.info('initialization', 'Wizard initialized:', {
      stepCount: steps.length,
      initialValues: Object.keys(initialValues)
    })
  }, [])

  React.useEffect(() => {
    debug.log('navigation', 'Step changed:', {
      currentStep,
      stepId: currentStepElement?.props?.id,
      isLastStep
    })
  }, [currentStep])

  const next = async () => {
    const stepId = currentStepElement.props.id
    debug.info('navigation', 'Moving to next step:', { stepId, currentStep, isLastStep })

    clearAllErrors()

    if (currentStepElement.props.validate) {
      setIsValidating(true)
      debug.log('validation', 'Starting step validation:', stepId)

      try {
        const stepValues = values[stepId] || {}
        await currentStepElement.props.validate(stepValues)
        debug.success('validation', 'Step validation passed:', stepId)

        if (isLastStep) {
          debug.success('completion', 'Wizard completed successfully:', { totalSteps: steps.length, finalValues: Object.keys(values) })
          onComplete?.(values)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      } catch (error) {
        debug.warn('validation', 'Step validation failed:', { stepId, error })
        if (error && typeof error === 'object') {
          Object.entries(error).forEach(([field, message]) => {
            setFieldError(field, message)
          })
        }
      } finally {
        setIsValidating(false)
      }
    } else {
      debug.log('validation', 'No validation required for step:', stepId)
      if (isLastStep) {
        debug.success('completion', 'Wizard completed without validation:', Object.keys(values))
        onComplete?.(values)
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const previous = () => {
    debug.info('navigation', 'Moving to previous step:', { from: currentStep, to: Math.max(currentStep - 1, 0) })
    setCurrentStep(s => Math.max(s - 1, 0))
    clearAllErrors()
  }

  const setStepValues = React.useCallback((stepId, stepValues) => {
    debug.log('data', 'Step values updated:', { stepId, keys: Object.keys(stepValues) })
    clearAllErrors()
    setValues(prev => ({
      ...prev,
      [stepId]: { ...(prev[stepId] || {}), ...stepValues }
    }))
  }, [clearAllErrors])

  const setValue = React.useCallback((name, value) => {
    const [stepId, ...parts] = name.split('.')
    const fieldName = parts.join('.')
    debug.log('data', 'Field value changed:', { stepId, fieldName, valueType: typeof value })

    clearFieldError(fieldName)

    setValues(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [fieldName]: value
      }
    }))
  }, [clearFieldError])

  const contextValue = React.useMemo(() => ({
    currentStep,
    values,
    setStepValues,
    setValue,
  }), [currentStep, values, setStepValues, setValue])

  const currentStepConfig = getStepConfig(currentStepElement.props.id, currentStep)

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={cn("w-full relative space-y-6", className)} {...props}>
        {/* Progress rail */}
        <Card variant="glass" spotlight={false} glow={false} className="p-6">
          {/* Step labels */}
          <div className="flex justify-between mb-6 gap-2">
            {steps.map((step, index) => {
              const stepConfig = getStepConfig(step.props.id, index)
              const isCurrent = index === currentStep
              const isCompleted = index < currentStep
              return (
                <div
                  key={step.props.id}
                  className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
                >
                  <div className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
                    Step {index + 1}
                  </div>
                  <div
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors duration-300 text-center truncate w-full",
                      isCurrent && "text-accent",
                      isCompleted && "text-success",
                      !isCurrent && !isCompleted && "text-fg-subtle"
                    )}
                  >
                    {stepConfig.title}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress visualization */}
          <div className="relative flex w-full items-center">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/8 rounded-full -translate-y-1/2" />

            {/* Active line */}
            <div
              className="absolute top-1/2 left-0 h-[2px] rounded-full -translate-y-1/2 transition-all duration-500 ease-out bg-gradient-to-r from-accent to-accent-2"
              style={{
                width: steps.length > 1
                  ? `${(currentStep / (steps.length - 1)) * 100}%`
                  : '0%'
              }}
            />

            {/* Step indicators */}
            <div className="relative z-10 flex justify-between w-full">
              {steps.map((step, index) => {
                const stepConfig = getStepConfig(step.props.id, index)
                const IconComponent = stepConfig.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep

                return (
                  <div
                    key={step.props.id}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 border",
                      isCurrent && "bg-accent text-white border-accent ring-4 ring-accent/20 scale-110 shadow-harbor-glow",
                      isCompleted && "bg-success text-surface border-success",
                      !isCurrent && !isCompleted && "bg-surface-2 text-fg-subtle border-white/8"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <IconComponent
                        className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
                          isCurrent && "scale-110"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Step content */}
        <Card variant="glass" spotlight={false} glow={false} className="p-6 min-h-[400px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-fg mb-1">
              {currentStepConfig.title}
            </h2>
            <p className="text-sm text-fg-muted">
              {currentStepConfig.description}
            </p>
          </div>
          <div className="space-y-6">
            {currentStepElement}
          </div>
        </Card>

        {/* Navigation */}
        <Card variant="glass" spotlight={false} glow={false} className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={previous}
              disabled={currentStep === 0}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1 text-xs text-fg-muted tabular-nums">
              <span className="text-fg font-medium">{currentStep + 1}</span>
              <span>of</span>
              <span>{steps.length}</span>
            </div>

            <Button
              variant="primary"
              onClick={next}
              loading={isValidating}
              disabled={isValidating}
              iconRight={
                !isValidating && !isLastStep ? (
                  <ChevronRight className="w-4 h-4" />
                ) : null
              }
            >
              {isValidating
                ? "Validating..."
                : isLastStep
                  ? "Complete Setup"
                  : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </WizardContext.Provider>
  )
}

export function Wizard(props) {
  return (
    <FormErrorProvider>
      <WizardContent {...props} />
    </FormErrorProvider>
  )
}

export function WizardStep({ children }) {
  return children
}

export default Wizard

// Helper function to get step configuration with icons and descriptions
function getStepConfig(stepId, index) {
  const configs = {
    // Create Machine Wizard steps
    basicInfo: {
      title: "Basic Information",
      description: "Set machine name, credentials and department",
      icon: User
    },
    configuration: {
      title: "Operating System",
      description: "Choose the operating system and configuration",
      icon: Monitor
    },
    resources: {
      title: "Hardware Resources",
      description: "Configure CPU, memory and storage",
      icon: Cpu
    },
    gpu: {
      title: "GPU Selection",
      description: "Optional GPU passthrough configuration",
      icon: Zap
    },
    applications: {
      title: "Applications & Scripts",
      description: "Select applications and scripts for first boot",
      icon: Package
    },
    review: {
      title: "Review & Create",
      description: "Review your configuration and create the machine",
      icon: ClipboardCheck
    },
    // Legacy wizard steps (keeping for compatibility)
    personal: {
      title: "Personal Info",
      description: "Tell us about yourself",
      icon: User
    },
    contact: {
      title: "Contact Details",
      description: "How can we reach you?",
      icon: Mail
    },
    preferences: {
      title: "Preferences",
      description: "Customize your experience",
      icon: Settings
    },
    project: {
      title: "Project Details",
      description: "Set up your project",
      icon: Info
    },
    team: {
      title: "Team Setup",
      description: "Configure your team",
      icon: User
    },
    settings: {
      title: "Final Settings",
      description: "Complete your setup",
      icon: Settings
    },
    // Firewall Wizard steps
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
    }
  }

  return configs[stepId] || {
    title: `Step ${index + 1}`,
    description: "Complete this step",
    icon: Info
  }
}
