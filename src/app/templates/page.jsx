'use client';

import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { CreateTemplateDialog } from './components/create-template-dialog';
import { CreateCategoryDialog } from './components/create-category-dialog';
import { EditTemplateDialog } from './components/edit-template-dialog';
import { EditCategoryDialog } from './components/edit-category-dialog';
import { TemplateCard } from './components/template-card';
import { SimpleIllustration } from '@/components/ui/undraw-illustration';
import { destroyTemplate, fetchTemplates } from '@/state/slices/templates';
import { destroyTemplateCategory, fetchTemplateCategories } from '@/state/slices/templateCategories';
import { useToast } from '@/hooks/use-toast';
import { Layers, FolderTree, Copy, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { usePageHeader } from '@/hooks/usePageHeader';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:templates');

export default function TemplatesPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Use optimized data loading for templates and categories
  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
    refresh: refreshTemplates
  } = useEnsureData('templates', fetchTemplates, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000, // 5 minutes
    transform: (data) => data.items || data || []
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refresh: refreshCategories
  } = useEnsureData('templateCategories', fetchTemplateCategories, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000, // 10 minutes
    transform: (data) => data.items || data || []
  });

  debug.info('Templates page state:', {
    templatesCount: templates?.length || 0,
    categoriesCount: categories?.length || 0,
    templatesLoading,
    categoriesLoading,
    hasErrors: !!(templatesError || categoriesError)
  });

  const handleDeleteTemplate = async (templateId) => {
    debug.info('Deleting template:', templateId);
    try {
      await dispatch(destroyTemplate(templateId)).unwrap();
      toast({
        variant: "success",
        title: "Success",
        description: "Template deleted successfully"
      });
      // Refresh templates to get updated list
      refreshTemplates();
      debug.info('Template deleted successfully:', templateId);
    } catch (error) {
      debug.error('Failed to delete template:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete template: ${error.message}`
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    debug.info('Deleting category:', categoryId);
    try {
      await dispatch(destroyTemplateCategory(categoryId)).unwrap();
      toast({
        variant: "success",
        title: "Success",
        description: "Category deleted successfully"
      });
      // Refresh categories to get updated list
      refreshCategories();
      debug.info('Category deleted successfully:', categoryId);
    } catch (error) {
      debug.error('Failed to delete category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete category: ${error.message}`
      });
    }
  };

  const templatesByCategory = (templates || []).reduce((acc, template) => {
    const categoryId = template.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(template);
    return acc;
  }, {});

  const handleRefresh = () => {
    debug.info('Refreshing templates and categories data...');
    refreshTemplates();
    refreshCategories();
  };

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Templates Help",
    description: "Learn how to create and manage VM templates and categories",
    icon: <Layers className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "understanding-templates",
        title: "Understanding Templates",
        icon: <Layers className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">What are Templates</p>
              <p>Pre-configured VM blueprints that define OS, resources, and settings. Templates allow you to create VMs quickly without configuring from scratch.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Template Components</p>
              <p>Templates include base ISO, CPU/RAM allocation, storage configuration, and network settings.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Reusability</p>
              <p>Create VMs quickly by selecting a template instead of configuring each setting manually.</p>
            </div>
          </div>
        ),
      },
      {
        id: "managing-categories",
        title: "Managing Categories",
        icon: <FolderTree className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating Categories</p>
              <p>Click "Create Category" to organize templates by purpose, environment, or department.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Editing Categories</p>
              <p>Use the pencil icon to modify category name and description.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Deleting Categories</p>
              <p>Categories can only be deleted when empty (no templates assigned).</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Organization</p>
              <p>Categories help filter and find templates quickly when creating VMs.</p>
            </div>
          </div>
        ),
      },
      {
        id: "managing-templates",
        title: "Managing Templates",
        icon: <Copy className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating Templates</p>
              <p>Click "Create Template" within a category, select an ISO and configure resources.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Editing Templates</p>
              <p>Hover over template cards to reveal the edit button, then modify settings as needed.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Deleting Templates</p>
              <p>Templates can only be deleted when no VMs are using them.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Template Cards</p>
              <p>Show OS type, resource allocation, and usage count for easy management.</p>
            </div>
          </div>
        ),
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p>Follow these guidelines for effective template management:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Create templates for commonly deployed VM configurations</li>
              <li>Use descriptive names that indicate OS, purpose, and resource tier</li>
              <li>Organize templates into logical categories (Development, Production, Testing)</li>
              <li>Set appropriate default resources to avoid over-provisioning</li>
              <li>Keep templates updated with latest OS versions and security patches</li>
              <li>Document special configurations in template descriptions</li>
            </ul>
          </div>
        ),
      },
    ],
    quickTips: [
      "Templates save time by pre-configuring VM settings",
      "Categories help organize templates by purpose or environment",
      "Templates in use cannot be deleted until all VMs are removed",
      "Use the refresh button to reload templates and categories",
    ],
  }), []);

  // Register help with the provider
  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Templates', isCurrent: true }
    ],
    title: 'Templates',
    actions: [
      {
        id: 'refresh',
        label: '',
        icon: 'RefreshCw',
        variant: 'outline',
        size: 'sm',
        onClick: handleRefresh,
        loading: templatesLoading || categoriesLoading,
        disabled: templatesLoading || categoriesLoading,
        tooltip: (templatesLoading || categoriesLoading) ? 'Refreshing...' : (templatesError || categoriesError) ? 'Retry loading templates' : 'Refresh templates',
        className: (templatesError || categoriesError) ? 'border-destructive text-destructive hover:bg-destructive/10' : ''
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Templates help'
  }, [templatesLoading, categoriesLoading, templatesError, categoriesError]);

  return (
    <div className="pb-4 lg:pb-0">

      <div className="glass-medium size-container size-padding mt-6">
        <div className="flex justify-between items-center size-gap">
          <div className="size-padding">
            <h1 className="size-mainheading font-bold text-glass-text-primary">Machine Templates</h1>
            <p className="size-text text-glass-text-secondary mt-2">
              Templates are pre-configured virtual machine blueprints that define OS, resources, and settings. Categories help organize templates by purpose, environment, or department for easier management.
            </p>
          </div>
          <CreateCategoryDialog>
            <Button className="size-button">
              <FaPlus className="size-icon mr-2" />
              Create Category
            </Button>
          </CreateCategoryDialog>
        </div>

        <div className="size-gap space-y-8">
          {(categories || []).map((category) => (
            <div key={category.id} className="glass-subtle radius-fluent-lg size-padding space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="size-heading font-semibold text-glass-text-primary">{category.name}</h2>
                    <div className="flex items-center space-x-2">
                      <EditCategoryDialog category={category}>
                        <Button variant="ghost" className="size-icon-button">
                          <FaPencilAlt className="size-icon" />
                        </Button>
                      </EditCategoryDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`size-icon-button ${category.totalTemplates > 0 ? 'opacity-50' : ''}`}
                          >
                            <FaTrash className="size-icon" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={category.totalTemplates > 0}
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete Category
                            {category.totalTemplates > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({category.totalTemplates} template{category.totalTemplates !== 1 ? 's' : ''} in use)
                              </span>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="size-text text-glass-text-secondary">{category.description}</p>
                </div>
                <CreateTemplateDialog categoryId={category.id}>
                  <Button className="size-button">
                    <FaPlus className="size-icon mr-2" />
                    Create Template
                  </Button>
                </CreateTemplateDialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 size-gap">
                {templatesByCategory[category.id]?.map((template) => (
                  <div key={template.id} className="relative group">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
                      <EditTemplateDialog template={template}>
                        <Button variant="ghost" className="size-icon-button glass-strong">
                          <FaPencilAlt className="size-icon" />
                        </Button>
                      </EditTemplateDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`size-icon-button glass-strong ${template.totalMachines > 0 ? 'opacity-50' : ''}`}
                          >
                            <FaTrash className="size-icon" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={template.totalMachines > 0}
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            Delete Template
                            {template.totalMachines > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({template.totalMachines} machine{template.totalMachines !== 1 ? 's' : ''} in use)
                              </span>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <TemplateCard template={template} onDelete={handleDeleteTemplate} />
                  </div>
                ))}
                {(!templatesByCategory[category.id] || templatesByCategory[category.id].length === 0) && (
                  <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] p-8">
                    <SimpleIllustration
                      name="not-found"
                      size="medium"
                      opacity={80}
                      className="mb-4"
                    />
                    <div className="text-center">
                      <p className="size-text text-glass-text-primary">
                        No templates in this category yet
                      </p>
                      <p className="size-small text-glass-text-secondary mt-1">
                        Create your first template to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
          </div>
          ))}
          {(!categories || categories.length === 0) && !(categoriesLoading || templatesLoading) && (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <SimpleIllustration
                name="not-found"
                size="large"
                opacity={80}
                className="mb-4"
              />
              <div className="text-center">
                <h3 className="size-heading text-glass-text-primary mb-2">No categories available</h3>
                <p className="size-text text-glass-text-secondary mb-4">
                  Create your first category to organize your machine templates
                </p>
                <CreateCategoryDialog>
                  <Button className="size-button">
                    <FaPlus className="size-icon mr-2" />
                    Create Your First Category
                  </Button>
                </CreateCategoryDialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
