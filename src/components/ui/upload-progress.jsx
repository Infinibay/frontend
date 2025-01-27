"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function UploadProgress({
  isOpen,
  onOpenChange,
  title = "Uploading File",
  uploadedSize,
  totalSize,
  uploadSpeed,
  progress,
  onCancel,
  showCancelButton = false,
}) {
  const formatSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleOpenChange = (open) => {
    if (!open && onCancel) {
      handleCancel();
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Progress value={progress} className="w-full" />
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between items-center font-mono">
              <span>{formatSize(uploadedSize)}/{formatSize(totalSize || 0)}</span>
              <span>{uploadSpeed > 0 ? `${formatSize(uploadSpeed)}/s` : 'Calculating...'}</span>
            </div>
            <p className="text-center text-xs">{progress}% Complete</p>
          </div>
          {showCancelButton && (
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-destructive hover:text-destructive"
              >
                Cancel Upload
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
