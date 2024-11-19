"use client";

import * as React from "react";
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
  pc: {
    name,
    userName,
    os,
    ram,
    cpu,
    storage,
    vmId,
    status,
    screenshot = "/images/default-screenshot.png",
    avatar,
  },
  onPlay,
  onPause,
  onStop,
  onFullScreen,
  ...props
}, ref) => {
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isStopped = status === "stopped";
  
  const sizes = sizeVariants[size];

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
                <img
                  src={screenshot}
                  alt={`${name} screenshot`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Screen Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              </div>
            </div>
          </div>
          
          {/* Monitor Stand */}
          <div className="absolute -bottom-4 left-0 right-0 flex flex-col items-center">
            <div className="w-16 h-4 bg-[#2a2a2a] rounded-b-none" />
            <div className="w-32 h-2 bg-[#2a2a2a] rounded-b-lg" />
          </div>
        </div>

        <div className="flex justify-between pt-4 pb-2 border-t mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={isRunning ? onPause : onPlay}
              className={cn(
                "transition-colors",
                isRunning && "text-yellow-500 border-yellow-500",
                (isPaused || isStopped) && "text-green-500 border-green-500"
              )}
            >
              {isRunning ? 
                <BsFillPauseFill className={sizes.controlIcon} /> : 
                <BsFillPlayFill className={sizes.controlIcon} />
              }
            </Button>
            {!isStopped && (
              <Button
                variant="outline"
                size="icon"
                onClick={onStop}
                className={cn(
                  "transition-colors",
                  isStopped && "text-red-500 border-red-500"
                )}
              >
                <TiMediaStop className={sizes.controlIcon} />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onFullScreen}
          >
            <BiFullscreen className={sizes.controlIcon} />
          </Button>
        </div>

        <SheetHeader className="pb-4">
          <SheetTitle className={cn("font-bold flex items-center gap-3", sizes.title)}>
            <img
              src={avatar}
              alt={`${name} avatar`}
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
              {userName}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className={cn("text-muted-foreground", sizes.text)}>Operating System</p>
              <p className={cn("font-medium", sizes.text)}>{os}</p>
            </div>
            <div className="space-y-1">
              <p className={cn("text-muted-foreground flex items-center gap-2", sizes.text)}>
                <BsMemory className={sizes.icon} />
                RAM
              </p>
              <p className={cn("font-medium", sizes.text)}>{ram}</p>
            </div>
            <div className="space-y-1">
              <p className={cn("text-muted-foreground flex items-center gap-2", sizes.text)}>
                <FiCpu className={sizes.icon} />
                CPU
              </p>
              <p className={cn("font-medium", sizes.text)}>{cpu}</p>
            </div>
            <div className="space-y-1">
              <p className={cn("text-muted-foreground flex items-center gap-2", sizes.text)}>
                <FiHardDrive className={sizes.icon} />
                Storage
              </p>
              <p className={cn("font-medium", sizes.text)}>{storage}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

PcDetails.displayName = "PcDetails";

export { PcDetails };
