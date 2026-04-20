'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  History,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  Calendar,
  Server,
  Terminal,
  X,
  RefreshCw,
  Filter,
} from 'lucide-react'

import { useScriptExecutionsFilteredQuery, useMachinesQuery } from '@/gql/hooks'
import { getSocketService } from '@/services/socketService'

import {
  Page,
  Card,
  Alert,
  Badge,
  Button,
  IconButton,
  Select,
  TextField,
  ResponsiveStack,
  LoadingOverlay,
  EmptyState,
  Spinner,
  StatusDot,
  Timestamp,
  PropertyList,
  CodeBlock,
  Pagination,
  Popover,
  Tooltip,
} from '@infinibay/harbor'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'TIMEOUT', label: 'Timeout' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'FIRST_BOOT', label: 'First Boot' },
  { value: 'ON_DEMAND', label: 'On Demand' },
  { value: 'SCHEDULED', label: 'Scheduled' },
]

const GROUP_OPTIONS = [
  { value: 'none', label: 'No Grouping' },
  { value: 'vm', label: 'By VM' },
  { value: 'schedule', label: 'By Schedule' },
  { value: 'date', label: 'By Date' },
]

function statusMeta(status) {
  switch (status) {
    case 'PENDING':
      return { tone: 'neutral', dot: 'unknown', label: 'Pending' }
    case 'RUNNING':
      return { tone: 'info', dot: 'provisioning', label: 'Running' }
    case 'SUCCESS':
      return { tone: 'success', dot: 'online', label: 'Success' }
    case 'FAILED':
      return { tone: 'danger', dot: 'offline', label: 'Failed' }
    case 'TIMEOUT':
      return { tone: 'warning', dot: 'degraded', label: 'Timeout' }
    case 'CANCELLED':
      return { tone: 'neutral', dot: 'maintenance', label: 'Cancelled' }
    default:
      return { tone: 'neutral', dot: 'unknown', label: status }
  }
}

