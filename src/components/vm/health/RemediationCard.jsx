"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, X, Info, Clock, TrendingUp, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const RemediationCard = ({ issue, onApply, onDismiss }) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const getRiskBadge = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={`${colors[risk]} border`}>
        Risk: {risk}
      </Badge>
    );
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleApply = async () => {
    if (issue.requiresApproval && !issue.approved) {
      toast({
        title: "Approval Required",
        description: "This remediation requires approval before it can be applied.",
        variant: "warning",
      });
      return;
    }

    setIsApplying(true);
    try {
      await onApply(issue.id);
      toast({
        title: "Remediation Applied",
        description: `${issue.title} has been resolved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Remediation Failed",
        description: error.message || "Failed to apply remediation.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await onDismiss(issue.id);
      toast({
        title: "Issue Dismissed",
        description: `${issue.title} has been dismissed.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Dismiss",
        description: error.message || "Failed to dismiss issue.",
        variant: "destructive",
      });
    } finally {
      setIsDismissing(false);
    }
  };

  const showMoreInfo = (issue) => {
    // TODO: Implement info modal/dialog
    toast({
      title: "More Information",
      description: `Detailed information about ${issue.title}...`,
    });
  };

  return (
    <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getSeverityIcon(issue.severity)}
            <CardTitle className="text-base">{issue.title}</CardTitle>
          </div>
          {getRiskBadge(issue.riskLevel)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Problem Description */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-foreground">What we found:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {issue.description}
          </p>
        </div>
        
        {/* Remediation Steps */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-foreground">How to fix:</h4>
          <ol className="text-sm text-muted-foreground space-y-2">
            {issue.steps && issue.steps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="font-medium mr-3 text-primary min-w-[20px]">{idx + 1}.</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
            {!issue.steps && (
              <li className="flex items-start">
                <span className="font-medium mr-3 text-primary">1.</span>
                <span className="leading-relaxed">Click "Apply Fix" to automatically resolve this issue.</span>
              </li>
            )}
          </ol>
        </div>
        
        {/* Estimated Impact */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <div className="flex items-center">
              <Clock className="w-3 h-3 inline mr-1" />
              <span>Estimated time: {issue.estimatedTime || '2-5 minutes'}</span>
            </div>
            {issue.requiresRestart && (
              <Badge variant="outline" className="text-xs">
                Restart required
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            <span>Expected improvement: {issue.expectedImprovement || 'Better system performance'}</span>
          </div>
        </div>
        
        {/* Approval Notice */}
        {issue.requiresApproval && !issue.approved && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-xs text-yellow-800">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              This action requires approval from an administrator.
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={handleApply}
            disabled={isApplying || (issue.requiresApproval && !issue.approved)}
            className="flex-1"
          >
            {isApplying ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {isApplying ? 'Applying...' : 'Apply Fix'}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDismiss}
            disabled={isDismissing}
          >
            {isDismissing ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            {isDismissing ? 'Dismissing...' : 'Dismiss'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => showMoreInfo(issue)}
          >
            <Info className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RemediationCard;