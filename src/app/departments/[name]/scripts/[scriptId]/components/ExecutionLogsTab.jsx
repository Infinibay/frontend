'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  History,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Server,
  User,
  Terminal,
  X,
  RefreshCw
} from 'lucide-react'

import { useScriptExecutionsFilteredQuery, useMachinesQuery } from '@/gql/hooks'
import { getSocketService } from '@/services/socketService'
import { cn } from '@/lib/utils'
import { getGlassClasses } from '@/utils/glass-effects'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination'

export default function ExecutionLogsTab({ scriptId, departmentId, departmentName, script }) {
  // State management
  const [filters, setFilters] = useState({
    status: null,
    machineId: null,
    executionType: null,
    startDate: '',
    endDate: '',
    groupBy: 'none'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const tableRef = useRef(null)

  const router = useRouter()

  // Data fetching
  const { data: executionsData, loading: executionsLoading, error: executionsError, refetch } = useScriptExecutionsFilteredQuery({
    variables: {
      filters: {
        scriptId,
        // Omit departmentId if specific machineId is selected (prefer specific machine)
        departmentId: filters.machineId ? undefined : departmentId,
        status: filters.status || undefined,
        machineId: filters.machineId || undefined,
        executionType: filters.executionType || undefined,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      }
    },
    pollInterval: 30000,
    skip: !scriptId || !departmentId
  })

  const { data: machinesData } = useMachinesQuery()

  // Filter department VMs
  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines || !departmentId) return []
    return machinesData.machines.filter(m => m.department?.id === departmentId)
  }, [machinesData, departmentId])

  // WebSocket subscription - Fixed to use correct event patterns
  useEffect(() => {
    if (!scriptId) return

    const socketService = getSocketService()
    const unsubscribeFns = []

    // Subscribe to execution started events
    const unsubscribeStarted = socketService.subscribeToResource('scripts', 'execution_started', (data) => {
      if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
        // Only refetch if no machineId filter or event matches filter
        if (!filters.machineId || data.data?.machineId === filters.machineId) {
          toast.info('Script execution started')
          refetch()
        }
      }
    })
    unsubscribeFns.push(unsubscribeStarted)

    // Subscribe to execution completed events
    const unsubscribeCompleted = socketService.subscribeToResource('scripts', 'execution_completed', (data) => {
      if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
        // Only refetch if no machineId filter or event matches filter
        if (!filters.machineId || data.data?.machineId === filters.machineId) {
          if (data.data?.status === 'SUCCESS') {
            toast.success('Script completed successfully')
          } else if (data.data?.status === 'FAILED') {
            toast.error('Script execution failed')
          }
          refetch()
        }
      }
    })
    unsubscribeFns.push(unsubscribeCompleted)

    // Subscribe to execution cancelled events
    const unsubscribeCancelled = socketService.subscribeToResource('scripts', 'execution_cancelled', (data) => {
      if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
        // Only refetch if no machineId filter or event matches filter
        if (!filters.machineId || data.data?.machineId === filters.machineId) {
          toast.warning('Script execution cancelled')
          refetch()
        }
      }
    })
    unsubscribeFns.push(unsubscribeCancelled)

    return () => {
      unsubscribeFns.forEach(fn => fn())
    }
  }, [scriptId, refetch, filters.machineId])

  // Grouping logic
  const groupedExecutions = useMemo(() => {
    if (!executionsData?.scriptExecutionsFiltered?.executions) return []

    const executions = executionsData.scriptExecutionsFiltered.executions

    if (filters.groupBy === 'vm') {
      const groups = {}
      executions.forEach(exec => {
        const vmName = exec.machine?.name || 'Unknown VM'
        if (!groups[vmName]) {
          groups[vmName] = []
        }
        groups[vmName].push(exec)
      })
      return Object.entries(groups).map(([name, execs]) => ({
        groupName: name,
        executions: execs
      }))
    }

    if (filters.groupBy === 'schedule') {
      const oneTime = executions.filter(e => !e.repeatIntervalMinutes)
      const periodic = executions.filter(e => e.repeatIntervalMinutes)
      const result = []
      if (oneTime.length > 0) result.push({ groupName: 'One-Time', executions: oneTime })
      if (periodic.length > 0) result.push({ groupName: 'Periodic', executions: periodic })
      return result
    }

    if (filters.groupBy === 'date') {
      const groups = {}
      executions.forEach(exec => {
        const date = format(new Date(exec.createdAt), 'yyyy-MM-dd')
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(exec)
      })
      return Object.entries(groups).map(([date, execs]) => ({
        groupName: date,
        executions: execs
      }))
    }

    return [{ groupName: 'All Executions', executions }]
  }, [executionsData, filters.groupBy])

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return { Icon: Clock, color: 'text-gray-500', variant: 'secondary' }
      case 'RUNNING':
        return { Icon: Loader2, color: 'text-blue-500', variant: 'default', spin: true }
      case 'SUCCESS':
        return { Icon: CheckCircle, color: 'text-green-500', variant: 'success' }
      case 'FAILED':
        return { Icon: XCircle, color: 'text-red-500', variant: 'destructive' }
      case 'TIMEOUT':
        return { Icon: AlertCircle, color: 'text-orange-500', variant: 'warning' }
      case 'CANCELLED':
        return { Icon: XCircle, color: 'text-gray-500', variant: 'secondary' }
      default:
        return { Icon: Clock, color: 'text-gray-500', variant: 'secondary' }
    }
  }

  const formatDuration = (startedAt, completedAt) => {
    if (!startedAt || !completedAt) return '—'
    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const diffMs = end - start
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes % 60}m`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds % 60}s`
    } else {
      return `${diffSeconds}s`
    }
  }

  const formatExecutionType = (type) => {
    switch (type) {
      case 'FIRST_BOOT':
        return { label: 'First Boot', variant: 'secondary' }
      case 'ON_DEMAND':
        return { label: 'On Demand', variant: 'default' }
      case 'SCHEDULED':
        return { label: 'Scheduled', variant: 'outline' }
      default:
        return { label: type, variant: 'default' }
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      status: null,
      machineId: null,
      executionType: null,
      startDate: '',
      endDate: '',
      groupBy: 'none'
    })
    setCurrentPage(1)
    toast.success('Filters cleared')
  }

  const toggleRowExpansion = (executionId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(executionId)) {
        newSet.delete(executionId)
      } else {
        newSet.add(executionId)
      }
      return newSet
    })
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const hasActiveFilters = filters.status || filters.machineId || filters.executionType || filters.startDate || filters.endDate

  const totalPages = executionsData?.scriptExecutionsFiltered?.total
    ? Math.ceil(executionsData.scriptExecutionsFiltered.total / pageSize)
    : 1

  const executions = executionsData?.scriptExecutionsFiltered?.executions || []
  const total = executionsData?.scriptExecutionsFiltered?.total || 0
  const hasMore = executionsData?.scriptExecutionsFiltered?.hasMore || false

  // Loading state
  if (executionsLoading && !executionsData) {
    return (
      <Card glass="subtle" elevation="1" radius="md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading execution history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state with specific error messages
  if (executionsError) {
    let errorMessage = 'Failed to load execution history'

    if (executionsError.message.includes('Network')) {
      errorMessage = 'Unable to connect to server. Check your connection.'
    } else if (executionsError.message.includes('permission') || executionsError.message.includes('authorized')) {
      errorMessage = "You don't have permission to view these logs."
    } else if (executionsError.message.includes('not found')) {
      errorMessage = 'Script not found or has been deleted.'
    }

    return (
      <Card glass="subtle" elevation="1" radius="md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">{errorMessage}</p>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              {executionsError.message && (
                <Button
                  onClick={() => {
                    toast.error(`Error details: ${executionsError.message}`)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Show Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card glass="subtle" elevation="1" radius="md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? null : v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RUNNING">Running</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="TIMEOUT">Timeout</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VM Filter */}
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.machineId || 'all'} onValueChange={(v) => handleFilterChange('machineId', v === 'all' ? null : v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="VM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All VMs</SelectItem>
                  {departmentVMs.map(vm => (
                    <SelectItem key={vm.id} value={vm.id}>{vm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Execution Type Filter */}
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.executionType || 'all'} onValueChange={(v) => handleFilterChange('executionType', v === 'all' ? null : v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FIRST_BOOT">First Boot</SelectItem>
                  <SelectItem value="ON_DEMAND">On Demand</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  {filters.startDate || filters.endDate ? 'Date Range Set' : 'Date Range'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="datetime-local"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <Input
                      type="datetime-local"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <Button
                    onClick={() => setCurrentPage(1)}
                    className="w-full"
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Group By */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.groupBy} onValueChange={(v) => handleFilterChange('groupBy', v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Group By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Grouping</SelectItem>
                  <SelectItem value="vm">By VM</SelectItem>
                  <SelectItem value="schedule">By Schedule</SelectItem>
                  <SelectItem value="date">By Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

            {/* Refresh */}
            <Button onClick={() => refetch()} variant="outline" size="sm" className="ml-auto">
              <RefreshCw className={cn('h-4 w-4', executionsLoading && 'animate-spin')} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="gap-2">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('status', null)}
              />
            </Badge>
          )}
          {filters.machineId && (
            <Badge variant="secondary" className="gap-2">
              VM: {departmentVMs.find(v => v.id === filters.machineId)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('machineId', null)}
              />
            </Badge>
          )}
          {filters.executionType && (
            <Badge variant="secondary" className="gap-2">
              Type: {formatExecutionType(filters.executionType).label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('executionType', null)}
              />
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge variant="secondary" className="gap-2">
              Date Range
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters(prev => ({ ...prev, startDate: '', endDate: '' }))}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Executions Table/List */}
      <Card glass="subtle" elevation="1" radius="md" ref={tableRef}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Execution History
              <Badge variant="outline">{total}</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {executions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <History className="h-16 w-16 text-muted-foreground" />
              {hasActiveFilters ? (
                <>
                  <p className="text-muted-foreground font-medium">No executions found</p>
                  <div className="text-sm text-muted-foreground text-center max-w-md">
                    No executions match: {' '}
                    {filters.status && <><strong>Status={filters.status}</strong>{' '}</>}
                    {filters.machineId && <><strong>VM={departmentVMs.find(v => v.id === filters.machineId)?.name}</strong>{' '}</>}
                    {filters.executionType && <><strong>Type={formatExecutionType(filters.executionType).label}</strong></>}
                  </div>
                  <Button onClick={handleClearFilters} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground font-medium">No executions found for this script</p>
                  <p className="text-sm text-muted-foreground">Run the script from the Schedule tab to see execution logs</p>
                </>
              )}
            </div>
          ) : (
            <>
              {groupedExecutions.map((group, groupIndex) => (
                <div key={groupIndex} className="border-b border-border/20 last:border-0">
                  {filters.groupBy !== 'none' && (
                    <div className="bg-muted/30 px-4 py-2 font-medium text-sm flex items-center justify-between">
                      <span>{group.groupName}</span>
                      <Badge variant="outline" size="sm">{group.executions.length}</Badge>
                    </div>
                  )}
                  <TableContainer glass={true} className="border-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">Status</TableHead>
                          <TableHead>VM Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Triggered By</TableHead>
                          <TableHead>Started At</TableHead>
                          <TableHead className="w-[100px]">Duration</TableHead>
                          <TableHead className="w-[80px]">Exit Code</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.executions.map((execution) => {
                          const isExpanded = expandedRows.has(execution.id)
                          const statusInfo = getStatusIcon(execution.status)
                          const typeInfo = formatExecutionType(execution.executionType)
                          const StatusIcon = statusInfo.Icon

                          return (
                            <>
                              <TableRow
                                key={execution.id}
                                className={cn(
                                  'cursor-pointer hover:bg-accent/20 transition-colors',
                                  isExpanded && 'bg-accent/10'
                                )}
                                onClick={() => toggleRowExpansion(execution.id)}
                                data-state={isExpanded ? 'selected' : undefined}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <StatusIcon
                                      className={cn('h-4 w-4', statusInfo.color, statusInfo.spin && 'animate-spin')}
                                    />
                                    <Badge variant={statusInfo.variant} size="sm">
                                      {execution.status}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{execution.machine?.name || 'Unknown'}</TableCell>
                                <TableCell>
                                  <Badge variant={typeInfo.variant} size="sm">
                                    {typeInfo.label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {execution.triggeredBy
                                    ? `${execution.triggeredBy.firstName} ${execution.triggeredBy.lastName}`
                                    : 'System'}
                                </TableCell>
                                <TableCell>
                                  {execution.startedAt
                                    ? format(new Date(execution.startedAt), 'MMM dd, yyyy HH:mm')
                                    : '—'}
                                </TableCell>
                                <TableCell>{formatDuration(execution.startedAt, execution.completedAt)}</TableCell>
                                <TableCell>
                                  {execution.exitCode !== null && execution.exitCode !== undefined
                                    ? execution.exitCode
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleRowExpansion(execution.id)
                                    }}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* Expandable Log Viewer */}
                              {isExpanded && (
                                <TableRow>
                                  <TableCell colSpan={8} className="p-0">
                                    <Collapsible open={isExpanded}>
                                      <CollapsibleContent>
                                        <div className={cn('p-6 space-y-4', getGlassClasses('subtle'))}>
                                          {/* Execution Details */}
                                          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border border-border/20">
                                            {execution.inputValues && Object.keys(execution.inputValues).length > 0 && (
                                              <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Input Values</p>
                                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                                  {JSON.stringify(execution.inputValues, null, 2)}
                                                </pre>
                                              </div>
                                            )}
                                            {execution.executedAs && (
                                              <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Executed As</p>
                                                <p className="text-sm">{execution.executedAs}</p>
                                              </div>
                                            )}
                                            {execution.scheduledFor && (
                                              <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Scheduled For</p>
                                                <p className="text-sm">
                                                  {format(new Date(execution.scheduledFor), 'MMM dd, yyyy HH:mm')}
                                                </p>
                                              </div>
                                            )}
                                            {execution.repeatIntervalMinutes && (
                                              <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Repeat Interval</p>
                                                <p className="text-sm">{execution.repeatIntervalMinutes} minutes</p>
                                              </div>
                                            )}
                                          </div>

                                          {/* Stdout */}
                                          {execution.stdout && (
                                            <div>
                                              <p className="text-sm font-medium mb-2">Standard Output</p>
                                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
                                                {execution.stdout}
                                              </pre>
                                            </div>
                                          )}

                                          {/* Stderr */}
                                          {execution.stderr && (
                                            <div>
                                              <p className="text-sm font-medium mb-2 text-destructive">Standard Error</p>
                                              <pre className="bg-destructive/10 p-4 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
                                                {execution.stderr}
                                              </pre>
                                            </div>
                                          )}

                                          {/* Error */}
                                          {execution.error && (
                                            <div>
                                              <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="h-4 w-4 text-destructive" />
                                                <p className="text-sm font-medium text-destructive">Error Message</p>
                                              </div>
                                              <p className="text-sm text-destructive">{execution.error}</p>
                                            </div>
                                          )}

                                          {!execution.stdout && !execution.stderr && !execution.error && (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                              No output available for this execution
                                            </p>
                                          )}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMore}
                  className={cn(!hasMore && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
