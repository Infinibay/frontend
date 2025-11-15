"use client"

import { useEffect } from "react"
import { useHelp } from "@/contexts/HelpProvider"

/**
 * Hook for pages to register contextual help configuration
 *
 * Automatically registers help content when component mounts and clears it on unmount.
 * The help button will appear in the header when help is registered.
 *
 * @param {import('@/contexts/HelpProvider').HelpConfig} config - Help configuration object
 *
 * @example
 * ```jsx
 * import { useMemo } from 'react'
 * import { usePageHelp } from '@/hooks/usePageHelp'
 * import { FileCode } from 'lucide-react'
 *
 * function MyPage() {
 *   const helpConfig = useMemo(() => ({
 *     title: "My Feature Help",
 *     description: "Learn how to use this feature",
 *     icon: <FileCode className="h-5 w-5 text-primary" />,
 *     sections: [
 *       {
 *         id: "getting-started",
 *         title: "Getting Started",
 *         icon: <Play className="h-4 w-4" />,
 *         content: (
 *           <div>
 *             <p>This is how you get started...</p>
 *           </div>
 *         )
 *       }
 *     ],
 *     quickTips: [
 *       "Tip 1: Do this first",
 *       "Tip 2: Then do this"
 *     ]
 *   }), [])
 *
 *   usePageHelp(helpConfig)
 *
 *   return <div>My Page Content</div>
 * }
 * ```
 *
 * Note: The config should be memoized or defined outside the component
 * to prevent unnecessary re-registrations on every render.
 */
export function usePageHelp(config) {
  const { setHelpConfig } = useHelp()

  useEffect(() => {
    // Register help configuration on mount
    setHelpConfig(config || null)

    // Clear help configuration on unmount
    return () => {
      setHelpConfig(null)
    }
  }, [config, setHelpConfig])
}
