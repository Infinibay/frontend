"use client"

import React from "react"
import { Save, X, HelpCircle } from "lucide-react"
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
 * ScriptEditorHeader component for script create/edit page
 * Features breadcrumb navigation, action buttons, and help access
 */
export function ScriptEditorHeader({
  isNew,
  scriptName,
  onSave,
  onCancel,
  onHelp,
  isSaving,
  isDisabled
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
              <BreadcrumbLink href="/scripts">Scripts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isNew ? 'New Script' : (scriptName || 'Edit Script')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-foreground">
          {isNew ? 'New Script' : 'Edit Script'}
        </h1>
      </HeaderCenter>
      <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
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
              <p>Script editor help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
          className="border-red-600/40 text-red-700 hover:bg-red-600/10 hover:text-red-700 hover:border-red-600/60 dark:text-red-400 dark:hover:text-red-300"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isDisabled || isSaving}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </HeaderRight>
    </Header>
  )
}
