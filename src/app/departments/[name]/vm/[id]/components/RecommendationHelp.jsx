import {
  AlertTriangle,
  Calendar,
  HelpCircle,
  Info,
  Shield,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Bento,
  BentoItem,
  Card,
  Progress,
  PropertyList,
  ResponsiveStack,
  Stat,
  Tooltip,
} from '@infinibay/harbor';
import {
  extractRecommendationMetadata,
  getRecommendationInfo,
} from '@/utils/recommendationTypeMapper';

const priorityBadgeTone = (priority) => {
  switch (priority) {
    case 'critical':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'neutral';
    default:
      return 'neutral';
  }
};

const priorityLabel = (priority) => {
  if (priority === 'critical') return 'Critical';
  if (priority === 'high') return 'High';
  if (priority === 'medium') return 'Medium';
  if (priority === 'low') return 'Low';
  return '';
};

const rebootTone = (days) => {
  if (days >= 7) return 'rose';
  if (days >= 3) return 'amber';
  return 'amber';
};

const renderStructuredData = (recommendation) => {
  const meta = extractRecommendationMetadata(recommendation);
  if (!meta) return null;

  switch (recommendation.type) {
    case 'OS_UPDATE_AVAILABLE':
    case 'SYSTEM_UPDATE_AVAILABLE':
      return (
        <ResponsiveStack direction="col" gap={4}>
          {meta.rebootDays !== null && meta.rebootDays !== undefined ? (
            <Alert
              tone="warning"
              icon={<AlertTriangle size={14} />}
              title="Pending reboot"
            >
              <ResponsiveStack direction="col" gap={2}>
                <span>
                  {meta.rebootDays} day{meta.rebootDays !== 1 ? 's' : ''} since
                  last reboot
                </span>
                <Progress
                  value={Math.min(100, (meta.rebootDays / 7) * 100)}
                  max={100}
                  tone={rebootTone(meta.rebootDays)}
                  valueSlot={`${meta.rebootDays}d / 7d`}
                />
              </ResponsiveStack>
            </Alert>
          ) : null}

          <Bento columns={{ base: 1, md: 3 }} gap={12}>
            {meta.totalUpdates > 0 ? (
              <BentoItem>
                <Stat label="Total" value={meta.totalUpdates} />
              </BentoItem>
            ) : null}
            {meta.securityCount > 0 ? (
              <BentoItem>
                <Stat
                  label="Security"
                  value={meta.securityCount}
                  icon={<Shield size={12} />}
                />
              </BentoItem>
            ) : null}
            {meta.criticalCount > 0 ? (
              <BentoItem>
                <Stat
                  label="Critical"
                  value={meta.criticalCount}
                  icon={<AlertTriangle size={12} />}
                />
              </BentoItem>
            ) : null}
          </Bento>

          {meta.lastReboot ? (
            <Badge tone="neutral" icon={<Calendar size={12} />}>
              Last reboot: {new Date(meta.lastReboot).toLocaleDateString('en-US')}
            </Badge>
          ) : null}

          {meta.updates && meta.updates.length > 0 ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Pending updates"
              description={
                meta.updates.length > 5
                  ? `Showing 5 of ${meta.updates.length}`
                  : undefined
              }
            >
              <ResponsiveStack direction="col" gap={2}>
                {meta.updates.slice(0, 5).map((update, idx) => (
                  <Card
                    key={idx}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    title={
                      <ResponsiveStack direction="row" gap={2} align="center">
                        <span>{update.title}</span>
                        {update.isSecurity ? (
                          <Badge tone="danger">Security</Badge>
                        ) : null}
                      </ResponsiveStack>
                    }
                    description={update.kb ? `KB: ${update.kb}` : undefined}
                  />
                ))}
              </ResponsiveStack>
            </Card>
          ) : null}
        </ResponsiveStack>
      );

    case 'APP_UPDATE_AVAILABLE': {
      const securityApps = meta.affectedApps?.filter((a) => a.isSecurity) || [];
      const regularApps = meta.affectedApps?.filter((a) => !a.isSecurity) || [];
      return (
        <ResponsiveStack direction="col" gap={4}>
          <Bento columns={{ base: 1, md: 2 }} gap={12}>
            {meta.securityUpdateCount > 0 ? (
              <BentoItem>
                <Stat
                  label="Security updates"
                  value={meta.securityUpdateCount}
                  icon={<Shield size={12} />}
                />
              </BentoItem>
            ) : null}
            {meta.totalApps > 0 ? (
              <BentoItem>
                <Stat label="Affected apps" value={meta.totalApps} />
              </BentoItem>
            ) : null}
          </Bento>

          {securityApps.length > 0 ? (
            <Alert
              tone="danger"
              icon={<Shield size={14} />}
              title="Security updates"
            >
              <ResponsiveStack direction="col" gap={2}>
                {securityApps.slice(0, 5).map((app, idx) => (
                  <ResponsiveStack
                    key={idx}
                    direction="row"
                    gap={2}
                    align="center"
                  >
                    <span>{app.name}</span>
                    {app.currentVersion && app.newVersion ? (
                      <Badge tone="neutral">
                        {app.currentVersion} → {app.newVersion}
                      </Badge>
                    ) : null}
                  </ResponsiveStack>
                ))}
                {securityApps.length > 5 ? (
                  <span>… and {securityApps.length - 5} more</span>
                ) : null}
              </ResponsiveStack>
            </Alert>
          ) : null}

          {regularApps.length > 0 ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Other updates"
            >
              <ResponsiveStack direction="col" gap={2}>
                {regularApps.slice(0, 3).map((app, idx) => (
                  <ResponsiveStack
                    key={idx}
                    direction="row"
                    gap={2}
                    align="center"
                  >
                    <span>{app.name}</span>
                    {app.currentVersion && app.newVersion ? (
                      <Badge tone="neutral">
                        {app.currentVersion} → {app.newVersion}
                      </Badge>
                    ) : null}
                  </ResponsiveStack>
                ))}
                {regularApps.length > 3 ? (
                  <span>… and {regularApps.length - 3} more</span>
                ) : null}
              </ResponsiveStack>
            </Card>
          ) : null}
        </ResponsiveStack>
      );
    }

    case 'PORT_BLOCKED':
      return (
        <ResponsiveStack direction="col" gap={3}>
          {meta.blockedPorts && meta.blockedPorts.length > 0 ? (
            <>
              {meta.blockedPorts.map((portInfo, idx) => (
                <Card
                  key={idx}
                  variant="default"
                  spotlight={false}
                  glow={false}
                  title={
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <span>
                        Port {portInfo.port} ({portInfo.protocol})
                      </span>
                      {portInfo.processName ? (
                        <Badge tone="neutral">{portInfo.processName}</Badge>
                      ) : null}
                    </ResponsiveStack>
                  }
                >
                  <PropertyList
                    items={[
                      portInfo.processId && {
                        key: 'pid',
                        label: 'Process ID',
                        value: portInfo.processId,
                      },
                      portInfo.ruleName && {
                        key: 'rule',
                        label: 'Rule',
                        value: portInfo.ruleName,
                      },
                      portInfo.lastAttempt && {
                        key: 'last',
                        label: 'Last attempt',
                        value: new Date(portInfo.lastAttempt).toLocaleString('en-US'),
                      },
                    ].filter(Boolean)}
                  />
                </Card>
              ))}
              <Alert tone="info" icon={<Info size={14} />} title="Guide">
                These ports are blocked by firewall rules. Use the &quot;Configure
                Firewall&quot; button to review and adjust rules as needed.
              </Alert>
            </>
          ) : null}
        </ResponsiveStack>
      );

    case 'DEFENDER_THREAT':
      return (
        <ResponsiveStack direction="col" gap={4}>
          <Bento columns={{ base: 1, md: 2 }} gap={12}>
            {meta.activeThreats > 0 ? (
              <BentoItem>
                <Stat
                  label="Active threats"
                  value={meta.activeThreats}
                  icon={<AlertTriangle size={12} />}
                />
              </BentoItem>
            ) : null}
            {meta.quarantinedThreats > 0 ? (
              <BentoItem>
                <Stat label="Quarantined" value={meta.quarantinedThreats} />
              </BentoItem>
            ) : null}
          </Bento>

          {meta.threats && meta.threats.length > 0 ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Detected threats"
            >
              <ResponsiveStack direction="col" gap={2}>
                {meta.threats.map((threat, idx) => (
                  <Card
                    key={idx}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    title={
                      <ResponsiveStack direction="row" gap={2} align="center" wrap>
                        <span>{threat.name}</span>
                        <Badge
                          tone={
                            threat.severity === 'Critical' ||
                            threat.severity === 'High'
                              ? 'danger'
                              : 'neutral'
                          }
                        >
                          {threat.severity}
                        </Badge>
                        <Badge
                          tone={threat.status === 'Active' ? 'danger' : 'neutral'}
                        >
                          {threat.status}
                        </Badge>
                      </ResponsiveStack>
                    }
                    description={threat.path}
                  >
                    {threat.detectionTime ? (
                      <Badge tone="neutral">
                        Detected:{' '}
                        {new Date(threat.detectionTime).toLocaleDateString('en-US')}
                      </Badge>
                    ) : null}
                  </Card>
                ))}
              </ResponsiveStack>
            </Card>
          ) : null}

          {meta.lastScan ? (
            <Badge tone="neutral" icon={<Shield size={12} />}>
              Last scan: {new Date(meta.lastScan).toLocaleString('en-US')}
            </Badge>
          ) : null}
        </ResponsiveStack>
      );

    case 'UNDER_PROVISIONED':
    case 'OVER_PROVISIONED': {
      const isUnder = recommendation.type === 'UNDER_PROVISIONED';
      return (
        <ResponsiveStack direction="col" gap={4}>
          {meta.currentCPU !== null &&
          meta.recommendedCPU !== null &&
          meta.currentCPU !== undefined &&
          meta.recommendedCPU !== undefined ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="CPU"
            >
              <ResponsiveStack direction="col" gap={2}>
                <Progress
                  label="Current"
                  value={
                    (meta.currentCPU /
                      Math.max(meta.currentCPU, meta.recommendedCPU)) *
                    100
                  }
                  max={100}
                  tone="sky"
                  valueSlot={`${meta.currentCPU} cores`}
                />
                <Progress
                  label="Recommended"
                  value={
                    (meta.recommendedCPU /
                      Math.max(meta.currentCPU, meta.recommendedCPU)) *
                    100
                  }
                  max={100}
                  tone="purple"
                  valueSlot={`${meta.recommendedCPU} cores`}
                />
                {isUnder && meta.currentCPU < meta.recommendedCPU ? (
                  <Badge tone="warning">
                    Increase by {meta.recommendedCPU - meta.currentCPU} cores
                  </Badge>
                ) : null}
                {!isUnder && meta.currentCPU > meta.recommendedCPU ? (
                  <Badge tone="info">
                    Reduce by {meta.currentCPU - meta.recommendedCPU} cores
                  </Badge>
                ) : null}
              </ResponsiveStack>
            </Card>
          ) : null}

          {meta.currentRAM !== null &&
          meta.recommendedRAM !== null &&
          meta.currentRAM !== undefined &&
          meta.recommendedRAM !== undefined ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="RAM"
            >
              <ResponsiveStack direction="col" gap={2}>
                <Progress
                  label="Current"
                  value={
                    (meta.currentRAM /
                      Math.max(meta.currentRAM, meta.recommendedRAM)) *
                    100
                  }
                  max={100}
                  tone="sky"
                  valueSlot={`${meta.currentRAM} GB`}
                />
                <Progress
                  label="Recommended"
                  value={
                    (meta.recommendedRAM /
                      Math.max(meta.currentRAM, meta.recommendedRAM)) *
                    100
                  }
                  max={100}
                  tone="purple"
                  valueSlot={`${meta.recommendedRAM} GB`}
                />
                {isUnder && meta.currentRAM < meta.recommendedRAM ? (
                  <Badge tone="warning">
                    Increase by {meta.recommendedRAM - meta.currentRAM} GB
                  </Badge>
                ) : null}
                {!isUnder && meta.currentRAM > meta.recommendedRAM ? (
                  <Badge tone="info">
                    Reduce by {meta.currentRAM - meta.recommendedRAM} GB
                  </Badge>
                ) : null}
              </ResponsiveStack>
            </Card>
          ) : null}
        </ResponsiveStack>
      );
    }

    default:
      return null;
  }
};

