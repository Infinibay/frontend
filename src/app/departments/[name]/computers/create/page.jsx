'use client';

import CreateComputerContent from '@/components/CreateMachine/CreateComputerContent';

export default function CreateMachinePage({ params }) {
  return <CreateComputerContent departmentSlug={params.name} />;
}
