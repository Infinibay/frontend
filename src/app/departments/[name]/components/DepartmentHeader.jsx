import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, Edit3, X } from 'lucide-react';
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
const DepartmentHeader = ({
  departmentName,
  isLoading = false,
  onNewComputer,
  isAdmin = false,
  onNameUpdate,
  nameUpdateLoading = false
}) => {
  const { resolvedTheme } = useAppTheme();
  const { size } = useSizeContext();
  const router = useRouter();

  // State for inline editing
  const [editingName, setEditingName] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [cancellingEdit, setCancellingEdit] = useState(false);

  // Helper functions for inline editing
  const startEditing = () => {
    if (!isAdmin) return;
    setEditingName(true);
    setEditValue(departmentName);
  };

  const cancelEditing = () => {
    setEditingName(false);
    setEditValue('');
    setCancellingEdit(false);
  };

  const saveEdit = () => {
    // Don't save if we're cancelling
    if (cancellingEdit) {
      cancelEditing();
      return;
    }
    if (!editValue.trim()) return;
    if (onNameUpdate) {
      onNameUpdate(editValue.trim());
    }
    cancelEditing();
  };

  const handleCancelMouseDown = () => {
    setCancellingEdit(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
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
        {isAdmin && editingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              className={cn(
                getTypographyClass('subheading', size),
                'px-2 py-1 border border-border rounded bg-background text-center min-w-[200px]'
              )}
              autoFocus
              maxLength={100}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onMouseDown={handleCancelMouseDown}
              onClick={cancelEditing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center gap-2',
              getTypographyClass('subheading', size),
              'text-glass-text-primary',
              isAdmin ? 'cursor-pointer hover:bg-accent/50 px-2 py-1 rounded' : ''
            )}
            onClick={() => isAdmin && startEditing()}
            title={isAdmin ? 'Click to edit department name' : undefined}
          >
            <span>{departmentName || 'Department'}</span>
            {isAdmin && nameUpdateLoading ? (
              <div className="animate-spin h-4 w-4 border border-brand-dark-blue border-t-transparent rounded-full ml-1"></div>
            ) : isAdmin ? (
              <Edit3 className="h-4 w-4 ml-1 opacity-50" />
            ) : null}
          </div>
        )}
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
