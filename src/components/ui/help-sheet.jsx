"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

/**
 * Generic HelpSheet component that renders help content based on configuration
 *
 * This component provides a consistent help UI across the application.
 * It follows the Infinibay philosophy of guiding users without treating them as stupid.
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls sheet visibility
 * @param {function(boolean): void} props.onOpenChange - Callback when sheet open state changes
 * @param {import('@/contexts/HelpProvider').HelpConfig} props.config - Help configuration object
 *
 * @example
 * ```jsx
 * const [helpOpen, setHelpOpen] = useState(false)
 *
 * const config = {
 *   title: "Feature Help",
 *   description: "Learn how to use this feature",
 *   icon: <FileCode className="h-5 w-5 text-primary" />,
 *   sections: [
 *     {
 *       id: "section-1",
 *       title: "Getting Started",
 *       icon: <Play className="h-4 w-4" />,
 *       content: <div>Content here...</div>
 *     }
 *   ],
 *   quickTips: ["Tip 1", "Tip 2"]
 * }
 *
 * <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} config={config} />
 * ```
 */
export function HelpSheet({ open, onOpenChange, config }) {
  // Development-time uniqueness check for section IDs
  React.useEffect(() => {
    if (config && config.sections && config.sections.length > 0) {
      if (process.env.NODE_ENV !== 'production') {
        const ids = config.sections.map(section => section.id)
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)

        if (duplicates.length > 0) {
          console.warn(
            `[HelpSheet] Duplicate section IDs detected: ${[...new Set(duplicates)].join(', ')}. ` +
            `Each section must have a unique 'id' to avoid React key warnings.`
          )
        }
      }
    }
  }, [config])

  // Early return if no config provided
  if (!config) {
    return null
  }

  const { title, description, icon, sections, quickTips } = config

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Sticky Header */}
        <SheetHeader className="sticky top-0 z-10 glass-strong elevation-5 border-b-2 border-primary/20 px-6 py-8 bg-gradient-to-b from-background/95 to-background/90">
          <SheetTitle className="flex items-center gap-3 text-xl font-semibold text-glass-text-primary">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              {icon || <HelpCircle className="h-5 w-5 text-primary" />}
            </div>
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-base text-glass-text-secondary mt-2">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="px-6 py-8 space-y-8">
          {/* Collapsible Sections */}
          {sections && sections.length > 0 && (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {section.icon}
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground space-y-3">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Quick Tips Section */}
          {quickTips && quickTips.length > 0 && (
            <div className="mt-8 p-6 glass-subtle elevation-2 rounded-lg border border-primary/10 space-y-3">
              <p className="font-semibold text-base text-foreground flex items-center gap-2">
                <span className="text-primary">💡</span>
                Quick Tips
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                {quickTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
