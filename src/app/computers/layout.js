"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full">
        {children}
      </div>
    </ProtectedRoute>
  );
}
