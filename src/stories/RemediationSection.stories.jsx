import React from 'react';
import RemediationSection from '@/components/vm/health/RemediationSection';
import { action } from '@storybook/addon-actions';

export default {
  title: 'VM/Health/RemediationSection',
  component: RemediationSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'RemediationSection displays a collection of remediation actions organized by priority and category.'
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
  <div className="max-w-6xl">
    <RemediationSection {...args} />
  </div>
);

// Default state with multiple issues
export const Default = Template.bind({});
Default.args = {
  vmId: 'vm-default-001'
};

// No issues state
export const NoIssues = () => {
  // Custom implementation to show no issues
  const MockRemediationSection = () => (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Remediation Actions</h3>
        <span className="text-sm text-muted-foreground">0 issues found</span>
      </div>
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-medium">All systems healthy</p>
        <p className="text-sm text-muted-foreground mt-1">No remediation actions required at this time</p>
      </div>
    </div>
  );
  
  return <MockRemediationSection />;
};

// Single issue
export const SingleIssue = Template.bind({});
SingleIssue.args = {
  vmId: 'vm-single-issue'
};

// Multiple critical issues
export const CriticalIssues = Template.bind({});
CriticalIssues.args = {
  vmId: 'vm-critical-issues'
};

// Mixed severity issues
export const MixedSeverity = Template.bind({});
MixedSeverity.args = {
  vmId: 'vm-mixed-severity'
};

// With approval pending
export const ApprovalPending = Template.bind({});
ApprovalPending.args = {
  vmId: 'vm-approval-pending'
};

// Loading state
export const LoadingState = () => (
  <div className="max-w-6xl">
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Remediation Actions</h3>
        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2">
                <div className="bg-gray-200 h-5 w-48 rounded"></div>
                <div className="bg-gray-200 h-4 w-64 rounded"></div>
              </div>
              <div className="bg-gray-200 h-6 w-16 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-3 w-full rounded"></div>
              <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Grouped by category
export const GroupedByCategory = () => (
  <div className="max-w-6xl space-y-6">
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Remediation Actions by Category</h3>
      
      {/* Security Issues */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Security (2 issues)
        </h4>
        <div className="space-y-3 pl-4">
          <RemediationSection vmId="vm-security-issues" />
        </div>
      </div>
      
      {/* Performance Issues */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Performance (3 issues)
        </h4>
        <div className="space-y-3 pl-4">
          <RemediationSection vmId="vm-performance-issues" />
        </div>
      </div>
      
      {/* Storage Issues */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Storage (1 issue)
        </h4>
        <div className="space-y-3 pl-4">
          <RemediationSection vmId="vm-storage-issues" />
        </div>
      </div>
    </div>
  </div>
);

// Interactive filter/sort
export const InteractiveFilters = () => {
  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState('severity');
  
  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 text-sm border rounded"
            >
              <option value="all">All Issues</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings Only</option>
              <option value="info">Info Only</option>
              <option value="approved">Approved Only</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mr-2">Sort by:</label>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1 text-sm border rounded"
            >
              <option value="severity">Severity</option>
              <option value="risk">Risk Level</option>
              <option value="time">Estimated Time</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing: {filter} | Sorted by: {sort}
        </div>
      </div>
      
      <RemediationSection vmId={`vm-filtered-${filter}-${sort}`} />
    </div>
  );
};

// Batch actions
export const BatchActions = () => {
  const [selectedIssues, setSelectedIssues] = React.useState([]);
  
  const toggleIssue = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };
  
  return (
    <div className="max-w-6xl space-y-4">
      <div className="p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Batch Actions Demo</h4>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
              disabled={selectedIssues.length === 0}
              onClick={() => action('batch-apply')(selectedIssues)}
            >
              Apply Selected ({selectedIssues.length})
            </button>
            <button 
              className="px-3 py-1 text-sm border rounded"
              onClick={() => setSelectedIssues([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Click checkboxes to select issues for batch operations
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Select Issues for Batch Action</h3>
        <div className="space-y-3">
          {['issue-1', 'issue-2', 'issue-3'].map((id) => (
            <div key={id} className="flex items-start gap-3 p-3 border rounded">
              <input 
                type="checkbox"
                checked={selectedIssues.includes(id)}
                onChange={() => toggleIssue(id)}
                className="mt-1"
              />
              <div className="flex-1">
                <RemediationSection vmId={`vm-batch-${id}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Real-time updates simulation
export const RealTimeUpdates = () => {
  const [issues, setIssues] = React.useState(['issue-1', 'issue-2', 'issue-3']);
  const [lastAction, setLastAction] = React.useState('');
  
  const addIssue = () => {
    const newIssue = `issue-${Date.now()}`;
    setIssues([...issues, newIssue]);
    setLastAction(`Added new issue: ${newIssue}`);
  };
  
  const removeIssue = (id) => {
    setIssues(issues.filter(i => i !== id));
    setLastAction(`Removed issue: ${id}`);
  };
  
  return (
    <div className="max-w-6xl space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Real-time Updates Simulation</h4>
          <button 
            onClick={addIssue}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
          >
            Add New Issue
          </button>
        </div>
        {lastAction && (
          <p className="text-sm text-primary">Last action: {lastAction}</p>
        )}
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Live Issues ({issues.length})
        </h3>
        
        {issues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No issues detected. Click "Add New Issue" to simulate.
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((id) => (
              <div key={id} className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm font-medium">{id}</span>
                <button 
                  onClick={() => removeIssue(id)}
                  className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Progress tracking
export const ProgressTracking = () => {
  const [progress, setProgress] = React.useState({});
  
  const startRemediation = (issueId) => {
    setProgress(prev => ({ ...prev, [issueId]: 0 }));
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const current = prev[issueId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return { ...prev, [issueId]: 'completed' };
        }
        return { ...prev, [issueId]: current + 10 };
      });
    }, 500);
  };
  
  return (
    <div className="max-w-6xl space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium mb-2">Progress Tracking Demo</h4>
        <p className="text-sm text-muted-foreground">
          Click "Start" to simulate remediation progress
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Remediation Progress</h3>
        
        <div className="space-y-4">
          {['cleanup', 'updates', 'optimization'].map((id) => (
            <div key={id} className="p-4 border rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {id.charAt(0).toUpperCase() + id.slice(1)} Task
                </span>
                {progress[id] === 'completed' ? (
                  <span className="text-sm text-green-600">✓ Completed</span>
                ) : progress[id] !== undefined ? (
                  <span className="text-sm text-muted-foreground">{progress[id]}%</span>
                ) : (
                  <button 
                    onClick={() => startRemediation(id)}
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
                  >
                    Start
                  </button>
                )}
              </div>
              
              {progress[id] !== undefined && progress[id] !== 'completed' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress[id]}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};