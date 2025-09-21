'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { CreateTemplateDialog } from './components/create-template-dialog';
import { CreateCategoryDialog } from './components/create-category-dialog';
import { EditTemplateDialog } from './components/edit-template-dialog';
import { EditCategoryDialog } from './components/edit-category-dialog';
import { TemplateCard } from './components/template-card';
import { TemplatesHeader } from './components/TemplatesHeader';
import { LottieAnimation } from '@/components/ui/lottie-animation';
import { destroyTemplate, fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { destroyTemplateCategory, fetchTemplateCategories } from '@/state/slices/templateCategories';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TemplatesPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Initial data fetch
  React.useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  // Get data from Redux store
  const templatesState = useSelector(selectTemplatesState);
  const templates = templatesState.items || [];
  const categories = useSelector(state => state.templateCategories.items);

  const handleDeleteTemplate = async (templateId) => {
    try {
      await dispatch(destroyTemplate(templateId)).unwrap();
      toast({
        variant: "success",
        title: "Success",
        description: "Template deleted successfully"
      });
      // Refetch templates after successful deletion
      dispatch(fetchTemplates());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete template: ${error.message}`
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await dispatch(destroyTemplateCategory(categoryId)).unwrap();
      toast({
        variant: "success",
        title: "Success",
        description: "Category deleted successfully"
      });
      // Refetch categories after successful deletion
      dispatch(fetchTemplateCategories());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete category: ${error.message}`
      });
    }
  };

  const templatesByCategory = templates.reduce((acc, template) => {
    const categoryId = template.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(template);
    return acc;
  }, {});

  const handleRefresh = () => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  };

  return (
    <div className="pb-4 lg:pb-0">
      <TemplatesHeader onRefresh={handleRefresh} />

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
          {categories.map((category) => (
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
                    <LottieAnimation
                      animationPath="/lottie/not-found.json"
                      className="w-48 h-48 opacity-80 mb-4"
                      loop={true}
                      autoplay={true}
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
          {categories.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <LottieAnimation
                animationPath="/lottie/not-found.json"
                className="w-64 h-64 opacity-80 mb-4"
                loop={true}
                autoplay={true}
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
