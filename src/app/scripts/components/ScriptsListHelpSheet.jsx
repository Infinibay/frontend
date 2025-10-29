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
import { FileCode, Search, Download, Upload } from "lucide-react"

/**
 * ScriptsListHelpSheet component
 * Provides comprehensive help documentation for the Scripts Library
 * Following Infinibay philosophy: guide users without treating them as stupid
 */
export function ScriptsListHelpSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 glass-strong elevation-5 border-b-2 border-primary/20 px-6 py-8 bg-gradient-to-b from-background/95 to-background/90">
          <SheetTitle className="flex items-center gap-3 text-xl font-semibold text-glass-text-primary">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            Scripts Library Help
          </SheetTitle>
          <SheetDescription className="text-base text-glass-text-secondary mt-2">
            Learn how to manage and organize your VM automation scripts
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-8 space-y-8">
          {/* Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">What is the Scripts Library?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Scripts Library is your central hub for managing automation scripts. Create custom scripts once
              and run them across multiple virtual machines. Filter, search, and organize scripts by category,
              operating system, or custom tags.
            </p>
          </div>

          {/* Collapsible Sections */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {/* Managing Scripts */}
            <AccordionItem value="managing">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Managing Scripts
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">Creating Scripts</p>
                  <p>
                    Click the green "New Script" button to create a new automation script. You'll be guided through
                    defining metadata, inputs, and the script content.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Editing Scripts</p>
                  <p>
                    Click on any script card to edit its content, change metadata, or update input parameters.
                    Changes are validated before saving.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Deleting Scripts</p>
                  <p>
                    Use the delete button on each script card. You'll be asked to confirm before permanent deletion.
                    This action cannot be undone.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Search and Filters */}
            <AccordionItem value="search">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search and Filters
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">Search</p>
                  <p>
                    Search by script name or description. Results update in real-time as you type.
                    Search is case-insensitive.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Category Filter</p>
                  <p>
                    Filter scripts by category: Maintenance, Security, Configuration, or Monitoring.
                    Categories help organize scripts by purpose.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">OS Filter</p>
                  <p>
                    Show only scripts compatible with Windows or Linux. Useful when managing mixed environments.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Clear Filters</p>
                  <p>
                    Reset all filters and search to show all scripts. One-click to start fresh.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Import and Export */}
            <AccordionItem value="import-export">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Import & Export
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">Importing Scripts</p>
                  <p className="mb-2">
                    Import scripts from YAML files to quickly populate your library or share scripts between systems.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Click "Import" button in the header</li>
                    <li>Select one or more YAML files</li>
                    <li>Scripts are validated before import</li>
                    <li>Duplicate names are automatically handled</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Exporting Scripts</p>
                  <p className="mb-2">
                    Export scripts to backup your library or share with other Infinibay installations.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Select scripts using checkboxes</li>
                    <li>Click "Export Selected" button</li>
                    <li>Choose single file or multiple files</li>
                    <li>Download as YAML format</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Best Practices */}
            <AccordionItem value="best-practices">
              <AccordionTrigger className="text-sm font-medium">
                Best Practices
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <ul className="space-y-2 list-disc list-inside leading-relaxed">
                  <li>
                    <strong>Use descriptive names:</strong> Name scripts clearly to identify their purpose at a glance
                  </li>
                  <li>
                    <strong>Add descriptions:</strong> Explain what the script does and when to use it
                  </li>
                  <li>
                    <strong>Categorize scripts:</strong> Assign appropriate categories for easier filtering
                  </li>
                  <li>
                    <strong>Test before deployment:</strong> Always test scripts on non-critical VMs first
                  </li>
                  <li>
                    <strong>Regular backups:</strong> Export your script library periodically for backup
                  </li>
                  <li>
                    <strong>Version control:</strong> Keep track of changes by exporting before major edits
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Quick Tips */}
          <div className="mt-8 p-6 glass-subtle elevation-2 rounded-lg border border-primary/10 space-y-3">
            <p className="font-semibold text-base text-foreground flex items-center gap-2">
              <span className="text-primary">💡</span>
              Quick Tips
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Select multiple scripts for bulk export operations</li>
              <li>Scripts are automatically saved in YAML format</li>
              <li>Use the search to quickly find specific scripts</li>
              <li>Click on a script card to view details or edit</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
