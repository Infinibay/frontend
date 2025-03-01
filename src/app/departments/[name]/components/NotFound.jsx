import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Not found component for when a department doesn't exist
 */
const NotFound = ({ departmentName }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Department Not Found</h2>
        <p className="text-gray-600 mb-6">
          The department &quot;{departmentName}&quot; could not be found.
        </p>
        <Button asChild>
          <Link href="/departments">View All Departments</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
