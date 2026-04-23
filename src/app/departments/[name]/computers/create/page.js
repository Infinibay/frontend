import { redirect } from 'next/navigation';

export default async function LegacyDepartmentComputersCreatePage({ params }) {
  const { name } = await params;
  redirect(`/departments/${encodeURIComponent(name)}/desktops/new`);
}
