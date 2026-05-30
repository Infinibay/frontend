'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Page,
  Badge,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Select,
  StatusDot,
  Timeline
} from '@infinibay/harbor';
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleDot,
  Clock,
  RefreshCw,
  XCircle
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useRealTimeContext } from '@/components/RealTimeProvider';
import { getSocketService } from '@/services/socketService';

const EVENT_LIMIT = 100;

const WATCHED_RESOURCES = [
  {
    resource: 'vms',
    label: 'Desktops',
    actions: ['create', 'update', 'delete', 'power_on', 'power_off', 'suspend']
  },
  {
    resource: 'users',
    label: 'Users',
    actions: ['create', 'update', 'delete']
  },
  {
    resource: 'departments',
    label: 'Departments',
    actions: ['create', 'update', 'delete']
  },
  {
    resource: 'applications',
    label: 'Applications',
    actions: ['create', 'update', 'delete']
  },
  {
    resource: 'firewall',
    label: 'Firewall',
    actions: [
      'generic:assigned',
      'generic:unassigned',
      'generic:assigned:department',
      'generic:unassigned:department',
      'rule:created',
      'rule:updated',
      'rule:deleted',
      'rule:created:department',
      'rule:updated:department',
      'rule:deleted:department'
    ]
  },
  {
    resource: 'scripts',
    label: 'Scripts',
    actions: [
      'create',
      'update',
      'delete',
      'schedule_created',
      'schedule_updated',
      'schedule_cancelled',
      'execution_started',
      'execution_completed',
      'execution_cancelled'
    ]
  },
  {
    resource: 'golden_images',
    label: 'Images',
    actions: ['progress', 'update']
  },
  {
    resource: 'backups',
    label: 'Backups',
    actions: ['create', 'update', 'delete', 'started', 'completed', 'failed']
  },
  {
    resource: 'backup_schedules',
    label: 'Schedules',
    actions: ['create', 'update', 'delete']
  }
];

const RESOURCE_LABELS = Object.fromEntries(
  WATCHED_RESOURCES.map((item) => [item.resource, item.label])
);

function eventTone(event) {
  if (event.status === 'error' || event.action === 'failed') return 'danger';
  if (event.action?.includes('delete') || event.action?.includes('cancel')) return 'warning';
  if (event.action?.includes('complete') || event.action === 'create' || event.action === 'power_on') return 'success';
  return 'info';
}

function eventIcon(event) {
  const tone = eventTone(event);
  if (tone === 'danger') return <XCircle size={14} />;
  if (tone === 'warning') return <AlertTriangle size={14} />;
  if (tone === 'success') return <CheckCircle2 size={14} />;
  return <CircleDot size={14} />;
}

function formatAction(action) {
  return String(action || 'event').replaceAll(':', ' / ').replaceAll('_', ' ');
}

function getEntityLabel(payload) {
  const data = payload?.data || payload || {};
  return (
    data.name ||
    data.vmName ||
    data.machineName ||
    data.scriptName ||
    data.departmentName ||
    data.email ||
    data.id ||
    data.vmId ||
    data.machineId ||
    data.scriptId ||
    'resource'
  );
}

