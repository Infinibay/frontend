'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';

/**
 * NoFirewallRulesWarning - Warning component shown when no firewall rules exist
 *
 * Follows Infinibay philosophy: Guide users without being preachy
 * Recommends "Desktop Secure" template as a safe starting point
 */
const NoFirewallRulesWarning = ({ onApplyTemplate, isForDepartment = false, isApplying = false }) => {
  const scope = isForDepartment ? 'all VMs in this department' : 'this VM';
  const scopeTitle = isForDepartment ? 'Department VMs' : 'VM';

  return (
    <div className="glass-minimal p-6 rounded-lg border-2 border-orange-300 dark:border-orange-700">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <span>No Internet Connectivity</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>{scopeTitle} has no firewall rules configured.</strong> Without rules, {scope} cannot connect to the internet or communicate with other systems.
          </p>

          {/* Recommendation box */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Recommended: Start with "Desktop Secure"
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  This profile provides secure internet access with HTTPS and DNS enabled, plus RDP for remote access.
                  It's a safe starting point that you can customize later.
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onApplyTemplate}
            disabled={isApplying}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors size-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying template...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Apply Desktop Secure Template</span>
              </>
            )}
          </button>

          {/* Alternative actions */}
          {!isApplying && (
            <p className="text-xs text-muted-foreground mt-3">
              You can also browse other security profiles below or create custom rules manually.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoFirewallRulesWarning;
