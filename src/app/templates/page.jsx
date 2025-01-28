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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Machine Templates</h1>
        <CreateCategoryDialog>
          <Button>
            <FaPlus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </CreateCategoryDialog>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <div className="flex items-center space-x-2">
                    <EditCategoryDialog category={category}>
                      <Button variant="ghost" size="sm">
                        <FaPencilAlt className="h-4 w-4" />
                      </Button>
                    </EditCategoryDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={category.totalTemplates > 0 ? 'opacity-50' : ''}
                        >
                          <FaTrash className="h-4 w-4" />
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
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <CreateTemplateDialog categoryId={category.id}>
                <Button>
                  <FaPlus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CreateTemplateDialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templatesByCategory[category.id]?.map((template) => (
                <div key={template.id} className="relative group">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <EditTemplateDialog template={template}>
                      <Button variant="ghost" size="sm">
                        <FaPencilAlt className="h-4 w-4" />
                      </Button>
                    </EditTemplateDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={template.totalMachines > 0 ? 'opacity-50' : ''}
                        >
                          <FaTrash className="h-4 w-4" />
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
                <p className="col-span-full text-center text-gray-500 py-4">
                  No templates in this category yet
                </p>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No categories available. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
