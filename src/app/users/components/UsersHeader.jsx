"use client"

import React from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { BsPlusLg } from "react-icons/bs"
import { RefreshCw, Users } from "lucide-react"
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

const debug = createDebugger('frontend:components:users-header')

/**
 * UsersHeader component for users page
 * Features refresh functionality, breadcrumbs, and user creation controls
 */
export function UsersHeader({ onRefresh }) {
  const usersLoading = useSelector((state) => state.users?.loading?.fetch);
  const usersError = useSelector((state) => state.users?.error?.fetch);
  const { resolvedTheme } = useAppTheme();

  React.useEffect(() => {
    debug.log('render', 'UsersHeader rendered:', { usersLoading, hasError: !!usersError })
  }, [usersLoading, usersError])

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
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          Users
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
                  onClick={onRefresh}
                  disabled={usersLoading}
                  className={cn(
                    "whitespace-nowrap",
                    usersError && "border-destructive text-destructive hover:bg-destructive/10"
                  )}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    usersLoading && "animate-spin"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {usersLoading ? 'Refreshing...' :
                   usersError ? 'Retry loading users' :
                   'Refresh users'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* New User Button */}
          <Link href="/users/create" onClick={() => debug.info('navigation', 'Create user navigation triggered')}>
            <Button className="whitespace-nowrap">
              <BsPlusLg className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </HeaderRight>
    </Header>
  );
}