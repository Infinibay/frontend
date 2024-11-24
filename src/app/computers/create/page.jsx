'use client';

import React from 'react';
import CreateMachineWizard from '@/components/CreateMachine/CreateMachineWizard';

export default function CreateMachinePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Machine</h1>
      <CreateMachineWizard />
    </div>
  );
}
