'use client';

/**
 * Template Gallery Component
 *
 * Displays automation templates organized by category, allowing users
 * to quickly start from a pre-built automation.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAutomationTemplatesQuery, useCreateAutomationFromTemplateMutation } from '@/gql/hooks';
import {
  Cpu,
  HardDrive,
  Shield,
  RefreshCw,
  AppWindow,
  Sparkles,
  ChevronRight,
  Loader2,
  FileCode,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
  Performance: Cpu,
  Storage: HardDrive,
  Security: Shield,
  Updates: RefreshCw,
  Applications: AppWindow,
};

const CATEGORY_COLORS = {
  Performance: 'text-blue-500',
  Storage: 'text-amber-500',
  Security: 'text-red-500',
  Updates: 'text-green-500',
  Applications: 'text-purple-500',
};

export function TemplateGallery({ open, onOpenChange, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data, loading } = useGetAutomationTemplatesQuery();
  const [createFromTemplate, { loading: creating }] = useCreateAutomationFromTemplateMutation({
    onError: (error) => {
      toast.error('Failed to create automation', {
        description: error.message,
      });
    },
  });

  const templates = data?.automationTemplates ?? [];
  const categories = ['all', ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleSelect = async (template) => {
    try {
      const result = await createFromTemplate({
        variables: { templateId: template.id },
      });

      if (result.data?.createAutomationFromTemplate) {
        toast.success('Automation created from template', {
          description: `Created "${result.data.createAutomationFromTemplate.name}"`,
        });
        onSelect?.(result.data.createAutomationFromTemplate);
        onOpenChange(false);
      }
    } catch (error) {
      // Error handled by onError callback
    }
  };

  const handleStartFromScratch = () => {
    onSelect?.(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Start from a Template
          </DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly. You can customize it after.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat === 'all' ? 'All Templates' : cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => {
                  const Icon = CATEGORY_ICONS[template.category] || Sparkles;
                  const color = CATEGORY_COLORS[template.category] || 'text-primary';

                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors group"
                      onClick={() => !creating && handleSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">{template.name}</h3>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                              {template.recommendationType && (
                                <Badge variant="secondary" className="text-xs">
                                  {template.recommendationType.replace(/_/g, ' ')}
                                </Badge>
                              )}
                              {template.usageCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Used {template.usageCount}x
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No templates found in this category.
                </div>
              )}
            </div>
          </Tabs>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleStartFromScratch} disabled={creating}>
            <FileCode className="h-4 w-4 mr-2" />
            Start from Scratch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateGallery;
