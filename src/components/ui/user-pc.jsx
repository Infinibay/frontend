import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  PlayIcon, 
  PauseIcon,
  Trash2Icon,
  MonitorIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react"
import { Square } from "lucide-react" // Use Square as StopIcon
import { useGraphicConnectionLazyQuery } from "@/gql/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

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
  pc,
  departmentName, // Add department name prop for navigation
  ...props
}, ref) => {
  const router = useRouter();
  
  // Extract name and status from pc object if provided
  const displayName = pc?.name || name;
  const displayStatus = pc?.status || status;
  const displayUsername = pc?.user?.name || username;
  
  // State for connection dialog
  const [connectionDialogOpen, setConnectionDialogOpen] = React.useState(false);
  const [getGraphicConnection, { data: connectionData, loading: connectionLoading, error: connectionError }] = useGraphicConnectionLazyQuery();
  const [showPassword, setShowPassword] = React.useState(false);
  const [copiedPassword, setCopiedPassword] = React.useState(false);
  
  // Handle card click to navigate to VM detail view
  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    
    // Navigate to VM detail view with health tab as default if we have the necessary info
    if (pc?.id && departmentName) {
      router.push(`/departments/${departmentName}/vm/${pc.id}?tab=health`);
    } else if (onClick) {
      // Fallback to original onClick handler
      onClick(e);
    }
  };
  
  // Handle connection button click
  const handleConnect = (e) => {
    e.stopPropagation();
    
    if (!pc?.id) {
      toast({
        title: "Connection Error",
        description: "Unable to establish connection: Machine ID not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Fetch connection details
    getGraphicConnection({ 
      variables: { id: pc.id },
      onCompleted: (data) => {
        if (data?.graphicConnection) {
          const { protocol, link, password } = data.graphicConnection;
          
          // Try to open the connection directly
          const connectionUrl = `${protocol.toLowerCase()}://${link}`;
          
          // Try to open the connection URL
          const windowRef = window.open(connectionUrl, '_blank');
          
          // If unable to open directly or we need to show password, show dialog
          if (!windowRef || password) {
            setConnectionDialogOpen(true);
          }
        } else {
          toast({
            title: "Connection Error",
            description: "No connection information available for this machine.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Connection Error",
          description: `Failed to get connection details: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };
  
  // Render actions based on status
  const renderActions = () => {
    return (
      <div className="flex justify-center gap-1 mt-1">
        {(displayStatus === "stopped" || displayStatus === "idle") && (
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
        {displayStatus === "running" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 p-1 h-auto"
              onClick={handleConnect}
            >
              <MonitorIcon className="w-4 h-4" />
            </Button>
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
        {displayStatus === "paused" && (
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

  const copyToClipboard = async (text) => {
    // Try to use the modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy with Clipboard API:', err);
      }
    }
    
    // Fallback for older browsers or non-secure contexts
    try {
      // Create a temporary input element
      const input = document.createElement('input');
      input.value = text;
      
      // Make it invisible but ensure it can be focused and selected
      input.style.position = 'fixed';
      input.style.opacity = 0;
      input.style.pointerEvents = 'none';
      
      // Add to DOM and focus
      document.body.appendChild(input);
      input.focus();
      input.select();
      
      // Try to copy using document.execCommand as a last resort
      const success = document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(input);
      
      if (success) {
        return true;
      }
    } catch (err) {
      console.error('Fallback copy method failed:', err);
    }
    
    // If all methods fail
    return false;
  };

  // Render Grid View
  if (viewMode === "grid") {
    return (
      <>
        <Card
          ref={ref}
          className={cn(
            "w-[180px] border border-dashed transition-colors cursor-pointer",
            selected ? "border-[#00A6FF] bg-[#00A6FF]/10" : "hover:border-[#00A6FF] hover:bg-[#00A6FF]/10",
            className
          )}
          onClick={handleCardClick}
          {...props}
        >
          <div className="relative">
            <CardContent className="p-0">
              {/* Monitor Image Section */}
              <div className={cn(
                "px-8 py-4 rounded-t-xl",
                selected && "bg-[#00A6FF]/20"
              )}>
                <Image
                  src="/images/smallScreenmointer.png"
                  alt="PC Monitor"
                  width={100}
                  height={80}
                  className="w-full max-w-[100px] mx-auto"
                />
              </div>
              
              {/* PC Name Section */}
              <div className="bg-[#1E1E1E] text-white px-5 py-1.5 text-sm rounded-b-xl line-clamp-1">
                {displayName}
              </div>
            </CardContent>

            {/* User Avatar */}
            <div className="absolute -bottom-1.5 -right-2">
              <Image
                src={avatar}
                alt="User Avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shadow-xl"
              />
            </div>

            {/* Status Indicator */}
            {displayStatus !== "idle" && (
              <div
                className={cn(
                  "absolute -top-2 -right-2 w-5 h-5 rounded-full",
                  displayStatus === "running" && "bg-green-500",
                  displayStatus === "paused" && "bg-yellow-500",
                  displayStatus === "building" && "bg-yellow-500",
                  displayStatus === "stopped" && "bg-red-500"
                )}
              />
            )}
          </div>

          {/* Action Buttons */}
          {renderActions()}
        </Card>
        
        {/* Connection Dialog */}
        <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect to {displayName}</DialogTitle>
              <DialogDescription>
                Use the information below to connect to your virtual machine.
              </DialogDescription>
            </DialogHeader>
            
            {connectionLoading && <div className="py-4">Loading connection details...</div>}
            
            {connectionError && (
              <div className="py-4 text-red-500">
                Error loading connection details: {connectionError.message}
              </div>
            )}
            
            {connectionData?.graphicConnection && (
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connection-url">Connection URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="connection-url" 
                      value={connectionData.graphicConnection.link} 
                      readOnly 
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const url = `${connectionData.graphicConnection.protocol.toLowerCase()}://${connectionData.graphicConnection.link}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        id="password" 
                        value={connectionData.graphicConnection.password} 
                        type={showPassword ? "text" : "password"}
                        readOnly 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={async () => {
                        const success = await copyToClipboard(connectionData.graphicConnection.password);
                        
                        if (success) {
                          // Visual feedback
                          setCopiedPassword(true);
                          setTimeout(() => setCopiedPassword(false), 2000);
                          
                          toast({
                            title: "Copied!",
                            description: "Password copied to clipboard",
                          });
                        } else {
                          toast({
                            title: "Copy failed",
                            description: "Could not copy password to clipboard. Please try selecting and copying manually.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {copiedPassword ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setConnectionDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }
  
  // Render Table View
  return (
    <>
      <tr
        ref={ref}
        className={cn(
          "border-b border-gray-200 transition-colors cursor-pointer",
          selected ? "bg-[#00A6FF]/10" : "hover:bg-[#00A6FF]/5",
          className
        )}
        onClick={handleCardClick}
        {...props}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              displayStatus === "running" && "bg-green-500",
              displayStatus === "paused" && "bg-yellow-500",
              displayStatus === "building" && "bg-yellow-500",
              displayStatus === "stopped" && "bg-red-500",
              displayStatus === "idle" && "bg-gray-300"
            )} />
            <span className="font-medium">{displayName}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Image src={avatar} alt={displayUsername} width={24} height={24} className="w-6 h-6 rounded-full" />
            <span>{displayUsername}</span>
          </div>
        </td>
        {cpuCores !== undefined && <td className="py-3 px-4">{cpuCores} Cores</td>}
        {ram !== undefined && <td className="py-3 px-4">{ram} GB</td>}
        {storage !== undefined && <td className="py-3 px-4">{storage} GB</td>}
        <td className="py-3 px-4">
          <div className="flex justify-end gap-2">
            {displayStatus === "running" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 p-1 h-8 w-8"
                onClick={handleConnect}
              >
                <MonitorIcon className="w-4 h-4" />
              </Button>
            )}
            {(displayStatus === "stopped" || displayStatus === "idle") && (
              <Button
                size="sm"
                variant="ghost"
                className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}
              >
                <PlayIcon className="w-4 h-4" />
              </Button>
            )}
            {displayStatus === "running" && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100 p-1 h-8 w-8"
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
                  className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStop?.();
                  }}
                >
                  <Square className="w-4 h-4" />
                </Button>
              </>
            )}
            {displayStatus === "paused" && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-500 hover:text-green-600 hover:bg-green-100 p-1 h-8 w-8"
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
                  className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
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
              className="text-red-500 hover:text-red-600 hover:bg-red-100 p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
      
      {/* Connection Dialog */}
      <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect to {displayName}</DialogTitle>
            <DialogDescription>
              Use the information below to connect to your virtual machine.
            </DialogDescription>
          </DialogHeader>
          
          {connectionLoading && <div className="py-4">Loading connection details...</div>}
          
          {connectionError && (
            <div className="py-4 text-red-500">
              Error loading connection details: {connectionError.message}
            </div>
          )}
          
          {connectionData?.graphicConnection && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Input 
                  id="protocol" 
                  value={connectionData.graphicConnection.protocol} 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connection-url">Connection URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="connection-url" 
                    value={connectionData.graphicConnection.link} 
                    readOnly 
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const url = `${connectionData.graphicConnection.protocol.toLowerCase()}://${connectionData.graphicConnection.link}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      id="password" 
                      value={connectionData.graphicConnection.password} 
                      type={showPassword ? "text" : "password"}
                      readOnly 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={async () => {
                      const success = await copyToClipboard(connectionData.graphicConnection.password);
                      
                      if (success) {
                        // Visual feedback
                        setCopiedPassword(true);
                        setTimeout(() => setCopiedPassword(false), 2000);
                        
                        toast({
                          title: "Copied!",
                          description: "Password copied to clipboard",
                        });
                      } else {
                        toast({
                          title: "Copy failed",
                          description: "Could not copy password to clipboard. Please try selecting and copying manually.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {copiedPassword ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setConnectionDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

UserPc.displayName = "UserPc"

export { UserPc }
