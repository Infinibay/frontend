import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Error State Component
 * Displays when there's an error loading departments
 */
const ErrorState = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] p-6">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Unable to load departments. Please check your connection and try again.
        </p>
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
