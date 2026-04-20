'use client';

import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import {
  Alert,
  Badge,
  ResponsiveStack,
  Stat,
} from '@infinibay/harbor';
import {
  calculateNetworkHealth,
  STATUS_MESSAGES,
} from './networkDiagnosticsHelp';

const toneMap = {
  healthy: 'success',
  degraded: 'warning',
  critical: 'danger',
};

const iconMap = {
  healthy: <CheckCircle size={14} />,
  degraded: <AlertTriangle size={14} />,
  critical: <XCircle size={14} />,
};

const NetworkHealthScore = ({ diagnostics }) => {
  const health = calculateNetworkHealth(diagnostics);
  const statusInfo = STATUS_MESSAGES[health.status];
  const tone = toneMap[health.status] || 'info';
  const icon = iconMap[health.status] || <Activity size={14} />;

  const failedCount = health.failedChecks.length;
  const passedCount = health.passedChecks.length;

  return (
    <Alert
      tone={tone}
      icon={icon}
      title={statusInfo.title}
      actions={
        <ResponsiveStack direction="row" gap={2} align="center">
          {passedCount > 0 ? (
            <Badge tone="success" icon={<CheckCircle size={10} />}>
              {passedCount} OK
            </Badge>
          ) : null}
          {failedCount > 0 ? (
            <Badge tone="danger" icon={<XCircle size={10} />}>
              {failedCount} issues
            </Badge>
          ) : null}
          <Stat variant="plain" label="Health" value={health.score} />
        </ResponsiveStack>
      }
    >
      {statusInfo.description}
    </Alert>
  );
};

export default NetworkHealthScore;
