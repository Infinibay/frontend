"use client";

import { use } from "react";
import CreateComputerContent from "@/components/CreateMachine/CreateComputerContent";

export default function CreateMachinePage({ params }) {
  const { name } = use(params);
  return <CreateComputerContent departmentSlug={name} />;
}
