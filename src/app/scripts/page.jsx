'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScriptsHeader } from '@/app/scripts/components/ScriptsHeader'
import { ScriptsListHelpSheet } from '@/app/scripts/components/ScriptsListHelpSheet'
import ScriptsSection from '@/components/settings/ScriptsSection'
import { Card } from '@/components/ui/card'

export default function ScriptsPage() {
  const router = useRouter()
  const [helpSheetOpen, setHelpSheetOpen] = useState(false)

  return (
    <div className="space-y-6">
      <ScriptsHeader
        onNewScript={() => router.push('/scripts/new')}
        onImportScripts={() => {}}
        onHelp={() => setHelpSheetOpen(true)}
        selectedCount={0}
        onExportSelected={() => {}}
        isExporting={false}
      />

      <div className="container mx-auto px-4">
        <Card className="glass-medium elevation-3 p-6">
          <ScriptsSection embedded={false} />
        </Card>
      </div>

      <ScriptsListHelpSheet
        open={helpSheetOpen}
        onOpenChange={setHelpSheetOpen}
      />
    </div>
  )
}
