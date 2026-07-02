'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import yaml from 'js-yaml';
import {
  Calendar,
  Clock,
  FileCode,
  History,
  Monitor,
  Server,
  Tag as TagIcon,
  Terminal,
  User,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CodeBlock,
  LoadingOverlay,
  Page,
  PropertyList,
  ResponsiveGrid,
  ResponsiveStack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@infinibay/harbor';

import { useDepartmentsQuery, useScriptQuery } from '@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';

import ExecutionLogsTab from './components/ExecutionLogsTab';
import ScheduleTab from './components/ScheduleTab';

// The Script query returns raw YAML in `content`; extract the runnable body the
// same way the editor page does (there is no `parsedContent` field). Kept at
// module scope so the try/catch lives outside the component's useMemo — the
// React compiler cannot preserve memoization around a try/catch inside a hook.
function parseScriptBody(content) {
  if (!content) return '';
  try {
    const parsed = yaml.load(content);
    return parsed?.script || '';
  } catch {
    return '';
  }
}

// OS enum values arrive uppercase (WINDOWS / LINUX). Normalize before comparing
// and render a human-friendly label.
function formatOsLabel(os) {
  const value = String(os || '').toLowerCase();
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const departmentName = params.name;
  const scriptId = params.scriptId;

  const [activeTab, setActiveTab] = useState('overview');

  const { data, loading, error } = useScriptQuery({
    variables: { id: scriptId },
  });

  const { data: departmentsData, loading: departmentLoading } =
    useDepartmentsQuery();

  const script = data?.script;

  const department = useMemo(() => {
    if (!departmentsData?.departments || !departmentName) return null;
    return departmentsData.departments.find(
      (d) => d.name.toLowerCase() === departmentName.toLowerCase(),
    );
  }, [departmentsData, departmentName]);

  const departmentId = department?.id;

  const scriptBody = useMemo(
    () => parseScriptBody(script?.content),
    [script?.content],
  );

  const helpConfig = useMemo(
    () => ({
      title: 'Script Details Help',
      description: 'Understand script configuration and execution',
      icon: <FileCode size={18} />,
      sections: [
        {
          id: 'overview',
          title: 'Overview Tab',
          icon: <FileCode size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>
                View script metadata, configuration, inputs, and full code.
              </span>
            </ResponsiveStack>
          ),
        },
        {
          id: 'schedule',
          title: 'Schedule Tab',
          icon: <Calendar size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>
                Execute immediately or schedule later on selected VMs.
              </span>
            </ResponsiveStack>
          ),
        },
        {
          id: 'logs',
          title: 'Execution Logs Tab',
          icon: <History size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>
                View execution history across all VMs, filter by status, VM,
                and date.
              </span>
            </ResponsiveStack>
          ),
        },
      ],
      quickTips: [
        'Use the Overview tab to verify script configuration',
        'Use the Schedule tab to configure when and where scripts run',
        'View execution history and debug logs in the Execution Logs tab',
      ],
    }),
    [],
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Departments', href: '/departments' },
        {
          label: departmentName || 'Department',
          href: `/departments/${departmentName}`,
        },
        {
          label: 'Scripts',
          href: `/departments/${departmentName}/scripts`,
        },
        { label: script?.name || 'Script', isCurrent: true },
      ],
      title: script?.name || 'Script Details',
      backButton: {
        href: `/departments/${departmentName}/scripts`,
        label: 'Back to Scripts',
      },
      actions: [
        {
          id: 'edit',
          label: 'Edit',
          icon: 'Edit3',
          variant: 'outline',
          size: 'sm',
          onClick: () => router.push(`/scripts/${scriptId}`),
          tooltip: 'Edit script in editor',
        },
      ],
      helpConfig,
      helpTooltip: 'Script details help',
    },
    [departmentName, script?.name, scriptId],
  );

  if (loading) {
    return (
      <Page>
        <LoadingOverlay label="Loading script details…" />
      </Page>
    );
  }

  if (error || !script) {
    return (
      <Page>
        <Alert
          tone="danger"
          title="Script not found"
          icon={<FileCode size={16} />}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/departments/${departmentName}/scripts`)}
            >
              Back to Scripts
            </Button>
          }
        >
          The requested script could not be found.
        </Alert>
      </Page>
    );
  }

  const osList = Array.isArray(script.os)
    ? script.os.filter(Boolean)
    : script.os
      ? [script.os]
      : [];
  const inputCount =
    script.inputCount ?? script.parsedInputs?.length ?? 0;

  const metadataItems = [
    {
      key: 'created',
      label: (
        <ResponsiveStack direction="row" gap={1} align="center">
          <Clock size={12} />
          <span>Created</span>
        </ResponsiveStack>
      ),
      value: new Date(script.createdAt).toLocaleDateString(),
    },
    script.updatedAt && {
      key: 'updated',
      label: (
        <ResponsiveStack direction="row" gap={1} align="center">
          <Clock size={12} />
          <span>Updated</span>
        </ResponsiveStack>
      ),
      value: new Date(script.updatedAt).toLocaleDateString(),
    },
    script.createdBy && {
      key: 'author',
      label: (
        <ResponsiveStack direction="row" gap={1} align="center">
          <User size={12} />
          <span>Created by</span>
        </ResponsiveStack>
      ),
      value:
        [script.createdBy.firstName, script.createdBy.lastName]
          .filter(Boolean)
          .join(' ') ||
        script.createdBy.email ||
        'Unknown',
    },
  ].filter(Boolean);

  return (
    <Page>
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="pill">
        <TabList>
          <Tab value="overview" icon={<FileCode size={12} />}>
            Overview
          </Tab>
          <Tab value="schedule" icon={<Calendar size={12} />}>
            Schedule
          </Tab>
          <Tab value="logs" icon={<History size={12} />}>
            Execution Logs
          </Tab>
        </TabList>

        <TabPanel value="overview">
          <ResponsiveStack direction="col" gap={4}>
            <Card
              variant="default"
              leadingIcon={<FileCode size={18} />}
              leadingIconTone="fuchsia"
              title={script.name}
              description={
                script.description || 'No description provided'
              }
            >
              <ResponsiveStack direction="col" gap={3}>
                {script.tags?.length ? (
                  <ResponsiveStack direction="row" gap={1} wrap>
                    {script.tags.map((tag) => (
                      <Badge
                        key={tag}
                        tone="neutral"
                        icon={<TagIcon size={10} />}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </ResponsiveStack>
                ) : null}
                <PropertyList items={metadataItems} variant="cards" />
              </ResponsiveStack>
            </Card>

            <Card variant="default" title="Configuration">
              <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={4}>
                {osList.length > 0 ? (
                  <ResponsiveStack direction="col" gap={2}>
                    <strong>Operating systems</strong>
                    <ResponsiveStack direction="row" gap={1} wrap>
                      {osList.map((os) => (
                        <Badge
                          key={os}
                          tone="neutral"
                          icon={
                            String(os).toLowerCase() === 'windows' ? (
                              <Monitor size={10} />
                            ) : (
                              <Server size={10} />
                            )
                          }
                        >
                          {formatOsLabel(os)}
                        </Badge>
                      ))}
                    </ResponsiveStack>
                  </ResponsiveStack>
                ) : null}

                <ResponsiveStack direction="col" gap={2}>
                  <strong>Shell type</strong>
                  <ResponsiveStack direction="row" gap={1}>
                    <Badge tone="neutral" icon={<Terminal size={10} />}>
                      {script.shell}
                    </Badge>
                  </ResponsiveStack>
                </ResponsiveStack>

                {script.hasInputs ? (
                  <ResponsiveStack direction="col" gap={2}>
                    <strong>Script inputs</strong>
                    <ResponsiveStack direction="row" gap={1}>
                      <Badge tone="neutral">
                        {inputCount} input
                        {inputCount !== 1 ? 's' : ''} configured
                      </Badge>
                    </ResponsiveStack>
                  </ResponsiveStack>
                ) : null}
              </ResponsiveGrid>
            </Card>

            {script.hasInputs && script.parsedInputs?.length ? (
              <Card
                variant="default"
                title="Script inputs"
                description="Parameters requested when running this script"
              >
                <ResponsiveStack direction="col" gap={2}>
                  {script.parsedInputs.map((input, index) => (
                    <Card
                      key={`${input.name}-${index}`}
                      variant="default"
                      spotlight={false}
                      glow={false}
                    >
                      <ResponsiveGrid columns={{ base: 1, md: 4 }} gap={3}>
                        <ResponsiveStack direction="col" gap={1}>
                          <strong>{input.label || input.name}</strong>
                          {input.description ? (
                            <span>{input.description}</span>
                          ) : null}
                        </ResponsiveStack>
                        <Badge tone="neutral">{input.type}</Badge>
                        <Badge tone={input.required ? 'danger' : 'neutral'}>
                          {input.required ? 'Required' : 'Optional'}
                        </Badge>
                        {input.default ? (
                          <code>{input.default}</code>
                        ) : (
                          <span>—</span>
                        )}
                      </ResponsiveGrid>
                    </Card>
                  ))}
                </ResponsiveStack>
              </Card>
            ) : null}

            <Card variant="default" title="Script content">
              <CodeBlock
                lang={script.shell || 'bash'}
                code={scriptBody || '# No content available'}
              />
            </Card>
          </ResponsiveStack>
        </TabPanel>

        <TabPanel value="schedule">
          {script && departmentId ? (
            <ScheduleTab
              scriptId={scriptId}
              departmentId={departmentId}
              departmentName={departmentName}
              script={script}
            />
          ) : (
            <Alert tone="info" icon={<Calendar size={14} />}>
              {departmentLoading
                ? 'Loading…'
                : 'Unable to load scheduling data.'}
            </Alert>
          )}
        </TabPanel>

        <TabPanel value="logs">
          {script && departmentId ? (
            <ExecutionLogsTab
              scriptId={scriptId}
              departmentId={departmentId}
              departmentName={departmentName}
              script={script}
            />
          ) : (
            <Alert tone="info" icon={<History size={14} />}>
              {departmentLoading
                ? 'Loading…'
                : 'Unable to load execution logs.'}
            </Alert>
          )}
        </TabPanel>
      </Tabs>
    </Page>
  );
}