const RecommendationHelp = ({
  recommendationType,
  recommendation = null,
  showDetailed = false,
}) => {
  const info = getRecommendationInfo(recommendationType, recommendation);

  const explanation =
    typeof info.userFriendlyExplanation === 'function'
      ? info.userFriendlyExplanation(recommendation)
      : info.userFriendlyExplanation;

  if (!showDetailed) {
    return (
      <Tooltip content={explanation}>
        <span>
          <HelpCircle size={14} />
        </span>
      </Tooltip>
    );
  }

  const IconComp = info.icon;

  return (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      leadingIcon={IconComp ? <IconComp size={18} /> : undefined}
      leadingIconTone={priorityBadgeTone(info.priority) === 'danger' ? 'rose' : 'purple'}
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <span>{info.label}</span>
          <Badge tone={priorityBadgeTone(info.priority)}>
            {priorityLabel(info.priority)}
          </Badge>
        </ResponsiveStack>
      }
      description={info.description}
    >
      <ResponsiveStack direction="col" gap={4}>
        <Alert
          tone={priorityBadgeTone(info.priority)}
          icon={<Info size={14} />}
          title="What does this mean?"
        >
          {explanation}
        </Alert>

        {info.actions && info.actions.length > 0 ? (
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="What can I do?"
          >
            <ResponsiveStack direction="col" gap={1}>
              {info.actions.map((action, index) => (
                <span key={index}>• {action}</span>
              ))}
            </ResponsiveStack>
          </Card>
        ) : null}

        {recommendation?.data ? (
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Additional information"
          >
            {renderStructuredData(recommendation) ?? (
              <pre>
                {typeof recommendation.data === 'string'
                  ? recommendation.data
                  : JSON.stringify(recommendation.data, null, 2)}
              </pre>
            )}
          </Card>
        ) : null}

        <Accordion>
          <AccordionItem value="tech" title="View technical details">
            <ResponsiveStack direction="col" gap={2}>
              <span>Technical description</span>
              <span>{info.detailedDescription}</span>
              {info.technicalDetails ? (
                <>
                  <span>Additional details</span>
                  <span>{info.technicalDetails}</span>
                </>
              ) : null}
            </ResponsiveStack>
          </AccordionItem>
        </Accordion>

        {recommendation?.createdAt ? (
          <Badge tone="neutral">
            Detected: {new Date(recommendation.createdAt).toLocaleString('en-US')}
          </Badge>
        ) : null}
      </ResponsiveStack>
    </Card>
  );
};

