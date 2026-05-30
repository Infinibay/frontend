'use client';

import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  Button,
  EmptyState,
  ResponsiveStack,
  Skeleton,
  StatusDot,
} from '@infinibay/harbor';
import { ArrowLeft, Layers } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';

const POOL_DETAIL_QUERY = gql`
  query DepartmentPoolDetail($id: ID!) {
    pool(id: $id) {
      id
      name
      templateId
      goldenImageId
      departmentId
      type
      sizeMin
      sizeMax
      idleTimeoutMinutes
      resetOnLogoff
      draining
      currentSize
      createdAt
      updatedAt
    }
  }
`;

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-32 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>
  );
}

export default function PoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const poolId = String(params.id || '');

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(POOL_DETAIL_QUERY, {
    variables: { id: poolId },
    fetchPolicy: 'cache-and-network',
    skip: !poolId,
  });

  const pool = data?.pool;
  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);

  const deptNameById = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments]
  );
  const templateNameById = useMemo(
    () => Object.fromEntries(templates.map((t) => [t.id, t.name])),
    [templates]
  );

  if (loading && !pool) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <PageHeader
            title="Pool"
            count="loading"
            secondary={
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/pools')}
              >
                Back
              </Button>
            }
          />
          <Skeleton height={220} />
        </ResponsiveStack>
      </Page>
    );
  }

  if (!pool) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <EmptyState
            icon={<Layers size={18} />}
            title={error ? 'Pool unavailable' : 'Pool not found'}
            description={
              error
                ? 'The backend could not load this pool.'
                : 'This pool does not exist or was deleted.'
            }
            actions={
              error ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              ) : (
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/pools')}
              >
                Back
              </Button>
              )
            }
          />
        </ResponsiveStack>
      </Page>
    );
  }

  const departmentName = deptNameById[pool.departmentId] ?? pool.departmentId;
  const templateName = templateNameById[pool.templateId] ?? pool.templateId;
  const typeLabel = pool.type === 'persistent' ? 'Persistent' : 'Non-persistent';
  const targetRange = `${pool.sizeMin} - ${pool.sizeMax}`;

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title={pool.name}
          count={`${departmentName} · ${typeLabel} · ${pool.currentSize} desktop${pool.currentSize !== 1 ? 's' : ''}`}
          secondary={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/pools')}
            >
              Back
            </Button>
          }
        />

        <ResponsiveStack
          direction={{ base: 'col', lg: 'row' }}
          gap={4}
          align="stretch"
        >
          <section className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                <ResponsiveStack direction="row" gap={2} align="center">
                  <Layers size={16} className="text-fg-muted" />
                  <span className="text-sm font-medium">Pool state</span>
                </ResponsiveStack>
                <Badge tone={pool.draining ? 'warning' : 'success'}>
                  {pool.draining ? 'draining' : 'live'}
                </Badge>
              </ResponsiveStack>

              <div className="flex flex-col gap-2 py-1">
                <KV label="Department" value={departmentName} />
                <KV label="Blueprint" value={templateName} />
                <KV label="Golden image" value={pool.goldenImageId || '-'} mono />
                <KV label="Type" value={typeLabel} />
                <KV label="Current size" value={pool.currentSize} mono />
                <KV label="Target range" value={`${targetRange} desktops`} mono />
                <KV
                  label="Idle timeout"
                  value={pool.idleTimeoutMinutes == null ? 'Never' : `${pool.idleTimeoutMinutes} min`}
                  mono={pool.idleTimeoutMinutes != null}
                />
                <KV label="Reset on logoff" value={pool.resetOnLogoff ? 'Yes' : 'No'} />
              </div>
            </ResponsiveStack>
          </section>

          <section className="w-full lg:w-72 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center">
                <StatusDot
                  status={pool.draining ? 'degraded' : pool.currentSize < pool.sizeMin ? 'degraded' : 'online'}
                  size={8}
                />
                <span className="text-sm font-medium">Capacity</span>
              </ResponsiveStack>
              <ResponsiveStack direction="col" gap={1}>
                <span className="text-2xl font-semibold">{pool.currentSize}</span>
                <span className="text-sm text-fg-muted">
                  desktops provisioned, target {targetRange}
                </span>
              </ResponsiveStack>
            </ResponsiveStack>
          </section>
        </ResponsiveStack>
      </ResponsiveStack>
    </Page>
  );
}
