import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

/**
 * Dialog component for creating a new department
 */
const CreateDepartmentDialog = ({ 
  open, 
  onOpenChange, 
  departmentName, 
  onDepartmentNameChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Enter a name for the new department.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              type="text"
              placeholder="Department name"
              value={departmentName}
              onChange={(e) => onDepartmentNameChange(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
