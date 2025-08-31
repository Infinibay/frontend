"use client";

import React from 'react';
import { Download, Shield, HardDrive, Activity, Package, Network } from 'lucide-react';

// Health Dashboard Components
import HealthScoreCard from './HealthScoreCard';
import AutoCheckCard from './AutoCheckCard';
import RemediationSection from './RemediationSection';
import HealthTrendsChart from './HealthTrendsChart';
import CriticalIssuesAlert from './CriticalIssuesAlert';

const HealthDashboard = ({ vmId, vmName }) => {
  return (
    <div className="space-y-6">
      {/* Quick Health Score */}
      <HealthScoreCard vmId={vmId} />
      
      {/* Critical Issues Alert */}
      <CriticalIssuesAlert vmId={vmId} />
      
      {/* Auto-Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AutoCheckCard 
          title="System Updates"
          icon={<Download className="h-5 w-5" />}
          category="updates"
          vmId={vmId}
        />
        <AutoCheckCard 
          title="Security Status"
          icon={<Shield className="h-5 w-5" />}
          category="security"
          vmId={vmId}
        />
        <AutoCheckCard 
          title="Storage Health"
          icon={<HardDrive className="h-5 w-5" />}
          category="storage"
          vmId={vmId}
        />
        <AutoCheckCard 
          title="Performance"
          icon={<Activity className="h-5 w-5" />}
          category="performance"
          vmId={vmId}
        />
        <AutoCheckCard 
          title="Applications"
          icon={<Package className="h-5 w-5" />}
          category="applications"
          vmId={vmId}
        />
        <AutoCheckCard 
          title="Network & Firewall"
          icon={<Network className="h-5 w-5" />}
          category="firewall"
          vmId={vmId}
        />
      </div>
      
      {/* Remediation Actions */}
      <RemediationSection vmId={vmId} />
      
      {/* Historical Trends */}
      <HealthTrendsChart vmId={vmId} />
    </div>
  );
};

export default HealthDashboard;