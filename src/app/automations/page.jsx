'use client';

/**
 * Automations List Page
 *
 * Displays all automations with filtering and search capabilities.
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAutomationsQuery } from '@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';
import { usePageHelp } from '@/hooks/usePageHelp';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AutomationCard } from './components/AutomationCard';
import { EmptyState } from './components/EmptyState';
import { TemplateGallery } from '@/components/automations/TemplateGallery';
import { automationListHelp } from '@/components/automations/help/automationHelp';
import { Search, Blocks, Zap, ShieldCheck, Plus, Loader2, Sparkles } from 'lucide-react';

export default function AutomationsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  // Query automations
  const { data, loading, error } = useGetAutomationsQuery({
    variables: {
      filters: filters.status !== 'all'
        ? { status: [filters.status] }
        : undefined,
    },
  });

  // Filter by search locally
  const filteredAutomations = useMemo(() => {
    if (!data?.automations) return [];
    if (!filters.search) return data.automations;

    const search = filters.search.toLowerCase();
    return data.automations.filter((a) =>
      a.name.toLowerCase().includes(search) ||
      a.description?.toLowerCase().includes(search)
    );
  }, [data?.automations, filters.search]);

  // Use imported help configuration
  usePageHelp(automationListHelp);

  // Page header configuration
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Automations', isCurrent: true },
      ],
      title: 'Automations',
      subtitle: {
        text: 'Create visual rules to monitor and automate VM health',
      },
      actions: [
        {
          id: 'templates',
          label: 'From Template',
          icon: 'Sparkles',
          variant: 'outline',
          onClick: () => setShowTemplateGallery(true),
        },
        {
          id: 'create',
          label: 'New Automation',
          icon: 'Plus',
          variant: 'default',
          onClick: () => router.push('/automations/new'),
        },
      ],
    },
    [router]
  );

  // Handle create click
  const handleCreateClick = () => {
    router.push('/automations/new');
  };

  // Handle card click
  const handleCardClick = (id) => {
    router.push(`/automations/${id}`);
  };

  // Handle template selection
  const handleTemplateSelect = (automation) => {
    if (automation?.id) {
      router.push(`/automations/${automation.id}`);
    } else {
      router.push('/automations/new');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search automations..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-9"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, status: v }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading automations: {error.message}</p>
          </CardContent>
        </Card>
      ) : filteredAutomations.length === 0 ? (
        <EmptyState onCreateClick={handleCreateClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAutomations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onClick={() => handleCardClick(automation.id)}
            />
          ))}
        </div>
      )}

      {/* Template Gallery Dialog */}
      <TemplateGallery
        open={showTemplateGallery}
        onOpenChange={setShowTemplateGallery}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
}
