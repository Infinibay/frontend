import React from "react";

/**
 * Loading State Component
 * Displays a skeleton UI while departments are loading
 */
const LoadingState = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <div className="mb-6 w-full max-w-md h-10 bg-gray-200 rounded animate-pulse"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
