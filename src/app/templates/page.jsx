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
  AlertCircle,
} from 'lucide-react';
import {
  Page,
  Card,
  Button,
  ButtonGroup,
  Badge,
  Alert,
  EmptyState,
  Spinner,
  Dialog,
  Stat,
  IconButton,
  IconTile,
  ResponsiveStack,
  ResponsiveGrid,
  Tooltip,
  PropertyList,
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

/** Harbor-native tile for a single template. */
function TemplateTile({ template, onEdit, onDelete }) {
  const inUse = (template.totalMachines || 0) > 0;

  const editBtn = (
    <IconButton
      size="sm"
      variant="ghost"
      label="Edit template"
      icon={<Pencil size={14} />}
      onClick={onEdit}
    />
  );

  const deleteBtn = (
    <IconButton
      size="sm"
      variant="ghost"
      label="Delete template"
      icon={<Trash2 size={14} />}
      disabled={inUse}
      onClick={() => !inUse && onDelete?.(template)}
    />
  );

  return (
    <Card
      variant="default"
      interactive
      title={template.name}
      description={template.description || undefined}
      footer={
        <ResponsiveStack direction="row" gap={2} justify="between" align="center">
          {inUse ? (
            <Badge tone="info">
              {template.totalMachines} in use
            </Badge>
          ) : (
            <span />
          )}
          <ResponsiveStack direction="row" gap={1}>
            {editBtn}
            {inUse ? (
              <Tooltip
                content={`In use by ${template.totalMachines} machine${template.totalMachines !== 1 ? 's' : ''}`}
              >
                <span>{deleteBtn}</span>
              </Tooltip>
            ) : (
              deleteBtn
            )}
          </ResponsiveStack>
        </ResponsiveStack>
      }
    >
      <PropertyList
        items={[
          { key: 'cores', label: 'vCPU', value: String(template.cores) },
          { key: 'ram', label: 'RAM', value: `${template.ram} GB` },
          { key: 'storage', label: 'Disk', value: `${template.storage} GB` },
        ]}
      />
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
      icon: <Layers size={20} />,
      sections: [
        {
          id: 'templates',
          title: 'What templates are',
          icon: <Layers size={16} />,
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
          icon: <FolderTree size={16} />,
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
          icon: <Copy size={16} />,
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
          icon: <Settings size={16} />,
          content: (
            <ul>
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

  const heroCard = (
    <Card variant="default">
      <ResponsiveStack direction="col" gap={4}>
        <ResponsiveStack
          direction={{ base: 'col', lg: 'row' }}
          gap={4}
          justify="between"
          align="start"
        >
          <ResponsiveStack direction="row" gap={3} align="start">
            <IconTile icon={<Layers size={20} />} tone="purple" size="md" />
            <ResponsiveStack direction="col" gap={1}>
              <h1>Templates</h1>
              <p>
                VM blueprints grouped by category. Use them to skip manual
                wiring when creating a new VM.
              </p>
            </ResponsiveStack>
          </ResponsiveStack>

          <ResponsiveStack direction="row" gap={2} align="center">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <CreateCategoryDialog>
              <Button size="sm" icon={<Plus size={14} />}>
                New category
              </Button>
            </CreateCategoryDialog>
          </ResponsiveStack>
        </ResponsiveStack>

        <ResponsiveGrid columns={3} gap={3}>
          <Stat
            label="Categories"
            value={stats.categories}
            variant="plain"
            icon={<FolderTree size={14} />}
          />
          <Stat
            label="Templates"
            value={stats.templates}
            variant="plain"
            icon={<Layers size={14} />}
          />
          <Stat
            label="In use"
            value={stats.inUse}
            variant="plain"
            icon={<Copy size={14} />}
          />
        </ResponsiveGrid>
      </ResponsiveStack>
    </Card>
  );

  const errorBlock = error ? (
    <Alert
      tone="danger"
      title="Couldn't load templates"
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
      <Card variant="default">
        <ResponsiveStack direction="row" gap={3} align="center" justify="center">
          <Spinner />
          <span>Loading templates…</span>
        </ResponsiveStack>
      </Card>
    );
  } else if ((categories || []).length === 0) {
    body = (
      <Card variant="default">
        <EmptyState
          icon={<FolderTree size={40} />}
          title="No categories yet"
          description="Create a category to start organising templates."
          actions={
            <CreateCategoryDialog>
              <Button size="sm" icon={<Plus size={14} />}>
                New category
              </Button>
            </CreateCategoryDialog>
          }
        />
      </Card>
    );
  } else {
    body = (
      <ResponsiveStack direction="col" gap={5}>
        {(categories || []).map((category) => {
          const list = templatesByCategory[category.id] || [];
          const canDelete = (category.totalTemplates || 0) === 0;

          const header = (
            <ResponsiveStack
              direction="row"
              gap={3}
              justify="between"
              align="start"
            >
              <ResponsiveStack direction="col" gap={1}>
                <ResponsiveStack direction="row" gap={2} align="center" wrap>
                  <h2>{category.name}</h2>
                  <Badge tone="neutral">
                    {list.length} template{list.length !== 1 ? 's' : ''}
                  </Badge>
                </ResponsiveStack>
                {category.description ? (
                  <p>{category.description}</p>
                ) : null}
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={1} align="center">
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
                    content={`Contains ${category.totalTemplates} template${category.totalTemplates !== 1 ? 's' : ''}`}
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
                  <Button size="sm" icon={<Plus size={14} />}>
                    Template
                  </Button>
                </CreateTemplateDialog>
              </ResponsiveStack>
            </ResponsiveStack>
          );

          return (
            <Card
              key={category.id}
              variant="default"
              header={header}
            >
              {list.length === 0 ? (
                <EmptyState
                  variant="dashed"
                  icon={<Layers size={20} />}
                  title="No templates in this category yet"
                  actions={
                    <CreateTemplateDialog categoryId={category.id}>
                      <Button size="sm" icon={<Plus size={14} />}>
                        Add template
                      </Button>
                    </CreateTemplateDialog>
                  }
                />
              ) : (
                <ResponsiveGrid
                  columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
                  gap={3}
                >
                  {list.map((template) => (
                    <TemplateTile
                      key={template.id}
                      template={template}
                      onEdit={() => setEditingTemplate(template)}
                      onDelete={setDeleteTemplateTarget}
                    />
                  ))}
                </ResponsiveGrid>
              )}
            </Card>
          );
        })}
      </ResponsiveStack>
    );
  }

  return (
    <Page size="xl" gap="lg">
      {heroCard}
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
            <span>Delete template</span>
          </ResponsiveStack>
        }
        description={
          deleteTemplateTarget
            ? `Remove ${deleteTemplateTarget.name}? VMs already created from it are unaffected.`
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
          This cannot be undone. Only the blueprint is removed; existing VMs
          keep running.
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
          The category must be empty. Templates inside must be removed or
          moved first.
        </p>
      </Dialog>
    </Page>
  );
}

