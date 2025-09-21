"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { useSizeContext } from './size-provider';
import { CheckCircle, Loader2, ImageIcon, RefreshCw, AlertTriangle, RotateCcw, Clock, Shield, Wifi, Server } from 'lucide-react';
import { getAvailableWallpapers, preloadWallpaper, refreshWallpapers } from '@/utils/wallpaper';

/**
 * WallpaperSelector Component
 * Displays available wallpapers in a responsive grid with preview functionality
 */
const WallpaperSelector = ({
  selectedWallpaper,
  onWallpaperSelect,
  loading = false,
  showLocalLoading = true,
  className,
  ...props
}) => {
  const { size } = useSizeContext();
  const [wallpapers, setWallpapers] = useState([]);
  const [wallpapersLoading, setWallpapersLoading] = useState(true);
  const [wallpapersError, setWallpapersError] = useState(null);
  const [wallpapersErrorType, setWallpapersErrorType] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [operationId, setOperationId] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ step: '', progress: 0 });
  const [selectionErrors, setSelectionErrors] = useState(new Set());

  // Timeout cleanup refs
  const timeoutsRef = useRef([]);

  // Race condition prevention
  const inFlightRef = useRef(false);
  const currentOperationRef = useRef(null);

  /**
   * Load wallpapers on component mount and cleanup timeouts on unmount
   */
  useEffect(() => {
    loadWallpapers();

    // Cleanup function
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  /**
   * Load wallpapers from API with enhanced error handling
   */
  const loadWallpapers = async () => {
    // Prevent concurrent fetch operations
    if (inFlightRef.current) {
      console.log('🖼️ WallpaperSelector: Load operation already in progress, skipping');
      return;
    }

    const opId = Date.now().toString();
    setOperationId(opId);
    currentOperationRef.current = opId;
    inFlightRef.current = true;

    try {
      console.log(`🖼️ WallpaperSelector [${opId}]: Loading wallpapers at ${new Date().toISOString()}`);
      setWallpapersLoading(true);
      setWallpapersError(null);
      setWallpapersErrorType(null);
      setLoadingProgress({ step: 'Fetching wallpapers...', progress: 30 });

      const fetchedWallpapers = await getAvailableWallpapers();
      setLoadingProgress({ step: 'Processing wallpapers...', progress: 80 });

      // Check if this operation is still current
      if (currentOperationRef.current !== opId) {
        console.log(`🖼️ WallpaperSelector [${opId}]: Operation superseded, discarding results`);
        return;
      }

      console.log(`🖼️ WallpaperSelector [${opId}]: Successfully fetched ${fetchedWallpapers.length} wallpapers`);
      setWallpapers(fetchedWallpapers);

      setLoadingProgress({ step: 'Complete', progress: 100 });
      const timeoutId = setTimeout(() => setLoadingProgress({ step: '', progress: 0 }), 500);
      timeoutsRef.current.push(timeoutId);
    } catch (error) {
      console.error(`🖼️ WallpaperSelector [${opId}]: Failed to load wallpapers:`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Categorize error types for better user feedback
      const isNetwork = error?.message?.toLowerCase().includes('network') || error instanceof TypeError;
      const status = error?.status ?? error?.response?.status;

      if (isNetwork || error?.message?.toLowerCase().includes('fetch')) {
        setWallpapersError('Network connection failed. Please check your connection and try again.');
        setWallpapersErrorType('network');
      } else if (status >= 500) {
        setWallpapersError('Server error occurred. Please try again in a few moments.');
        setWallpapersErrorType('server');
      } else if (status === 401 || status === 403) {
        setWallpapersError('Access denied. Please check your permissions.');
        setWallpapersErrorType('auth');
      } else {
        setWallpapersError('Failed to load wallpapers. Please try again.');
        setWallpapersErrorType('general');
      }
    } finally {
      // Only clear loading state if this is still the current operation
      if (currentOperationRef.current === opId) {
        setWallpapersLoading(false);
        inFlightRef.current = false;
        currentOperationRef.current = null;
      }
    }
  };

  /**
   * Handle manual refresh with retry mechanism
   */
  const handleRefresh = async (retryCount = 0) => {
    // Prevent concurrent refresh operations
    if (inFlightRef.current && retryCount === 0) {
      console.log('🔄 WallpaperSelector: Refresh operation already in progress, skipping');
      return;
    }

    const opId = Date.now().toString();
    const maxRetries = 2;

    if (retryCount === 0) {
      currentOperationRef.current = opId;
      inFlightRef.current = true;
    }

    try {
      console.log(`🔄 WallpaperSelector [${opId}]: Refreshing wallpapers (attempt ${retryCount + 1}/${maxRetries + 1})`);
      setRefreshing(true);
      setLoadingProgress({ step: 'Refreshing wallpapers...', progress: 25 });

      const fetchedWallpapers = await refreshWallpapers();

      // Check if this operation is still current
      if (currentOperationRef.current !== opId && retryCount === 0) {
        console.log(`🔄 WallpaperSelector [${opId}]: Refresh operation superseded, discarding results`);
        return;
      }

      setWallpapers(fetchedWallpapers);
      setWallpapersError(null);
      setWallpapersErrorType(null);

      // Clear image errors on successful refresh
      setImageErrors(new Set());

      setLoadingProgress({ step: 'Refresh complete', progress: 100 });
      console.log(`🔄 WallpaperSelector [${opId}]: Successfully refreshed ${fetchedWallpapers.length} wallpapers`);

      const refreshTimeoutId = setTimeout(() => setLoadingProgress({ step: '', progress: 0 }), 500);
      timeoutsRef.current.push(refreshTimeoutId);
    } catch (error) {
      console.error(`🔄 WallpaperSelector [${opId}]: Refresh failed (attempt ${retryCount + 1}):`, {
        error: error.message,
        retryCount,
        timestamp: new Date().toISOString()
      });

      // Implement exponential backoff retry
      if (retryCount < maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🔄 WallpaperSelector [${opId}]: Retrying in ${backoffTime}ms`);
        const retryTimeoutId = setTimeout(() => handleRefresh(retryCount + 1), backoffTime);
        timeoutsRef.current.push(retryTimeoutId);
        return;
      }

      // Final error handling
      const isNetwork = error?.message?.toLowerCase().includes('network') || error instanceof TypeError;

      if (isNetwork || error?.message?.toLowerCase().includes('fetch')) {
        setWallpapersError('Network connection failed during refresh. Please check your connection.');
        setWallpapersErrorType('network');
      } else {
        setWallpapersError('Failed to refresh wallpapers. Please try again.');
        setWallpapersErrorType('general');
      }
    } finally {
      // Only clear refreshing state if this is still the current operation or final retry
      if (currentOperationRef.current === opId || retryCount === maxRetries) {
        setRefreshing(false);
        if (retryCount === 0 || retryCount === maxRetries) {
          inFlightRef.current = false;
          currentOperationRef.current = null;
        }
      }
    }
  };

  /**
   * Handle wallpaper selection with enhanced progress tracking
   */
  const handleWallpaperSelect = async (wallpaperId) => {
    const opId = Date.now().toString();
    const startTime = performance.now();

    console.log(`🎨 WallpaperSelector [${opId}]: Selection started at ${new Date().toISOString()}`, {
      wallpaperId,
      loading,
      selectedWallpaper,
      wallpapersCount: wallpapers.length
    });

    if (loading || wallpaperId === selectedWallpaper) {
      console.log(`🎨 WallpaperSelector [${opId}]: Early return - ${loading ? 'loading' : 'already selected'}`);
      return;
    }

    const wallpaper = wallpapers.find(w => w.id === wallpaperId);

    if (!wallpaper) {
      console.error(`🎨 WallpaperSelector [${opId}]: Wallpaper not found for ID: ${wallpaperId}`);
      return;
    }

    console.log(`🎨 WallpaperSelector [${opId}]: Starting selection process for:`, {
      id: wallpaper.id,
      name: wallpaper.name,
      url: wallpaper.url
    });

    setPreviewLoading(wallpaperId);
    setLoadingProgress({ step: 'Preloading wallpaper...', progress: 20 });

    try {
      // Preload wallpaper for smooth transition
      setLoadingProgress({ step: 'Loading image data...', progress: 50 });
      await preloadWallpaper(wallpaper.url);

      setLoadingProgress({ step: 'Applying wallpaper...', progress: 75 });
      const preloadTime = performance.now() - startTime;
      console.log(`🎨 WallpaperSelector [${opId}]: Preload completed in ${preloadTime.toFixed(2)}ms`);

      // Call parent handler
      if (onWallpaperSelect) {
        console.log(`🎨 WallpaperSelector [${opId}]: Calling parent onWallpaperSelect`);
        await onWallpaperSelect(wallpaper);

        setLoadingProgress({ step: 'Complete', progress: 100 });

        // Show success animation
        setSuccessAnimation(wallpaperId);
        const successTimeoutId = setTimeout(() => setSuccessAnimation(null), 2000);
        timeoutsRef.current.push(successTimeoutId);

        const totalTime = performance.now() - startTime;
        console.log(`🎨 WallpaperSelector [${opId}]: Selection completed successfully in ${totalTime.toFixed(2)}ms`);
      } else {
        console.warn(`🎨 WallpaperSelector [${opId}]: onWallpaperSelect callback not provided!`);
      }
    } catch (error) {
      const errorTime = performance.now() - startTime;
      console.error(`🎨 WallpaperSelector [${opId}]: Selection failed after ${errorTime.toFixed(2)}ms:`, {
        error: error.message,
        stack: error.stack,
        wallpaper: { id: wallpaper.id, name: wallpaper.name },
        timestamp: new Date().toISOString()
      });

      // Mark this wallpaper as having selection error (not image error)
      setSelectionErrors(prev => new Set(prev).add(wallpaperId));
      setLoadingProgress({ step: 'Failed', progress: 0 });
    } finally {
      setPreviewLoading(null);
      const errorTimeoutId = setTimeout(() => setLoadingProgress({ step: '', progress: 0 }), 1000);
      timeoutsRef.current.push(errorTimeoutId);
    }
  };

  /**
   * Handle image load error with detailed logging
   */
  const handleImageError = (wallpaperId, event) => {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    console.error('🖼️ WallpaperSelector: Image load error:', {
      wallpaperId,
      wallpaperName: wallpaper?.name,
      wallpaperUrl: wallpaper?.url,
      error: event?.target?.error,
      timestamp: new Date().toISOString()
    });

    setImageErrors(prev => new Set(prev).add(wallpaperId));
  };

  /**
   * Retry loading a failed image
   */
  const retryImageLoad = (wallpaperId) => {
    console.log(`🔄 WallpaperSelector: Retrying image load for ${wallpaperId}`);
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(wallpaperId);
      return newSet;
    });
  };

  /**
   * Get error icon based on error type
   */
  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return Wifi;
      case 'server':
        return Server;
      case 'auth':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 wallpaper-selector",
        className
      )}
      glass="subtle"
      elevation="2"
      {...props}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Background Wallpaper
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={wallpapersLoading || refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", (refreshing || wallpapersLoading) && "animate-spin")} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Enhanced Loading State */}
        {wallpapersLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                {loadingProgress.progress > 0 && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">
                  {loadingProgress.step || 'Loading wallpapers...'}
                </p>
                {loadingProgress.progress > 0 && (
                  <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Error State */}
        {wallpapersError && !wallpapersLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              {(() => {
                const ErrorIcon = getErrorIcon(wallpapersErrorType);
                return <ErrorIcon className="h-12 w-12 text-destructive" />;
              })()}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">{wallpapersError}</p>
                  {wallpapersErrorType === 'network' && (
                    <p className="text-xs text-muted-foreground">
                      Check your internet connection and firewall settings.
                    </p>
                  )}
                  {wallpapersErrorType === 'server' && (
                    <p className="text-xs text-muted-foreground">
                      The server is temporarily unavailable. Please wait a moment.
                    </p>
                  )}
                  {wallpapersErrorType === 'auth' && (
                    <p className="text-xs text-muted-foreground">
                      You may need to log in again or contact your administrator.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefresh(0)}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </>
                    )}
                  </Button>
                  {wallpapersErrorType === 'network' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reload Page
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!wallpapersLoading && !wallpapersError && wallpapers.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No wallpapers found</p>
              <p className="text-xs text-muted-foreground">Add image files to the wallpapers directory</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          </div>
        )}

        {/* Wallpapers Grid */}
        {!wallpapersLoading && !wallpapersError && wallpapers.length > 0 && (
          <RadioGroup
            value={selectedWallpaper}
            onValueChange={handleWallpaperSelect}
            disabled={loading}
            className="space-y-4"
          >
          <div className={cn(
            "grid gap-4 relative z-30",
            size === 'sm' ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
          )}>
            {wallpapers.map((wallpaper) => {
              const isSelected = selectedWallpaper === wallpaper.id;
              const isLoading = previewLoading === wallpaper.id;
              const hasImageError = imageErrors.has(wallpaper.id);
              const hasSelectionError = selectionErrors.has(wallpaper.id);

              return (
                <Label
                  key={wallpaper.id}
                  htmlFor={wallpaper.id}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer z-[1] block",
                    "hover:z-10 hover:scale-[1.02] hover:shadow-xl",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                    "transform-gpu", // Enable GPU acceleration
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/20 z-[5] ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5",
                    loading && "opacity-50 cursor-not-allowed",
                    successAnimation === wallpaper.id && "animate-pulse ring-2 ring-green-500"
                  )}
                >
                  {/* Hidden RadioGroupItem for functionality */}
                  <RadioGroupItem
                    value={wallpaper.id}
                    id={wallpaper.id}
                    disabled={loading}
                    className="sr-only"
                  />

                  {/* Wallpaper Preview */}
                  <div className="relative aspect-video bg-muted">
                    {!hasImageError ? (
                      <>
                        <img
                          src={wallpaper.url}
                          alt={wallpaper.name}
                          className={cn(
                            "h-full w-full object-cover transition-all duration-300",
                            "group-hover:scale-105 transform-gpu"
                          )}
                          onError={(e) => handleImageError(wallpaper.id, e)}
                          loading="lazy"
                        />
                        {/* Hover overlay with wallpaper info */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-center p-2">
                            <p className="text-sm font-medium">{wallpaper.name}</p>
                            {wallpaper.description && (
                              <p className="text-xs opacity-80 mt-1">{wallpaper.description}</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <div className="text-center space-y-2">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              retryImageLoad(wallpaper.id);
                            }}
                            className="h-6 text-xs"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Loading Overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <div className="text-xs text-muted-foreground text-center">
                            {loadingProgress.step && (
                              <div className="space-y-1">
                                <p>{loadingProgress.step}</p>
                                {loadingProgress.progress > 0 && (
                                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary transition-all duration-300"
                                      style={{ width: `${loadingProgress.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-30">
                        <div className={cn(
                          "relative transition-all duration-300",
                          successAnimation === wallpaper.id && "animate-bounce"
                        )}>
                          <CheckCircle className="h-6 w-6 text-primary bg-background rounded-full shadow-lg" />
                          {successAnimation === wallpaper.id && (
                            <div className="absolute inset-0 h-6 w-6 rounded-full bg-green-500/20 animate-ping" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Success Animation Overlay */}
                    {successAnimation === wallpaper.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm z-25">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">Applied!</span>
                        </div>
                      </div>
                    )}

                    {/* Selection Error Badge */}
                    {hasSelectionError && (
                      <div className="absolute top-2 left-2 z-25">
                        <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-md">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Apply Failed</span>
                        </div>
                      </div>
                    )}

                    {/* Default Badge */}
                    {wallpaper.isDefault && !hasSelectionError && (
                      <div className="absolute top-2 left-2 z-25">
                        <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
                          Default
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Wallpaper Info */}
                  <div className="p-3 bg-background/90 backdrop-blur-sm">
                    <div className="font-medium text-sm">{wallpaper.name}</div>
                    {wallpaper.description && (
                      <div className="text-xs text-muted-foreground">
                        {wallpaper.description}
                      </div>
                    )}
                  </div>
                </Label>
              );
            })}
          </div>
          </RadioGroup>
        )}

        {/* Enhanced Loading State During Application */}
        {loading && showLocalLoading && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Applying wallpaper...</span>
            </div>
            {loadingProgress.step && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">{loadingProgress.step}</p>
                {loadingProgress.progress > 0 && (
                  <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress.progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
              <Clock className="h-3 w-3" />
              <span>This may take a few seconds...</span>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!wallpapersLoading && !wallpapersError && wallpapers.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            Select a wallpaper to change your background. Changes are applied immediately.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { WallpaperSelector };