function typeMeta(type) {
  switch (type) {
    case 'FIRST_BOOT':
      return { tone: 'neutral', label: 'First Boot' }
    case 'ON_DEMAND':
      return { tone: 'info', label: 'On Demand' }
    case 'SCHEDULED':
      return { tone: 'purple', label: 'Scheduled' }
    default:
      return { tone: 'neutral', label: type }
  }
}

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return '—'
  const diffMs = new Date(completedAt) - new Date(startedAt)
  const s = Math.floor(diffMs / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

export default function ExecutionLogsTab({ scriptId, departmentId }) {
  const [filters, setFilters] = useState({
    status: null,
    machineId: null,
    executionType: null,
    startDate: '',
    endDate: '',
    groupBy: 'none',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const tableRef = useRef(null)

  const {
    data: executionsData,
    loading: executionsLoading,
    error: executionsError,
    refetch,
  } = useScriptExecutionsFilteredQuery({
    variables: {
      filters: {
        scriptId,
        departmentId: filters.machineId ? undefined : departmentId,
        status: filters.status || undefined,
        machineId: filters.machineId || undefined,
        executionType: filters.executionType || undefined,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    },
    pollInterval: 30000,
    skip: !scriptId || !departmentId,
  })

  const { data: machinesData } = useMachinesQuery()

  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines || !departmentId) return []
    return machinesData.machines.filter((m) => m.department?.id === departmentId)
  }, [machinesData, departmentId])

  useEffect(() => {
    if (!scriptId) return
    const socketService = getSocketService()
    const unsubs = []

    unsubs.push(
      socketService.subscribeToResource('scripts', 'execution_started', (data) => {
        if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
          if (!filters.machineId || data.data?.machineId === filters.machineId) {
            toast.info('Script execution started')
            refetch()
          }
        }
      })
    )
    unsubs.push(
      socketService.subscribeToResource('scripts', 'execution_completed', (data) => {
        if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
          if (!filters.machineId || data.data?.machineId === filters.machineId) {
            if (data.data?.status === 'SUCCESS') toast.success('Script completed successfully')
            else if (data.data?.status === 'FAILED') toast.error('Script execution failed')
            refetch()
          }
        }
      })
    )
    unsubs.push(
      socketService.subscribeToResource('scripts', 'execution_cancelled', (data) => {
        if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
          if (!filters.machineId || data.data?.machineId === filters.machineId) {
            toast.warning('Script execution cancelled')
            refetch()
          }
        }
      })
    )
    return () => unsubs.forEach((fn) => fn())
  }, [scriptId, refetch, filters.machineId])

  const groupedExecutions = useMemo(() => {
    const executions = executionsData?.scriptExecutionsFiltered?.executions || []
    if (executions.length === 0) return []

    if (filters.groupBy === 'vm') {
      const groups = {}
      executions.forEach((e) => {
        const name = e.machine?.name || 'Unknown VM'
        if (!groups[name]) groups[name] = []
        groups[name].push(e)
      })
      return Object.entries(groups).map(([name, execs]) => ({ groupName: name, executions: execs }))
    }
    if (filters.groupBy === 'schedule') {
      const oneTime = executions.filter((e) => !e.repeatIntervalMinutes)
      const periodic = executions.filter((e) => e.repeatIntervalMinutes)
      const result = []
      if (oneTime.length > 0) result.push({ groupName: 'One-Time', executions: oneTime })
      if (periodic.length > 0) result.push({ groupName: 'Periodic', executions: periodic })
      return result
    }
    if (filters.groupBy === 'date') {
      const groups = {}
      executions.forEach((e) => {
        const d = format(new Date(e.createdAt), 'yyyy-MM-dd')
        if (!groups[d]) groups[d] = []
        groups[d].push(e)
      })
      return Object.entries(groups).map(([d, execs]) => ({ groupName: d, executions: execs }))
    }
    return [{ groupName: 'All Executions', executions }]
  }, [executionsData, filters.groupBy])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      status: null,
      machineId: null,
      executionType: null,
      startDate: '',
      endDate: '',
      groupBy: 'none',
    })
    setCurrentPage(1)
    toast.success('Filters cleared')
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handlePageChange = (p) => {
    setCurrentPage(p)
    if (tableRef.current) tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const hasActiveFilters =
    filters.status || filters.machineId || filters.executionType || filters.startDate || filters.endDate

  const total = executionsData?.scriptExecutionsFiltered?.total || 0
  const totalPages = total ? Math.ceil(total / pageSize) : 1

  // Loading
  if (executionsLoading && !executionsData) {
    return (
      <Page size="xl" gap="lg">
        <Card>
          <LoadingOverlay label="Loading execution history…" fill />
        </Card>
      </Page>
    )
  }

  // Error
  if (executionsError) {
    let errorMessage = 'Failed to load execution history'
    if (executionsError.message.includes('Network'))
      errorMessage = 'Unable to connect to server. Check your connection.'
    else if (
      executionsError.message.includes('permission') ||
      executionsError.message.includes('authorized')
    )
      errorMessage = "You don't have permission to view these logs."
    else if (executionsError.message.includes('not found'))
      errorMessage = 'Script not found or has been deleted.'

    return (
      <Page size="xl" gap="lg">
        <Alert
          tone="danger"
          title="Could not load executions"
          icon={<AlertCircle size={18} />}
          actions={
            <ResponsiveStack direction="row" gap={2}>
              <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={() => refetch()}>
                Retry
              </Button>
              {executionsError.message && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.error(`Error details: ${executionsError.message}`)}
                >
                  Show Details
                </Button>
              )}
            </ResponsiveStack>
          }
        >
          {errorMessage}
        </Alert>
      </Page>
    )
  }

  return (
    <Page size="xl" gap="lg">
      {/* Filters */}
      <Card title="Filters" leadingIcon={<Filter size={16} />}>
        <ResponsiveStack direction={{ base: 'col', md: 'row' }} gap={3} wrap align="center">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.status || 'all'}
            onChange={(v) => handleFilterChange('status', v === 'all' ? null : v)}
          />
          <Select
            label="VM"
            options={[
              { value: 'all', label: 'All VMs' },
              ...departmentVMs.map((vm) => ({ value: vm.id, label: vm.name })),
            ]}
            value={filters.machineId || 'all'}
            onChange={(v) => handleFilterChange('machineId', v === 'all' ? null : v)}
          />
          <Select
            label="Type"
            options={TYPE_OPTIONS}
            value={filters.executionType || 'all'}
            onChange={(v) => handleFilterChange('executionType', v === 'all' ? null : v)}
          />
          <Select
            label="Group By"
            options={GROUP_OPTIONS}
            value={filters.groupBy}
            onChange={(v) => handleFilterChange('groupBy', v)}
          />
          <Popover
            side="bottom"
            align="start"
            content={
              <Card>
                <ResponsiveStack direction="col" gap={3}>
                  <TextField
                    label="Start date"
                    type="datetime-local"
                    value={filters.startDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                  <TextField
                    label="End date"
                    type="datetime-local"
                    value={filters.endDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                  <Button size="sm" fullWidth onClick={() => setCurrentPage(1)}>
                    Apply
                  </Button>
                </ResponsiveStack>
              </Card>
            }
          >
            <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>
              {filters.startDate || filters.endDate ? 'Date Range Set' : 'Date Range'}
            </Button>
          </Popover>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={handleClearFilters}>
              Clear
            </Button>
          )}
          <Tooltip content="Refresh">
            <IconButton
              label="Refresh"
              icon={executionsLoading ? <Spinner size={14} /> : <RefreshCw size={14} />}
              size="sm"
              variant="ghost"
              onClick={() => refetch()}
            />
          </Tooltip>
        </ResponsiveStack>
      </Card>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <ResponsiveStack direction="row" gap={2} wrap>
          {filters.status && (
            <Badge tone="info">
              <ResponsiveStack direction="row" gap={1} align="center">
                <span>Status: {filters.status}</span>
                <IconButton
                  label="Remove status filter"
                  icon={<X size={12} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFilterChange('status', null)}
                />
              </ResponsiveStack>
            </Badge>
          )}
          {filters.machineId && (
            <Badge tone="info">
              <ResponsiveStack direction="row" gap={1} align="center">
                <span>VM: {departmentVMs.find((v) => v.id === filters.machineId)?.name}</span>
                <IconButton
                  label="Remove VM filter"
                  icon={<X size={12} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFilterChange('machineId', null)}
                />
              </ResponsiveStack>
            </Badge>
          )}
          {filters.executionType && (
            <Badge tone="purple">
              <ResponsiveStack direction="row" gap={1} align="center">
                <span>Type: {typeMeta(filters.executionType).label}</span>
                <IconButton
                  label="Remove type filter"
                  icon={<X size={12} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFilterChange('executionType', null)}
                />
              </ResponsiveStack>
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge tone="neutral">
              <ResponsiveStack direction="row" gap={1} align="center">
                <span>Date Range</span>
                <IconButton
                  label="Remove date range"
                  icon={<X size={12} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilters((prev) => ({ ...prev, startDate: '', endDate: '' }))}
                />
              </ResponsiveStack>
            </Badge>
          )}
        </ResponsiveStack>
      )}

      {/* Executions list */}
      <Card
        ref={tableRef}
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <span>Execution History</span>
            <Badge tone="neutral">{total}</Badge>
          </ResponsiveStack>
        }
        leadingIcon={<History size={16} />}
      >
        {groupedExecutions.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={<History size={24} />}
              title="No executions found"
              description={
                <ResponsiveStack direction="row" gap={2} wrap justify="center">
                  {filters.status && <Badge tone="info">Status: {filters.status}</Badge>}
                  {filters.machineId && (
                    <Badge tone="info">
                      VM: {departmentVMs.find((v) => v.id === filters.machineId)?.name}
                    </Badge>
                  )}
                  {filters.executionType && (
                    <Badge tone="purple">Type: {typeMeta(filters.executionType).label}</Badge>
                  )}
                </ResponsiveStack>
              }
              actions={
                <Button variant="secondary" size="sm" icon={<X size={14} />} onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<History size={24} />}
              title="No executions found for this script"
              description="Run the script from the Schedule tab to see execution logs"
            />
          )
        ) : (
          <ResponsiveStack direction="col" gap={4}>
            {groupedExecutions.map((group, groupIndex) => (
              <ResponsiveStack key={groupIndex} direction="col" gap={2}>
                {filters.groupBy !== 'none' && (
                  <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <Filter size={14} />
                      <strong>{group.groupName}</strong>
                    </ResponsiveStack>
                    <Badge tone="neutral">{group.executions.length}</Badge>
                  </ResponsiveStack>
                )}
                <ResponsiveStack direction="col" gap={2}>
                  {group.executions.map((execution) => {
                    const isExpanded = expandedRows.has(execution.id)
                    const sMeta = statusMeta(execution.status)
                    const tMeta = typeMeta(execution.executionType)
                    return (
                      <Card key={execution.id} variant="default" interactive onClick={() => toggleRow(execution.id)}>
                        <ResponsiveStack direction="col" gap={3}>
                          <ResponsiveStack
                            direction={{ base: 'col', md: 'row' }}
                            gap={3}
                            align="center"
                            justify="between"
                            wrap
                          >
                            <ResponsiveStack direction="row" gap={3} align="center" wrap>
                              <StatusDot status={sMeta.dot} label={sMeta.label} />
                              <Badge tone={tMeta.tone} icon={<Terminal size={12} />}>
                                {tMeta.label}
                              </Badge>
                              <ResponsiveStack direction="row" gap={1} align="center">
                                <Server size={14} />
                                <strong>{execution.machine?.name || 'Unknown'}</strong>
                              </ResponsiveStack>
                            </ResponsiveStack>
                            <ResponsiveStack direction="row" gap={3} align="center" wrap>
                              <Tooltip content="Started at">
                                <span>
                                  {execution.startedAt ? (
                                    <Timestamp value={execution.startedAt} relative={false} />
                                  ) : (
                                    '—'
                                  )}
                                </span>
                              </Tooltip>
                              <Tooltip content="Duration">
                                <Badge tone="neutral" icon={<Clock size={12} />}>
                                  {formatDuration(execution.startedAt, execution.completedAt)}
                                </Badge>
                              </Tooltip>
                              <Tooltip content="Exit code">
                                <Badge
                                  tone={
                                    execution.exitCode === 0
                                      ? 'success'
                                      : execution.exitCode
                                      ? 'danger'
                                      : 'neutral'
                                  }
                                >
                                  exit:{' '}
                                  {execution.exitCode !== null && execution.exitCode !== undefined
                                    ? execution.exitCode
                                    : '—'}
                                </Badge>
                              </Tooltip>
                              <IconButton
                                label={isExpanded ? 'Collapse' : 'Expand'}
                                icon={isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleRow(execution.id)
                                }}
                              />
                            </ResponsiveStack>
                          </ResponsiveStack>

                          <ResponsiveStack direction="row" gap={4} wrap>
                            <span>
                              Triggered by:{' '}
                              <strong>
                                {execution.triggeredBy
                                  ? `${execution.triggeredBy.firstName} ${execution.triggeredBy.lastName}`
                                  : 'System'}
                              </strong>
                            </span>
                          </ResponsiveStack>

                          {isExpanded && (
                            <ResponsiveStack direction="col" gap={3}>
                              <PropertyList
                                items={[
                                  execution.executedAs && {
                                    key: 'executedAs',
                                    label: 'Executed As',
                                    value: execution.executedAs,
                                  },
                                  execution.scheduledFor && {
                                    key: 'scheduledFor',
                                    label: 'Scheduled For',
                                    value: format(
                                      new Date(execution.scheduledFor),
                                      'MMM dd, yyyy HH:mm'
                                    ),
                                  },
                                  execution.repeatIntervalMinutes && {
                                    key: 'repeat',
                                    label: 'Repeat Interval',
                                    value: `${execution.repeatIntervalMinutes} minutes`,
                                  },
                                  execution.completedAt && {
                                    key: 'completedAt',
                                    label: 'Completed At',
                                    value: format(
                                      new Date(execution.completedAt),
                                      'MMM dd, yyyy HH:mm'
                                    ),
                                  },
                                ].filter(Boolean)}
                              />

                              {execution.inputValues &&
                                Object.keys(execution.inputValues).length > 0 && (
                                  <CodeBlock
                                    title="Input Values"
                                    lang="json"
                                    code={JSON.stringify(execution.inputValues, null, 2)}
                                  />
                                )}

                              {execution.stdout && (
                                <CodeBlock
                                  title="Standard Output"
                                  lang="bash"
                                  code={execution.stdout}
                                />
                              )}

                              {execution.stderr && (
                                <CodeBlock
                                  title="Standard Error"
                                  lang="bash"
                                  code={execution.stderr}
                                />
                              )}

                              {execution.error && (
                                <Alert
                                  tone="danger"
                                  title="Error"
                                  icon={<AlertCircle size={16} />}
                                >
                                  {execution.error}
                                </Alert>
                              )}

                              {!execution.stdout && !execution.stderr && !execution.error && (
                                <EmptyState
                                  variant="inline"
                                  title="No output available for this execution"
                                />
                              )}
                            </ResponsiveStack>
                          )}
                        </ResponsiveStack>
                      </Card>
                    )
                  })}
                </ResponsiveStack>
              </ResponsiveStack>
            ))}
          </ResponsiveStack>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <ResponsiveStack direction="row" gap={2} justify="center">
          <Pagination page={currentPage} total={totalPages} onChange={handlePageChange} />
        </ResponsiveStack>
      )}
    </Page>
  )
}
