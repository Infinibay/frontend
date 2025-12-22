"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet";
import { useOptionalSizeContext } from "./size-provider";
import { VM_STATES, canPlay, canStop, canPause, isBusy } from "@/constants/vmStates";

// Icons
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { TiMediaStop } from "react-icons/ti";
import { BiFullscreen } from "react-icons/bi";
import { FiCpu, FiHardDrive } from "react-icons/fi";
import { BsMemory } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdOutlineScreenshotMonitor } from "react-icons/md";

const PcDetails = React.forwardRef(({
  open,
  onOpenChange,
  size = "md",
  pc,
  onPlay,
  onPause,
  onStop,
  onDelete,
  departmentName, // Add department name prop
  className,
  ...props
}, ref) => {
  const router = useRouter();
  const sizeContext = useOptionalSizeContext();
  const globalSize = sizeContext?.size;

  // Use global size context with fallback to prop, then 'md'
  const currentSize = size || globalSize || 'md';

  // Extract dimensions from avatar size class
  const getDimensions = (sizeClass) => {
    if (sizeClass.includes('w-8')) return { width: 32, height: 32 };
    if (sizeClass.includes('w-10')) return { width: 40, height: 40 };
    if (sizeClass.includes('w-12')) return { width: 48, height: 48 };
    if (sizeClass.includes('w-14')) return { width: 56, height: 56 };
    return { width: 32, height: 32 }; // default
  };

  // Early return if pc is null or undefined
  if (!pc) {
    return null;
  }

  // Destructure pc properties with defaults
  const {
    id,
    name,
    user,
    template,
    vmId,
    status,
    screenshot = "/images/default-screenshot.png",
    avatar,
    configuration,
    department
  } = pc;

  // VM state checks using centralized constants
  const isRunning = status === VM_STATES.RUNNING;
  const isSuspended = status === VM_STATES.SUSPENDED;
  const isPaused = status === VM_STATES.PAUSED;
  const isOff = status === VM_STATES.OFF;
  const isError = status === VM_STATES.ERROR;
  const vmIsBusy = isBusy(status);

  // Action availability
  const showPlayButton = canPlay(status);
  const showStopButton = canStop(status);
  const showPauseButton = canPause(status);
  
  // Handle fullscreen navigation
  const handleFullScreen = () => {
    const deptName = departmentName || department?.name;
    if (id && deptName) {
      router.push(`/departments/${deptName}/vm/${id}`);
      onOpenChange(false); // Close the sheet
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this VM?")) {
      onDelete({ id, vmId });
      onOpenChange(false);
    }
  };

  const handlePlay = () => {
    onPlay({ id, vmId });
  };

  const handlePause = () => {
    onPause({ id, vmId });
  };

  const handleStop = () => {
    onStop({ id, vmId });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent ref={ref} className="w-[400px] sm:w-[540px] overflow-y-auto bg-[#fafafa] dark:bg-[#1a1a1a] pt-16" {...props}>
        {/* Monitor/Screen Section */}
        <div className="relative mb-6">
          {/* Monitor Frame */}
          <div className="relative bg-[#2a2a2a] rounded-lg p-3 shadow-xl">
            {/* Screen Bezel */}
            <div className="relative bg-black rounded-md overflow-hidden">
              {/* Power LED */}
              <div className={cn(
                "absolute top-2 right-2 w-2 h-2 rounded-full z-10",
                isRunning && "bg-green-500",
                (isSuspended || isPaused) && "bg-yellow-500",
                isOff && "bg-gray-500",
                isError && "bg-red-500",
                vmIsBusy && "bg-blue-500 animate-pulse",
                !isRunning && !isSuspended && !isPaused && !isOff && !isError && !vmIsBusy && "bg-gray-400"
              )} />
              
              {/* Screen Content */}
              <div className="relative aspect-video">
                <Image
                  src={screenshot}
                  alt={`${name} screenshot`}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Monitor Stand */}
          <div className="absolute -bottom-4 left-0 right-0 flex flex-col items-center">
            <div className="w-16 h-4 bg-[#2a2a2a] rounded-b-none" />
            <div className="w-32 h-2 bg-[#2a2a2a] rounded-b-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            {showPlayButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlay}
                disabled={vmIsBusy}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-50"
              >
                <BsFillPlayFill className={sizes.icon.button} />
              </Button>
            )}
            {showPauseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePause}
                disabled={vmIsBusy}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
              >
                <BsFillPauseFill className={sizes.icon.button} />
              </Button>
            )}
            {showStopButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStop}
                disabled={vmIsBusy}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <TiMediaStop className={sizes.icon.button} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullScreen}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View VM Details"
            >
              <BiFullscreen className={sizes.icon.button} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete VM
          </Button>
        </div>

        <SheetHeader className="pb-4">
          <SheetTitle className={cn("font-bold flex items-center gap-3", "size-card-title")}>
            <Image
              src={avatar}
              alt={`${name} avatar`}
              width={getDimensions(sizes.avatar).width}
              height={getDimensions(sizes.avatar).height}
              className={cn("rounded-full", sizes.avatar)}
            />
            {name}
          </SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            <span className={"size-text"}>
              Status: <span className={cn(
                "font-medium",
                isRunning && "text-green-500",
                (isSuspended || isPaused) && "text-yellow-500",
                isOff && "text-gray-500",
                isError && "text-red-500",
                vmIsBusy && "text-blue-500"
              )}>{status}</span>
            </span>
            <span className={cn("flex items-center gap-2", "size-text")}>
              <FaUser className={"size-icon"} />
              {user?.firstName || 'N/A'}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* CPU */}
            <div className="flex items-center gap-2">
              <FiCpu className={"size-icon"} />
              <div>
                <div className={cn("font-medium", "size-text")}>CPU</div>
                <div className={cn("text-muted-foreground", "size-card-description")}>{template?.cores || 'N/A'} Cores</div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-center gap-2">
              <BsMemory className={"size-icon"} />
              <div>
                <div className={cn("font-medium", "size-text")}>RAM</div>
                <div className={cn("text-muted-foreground", "size-card-description")}>{template?.ram || 'N/A'} GB</div>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-center gap-2">
              <FiHardDrive className={"size-icon"} />
              <div>
                <div className={cn("font-medium", "size-text")}>Storage</div>
                <div className={cn("text-muted-foreground", "size-card-description")}>{template?.storage || 'N/A'} GB</div>
              </div>
            </div>
            {/* Configuration */}
            {configuration && (
              <div className="flex items-center gap-2">
                <MdOutlineScreenshotMonitor className={"size-icon"} />
                <div>
                  <div className={cn("font-medium", "size-text")}>Configuration</div>
                  <div className={cn("text-muted-foreground", "size-card-description")}>{configuration.graphicProtocol}://{configuration.graphicHost}:{configuration.graphicPort}</div>
                  <div className={cn("text-muted-foreground", "size-card-description")}>{configuration.graphicPassword}</div>
                </div>
              </div>
            )}

            {/* User */}
            <div className="flex items-center gap-2">
              <FaUser className={"size-icon"} />
              <div>
                <div className={cn("font-medium", "size-text")}>User</div>
                <div className={cn("text-muted-foreground", "size-card-description")}>{user?.firstName || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

PcDetails.displayName = "PcDetails";

export { PcDetails };
