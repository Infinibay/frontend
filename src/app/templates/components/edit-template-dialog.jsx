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
import { Textarea } from '@/components/ui/textarea';
import { Cpu, MemoryStick, HardDrive, FileText, Loader2 } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Edit Template
          </DialogTitle>
          <DialogDescription>
            Make changes to your machine template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {error?.update && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              Error updating template: {error.update}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Development Workstation"
              disabled={loading.update}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this template..."
              rows={2}
              disabled={loading.update}
              className="resize-none p-3 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Resources Section */}
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">
              Resources
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {/* CPU */}
              <div className="space-y-2">
                <Label htmlFor="cores" className="flex items-center gap-1.5 text-sm">
                  <Cpu className="h-3.5 w-3.5 text-blue-500" />
                  CPU Cores
                </Label>
                <Input
                  id="cores"
                  name="cores"
                  type="number"
                  min="1"
                  max="64"
                  value={formData.cores}
                  onChange={handleChange}
                  disabled={loading.update}
                  className="text-center"
                />
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <Label htmlFor="ram" className="flex items-center gap-1.5 text-sm">
                  <MemoryStick className="h-3.5 w-3.5 text-green-500" />
                  RAM (GB)
                </Label>
                <Input
                  id="ram"
                  name="ram"
                  type="number"
                  min="1"
                  max="512"
                  value={formData.ram}
                  onChange={handleChange}
                  disabled={loading.update}
                  className="text-center"
                />
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <Label htmlFor="storage" className="flex items-center gap-1.5 text-sm">
                  <HardDrive className="h-3.5 w-3.5 text-amber-500" />
                  Storage (GB)
                </Label>
                <Input
                  id="storage"
                  name="storage"
                  type="number"
                  min="10"
                  max="2000"
                  value={formData.storage}
                  onChange={handleChange}
                  disabled={loading.update}
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
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
            {loading.update ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
