import { redirect } from 'next/navigation';

export default async function LegacyVmDetailPage({ params }) {
  const { name, id } = await params;
  redirect(`/departments/${encodeURIComponent(name)}/desktops/${encodeURIComponent(id)}`);
}
