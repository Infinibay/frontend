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

export function TemplatesHeader({ onRefresh, templatesLoading, templatesError }) {
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
              <BreadcrumbPage>Templates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          Templates
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
                    disabled={templatesLoading}
                    className={cn(
                      "whitespace-nowrap",
                      templatesError && "border-destructive text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4",
                      templatesLoading && "animate-spin"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {templatesLoading ? 'Refreshing...' :
                     templatesError ? 'Retry loading templates' :
                     'Refresh templates'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* New Template Button */}
          <Link href="/templates/create">
            <Button className="whitespace-nowrap">
              <BsPlusLg className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </Link>
        </div>
      </HeaderRight>
    </Header>
  );
}