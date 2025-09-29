import React from 'react';
import { Shield, Monitor } from 'lucide-react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-security-tabs');

/**
 * VMSecurityTabs Component
 * Renders the navigation tabs for the VM security section
 * Follows the same design pattern as SecurityTabs for departments
 */
const VMSecurityTabs = ({ activeTab, setActiveTab }) => {
  const handleTabChange = (tab) => {
    debug.log('VM security tab changed', { from: activeTab, to: tab });
    setActiveTab(tab);
  };

  return (
    <div className="w-full bg-blue-800 text-white rounded-t-md overflow-hidden">
      <div className="flex">
        <button
          className={`flex items-center px-6 py-3 transition-colors ${
            activeTab === "firewall"
              ? "bg-blue-900 border-b-2 border-blue-300"
              : "bg-blue-700 hover:bg-blue-600"
          }`}
          onClick={() => handleTabChange("firewall")}
        >
          <Shield className="w-4 h-4 mr-2" />
          <span>Firewall</span>
        </button>
        <button
          className={`flex items-center px-6 py-3 transition-colors ${
            activeTab === "overview"
              ? "bg-blue-900 border-b-2 border-blue-300"
              : "bg-blue-700 hover:bg-blue-600"
          }`}
          onClick={() => handleTabChange("overview")}
        >
          <Monitor className="w-4 h-4 mr-2" />
          <span>Overview</span>
        </button>
      </div>
    </div>
  );
};

export default VMSecurityTabs;