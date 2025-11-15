"use client"

import { useHelp as useHelpContext } from "@/contexts/HelpProvider"

/**
 * Hook to access help context from any component
 *
 * Returns the current help configuration and setter function.
 * Primarily used by header components to check if help is available
 * and render the help button conditionally.
 *
 * @returns {import('@/contexts/HelpProvider').HelpContextValue}
 * @returns {Object} context
 * @returns {import('@/contexts/HelpProvider').HelpConfig | null} context.helpConfig - Current help config (null if no help registered)
 * @returns {function(import('@/contexts/HelpProvider').HelpConfig | null): void} context.setHelpConfig - Function to update help config
 *
 * @example
 * ```jsx
 * import { useHelp } from '@/hooks/useHelp'
 * import { HelpCircle } from 'lucide-react'
 *
 * function PageHeader() {
 *   const { helpConfig } = useHelp()
 *   const [helpOpen, setHelpOpen] = useState(false)
 *
 *   // Only render help button if help is registered
 *   if (!helpConfig) {
 *     return <div>No help available</div>
 *   }
 *
 *   return (
 *     <>
 *       <Button onClick={() => setHelpOpen(true)}>
 *         <HelpCircle className="h-4 w-4" />
 *       </Button>
 *       <HelpSheet
 *         open={helpOpen}
 *         onOpenChange={setHelpOpen}
 *         config={helpConfig}
 *       />
 *     </>
 *   )
 * }
 * ```
 */
export function useHelp() {
  return useHelpContext()
}
