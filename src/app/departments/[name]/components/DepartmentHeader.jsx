import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

/**
 * Header component for the department page
 */
const DepartmentHeader = ({ departmentName }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Link href="/departments" className="mr-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{departmentName || 'Department'}</h1>
      </div>
    </div>
  );
};

export default DepartmentHeader;
