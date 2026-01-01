'use client';

/**
 * Custom Blocks List Page
 *
 * Admin interface for managing custom Blockly blocks.
 * Built-in blocks are displayed but cannot be modified.
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCustomBlocksQuery, useDeleteCustomBlockMutation } from '@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';
import { usePageHelp } from '@/hooks/usePageHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Blocks,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Package,
  Lock,
  Code,
  Puzzle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Category color mapping (same as backend)
const CATEGORY_COLOURS = {
  'Health Data': 160,
  Logic: 210,
  Comparison: 230,
  Loops: 120,
  Math: 180,
  Text: 160,
  Variables: 330,
  Actions: 0,
  Custom: 290,
};

export default function CustomBlocksPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    showBuiltIn: true,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Query custom blocks
  const { data, loading, error, refetch } = useGetCustomBlocksQuery({
    variables: {
      includeBuiltIn: true,
    },
  });

  // Delete mutation
  const [deleteBlock, { loading: deleting }] = useDeleteCustomBlockMutation({
    onCompleted: () => {
      toast({ title: 'Block deleted successfully' });
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => {
      toast({
        title: 'Error deleting block',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  // Filter blocks
  const filteredBlocks = useMemo(() => {
    if (!data?.customBlocks) return [];

    let blocks = data.customBlocks;

    // Filter by built-in toggle
    if (!filters.showBuiltIn) {
      blocks = blocks.filter((b) => !b.isBuiltIn);
    }

    // Filter by category
    if (filters.category !== 'all') {
      blocks = blocks.filter((b) => b.category === filters.category);
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      blocks = blocks.filter(
        (b) =>
          b.displayName.toLowerCase().includes(search) ||
          b.name.toLowerCase().includes(search) ||
          b.description?.toLowerCase().includes(search)
      );
    }

    return blocks;
  }, [data?.customBlocks, filters]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    if (!data?.customBlocks) return [];
    const cats = [...new Set(data.customBlocks.map((b) => b.category))];
    return cats.sort();
  }, [data?.customBlocks]);

  // Group blocks by category
  const blocksByCategory = useMemo(() => {
    return filteredBlocks.reduce((acc, block) => {
      const cat = block.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(block);
      return acc;
    }, {});
  }, [filteredBlocks]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBlock({ variables: { id: deleteTarget } });
  };

  // Help configuration
  const helpConfig = useMemo(
    () => ({
      title: 'Custom Blocks Help',
      description: 'Create and manage custom Blockly blocks for automations',
      icon: <Puzzle className="h-5 w-5 text-primary" />,
      sections: [
        {
          id: 'what-are-custom-blocks',
          title: 'What are Custom Blocks?',
          icon: <Blocks className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <p>
                Custom blocks extend the visual automation editor with new
                functionality that you define.
              </p>
              <p>
                Each block has inputs, an output type, and generator code that
                produces TypeScript.
              </p>
            </div>
          ),
        },
        {
          id: 'built-in-vs-custom',
          title: 'Built-in vs Custom',
          icon: <Lock className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Built-in blocks</strong> are provided by the system
                  and cannot be modified
                </li>
                <li>
                  <strong>Custom blocks</strong> are created by admins and can
                  be edited or deleted
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'creating-blocks',
          title: 'Creating a Block',
          icon: <Code className="h-4 w-4" />,
          content: (
            <div className="space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Click &ldquo;New Block&rdquo;</li>
                <li>Define name, category, and output type</li>
                <li>Add input parameters if needed</li>
                <li>Write the generator code (TypeScript)</li>
                <li>Test with sample inputs</li>
              </ol>
            </div>
          ),
        },
      ],
      quickTips: [
        'Block names must be lowercase with underscores (e.g., my_custom_block)',
        'Generator code produces TypeScript that runs in the automation context',
        'Test your blocks before using them in automations',
        'Use meaningful display names so users understand the block purpose',
      ],
    }),
    []
  );

  usePageHelp(helpConfig);

  // Page header configuration
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Settings', href: '/settings' },
        { label: 'Custom Blocks', isCurrent: true },
      ],
      title: 'Custom Blocks',
      subtitle: {
        text: 'Create and manage custom blocks for visual automations',
      },
      actions: [
        {
          id: 'create',
          label: 'New Block',
          icon: 'Plus',
          variant: 'default',
          onClick: () => router.push('/settings/automations/custom-blocks/new'),
        },
      ],
    },
    [router]
  );

  // Get HSL color from Blockly hue
  const getBlockColor = (hue) => {
    return `hsl(${hue}, 70%, 40%)`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blocks..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-9"
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                id="show-builtin"
                checked={filters.showBuiltIn}
                onCheckedChange={(v) =>
                  setFilters((f) => ({ ...f, showBuiltIn: v }))
                }
              />
              <Label htmlFor="show-builtin" className="text-sm">
                Show built-in
              </Label>
            </div>
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
            <p className="text-destructive">
              Error loading blocks: {error.message}
            </p>
          </CardContent>
        </Card>
      ) : filteredBlocks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No blocks found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.category !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first custom block to get started'}
            </p>
            {!filters.search && filters.category === 'all' && (
              <Button
                onClick={() =>
                  router.push('/settings/automations/custom-blocks/new')
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                New Block
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        Object.entries(blocksByCategory)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, blocks]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: getBlockColor(
                        CATEGORY_COLOURS[category] || 290
                      ),
                    }}
                  />
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {blocks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                      onClick={() =>
                        router.push(
                          `/settings/automations/custom-blocks/${block.id}`
                        )
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{
                              backgroundColor: getBlockColor(
                                block.blockDefinition?.colour ||
                                  CATEGORY_COLOURS[block.category] ||
                                  290
                              ),
                            }}
                          />
                          <span className="font-medium">
                            {block.displayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {block.isBuiltIn ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs"
                            >
                              <Lock className="h-3 w-3" />
                              Built-in
                            </Badge>
                          ) : (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/settings/automations/custom-blocks/${block.id}`
                                  );
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(block.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {block.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {block.outputType}
                        </Badge>
                        {block.inputs?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {block.inputs.length} input
                            {block.inputs.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                        {!block.isEnabled && (
                          <Badge variant="secondary" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Block?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Automations using this block may
              break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
