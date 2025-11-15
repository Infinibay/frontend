'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, FileCode, Tag } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * ScriptListItem Component
 *
 * @param {Object} script - Script data object
 * @param {boolean} selected - Whether the script is selected (for bulk operations)
 * @param {Function} onToggleSelect - Callback for toggling selection
 * @param {Function} onEdit - Callback for editing the script
 * @param {Function} onDelete - Callback for deleting the script
 * @param {boolean} compact - Whether to use compact mode (hides selection checkbox)
 * @param {Function} [onClick] - Optional click handler for the entire row. When provided, makes the row clickable and navigable.
 * @param {ReactNode} customActions - Custom action buttons to replace default Edit/Delete actions
 */

export function ScriptListItem({
  script,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  compact = false,
  onClick,
  customActions
}) {
  const isSystemTemplate = !script.createdBy

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={cn(
        "glass-subtle rounded-lg border border-border/20 p-3 hover:bg-accent transition-colors flex flex-col md:flex-row items-start md:items-center gap-3",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      {...(onClick && {
        role: "button",
        tabIndex: 0,
        onKeyDown: handleKeyDown
      })}
    >
      {/* Selection Checkbox */}
      {!compact && (
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(script.id)}
          className="self-start md:self-center"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* Icon & Name Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <FileCode className="h-5 w-5 text-primary" />
        <span className={cn("text-base font-medium", onClick && "hover:text-primary transition-colors")}>
          {script.name}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {script.description || 'No description'}
        </p>
      </div>

      {/* Badges Section */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {(Array.isArray(script.os) ? script.os : []).map(os => (
          <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
        ))}
        <Badge variant="outline" className="text-xs">{script.shell}</Badge>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
        {script.hasInputs && <span>{script.inputCount} inputs</span>}
        {isSystemTemplate && <Badge variant="outline" className="text-xs">System Template</Badge>}
      </div>

      {/* Tags (if present) */}
      {script.tags && script.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {script.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {script.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{script.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Actions */}
      {customActions || (
        <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(script.id)}
            className="flex-shrink-0"
          >
            <Edit className="h-4 w-4 mr-1" />
            {isSystemTemplate ? 'View' : 'Edit'}
          </Button>

          {!isSystemTemplate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(script.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  )
}
