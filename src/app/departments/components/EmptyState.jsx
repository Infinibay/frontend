import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SimpleIllustration } from "@/components/ui/undraw-illustration";

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
      <SimpleIllustration
        name="department"
        size="large"
        opacity={80}
        className="mx-auto mb-4"
      />
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
