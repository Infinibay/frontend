'use client';

import React from 'react';
import CreateMachineWizard from '@/components/CreateMachine/CreateMachineWizard';
import { LottieAnimation } from '@/components/ui/lottie-animation';

export default function CreateMachinePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 max-w-7xl mx-auto">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Create New Machine</h1>
          <CreateMachineWizard />
        </div>

      </div>
    </div>
  );
}
