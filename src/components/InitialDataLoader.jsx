"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitialData } from '@/init';

export const InitialDataLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  
  const authLoading = useSelector(state => state.auth.loading);
  const vmsLoading = useSelector(state => state.vms.loading);
  const departmentsLoading = useSelector(state => state.departments.loading);

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

  if (isInitializing || authLoading || vmsLoading || departmentsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading application data...</div>
      </div>
    );
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