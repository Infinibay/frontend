'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createTemplateCategory } from '@/state/slices/templateCategories';
import { 
  selectTemplateCategoriesLoading, 
  selectTemplateCategoriesError 
} from '@/state/slices/templateCategories';

export function CreateCategoryDialog({ children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplateCategoriesLoading);
  const error = useSelector(selectTemplateCategoriesError);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleCreate = async () => {
    try {
      await dispatch(createTemplateCategory(formData)).unwrap();
      setOpen(false);
      setFormData({
        name: '',
        description: '',
      });
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    return formData.name && formData.description;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your machine templates.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error?.create && (
            <div className="text-sm text-red-500">
              Error creating category: {error.create}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category name"
              required
              disabled={loading.create}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Category description"
              required
              disabled={loading.create}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading.create}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleCreate}
            disabled={loading.create || !isFormValid()}
            variant="success"
          >
            {loading.create ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
