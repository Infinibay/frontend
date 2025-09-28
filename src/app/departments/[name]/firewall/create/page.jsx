"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

// Simple Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Component Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

/**
 * Firewall Rule Creation Page
 *
 * Dedicated page for the firewall wizard that provides a full-screen experience
 * with proper navigation and glass effect styling.
 */
const FirewallCreatePage = () => {
  const params = useParams();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState(null);
  const [componentError, setComponentError] = useState(null);

  // URL parameter validation and debugging
  const departmentName = params.name;
  const normalizedDepartmentName = departmentName?.toLowerCase();

  // Get department data from Redux store
  const departments = useSelector((state) => state.departments.items);
  const departmentsLoading = useSelector((state) => state.departments.loading);
  const departmentsError = useSelector((state) => state.departments.error);

  // Find department with better matching logic
  const department = departments?.find(d =>
    d.name.toLowerCase() === normalizedDepartmentName ||
    encodeURIComponent(d.name).toLowerCase() === normalizedDepartmentName ||
    d.name === departmentName
  );

  // Debug logging
  useEffect(() => {
    const isDepartmentsLoading = departmentsLoading?.fetch || departmentsLoading?.fetchOne || departmentsLoading?.fetchByName;
    const debug = {
      paramsName: params.name,
      departmentName: departmentName,
      normalizedDepartmentName: normalizedDepartmentName,
      departmentsCount: departments?.length || 0,
      departmentsLoading: departmentsLoading,
      departmentsError: departmentsError,
      isDepartmentsLoading: isDepartmentsLoading,
      departmentFound: !!department,
      departmentId: department?.id,
      availableDepartments: departments?.map(d => ({ id: d.id, name: d.name })) || []
    };

    console.log('[FirewallCreatePage] Debug Info:', debug);
    setDebugInfo(debug);

    if (!department && departments?.length > 0) {
      console.warn('[FirewallCreatePage] Department not found. Available departments:',
        departments.map(d => d.name)
      );
    }
  }, [params.name, departmentName, normalizedDepartmentName, departments, departmentsLoading, department]);

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

  // Loading state - departments are still loading
  const isDepartmentsLoading = departmentsLoading?.fetch || departmentsLoading?.fetchOne || departmentsLoading?.fetchByName;
  if (isDepartmentsLoading || !departments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-glass-text-primary">Loading departments...</span>
          </div>
          <p className="text-glass-text-secondary">
            Please wait while we load the department information.
          </p>
        </div>
      </div>
    );
  }

  // Loading state while firewall filters are being loaded
  if (filtersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-glass-text-primary">Loading firewall data...</span>
          </div>
          <p className="text-glass-text-secondary">
            Please wait while we load the firewall configuration.
          </p>
        </div>
      </div>
    );
  }

  // Error state for departments loading - only show if there's an error AND no departments loaded
  if (departmentsError && (!departments || departments.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-glass-text-primary mb-2">
            Error Loading Departments
          </h2>
          <p className="text-glass-text-secondary mb-4">
            {typeof departmentsError === 'string' ? departmentsError : 'Failed to load department data. Please try again.'}
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

  // Department not found
  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md space-y-4"
        )}>
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold text-glass-text-primary">
            Department Not Found
          </h2>
          <p className="text-glass-text-secondary">
            The department "{params.name}" could not be found.
          </p>

          {debugInfo && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <details>
                  <summary className="cursor-pointer font-medium">Debug Information</summary>
                  <pre className="mt-2 text-xs bg-muted/50 p-2 rounded">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </AlertDescription>
            </Alert>
          )}

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

  // Component error handling
  if (componentError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "p-8 text-center max-w-md"
        )}>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-glass-text-primary mb-2">
            Component Error
          </h2>
          <p className="text-glass-text-secondary mb-4">
            {componentError}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setComponentError(null)}
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
            <Button
              onClick={() => router.push(`/departments/${encodeURIComponent(params.name)}`)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
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

          {/* Wizard Container with Error Boundary */}
          <ErrorBoundary
            fallback={
              <div className={cn(
                getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
                "p-8 text-center"
              )}>
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-glass-text-primary mb-2">
                  Firewall Wizard Error
                </h3>
                <p className="text-glass-text-secondary mb-4">
                  The firewall wizard failed to load. This might be due to a component error or missing dependencies.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                  >
                    Reload Page
                  </Button>
                  <Button
                    onClick={() => router.push(`/departments/${encodeURIComponent(params.name)}`)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Department
                  </Button>
                </div>
              </div>
            }
            onError={(error) => {
              console.error('[FirewallCreatePage] DepartmentFirewallWizard Error:', error);
              setComponentError(error.message);
            }}
          >
            <DepartmentFirewallWizard
              departmentId={department.id}
              departmentName={department.name}
              departmentFilters={departmentFilters}
              onRuleChange={handleRuleChange}
              onComplete={handleComplete}
            />
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
};

export default FirewallCreatePage;