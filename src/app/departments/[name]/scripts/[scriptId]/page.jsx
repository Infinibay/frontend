'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useScriptQuery, useDepartmentsQuery } from '@/gql/hooks'
import { usePageHeader } from '@/hooks/usePageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCode, Calendar, History, Monitor, Server, Terminal, Tag, User, Clock } from 'lucide-react'
import { getGlassClasses } from '@/utils/glass-effects'
import { cn } from '@/lib/utils'
import ScheduleTab from './components/ScheduleTab'
import ExecutionLogsTab from './components/ExecutionLogsTab'

export default function ScriptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const departmentName = params.name
  const scriptId = params.scriptId

  const [activeTab, setActiveTab] = useState('overview')

  // Fetch script data
  const { data, loading, error } = useScriptQuery({
    variables: { id: scriptId }
  })

  // Fetch all departments and find the matching one (case-insensitive)
  const { data: departmentsData, loading: departmentLoading } = useDepartmentsQuery()

  const script = data?.script

  // Find department by name with case-insensitive match
  const department = useMemo(() => {
    if (!departmentsData?.departments || !departmentName) return null
    return departmentsData.departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase()
    )
  }, [departmentsData, departmentName])

  const departmentId = department?.id

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Script Details Help",
    description: "Understand script configuration and execution",
    icon: <FileCode className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "overview",
        title: "Overview Tab",
        icon: <FileCode className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Script Metadata</p>
              <p>View comprehensive details about the script including name, description, operating system, shell type, and configured inputs.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Script Content</p>
              <p>Review the full script code with syntax highlighting. This is a read-only view - use the Edit button to modify.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Tags and Organization</p>
              <p>Scripts can be categorized with tags for easier filtering and organization across departments.</p>
            </div>
          </div>
        )
      },
      {
        id: "schedule",
        title: "Schedule Tab",
        icon: <Calendar className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Script Scheduling</p>
              <p>Execute scripts immediately or schedule for later execution with flexible scheduling options.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Scheduling Modes</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Immediate: Execute now on selected VMs</li>
                <li>One-time: Schedule for a specific date and time</li>
                <li>Periodic: Set up recurring execution at regular intervals</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Target Selection</p>
              <p>Choose to target specific VMs or all VMs in the department. View and manage active schedules with real-time status updates.</p>
            </div>
          </div>
        )
      },
      {
        id: "logs",
        title: "Execution Logs Tab",
        icon: <History className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Comprehensive Execution History</p>
              <p>View comprehensive execution history for this script across all VMs in the department.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Filter and Search</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Filter by execution status (success, failed, pending, etc.)</li>
                <li>Filter by specific VM or view all VMs</li>
                <li>Filter by execution type (on-demand, scheduled, first boot)</li>
                <li>Filter by date range to find historical executions</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Organization and Details</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Group executions by VM, schedule type, or date for better organization</li>
                <li>Expand any execution to view detailed stdout/stderr logs and debug information</li>
                <li>Navigate through pages of results with built-in pagination</li>
              </ul>
            </div>
          </div>
        )
      }
    ],
    quickTips: [
      "Use the Overview tab to verify script configuration",
      "Click the back button to return to the department scripts list",
      "Use the Schedule tab to configure when and where scripts run",
      "View execution history and debug logs in the Execution Logs tab"
    ]
  }), [])

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', href: '/departments' },
      { label: departmentName || 'Department', href: `/departments/${departmentName}` },
      { label: 'Scripts', href: `/departments/${departmentName}/scripts` },
      { label: script?.name || 'Script', isCurrent: true }
    ],
    title: script?.name || 'Script Details',
    backButton: { href: `/departments/${departmentName}/scripts`, label: 'Back to Scripts' },
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'Edit3',
        variant: 'outline',
        size: 'sm',
        onClick: () => router.push(`/scripts/${scriptId}`),
        tooltip: 'Edit script in editor'
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Script details help'
  }, [departmentName, script?.name, scriptId])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card glass="medium" elevation="3" radius="lg" className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading script details...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || !script) {
    return (
      <div className="space-y-6 p-6">
        <Card glass="medium" elevation="3" radius="lg" className="p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <FileCode className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Script Not Found</h3>
            <p className="text-muted-foreground mb-4">The requested script could not be found.</p>
            <button
              onClick={() => router.push(`/departments/${departmentName}/scripts`)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Scripts
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={cn(getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }), 'p-4')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Execution Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Script Information Card */}
            <Card glass="subtle" elevation="1" radius="md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  {script.name}
                </CardTitle>
                <CardDescription>
                  {script.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                {script.tags && script.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {script.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Created: {new Date(script.createdAt).toLocaleDateString()}</span>
                  </div>
                  {script.updatedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {new Date(script.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Creator */}
                {script.createdBy && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Created by: {script.createdBy.username}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration Card */}
            <Card glass="subtle" elevation="1" radius="md">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Operating Systems */}
                  {(() => {
                    const osList = Array.isArray(script.os) ? script.os : (script.os ? [script.os] : [])
                    const filteredOsList = osList.filter(Boolean)

                    if (filteredOsList.length === 0) return null

                    return (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Operating Systems</h4>
                        <div className="flex flex-wrap gap-2">
                          {filteredOsList.map((os, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {os === 'windows' ? <Monitor className="h-3 w-3" /> : <Server className="h-3 w-3" />}
                              {os}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Shell Type */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Shell Type</h4>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Terminal className="h-3 w-3" />
                      {script.shell}
                    </Badge>
                  </div>

                  {/* Inputs Count */}
                  {script.hasInputs && (() => {
                    const inputCount = script.inputCount ?? script.parsedContent?.inputs?.length ?? 0

                    return (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Script Inputs</h4>
                        <Badge variant="outline" className="w-fit">
                          {inputCount} input{inputCount !== 1 ? 's' : ''} configured
                        </Badge>
                      </div>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Script Inputs Card (if has inputs) */}
            {script.hasInputs && script.parsedContent?.inputs && (
              <Card glass="subtle" elevation="1" radius="md">
                <CardHeader>
                  <CardTitle>Script Inputs</CardTitle>
                  <CardDescription>Parameters requested when running this script</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={cn(getGlassClasses({ glass: 'subtle' }), 'rounded-lg overflow-hidden')}>
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border/50">
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Name</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Type</th>
                          <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">Required</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Default</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {script.parsedContent.inputs.map((input, index) => (
                          <tr key={index} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <span className="text-sm font-medium">{input.label || input.name}</span>
                                {input.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{input.description}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs capitalize">
                                {input.type}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {input.required ? (
                                <Badge variant="destructive" className="text-xs">Yes</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">No</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {input.default ? (
                                <code className="text-xs bg-muted px-2 py-0.5 rounded">{input.default}</code>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Script Content Card */}
            <Card glass="subtle" elevation="1" radius="md">
              <CardHeader>
                <CardTitle>Script Content</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{script.parsedContent?.script || '# No content available'}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            {script && departmentId ? (
              <ScheduleTab
                scriptId={scriptId}
                departmentId={departmentId}
                departmentName={departmentName}
                script={script}
              />
            ) : (
              <Card glass="subtle" elevation="1" radius="md">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {loading || departmentLoading ? 'Loading...' : 'Unable to load scheduling data'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            {script && departmentId ? (
              <ExecutionLogsTab
                scriptId={scriptId}
                departmentId={departmentId}
                departmentName={departmentName}
                script={script}
              />
            ) : (
              <Card glass="subtle" elevation="1" radius="md">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <History className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {loading || departmentLoading ? 'Loading...' : 'Unable to load execution logs'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
