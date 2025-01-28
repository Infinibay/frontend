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
import { updateTemplate } from '@/state/slices/templates';
import { selectTemplatesLoading, selectTemplatesError } from '@/state/slices/templates';

export function EditTemplateDialog({ children, template }) {
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
    categoryId: '',
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        cores: template.cores.toString(),
        ram: template.ram.toString(),
        storage: template.storage.toString(),
        categoryId: template.categoryId,
      });
    }
  }, [template]);

  const handleUpdate = async () => {
    try {
      await dispatch(updateTemplate({
        id: template.id,
        input: {
          ...formData,
          cores: parseInt(formData.cores),
          ram: parseInt(formData.ram),
          storage: parseInt(formData.storage),
        }
      })).unwrap();
      
      setOpen(false);
    } catch (err) {
      console.error('Failed to update template:', err);
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
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Make changes to your machine template.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error?.update && (
            <div className="text-sm text-red-500">
              Error updating template: {error.update}
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
              placeholder="Template description"
              required
              disabled={loading.update}
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
                disabled={loading.update}
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
                disabled={loading.update}
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
                disabled={loading.update}
              />
            </div>
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
