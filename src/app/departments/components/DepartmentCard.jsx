"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createDebugger } from "@/utils/debug"
import {
  Building2,
  Users,
  Monitor,
  ArrowUpRight,
  Folder,
  Trash2,
  AlertCircle,
  Shield
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
  useDepartmentScriptsLazyQuery,
  useGetDepartmentFirewallRulesLazyQuery
} from "@/gql/hooks"

const debug = createDebugger('frontend:components:department-card')

/**
 * Department Card Component
 * Displays a department as a card with relevant information and navigation
 */
const DepartmentCard = ({
  department,
  machineCount = 0,
  colorClass = "bg-primary/10 text-primary",
  onDelete
}) => {
  const departmentUrl = `/departments/${department.name.toLowerCase()}`

  // State management
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [scriptsCount, setScriptsCount] = useState(0)
  const [firewallRulesCount, setFirewallRulesCount] = useState(0)

  // Hooks
  const [getDepartmentScripts] = useDepartmentScriptsLazyQuery({
    fetchPolicy: 'network-only'
  })

  const [getDepartmentFirewallRules] = useGetDepartmentFirewallRulesLazyQuery({
    fetchPolicy: 'network-only'
  })

  React.useEffect(() => {
    debug.log('render', 'Department card rendered:', {
      departmentName: department.name,
      machineCount,
      colorClass
    })
  }, [department.name, machineCount, colorClass])

  const handleCardClick = () => {
    debug.info('navigation', 'Department card clicked:', {
      departmentName: department.name,
      targetUrl: departmentUrl
    })
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation()
    e.preventDefault() // Defensively prevent anchor navigation

    try {
      // Query department scripts
      const scriptsResult = await getDepartmentScripts({
        variables: { departmentId: department.id }
      })

      // Query department firewall rules
      const firewallResult = await getDepartmentFirewallRules({
        variables: { departmentId: department.id }
      })

      setScriptsCount(scriptsResult.data?.departmentScripts?.length || 0)
      const rulesCount = firewallResult.data?.getDepartmentFirewallRules?.rules?.length || 0
      setFirewallRulesCount(rulesCount)

      setIsDeleteDialogOpen(true)
    } catch (error) {
      debug.error('delete', 'Failed to fetch department resources:', error)
      if (onDelete) {
        onDelete(department.id, department.name, error)
      }
    }
  }

  const handleDeleteConfirm = async () => {
    // Prevent deletion if any resources exist
    if (machineCount > 0 || scriptsCount > 0 || firewallRulesCount > 0) {
      debug.warn('delete', 'Cannot delete department with existing resources')
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      // Call the parent's delete handler
      if (onDelete) {
        await onDelete(department.id, department.name)
      }

      setIsDeleteDialogOpen(false)
    } catch (error) {
      debug.error('delete', 'Failed to delete department:', error)
      const errorMessage = error?.message || 'Failed to delete department'
      setDeleteError(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const hasBlockingResources = machineCount > 0 || scriptsCount > 0 || firewallRulesCount > 0

  return (
    <>
      <Card
        elevation="1"
        radius="md"
        className="h-full bg-card text-card-foreground border hover:shadow-elevation-2 hover:border-primary/40"
      >
        {/* Header with action buttons - outside Link */}
        <CardContent className="pt-6 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Clickable content area */}
        <Link
          href={departmentUrl}
          className="block"
          onClick={handleCardClick}
        >
          <CardContent className="pt-0">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold truncate">{department.name}</h2>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
            </div>

            <div className="flex items-center text-muted-foreground text-sm mb-1">
              <Monitor className="h-4 w-4 mr-2" />
              <span>{machineCount} {machineCount === 1 ? 'Computer' : 'Computers'}</span>
            </div>

            <div className="flex items-center text-muted-foreground text-sm">
              <Users className="h-4 w-4 mr-2" />
              <span>{Math.max(1, Math.floor(machineCount * 0.8))} {Math.max(1, Math.floor(machineCount * 0.8)) === 1 ? 'User' : 'Users'}</span>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted text-sm text-muted-foreground py-3">
            <Folder className="h-4 w-4 mr-2" />
            <span>Resources</span>
          </CardFooter>
        </Link>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent glass="strong" className="shadow-elevation-5">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {hasBlockingResources && (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              Delete Department?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-foreground">
                Are you sure you want to delete <strong>{department.name}</strong>? This action cannot be undone.
              </p>

              {/* Resource Summary */}
              <div className="space-y-2">
                <p className="font-medium text-foreground">Resources:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li className="text-foreground">
                    {machineCount} {machineCount === 1 ? 'VM' : 'VMs'}
                  </li>
                  <li className="text-foreground">
                    {scriptsCount} assigned {scriptsCount === 1 ? 'script' : 'scripts'}
                  </li>
                  <li className="text-foreground">
                    {firewallRulesCount} firewall {firewallRulesCount === 1 ? 'rule' : 'rules'}
                  </li>
                </ul>
              </div>

              {/* Warning if VMs exist */}
              {machineCount > 0 && (
                <div className="flex items-start gap-2 size-padding bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">Cannot delete department</p>
                    <p>This department has {machineCount} active {machineCount === 1 ? 'VM' : 'VMs'}. Please remove or reassign all VMs before deleting the department.</p>
                  </div>
                </div>
              )}

              {/* Warning if scripts exist */}
              {scriptsCount > 0 && (
                <div className="flex items-start gap-2 size-padding bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">Cannot delete department</p>
                    <p>This department has {scriptsCount} assigned {scriptsCount === 1 ? 'script' : 'scripts'}. Please unassign all scripts before deleting the department.</p>
                  </div>
                </div>
              )}

              {/* Warning if firewall rules exist */}
              {firewallRulesCount > 0 && (
                <div className="flex items-start gap-2 size-padding bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">Cannot delete department</p>
                    <p>This department has {firewallRulesCount} firewall {firewallRulesCount === 1 ? 'rule' : 'rules'}. Please remove all firewall rules before deleting the department.</p>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {deleteError && (
                <div className="flex items-start gap-2 size-padding bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="font-semibold">Error</p>
                    <p>{deleteError}</p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="size-gap">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={hasBlockingResources || isDeleting}
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Department'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DepartmentCard;
