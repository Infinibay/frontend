'use client';

import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  Layers,
  FolderTree,
  Copy,
  Settings,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Cpu,
  MemoryStick,
  HardDrive,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  Button,
  ButtonGroup,
  Badge,
  Alert,
  EmptyState,
  Spinner,
  Dialog,
  Stat,
} from '@infinibay/harbor';

import { CreateTemplateDialog } from './components/create-template-dialog';
import { CreateCategoryDialog } from './components/create-category-dialog';
import { EditTemplateDialog } from './components/edit-template-dialog';
import { EditCategoryDialog } from './components/edit-category-dialog';
import {
  destroyTemplate,
  fetchTemplates,
} from '@/state/slices/templates';
import {
  destroyTemplateCategory,
  fetchTemplateCategories,
} from '@/state/slices/templateCategories';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { usePageHeader } from '@/hooks/usePageHeader';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:templates');

/** Harbor-native tile for a single template (no context-menu dep). */
function TemplateTile({ template, onEdit, onDelete }) {
  const inUse = (template.totalMachines || 0) > 0;
  return (
    <Card
      variant="default"
      interactive
      className="flex flex-col gap-3 !p-4 relative group"
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-md bg-surface-2 text-fg-muted hover:text-fg hover:bg-white/10"
          aria-label="Edit template"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => !inUse && onDelete?.(template)}
          disabled={inUse}
          className={
            inUse
              ? 'p-1.5 rounded-md bg-surface-2 text-fg-subtle cursor-not-allowed opacity-50'
              : 'p-1.5 rounded-md bg-surface-2 text-fg-muted hover:text-danger hover:bg-danger/10'
          }
          title={
            inUse
              ? `In use by ${template.totalMachines} machine${template.totalMachines !== 1 ? 's' : ''}`
              : 'Delete template'
          }
          aria-label="Delete template"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-fg truncate">{template.name}</h3>
        {template.description ? (
          <p className="text-xs text-fg-muted line-clamp-2 mt-1">
            {template.description}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          <Cpu className="h-3.5 w-3.5" />
          <span className="font-mono tabular-nums">{template.cores}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          <MemoryStick className="h-3.5 w-3.5" />
          <span className="font-mono tabular-nums">{template.ram}</span>
          <span className="text-fg-subtle">GB</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          <HardDrive className="h-3.5 w-3.5" />
          <span className="font-mono tabular-nums">{template.storage}</span>
          <span className="text-fg-subtle">GB</span>
        </div>
      </div>

      {inUse ? (
        <Badge tone="info" className="self-start">
          {template.totalMachines} in use
        </Badge>
      ) : null}
    </Card>
  );
}

export default function TemplatesPage() {
  const dispatch = useDispatch();

  const [deleteTemplateTarget, setDeleteTemplateTarget] = useState(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
    refresh: refreshTemplates,
  } = useEnsureData('templates', fetchTemplates, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
    transform: (data) => data.items || data || [],
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refresh: refreshCategories,
  } = useEnsureData('templateCategories', fetchTemplateCategories, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000,
    transform: (data) => data.items || data || [],
  });

  const loading = templatesLoading || categoriesLoading;
  const error = templatesError || categoriesError;

  const handleRefresh = () => {
    refreshTemplates();
    refreshCategories();
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTemplateTarget) return;
    setIsDeletingTemplate(true);
    try {
      await dispatch(destroyTemplate(deleteTemplateTarget.id)).unwrap();
      toast.success('Template deleted');
      refreshTemplates();
      setDeleteTemplateTarget(null);
    } catch (err) {
      debug.error('delete template', err);
      toast.error(`Could not delete template: ${err.message}`);
    } finally {
      setIsDeletingTemplate(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setIsDeletingCategory(true);
    try {
      await dispatch(destroyTemplateCategory(deleteCategoryTarget.id)).unwrap();
      toast.success('Category deleted');
      refreshCategories();
      setDeleteCategoryTarget(null);
    } catch (err) {
      debug.error('delete category', err);
      toast.error(`Could not delete category: ${err.message}`);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const templatesByCategory = useMemo(() => {
    const map = {};
    (templates || []).forEach((t) => {
      const cid = t.categoryId;
      if (!map[cid]) map[cid] = [];
      map[cid].push(t);
    });
    return map;
  }, [templates]);

  const stats = useMemo(
    () => ({
      categories: categories?.length || 0,
      templates: templates?.length || 0,
      inUse: (templates || []).filter((t) => (t.totalMachines || 0) > 0).length,
    }),
    [templates, categories]
  );

  const helpConfig = useMemo(
    () => ({
      title: 'Templates',
      description: 'VM blueprints grouped by category.',
      icon: <Layers className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: 'templates',
          title: 'What templates are',
          icon: <Layers className="h-4 w-4" />,
          content: (
            <p>
              Pre-configured VM blueprints: OS, CPU, RAM, storage. Creating a
              VM from a template skips the manual wiring step.
            </p>
          ),
        },
        {
          id: 'categories',
          title: 'Categories',
          icon: <FolderTree className="h-4 w-4" />,
          content: (
            <p>
              Group templates by purpose (Dev, Production, Testing) or by
              team. A category can only be deleted when empty.
            </p>
          ),
        },
        {
          id: 'lifecycle',
          title: 'Lifecycle',
          icon: <Copy className="h-4 w-4" />,
          content: (
            <p>
              Templates in use by VMs can&apos;t be deleted until every VM that
              uses them is removed or moved to another template.
            </p>
          ),
        },
        {
          id: 'conventions',
          title: 'Conventions',
          icon: <Settings className="h-4 w-4" />,
          content: (
            <ul className="list-disc list-inside space-y-0.5">
              <li>Use descriptive names (OS + purpose + resource tier)</li>
              <li>Keep ISOs current with security patches</li>
              <li>Document edge cases in the template description</li>
            </ul>
          ),
        },
      ],
      quickTips: [
        'Hover over a template to reveal edit / delete',
        'Categories cannot be deleted while they contain templates',
        'The refresh button reloads both templates and categories',
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Templates', isCurrent: true },
      ],
      title: 'Templates',
      actions: [],
      helpConfig,
      helpTooltip: 'Templates help',
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card variant="glass" className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
              <Layers className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-fg">Templates</h1>
              <p className="text-sm text-fg-muted mt-1">
                VM blueprints grouped by category. Use them to skip manual
                wiring when creating a new VM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              }
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <CreateCategoryDialog>
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                New category
              </Button>
            </CreateCategoryDialog>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat
            label="Categories"
            value={stats.categories}
            icon={<FolderTree className="h-3.5 w-3.5" />}
          />
          <Stat
            label="Templates"
            value={stats.templates}
            icon={<Layers className="h-3.5 w-3.5" />}
          />
          <Stat
            label="In use"
            value={stats.inUse}
            icon={<Copy className="h-3.5 w-3.5" />}
          />
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load templates"
          actions={
            <Button
              size="sm"
              onClick={handleRefresh}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      {loading && (templates || []).length === 0 ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading templates…
        </div>
      ) : (categories || []).length === 0 ? (
        <Card variant="default" className="p-0">
          <EmptyState
            icon={<FolderTree className="h-10 w-10 text-fg-subtle" />}
            title="No categories yet"
            description="Create a category to start organising templates."
            actions={
              <CreateCategoryDialog>
                <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                  New category
                </Button>
              </CreateCategoryDialog>
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {(categories || []).map((category) => {
            const list = templatesByCategory[category.id] || [];
            const canDelete = (category.totalTemplates || 0) === 0;
            return (
              <Card key={category.id} variant="default" className="!p-0 overflow-hidden">
                <div className="flex items-start justify-between gap-3 p-4 border-b border-white/8">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-fg">
                        {category.name}
                      </h2>
                      <Badge tone="neutral">
                        {list.length} template{list.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    {category.description ? (
                      <p className="text-sm text-fg-muted mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(category)}
                      className="p-1.5 rounded-md text-fg-muted hover:text-fg hover:bg-white/5"
                      aria-label="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        canDelete && setDeleteCategoryTarget(category)
                      }
                      disabled={!canDelete}
                      title={
                        canDelete
                          ? 'Delete category'
                          : `Contains ${category.totalTemplates} template${category.totalTemplates !== 1 ? 's' : ''}`
                      }
                      className={
                        canDelete
                          ? 'p-1.5 rounded-md text-fg-muted hover:text-danger hover:bg-danger/10'
                          : 'p-1.5 rounded-md text-fg-subtle cursor-not-allowed opacity-50'
                      }
                      aria-label="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <CreateTemplateDialog categoryId={category.id}>
                      <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                        Template
                      </Button>
                    </CreateTemplateDialog>
                  </div>
                </div>

                <div className="p-4">
                  {list.length === 0 ? (
                    <div className="text-sm text-fg-muted text-center py-6">
                      No templates in this category yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {list.map((template) => (
                        <TemplateTile
                          key={template.id}
                          template={template}
                          onEdit={() => setEditingTemplate(template)}
                          onDelete={setDeleteTemplateTarget}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit dialogs — rendered only when a target is set so the
          shadcn internals don't mount in the background. */}
      {editingTemplate ? (
        <EditTemplateDialog
          template={editingTemplate}
          open
          onOpenChange={(o) => !o && setEditingTemplate(null)}
        />
      ) : null}
      {editingCategory ? (
        <EditCategoryDialog
          category={editingCategory}
          open
          onOpenChange={(o) => !o && setEditingCategory(null)}
        />
      ) : null}

      {/* Delete confirmations in Harbor Dialog. */}
      <Dialog
        open={!!deleteTemplateTarget}
        onClose={() => setDeleteTemplateTarget(null)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <AlertCircle className="h-4 w-4" />
            Delete template
          </span>
        }
        description={
          deleteTemplateTarget
            ? `Remove ${deleteTemplateTarget.name}? VMs already created from it are unaffected.`
            : ''
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteTemplateTarget(null)}
              disabled={isDeletingTemplate}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
              loading={isDeletingTemplate}
              disabled={isDeletingTemplate}
            >
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          This cannot be undone. Only the blueprint is removed; existing VMs
          keep running.
        </p>
      </Dialog>

      <Dialog
        open={!!deleteCategoryTarget}
        onClose={() => setDeleteCategoryTarget(null)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <AlertCircle className="h-4 w-4" />
            Delete category
          </span>
        }
        description={
          deleteCategoryTarget
            ? `Remove the ${deleteCategoryTarget.name} category?`
            : ''
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteCategoryTarget(null)}
              disabled={isDeletingCategory}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              loading={isDeletingCategory}
              disabled={isDeletingCategory}
            >
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          The category must be empty. Templates inside must be removed or
          moved first.
        </p>
      </Dialog>
    </div>
  );
}
