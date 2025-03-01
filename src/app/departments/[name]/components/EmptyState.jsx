import React from "react";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * Empty state component for when no machines are found
 */
const EmptyState = ({ onNewComputer }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold mb-2">No computers found</h2>
      <p className="text-gray-500 mb-6">
        There are no computers in this department yet.
      </p>
      <Button onClick={onNewComputer}>
        <Plus className="h-4 w-4 mr-2" />
        New Computer
      </Button>
    </div>
  );
};

export default EmptyState;
