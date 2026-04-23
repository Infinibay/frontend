'use client';

import { Trash2 } from 'lucide-react';
import {
  Card,
  Badge,
  IconButton,
  PropertyList,
  ResponsiveStack,
  Tooltip,
} from '@infinibay/harbor';

/**
 * TemplateCard — Harbor-native. Presentational card for a template row.
 * Uses PropertyList for the spec line and an IconButton delete affordance
 * (disabled + tooltipped when the template is in use).
 */
export function TemplateCard({ template, onDelete }) {
  const inUse = (template.totalMachines || 0) > 0;

  const deleteBtn = (
    <IconButton
      size="sm"
      variant="ghost"
      label="Delete template"
      icon={<Trash2 size={14} />}
      disabled={inUse}
      onClick={() => !inUse && onDelete?.(template.id)}
    />
  );

  return (
    <Card
      variant="default"
      interactive
      title={template.name}
      description={template.description}
      footer={
        inUse ? (
          <Badge tone="info">
            {template.totalMachines} machine
            {template.totalMachines !== 1 ? 's' : ''} in use
          </Badge>
        ) : null
      }
    >
      <ResponsiveStack direction="col" gap={3}>
        <PropertyList
          items={[
            { key: 'cores', label: 'Cores', value: `${template.cores}` },
            { key: 'ram', label: 'RAM', value: `${template.ram} GB` },
            { key: 'storage', label: 'Storage', value: `${template.storage} GB` },
          ]}
        />
        <ResponsiveStack direction="row" gap={2} justify="end">
          {inUse ? (
            <Tooltip
              content={`In use by ${template.totalMachines} machine${template.totalMachines !== 1 ? 's' : ''}`}
            >
              <span>{deleteBtn}</span>
            </Tooltip>
          ) : (
            deleteBtn
          )}
        </ResponsiveStack>
      </ResponsiveStack>
    </Card>
  );
}
