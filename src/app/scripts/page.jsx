'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FileCode, Search, Download } from 'lucide-react'
import ScriptsSection from '@/components/settings/ScriptsSection'
import { Card } from '@/components/ui/card'
import { usePageHeader } from '@/hooks/usePageHeader'

export default function ScriptsPage() {
  const router = useRouter()

  // Handler functions
  const handleNewScript = () => router.push('/scripts/new')
  const handleImportScripts = () => {}
  const handleExportSelected = () => {}

  // Placeholder state (will be replaced when ScriptsSection exposes its state)
  const selectedScripts = []
  const isExporting = false

  // Define help configuration
  const helpConfig = useMemo(() => ({
    title: "Scripts Library Help",
    description: "Learn how to manage and organize your VM automation scripts",
    icon: <FileCode className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing",
        title: "Managing Scripts",
        icon: <FileCode className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
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
                Click on a script row to edit its content, change metadata, or update input parameters.
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
          </div>
        )
      },
      {
        id: "search",
        title: "Search and Filters",
        icon: <Search className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
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
          </div>
        )
      },
      {
        id: "import-export",
        title: "Import & Export",
        icon: <Download className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
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
          </div>
        )
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: null,
        content: (
          <div className="space-y-3">
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
          </div>
        )
      }
    ],
    quickTips: [
      "Select multiple scripts for bulk export operations",
      "Scripts are automatically saved in YAML format",
      "Use the search to quickly find specific scripts",
      "Click on a script row to view details or edit"
    ]
  }), [])

  // Configure header using usePageHeader
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Scripts', isCurrent: true }
    ],
    title: 'Scripts Library',
    actions: [
      {
        id: 'import',
        label: 'Import',
        icon: 'Download',
        variant: 'outline',
        size: 'sm',
        onClick: handleImportScripts,
        tooltip: 'Import scripts from file'
      },
      ...(selectedScripts.length > 0 ? [{
        id: 'export-selected',
        label: `Export (${selectedScripts.length})`,
        icon: 'Download',
        variant: 'outline',
        size: 'sm',
        onClick: handleExportSelected,
        disabled: isExporting,
        loading: isExporting,
        tooltip: 'Export selected scripts'
      }] : []),
      {
        id: 'new-script',
        label: 'New Script',
        icon: 'Plus',
        variant: 'default',
        size: 'sm',
        onClick: handleNewScript,
        className: 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700',
        tooltip: 'Create a new script'
      }
    ],
    helpConfig: helpConfig
  }, [selectedScripts.length, isExporting])

  return (
    <div className="space-y-6">

      <div className="container mx-auto px-4">
        <Card className="glass-medium elevation-3 p-4">
          <ScriptsSection embedded={false} />
        </Card>
      </div>
    </div>
  )
}
