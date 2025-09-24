"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DepartmentFirewallWizard from "@/components/DepartmentFirewall/DepartmentFirewallWizard";
import useDepartmentFirewall from "@/hooks/useDepartmentFirewall";

/**
 * Firewall Rule Creation Page
 *
 * Dedicated page for the firewall wizard that provides a full-screen experience
 * with proper navigation and glass effect styling.
 */
const FirewallCreatePage = () => {
  const params = useParams();
  const router = useRouter();
  const departmentName = params.name?.toLowerCase();

  // Get department data from Redux store
  const departments = useSelector((state) => state.departments.items);
  const department = departments.find(d => d.name.toLowerCase() === departmentName?.toLowerCase());

  // Use department firewall hook for filters data
  const {
    departmentFilters,
    isLoading: filtersLoading,
    refreshData: refreshFirewallData
  } = useDepartmentFirewall(department?.id);

  // Handle navigation back to department firewall section
  const handleComplete = () => {
    router.push(`/departments/${encodeURIComponent(params.name)}`);
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    router.push(`/departments/${encodeURIComponent(params.name)}`);
  };

  // Handle rule changes (refresh Apollo GraphQL data)
  const handleRuleChange = (rule) => {
    console.log('Rule changed:', rule);
    // Refresh firewall data using Apollo GraphQL
    refreshFirewallData();
  };

  // Loading state while filters are being loaded
  if (filtersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-glass-text-primary">Loading filters...</span>
          </div>
          <p className="text-glass-text-secondary">
            Please wait while we load the firewall configuration.
          </p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <h2 className="text-xl font-semibold text-glass-text-primary mb-2">
            Department Not Found
          </h2>
          <p className="text-glass-text-secondary mb-4">
            The department "{params.name}" could not be found.
          </p>
          <Button
            onClick={() => router.push('/departments')}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with navigation using the same pattern as /computers */}
      <Header
        variant="glass"
        elevated
        sticky={true}
        style={{ top: 0 }}
        className="z-30"
      >
        <HeaderLeft className="w-[200px]">
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
                <BreadcrumbLink href={`/departments/${encodeURIComponent(params.name)}`}>
                  {department.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Rule</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>

        <HeaderCenter>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div className="text-center">
              <h1 className="text-lg font-semibold">Create Firewall Rule</h1>
              <p className="text-sm text-muted-foreground">{department.name} Department</p>
            </div>
          </div>
        </HeaderCenter>

        <HeaderRight className="w-[200px] justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </HeaderRight>
      </Header>

      {/* Main content without background */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Wizard Container */}
          <DepartmentFirewallWizard
            departmentId={department.id}
            departmentName={department.name}
            departmentFilters={departmentFilters}
            onRuleChange={handleRuleChange}
            onComplete={handleComplete}
          />
        </div>
      </main>
    </>
  );
};

export default FirewallCreatePage;