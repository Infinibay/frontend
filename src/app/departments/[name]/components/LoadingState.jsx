import React from "react";

/**
 * Loading state component with skeleton UI
 */
const LoadingState = () => {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
