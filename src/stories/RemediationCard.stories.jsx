import React from 'react';
import RemediationCard from '@/components/vm/health/RemediationCard';
import { action } from '@storybook/addon-actions';

export default {
  title: 'VM/Health/RemediationCard',
  component: RemediationCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'RemediationCard displays detailed remediation actions with approval workflows and risk assessment.'
      }
    }
  },
  argTypes: {
    onApply: { action: 'apply-remediation' },
    onDismiss: { action: 'dismiss-issue' }
  }
};

// Mock data generators
const createIssue = (overrides = {}) => ({
  id: 'issue-default',
  title: 'Default Issue',
  description: 'This is a default issue description.',
  severity: 'warning',
  riskLevel: 'medium',
  requiresApproval: false,
  estimatedTime: '5-10 minutes',
  expectedImprovement: 'Better system performance',
  steps: [
    'Analyze the issue',
    'Apply the fix',
    'Verify the results'
  ],
  ...overrides
});

// Template
const Template = (args) => (
  <div className="max-w-2xl">
    <RemediationCard {...args} />
  </div>
);

// Low risk remediation
export const LowRiskRemediation = Template.bind({});
LowRiskRemediation.args = {
  issue: createIssue({
    id: 'low-risk-1',
    title: 'Clean temporary files',
    description: 'Temporary files are consuming 3.5 GB of disk space and can be safely removed to improve performance.',
    severity: 'info',
    riskLevel: 'low',
    requiresApproval: false,
    estimatedTime: '2-3 minutes',
    expectedImprovement: 'Free up 3.5 GB of storage',
    steps: [
      'Scan for temporary files in system directories',
      'Remove safe temporary files and caches',
      'Clear browser caches and download history',
      'Update storage usage metrics'
    ]
  }),
  onApply: action('apply-low-risk'),
  onDismiss: action('dismiss-low-risk')
};

// Medium risk remediation
export const MediumRiskRemediation = Template.bind({});
MediumRiskRemediation.args = {
  issue: createIssue({
    id: 'medium-risk-1',
    title: 'Install security updates',
    description: 'Your system has 5 security updates available. These patches address known vulnerabilities and should be installed soon.',
    severity: 'warning',
    riskLevel: 'medium',
    requiresApproval: false,
    estimatedTime: '10-15 minutes',
    expectedImprovement: 'Enhanced security and system stability',
    requiresRestart: true,
    steps: [
      'Download security patches from update server',
      'Create system restore point',
      'Install updates in safe mode',
      'Restart system services',
      'Verify all systems are functioning correctly'
    ]
  }),
  onApply: action('apply-medium-risk'),
  onDismiss: action('dismiss-medium-risk')
};

// High risk remediation
export const HighRiskRemediation = Template.bind({});
HighRiskRemediation.args = {
  issue: createIssue({
    id: 'high-risk-1',
    title: 'Critical system file repair',
    description: 'Critical system files have been detected as corrupted. This repair will restore system integrity but requires careful execution.',
    severity: 'critical',
    riskLevel: 'high',
    requiresApproval: true,
    approved: false,
    estimatedTime: '20-30 minutes',
    expectedImprovement: 'Restore system stability and prevent crashes',
    requiresRestart: true,
    steps: [
      'Create full system backup',
      'Run system file checker in recovery mode',
      'Replace corrupted files from backup',
      'Rebuild system registry',
      'Perform full system scan',
      'Restart and verify system integrity'
    ]
  }),
  onApply: action('apply-high-risk'),
  onDismiss: action('dismiss-high-risk')
};

// Requires approval
export const RequiresApproval = Template.bind({});
RequiresApproval.args = {
  issue: createIssue({
    id: 'approval-1',
    title: 'Optimize startup programs',
    description: 'Several non-essential programs are starting with Windows, increasing boot time by 45 seconds.',
    severity: 'warning',
    riskLevel: 'medium',
    requiresApproval: true,
    approved: false,
    estimatedTime: '5-10 minutes',
    expectedImprovement: '60% faster startup time',
    steps: [
      'Analyze current startup programs',
      'Identify non-essential applications',
      'Disable selected startup items',
      'Configure delayed start for some services',
      'Test new startup configuration'
    ]
  }),
  onApply: action('apply-approval-required'),
  onDismiss: action('dismiss-approval-required')
};

// Approved remediation
export const ApprovedRemediation = Template.bind({});
ApprovedRemediation.args = {
  issue: createIssue({
    id: 'approved-1',
    title: 'Network configuration optimization',
    description: 'Network settings can be optimized to improve connection stability and speed.',
    severity: 'warning',
    riskLevel: 'medium',
    requiresApproval: true,
    approved: true,
    estimatedTime: '5-8 minutes',
    expectedImprovement: '25% faster network performance',
    steps: [
      'Backup current network configuration',
      'Optimize DNS settings',
      'Adjust TCP/IP parameters',
      'Clear DNS cache',
      'Test network connectivity'
    ]
  }),
  onApply: action('apply-approved'),
  onDismiss: action('dismiss-approved')
};

// Multiple remediations grid
export const MultipleRemediations = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <RemediationCard 
      issue={createIssue({
        id: 'multi-1',
        title: 'Windows Defender update',
        description: 'Virus definitions are 5 days old and should be updated.',
        severity: 'warning',
        riskLevel: 'low',
        requiresApproval: false,
        estimatedTime: '2-3 minutes',
        expectedImprovement: 'Latest threat protection'
      })}
      onApply={action('apply-defender')}
      onDismiss={action('dismiss-defender')}
    />
    <RemediationCard 
      issue={createIssue({
        id: 'multi-2',
        title: 'Disk defragmentation needed',
        description: 'Your main drive is 35% fragmented, affecting read/write performance.',
        severity: 'info',
        riskLevel: 'low',
        requiresApproval: false,
        estimatedTime: '30-45 minutes',
        expectedImprovement: '15% faster disk operations'
      })}
      onApply={action('apply-defrag')}
      onDismiss={action('dismiss-defrag')}
    />
    <RemediationCard 
      issue={createIssue({
        id: 'multi-3',
        title: 'Memory leak detected',
        description: 'A process is causing memory leaks. Restart required to clear.',
        severity: 'critical',
        riskLevel: 'medium',
        requiresApproval: false,
        requiresRestart: true,
        estimatedTime: '5 minutes',
        expectedImprovement: 'Recover 2GB of RAM'
      })}
      onApply={action('apply-memory')}
      onDismiss={action('dismiss-memory')}
    />
    <RemediationCard 
      issue={createIssue({
        id: 'multi-4',
        title: 'Registry optimization',
        description: 'Registry contains 1,250 obsolete entries that can be cleaned.',
        severity: 'info',
        riskLevel: 'medium',
        requiresApproval: true,
        approved: false,
        estimatedTime: '10-15 minutes',
        expectedImprovement: 'Faster application launches'
      })}
      onApply={action('apply-registry')}
      onDismiss={action('dismiss-registry')}
    />
  </div>
);

// Different severity levels
export const SeverityLevels = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Issue Severity Levels</h3>
    
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Info - Low Priority</p>
        <RemediationCard 
          issue={createIssue({
            id: 'sev-info',
            title: 'Optional performance tuning',
            description: 'Visual effects can be reduced for better performance.',
            severity: 'info',
            riskLevel: 'low',
            estimatedTime: '2 minutes'
          })}
          onApply={action('apply-info')}
          onDismiss={action('dismiss-info')}
        />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Warning - Medium Priority</p>
        <RemediationCard 
          issue={createIssue({
            id: 'sev-warning',
            title: 'Update recommended',
            description: 'New driver updates are available for your graphics card.',
            severity: 'warning',
            riskLevel: 'medium',
            estimatedTime: '5-10 minutes'
          })}
          onApply={action('apply-warning')}
          onDismiss={action('dismiss-warning')}
        />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Critical - High Priority</p>
        <RemediationCard 
          issue={createIssue({
            id: 'sev-critical',
            title: 'Security breach detected',
            description: 'Suspicious activity detected. Immediate action required.',
            severity: 'critical',
            riskLevel: 'high',
            requiresApproval: true,
            estimatedTime: '15-20 minutes'
          })}
          onApply={action('apply-critical')}
          onDismiss={action('dismiss-critical')}
        />
      </div>
    </div>
  </div>
);

// Loading state
export const LoadingState = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleApply = async (id) => {
    setIsLoading(true);
    action('apply-loading')(id);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsLoading(!isLoading)}
        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
      >
        Toggle Loading State
      </button>
      
      <RemediationCard 
        issue={createIssue({
          id: 'loading-1',
          title: 'Apply Windows Updates',
          description: 'Click Apply Fix to see loading state.',
          severity: 'warning',
          riskLevel: 'medium'
        })}
        onApply={handleApply}
        onDismiss={action('dismiss-loading')}
      />
    </div>
  );
};

// With restart requirement
export const RequiresRestart = () => (
  <div className="space-y-4">
    <RemediationCard 
      issue={createIssue({
        id: 'restart-1',
        title: 'Kernel update available',
        description: 'A critical kernel update requires system restart to complete installation.',
        severity: 'critical',
        riskLevel: 'medium',
        requiresApproval: false,
        requiresRestart: true,
        estimatedTime: '10-15 minutes',
        expectedImprovement: 'Security patches and stability improvements',
        steps: [
          'Download kernel update package',
          'Prepare system for update',
          'Install kernel modules',
          'Configure boot loader',
          'Restart system to apply changes'
        ]
      })}
      onApply={action('apply-restart')}
      onDismiss={action('dismiss-restart')}
    />
  </div>
);

// Automated vs Manual remediation
export const AutomatedVsManual = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Remediation Types</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Automated (One-click fix)</p>
        <RemediationCard 
          issue={createIssue({
            id: 'auto-1',
            title: 'Clear DNS cache',
            description: 'DNS cache is corrupted causing slow website loading.',
            severity: 'warning',
            riskLevel: 'low',
            estimatedTime: '30 seconds',
            steps: null // No manual steps, fully automated
          })}
          onApply={action('apply-automated')}
          onDismiss={action('dismiss-automated')}
        />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Manual (Step-by-step guide)</p>
        <RemediationCard 
          issue={createIssue({
            id: 'manual-1',
            title: 'Configure backup schedule',
            description: 'No automated backup configured for critical data.',
            severity: 'warning',
            riskLevel: 'low',
            estimatedTime: '15-20 minutes',
            steps: [
              'Open Backup Settings',
              'Select folders to backup',
              'Choose backup destination',
              'Set backup schedule',
              'Enable automatic backups',
              'Run initial backup'
            ]
          })}
          onApply={action('apply-manual')}
          onDismiss={action('dismiss-manual')}
        />
      </div>
    </div>
  </div>
);

// Edge cases
export const EdgeCases = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Edge Cases</h3>
    
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Very long description</p>
        <RemediationCard 
          issue={createIssue({
            id: 'edge-long',
            title: 'Complex multi-system issue detected',
            description: 'This is an extremely detailed description of a complex issue that affects multiple system components. The problem originated from a misconfiguration in the network stack that cascaded into the storage subsystem, causing intermittent failures in the application layer. Additionally, the logging system has been overwhelmed with error messages, consuming significant disk space and CPU cycles. The issue has been compounded by outdated drivers that are incompatible with recent Windows updates, leading to periodic blue screen errors during high load conditions.',
            severity: 'critical',
            riskLevel: 'high',
            steps: Array.from({ length: 10 }, (_, i) => `Step ${i + 1}: Detailed action item with comprehensive instructions`)
          })}
          onApply={action('apply-long')}
          onDismiss={action('dismiss-long')}
        />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">No steps provided</p>
        <RemediationCard 
          issue={createIssue({
            id: 'edge-nosteps',
            title: 'Quick auto-fix available',
            description: 'This issue can be resolved automatically.',
            severity: 'info',
            riskLevel: 'low',
            steps: null
          })}
          onApply={action('apply-nosteps')}
          onDismiss={action('dismiss-nosteps')}
        />
      </div>
    </div>
  </div>
);