export const RecommendationsGeneralHelp = () => (
  <Accordion>
    <AccordionItem
      value="general"
      title="What are recommendations?"
      icon={<HelpCircle size={14} />}
    >
      <ResponsiveStack direction="col" gap={4}>
        <span>
          Recommendations are automatic suggestions to keep your virtual machine
          running optimally, securely and efficiently.
        </span>

        <ResponsiveStack direction={{ base: 'col', md: 'row' }} gap={4}>
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Recommendation types"
          >
            <ResponsiveStack direction="col" gap={2}>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="danger">Critical</Badge>
                <span>Require immediate attention</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="warning">High</Badge>
                <span>Should be resolved soon</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="info">Medium</Badge>
                <span>Improve performance</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="neutral">Low</Badge>
                <span>Optional optimizations</span>
              </ResponsiveStack>
            </ResponsiveStack>
          </Card>

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Categories"
          >
            <ResponsiveStack direction="col" gap={1}>
              <span>Security — protection and antivirus</span>
              <span>Performance — system speed</span>
              <span>Storage — disk space</span>
              <span>Updates — software updates</span>
              <span>Maintenance — preventive care</span>
            </ResponsiveStack>
          </Card>
        </ResponsiveStack>

        <Alert tone="info" icon={<Info size={14} />} title="Tip">
          Recommendations are updated automatically. Check this section regularly
          to keep your VM in optimal condition.
        </Alert>
      </ResponsiveStack>
    </AccordionItem>
  </Accordion>
);

export default RecommendationHelp;
