"use client";

import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { UploadProgress } from './upload-progress';
import { cn } from '@/lib/utils';
import { useSizeContext } from './size-provider';
import {
  Upload,
  ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileImage
} from 'lucide-react';

/**
 * LogoUpload Component
 * Handles logo upload with drag-and-drop, preview, and progress tracking
 */
const LogoUpload = ({
  currentLogoUrl = '/images/logo.png',
  onLogoUpload,
  onLogoReset,
  loading = false,
  className,
  ...props
}) => {
  const { size } = useSizeContext();
  const fileInputRef = useRef(null);

  // Component state
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState(null);
  const [uploadController, setUploadController] = useState(null);

  /**
   * Validate logo file
   */
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Invalid file type. Please use PNG, JPG, or SVG images.'
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      };
    }

    return { success: true, message: 'File is valid' };
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (file) => {
    setError(null);

    const validation = validateFile(file);
    if (!validation.success) {
      setError(validation.message);
      return;
    }

    setSelectedFile(file);
    setTotalSize(file.size);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  /**
   * Upload file with progress tracking
   */
  const handleUpload = async () => {
    if (!selectedFile || !onLogoUpload) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedSize(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('logo', selectedFile);

      const controller = new AbortController();
      setUploadController(controller);
      let lastLoaded = 0;
      let lastTime = Date.now();

      const response = await axios.post('/api/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: ({ loaded, total }) => {
          const now = Date.now();
          const dt = (now - lastTime) / 1000;
          if (dt > 0.1) {
            setUploadSpeed((loaded - lastLoaded) / dt);
            lastLoaded = loaded;
            lastTime = now;
          }
          setUploadedSize(loaded);
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      });

      const result = response.data;

      // Call parent handler with result
      await onLogoUpload(result.logoUrl || result.url);

      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(100);

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Logo upload failed:', error);
        setError(error.message || 'Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadController(null);
    }
  };

  /**
   * Cancel upload
   */
  const handleCancelUpload = () => {
    if (uploadController) {
      uploadController.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedSize(0);
    setUploadController(null);
  };

  /**
   * Clear selected file
   */
  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Reset to default logo
   */
  const handleResetToDefault = async () => {
    if (onLogoReset) {
      await onLogoReset();
    }
    handleClearFile();
  };

  /**
   * Trigger file input
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Current logo URL (either custom or default)
  const displayLogoUrl = previewUrl || currentLogoUrl;

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-200",
          className
        )}
        glass="subtle"
        elevation="2"
        {...props}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Company Logo
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Logo Preview */}
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <div className="relative w-24 h-8 border border-border rounded-md overflow-hidden bg-muted">
                <img
                  src={displayLogoUrl}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/images/logo.png';
                  }}
                />
              </div>
            </div>
            <div className="flex-1 text-sm text-muted-foreground">
              Current logo preview (120×40 pixels recommended)
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/5",
              loading && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!loading ? triggerFileInput : undefined}
          >
            {/* Hidden file input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={loading}
            />

            <div className="text-center space-y-2">
              {selectedFile ? (
                <>
                  <FileImage className="mx-auto h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload logo image</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, or SVG • Max 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 border border-destructive/20 rounded-md bg-destructive/5 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {selectedFile && !isUploading && (
              <>
                <Button
                  onClick={handleUpload}
                  disabled={loading || isUploading}
                  className="flex-1"
                  variant="primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <Button
                  onClick={handleClearFile}
                  variant="outline"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}

            {!selectedFile && currentLogoUrl !== '/images/logo.png' && (
              <Button
                onClick={handleResetToDefault}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress Dialog */}
      <UploadProgress
        isOpen={isUploading}
        title="Uploading Logo"
        uploadedSize={uploadedSize}
        totalSize={totalSize}
        uploadSpeed={uploadSpeed}
        progress={uploadProgress}
        onCancel={handleCancelUpload}
        showCancelButton={true}
      />
    </>
  );
};

export { LogoUpload };