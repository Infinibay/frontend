import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card } from "./card"
import { FormErrorProvider, useFormError } from "./form-error-provider"

const WizardContext = React.createContext({})

export function useWizardContext() {
  const context = React.useContext(WizardContext)
  if (!context) {
    throw new Error("useWizardContext must be used within a Wizard")
  }
  return context
}

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

  const next = async () => {
    const stepId = currentStepElement.props.id
    console.log(' Wizard Next:', {
      stepId,
      currentStep,
      isLastStep,
      hasValidation: !!currentStepElement.props.validate,
      currentValues: values[stepId]
    })
    
    // Clear all errors before starting validation
    clearAllErrors()
    
    if (currentStepElement.props.validate) {
      console.log(' Starting validation for step:', stepId)
      setIsValidating(true)
      
      try {
        // Ensure we always pass an object to validate
        const stepValues = values[stepId] || {}
        console.log(' Validating values:', stepValues)
        await currentStepElement.props.validate(stepValues)
        console.log(' Validation passed')
        
        if (isLastStep) {
          console.log(' Completing wizard with values:', values)
          onComplete?.(values)
        } else {
          console.log(' Moving to next step:', currentStep + 1)
          setCurrentStep(prev => prev + 1)
        }
      } catch (error) {
        // Handle validation errors
        console.error(' Validation failed:', error)
        if (error && typeof error === 'object') {
          Object.entries(error).forEach(([field, message]) => {
            console.log(' Setting field error:', field, message)
            setFieldError(field, message)
          })
        }
      } finally {
        setIsValidating(false)
      }
    } else {
      console.log(' No validation required, proceeding to next step')
      if (isLastStep) {
        console.log(' Completing wizard with values:', values)
        onComplete?.(values)
      } else {
        console.log(' Moving to next step:', currentStep + 1)
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const previous = () => {
    console.log(' Moving to previous step:', currentStep - 1)
    setCurrentStep(s => Math.max(s - 1, 0))
    clearAllErrors() // Clear errors when going back
  }

  const setStepValues = React.useCallback((stepId, stepValues) => {
    console.log(' Setting step values for', stepId, ':', stepValues)
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
    console.log(' Setting value:', { stepId, fieldName, value })

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

  React.useEffect(() => {
    console.log(' Wizard state updated:', {
      currentStep,
      values,
      isValidating
    })
  }, [currentStep, values, isValidating])

  const contextValue = React.useMemo(() => ({
    currentStep,
    values,
    setStepValues,
    setValue,
  }), [currentStep, values, setStepValues, setValue])

  return (
    <WizardContext.Provider value={contextValue}>
      <Card className={cn("w-full", className)} {...props}>
        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative flex w-full">
              {/* Background line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2" />
              
              {/* Active line */}
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />

              {/* Step indicators */}
              <div className="relative z-10 flex justify-between w-full">
                {steps.map((step, index) => (
                  <div
                    key={step.props.id}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                      index === currentStep && "bg-primary text-primary-foreground ring-4 ring-background",
                      index < currentStep && "bg-primary text-primary-foreground",
                      index > currentStep && "bg-border text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            {currentStepElement}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={previous}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={next}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : isLastStep ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
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
