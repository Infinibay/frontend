import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Header, HeaderLeft, HeaderCenter } from '@/components/ui/header';

/**
 * Header component for the department page
 */
const DepartmentHeader = ({ departmentName }) => {
  return (
    <Header variant="glass" elevated sticky style={{ top: 0 }} className="z-30">
      <HeaderLeft>
        <Link href="/departments" className="mr-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-2xl font-bold">{departmentName || 'Department'}</h1>
      </HeaderCenter>
    </Header>
  );
};

export default DepartmentHeader;
