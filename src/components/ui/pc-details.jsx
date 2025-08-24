"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet";

// Icons
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { TiMediaStop } from "react-icons/ti";
import { BiFullscreen } from "react-icons/bi";
import { FiCpu, FiHardDrive } from "react-icons/fi";
import { BsMemory } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdOutlineScreenshotMonitor } from "react-icons/md";

const sizeVariants = {
  sm: {
    title: "text-lg",
    subtitle: "text-sm",
    text: "text-xs",
    icon: "h-4 w-4",
    controlIcon: "h-4 w-4",
    avatar: "w-8 h-8",
  },
  md: {
    title: "text-2xl",
    subtitle: "text-sm",
    text: "text-sm",
    icon: "h-4 w-4",
    controlIcon: "h-5 w-5",
    avatar: "w-10 h-10",
  },
  lg: {
    title: "text-3xl",
    subtitle: "text-base",
    text: "text-base",
    icon: "h-5 w-5",
    controlIcon: "h-6 w-6",
    avatar: "w-12 h-12",
  },
};

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

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isStopped = status === "stopped";
  
  const sizes = sizeVariants[size];
  
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
                isPaused && "bg-yellow-500",
                isStopped && "bg-red-500"
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
            {!isRunning ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlay}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <BsFillPlayFill className={sizes.controlIcon} />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePause}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  <BsFillPauseFill className={sizes.controlIcon} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStop}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <TiMediaStop className={sizes.controlIcon} />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullScreen}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View VM Details"
            >
              <BiFullscreen className={sizes.controlIcon} />
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
          <SheetTitle className={cn("font-bold flex items-center gap-3", sizes.title)}>
            <Image
              src={avatar}
              alt={`${name} avatar`}
              width={48}
              height={48}
              className={cn("rounded-full", sizes.avatar)}
            />
            {name}
          </SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            <span className={sizes.subtitle}>
              Status: <span className={cn(
                "font-medium",
                isRunning && "text-green-500",
                isPaused && "text-yellow-500",
                isStopped && "text-red-500"
              )}>{status}</span>
            </span>
            <span className={cn("flex items-center gap-2", sizes.subtitle)}>
              <FaUser className={sizes.icon} />
              {user?.firstName || 'N/A'}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* CPU */}
            <div className="flex items-center gap-2">
              <FiCpu className={sizes.icon} />
              <div>
                <div className={cn("font-medium", sizes.subtitle)}>CPU</div>
                <div className={cn("text-muted-foreground", sizes.text)}>{template?.cores || 'N/A'} Cores</div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-center gap-2">
              <BsMemory className={sizes.icon} />
              <div>
                <div className={cn("font-medium", sizes.subtitle)}>RAM</div>
                <div className={cn("text-muted-foreground", sizes.text)}>{template?.ram || 'N/A'} GB</div>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-center gap-2">
              <FiHardDrive className={sizes.icon} />
              <div>
                <div className={cn("font-medium", sizes.subtitle)}>Storage</div>
                <div className={cn("text-muted-foreground", sizes.text)}>{template?.storage || 'N/A'} GB</div>
              </div>
            </div>
            {/* Configuration */}
            {configuration && (
              <div className="flex items-center gap-2">
                <MdOutlineScreenshotMonitor className={sizeVariants[size].icon} />
                <div>
                  <div className={cn("font-medium", sizes.subtitle)}>Configuration</div>
                  <div className={cn("text-muted-foreground", sizes.text)}>{configuration.graphicProtocol}://{configuration.graphicHost}:{configuration.graphicPort}</div>
                  <div className={cn("text-muted-foreground", sizes.text)}>{configuration.graphicPassword}</div>
                </div>
              </div>
            )}

            {/* User */}
            <div className="flex items-center gap-2">
              <FaUser className={sizes.icon} />
              <div>
                <div className={cn("font-medium", sizes.subtitle)}>User</div>
                <div className={cn("text-muted-foreground", sizes.text)}>{user?.firstName || 'N/A'}</div>
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
