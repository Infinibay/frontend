"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitialData } from '@/init';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4">
        {/* Logo area */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32" />
        </div>
        
        {/* Navigation items */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation bar */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-24" />
              <span>/</span>
              <Skeleton className="h-6 w-32" />
            </div>
            
            {/* User menu */}
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6">
          {/* Section title */}
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Grid of computers */}
          <div className="grid grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InitialDataLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Only check loading states that are critical for initial app functionality
  const authLoading = useSelector(state => state.auth.loading?.fetchUser);
  const departmentsLoading = useSelector(state => state.departments.loading?.fetch);
  const vmsLoading = useSelector(state => state.vms.loading?.fetch);
  const applicationsLoading = useSelector(state => state.applications.loading?.fetch);

  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(fetchInitialData()).unwrap();
      } catch (err) {
        setError(err);
        console.error('Failed to initialize data:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [dispatch]);

  // Only wait for critical loading states
  const isLoading = authLoading || departmentsLoading ; // adding vmsLoading cause an infinite loop, why? no fucking idea... it's something about configuration field

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">
          Failed to load application data. Please refresh the page.
        </div>
      </div>
    );
  }

  return children;
};