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
import { Textarea } from '@/components/ui/textarea';
import { Cpu, MemoryStick, HardDrive, FileText, Loader2 } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Template
          </DialogTitle>
          <DialogDescription>
            Define a reusable configuration for virtual machines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {error?.create && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              Error creating template: {error.create}
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
              disabled={loading.create}
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
              disabled={loading.create}
              className="resize-none"
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
                  placeholder="4"
                  disabled={loading.create}
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
                  placeholder="8"
                  disabled={loading.create}
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
                  placeholder="50"
                  disabled={loading.create}
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
            {loading.create ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Template'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
