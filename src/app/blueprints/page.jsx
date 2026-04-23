'use client';

import { useMemo, useState } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import {
  Page,
  Button,
  ButtonGroup,
  Alert,
  EmptyState,
  Spinner,
  Dialog,
  IconButton,
  ResponsiveStack,
  Tooltip,
} from '@infinibay/harbor';
import { PageHeader } from '@/components/common/PageHeader';
import { OsIcon } from '@/components/common/OsBadge';

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

/** Dense row for a single blueprint. Operator-console density, not card grid. */
function BlueprintRow({ template, onEdit, onDelete }) {
  const inUse = (template.totalMachines || 0) > 0;
  // Pull OS signal from template name or description (heuristic for mock).
  const osHint = `${template.name} ${template.description || ''}`;

  return (
    <div className="group flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/[0.03] transition-colors duration-150">
      <div className="shrink-0 h-6 w-6 rounded-md bg-white/5 flex items-center justify-center">
        <OsIcon os={osHint} size={14} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{template.name}</span>
          {inUse ? (
            <span className="text-fg-muted text-xs shrink-0">
              · {template.totalMachines} in use
            </span>
          ) : null}
        </div>
        {template.description ? (
          <span className="text-fg-muted text-xs truncate">
            {template.description}
          </span>
        ) : null}
      </div>
      <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-fg-muted whitespace-nowrap">
        <span className="text-fg">{template.cores}</span>
        <span className="text-fg-subtle">c</span>
        <span className="text-fg-subtle">·</span>
        <span className="text-fg">{template.ram}</span>
        <span className="text-fg-subtle">GB</span>
        <span className="text-fg-subtle">·</span>
        <span className="text-fg">{template.storage}</span>
        <span className="text-fg-subtle">GB</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          size="sm"
          variant="ghost"
          label="Edit blueprint"
          icon={<Pencil size={14} />}
          onClick={onEdit}
        />
        {inUse ? (
          <Tooltip
            content={`In use by ${template.totalMachines} desktop${template.totalMachines !== 1 ? 's' : ''}`}
          >
            <span>
              <IconButton
                size="sm"
                variant="ghost"
                label="Delete blueprint"
                icon={<Trash2 size={14} />}
                disabled
              />
            </span>
          </Tooltip>
        ) : (
          <IconButton
            size="sm"
            variant="ghost"
            label="Delete blueprint"
            icon={<Trash2 size={14} />}
            onClick={() => onDelete?.(template)}
          />
        )}
      </div>
    </div>
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
      toast.success('Blueprint deleted');
      refreshTemplates();
      setDeleteTemplateTarget(null);
    } catch (err) {
      debug.error('delete template', err);
      toast.error(`Could not delete blueprint: ${err.message}`);
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
      title: 'Blueprints',
      description: 'Reusable desktop configurations grouped by category.',
      icon: <Layers size={20} />,
      sections: [
        {
          id: 'blueprints',
          title: 'What blueprints are',
          icon: <Layers size={16} />,
          content: (
            <p>
              Reusable configurations applied when creating a desktop: hardware,
              OS, and (coming soon) pre-installed apps and settings. Skip the
              manual wiring step.
            </p>
          ),
        },
        {
          id: 'categories',
          title: 'Categories',
          icon: <FolderTree size={16} />,
          content: (
            <p>
              Group blueprints by purpose (Dev, Production, Testing) or by
              team. A category can only be deleted when empty.
            </p>
          ),
        },
        {
          id: 'lifecycle',
          title: 'Lifecycle',
          icon: <Copy size={16} />,
          content: (
            <p>
              Blueprints used by desktops can&apos;t be deleted until every
              desktop that uses them is removed or moved to another blueprint.
            </p>
          ),
        },
        {
          id: 'conventions',
          title: 'Conventions',
          icon: <Settings size={16} />,
          content: (
            <ul>
              <li>Use descriptive names (OS + purpose + resource tier)</li>
              <li>Keep ISOs current with security patches</li>
              <li>Document edge cases in the blueprint description</li>
            </ul>
          ),
        },
      ],
      quickTips: [
        'Hover over a blueprint to reveal edit / delete',
        'Categories cannot be deleted while they contain blueprints',
        'The refresh button reloads both blueprints and categories',
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Blueprints', isCurrent: true },
      ],
      title: 'Blueprints',
      actions: [],
      helpConfig,
      helpTooltip: 'Blueprints help',
    },
    []
  );

  const countText = stats.templates === 0
    ? null
    : [
        `${stats.templates} blueprint${stats.templates !== 1 ? 's' : ''}`,
        `${stats.categories} categor${stats.categories !== 1 ? 'ies' : 'y'}`,
        stats.inUse > 0 ? `${stats.inUse} in use` : null,
      ].filter(Boolean).join(' · ');

  const pageHeader = (
    <PageHeader
      title="Blueprints"
      count={countText}
      secondary={
        <IconButton
          size="sm"
          variant="ghost"
          label="Refresh"
          icon={<RefreshCw size={14} />}
          onClick={handleRefresh}
          disabled={loading}
        />
      }
      primary={
        <CreateCategoryDialog>
          <Button size="sm" variant="primary" icon={<Plus size={14} />}>
            New Category
          </Button>
        </CreateCategoryDialog>
      }
    />
  );

  const errorBlock = error ? (
    <Alert
      tone="danger"
      title="Couldn't load blueprints"
      actions={
        <Button
          size="sm"
          onClick={handleRefresh}
          icon={<RefreshCw size={14} />}
        >
          Retry
        </Button>
      }
    >
      {String(error.message || error)}
    </Alert>
  ) : null;

  let body;
  if (loading && (templates || []).length === 0) {
    body = (
      <ResponsiveStack direction="row" gap={3} align="center" justify="center">
        <Spinner />
        <span>Loading blueprints…</span>
      </ResponsiveStack>
    );
  } else if ((categories || []).length === 0) {
    body = (
      <EmptyState
        icon={<FolderTree size={18} />}
        title="No categories yet"
        description="Create a category to start organising blueprints."
        actions={
          <CreateCategoryDialog>
            <Button size="sm" variant="primary" icon={<Plus size={14} />}>
              New Category
            </Button>
          </CreateCategoryDialog>
        }
      />
    );
  } else {
    body = (
      <ResponsiveStack direction="col" gap={6}>
        {(categories || []).map((category) => {
          const list = templatesByCategory[category.id] || [];
          const canDelete = (category.totalTemplates || 0) === 0;

          return (
            <section key={category.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold m-0">
                      {category.name}
                    </h2>
                    <span className="text-fg-muted text-xs">
                      · {list.length} blueprint{list.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {category.description ? (
                    <span className="text-fg-muted text-xs">
                      {category.description}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label="Edit category"
                    icon={<Pencil size={14} />}
                    onClick={() => setEditingCategory(category)}
                  />
                  {canDelete ? (
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label="Delete category"
                      icon={<Trash2 size={14} />}
                      onClick={() => setDeleteCategoryTarget(category)}
                    />
                  ) : (
                    <Tooltip
                      content={`Contains ${category.totalTemplates} blueprint${category.totalTemplates !== 1 ? 's' : ''}`}
                    >
                      <span>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label="Delete category"
                          icon={<Trash2 size={14} />}
                          disabled
                        />
                      </span>
                    </Tooltip>
                  )}
                  <CreateTemplateDialog categoryId={category.id}>
                    <Button size="sm" variant="secondary" icon={<Plus size={14} />}>
                      New Blueprint
                    </Button>
                  </CreateTemplateDialog>
                </div>
              </div>

              {list.length === 0 ? (
                <div className="py-4 px-2 text-fg-muted text-sm">
                  No blueprints in this category yet.{' '}
                  <CreateTemplateDialog categoryId={category.id}>
                    <button className="text-accent underline underline-offset-2 hover:no-underline">
                      Create one
                    </button>
                  </CreateTemplateDialog>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/5">
                  {list.map((template) => (
                    <BlueprintRow
                      key={template.id}
                      template={template}
                      onEdit={() => setEditingTemplate(template)}
                      onDelete={setDeleteTemplateTarget}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </ResponsiveStack>
    );
  }

  return (
    <Page size="xl" gap="lg">
      {pageHeader}
      {errorBlock}
      {body}

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

      <Dialog
        open={!!deleteTemplateTarget}
        onClose={() => setDeleteTemplateTarget(null)}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>Delete blueprint</span>
          </ResponsiveStack>
        }
        description={
          deleteTemplateTarget
            ? `Remove ${deleteTemplateTarget.name}? Desktops already created from it are unaffected.`
            : ''
        }
        footer={
          <ButtonGroup attached={false}>
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
        <p>
          This cannot be undone. Only the blueprint is removed; existing
          desktops keep running.
        </p>
      </Dialog>

      <Dialog
        open={!!deleteCategoryTarget}
        onClose={() => setDeleteCategoryTarget(null)}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>Delete category</span>
          </ResponsiveStack>
        }
        description={
          deleteCategoryTarget
            ? `Remove the ${deleteCategoryTarget.name} category?`
            : ''
        }
        footer={
          <ButtonGroup attached={false}>
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
        <p>
          The category must be empty. Blueprints inside must be removed or
          moved first.
        </p>
      </Dialog>
    </Page>
  );
}

