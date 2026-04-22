'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FileCode,
  Search,
  Plus,
  Trash2,
  Pencil,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import {
  Page,
  Card,
  Button,
  IconButton,
  IconTile,
  Badge,
  SearchField,
  Select,
  Alert,
  EmptyState,
  Spinner,
  Dialog,
  DataTable,
  Stat,
  SegmentedControl,
  ResponsiveStack,
  ResponsiveGrid,
  LoadingOverlay,
  Tooltip,
} from '@infinibay/harbor'

import { useScriptsQuery, useDeleteScriptMutation } from '@/gql/hooks'
import { usePageHeader } from '@/hooks/usePageHeader'

const OS_FILTER_OPTIONS = [
  { value: 'all', label: 'All OS' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
]

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'configuration', label: 'Configuration' },
  { value: 'monitoring', label: 'Monitoring' },
]

export default function ScriptsPage() {
  const router = useRouter()

  const { data, loading, error, refetch } = useScriptsQuery()
  const [deleteScript, { loading: deleting }] = useDeleteScriptMutation()

  const [search, setSearch] = useState('')
  const [osFilter, setOsFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)

  const scripts = data?.scripts || []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return scripts.filter((s) => {
      if (
        q &&
        !(
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q))
        )
      )
        return false
      if (osFilter !== 'all' && !s.os?.includes(osFilter)) return false
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
      return true
    })
  }, [scripts, search, osFilter, categoryFilter])

  const stats = useMemo(
    () => ({
      total: scripts.length,
      windows: scripts.filter((s) => s.os?.includes('windows')).length,
      linux: scripts.filter((s) => s.os?.includes('linux')).length,
      scheduled: scripts.filter((s) => (s.scheduleCount || 0) > 0).length,
    }),
    [scripts],
  )

  const helpConfig = useMemo(
    () => ({
      title: 'Scripts library',
      description: 'Automation scripts that can run on any VM or be scheduled.',
      icon: <FileCode size={16} />,
      sections: [
        {
          id: 'create',
          title: 'Creating scripts',
          icon: <FileCode size={14} />,
          content: (
            <p>
              Click <strong>New script</strong> to open the editor where you define
              metadata, inputs and the script body. Content is validated before saving.
            </p>
          ),
        },
        {
          id: 'filter',
          title: 'Filtering',
          icon: <Search size={14} />,
          content: (
            <p>
              Search by name / description / tags. The chip filters narrow by OS and
              category. Everything updates live as you type.
            </p>
          ),
        },
      ],
      quickTips: [
        'Click any row to open the editor',
        'Schedules cancel automatically when a script is deleted',
        'Tags help group related scripts across categories',
      ],
    }),
    [],
  )

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Scripts', isCurrent: true },
      ],
      title: 'Scripts',
      actions: [],
      helpConfig,
      helpTooltip: 'Scripts help',
    },
    [],
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteScript({ variables: { id: deleteTarget.id, force: false } })
      toast.success(`Deleted "${deleteTarget.name}"`)
      setDeleteTarget(null)
      await refetch()
    } catch (err) {
      if (/schedule/i.test(err.message || '')) {
        const confirmForce = window.confirm(
          `"${deleteTarget.name}" has active schedules. Delete anyway and cancel them?`,
        )
        if (confirmForce) {
          try {
            await deleteScript({
              variables: { id: deleteTarget.id, force: true },
            })
            toast.success('Script deleted and schedules cancelled')
            setDeleteTarget(null)
            await refetch()
          } catch (e2) {
            toast.error(`Could not delete: ${e2.message}`)
          }
          return
        }
      }
      toast.error(`Could not delete: ${err.message}`)
    }
  }

  const handleBulkDelete = async () => {
    if (!selected.length) return
    const names = selected
      .map((id) => scripts.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ')
    if (
      !window.confirm(
        `Delete ${selected.length} script${selected.length !== 1 ? 's' : ''}${
          names ? ` (${names}${selected.length > 3 ? ', …' : ''})` : ''
        }? Active schedules will be cancelled.`,
      )
    )
      return
    try {
      await Promise.all(
        selected.map((id) => deleteScript({ variables: { id, force: true } })),
      )
      toast.success(`Deleted ${selected.length} scripts`)
      setSelected([])
      await refetch()
    } catch (err) {
      toast.error(`Bulk delete failed: ${err.message}`)
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Script',
        sortable: true,
        render: (row) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <IconTile icon={<FileCode size={14} />} tone="sky" size="sm" />
            <ResponsiveStack direction="col" gap={0}>
              <span>{row.name}</span>
              {row.description ? <span>{row.description}</span> : null}
            </ResponsiveStack>
          </ResponsiveStack>
        ),
      },
      {
        key: 'category',
        label: 'Category',
        width: 140,
        sortable: true,
        render: (row) =>
          row.category ? (
            <Badge tone="neutral">{row.category.toLowerCase()}</Badge>
          ) : (
            <span>—</span>
          ),
      },
      {
        key: 'os',
        label: 'OS',
        width: 160,
        render: (row) =>
          (row.os || []).length ? (
            <ResponsiveStack direction="row" gap={1} wrap>
              {row.os.map((o) => (
                <Badge
                  key={o}
                  tone={o === 'windows' ? 'info' : o === 'linux' ? 'success' : 'neutral'}
                >
                  {o}
                </Badge>
              ))}
            </ResponsiveStack>
          ) : (
            <span>—</span>
          ),
      },
      {
        key: 'tags',
        label: 'Tags',
        render: (row) =>
          (row.tags || []).length ? (
            <ResponsiveStack direction="row" gap={1} wrap>
              {(row.tags || []).slice(0, 3).map((t) => (
                <Badge key={t} tone="purple">
                  {t}
                </Badge>
              ))}
              {(row.tags || []).length > 3 ? (
                <Badge tone="neutral">+{row.tags.length - 3}</Badge>
              ) : null}
            </ResponsiveStack>
          ) : (
            <span>—</span>
          ),
      },
      {
        key: 'actions',
        label: '',
        width: 110,
        align: 'right',
        render: (row) => (
          <div onClick={(e) => e.stopPropagation()}>
            <ResponsiveStack direction="row" gap={1} justify="end">
              <IconButton
                size="sm"
                variant="ghost"
                label="Edit"
                icon={<Pencil size={14} />}
                onClick={() => router.push(`/scripts/${row.id}`)}
              />
              <IconButton
                size="sm"
                variant="ghost"
                label="Delete"
                icon={<Trash2 size={14} />}
                onClick={() => setDeleteTarget(row)}
              />
            </ResponsiveStack>
          </div>
        ),
      },
    ],
    [router],
  )

  return (
    <Page size="xl" gap={6}>
      <Card
        variant="default"
        leadingIcon={<FileCode size={20} />}
        leadingIconTone="sky"
        title="Scripts"
        description="Reusable automation that can run on any VM, department-wide or on a schedule."
        header={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              loading={loading}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              disabled
              title="Import coming soon"
            >
              Import
            </Button>
            <Tooltip content="New script">
              <span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => router.push('/scripts/new')}
                >
                  New
                </Button>
              </span>
            </Tooltip>
          </ResponsiveStack>
        }
      >
        <ResponsiveGrid columns={{ base: 2, md: 4 }} gap={3}>
          <Stat label="Total" value={stats.total} icon={<FileCode size={14} />} />
          <Stat label="Windows" value={stats.windows} />
          <Stat label="Linux" value={stats.linux} />
          <Stat label="Scheduled" value={stats.scheduled} />
        </ResponsiveGrid>
      </Card>

      {error ? (
        <Alert
          tone="danger"
          title="Couldn't load scripts"
          actions={
            <Button size="sm" icon={<RefreshCw size={14} />} onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      ) : null}

      <Card variant="default">
        <ResponsiveStack
          direction={{ base: 'col', md: 'row' }}
          gap={3}
          align={{ base: 'stretch', md: 'center' }}
        >
          <SearchField
            placeholder="Search name, description, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SegmentedControl
            items={OS_FILTER_OPTIONS}
            value={osFilter}
            onChange={setOsFilter}
            size="sm"
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={CATEGORY_FILTER_OPTIONS}
          />
          <ResponsiveStack direction="row" gap={2} align="center" justify="end">
            {selected.length > 0 ? (
              <Button
                variant="destructive"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={handleBulkDelete}
              >
                Delete {selected.length}
              </Button>
            ) : null}
          </ResponsiveStack>
        </ResponsiveStack>
      </Card>

      {loading && scripts.length === 0 ? (
        <Card variant="default">
          <ResponsiveStack direction="row" gap={2} align="center" justify="center">
            <Spinner />
            <span>Loading scripts…</span>
          </ResponsiveStack>
        </Card>
      ) : filtered.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={<FileCode size={32} />}
            title={scripts.length ? 'No matches' : 'No scripts yet'}
            description={
              scripts.length
                ? 'No scripts match the current search or filters.'
                : 'Create your first automation script to see it here.'
            }
            actions={
              scripts.length === 0 ? (
                <Tooltip content="New script">
                  <span>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Plus size={14} />}
                      onClick={() => router.push('/scripts/new')}
                    >
                      New
                    </Button>
                  </span>
                </Tooltip>
              ) : null
            }
          />
        </Card>
      ) : (
        <Card variant="default">
          <LoadingOverlay active={loading && scripts.length > 0} label="Refreshing…">
            <DataTable
              rows={filtered}
              columns={columns}
              rowKey={(r) => r.id}
              selectable
              selected={selected}
              onSelectionChange={setSelected}
              onRowClick={(row) => router.push(`/scripts/${row.id}`)}
            />
          </LoadingOverlay>
        </Card>
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>Delete script</span>
          </ResponsiveStack>
        }
        description={
          deleteTarget
            ? `Remove "${deleteTarget.name}"? Any active schedules will be cancelled.`
            : ''
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              Delete
            </Button>
          </ResponsiveStack>
        }
      >
        <p>
          Existing execution history is kept. The script body and its schedules are
          removed for good.
        </p>
      </Dialog>
    </Page>
  )
}
