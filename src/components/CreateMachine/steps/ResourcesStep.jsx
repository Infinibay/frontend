'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';

export function ResourcesStep({ id }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const { items: templates, loading: templatesLoading, error: templatesError } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector(state => state.templateCategories);
  const stepValues = values[id] || {};

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  if (templatesLoading.fetch) return <div>Loading templates...</div>;
  if (templatesError.fetch) return <div>Error loading templates</div>;

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const categoryId = template.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(template);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Resources</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template that best fits your needs.
        </p>
      </div>

      <RadioGroup
        value={stepValues.templateId}
        onValueChange={(value) => setValue(`${id}.templateId`, value)}
        className="space-y-6"
      >
        {categories.map((category) => (
          <Card key={category.id} className="p-6 border-2 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templatesByCategory[category.id]?.map((template) => (
                  <Label
                    key={template.id}
                    className={`relative flex cursor-pointer rounded-lg border-2 p-4 hover:border-primary hover:shadow-md transition-all ${
                      stepValues.templateId === template.id 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-input bg-card'
                    }`}
                  >
                    <RadioGroupItem
                      value={template.id}
                      id={template.id}
                      className="sr-only"
                    />
                    <div className="space-y-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-sm mt-4 pt-4 border-t">
                        <div>
                          <span className="font-medium">{template.cores}</span> Cores
                        </div>
                        <div>
                          <span className="font-medium">{template.ram}</span> GB RAM
                        </div>
                        <div>
                          <span className="font-medium">{template.storage}</span> GB Storage
                        </div>
                      </div>
                    </div>
                  </Label>
                ))}
                {(!templatesByCategory[category.id] || templatesByCategory[category.id].length === 0) && (
                  <p className="col-span-full text-center text-muted-foreground py-8 border-2 border-input border-dashed rounded-lg">
                    No templates in this category
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>

      {getError('templateId') && (
        <p className="text-sm text-red-500">{getError('templateId')}</p>
      )}
    </div>
  );
}
