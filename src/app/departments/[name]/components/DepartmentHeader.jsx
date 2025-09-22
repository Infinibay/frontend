import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from '@/components/ui/header';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useSizeContext, sizeVariants, getTypographyClass } from '@/components/ui/size-provider';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * Header component for the department page
 */
const DepartmentHeader = ({ departmentName, onNewComputer }) => {
  const { resolvedTheme } = useAppTheme();
  const { size } = useSizeContext();

  return (
    <Header variant="glass" elevated sticky style={{ top: 0 }} className="z-30">
      <HeaderLeft className="w-[200px]">
        <Link href="/departments" className="mr-2">
          <Button variant="outline" size="icon" aria-label="Back to departments">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{departmentName || 'Department'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className={cn(getTypographyClass('subheading', size), 'text-glass-text-primary')}>{departmentName || 'Department'}</h1>
      </HeaderCenter>
      <HeaderRight className="w-[200px] flex items-center justify-end">
        <Button
          onClick={onNewComputer}
          className="whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Computer
        </Button>
      </HeaderRight>
    </Header>
  );
};

export default DepartmentHeader;
