import React from 'react';
import HealthDashboard from '@/components/vm/health/HealthDashboard';
import HealthScoreCard from '@/components/vm/health/HealthScoreCard';
import AutoCheckCard from '@/components/vm/health/AutoCheckCard';
import RemediationCard from '@/components/vm/health/RemediationCard';
import RemediationSection from '@/components/vm/health/RemediationSection';
import CriticalIssuesAlert from '@/components/vm/health/CriticalIssuesAlert';
import HealthTrendsChart from '@/components/vm/health/HealthTrendsChart';
import FirewallStatus from '@/components/vm/health/FirewallStatus';
import HealthIndicatorBadge from '@/components/vm/health/HealthIndicatorBadge';
import { Download, Shield, HardDrive, Activity, Package, Network } from 'lucide-react';

export default {
  title: 'VM/Health Dashboard',
  component: HealthDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete VM Health Dashboard with all components integrated for comprehensive health monitoring, auto-checks, and remediation management.'
      }
    }
  }
};

// Mock data for stories
const mockHealthyVM = {
  id: 'vm-healthy-123',
  name: 'Web Server 01'
};

const mockUnhealthyVM = {
  id: 'vm-critical-456', 
  name: 'Database Server'
};

const mockIssue = {
  id: 'issue-1',
  title: 'Install security updates',
  description: 'Your system has 3 security updates that should be installed to protect against vulnerabilities.',
  severity: 'warning',
  riskLevel: 'low',
  requiresApproval: false,
  estimatedTime: '5-10 minutes',
  expectedImprovement: 'Improved security and stability',
  steps: [
    'Download the latest security patches',
    'Install updates automatically', 
    'Restart services if required',
    'Verify all systems are working properly'
  ]
};

const mockHighRiskIssue = {
  id: 'issue-2',
  title: 'Clean up system files',
  description: 'System files are consuming excessive disk space and may affect performance.',
  severity: 'critical',
  riskLevel: 'high',
  requiresApproval: true,
  approved: false,
  estimatedTime: '10-15 minutes',
  expectedImprovement: 'Free up 5GB of storage space',
  steps: [
    'Scan for large temporary files',
    'Remove old log files safely',
    'Clear system cache',
    'Verify system stability'
  ]
};

// Main Dashboard Stories
export const HealthyVM = {
  args: {
    vmId: mockHealthyVM.id,
    vmName: mockHealthyVM.name
  }
};

export const UnhealthyVM = {
  args: {
    vmId: mockUnhealthyVM.id,
    vmName: mockUnhealthyVM.name
  }
};

// Individual Component Stories
export const HealthScoreCard_Healthy = {
  render: () => (
    <div className="max-w-2xl">
      <HealthScoreCard vmId={mockHealthyVM.id} />
    </div>
  )
};

export const HealthScoreCard_Warning = {
  render: () => (
    <div className="max-w-2xl">
      <HealthScoreCard vmId="vm-warning-789" />
    </div>
  )
};

export const HealthScoreCard_Critical = {
  render: () => (
    <div className="max-w-2xl">
      <HealthScoreCard vmId={mockUnhealthyVM.id} />
    </div>
  )
};

export const AutoCheckCards = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <AutoCheckCard 
        title="System Updates"
        icon={<Download className="h-5 w-5" />}
        category="updates"
        vmId={mockUnhealthyVM.id}
      />
      <AutoCheckCard 
        title="Security Status"
        icon={<Shield className="h-5 w-5" />}
        category="security"
        vmId={mockHealthyVM.id}
      />
      <AutoCheckCard 
        title="Storage Health"
        icon={<HardDrive className="h-5 w-5" />}
        category="storage"
        vmId={mockUnhealthyVM.id}
      />
      <AutoCheckCard 
        title="Performance"
        icon={<Activity className="h-5 w-5" />}
        category="performance"
        vmId="vm-warning-789"
      />
      <AutoCheckCard 
        title="Applications"
        icon={<Package className="h-5 w-5" />}
        category="applications"
        vmId={mockHealthyVM.id}
      />
      <AutoCheckCard 
        title="Network & Firewall"
        icon={<Network className="h-5 w-5" />}
        category="firewall"
        vmId="vm-warning-789"
      />
    </div>
  )
};

export const RemediationCards = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <RemediationCard 
        issue={mockIssue} 
        onApply={(id) => console.log('Apply:', id)}
        onDismiss={(id) => console.log('Dismiss:', id)}
      />
      <RemediationCard 
        issue={mockHighRiskIssue} 
        onApply={(id) => console.log('Apply:', id)}
        onDismiss={(id) => console.log('Dismiss:', id)}
      />
    </div>
  )
};

