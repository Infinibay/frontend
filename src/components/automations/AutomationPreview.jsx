'use client';

/**
 * AutomationPreview Component
 *
 * Displays a plain language description of what the automation does.
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles } from 'lucide-react';

/**
 * Converts generated code to plain language description.
 * This is a simplified heuristic-based parser.
 */
function codeToPlainLanguage(code) {
  if (!code || code.includes('// Empty workspace') || code.includes('// No blocks')) {
    return {
      summary: 'This automation has no logic yet.',
      details: ['Add blocks to create your rule.'],
    };
  }

  const details = [];
  let hasConditions = false;
  let hasTrigger = false;

  // Check for health conditions
  if (code.includes('cpuUsagePercent')) {
    details.push('Checks CPU usage percentage');
    hasConditions = true;
  }
  if (code.includes('usedMemoryKB') || code.includes('totalMemoryKB')) {
    details.push('Checks memory usage');
    hasConditions = true;
  }
  if (code.includes('getDiskUsagePercent') || code.includes('getDiskFreeGB')) {
    details.push('Checks disk space');
    hasConditions = true;
  }
  if (code.includes('defender.isEnabled')) {
    details.push('Checks if Windows Defender is enabled');
    hasConditions = true;
  }
  if (code.includes('defender.threatCount')) {
    details.push('Checks for detected threats');
    hasConditions = true;
  }
  if (code.includes('updates.pendingCount')) {
    details.push('Checks pending Windows updates');
    hasConditions = true;
  }
  if (code.includes('updates.daysSinceLastUpdate')) {
    details.push('Checks time since last update');
    hasConditions = true;
  }
  if (code.includes('isProcessRunning')) {
    details.push('Checks if a process is running');
    hasConditions = true;
  }
  if (code.includes('getProcessCPU')) {
    details.push('Checks CPU usage of a specific process');
    hasConditions = true;
  }

  // Check for comparison operators
  if (code.includes('>') && !code.includes('>=')) {
    details.push('Uses "greater than" comparison');
  }
  if (code.includes('<') && !code.includes('<=')) {
    details.push('Uses "less than" comparison');
  }
  if (code.includes('>=')) {
    details.push('Uses "greater than or equal" comparison');
  }
  if (code.includes('<=')) {
    details.push('Uses "less than or equal" comparison');
  }

  // Check for logic
  if (code.includes('&&')) {
    details.push('Requires ALL conditions to be true (AND)');
  }
  if (code.includes('||')) {
    details.push('Triggers if ANY condition is true (OR)');
  }

  // Check for trigger action
  if (code.includes('return true')) {
    details.push('Will create a recommendation when conditions match');
    hasTrigger = true;
  }
  if (code.includes('setSeverity')) {
    const severityMatch = code.match(/setSeverity\(['"](\w+)['"]\)/);
    if (severityMatch) {
      details.push(`Sets severity to ${severityMatch[1]}`);
    }
  }

  // Generate summary
  let summary = '';
  if (!hasConditions && !hasTrigger) {
    summary = 'Building automation logic...';
  } else if (hasConditions && !hasTrigger) {
    summary = 'Conditions defined, but no trigger action yet.';
    details.push('Add a "Trigger automation" block to complete');
  } else if (hasConditions && hasTrigger) {
    summary = 'Automation is ready to evaluate conditions.';
  } else {
    summary = 'Triggers immediately (no conditions).';
  }

  return { summary, details };
}

export function AutomationPreview({ code }) {
  const { summary, details } = useMemo(() => codeToPlainLanguage(code), [code]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          What this automation does
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-2">{summary}</p>
        {details.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {detail}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default AutomationPreview;
