import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
const DepartmentHeader = ({ departmentName, departments = [], isLoading = false, onNewComputer }) => {
  const { resolvedTheme } = useAppTheme();
  const { size } = useSizeContext();
  const router = useRouter();

  const handleDepartmentChange = (departmentName) => {
    router.push(`/departments/${encodeURIComponent(departmentName)}`);
  };

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
      <HeaderCenter className="flex items-center justify-center">
        <Select
          value={departmentName || ''}
          onValueChange={handleDepartmentChange}
          disabled={isLoading}
        >
          <SelectTrigger
            glass="subtle"
            textAlign="center"
            className={cn(
              'min-w-[200px] bg-transparent border-none shadow-none',
              getTypographyClass('subheading', size),
              'text-glass-text-primary h-auto p-2',
              'hover:scale-100 hover:transform-none' // Override the default hover scale
            )}
          >
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent glass="minimal">
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
