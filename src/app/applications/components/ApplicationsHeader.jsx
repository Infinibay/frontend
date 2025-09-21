"use client";

import { cn } from "@/lib/utils";
import { BsPlusLg } from "react-icons/bs";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAppTheme } from "@/contexts/ThemeProvider";
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ApplicationsHeader({ onRefresh, applicationsLoading, applicationsError }) {
  const { resolvedTheme } = useAppTheme();

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
              <BreadcrumbPage>Applications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          Applications
        </h1>
      </HeaderCenter>
      <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          {onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={applicationsLoading}
                    className={cn(
                      "whitespace-nowrap",
                      applicationsError && "border-destructive text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4",
                      applicationsLoading && "animate-spin"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {applicationsLoading ? 'Refreshing...' :
                     applicationsError ? 'Retry loading applications' :
                     'Refresh applications'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* New Application Button */}
          <Link href="/applications/create">
            <Button className="whitespace-nowrap">
              <BsPlusLg className="mr-2 h-4 w-4" />
              New App
            </Button>
          </Link>
        </div>
      </HeaderRight>
    </Header>
  );
}