"use client";

import React, { useState, useEffect, useRef } from 'react';
// Card component removed - using transparent div wrapper instead
import { Button } from './button';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { useSizeContext } from './size-provider';
import { CheckCircle, Loader2, User, RefreshCw, AlertTriangle, RotateCcw, Clock } from 'lucide-react';
import { getAvailableAvatars, getAvatarUrl, getAvatarDisplayName, DEFAULT_AVATAR_CANONICAL, DEFAULT_AVATAR_URL } from '@/utils/avatar';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:avatar-selector');

/**
 * AvatarSelector Component
 * Displays available avatars in a responsive grid with selection functionality
 */
const AvatarSelector = ({
  selectedAvatar,
  onAvatarSelect,
  loading = false,
  showLocalLoading = true,
  className,
  glass = "subtle",
  glow = "none",
  elevation = "2",
  ...props
}) => {
  const { size } = useSizeContext();
  const [avatars, setAvatars] = useState([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const [avatarsError, setAvatarsError] = useState(null);
  const [avatarsErrorType, setAvatarsErrorType] = useState(null);
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
   * Load avatars on component mount and cleanup timeouts on unmount
   */
  useEffect(() => {
    loadAvatars();

    // Cleanup function
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  /**
   * Load avatars from API with enhanced error handling
   */
  const loadAvatars = async () => {
    // Prevent concurrent fetch operations
    if (inFlightRef.current) {
      debug.warn('load', 'Load operation already in progress, skipping');
      return;
    }

    const opId = Date.now().toString();
    setOperationId(opId);
    currentOperationRef.current = opId;
    inFlightRef.current = true;

    try {
      debug.log('load', `Loading avatars [${opId}] at ${new Date().toISOString()}`);
      setAvatarsLoading(true);
      setAvatarsError(null);
      setAvatarsErrorType(null);
      setLoadingProgress({ step: 'Fetching avatars...', progress: 30 });

      const fetchedAvatars = await getAvailableAvatars();
      setLoadingProgress({ step: 'Processing avatars...', progress: 80 });

      // Check if this operation is still current
      if (currentOperationRef.current !== opId) {
        debug.warn('load', `Operation superseded [${opId}], discarding results`);
        return;
      }

      debug.success('load', `Successfully fetched ${fetchedAvatars.length} avatars [${opId}]`);
      setAvatars(fetchedAvatars);

      setLoadingProgress({ step: 'Complete', progress: 100 });
      const timeoutId = setTimeout(() => setLoadingProgress({ step: '', progress: 0 }), 500);
      timeoutsRef.current.push(timeoutId);
    } catch (error) {
      debug.error('load', `Failed to load avatars [${opId}]:`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Categorize error types for better user feedback
      const isNetwork = error?.message?.toLowerCase().includes('network') || error instanceof TypeError;
      const status = error?.status ?? error?.response?.status;

      if (isNetwork || error?.message?.toLowerCase().includes('fetch')) {
        setAvatarsError('Network connection failed. Please check your connection and try again.');
        setAvatarsErrorType('network');
      } else if (status >= 500) {
        setAvatarsError('Server error occurred. Please try again in a few moments.');
        setAvatarsErrorType('server');
      } else if (status === 401 || status === 403) {
        setAvatarsError('Access denied. Please check your permissions.');
        setAvatarsErrorType('auth');
      } else {
        setAvatarsError('Failed to load avatars. Please try again.');
        setAvatarsErrorType('general');
      }
    } finally {
      // Only clear loading state if this is still the current operation
      if (currentOperationRef.current === opId) {
        setAvatarsLoading(false);
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
      debug.warn('refresh', 'Refresh operation already in progress, skipping');
      return;
    }

    const opId = Date.now().toString();
    const maxRetries = 2;

    if (retryCount === 0) {
      currentOperationRef.current = opId;
      inFlightRef.current = true;
    }

    try {
      debug.log('refresh', `Refreshing avatars [${opId}] (attempt ${retryCount + 1}/${maxRetries + 1})`);
      setRefreshing(true);
      setLoadingProgress({ step: 'Refreshing avatars...', progress: 25 });

      const fetchedAvatars = await getAvailableAvatars();

      // Check if this operation is still current
      if (currentOperationRef.current !== opId && retryCount === 0) {
        debug.warn('refresh', `Refresh operation superseded [${opId}], discarding results`);
        return;
      }

      setAvatars(fetchedAvatars);
      setAvatarsError(null);
      setAvatarsErrorType(null);

      // Clear image errors on successful refresh
      setImageErrors(new Set());

      setLoadingProgress({ step: 'Refresh complete', progress: 100 });
      debug.success('refresh', `Successfully refreshed ${fetchedAvatars.length} avatars [${opId}]`);

      const refreshTimeoutId = setTimeout(() => setLoadingProgress({ step: '', progress: 0 }), 500);
      timeoutsRef.current.push(refreshTimeoutId);
    } catch (error) {
      debug.error('refresh', `Refresh failed [${opId}] (attempt ${retryCount + 1}):`, {
        error: error.message,
        retryCount,
        timestamp: new Date().toISOString()
      });

      // Implement exponential backoff retry
      if (retryCount < maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        debug.info('refresh', `Retrying [${opId}] in ${backoffTime}ms`);
        const retryTimeoutId = setTimeout(() => handleRefresh(retryCount + 1), backoffTime);
        timeoutsRef.current.push(retryTimeoutId);
        return;
      }

      // Final error handling
      const isNetwork = error?.message?.toLowerCase().includes('network') || error instanceof TypeError;

      if (isNetwork || error?.message?.toLowerCase().includes('fetch')) {
        setAvatarsError('Network connection failed during refresh. Please check your connection.');
        setAvatarsErrorType('network');
      } else {
        setAvatarsError('Failed to refresh avatars. Please try again.');
        setAvatarsErrorType('general');
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
   * Handle avatar selection with enhanced progress tracking
   */
  const handleAvatarSelect = async (avatarPath) => {
    const opId = Date.now().toString();
    const startTime = performance.now();

    debug.log('select', `Selection started [${opId}] at ${new Date().toISOString()}`, {
      avatarPath,
      loading,
      selectedAvatar,
      avatarsCount: avatars.length
    });

    if (loading || avatarPath === selectedAvatar) {
      debug.warn('select', `Early return [${opId}] - ${loading ? 'loading' : 'already selected'}`);
      return;
    }

    const avatar = avatars.find(a => a.path === avatarPath);

    if (!avatar) {
      debug.error('select', `Avatar not found [${opId}] for path: ${avatarPath}`);
      return;
    }

    debug.log('select', `Starting selection process [${opId}] for:`, {
      path: avatar.path,
      name: avatar.name,
      url: avatar.url
    });

    setPreviewLoading(avatarPath);
    setLoadingProgress({ step: 'Applying avatar...', progress: 50 });

    try {
      // Call parent handler
      if (onAvatarSelect) {
        debug.log('select', `Calling parent onAvatarSelect [${opId}]`);
        await onAvatarSelect(avatar.path);

        setLoadingProgress({ step: 'Complete', progress: 100 });

        // Show success animation (more subtle timing)
        setSuccessAnimation(avatarPath);
        const successTimeoutId = setTimeout(() => setSuccessAnimation(null), 1200);
        timeoutsRef.current.push(successTimeoutId);

        const totalTime = performance.now() - startTime;
        debug.success('select', `Selection completed successfully [${opId}] in ${totalTime.toFixed(2)}ms`);
      } else {
        debug.warn('select', `onAvatarSelect callback not provided [${opId}]!`);
      }
    } catch (error) {
      const errorTime = performance.now() - startTime;
      debug.error('select', `Selection failed [${opId}] after ${errorTime.toFixed(2)}ms:`, {
        error: error.message,
        stack: error.stack,
        avatar: { path: avatar.path, name: avatar.name },
        timestamp: new Date().toISOString()
      });

      // Mark this avatar as having selection error
      setSelectionErrors(prev => new Set(prev).add(avatarPath));
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
  const handleImageError = (avatarPath, event) => {
    const avatar = avatars.find(a => a.path === avatarPath);
    debug.error('image', 'Image load error:', {
      avatarPath,
      avatarName: avatar?.name,
      avatarUrl: avatar?.url,
      error: event?.target?.error,
      timestamp: new Date().toISOString()
    });

    setImageErrors(prev => new Set(prev).add(avatarPath));
  };

  /**
   * Retry loading a failed image
   */
  const retryImageLoad = (avatarPath) => {
    debug.info('image', `Retrying image load for ${avatarPath}`);
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(avatarPath);
      return newSet;
    });
  };

  /**
   * Get error icon based on error type
   */
  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return RefreshCw;
      case 'server':
        return AlertTriangle;
      case 'auth':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div
      className={cn(
        "transition-all duration-200 avatar-selector space-y-4",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h3 className="text-base font-semibold">Profile Avatar</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={avatarsLoading || refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn("h-4 w-4", (refreshing || avatarsLoading) && "animate-spin")} />
        </Button>
      </div>

      {/* Content */}
      <div>
        {/* Enhanced Loading State */}
        {avatarsLoading && (
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
                  {loadingProgress.step || 'Loading avatars...'}
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
        {avatarsError && !avatarsLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              {(() => {
                const ErrorIcon = getErrorIcon(avatarsErrorType);
                return <ErrorIcon className="h-12 w-12 text-destructive" />;
              })()}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">{avatarsError}</p>
                  {avatarsErrorType === 'network' && (
                    <p className="text-xs text-muted-foreground">
                      Check your internet connection and try again.
                    </p>
                  )}
                  {avatarsErrorType === 'server' && (
                    <p className="text-xs text-muted-foreground">
                      The server is temporarily unavailable. Please wait a moment.
                    </p>
                  )}
                  {avatarsErrorType === 'auth' && (
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!avatarsLoading && !avatarsError && avatars.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <User className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No avatars found</p>
              <p className="text-xs text-muted-foreground">Add avatar images to the server directory</p>
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

        {/* Avatars Grid */}
        {!avatarsLoading && !avatarsError && avatars.length > 0 && (
          <RadioGroup
            value={selectedAvatar}
            onValueChange={handleAvatarSelect}
            disabled={loading}
            className="space-y-4"
          >
          <div className={cn(
            "grid relative z-30 size-gap",
            "grid-cols-3 lg:grid-cols-4"
          )}>
            {avatars.map((avatar) => {
              const isSelected = selectedAvatar === avatar.path;
              const isLoading = previewLoading === avatar.path;
              const hasImageError = imageErrors.has(avatar.path);
              const hasSelectionError = selectionErrors.has(avatar.path);

              // Sanitize the avatar path to create a valid HTML id
              const sanitizedId = `avatar-${avatar.path.replace(/[^a-zA-Z0-9-_]/g, '_')}`;

              return (
                <Label
                  key={avatar.path}
                  htmlFor={sanitizedId}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer z-[1] block aspect-square",
                    "hover:z-10 hover:scale-[1.02] hover:shadow-xl",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                    "transform-gpu", // Enable GPU acceleration
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/20 z-[5] ring-1 ring-primary/30 bg-primary/5"
                      : "border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5",
                    loading && "opacity-50 cursor-not-allowed",
                    successAnimation === avatar.path && "ring-2 ring-green-500/80"
                  )}
                >
                  {/* Hidden RadioGroupItem for functionality */}
                  <RadioGroupItem
                    value={avatar.path}
                    id={sanitizedId}
                    disabled={loading}
                    className="sr-only"
                  />

                  {/* Avatar Preview */}
                  <div className="relative h-full bg-muted flex items-center justify-center">
                    {!hasImageError ? (
                      <>
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className={cn(
                            "h-full w-full object-cover transition-all duration-300 rounded-lg",
                            "group-hover:scale-105 transform-gpu"
                          )}
                          onError={(e) => handleImageError(avatar.path, e)}
                          loading="lazy"
                        />
                        {/* Hover overlay with avatar info */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                          <div className="text-white text-center p-2">
                            <p className="text-xs font-medium">{avatar.name}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted rounded-lg">
                        <div className="text-center space-y-2">
                          <User className="h-8 w-8 text-muted-foreground mx-auto" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              retryImageLoad(avatar.path);
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
                      <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-20 rounded-lg">
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
                        <div className="relative transition-all duration-300">
                          <CheckCircle className="h-5 w-5 text-primary bg-background rounded-full shadow-lg" />
                          {successAnimation === avatar.path && (
                            <div className="absolute inset-0 h-5 w-5 rounded-full bg-green-500/30" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Success Animation Overlay - With blur but no scaling */}
                    {successAnimation === avatar.path && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm z-25 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Applied!</span>
                        </div>
                      </div>
                    )}

                    {/* Selection Error Badge */}
                    {hasSelectionError && (
                      <div className="absolute top-1 left-1 z-25">
                        <div className="flex items-center gap-1 px-1 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-md">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Failed</span>
                        </div>
                      </div>
                    )}

                    {/* Default Badge */}
                    {avatar.isDefault && !hasSelectionError && (
                      <div className="absolute top-1 left-1 z-25">
                        <span className="px-1 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-md">
                          Default
                        </span>
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
              <span>Applying avatar...</span>
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
              <span>This may take a moment...</span>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!avatarsLoading && !avatarsError && avatars.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            Select an avatar to update your profile picture. Changes are applied immediately.
          </div>
        )}
      </div>
    </div>
  );
};

export { AvatarSelector };