import React from 'react';
import HealthTrendsChart from '@/components/vm/health/HealthTrendsChart';

export default {
  title: 'VM/Health/HealthTrendsChart',
  component: HealthTrendsChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'HealthTrendsChart displays historical health metrics with interactive time range selection.'
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
    <HealthTrendsChart {...args} />
  </div>
);

// Default view
export const Default = Template.bind({});
Default.args = {
  vmId: 'vm-default-trends'
};

// Different time ranges
export const LastWeek = Template.bind({});
LastWeek.args = {
  vmId: 'vm-week-trends'
};

export const LastMonth = Template.bind({});
LastMonth.args = {
  vmId: 'vm-month-trends'
};

export const LastQuarter = Template.bind({});
LastQuarter.args = {
  vmId: 'vm-quarter-trends'
};

// Trend patterns
export const ImprovingTrend = () => (
  <div className="space-y-4">
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="text-sm font-medium text-green-900">Improving Health Trend</h3>
      <p className="text-sm text-green-700 mt-1">Health score improved from 65 to 92 over the past week</p>
    </div>
    <HealthTrendsChart vmId="vm-improving" />
  </div>
);

export const DecliningTrend = () => (
  <div className="space-y-4">
    <div className="p-4 bg-red-50 rounded-lg">
      <h3 className="text-sm font-medium text-red-900">Declining Health Trend</h3>
      <p className="text-sm text-red-700 mt-1">Health score decreased from 90 to 68 over the past week</p>
    </div>
    <HealthTrendsChart vmId="vm-declining" />
  </div>
);

export const StableTrend = () => (
  <div className="space-y-4">
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-medium text-blue-900">Stable Health Trend</h3>
      <p className="text-sm text-blue-700 mt-1">Health score remains steady around 85</p>
    </div>
    <HealthTrendsChart vmId="vm-stable-trend" />
  </div>
);

export const VolatileTrend = () => (
  <div className="space-y-4">
    <div className="p-4 bg-yellow-50 rounded-lg">
      <h3 className="text-sm font-medium text-yellow-900">Volatile Health Pattern</h3>
      <p className="text-sm text-yellow-700 mt-1">Health score fluctuating between 60 and 95</p>
    </div>
    <HealthTrendsChart vmId="vm-volatile" />
  </div>
);

// With incident markers
export const WithIncidents = () => (
  <div className="space-y-4">
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-sm font-medium">Health Trends with Incident Markers</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Red markers indicate when critical issues occurred
      </p>
    </div>
    <HealthTrendsChart vmId="vm-incidents" />
  </div>
);

// Multiple metrics
export const MultipleMetrics = () => (
  <div className="space-y-4">
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-sm font-medium">Multiple Metrics View</h3>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-sm">Health Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm">Issues Count</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm">Checks Run</span>
        </div>
      </div>
    </div>
    <HealthTrendsChart vmId="vm-multi-metrics" />
  </div>
);

// Interactive demo
export const InteractiveDemo = () => {
  const [selectedRange, setSelectedRange] = React.useState('7d');
  const [showIssues, setShowIssues] = React.useState(true);
  const [showChecks, setShowChecks] = React.useState(true);
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-3">Interactive Controls</h3>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Time Range</label>
            <select 
              value={selectedRange} 
              onChange={(e) => setSelectedRange(e.target.value)}
              className="px-3 py-1 text-sm border rounded"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Show Metrics</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  checked={showIssues}
                  onChange={(e) => setShowIssues(e.target.checked)}
                />
                <span className="text-sm">Issues</span>
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  checked={showChecks}
                  onChange={(e) => setShowChecks(e.target.checked)}
                />
                <span className="text-sm">Checks</span>
              </label>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3">
          Selected: {selectedRange} | Issues: {showIssues ? 'shown' : 'hidden'} | Checks: {showChecks ? 'shown' : 'hidden'}
        </p>
      </div>
      
      <HealthTrendsChart vmId={`vm-interactive-${selectedRange}`} />
    </div>
  );
};

// Comparison view
export const ComparisonView = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">VM Health Trends Comparison</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Production Server</p>
        <HealthTrendsChart vmId="vm-prod-trends" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Development Server</p>
        <HealthTrendsChart vmId="vm-dev-trends" />
      </div>
    </div>
  </div>
);

// Loading state
export const LoadingState = () => (
  <div className="max-w-6xl">
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
      </div>
      <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
    </div>
  </div>
);

// Empty data
export const NoData = () => (
  <div className="max-w-6xl">
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Health Trends</h3>
      </div>
      <div className="h-64 flex items-center justify-center bg-muted rounded">
        <div className="text-center">
          <p className="text-muted-foreground">No health data available</p>
          <p className="text-sm text-muted-foreground mt-1">Run health checks to see trends</p>
        </div>
      </div>
    </div>
  </div>
);

// Annotations and events
export const WithAnnotations = () => (
  <div className="space-y-4">
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-sm font-medium">Chart with Annotations</h3>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-muted-foreground">🔴 System restart at day 3</p>
        <p className="text-sm text-muted-foreground">🟡 Configuration change at day 5</p>
        <p className="text-sm text-muted-foreground">🟢 Performance optimization at day 7</p>
      </div>
    </div>
    <HealthTrendsChart vmId="vm-annotated" />
  </div>
);

// Export functionality
export const WithExport = () => {
  const handleExport = (format) => {
    console.log(`Exporting chart as ${format}`);
    // Simulate export
    alert(`Chart exported as ${format}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exportable Chart</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => handleExport('PNG')}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Export as PNG
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Export as CSV
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Export as PDF
          </button>
        </div>
      </div>
      <HealthTrendsChart vmId="vm-exportable" />
    </div>
  );
};

// Dark mode support
export const DarkMode = () => (
  <div className="p-6 bg-slate-900 rounded-lg">
    <div className="text-white mb-4">
      <h3 className="text-lg font-semibold">Dark Mode Chart</h3>
      <p className="text-sm text-slate-400">Chart adapts to dark theme</p>
    </div>
    <div className="[&_*]:text-white">
      <HealthTrendsChart vmId="vm-dark-mode" />
    </div>
  </div>
);

// Responsive behavior
export const ResponsiveLayout = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Responsive Chart Behavior</h3>
    <p className="text-sm text-muted-foreground">Resize your browser to see responsive behavior</p>
    
    <div className="grid grid-cols-1 gap-4">
      <div className="border-2 border-dashed rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-2">Full width container</p>
        <HealthTrendsChart vmId="vm-responsive-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Half width on desktop</p>
          <HealthTrendsChart vmId="vm-responsive-half-1" />
        </div>
        <div className="border-2 border-dashed rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Half width on desktop</p>
          <HealthTrendsChart vmId="vm-responsive-half-2" />
        </div>
      </div>
    </div>
  </div>
);