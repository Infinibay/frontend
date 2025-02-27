import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  PlayIcon, 
  PauseIcon,
  Trash2Icon 
} from "lucide-react"
import { Square } from "lucide-react" // Use Square as StopIcon

const UserPc = React.forwardRef(({ 
  className,
  name,
  status = "idle", // idle, running, paused, stopped, building
  selected = false,
  avatar = "/images/avatar.png",
  onClick,
  onPlay,
  onPause,
  onStop,
  onDelete,
  viewMode = "grid", // grid, table
  cpuCores,
  ram,
  storage,
  username = "User",
  ...props
}, ref) => {
  // Render actions based on status
  const renderActions = () => {
    return (
      <div className="flex justify-center gap-1 mt-1">
        {(status === "stopped" || status === "idle") && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <PlayIcon className="w-4 h-4" />
          </Button>
        )}
        {status === "running" && (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onPause?.();
              }}
            >
              <PauseIcon className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onStop?.();
              }}
            >
              <Square className="w-4 h-4" />
            </Button>
          </>
        )}
        {status === "paused" && (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.();
              }}
            >
              <PlayIcon className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onStop?.();
              }}
            >
              <Square className="w-4 h-4" />
            </Button>
          </>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  // Render Grid View
  if (viewMode === "grid") {
    return (
      <Card
        ref={ref}
        className={cn(
          "w-[180px] border border-dashed transition-colors cursor-pointer",
          selected ? "border-[#00A6FF] bg-[#00A6FF]/10" : "hover:border-[#00A6FF] hover:bg-[#00A6FF]/10",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="relative">
          <CardContent className="p-0">
            {/* Monitor Image Section */}
            <div className={cn(
              "px-8 py-4 rounded-t-xl",
              selected && "bg-[#00A6FF]/20"
            )}>
              <img
                src="/images/smallScreenmointer.png"
                alt="PC Monitor"
                className="w-full max-w-[100px] mx-auto"
              />
            </div>
            
            {/* PC Name Section */}
            <div className="bg-[#1E1E1E] text-white px-5 py-1.5 text-sm rounded-b-xl line-clamp-1">
              {name}
            </div>
          </CardContent>

          {/* User Avatar */}
          <div className="absolute -bottom-1.5 -right-2">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full shadow-xl"
            />
          </div>

          {/* Status Indicator */}
          {status !== "idle" && (
            <div 
              className={cn(
                "absolute -top-2 -right-2 w-5 h-5 rounded-full",
                status === "running" && "bg-green-500",
                status === "paused" && "bg-yellow-500",
                status === "building" && "bg-yellow-500",
                status === "stopped" && "bg-red-500"
              )} 
            />
          )}
        </div>

        {/* Action Buttons */}
        {renderActions()}
      </Card>
    )
  }
  
  // Render Table View
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-gray-200 transition-colors cursor-pointer",
        selected ? "bg-[#00A6FF]/10" : "hover:bg-[#00A6FF]/5",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            status === "running" && "bg-green-500",
            status === "paused" && "bg-yellow-500",
            status === "building" && "bg-yellow-500",
            status === "stopped" && "bg-red-500",
            status === "idle" && "bg-gray-300"
          )} />
          <span className="font-medium">{name}</span>
        </div>
      </td>
      <td className="py-3 px-4">{username}</td>
      <td className="py-3 px-4">
        <div className="flex flex-col text-xs text-gray-600">
          <span>{cpuCores} CPUs</span>
          <span>{ram} RAM</span>
          <span>{storage} Storage</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1 justify-end">
          {(status === "stopped" || status === "idle") && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.();
              }}
              title="Play"
            >
              <PlayIcon className="w-4 h-4" />
            </Button>
          )}
          {status === "running" && (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onPause?.();
                }}
                title="Pause"
              >
                <PauseIcon className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onStop?.();
                }}
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </Button>
            </>
          )}
          {status === "paused" && (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}
                title="Resume"
              >
                <PlayIcon className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onStop?.();
                }}
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Delete"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

UserPc.displayName = "UserPc";

export { UserPc };
