"use client"

import React, { useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle
} from "lucide-react"
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useHelp } from "@/hooks/useHelp"
import { HelpSheet } from "@/components/ui/help-sheet"
import { useHeaderActions } from "@/contexts/HeaderActionContext"
import {
  selectHeaderBreadcrumbs,
  selectHeaderTitle,
  selectHeaderSubtitle,
  selectHeaderActions,
  selectHeaderHelpTooltip,
  selectHeaderBackButton
} from "@/state/slices/header"

// Icon mapping - maps icon name strings to actual icon components
const iconMap = {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle
}

/**
 * GlobalHeader component that renders based on Redux state
 * Single header component used across all pages
 * Reads configuration from Redux header slice
 */
export function GlobalHeader() {
  const breadcrumbs = useSelector(selectHeaderBreadcrumbs)
  const title = useSelector(selectHeaderTitle)
  const subtitle = useSelector(selectHeaderSubtitle)
  const actions = useSelector(selectHeaderActions)
  const helpTooltip = useSelector(selectHeaderHelpTooltip)
  const backButton = useSelector(selectHeaderBackButton)

  const { helpConfig } = useHelp()
  const { triggerAction } = useHeaderActions()
  const [helpSheetOpen, setHelpSheetOpen] = useState(false)

  // Early return if no header config
  if (!breadcrumbs.length && !title && !actions.length && !helpConfig && !backButton) {
    return null
  }

  return (
    <>
      <Header
        variant="glass"
        elevated
        sticky
        style={{ top: 0 }}
        className="z-30"
      >
        <HeaderLeft className="w-[200px]">
          {backButton && (
            <Link href={backButton.href} legacyBehavior passHref>
              <Button variant="ghost" size="sm" className="mb-2" asChild>
                <a>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {backButton.label || 'Back'}
                </a>
              </Button>
            </Link>
          )}
          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isCurrent ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </HeaderLeft>

        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className={subtitle.className || "text-sm text-muted-foreground"}>
              {subtitle.text}
            </p>
          )}
        </HeaderCenter>

        <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
          {helpConfig && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHelpSheetOpen(true)}
                    className="px-2.5 border-brand-celeste-700/40 hover:bg-brand-celeste-800/10 hover:border-brand-celeste-700/60"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-celeste-800 dark:text-brand-celeste-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{helpTooltip || 'Help'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {actions.map((action) => {
            const IconComponent = action.icon ? iconMap[action.icon] : null
            const button = (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                size={action.size || 'sm'}
                onClick={() => triggerAction(action.id)}
                disabled={action.disabled || false}
                className={action.className || ''}
              >
                {action.loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  IconComponent && <IconComponent className="h-4 w-4 mr-2" />
                )}
                {action.label}
              </Button>
            )

            if (action.tooltip) {
              return (
                <TooltipProvider key={action.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return button
          })}
        </HeaderRight>
      </Header>

      <HelpSheet
        open={helpSheetOpen}
        onOpenChange={setHelpSheetOpen}
        config={helpConfig}
      />
    </>
  )
}
