"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createDebugger } from "@/utils/debug"
import {
  Building2,
  Users,
  Monitor,
  ChevronRight,
  Trash2,
  AlertCircle,
  Shield,
  Pencil
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
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
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import EditDepartmentDialog from "./EditDepartmentDialog"

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
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

  const handleEditClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsEditDialogOpen(true)
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

  const userCount = Math.max(1, Math.floor(machineCount * 0.8));

  return (
    <>
      <Card
        elevation="1"
        radius="md"
        className="group relative h-full bg-card text-card-foreground border hover:shadow-elevation-2 hover:border-primary/40 transition-all duration-200"
      >
        {/* Action buttons - top right corner */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                onClick={handleEditClick}
                aria-label="Edit department"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit department</p>
            </TooltipContent>
          </Tooltip>

          {/* Delete button */}
          <Tooltip>
            <TooltipTrigger asChild>
              {isDeleting ? (
                <span className="inline-block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground pointer-events-none"
                    disabled
                    aria-label="Deleting department"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Spinner size="sm" />
                  </Button>
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDeleteClick}
                  aria-label="Delete department"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDeleting ? "Deleting..." : "Delete department"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Link
          href={departmentUrl}
          className="block h-full"
          onClick={handleCardClick}
        >
          <CardContent className="flex flex-col gap-4 p-4 sm:p-5 h-full">
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorClass}`}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate">{department.name}</h3>
                <p className="text-xs text-muted-foreground">Click to manage</p>
              </div>
            </div>

            {/* Stats row - at bottom */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
              <span className="flex items-center gap-1.5">
                <Monitor className="h-4 w-4" />
                {machineCount} {machineCount === 1 ? 'Computer' : 'Computers'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {userCount} {userCount === 1 ? 'User' : 'Users'}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </CardContent>
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
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Department'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Department Dialog */}
      <EditDepartmentDialog
        department={department}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};

export default DepartmentCard;
