import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const UserPc = React.forwardRef(({ 
  className,
  name,
  status = "idle", // idle, running, paused, stopped, building
  selected = false,
  avatar = "/images/avatar.png",
  onClick,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "w-[200px] border border-dashed transition-colors cursor-pointer",
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
            "px-10 py-6 rounded-t-xl",
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
    </Card>
  )
})

UserPc.displayName = "UserPc"

export { UserPc }