export const FirewallStatusCard = {
  render: () => (
    <div className="max-w-4xl">
      <FirewallStatus vmId={mockHealthyVM.id} />
    </div>
  )
};

export const HealthIndicatorBadges = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Healthy VM</h3>
        <HealthIndicatorBadge vmId={mockHealthyVM.id} />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Warning VM</h3>
        <HealthIndicatorBadge vmId="vm-warning-789" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Critical VM</h3>
        <HealthIndicatorBadge vmId={mockUnhealthyVM.id} />
      </div>
    </div>
  )
};

export const LoadingStates = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <h3 className="text-lg font-semibold">Loading States</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AutoCheckCard 
          title="Loading Check"
          icon={<Activity className="h-5 w-5" />}
          category="loading"
          vmId="vm-loading"
        />
      </div>
    </div>
  )
};

// Complete dashboard scenarios
export const HealthyVMComplete = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Healthy VM - Complete Dashboard</h2>
      <HealthDashboard vmId="vm-healthy-complete" vmName="Production Server 01" />
    </div>
  )
};

export const VMWithWarnings = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">VM with Warnings - Dashboard View</h2>
      <HealthDashboard vmId="vm-warnings-complete" vmName="Development Server" />
    </div>
  )
};

export const CriticalVMComplete = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Critical VM - Full Dashboard</h2>
      <HealthDashboard vmId="vm-critical-complete" vmName="Database Server" />
    </div>
  )
};

// Interactive dashboard
export const InteractiveDashboard = {
  render: () => {
    const [vmState, setVmState] = React.useState('healthy');
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Interactive Health Dashboard</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setVmState('healthy')}
              className={`px-4 py-2 rounded ${vmState === 'healthy' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Healthy State
            </button>
            <button 
              onClick={() => setVmState('warning')}
              className={`px-4 py-2 rounded ${vmState === 'warning' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
            >
              Warning State
            </button>
            <button 
              onClick={() => setVmState('critical')}
              className={`px-4 py-2 rounded ${vmState === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              Critical State
            </button>
          </div>
        </div>
        <HealthDashboard vmId={`vm-interactive-${vmState}`} vmName="Interactive Test VM" />
      </div>
    );
  }
};

// Different VM types
export const VMTypeComparison = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Different VM Types Comparison</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Windows Server 2022</h3>
          <HealthDashboard vmId="vm-windows-2022" vmName="Windows Server 2022" />
        </div>
        
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Ubuntu 22.04 LTS</h3>
          <HealthDashboard vmId="vm-ubuntu-2204" vmName="Ubuntu Server" />
        </div>
        
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">CentOS 8</h3>
          <HealthDashboard vmId="vm-centos-8" vmName="CentOS Server" />
        </div>
      </div>
    </div>
  )
};

// Real-time monitoring simulation
export const RealTimeMonitoring = {
  render: () => {
    const [healthScore, setHealthScore] = React.useState(85);
    const [issueCount, setIssueCount] = React.useState(2);
    const [lastUpdate, setLastUpdate] = React.useState(new Date());
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setHealthScore(prev => {
          const change = (Math.random() - 0.5) * 10;
          return Math.max(0, Math.min(100, prev + change));
        });
        setIssueCount(Math.floor(Math.random() * 5));
        setLastUpdate(new Date());
      }, 5000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Real-time Monitoring Dashboard</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Score: {Math.round(healthScore)}/100</span>
            <span>Issues: {issueCount}</span>
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <HealthDashboard vmId={`vm-realtime-${Math.round(healthScore)}`} vmName="Real-time VM" />
      </div>
    );
  }
};

// Mobile responsive view
export const MobileView = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone12'
    }
  },
  render: () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mobile Dashboard View</h2>
      <HealthDashboard vmId="vm-mobile" vmName="Mobile Test VM" />
    </div>
  )
};

// Dark mode
export const DarkMode = {
  parameters: {
    backgrounds: { default: 'dark' }
  },
  render: () => (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Dark Mode Dashboard</h2>
      <div className="[&_*]:text-white [&_.text-muted-foreground]:text-slate-400">
        <HealthDashboard vmId="vm-dark" vmName="Dark Mode VM" />
      </div>
    </div>
  )
};

// Performance testing scenario
export const PerformanceScenario = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Performance Testing Scenario</h2>
      <p className="text-muted-foreground mb-4">
        Dashboard with maximum data points and all features enabled
      </p>
      <HealthDashboard vmId="vm-performance-test" vmName="Performance Test VM" />
    </div>
  )
};