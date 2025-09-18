import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error state component for handling VM not found or fetch errors
 */
const ErrorState = ({ error, vmId, onRetry }) => {
  // Determine error type and message
  const getErrorInfo = () => {
    if (!error) {
      return {
        title: "Máquina Virtual No Encontrada",
        message: "La máquina virtual solicitada no existe o no tienes permisos para acceder a ella.",
        canRetry: false,
        isNotFound: true
      };
    }

    // GraphQL error handling
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphqlError = error.graphQLErrors[0];
      
      if (graphqlError.extensions?.code === 'NOT_FOUND') {
        return {
          title: "Máquina Virtual No Encontrada",
          message: "La máquina virtual con ID '" + vmId + "' no existe.",
          canRetry: false,
          isNotFound: true
        };
      }
      
      if (graphqlError.extensions?.code === 'FORBIDDEN') {
        return {
          title: "Acceso Denegado",
          message: "No tienes permisos para acceder a esta máquina virtual.",
          canRetry: false,
          isNotFound: false
        };
      }

      return {
        title: "Error del Servidor",
        message: graphqlError.message || "Ocurrió un error al obtener la información de la máquina virtual.",
        canRetry: true,
        isNotFound: false
      };
    }

    // Network error
    if (error.networkError) {
      return {
        title: "Error de Conexión",
        message: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
        canRetry: true,
        isNotFound: false
      };
    }

    // Generic error
    return {
      title: "Error Inesperado",
      message: error.message || "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
      canRetry: true,
      isNotFound: false
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/departments" className="mr-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Error</h1>
      </div>

      {/* Error content */}
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{errorInfo.title}</AlertTitle>
          <AlertDescription className="mt-2">
            {errorInfo.message}
          </AlertDescription>
        </Alert>

        {/* Error details for developers */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Detalles del Error (Desarrollo):</h3>
            <pre className="text-sm text-muted-foreground overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {errorInfo.canRetry && onRetry && (
            <Button onClick={onRetry} variant="default" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar Nuevamente
            </Button>
          )}
          
          <Link href="/departments">
            <Button variant="outline" className="flex items-center w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Volver a Departamentos
            </Button>
          </Link>
        </div>

        {/* Additional help text */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          {errorInfo.isNotFound ? (
            <p>
              Si crees que esta máquina virtual debería existir, contacta con el administrador del sistema.
            </p>
          ) : (
            <p>
              Si el problema persiste, contacta con el soporte técnico.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
