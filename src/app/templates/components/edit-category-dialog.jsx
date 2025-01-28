'use client';

import { useState, useEffect } from 'react';
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
import { updateTemplateCategory } from '@/state/slices/templateCategories';
import { 
  selectTemplateCategoriesLoading, 
  selectTemplateCategoriesError 
} from '@/state/slices/templateCategories';

export function EditCategoryDialog({ children, category }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplateCategoriesLoading);
  const error = useSelector(selectTemplateCategoriesError);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    }
  }, [category]);

  const handleUpdate = async () => {
    try {
      await dispatch(updateTemplateCategory({
        id: category.id,
        input: formData
      })).unwrap();
      
      setOpen(false);
    } catch (err) {
      console.error('Failed to update category:', err);
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
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to your template category.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error?.update && (
            <div className="text-sm text-red-500">
              Error updating category: {error.update}
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
              disabled={loading.update}
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
              disabled={loading.update}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading.update}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleUpdate}
            disabled={loading.update || !isFormValid()}
            variant="success"
          >
            {loading.update ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
