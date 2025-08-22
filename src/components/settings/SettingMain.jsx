"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { UploadProgress } from "@/components/ui/upload-progress";
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import axios from "axios";

const SettingMain = () => {
  const { toast } = useToast();
  const [selectedOS, setSelectedOS] = useState("");
  const [isoFile, setIsoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [lastLoaded, setLastLoaded] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [uploadController, setUploadController] = useState(null);

  const fileInputRef = useRef(null);
  const [draggedOverOS, setDraggedOverOS] = useState(null);
  
  // Use the same hook as the wizard to check ISO availability
  const { isOSAvailable, loading, checkStatus } = useSystemStatus({ checkOnMount: true });

  const osOptions = [
    { 
      id: 'WINDOWS10',
      value: "windows10", 
      label: "Windows 10",
      icon: FaWindows,
      color: '#00A4EF',
      description: 'Microsoft Windows 10 operating system',
      downloadUrl: "https://www.microsoft.com/es-es/software-download/windows10ISO"
    },
    { 
      id: 'WINDOWS11',
      value: "windows11", 
      label: "Windows 11",
      icon: FaWindows,
      color: '#00A4EF',
      description: 'Latest version of Microsoft Windows',
      downloadUrl: "https://www.microsoft.com/es-es/software-download/windows11"
    },
    { 
      id: 'UBUNTU',
      value: "ubuntu", 
      label: "Ubuntu",
      icon: FaUbuntu,
      color: '#E95420',
      description: 'Popular Linux distribution',
      downloadUrl: "https://ubuntu.com/download/desktop"
    },
    { 
      id: 'FEDORA',
      value: "fedora", 
      label: "Fedora",
      icon: SiFedora,
      color: '#294172',
      description: 'Advanced Linux distribution',
      downloadUrl: "https://fedoraproject.org/workstation/download"
    },
  ];


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

  const handleFileSelect = (file, osValue = null, autoUpload = false) => {
    if (file && file.name.toLowerCase().endsWith('.iso')) {
      setIsoFile(file);
      if (osValue) {
        setSelectedOS(osValue);
      }
      if (autoUpload && osValue) {
        // Auto-upload when dropping file on a card
        setTimeout(() => {
          handleUploadWithParams(file, osValue);
        }, 100);
      }
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid ISO file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e, osValue) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(osValue);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(null);
  };

  const handleDrop = (e, osValue) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverOS(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], osValue, true); // true = autoUpload
    }
  };

  const handleCardClick = (osValue) => {
    setSelectedOS(osValue);
    fileInputRef.current?.click();
  };

  const handleUploadWithParams = async (file = null, os = null) => {
    const fileToUpload = file || isoFile;
    const osToUpload = os || selectedOS;
    
    if (!osToUpload || !fileToUpload) {
      toast({
        title: "Missing Information",
        description: "Please select an OS and ISO file",
        variant: "destructive",
      });
      return;
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024 * 1024; // 100GB
    if (fileToUpload.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "ISO file size must be less than 100GB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const controller = new AbortController();
      setUploadController(controller);
      
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('os', osToUpload);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/isoUpload`, formData, {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
          
          // Calculate upload speed
          const currentTime = Date.now();
          const timeDiff = (currentTime - lastTime) / 1000; // Convert to seconds
          const loadedDiff = progressEvent.loaded - lastLoaded;
          const speed = loadedDiff / timeDiff; // bytes per second
          
          setUploadSpeed(speed);
          setLastLoaded(progressEvent.loaded);
          setLastTime(currentTime);
        },
      });

      if (response.status !== 200) {
        throw new Error(response.data);
      }

      // Refresh ISO availability after successful upload
      await checkStatus();
      setIsoFile(null);
      setSelectedOS("");
      toast({
        title: "Success",
        description: "ISO file uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: `Failed to upload ISO file: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedOS || !isoFile) {
      toast({
        title: "Missing Information",
        description: "Please select an OS and ISO file",
        variant: "destructive",
      });
      return;
    }

    await handleUploadWithParams();
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your ISO files and system configuration
          </p>
        </div>

        {/* ISO Management Section */}
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">ISO Management</h2>
              <p className="text-sm text-muted-foreground">
                Upload ISO files for different operating systems. You can drag and drop files directly onto the OS cards.
              </p>
            </div>

            {/* OS Selection Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {osOptions.map((os) => {
                const Icon = os.icon;
                const isSelected = selectedOS === os.value;
                const hasISO = isOSAvailable(os.id);
                const isDraggedOver = draggedOverOS === os.value;

                return (
                  <Card
                    key={os.value}
                    className={cn(
                      'relative transition-all duration-300 cursor-pointer',
                      'hover:scale-105 hover:shadow-xl hover:z-10',
                      isSelected && 'shadow-lg shadow-primary/25 bg-primary/5 border-primary',
                      isDraggedOver && 'scale-105 shadow-2xl border-primary border-2',
                      hasISO && 'bg-green-50/50 dark:bg-green-900/10 border-green-500/30',
                      'hover:border-primary/50'
                    )}
                    onClick={() => handleCardClick(os.value)}
                    onDragOver={(e) => handleDragOver(e, os.value)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, os.value)}
                  >
                    <div className="p-6">
                      {/* Status Badge */}
                      {hasISO && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">ISO Ready</span>
                        </div>
                      )}

                      <div className="aspect-square flex items-center justify-center mb-4">
                        <Icon
                          className="w-20 h-20 transition-transform duration-300"
                          style={{ color: os.color }}
                        />
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold text-lg">{os.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {hasISO ? 'ISO uploaded - Click to replace' : os.description}
                        </p>
                        
                        {/* Drop zone indicator */}
                        {isDraggedOver && (
                          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Upload className="h-12 w-12 text-primary animate-pulse" />
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(os.downloadUrl, '_blank');
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download ISO
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Upload Section */}
            {(selectedOS || isoFile) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {selectedOS && `Selected OS: ${osOptions.find(os => os.value === selectedOS)?.label}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isoFile && `File: ${isoFile.name} (${formatSize(isoFile.size)})`}
                    </p>
                    {selectedOS && isOSAvailable(osOptions.find(os => os.value === selectedOS)?.id) && (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-xs font-medium">
                          Warning: This will replace the existing ISO file for this OS
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedOS || !isoFile || isUploading}
                    variant={selectedOS && isOSAvailable(osOptions.find(os => os.value === selectedOS)?.id) ? "destructive" : "default"}
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : (selectedOS && isOSAvailable(osOptions.find(os => os.value === selectedOS)?.id) ? 'Replace ISO' : 'Upload ISO')}
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".iso"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Click on any OS card to select and upload an ISO file, or drag and drop directly onto the cards</p>
            </div>
          </div>
        </Card>
      </div>
      {/* Replace the old progress dialog with the new component */}
      <UploadProgress
        isOpen={isUploading}
        onOpenChange={setIsUploading}
        title="Uploading ISO File"
        uploadedSize={lastLoaded}
        totalSize={isoFile?.size || 0}
        uploadSpeed={uploadSpeed}
        progress={uploadProgress}
        showCancelButton={true}
        onCancel={() => {
          if (uploadController) {
            uploadController.abort();
            setUploadController(null);
            setIsUploading(false);
            setUploadProgress(0);
            setUploadSpeed(0);
            setLastLoaded(0);
            toast({
              title: "Upload Cancelled",
              description: "The file upload was cancelled",
              variant: "default",
            });
          }
        }}
      />
    </div>
  );
};

export default SettingMain;
