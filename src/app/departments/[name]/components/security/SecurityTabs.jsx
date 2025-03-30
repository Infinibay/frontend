import React from 'react';
import { Shield, Monitor } from 'lucide-react';

/**
 * SecurityTabs Component
 * Renders the navigation tabs for the security section
 */
const SecurityTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full bg-blue-800 text-white rounded-t-md overflow-hidden">
      <div className="flex">
        <button
          className={`flex items-center px-6 py-3 transition-colors ${
            activeTab === "general" 
              ? "bg-blue-900 border-b-2 border-blue-300" 
              : "bg-blue-700 hover:bg-blue-600"
          }`}
          onClick={() => setActiveTab("general")}
        >
          <Shield className="w-4 h-4 mr-2" />
          <span>General</span>
        </button>
        <button
          className={`flex items-center px-6 py-3 transition-colors ${
            activeTab === "others" 
              ? "bg-blue-900 border-b-2 border-blue-300" 
              : "bg-blue-700 hover:bg-blue-600"
          }`}
          onClick={() => setActiveTab("others")}
        >
          <Monitor className="w-4 h-4 mr-2" />
          <span>Others</span>
        </button>
      </div>
    </div>
  );
};

export default SecurityTabs;
