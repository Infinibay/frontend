"use client";

import { cn } from "@/lib/utils";
import { getGlassClasses } from "@/utils/glass-effects";
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import { RefreshCw } from "lucide-react";
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

export function SettingsHeader({ onRefresh }) {
  const { resolvedTheme } = useAppTheme();
  const { size } = useSizeContext();

  return (
    <>
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
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-foreground">
            Settings
          </h1>
        </HeaderCenter>
        <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
          {onRefresh && (
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      className="whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </HeaderRight>
      </Header>

      {/* Subtitle section */}
      <div className={`container ${sizeVariants[size].layout.maxWidth} mx-auto ${sizeVariants[size].layout.container} pt-6`}>
        <div className={cn(
          "inline-block px-4 py-2 rounded-lg",
          getGlassClasses({
            glass: 'subtle',
            elevation: 1,
            radius: 'md'
          })
        )}>
          <p className={`text-glass-text-primary ${sizeVariants[size].typography.text}`}>
            Manage your theme preferences, ISO files and system configuration
          </p>
        </div>
      </div>
    </>
  );
}