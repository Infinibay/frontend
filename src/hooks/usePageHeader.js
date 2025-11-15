"use client"

import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { setHeader, updateHeaderActions } from "@/state/slices/header"
import { usePageHelp } from "@/hooks/usePageHelp"
import { useHeaderActions } from "@/contexts/HeaderActionContext"

/**
 * Hook for pages to configure the global header
 *
 * @param {Object} config - Header configuration
 * @param {Array} config.breadcrumbs - Breadcrumb items [{label, href?, isCurrent?}]
 * @param {string} config.title - Header title
 * @param {Object} [config.subtitle] - Optional subtitle {text, className?}
 * @param {Array} [config.actions] - Action buttons [{id, label, icon?, variant?, onClick, disabled?, loading?, tooltip?, className?}]
 * @param {Object} [config.backButton] - Optional back button {href, label?}
 * @param {Object} [config.helpConfig] - Optional help configuration (passed to usePageHelp)
 * @param {string} [config.helpTooltip] - Optional explicit help tooltip text (overrides helpConfig.title)
 * @param {Array} dependencies - Dependency array for re-registration. Should include any state that affects action configuration.
 * @returns {Object} - { triggerAction, updateActions }
 *
 * @example
 * ```javascript
 * const { triggerAction } = usePageHeader({
 *   breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Scripts', isCurrent: true }],
 *   title: 'Scripts Library',
 *   actions: [
 *     { id: 'new-script', label: 'New Script', icon: 'Plus', onClick: handleNewScript },
 *     { id: 'import', label: 'Import', icon: 'Download', onClick: handleImport }
 *   ],
 *   helpConfig: scriptHelpConfig,
 *   helpTooltip: 'Custom help tooltip'  // Optional override
 * }, [dependencies])
 * ```
 */
export function usePageHeader(config, dependencies = []) {
  const dispatch = useDispatch()
  const { actionRegistry, triggerAction } = useHeaderActions()

  // Track previously registered action IDs to clean up stale handlers
  const previousActionIds = useRef(new Set())

  // Store latest serializable actions for updateActions to use
  const latestSerializableActions = useRef([])

  // Register help config if provided
  usePageHelp(config.helpConfig || null)

  useEffect(() => {
    // Extract actions and separate callbacks from serializable data
    const actions = config.actions || []
    const currentActionIds = new Set(actions.map(a => a.id))

    // Remove stale action handlers that are no longer in the current config
    previousActionIds.current.forEach(id => {
      if (!currentActionIds.has(id)) {
        actionRegistry.current.delete(id)
      }
    })

    const serializableActions = actions.map(action => {
      const { onClick, ...serializableAction } = action
      return serializableAction
    })

    // Store latest serializable actions in ref
    latestSerializableActions.current = serializableActions

    // Register new action callbacks
    actions.forEach(action => {
      if (action.onClick) {
        actionRegistry.current.set(action.id, action.onClick)
      }
    })

    // Update the tracked action IDs
    previousActionIds.current = currentActionIds

    // Determine help tooltip: explicit override > helpConfig.title > 'Help'
    let helpTooltip = null
    if (config.helpTooltip) {
      helpTooltip = config.helpTooltip
    } else if (config.helpConfig) {
      helpTooltip = config.helpConfig.title || 'Help'
    }

    // Dispatch serializable config to Redux
    dispatch(setHeader({
      breadcrumbs: config.breadcrumbs || [],
      title: config.title || '',
      subtitle: config.subtitle || null,
      actions: serializableActions,
      helpTooltip: helpTooltip,
      backButton: config.backButton || null
    }))

    // Cleanup on unmount: remove all registered actions
    // Note: No resetHeader() to avoid flicker; next page's setHeader will replace state
    // Capture currentActionIds in cleanup closure to avoid stale ref warnings
    const idsToCleanup = currentActionIds
    return () => {
      idsToCleanup.forEach(id => {
        actionRegistry.current.delete(id)
      })
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Helper to update action states dynamically
   * Uses the latest serializable actions from the ref to avoid closure issues.
   *
   * @param {Array} updates - Array of action updates [{id, disabled?, loading?}]
   */
  const updateActions = (updates) => {
    const updatedActions = latestSerializableActions.current.map(action => {
      const update = updates.find(u => u.id === action.id)
      if (update) {
        return { ...action, ...update }
      }
      return action
    })
    dispatch(updateHeaderActions({ actions: updatedActions }))
  }

  return {
    triggerAction,
    updateActions
  }
}
