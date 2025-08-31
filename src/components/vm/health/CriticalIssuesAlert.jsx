"use client";

import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CriticalIssuesAlert = ({ vmId }) => {
  // Mock critical issues - replace with real data
  const criticalIssues = [
    {
      id: 'critical-1',
      title: 'Low disk space',
      description: 'Storage is 95% full and may cause system instability.',
      severity: 'critical',
      canAutoFix: true,
      estimatedTime: '2 minutes'
    }
  ];

  const handleDismiss = (issueId) => {
    // TODO: Implement dismiss functionality
    console.log('Dismissing issue:', issueId);
  };

  const handleQuickFix = (issueId) => {
    // TODO: Implement quick fix functionality
    console.log('Quick fixing issue:', issueId);
  };

  if (criticalIssues.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-red-900">Critical Issues Detected</h3>
              <Badge variant="destructive" className="text-xs">
                {criticalIssues.length} Critical
              </Badge>
            </div>
            
            <div className="space-y-3">
              {criticalIssues.map(issue => (
                <div key={issue.id} className="bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(issue.id)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {issue.estimatedTime} to fix
                    </div>
                    {issue.canAutoFix && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickFix(issue.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Quick Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalIssuesAlert;