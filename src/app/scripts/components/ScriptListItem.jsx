'use client'

import {
  Card,
  Badge,
  Checkbox,
  Button,
  IconButton,
  IconTile,
  ResponsiveStack,
} from '@infinibay/harbor'
import { Edit, Trash2, FileCode } from 'lucide-react'

/**
 * ScriptListItem — Harbor-native row for the scripts library.
 *
 * Consumed by `/scripts` and `/departments/[name]/scripts`. The surface is
 * a Harbor `Card` (default variant) so callers never need to override layout.
 */
export function ScriptListItem({
  script,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  compact = false,
  onClick,
  customActions,
}) {
  const isSystemTemplate = !script.createdBy

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  const interactiveProps = onClick
    ? {
        onClick,
        role: 'button',
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        interactive: true,
      }
    : {}

  const osList = Array.isArray(script.os) ? script.os : []
  const hasTags = Array.isArray(script.tags) && script.tags.length > 0

  return (
    <Card variant="default" {...interactiveProps}>
      <ResponsiveStack
        direction={{ base: 'col', md: 'row' }}
        gap={3}
        align="center"
      >
        {!compact ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={!!selected}
              onChange={() => onToggleSelect?.(script.id)}
              aria-label={`Select ${script.name}`}
            />
          </div>
        ) : null}

        <IconTile icon={<FileCode size={16} />} tone="sky" size="sm" />

        <ResponsiveStack direction="col" gap={1}>
          <span>{script.name}</span>
          <span>{script.description || 'No description'}</span>
        </ResponsiveStack>

        <ResponsiveStack direction="row" gap={1} wrap>
          {osList.map((os) => (
            <Badge
              key={os}
              tone={os === 'windows' ? 'info' : os === 'linux' ? 'success' : 'neutral'}
            >
              {os}
            </Badge>
          ))}
          {script.shell ? <Badge tone="neutral">{script.shell}</Badge> : null}
          {script.hasInputs ? <Badge tone="purple">{script.inputCount} inputs</Badge> : null}
          {isSystemTemplate ? <Badge tone="neutral">System template</Badge> : null}
          {hasTags
            ? script.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} tone="purple">
                  {tag}
                </Badge>
              ))
            : null}
          {hasTags && script.tags.length > 2 ? (
            <Badge tone="neutral">+{script.tags.length - 2}</Badge>
          ) : null}
        </ResponsiveStack>

        <ResponsiveStack direction="row" gap={2} align="center" justify="end">
          {customActions ?? (
            <div onClick={(e) => e.stopPropagation()}>
              <ResponsiveStack direction="row" gap={2} align="center">
                {onEdit ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit size={14} />}
                    onClick={() => onEdit(script.id)}
                  >
                    Edit
                  </Button>
                ) : null}
                {!isSystemTemplate && onDelete ? (
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label="Delete"
                    icon={<Trash2 size={14} />}
                    onClick={() => onDelete(script.id)}
                  />
                ) : null}
              </ResponsiveStack>
            </div>
          )}
        </ResponsiveStack>
      </ResponsiveStack>
    </Card>
  )
}
