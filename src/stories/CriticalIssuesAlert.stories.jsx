import React from 'react';
import CriticalIssuesAlert from '@/components/vm/health/CriticalIssuesAlert';
import { action } from '@storybook/addon-actions';

export default {
  title: 'VM/Health/CriticalIssuesAlert',
  component: CriticalIssuesAlert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'CriticalIssuesAlert displays urgent issues that require immediate attention.'
      }
    }
  },
  argTypes: {
    vmId: {
      control: 'text',
      description: 'Virtual machine ID'
    }
  }
};

// Template
const Template = (args) => (
  <div className="max-w-4xl">
    <CriticalIssuesAlert {...args} />
  </div>
);

// No critical issues (hidden state)
export const NoIssues = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Component is hidden when there are no critical issues
    </p>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p className="text-gray-500">No critical issues - Alert not displayed</p>
    </div>
  </div>
);

// Single critical issue
export const SingleIssue = Template.bind({});
SingleIssue.args = {
  vmId: 'vm-single-critical'
};

// Multiple critical issues
export const MultipleIssues = Template.bind({});
MultipleIssues.args = {
  vmId: 'vm-multiple-critical'
};

// Different severity levels
export const MixedSeverities = () => (
  <div className="space-y-4">
    <div>
      <p className="text-sm font-medium mb-2">Security Breach</p>
      <CriticalIssuesAlert vmId="vm-security-breach" />
    </div>
    
    <div>
      <p className="text-sm font-medium mb-2">System Failure</p>
      <CriticalIssuesAlert vmId="vm-system-failure" />
    </div>
    
    <div>
      <p className="text-sm font-medium mb-2">Resource Exhaustion</p>
      <CriticalIssuesAlert vmId="vm-resource-exhaustion" />
    </div>
  </div>
);

// With auto-fix options
export const WithAutoFix = () => (
  <div className="space-y-4">
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-sm">These critical issues can be automatically resolved</p>
    </div>
    <CriticalIssuesAlert vmId="vm-autofix-available" />
  </div>
);

// Without auto-fix options
export const ManualFixOnly = () => (
  <div className="space-y-4">
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-sm">These critical issues require manual intervention</p>
    </div>
    <CriticalIssuesAlert vmId="vm-manual-fix" />
  </div>
);

// Real-time alert simulation
export const RealTimeAlert = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [issueCount, setIssueCount] = React.useState(0);
  
  const addCriticalIssue = () => {
    setIssueCount(prev => prev + 1);
    setShowAlert(true);
  };
  
  const clearIssues = () => {
    setIssueCount(0);
    setShowAlert(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={addCriticalIssue}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded"
        >
          Add Critical Issue
        </button>
        <button 
          onClick={clearIssues}
          className="px-3 py-1 text-sm border rounded"
        >
          Clear All Issues
        </button>
        <span className="px-3 py-1 text-sm">
          Issues: {issueCount}
        </span>
      </div>
      
      {showAlert ? (
        <CriticalIssuesAlert vmId={`vm-realtime-${issueCount}`} />
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No critical issues</p>
        </div>
      )}
    </div>
  );
};

// Dismissible alerts
export const DismissibleAlert = () => {
  const [dismissed, setDismissed] = React.useState(false);
  
  if (dismissed) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Alert dismissed</p>
          <button 
            onClick={() => setDismissed(false)}
            className="mt-2 px-3 py-1 text-sm border rounded"
          >
            Show Alert Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded"
        aria-label="Dismiss"
      >
        ✕
      </button>
      <CriticalIssuesAlert vmId="vm-dismissible" />
    </div>
  );
};

// With countdown timer
export const WithCountdown = () => {
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-red-900">Critical Issue Requires Action</p>
          <span className="text-sm font-mono text-red-700">
            Time remaining: {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <CriticalIssuesAlert vmId="vm-countdown" />
    </div>
  );
};

// Expandable details
export const ExpandableDetails = () => {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <CriticalIssuesAlert vmId="vm-expandable" />
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-primary hover:underline"
      >
        {expanded ? 'Hide Details' : 'Show Details'}
      </button>
      
      {expanded && (
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="text-sm font-medium">Detailed Information</h4>
          <p className="text-sm text-muted-foreground">
            Error Code: CRIT_001
          </p>
          <p className="text-sm text-muted-foreground">
            First Detected: 5 minutes ago
          </p>
          <p className="text-sm text-muted-foreground">
            Affected Components: Storage, Database, Cache
          </p>
          <p className="text-sm text-muted-foreground">
            Recommended Action: Immediate restart required
          </p>
        </div>
      )}
    </div>
  );
};

// Multiple VMs comparison
export const MultipleVMs = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Critical Issues Across VMs</h3>
    
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium mb-2">Production Server</p>
        <CriticalIssuesAlert vmId="vm-prod-critical" />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Database Server</p>
        <CriticalIssuesAlert vmId="vm-db-critical" />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Web Server</p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">No critical issues</p>
        </div>
      </div>
    </div>
  </div>
);

// Loading state
export const LoadingState = () => (
  <div className="max-w-4xl">
    <div className="border border-red-200 bg-red-50 rounded-lg p-4 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 bg-red-300 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-red-200 h-5 w-48 rounded"></div>
          <div className="bg-red-200 h-4 w-full rounded"></div>
          <div className="bg-red-200 h-4 w-3/4 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Interactive priority sorting
export const PrioritySorting = () => {
  const [sortBy, setSortBy] = React.useState('severity');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Critical Issues</h3>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 text-sm border rounded"
        >
          <option value="severity">Sort by Severity</option>
          <option value="time">Sort by Time</option>
          <option value="impact">Sort by Impact</option>
        </select>
      </div>
      
      <CriticalIssuesAlert vmId={`vm-sorted-${sortBy}`} />
    </div>
  );
};

// With action history
export const WithActionHistory = () => {
  const [history, setHistory] = React.useState([]);
  
  const handleAction = (action, issue) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev, { action, issue, timestamp }]);
  };
  
  return (
    <div className="space-y-4">
      <div onClick={() => handleAction('dismiss', 'Low disk space')}>
        <CriticalIssuesAlert vmId="vm-with-history" />
      </div>
      
      {history.length > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Action History</h4>
          <div className="space-y-1">
            {history.map((item, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                {item.timestamp} - {item.action}: {item.issue}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Notification styles
export const NotificationStyles = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Different Alert Styles</h3>
    
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Banner Style</p>
        <CriticalIssuesAlert vmId="vm-banner" />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Toast Style</p>
        <div className="fixed bottom-4 right-4 max-w-md shadow-lg z-50">
          <CriticalIssuesAlert vmId="vm-toast" />
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <p className="text-gray-500 text-sm">Toast appears in bottom-right</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Inline Style</p>
        <div className="inline-block">
          <CriticalIssuesAlert vmId="vm-inline" />
        </div>
      </div>
    </div>
  </div>
);