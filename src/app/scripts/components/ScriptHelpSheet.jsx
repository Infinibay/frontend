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
import { Code2, FileCode, Terminal, Variable } from "lucide-react"

/**
 * ScriptHelpSheet component
 * Provides comprehensive help documentation for script creation/editing
 * Following Infinibay philosophy: guide users without treating them as stupid
 */
export function ScriptHelpSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 glass-strong elevation-5 border-b-2 border-primary/20 px-6 py-8 bg-gradient-to-b from-background/95 to-background/90">
          <SheetTitle className="flex items-center gap-3 text-xl font-semibold text-glass-text-primary">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            Script Editor Help
          </SheetTitle>
          <SheetDescription className="text-base text-glass-text-secondary mt-2">
            Learn how to create and manage scripts for your virtual machines
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-8 space-y-8">
          {/* Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">What are Scripts?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Scripts are automated commands that run on your virtual machines. They can perform tasks like
              installing software, configuring settings, or running maintenance operations. Create once,
              run on multiple VMs.
            </p>
          </div>

          {/* Collapsible Sections */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {/* Metadata Section */}
            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Script Metadata
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">Script Name *</p>
                  <p>A descriptive name for your script. This will be shown in the scripts list.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Description</p>
                  <p>Optional brief explanation of what the script does. Helpful for remembering its purpose later.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Operating System *</p>
                  <p>
                    Select the target OS (Windows or Linux). The script will only be available for VMs running this OS.
                    Shell options will automatically adjust based on your selection.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Shell Type *</p>
                  <p>
                    Choose the shell for script execution:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                    <li><strong>PowerShell</strong> (Windows) - Modern, powerful scripting</li>
                    <li><strong>CMD</strong> (Windows) - Traditional command prompt</li>
                    <li><strong>Bash</strong> (Linux) - Standard Linux shell</li>
                    <li><strong>SH</strong> (Linux) - Basic POSIX shell</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Inputs Section */}
            <AccordionItem value="inputs">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Variable className="h-4 w-4" />
                  Script Inputs
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Inputs allow you to create dynamic scripts that prompt for values when executed.
                  This makes scripts reusable with different configurations.
                </p>
                <div>
                  <p className="font-medium text-foreground mb-1">Input Types</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>String</strong> - Text input (e.g., username, path)</li>
                    <li><strong>Number</strong> - Numeric values with optional min/max validation</li>
                    <li><strong>Boolean</strong> - Checkbox for yes/no options</li>
                    <li><strong>Select</strong> - Dropdown with predefined choices</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Using Inputs in Scripts</p>
                  <p className="mb-2">Reference inputs using the following syntax:</p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    $&#123;&#123; inputs.inputName &#125;&#125;
                  </code>
                  <p className="mt-2">Example: If you create an input named "username", use it as:</p>
                  <code className="block bg-muted p-2 rounded text-xs mt-1">
                    echo "Hello $&#123;&#123; inputs.username &#125;&#125;"
                  </code>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Script Content Section */}
            <AccordionItem value="content">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Writing Script Content
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Write your script commands in the Monaco editor. The editor provides syntax highlighting
                  and autocompletion based on the selected shell type.
                </p>
                <div>
                  <p className="font-medium text-foreground mb-1">Best Practices</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Add comments to explain complex logic</li>
                    <li>Use error handling (try/catch, exit codes)</li>
                    <li>Test scripts on a non-critical VM first</li>
                    <li>Keep scripts focused on a single task</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Examples Section */}
            <AccordionItem value="examples">
              <AccordionTrigger className="text-sm font-medium">
                Practical Examples
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-2">Example 1: Install Software (Windows)</p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{'# Install Chocolatey package\nchoco install ${{ inputs.packageName }} -y\n\nWrite-Host "Installation complete!"'}
                  </pre>
                  <p className="mt-2 text-xs">
                    Create a string input named "packageName" to make this reusable.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">Example 2: System Update (Linux)</p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{'#!/bin/bash\n# Update system packages\napt update\napt upgrade -y\n\necho "System updated successfully"'}
                  </pre>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">Example 3: Configure Settings</p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{'# PowerShell example with boolean input\nif (${{ inputs.enableFeature }} -eq "true") {\n    Enable-WindowsOptionalFeature -Online -FeatureName "Feature-Name"\n    Write-Host "Feature enabled"\n} else {\n    Write-Host "Feature not enabled"\n}'}
                  </pre>
                  <p className="mt-2 text-xs">
                    Create a boolean input named "enableFeature" for conditional execution.
                  </p>
                </div>
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
              <li>Use the Preview tab to review your script before saving</li>
              <li>Scripts are saved in YAML format automatically</li>
              <li>Validation errors will appear below the editor</li>
              <li>Press Ctrl+S (Cmd+S on Mac) to save quickly</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
