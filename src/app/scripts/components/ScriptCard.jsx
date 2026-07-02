'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  Badge,
  IconButton,
  ResponsiveStack,
} from '@infinibay/harbor'
import { FileCode, Trash2, Monitor, Server } from 'lucide-react'

/**
 * ScriptCard — rich grid-card view for the scripts library.
 *
 * Displays a Harbor Card with leading icon, title, description, OS/category
 * badges, and a footer with schedule info + action buttons.
 */
export function ScriptCard({
  script,
  onEdit,
  onDelete,
}) {
  const router = useRouter()

  const osList = Array.isArray(script.os) ? script.os : []
  const tags = Array.isArray(script.tags) ? script.tags : []

  const handleClick = onEdit
    ? () => onEdit(script.id)
    : () => router.push(`/scripts/${script.id}`)

  const osBadges = osList.map((os) => {
    // The OS enum comes back upper-cased (WINDOWS/LINUX); normalise before
    // matching so the branded icon/tone and label render correctly.
    const key = String(os).toLowerCase()
    const isWin = key === 'windows'
    const isLinux = key === 'linux'
    return (
      <Badge
        key={os}
        tone={isWin ? 'info' : isLinux ? 'success' : 'neutral'}
      >
        {isWin ? <Monitor size={10} /> : isLinux ? <Server size={10} /> : null}
        <span style={{ marginLeft: isWin || isLinux ? 3 : 0 }}>{key}</span>
      </Badge>
    )
  })

  return (
    <Card
      interactive
      onClick={handleClick}
      leadingIcon={<FileCode size={18} />}
      leadingIconTone="sky"
      title={script.name}
      description={script.description || 'No description'}
      footer={
        <ResponsiveStack direction="row" gap={2} align="center" justify="between">
          <ResponsiveStack direction="row" gap={1} wrap align="center">
            {osBadges}
            {script.category ? (
              <Badge tone="neutral">{script.category.toLowerCase()}</Badge>
            ) : null}
            {tags.slice(0, 2).map((t) => (
              <Badge key={t} tone="purple">{t}</Badge>
            ))}
            {tags.length > 2 ? (
              <Badge tone="neutral">+{tags.length - 2}</Badge>
            ) : null}
          </ResponsiveStack>

          <ResponsiveStack direction="row" gap={1.5} align="center">
            <div onClick={(e) => e.stopPropagation()}>
              <IconButton
                size="sm"
                variant="ghost"
                label="Delete"
                icon={<Trash2 size={13} />}
                onClick={() => onDelete?.(script.id)}
              />
            </div>
          </ResponsiveStack>
        </ResponsiveStack>
      }
    />
  )
}
