"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { UploadProgress } from "@/components/ui/upload-progress";
import { WallpaperSelector } from "@/components/ui/wallpaper-selector";
import { LogoUpload } from "@/components/ui/logo-upload";
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { Upload, Download, CheckCircle, AlertCircle, Sun, Moon, Monitor, Loader2, Minimize2, Square, Maximize2, Expand, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGlassClasses } from "@/utils/glass-effects";
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { getSystemTheme } from '@/utils/theme';
import { applyWallpaperWithTransition, getAvailableWallpapers } from '@/utils/wallpaper';
import { useSizeContext, sizeVariants, getTypographyClass, getLayoutSpacing, getGridClasses } from '@/components/ui/size-provider';
import {
  fetchAppSettings,
  updateAppSettings,
  selectAppSettings,
  selectAppSettingsLoading,
  selectAppSettingsError,
  selectAppSettingsInitialized,
  selectInterfaceSize,
  setThemePreference,
  setSizePreference
} from '@/state/slices/appSettings';
import axios from "axios";

const SettingMain = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { size } = useSizeContext();

  // App Settings Redux state
  const appSettings = useSelector(selectAppSettings);
  const appSettingsLoading = useSelector(selectAppSettingsLoading);
  const appSettingsError = useSelector(selectAppSettingsError);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  const interfaceSize = useSelector(selectInterfaceSize);

  // Theme provider integration
  const themeContext = useAppTheme();
  const theme = themeContext?.theme || 'system';
  const setTheme = useMemo(() => themeContext?.setTheme || (() => { }), [themeContext?.setTheme]);
  const resolvedTheme = themeContext?.resolvedTheme || 'light';

  // ISO management state
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

  // Track last applied wallpaper to prevent unnecessary re-applications
  const lastAppliedWallpaperRef = useRef({ wallpaperId: null, resolvedTheme: null });

  // Track last attempted wallpaper for retries
  const lastAttemptedWallpaperRef = useRef(null);

  // Wallpaper and logo state
  const [wallpaperLoading, setWallpaperLoading] = useState(false);
  const [wallpaperStatus, setWallpaperStatus] = useState({ step: '', progress: 0 });
  const [wallpaperError, setWallpaperError] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // Use the same hook as the wizard to check ISO availability
  const { isOSAvailable, checkStatus } = useSystemStatus({ checkOnMount: true });

  // Initialize app settings on component mount
  useEffect(() => {
    if (!appSettingsInitialized) {
      dispatch(fetchAppSettings());
    }
  }, [dispatch, appSettingsInitialized]);

  // Apply backend theme to ThemeProvider after settings fetch
  useEffect(() => {
    if (appSettingsInitialized && appSettings.theme && appSettings.theme !== theme && !appSettingsLoading?.fetch) {
      // Use setTimeout to defer the setState call to avoid setState during render
      const timer = setTimeout(() => {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Settings theme sync:', {
              appSettingsTheme: appSettings.theme,
              currentTheme: theme,
              appSettingsInitialized,
              isLoading: appSettingsLoading?.fetch
            });
          }
          setTheme(appSettings.theme);
        } catch (error) {
          console.error('Error setting theme:', error);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [appSettingsInitialized, appSettings.theme, theme, setTheme, appSettingsLoading?.fetch]);

  // Apply persisted wallpaper on load and cache wallpapers
  useEffect(() => {
    if (appSettingsInitialized && !appSettingsLoading?.fetch) {
      // Use setTimeout to defer async operations and prevent state updates during render
      const timer = setTimeout(() => {
        const applyWallpaper = async () => {
          try {
            const wallpapers = await getAvailableWallpapers();
            // Wallpapers fetched successfully

            // Check if current wallpaper exists in available wallpapers
            let wallpaperToApply = null;

            if (appSettings.wallpaper) {
              wallpaperToApply = wallpapers.find(w => w.id === appSettings.wallpaper);
            }

            // If no wallpaper is set or current wallpaper not found, use first available
            if (!wallpaperToApply && wallpapers.length > 0) {
              wallpaperToApply = wallpapers[0];
              // Update app settings to reflect the fallback selection
              try {
                await dispatch(updateAppSettings({ wallpaper: wallpaperToApply.id })).unwrap();
              } catch (error) {
                console.error('Error updating fallback wallpaper setting:', error);
              }
            }

            if (wallpaperToApply) {
              // Check if we need to apply wallpaper (compare with last applied state)
              const lastApplied = lastAppliedWallpaperRef.current;
              if (lastApplied.wallpaperId === wallpaperToApply.id && lastApplied.resolvedTheme === resolvedTheme) {
                return; // Skip re-application if nothing changed
              }

              await applyWallpaperWithTransition(wallpaperToApply.url, resolvedTheme);
              // Update ref after successful application
              lastAppliedWallpaperRef.current = {
                wallpaperId: wallpaperToApply.id,
                resolvedTheme: resolvedTheme
              };
            }
          } catch (error) {
            console.error('Error applying wallpaper:', error);
          }
        };

        applyWallpaper();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [appSettingsInitialized, appSettings.wallpaper, resolvedTheme, appSettingsLoading?.fetch, dispatch]);

  // Handle theme changes
  const handleThemeChange = async (newTheme) => {
    // Capture previous theme before optimistic update
    const prevTheme = theme;
    const prevAppSettingsTheme = appSettings.theme;

    try {
      // Optimistic update for immediate UI response
      dispatch(setThemePreference(newTheme));
      setTheme(newTheme);

      // Update backend settings
      await dispatch(updateAppSettings({ theme: newTheme })).unwrap();

      toast({
        title: "Theme Updated",
        description: `Theme changed to ${newTheme}`,
        variant: "success",
      });
    } catch (error) {
      // Revert optimistic update on error using captured previous state
      dispatch(setThemePreference(prevAppSettingsTheme));
      setTheme(prevTheme);

      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle interface size changes
  const handleSizeChange = async (newSize) => {
    // Capture previous size before optimistic update
    const prevAppSettingsSize = appSettings.interfaceSize;

    try {
      // Optimistic update for immediate UI response
      dispatch(setSizePreference(newSize));

      // Update backend settings
      await dispatch(updateAppSettings({ interfaceSize: newSize })).unwrap();

      toast({
        title: "Interface Size Updated",
        description: `Interface size changed to ${newSize === 'sm' ? 'compact' : newSize === 'md' ? 'standard' : newSize === 'lg' ? 'comfortable' : 'spacious'}`,
        variant: "success",
      });
    } catch (error) {
      // Revert optimistic update on error using captured previous state
      dispatch(setSizePreference(prevAppSettingsSize));

      toast({
        title: "Error",
        description: "Failed to update interface size. Please try again.",
        variant: "destructive",
      });
    }
  };


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

  // Enhanced wallpaper handlers with retry mechanism
  const handleWallpaperSelect = async (wallpaper, retryCount = 0) => {
    const opId = Date.now().toString();
    const maxRetries = 2;
    const startTime = performance.now();

    // Track last attempted wallpaper for retries
    lastAttemptedWallpaperRef.current = wallpaper;

    console.log(`🎨 SettingMain [${opId}]: handleWallpaperSelect started at ${new Date().toISOString()}`, {
      wallpaper: { id: wallpaper?.id, name: wallpaper?.name },
      resolvedTheme,
      retryCount,
      timestamp: new Date().toISOString()
    });

    if (!wallpaper) {
      console.error(`🎨 SettingMain [${opId}]: No wallpaper provided`);
      setWallpaperError('Invalid wallpaper selection');
      return;
    }

    setWallpaperLoading(true);
    setWallpaperError(null);
    setWallpaperStatus({ step: 'Preparing wallpaper...', progress: 10 });

    try {
      console.log(`🎨 SettingMain [${opId}]: Starting wallpaper application process`);

      setWallpaperStatus({ step: 'Applying wallpaper transition...', progress: 30 });

      // Apply wallpaper with transition
      const result = await applyWallpaperWithTransition(wallpaper.url, resolvedTheme);
      console.log(`🎨 SettingMain [${opId}]: Apply wallpaper result:`, result);

      if (result.success) {
        setWallpaperStatus({ step: 'Saving preferences...', progress: 70 });

        console.log(`🎨 SettingMain [${opId}]: Updating app settings with wallpaper ID: ${wallpaper.id}`);

        // Update app settings with timeout
        const updatePromise = dispatch(updateAppSettings({ wallpaper: wallpaper.id })).unwrap();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Settings update timeout')), 10000)
        );

        await Promise.race([updatePromise, timeoutPromise]);

        // Update ref after successful application
        lastAppliedWallpaperRef.current = {
          wallpaperId: wallpaper.id,
          resolvedTheme: resolvedTheme
        };

        setWallpaperStatus({ step: 'Complete', progress: 100 });

        const totalTime = performance.now() - startTime;
        console.log(`🎨 SettingMain [${opId}]: Wallpaper update completed successfully in ${totalTime.toFixed(2)}ms`);

        toast({
          title: "Wallpaper Updated",
          description: `Successfully changed to ${wallpaper.name}`,
          variant: "success",
          duration: 3000,
        });

        // Clear status after success animation and clear last attempted
        setTimeout(() => {
          setWallpaperStatus({ step: '', progress: 0 });
          lastAttemptedWallpaperRef.current = null; // Clear on success
        }, 1500);
      } else {
        console.error(`🎨 SettingMain [${opId}]: Apply wallpaper failed:`, result.message);
        throw new Error(result.message || 'Failed to apply wallpaper');
      }
    } catch (error) {
      const errorTime = performance.now() - startTime;
      console.error(`🎨 SettingMain [${opId}]: Wallpaper selection failed after ${errorTime.toFixed(2)}ms:`, {
        error: error.message,
        stack: error.stack,
        retryCount,
        wallpaper: { id: wallpaper?.id, name: wallpaper?.name },
        timestamp: new Date().toISOString()
      });

      // Implement retry logic with exponential backoff
      if (retryCount < maxRetries && !error.message.includes('timeout')) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🎨 SettingMain [${opId}]: Retrying in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);

        setWallpaperStatus({ step: `Retrying in ${backoffTime / 1000}s...`, progress: 0 });

        setTimeout(() => {
          handleWallpaperSelect(wallpaper, retryCount + 1);
        }, backoffTime);
        return;
      }

      // Categorize and handle different error types
      let errorMessage = 'Failed to update wallpaper';
      let errorType = 'general';

      const isNetwork = error?.message?.toLowerCase().includes('network') || error instanceof TypeError;
      const status = error?.status ?? error?.response?.status;

      if (error.message.includes('timeout') || isNetwork) {
        errorMessage = 'Network connection failed. Please check your connection and try again.';
        errorType = 'network';
      } else if (error.message.includes('permission') || error.message.includes('auth')) {
        errorMessage = 'Permission denied. Please check your access rights.';
        errorType = 'permission';
      } else if (error.message.includes('format') || error.message.includes('invalid')) {
        errorMessage = 'Invalid wallpaper format. Please select a different image.';
        errorType = 'validation';
      } else if (status >= 500) {
        errorMessage = 'Server error occurred. Please try again in a few moments.';
        errorType = 'server';
      }

      setWallpaperError({ message: errorMessage, type: errorType });
      setWallpaperStatus({ step: 'Failed', progress: 0 });

      toast({
        title: "Wallpaper Update Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
        action: errorType === 'network' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWallpaperSelect(wallpaper, 0)}
          >
            Retry
          </Button>
        ) : undefined,
      });
    } finally {
      setWallpaperLoading(false);
      // Clear status after error display
      setTimeout(() => {
        if (wallpaperStatus.step === 'Failed') {
          setWallpaperStatus({ step: '', progress: 0 });
        }
      }, 3000);
    }
  };

  // Logo handlers
  const handleLogoUpload = async (logoUrl) => {
    if (!logoUrl) return;

    setLogoLoading(true);

    try {
      // Update app settings with new logo URL
      await dispatch(updateAppSettings({ logoUrl })).unwrap();

      toast({
        title: "Logo Updated",
        description: "Company logo has been updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to update logo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update logo",
        variant: "destructive",
      });
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogoReset = async () => {
    setLogoLoading(true);

    try {
      // Reset logo URL to default
      await dispatch(updateAppSettings({ logoUrl: '/images/logo.png' })).unwrap();

      toast({
        title: "Logo Reset",
        description: "Logo has been reset to default",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to reset logo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset logo",
        variant: "destructive",
      });
    } finally {
      setLogoLoading(false);
    }
  };

  // Show loading spinner while settings are being initialized
  if (!appSettingsInitialized && appSettingsLoading?.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeVariants[size].icon.button} animate-spin`} />
          <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show fallback UI if theme context is not available
  if (!themeContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className={`${sizeVariants[size].icon.button} text-destructive`} />
          <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>Theme system not available. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Show error UI if settings fetch failed
  if (appSettingsError?.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <AlertCircle className={`${sizeVariants[size].thumbnail} text-destructive`} />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Failed to Load Settings</h2>
            <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
              {appSettingsError?.fetch}
            </p>
          </div>
          <Button
            onClick={() => dispatch(fetchAppSettings())}
            disabled={appSettingsLoading?.fetch}
            className="mt-4"
          >
            {appSettingsLoading?.fetch ? (
              <>
                <Loader2 className={`${sizeVariants[size].icon.size} animate-spin mr-2`} />
                Retrying...
              </>
            ) : (
              'Retry'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen settings-container">
      <div className={`container ${sizeVariants[size].layout.maxWidth} mx-auto ${sizeVariants[size].layout.container} pt-6 space-y-8`}>

        {/* Theme Settings Section */}
        <Card className={`${sizeVariants[size].card.padding} relative z-20`}>
          <div className={sizeVariants[size].layout.section}>
            <div>
              <h2 className={`subheading ${getTypographyClass('subheading', size)} ${sizeVariants[size].layout.sectionSpacing}`}>Theme Settings</h2>
              <p className={`${sizeVariants[size].typography.text} text-muted-foreground`}>
                Customize the appearance of the interface. Your theme preference will be saved and applied across all sessions.
              </p>
            </div>

            {appSettingsLoading?.fetch ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={`${sizeVariants[size].icon.nav} animate-spin`} />
                <span className={`ml-2 ${sizeVariants[size].typography.small} text-muted-foreground`}>Loading theme settings...</span>
              </div>
            ) : (
              <div className={sizeVariants[size].layout.section}>
                <Label className={`${sizeVariants[size].typography.text} font-medium`}>Choose Theme</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={handleThemeChange}
                  className={getGridClasses('themeOptions', size)}
                  disabled={appSettingsLoading?.update}
                >
                  {/* Light Theme Option */}
                  <div className={`flex items-center ${sizeVariants[size].spacing.spaceX}`}>
                    <RadioGroupItem value="light" id="light" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="light" className={`flex items-center ${sizeVariants[size].spacing.spaceX} cursor-pointer`}>
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-muted rounded-lg border-2 border`}>
                        <Sun className={`${sizeVariants[size].icon.size} text-accent`} />
                      </div>
                      <div>
                        <div className="font-medium">Light</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Clean and bright interface
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Dark Theme Option */}
                  <div className={`flex items-center ${sizeVariants[size].spacing.spaceX}`}>
                    <RadioGroupItem value="dark" id="dark" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="dark" className={`flex items-center ${sizeVariants[size].spacing.spaceX} cursor-pointer`}>
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-card rounded-lg border-2 border`}>
                        <Moon className={`${sizeVariants[size].icon.size} text-muted-foreground`} />
                      </div>
                      <div>
                        <div className="font-medium">Dark</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Easier on the eyes in low light
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* System Theme Option */}
                  <div className={`flex items-center ${sizeVariants[size].spacing.spaceX}`}>
                    <RadioGroupItem value="system" id="system" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="system" className={`flex items-center ${sizeVariants[size].spacing.spaceX} cursor-pointer`}>
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-gradient-to-br from-muted to-card rounded-lg border-2 border`}>
                        <Monitor className={`${sizeVariants[size].icon.size} text-muted-foreground`} />
                      </div>
                      <div>
                        <div className="font-medium">System</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Match your system preference ({theme === 'system' ? resolvedTheme : getSystemTheme()})
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Loading indicator for theme updates */}
                {appSettingsLoading?.update && (
                  <div className={`flex items-center ${sizeVariants[size].typography.small} text-muted-foreground`}>
                    <Loader2 className={`${sizeVariants[size].icon.size} animate-spin mr-2`} />
                    Updating theme preferences...
                  </div>
                )}

                {/* Error display */}
                {appSettingsError?.update && (
                  <div className={`flex items-center ${sizeVariants[size].typography.small} text-destructive`}>
                    <AlertCircle className={`${sizeVariants[size].icon.size} mr-2`} />
                    {appSettingsError?.update}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Interface Size Settings Section */}
        <Card className={`${sizeVariants[size].card.padding} relative z-20`}>
          <div className={sizeVariants[size].layout.section}>
            <div>
              <h2 className={`subheading ${getTypographyClass('subheading', size)} ${sizeVariants[size].layout.sectionSpacing}`}>Interface Size</h2>
              <p className={`${sizeVariants[size].typography.text} text-muted-foreground`}>
                Adjust the size of interface elements. Your size preference will be applied to all components across the application.
              </p>
            </div>

            {appSettingsLoading?.fetch ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={`${sizeVariants[size].icon.nav} animate-spin`} />
                <span className={`ml-2 ${sizeVariants[size].typography.small} text-muted-foreground`}>Loading size settings...</span>
              </div>
            ) : (
              <div className={sizeVariants[size].layout.section}>
                <Label className={`${sizeVariants[size].typography.text} font-medium`}>Choose Interface Size</Label>
                <RadioGroup
                  value={interfaceSize}
                  onValueChange={handleSizeChange}
                  className={getGridClasses('sizeOptions', size)}
                  disabled={appSettingsLoading?.update}
                >
                  {/* Small Size Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="sm" id="sm" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="sm" className="flex items-center space-x-3 cursor-pointer">
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-muted rounded-lg border-2 border`}>
                        <Minimize2 className={`${sizeVariants[size].icon.size} text-primary`} />
                      </div>
                      <div>
                        <div className="font-medium">Compact</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Smaller interface elements
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Medium Size Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="md" id="md" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="md" className="flex items-center space-x-3 cursor-pointer">
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-muted rounded-lg border-2 border`}>
                        <Square className={`${sizeVariants[size].icon.size} text-accent`} />
                      </div>
                      <div>
                        <div className="font-medium">Standard</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Default interface size
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Large Size Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="lg" id="lg" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="lg" className="flex items-center space-x-3 cursor-pointer">
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-muted rounded-lg border-2 border`}>
                        <Maximize2 className={`${sizeVariants[size].icon.size} text-secondary`} />
                      </div>
                      <div>
                        <div className="font-medium">Comfortable</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Larger interface elements
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Extra Large Size Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="xl" id="xl" disabled={appSettingsLoading?.update} />
                    <Label htmlFor="xl" className="flex items-center space-x-3 cursor-pointer">
                      <div className={`flex items-center justify-center ${sizeVariants[size].thumbnail} bg-muted rounded-lg border-2 border`}>
                        <Expand className={`${sizeVariants[size].icon.size} text-primary`} />
                      </div>
                      <div>
                        <div className="font-medium">Spacious</div>
                        <div className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          Extra large interface
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Loading indicator for size updates */}
                {appSettingsLoading?.update && (
                  <div className={`flex items-center ${sizeVariants[size].typography.small} text-muted-foreground`}>
                    <Loader2 className={`${sizeVariants[size].icon.size} animate-spin mr-2`} />
                    Updating interface size preferences...
                  </div>
                )}

                {/* Error display */}
                {appSettingsError?.update && (
                  <div className={`flex items-center ${sizeVariants[size].typography.small} text-destructive`}>
                    <AlertCircle className={`${sizeVariants[size].icon.size} mr-2`} />
                    {appSettingsError?.update}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Enhanced Wallpaper Settings Section */}
        <div className="relative">
          <WallpaperSelector
            selectedWallpaper={appSettings.wallpaper}
            onWallpaperSelect={handleWallpaperSelect}
            loading={wallpaperLoading}
            showLocalLoading={false}
            className="w-full"
            size={size}
          />

          {/* Loading Overlay for Wallpaper Section */}
          {wallpaperLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg z-40 flex items-center justify-center">
              <div className="bg-background border rounded-lg p-6 shadow-lg max-w-sm w-full mx-4">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className={`${sizeVariants[size].icon.button} animate-spin text-primary`} />
                  <div className="text-center space-y-2">
                    <h3 className="font-medium">Applying Wallpaper</h3>
                    <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                      {wallpaperStatus.step || 'Please wait...'}
                    </p>
                    {wallpaperStatus.progress > 0 && (
                      <div className="w-full">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${wallpaperStatus.progress}%` }}
                          />
                        </div>
                        <p className={`${sizeVariants[size].typography.xsmall} text-muted-foreground mt-1`}>
                          {wallpaperStatus.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 ${sizeVariants[size].typography.xsmall} text-muted-foreground`}>
                    <Clock className={sizeVariants[size].icon.size} />
                    <span>This may take a moment...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display for Wallpaper */}
          {wallpaperError && (
            <div className="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className={`${sizeVariants[size].icon.size} text-destructive flex-shrink-0 mt-0.5`} />
                <div className="flex-1 space-y-2">
                  <p className={`${sizeVariants[size].typography.small} font-medium text-destructive`}>
                    Wallpaper Update Failed
                  </p>
                  <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                    {wallpaperError.message}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWallpaperError(null);
                        // Retry with the last attempted wallpaper
                        const lastWallpaper = lastAttemptedWallpaperRef.current;
                        if (lastWallpaper) {
                          handleWallpaperSelect(lastWallpaper, 0);
                        }
                      }}
                      disabled={wallpaperLoading}
                    >
                      <RefreshCw className={`${sizeVariants[size].icon.size} mr-2`} />
                      Retry
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWallpaperError(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo Upload Section */}
        <LogoUpload
          currentLogoUrl={appSettings.logoUrl || '/images/logo.png'}
          onLogoUpload={handleLogoUpload}
          onLogoReset={handleLogoReset}
          loading={logoLoading}
          className="w-full"
          size={size}
        />

        {/* ISO Management Section */}
        <Card className={`${sizeVariants[size].card.padding} relative z-20`}>
          <div className={sizeVariants[size].layout.section}>
            <div>
              <h2 className={`subheading ${getTypographyClass('subheading', size)} ${sizeVariants[size].layout.sectionSpacing}`}>ISO Management</h2>
              <p className={`${sizeVariants[size].typography.text} text-muted-foreground`}>
                Upload ISO files for different operating systems. You can drag and drop files directly onto the OS cards.
              </p>
            </div>

            {/* OS Selection Grid */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 ${sizeVariants[size].layout.cardGrid}`}>
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
                      'hover:scale-105 hover:shadow-xl hover:z-30',
                      isSelected && 'shadow-lg shadow-primary/25 bg-card border-primary z-25',
                      isDraggedOver && 'scale-105 shadow-2xl border-primary border-2 z-35',
                      hasISO && 'bg-card border-accent/30',
                      'hover:border-primary/50'
                    )}
                    onClick={() => handleCardClick(os.value)}
                    onDragOver={(e) => handleDragOver(e, os.value)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, os.value)}
                  >
                    <div className={sizeVariants[size].card.padding}>
                      {/* Status Badge */}
                      {hasISO && (
                        <div className={`absolute top-2 right-2 flex items-center ${sizeVariants[size].gap} z-30`}>
                          <CheckCircle className={`${sizeVariants[size].icon.size} text-accent`} />
                          <span className={`${sizeVariants[size].badge.text} font-medium text-accent`}>ISO Ready</span>
                        </div>
                      )}

                      <div className={`aspect-square flex items-center justify-center ${sizeVariants[size].layout.sectionSpacing}`}>
                        <Icon
                          className={`${sizeVariants[size].icon.hero} transition-transform duration-300`}
                          style={{ color: os.color }}
                        />
                      </div>

                      <div className={`text-center ${sizeVariants[size].layout.section}`}>
                        <h3 className={`font-semibold ${getTypographyClass('heading2', size)}`}>{os.label}</h3>
                        <p className={`${sizeVariants[size].badge.text} text-muted-foreground`}>
                          {hasISO ? 'ISO uploaded - Click to replace' : os.description}
                        </p>

                        {/* Drop zone indicator */}
                        {isDraggedOver && (
                          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center z-40">
                            <Upload className={`${sizeVariants[size].thumbnail} text-primary animate-pulse`} />
                          </div>
                        )}

                        <div className="pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${sizeVariants[size].height} ${sizeVariants[size].typography.xsmall}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(os.downloadUrl, '_blank');
                            }}
                          >
                            <Download className={`${sizeVariants[size].icon.size} mr-1`} />
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
              <div className={`bg-card rounded-lg border ${sizeVariants[size].card.padding} ${sizeVariants[size].layout.section}`}>
                <div className="flex items-center justify-between">
                  <div className={sizeVariants[size].layout.section}>
                    <p className={`${sizeVariants[size].typography.text} font-medium`}>
                      {selectedOS && `Selected OS: ${osOptions.find(os => os.value === selectedOS)?.label}`}
                    </p>
                    <p className={`${sizeVariants[size].typography.text} text-muted-foreground`}>
                      {isoFile && `File: ${isoFile.name} (${formatSize(isoFile.size)})`}
                    </p>
                    {selectedOS && isOSAvailable(osOptions.find(os => os.value === selectedOS)?.id) && (
                      <div className={`flex items-center ${sizeVariants[size].gap} text-destructive`}>
                        <AlertCircle className={sizeVariants[size].icon.size} />
                        <p className={`${sizeVariants[size].badge.text} font-medium`}>
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
            <div className={`text-center ${sizeVariants[size].typography.text} text-muted-foreground`}>
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
