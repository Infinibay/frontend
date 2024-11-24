import * as React from "react"

const FormErrorContext = React.createContext({})

export function useFormError() {
  const context = React.useContext(FormErrorContext)
  if (!context) {
    throw new Error("useFormError must be used within a FormErrorProvider")
  }
  return context
}

export function FormErrorProvider({ children }) {
  const [errors, setErrors] = React.useState({})

  const setFieldError = React.useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: { message: error }
    }))
  }, [])

  const clearFieldError = React.useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = React.useCallback(() => {
    setErrors({})
  }, [])

  const getError = React.useCallback((field) => {
    return errors[field]?.message || null
  }, [errors])

  const value = React.useMemo(() => ({
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
    getError
  }), [errors, setFieldError, clearFieldError, clearAllErrors, getError])

  return (
    <FormErrorContext.Provider value={value}>
      {children}
    </FormErrorContext.Provider>
  )
}
