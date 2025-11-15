'use client'

/**
 * @deprecated Use ScriptListItem instead for a more compact design
 *
 * This component is kept for backward compatibility but should not be used in new code.
 * The ScriptListItem component provides a more space-efficient list layout that reduces
 * whitespace by 60-70% compared to this card-based design.
 *
 * @see ScriptListItem
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, FileCode, Tag } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ScriptCard({ script, selected, onToggleSelect, onEdit, onDelete, compact = false }) {
  const isSystemTemplate = !script.createdBy

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      compact ? '' : (selected ? 'ring-2 ring-primary' : '')
    }`}>
      <CardHeader className={compact ? 'p-3 pb-2' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {!compact && (
              <Checkbox
                checked={selected}
                onCheckedChange={() => onToggleSelect(script.id)}
                className="mt-1"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                {script.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {script.description || 'No description'}
              </CardDescription>
              {script.tags && script.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {script.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'p-3 py-2' : ''}>
        <div className={compact ? 'space-y-2' : 'space-y-3'}>
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {!compact && script.category && <Badge variant="outline">{script.category}</Badge>}
            {script.os.map(os => (
              <Badge key={os} variant="secondary">{os}</Badge>
            ))}
            <Badge>{script.shell}</Badge>
          </div>

          {/* Stats */}
          <div className="text-sm text-muted-foreground">
            {script.hasInputs && <span>{script.inputCount} inputs</span>}
            {isSystemTemplate && <Badge variant="outline">System Template</Badge>}
          </div>

          {/* Creator info */}
          {!compact && script.createdBy && (
            <div className="text-xs text-muted-foreground">
              Created by {script.createdBy.firstName} {script.createdBy.lastName}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className={`flex justify-between ${compact ? 'p-3 pt-2' : ''}`}>
        <Button variant="outline" size="sm" onClick={() => onEdit(script.id)}>
          <Edit className="h-4 w-4 mr-2" />
          {isSystemTemplate ? 'View' : 'Edit'}
        </Button>

        {!compact && !isSystemTemplate && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">•••</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDelete(script.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  )
}