function formatTime(timestamp) {
  if (!timestamp) return 'now';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'now';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function makeEvent(resource, action, payload) {
  const timestamp = payload?.timestamp || new Date().toISOString();
  return {
    id: `${resource}:${action}:${timestamp}:${Math.random().toString(36).slice(2)}`,
    resource,
    action,
    status: payload?.status || 'success',
    timestamp,
    entity: getEntityLabel(payload),
    payload
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [resourceFilter, setResourceFilter] = useState('all');
  const realtime = useRealTimeContext();

  useEffect(() => {
    if (!realtime.isConnected) return undefined;

    const socketService = getSocketService();
    const unsubscribers = WATCHED_RESOURCES.map(({ resource, actions }) =>
      socketService.subscribeToAllResourceEvents(
        resource,
        (action, payload) => {
          const next = makeEvent(resource, action, payload);
          setEvents((current) => [next, ...current].slice(0, EVENT_LIMIT));
        },
        actions
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [realtime.isConnected]);

  const filteredEvents = useMemo(() => {
    if (resourceFilter === 'all') return events;
    return events.filter((event) => event.resource === resourceFilter);
  }, [events, resourceFilter]);

  const timelineEvents = useMemo(
    () =>
      filteredEvents.slice(0, 8).map((event) => ({
        id: event.id,
        title: `${RESOURCE_LABELS[event.resource] || event.resource} ${formatAction(event.action)}`,
        description: event.entity,
        time: formatTime(event.timestamp),
        tone: eventTone(event),
        icon: eventIcon(event)
      })),
    [filteredEvents]
  );

  const columns = useMemo(
    () => [
      {
        id: 'event',
        header: 'Event',
        cell: ({ row }) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <span className="text-fg-muted">{eventIcon(row)}</span>
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium capitalize">{formatAction(row.action)}</span>
              <span className="text-xs text-fg-subtle">{row.entity}</span>
            </ResponsiveStack>
          </ResponsiveStack>
        )
      },
      {
        id: 'resource',
        header: 'Resource',
        width: 150,
        cell: ({ row }) => <Badge tone="neutral">{RESOURCE_LABELS[row.resource] || row.resource}</Badge>
      },
      {
        id: 'status',
        header: 'Status',
        width: 120,
        cell: ({ row }) => (
          <Badge tone={eventTone(row)}>
            {row.status}
          </Badge>
        )
      },
      {
        id: 'time',
        header: 'Time',
        width: 120,
        align: 'right',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-fg-muted">{formatTime(row.timestamp)}</span>
        )
      }
    ],
    []
  );

  const filterOptions = useMemo(
    () => [
      { value: 'all', label: 'All resources' },
      ...WATCHED_RESOURCES.map(({ resource, label }) => ({ value: resource, label }))
    ],
    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Events"
          count={`${filteredEvents.length} visible`}
          description="Live operational events from the current socket session."
          secondary={
            <ResponsiveStack direction="row" gap={2} align="center">
              <StatusDot
                status={realtime.isConnected ? 'online' : realtime.isConnecting ? 'provisioning' : realtime.hasError ? 'degraded' : 'offline'}
                size={8}
              />
              <Button variant="secondary" onClick={() => setEvents([])} disabled={events.length === 0}>
                <RefreshCw size={14} />
                Clear
              </Button>
            </ResponsiveStack>
          }
          filters={
            <Select
              value={resourceFilter}
              onChange={setResourceFilter}
              options={filterOptions}
            />
          }
        />

        <ResponsiveStack
          direction={{ base: 'col', lg: 'row' }}
          gap={4}
          align="stretch"
        >
          <div className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                <ResponsiveStack direction="row" gap={2} align="center">
                  <Activity size={16} className="text-fg-muted" />
                  <span className="text-sm font-medium">Latest events</span>
                </ResponsiveStack>
                <Badge tone={realtime.isConnected ? 'success' : 'warning'}>
                  {realtime.connectionStatus}
                </Badge>
              </ResponsiveStack>

              {timelineEvents.length > 0 ? (
                <Timeline events={timelineEvents} />
              ) : (
                <EmptyState
                  icon={<Clock size={22} />}
                  title="Waiting for events"
                  description={realtime.isConnected ? 'New events will appear here as operators and services make changes.' : 'Connect to the backend socket to start receiving events.'}
                />
              )}
            </ResponsiveStack>
          </div>

          <div className="w-full lg:w-72 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Bell size={16} className="text-fg-muted" />
                <span className="text-sm font-medium">Session buffer</span>
              </ResponsiveStack>
              <ResponsiveStack direction="col" gap={1}>
                <span className="text-2xl font-semibold">{events.length}</span>
                <span className="text-sm text-fg-muted">
                  retained from this browser session, capped at {EVENT_LIMIT}
                </span>
              </ResponsiveStack>
            </ResponsiveStack>
          </div>
        </ResponsiveStack>

        {filteredEvents.length > 0 ? (
          <DataTable
            rows={filteredEvents}
            columns={columns}
            rowId={(row) => row.id}
            defaultDensity="compact"
          />
        ) : null}
      </ResponsiveStack>
    </Page>
  );
}
