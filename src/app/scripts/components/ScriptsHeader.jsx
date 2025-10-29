"use client"

import React from "react"
import { Plus, Download, HelpCircle } from "lucide-react"
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

/**
 * ScriptsHeader component for scripts list page
 * Features breadcrumb navigation, action buttons, and help access
 */
export function ScriptsHeader({
  onNewScript,
  onImportScripts,
  onHelp,
  selectedCount = 0,
  onExportSelected,
  isExporting = false
}) {
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
              <BreadcrumbPage>Scripts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          Scripts Library
        </h1>
      </HeaderCenter>
      <HeaderRight className="flex items-center justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onHelp}
                className="px-2.5 border-brand-celeste-700/40 hover:bg-brand-celeste-800/10 hover:border-brand-celeste-700/60"
              >
                <HelpCircle className="h-4 w-4 text-brand-celeste-800 dark:text-brand-celeste-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Scripts library help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {selectedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportSelected}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Preparing...' : `Export (${selectedCount})`}
          </Button>
        )}

        <Button variant="outline" onClick={onImportScripts} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Import
        </Button>

        <Button
          onClick={onNewScript}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Script
        </Button>
      </HeaderRight>
    </Header>
  )
}
