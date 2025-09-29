import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-error-state');

/**
 * Error state component for handling VM not found or fetch errors
 */
const ErrorState = ({ error, vmId, onRetry }) => {
  debug.error('VM Error State rendered', { error, vmId });
  // Determine error type and message
  const getErrorInfo = () => {
    if (!error) {
      return {
        title: "Virtual Machine Not Found",
        message: "The requested virtual machine does not exist or you do not have permissions to access it.",
        canRetry: false,
        isNotFound: true
      };
    }

    // GraphQL error handling
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphqlError = error.graphQLErrors[0];
      
      if (graphqlError.extensions?.code === 'NOT_FOUND') {
        return {
          title: "Virtual Machine Not Found",
          message: "The virtual machine with ID '" + vmId + "' does not exist.",
          canRetry: false,
          isNotFound: true
        };
      }
      
      if (graphqlError.extensions?.code === 'FORBIDDEN') {
        return {
          title: "Access Denied",
          message: "You do not have permissions to access this virtual machine.",
          canRetry: false,
          isNotFound: false
        };
      }

      return {
        title: "Server Error",
        message: graphqlError.message || "An error occurred while obtaining virtual machine information.",
        canRetry: true,
        isNotFound: false
      };
    }

    // Network error
    if (error.networkError) {
      return {
        title: "Connection Error",
        message: "Could not connect to the server. Check your internet connection.",
        canRetry: true,
        isNotFound: false
      };
    }

    // Generic error
    return {
      title: "Unexpected Error",
      message: error.message || "An unexpected error occurred. Please try again.",
      canRetry: true,
      isNotFound: false
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="size-container size-padding glass-medium">
      {/* Header with back button */}
      <div className="flex items-center size-margin-sm">
        <Link href="/departments" className="mr-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="size-icon" />
          </Button>
        </Link>
        <h1 className="size-heading">Error</h1>
      </div>

      {/* Error content */}
      <div className="max-w-2xl mx-auto">
        <Card glass="strong" elevation="3" className="border-red-200/20">
          <CardContent className="size-card-padding">
            <Alert variant="destructive" className="size-margin-sm">
              <AlertTriangle className="size-icon" />
              <AlertTitle className="size-text">{errorInfo.title}</AlertTitle>
              <AlertDescription className="mt-2 size-text">
                {errorInfo.message}
              </AlertDescription>
            </Alert>

            {/* Error details for developers */}
            {error && process.env.NODE_ENV === 'development' && (
              <Card glass="subtle" elevation="1" className="size-margin-sm">
                <CardContent className="size-card-padding">
                  <h3 className="size-text font-semibold mb-2">Error Details (Development):</h3>
                  <pre className="size-small text-muted-foreground overflow-auto">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row size-gap justify-center size-margin-sm">
              {errorInfo.canRetry && onRetry && (
                <Button
                  onClick={() => {
                    debug.log('Retrying VM fetch');
                    onRetry();
                  }}
                  variant="default"
                  className="flex items-center size-button"
                >
                  <RefreshCw className="size-icon mr-2" />
                  Try Again
                </Button>
              )}

              <Link href="/departments">
                <Button variant="outline" className="flex items-center w-full sm:w-auto size-button">
                  <Home className="size-icon mr-2" />
                  Back to Departments
                </Button>
              </Link>
            </div>

            {/* Additional help text */}
            <div className="mt-8 text-center size-small text-muted-foreground">
              {errorInfo.isNotFound ? (
                <p>
                  If you believe this virtual machine should exist, contact the system administrator.
                </p>
              ) : (
                <p>
                  If the problem persists, contact technical support.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorState;
