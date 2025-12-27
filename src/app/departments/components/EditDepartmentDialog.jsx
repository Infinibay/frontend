"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateDepartmentNameMutation } from "@/gql/hooks"

/**
 * Edit Department Dialog Component
 * Modal dialog for editing a department's name
 */
const EditDepartmentDialog = ({ department, open, onOpenChange, onSuccess }) => {
  const [name, setName] = useState("")
  const [error, setError] = useState(null)

  const [updateDepartmentName, { loading }] = useUpdateDepartmentNameMutation({
    onCompleted: (data) => {
      onOpenChange(false)
      if (onSuccess) {
        onSuccess(data.updateDepartmentName)
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to update department name")
    }
  })

  useEffect(() => {
    if (department && open) {
      setName(department.name)
      setError(null)
    }
  }, [department, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Department name is required")
      return
    }

    await updateDepartmentName({
      variables: {
        input: {
          id: department.id,
          name: name.trim()
        }
      }
    })
  }

  const isFormValid = name.trim() && name.trim() !== department?.name

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent glass="strong" className="sm:max-w-[425px] shadow-elevation-5">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Change the name of this department.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="department-name">Name</Label>
              <Input
                id="department-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Department name"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDepartmentDialog
