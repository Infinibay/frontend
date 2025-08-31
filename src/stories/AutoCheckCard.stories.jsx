import React from 'react';
import AutoCheckCard from '@/components/vm/health/AutoCheckCard';
import { Download, Shield, HardDrive, Activity, Package, Network, Database, Clock } from 'lucide-react';

export default {
  title: 'VM/Health/AutoCheckCard',
  component: AutoCheckCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AutoCheckCard displays the status of individual health checks with remediation options.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the health check'
    },
    category: {
      control: 'select',
      options: ['updates', 'security', 'storage', 'performance', 'applications', 'firewall'],
      description: 'Category of the health check'
    },
    vmId: {
      control: 'text',
      description: 'ID of the virtual machine'
    }
  }
};

// Template for creating stories
const Template = (args) => (
  <div className="max-w-md">
    <AutoCheckCard {...args} />
  </div>
);

// Individual state stories
export const HealthyState = Template.bind({});
HealthyState.args = {
  title: 'Security Status',
  icon: <Shield className="h-5 w-5" />,
  category: 'security',
  vmId: 'vm-healthy-001'
};

export const WarningState = Template.bind({});
WarningState.args = {
  title: 'System Updates',
  icon: <Download className="h-5 w-5" />,
  category: 'updates',
  vmId: 'vm-warning-001'
};

export const CriticalState = Template.bind({});
CriticalState.args = {
  title: 'Storage Health',
  icon: <HardDrive className="h-5 w-5" />,
  category: 'storage',
  vmId: 'vm-critical-001'
};

export const CheckingState = Template.bind({});
CheckingState.args = {
  title: 'Performance',
  icon: <Activity className="h-5 w-5" />,
  category: 'performance',
  vmId: 'vm-checking-001'
};
CheckingState.play = async ({ canvasElement }) => {
  // Simulate checking state
  const button = canvasElement.querySelector('button[aria-label*="Check"]');
  if (button) button.click();
};

// Grid of all check categories
export const AllCategories = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <AutoCheckCard 
      title="System Updates"
      icon={<Download className="h-5 w-5" />}
      category="updates"
      vmId="vm-cat-001"
    />
    <AutoCheckCard 
      title="Security Status"
      icon={<Shield className="h-5 w-5" />}
      category="security"
      vmId="vm-cat-002"
    />
    <AutoCheckCard 
      title="Storage Health"
      icon={<HardDrive className="h-5 w-5" />}
      category="storage"
      vmId="vm-cat-003"
    />
    <AutoCheckCard 
      title="Performance"
      icon={<Activity className="h-5 w-5" />}
      category="performance"
      vmId="vm-cat-004"
    />
    <AutoCheckCard 
      title="Applications"
      icon={<Package className="h-5 w-5" />}
      category="applications"
      vmId="vm-cat-005"
    />
    <AutoCheckCard 
      title="Network & Firewall"
      icon={<Network className="h-5 w-5" />}
      category="firewall"
      vmId="vm-cat-006"
    />
  </div>
);

// Different severity combinations
export const MixedStates = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Various Health States</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Healthy</p>
        <AutoCheckCard 
          title="Security Status"
          icon={<Shield className="h-5 w-5" />}
          category="security"
          vmId="vm-healthy"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Warning</p>
        <AutoCheckCard 
          title="System Updates"
          icon={<Download className="h-5 w-5" />}
          category="updates"
          vmId="vm-warning"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Critical</p>
        <AutoCheckCard 
          title="Storage Health"
          icon={<HardDrive className="h-5 w-5" />}
          category="storage"
          vmId="vm-critical"
        />
      </div>
    </div>
  </div>
);

// With different metric displays
export const DetailedMetrics = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <AutoCheckCard 
      title="Storage Analysis"
      icon={<HardDrive className="h-5 w-5" />}
      category="storage"
      vmId="vm-metrics-storage"
    />
    <AutoCheckCard 
      title="Performance Metrics"
      icon={<Activity className="h-5 w-5" />}
      category="performance"
      vmId="vm-metrics-perf"
    />
  </div>
);

// Long running checks
export const LongRunningCheck = () => {
  const [checking, setChecking] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setChecking(!checking)}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
        >
          {checking ? 'Stop Simulation' : 'Simulate Long Check'}
        </button>
        <span className="text-sm text-muted-foreground">
          {checking ? 'Check in progress...' : 'Click to simulate a long-running check'}
        </span>
      </div>
      <AutoCheckCard 
        title="Database Health"
        icon={<Database className="h-5 w-5" />}
        category={checking ? 'checking' : 'performance'}
        vmId="vm-long-check"
      />
    </div>
  );
};

// Recent check times
export const CheckTimings = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Different Check Times</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Just checked</p>
        <AutoCheckCard 
          title="Just Checked"
          icon={<Clock className="h-5 w-5" />}
          category="security"
          vmId="vm-time-now"
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Checked 5 mins ago</p>
        <AutoCheckCard 
          title="Recent Check"
          icon={<Clock className="h-5 w-5" />}
          category="updates"
          vmId="vm-time-5min"
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Checked 1 hour ago</p>
        <AutoCheckCard 
          title="Older Check"
          icon={<Clock className="h-5 w-5" />}
          category="performance"
          vmId="vm-time-1hour"
        />
      </div>
    </div>
  </div>
);

// Interactive demo
export const InteractiveDemo = () => {
  const [lastAction, setLastAction] = React.useState('');
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium">Interactive Demo</p>
        <p className="text-sm text-muted-foreground mt-1">
          Click on cards with issues to see remediation options, or use the "Check Now" button
        </p>
        {lastAction && (
          <p className="text-sm mt-2 text-primary">
            Last action: {lastAction}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onClick={() => setLastAction('Clicked on Storage Health card')}>
          <AutoCheckCard 
            title="Storage Health"
            icon={<HardDrive className="h-5 w-5" />}
            category="storage"
            vmId="vm-interactive-1"
          />
        </div>
        <div onClick={() => setLastAction('Clicked on System Updates card')}>
          <AutoCheckCard 
            title="System Updates"
            icon={<Download className="h-5 w-5" />}
            category="updates"
            vmId="vm-interactive-2"
          />
        </div>
      </div>
    </div>
  );
};

// Loading skeleton state
export const LoadingState = () => (
  <div className="max-w-md">
    <div className="text-sm text-muted-foreground mb-2">Loading state:</div>
    <AutoCheckCard 
      title="Loading..."
      icon={<Activity className="h-5 w-5 animate-pulse" />}
      category="loading"
      vmId="vm-loading"
    />
  </div>
);

// Error state
export const ErrorState = () => (
  <div className="max-w-md">
    <div className="text-sm text-destructive mb-2">Error state:</div>
    <AutoCheckCard 
      title="Check Failed"
      icon={<Shield className="h-5 w-5" />}
      category="error"
      vmId="vm-error"
    />
  </div>
);

// Responsive layout test
export const ResponsiveLayout = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Responsive Layout Test</h3>
    <p className="text-sm text-muted-foreground">Resize your browser to see responsive behavior</p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <AutoCheckCard 
          key={i}
          title={`Check ${i + 1}`}
          icon={<Activity className="h-5 w-5" />}
          category={['updates', 'security', 'storage', 'performance'][i % 4]}
          vmId={`vm-responsive-${i}`}
        />
      ))}
    </div>
  </div>
);