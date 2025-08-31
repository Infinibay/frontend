"use client";

import React, { useState } from 'react';
import { Wrench, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RemediationCard from './RemediationCard';

const RemediationSection = ({ vmId }) => {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState(true);

  // Mock remediation issues - replace with real GraphQL query
  const mockIssues = [
    {
      id: 'remediation-1',
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
      ],
      category: 'updates'
    },
    {
      id: 'remediation-2',
      title: 'Clean up temporary files',
      description: 'Temporary files are taking up 2.8 GB of storage space and can be safely removed.',
      severity: 'info',
      riskLevel: 'low',
      requiresApproval: false,
      estimatedTime: '2-3 minutes',
      expectedImprovement: 'Free up 2.8 GB of storage space',
      steps: [
        'Scan for temporary files',
        'Remove safe temporary files',
        'Clear browser cache and logs',
        'Update storage metrics'
      ],
      category: 'storage'
    },
    {
      id: 'remediation-3',
      title: 'Optimize startup programs',
      description: 'Several non-essential programs are starting with your system, slowing down boot time.',
      severity: 'warning',
      riskLevel: 'medium',
      requiresApproval: true,
      approved: false,
      estimatedTime: '3-5 minutes',
      expectedImprovement: 'Faster startup and better performance',
      steps: [
        'Analyze startup programs',
        'Disable non-essential programs',
        'Keep important system services enabled',
        'Test system startup performance'
      ],
      category: 'performance'
    }
  ];

  const handleApplyRemediation = async (issueId) => {
    try {
      // TODO: Implement actual remediation mutation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Remediation Applied",
        description: "The fix has been applied successfully.",
      });
      
      // TODO: Refresh health data
    } catch (error) {
      toast({
        title: "Remediation Failed",
        description: error.message || "Failed to apply remediation.",
        variant: "destructive",
      });
    }
  };

  const handleDismissIssue = async (issueId) => {
    try {
      // TODO: Implement dismiss mutation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Issue Dismissed",
        description: "The issue has been dismissed.",
      });
      
      // TODO: Remove from list
    } catch (error) {
      toast({
        title: "Failed to Dismiss",
        description: error.message || "Failed to dismiss issue.",
        variant: "destructive",
      });
    }
  };

  const handleApplyAll = async () => {
    const autoFixableIssues = mockIssues.filter(issue => 
      !issue.requiresApproval || issue.approved
    );

    if (autoFixableIssues.length === 0) {
      toast({
        title: "No Auto-Fixable Issues",
        description: "All remaining issues require manual approval.",
        variant: "warning",
      });
      return;
    }

    try {
      // TODO: Implement batch remediation
      toast({
        title: "Applying All Fixes",
        description: `Applying ${autoFixableIssues.length} automatic fixes...`,
      });
      
      // Simulate batch processing
      for (const issue of autoFixableIssues) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "All Fixes Applied",
        description: "All automatic fixes have been applied successfully.",
      });
    } catch (error) {
      toast({
        title: "Batch Fix Failed",
        description: error.message || "Some fixes failed to apply.",
        variant: "destructive",
      });
    }
  };

  if (mockIssues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-green-600" />
            <CardTitle className="text-green-700">No Issues Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Great! Your virtual machine is running smoothly with no issues requiring attention.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5" />
            <CardTitle>Recommended Actions</CardTitle>
            <Badge variant="outline" className="ml-2">
              {mockIssues.length} {mockIssues.length === 1 ? 'issue' : 'issues'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyAll}
              disabled={mockIssues.every(issue => issue.requiresApproval && !issue.approved)}
            >
              Apply All Safe Fixes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSection(!expandedSection)}
            >
              {expandedSection ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          These actions can help improve your VM's performance and security.
        </p>
      </CardHeader>
      
      {expandedSection && (
        <CardContent className="space-y-4">
          {mockIssues.map(issue => (
            <RemediationCard
              key={issue.id}
              issue={issue}
              onApply={handleApplyRemediation}
              onDismiss={handleDismissIssue}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default RemediationSection;