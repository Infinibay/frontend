import React from 'react';
import HealthScoreCard from '@/components/vm/health/HealthScoreCard';

export default {
  title: 'VM/Health/HealthScoreCard',
  component: HealthScoreCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'HealthScoreCard displays the overall health score of a VM with trend indicators and issue counts.'
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
  <div className="max-w-2xl">
    <HealthScoreCard {...args} />
  </div>
);

// Health score states
export const ExcellentHealth = Template.bind({});
ExcellentHealth.args = {
  vmId: 'vm-excellent-95'
};

export const GoodHealth = Template.bind({});
GoodHealth.args = {
  vmId: 'vm-good-85'
};

export const FairHealth = Template.bind({});
FairHealth.args = {
  vmId: 'vm-fair-65'
};

export const PoorHealth = Template.bind({});
PoorHealth.args = {
  vmId: 'vm-poor-45'
};

export const CriticalHealth = Template.bind({});
CriticalHealth.args = {
  vmId: 'vm-critical-25'
};

// Trend variations
export const TrendingUp = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Health Improving</h3>
    <p className="text-sm text-muted-foreground">Score increased from 72 to 85</p>
    <HealthScoreCard vmId="vm-trending-up" />
  </div>
);

export const TrendingDown = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Health Declining</h3>
    <p className="text-sm text-muted-foreground">Score decreased from 88 to 75</p>
    <HealthScoreCard vmId="vm-trending-down" />
  </div>
);

export const StableTrend = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Health Stable</h3>
    <p className="text-sm text-muted-foreground">Score remained at 80</p>
    <HealthScoreCard vmId="vm-stable" />
  </div>
);

// Issue counts
export const NoIssues = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Perfect Health - No Issues</h3>
    <HealthScoreCard vmId="vm-no-issues" />
  </div>
);

export const WithWarnings = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Health with Warnings</h3>
    <p className="text-sm text-muted-foreground">3 warning issues detected</p>
    <HealthScoreCard vmId="vm-warnings" />
  </div>
);

export const WithCriticalIssues = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Health with Critical Issues</h3>
    <p className="text-sm text-muted-foreground">2 critical, 3 warning issues</p>
    <HealthScoreCard vmId="vm-critical-issues" />
  </div>
);

// Different time periods
export const RecentCheck = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Recently Checked</h3>
    <p className="text-sm text-muted-foreground">Last check: Just now</p>
    <HealthScoreCard vmId="vm-recent" />
  </div>
);

export const OldCheck = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Outdated Check</h3>
    <p className="text-sm text-muted-foreground">Last check: 2 days ago</p>
    <HealthScoreCard vmId="vm-old-check" />
  </div>
);

// Loading state
export const LoadingState = () => (
  <div className="max-w-2xl">
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-200 h-6 w-32 rounded"></div>
        <div className="bg-gray-200 h-8 w-20 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-200 h-16 w-full rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-200 h-12 rounded"></div>
          <div className="bg-gray-200 h-12 rounded"></div>
          <div className="bg-gray-200 h-12 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Interactive demo
export const InteractiveDemo = () => {
  const [score, setScore] = React.useState(85);
  const [trend, setTrend] = React.useState('stable');
  const [issues, setIssues] = React.useState({ critical: 0, warning: 2, info: 1 });
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted rounded-lg space-y-4">
        <h4 className="text-sm font-medium">Interactive Controls</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Health Score</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">{score}/100</span>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Trend</label>
            <select 
              value={trend} 
              onChange={(e) => setTrend(e.target.value)}
              className="w-full px-3 py-1 text-sm border rounded"
            >
              <option value="up">Trending Up</option>
              <option value="stable">Stable</option>
              <option value="down">Trending Down</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Issues</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="0" 
                max="10"
                value={issues.critical}
                onChange={(e) => setIssues({...issues, critical: Number(e.target.value)})}
                className="w-16 px-2 py-1 text-sm border rounded"
                placeholder="Crit"
              />
              <input 
                type="number" 
                min="0" 
                max="10"
                value={issues.warning}
                onChange={(e) => setIssues({...issues, warning: Number(e.target.value)})}
                className="w-16 px-2 py-1 text-sm border rounded"
                placeholder="Warn"
              />
              <input 
                type="number" 
                min="0" 
                max="10"
                value={issues.info}
                onChange={(e) => setIssues({...issues, info: Number(e.target.value)})}
                className="w-16 px-2 py-1 text-sm border rounded"
                placeholder="Info"
              />
            </div>
          </div>
        </div>
      </div>
      
      <HealthScoreCard vmId={`vm-interactive-${score}-${trend}`} />
    </div>
  );
};

// Comparison view
export const ComparisonView = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">VM Health Comparison</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Production Server</p>
        <HealthScoreCard vmId="vm-prod" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Development Server</p>
        <HealthScoreCard vmId="vm-dev" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Test Server</p>
        <HealthScoreCard vmId="vm-test" />
      </div>
    </div>
  </div>
);

// Real-time updates simulation
export const RealTimeUpdates = () => {
  const [currentScore, setCurrentScore] = React.useState(85);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const simulateHealthCheck = () => {
    setIsUpdating(true);
    
    // Simulate checking
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 30) + 70; // Random between 70-100
      setCurrentScore(newScore);
      setIsUpdating(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Real-time Health Check</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Current Score: {currentScore}/100
            </p>
          </div>
          <button 
            onClick={simulateHealthCheck}
            disabled={isUpdating}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            {isUpdating ? 'Checking...' : 'Run Health Check'}
          </button>
        </div>
      </div>
      
      <HealthScoreCard vmId={`vm-realtime-${currentScore}`} />
    </div>
  );
};

// Historical comparison
export const HistoricalView = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Health Score History</h3>
    
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Today</span>
        <div className="flex-1">
          <HealthScoreCard vmId="vm-today" />
        </div>
      </div>
      
      <div className="flex items-center gap-4 opacity-75">
        <span className="text-sm font-medium w-24">Yesterday</span>
        <div className="flex-1">
          <HealthScoreCard vmId="vm-yesterday" />
        </div>
      </div>
      
      <div className="flex items-center gap-4 opacity-50">
        <span className="text-sm font-medium w-24">Last Week</span>
        <div className="flex-1">
          <HealthScoreCard vmId="vm-lastweek" />
        </div>
      </div>
    </div>
  </div>
);

// Edge cases
export const EdgeCases = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Edge Cases</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Score: 0 (Worst case)</p>
        <HealthScoreCard vmId="vm-score-0" />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Score: 100 (Perfect)</p>
        <HealthScoreCard vmId="vm-score-100" />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">No data available</p>
        <HealthScoreCard vmId="vm-no-data" />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Error state</p>
        <HealthScoreCard vmId="vm-error" />
      </div>
    </div>
  </div>
);