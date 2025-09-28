"use client"

import React from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { BsGrid, BsPlusLg } from "react-icons/bs"
import { AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"
import { useAppTheme } from "@/contexts/ThemeProvider"
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const debug = createDebugger('frontend:components:computers-header')

/**
 * ComputersHeader component for computers page
 * Features refresh functionality, breadcrumbs, and VM creation controls
 */
export function ComputersHeader({ hasISOs = true, onRefresh }) {
  const vmsLoading = useSelector((state) => state.vms.loading?.fetch);
  const vmsError = useSelector((state) => state.vms.error?.fetch);
  const { resolvedTheme } = useAppTheme();

  React.useEffect(() => {
    debug.log('render', 'ComputersHeader rendered:', { hasISOs, vmsLoading, vmsError })
  }, [hasISOs, vmsLoading, vmsError])

  const handleRefresh = () => {
    debug.info('action', 'Refresh button clicked')
    onRefresh?.()
  }

  return (
    <Header
      variant="glass"
      elevated
      sticky={true}
      style={{ top: 0 }}
      className="z-30"
    >
      <HeaderLeft className="w-[200px]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Computers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          Computers
        </h1>
      </HeaderCenter>
      <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={vmsLoading}
                  className={cn(
                    "whitespace-nowrap",
                    vmsError && "border-destructive text-destructive hover:bg-destructive/10"
                  )}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    vmsLoading && "animate-spin"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {vmsLoading ? 'Refreshing...' :
                   vmsError ? 'Retry loading machines' :
                   'Refresh machines'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* New VM Button */}
          {hasISOs ? (
            <Link href="/computers/create" onClick={() => debug.info('navigation', 'Create VM navigation triggered')}>
              <Button className="whitespace-nowrap">
                <BsPlusLg className="mr-2 h-4 w-4" />
                New
              </Button>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      className="whitespace-nowrap"
                      disabled
                      variant="secondary"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      New
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload an ISO image first to create VMs</p>
                  <Link
                    href="/settings?tab=iso"
                    className="text-primary underline text-xs mt-1 block"
                  >
                    Go to Settings
                  </Link>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </HeaderRight>
    </Header>
  );
}
