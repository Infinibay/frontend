"use client";

import React, { useState } from "react";
import Box2 from "./Box2";
import Box1 from "./Box1";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const osOptions = [
    { 
      value: "windows10", 
      label: "Windows 10",
      downloadUrl: "https://www.microsoft.com/es-es/software-download/windows10ISO"
    },
    { 
      value: "windows11", 
      label: "Windows 11",
      downloadUrl: "https://www.microsoft.com/es-es/software-download/windows11"
    },
    { 
      value: "ubuntu", 
      label: "Ubuntu",
      downloadUrl: "https://ubuntu.com/download/desktop"
    },
    { 
      value: "fedora", 
      label: "Fedora",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.iso')) {
      setIsoFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid ISO file",
        variant: "destructive",
      });
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

    const MAX_FILE_SIZE = 100 * 1024 * 1024 * 1024; // 100GB
    if (isoFile.size > MAX_FILE_SIZE) {
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
      const formData = new FormData();
      formData.append('file', isoFile);
      formData.append('os', selectedOS);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/isoUpload`, formData, {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          'Content-Type': 'multipart/form-data',
        },
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

  const getUploadButtonTooltip = () => {
    if (!isoFile && !selectedOS) return "Please select an OS and ISO file";
    if (!isoFile) return "Please select an ISO file";
    if (!selectedOS) return "Please select an operating system";
    return "";
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mx-auto lg:p-5 pt-5 !w-[95%]">
        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-bold mb-4">ISO Management</h2>
          
          <div className="mb-6 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Where to download ISO files</h3>
            <div className="space-y-2">
              {osOptions.map((os) => (
                <div key={os.value} className="flex items-center justify-between">
                  <span className="font-medium">{os.label}:</span>
                  <a 
                    href={os.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Download Link
                  </a>
                </div>
              ))}
            </div>
          </div>

          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Operating System</label>
              <Select value={selectedOS} onValueChange={setSelectedOS}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an operating system" />
                </SelectTrigger>
                <SelectContent>
                  {osOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ISO File</label>
              <Input
                type="file"
                accept=".iso"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedOS || !isoFile || isUploading}
                      className="w-full"
                      variant={!selectedOS || !isoFile ? "secondary" : "default"}
                    >
                      {isUploading ? `Uploading ${uploadProgress}%` : "Upload ISO"}
                    </Button>
                  </div>
                </TooltipTrigger>
                {(!selectedOS || !isoFile) && (
                  <TooltipContent>
                    <p>{getUploadButtonTooltip()}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </Form>
        </Card>
      </div>
      {/* Add Progress Dialog */}
      <Dialog open={isUploading} onOpenChange={(open) => !open && setIsUploading(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Uploading ISO File</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Progress value={uploadProgress} className="w-full" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between items-center font-mono">
                <span>{formatSize(lastLoaded)}/{formatSize(isoFile?.size || 0)}</span>
                <span>{uploadSpeed > 0 ? `${formatSize(uploadSpeed)}/s` : 'Calculating...'}</span>
              </div>
              <p className="text-center text-xs">{uploadProgress}% Complete</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingMain;
