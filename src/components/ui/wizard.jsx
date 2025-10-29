"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"
import { Button } from "./button"
import { Card } from "./card"
import { FormErrorProvider, useFormError } from "./form-error-provider"
import { Check, User, Mail, Settings, Info, Monitor, Cpu, Zap, Package, ClipboardCheck, ArrowRight, Shield } from "lucide-react"

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
 * Wizard component with step management, validation, and progress tracking
 * Features glass effects, icon indicators, and form error handling
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

    // Clear all errors before starting validation
    clearAllErrors()

    if (currentStepElement.props.validate) {
      setIsValidating(true)
      debug.log('validation', 'Starting step validation:', stepId)

      try {
        // Ensure we always pass an object to validate
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
        // Handle validation errors
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
    clearAllErrors() // Clear errors when going back
  }

  const setStepValues = React.useCallback((stepId, stepValues) => {
    debug.log('data', 'Step values updated:', { stepId, keys: Object.keys(stepValues) })
    // Clear errors when values change
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

    // Clear field error when value changes
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

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={cn("w-full relative", className)} {...props}>
        {/* Modern Progress Section */}
        <div className="mb-8 p-6 glass-strong">
          {/* Step Labels */}
          <div className="flex justify-between mb-6">
            {steps.map((step, index) => {
              const stepConfig = getStepConfig(step.props.id, index)
              return (
                <div key={step.props.id} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Step {index + 1}
                  </div>
                  <div className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    index === currentStep && "text-primary",
                    index < currentStep && "text-primary",
                    index > currentStep && "text-muted-foreground"
                  )}>
                    {stepConfig.title}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Visualization */}
          <div className="relative flex w-full items-center">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border/20 rounded-full -translate-y-1/2" />

            {/* Active line with gradient */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full -translate-y-1/2 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {/* Step indicators with icons */}
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
                      "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg",
                      "border-2 backdrop-blur-sm",
                      isCurrent && "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 scale-110",
                      isCompleted && "bg-primary text-primary-foreground border-primary",
                      !isCurrent && !isCompleted && "bg-background/80 text-muted-foreground border-border/40 hover:border-border/60"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <IconComponent className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isCurrent && "scale-110"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step content with clean design */}
        <div className="min-h-[400px] p-6 transition-all duration-300 glass-strong">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {getStepConfig(currentStepElement.props.id, currentStep).title}
            </h2>
            <p className="text-muted-foreground">
              {getStepConfig(currentStepElement.props.id, currentStep).description}
            </p>
          </div>
          <div className="space-y-6">
            {currentStepElement}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center mt-8 p-4 glass-strong">
          <Button
            variant="outline"
            onClick={previous}
            disabled={currentStep === 0}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-all duration-200",
              "hover:scale-105 disabled:hover:scale-100",
              currentStep === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{currentStep + 1}</span>
            <span>of</span>
            <span>{steps.length}</span>
          </div>

          <Button
            onClick={next}
            disabled={isValidating}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-all duration-200",
              "hover:scale-105 disabled:hover:scale-100",
              "bg-primary hover:bg-primary/90",
              isValidating && "opacity-75 cursor-wait"
            )}
          >
            {isValidating && (
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isValidating ? "Validating..." : isLastStep ? "Complete Setup" : "Continue"}
            {!isValidating && !isLastStep && (
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Button>
        </div>
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
