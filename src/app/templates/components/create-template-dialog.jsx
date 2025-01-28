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
import { createTemplate } from '@/state/slices/templates';
import { selectTemplatesLoading, selectTemplatesError } from '@/state/slices/templates';

export function CreateTemplateDialog({ children, categoryId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cores: '',
    ram: '',
    storage: '',
  });

  const handleCreate = async () => {
    try {
      await dispatch(createTemplate({
        ...formData,
        cores: parseInt(formData.cores),
        ram: parseInt(formData.ram),
        storage: parseInt(formData.storage),
        categoryId
      })).unwrap();
      
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        cores: '',
        ram: '',
        storage: '',
      });
    } catch (err) {
      console.error('Failed to create template:', err);
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
    return formData.name && 
           formData.description && 
           formData.cores && 
           formData.ram && 
           formData.storage;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new machine template. Configure the resources for this template.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error?.create && (
            <div className="text-sm text-red-500">
              Error creating template: {error.create}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Template name"
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
              placeholder="Template description"
              required
              disabled={loading.create}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cores">CPU Cores</Label>
              <Input
                id="cores"
                name="cores"
                type="number"
                min="1"
                value={formData.cores}
                onChange={handleChange}
                required
                disabled={loading.create}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ram">RAM (GB)</Label>
              <Input
                id="ram"
                name="ram"
                type="number"
                min="1"
                value={formData.ram}
                onChange={handleChange}
                required
                disabled={loading.create}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage (GB)</Label>
              <Input
                id="storage"
                name="storage"
                type="number"
                min="1"
                value={formData.storage}
                onChange={handleChange}
                required
                disabled={loading.create}
              />
            </div>
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
            {loading.create ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
