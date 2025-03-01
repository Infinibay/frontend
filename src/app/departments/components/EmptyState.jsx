import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

/**
 * Empty State Component
 * Displays when no departments are found or match the search query
 */
const EmptyState = ({ 
  searchQuery, 
  onCreateDepartment 
}) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No departments found</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery 
          ? `No departments matching "${searchQuery}"`
          : "You haven't created any departments yet. Create your first department to get started."}
      </p>
      <Button onClick={onCreateDepartment}>
        <Plus className="h-4 w-4 mr-2" />
        New Department
      </Button>
    </div>
  );
};

export default EmptyState;
