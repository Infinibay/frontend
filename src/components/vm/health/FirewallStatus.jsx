"use client";

import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Lock, Unlock, Eye, EyeOff, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Custom hook for firewall status (placeholder for now)
const useFirewallStatus = (vmId) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - replace with real GraphQL query
  const mockData = {
    isSecure: true,
    lastCheck: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
    services: [
      {
        id: 'ssh',
        name: 'ssh',
        displayName: 'SSH Remote Access',
        explanation: 'Allows secure remote terminal access to your virtual machine. Enable this if you need to connect remotely.',
        enabled: true,
        ports: ['22'],
        riskLevel: 'medium',
        category: 'remote'
      },
      {
        id: 'http',
        name: 'http',
        displayName: 'Web Server (HTTP)',
        explanation: 'Allows your VM to serve websites over HTTP. Enable if running web applications.',
        enabled: false,
        ports: ['80'],
        riskLevel: 'low',
        category: 'web'
      },
      {
        id: 'https',
        name: 'https',
        displayName: 'Secure Web Server (HTTPS)',
        explanation: 'Allows your VM to serve secure websites over HTTPS. Recommended for web applications.',
        enabled: true,
        ports: ['443'],
        riskLevel: 'low',
        category: 'web'
      },
      {
        id: 'rdp',
        name: 'rdp',
        displayName: 'Remote Desktop',
        explanation: 'Allows graphical remote desktop access to Windows VMs. Enable for remote desktop connections.',
        enabled: false,
        ports: ['3389'],
        riskLevel: 'medium',
        category: 'remote'
      },
      {
        id: 'ftp',
        name: 'ftp',
        displayName: 'File Transfer (FTP)',
        explanation: 'Allows file transfer access to your VM. Consider using SFTP for better security.',
        enabled: false,
        ports: ['21'],
        riskLevel: 'high',
        category: 'file'
      }
    ],
    rules: [
      {
        id: 'rule-1',
        name: 'Allow SSH from office network',
        description: 'Permits SSH connections from the office IP range',
        source: '192.168.1.0/24',
        destination: 'VM',
        ports: '22',
        action: 'ACCEPT',
        enabled: true
      },
      {
        id: 'rule-2',
        name: 'Block all external FTP',
        description: 'Blocks FTP connections from external networks for security',
        source: '0.0.0.0/0',
        destination: 'VM',
        ports: '21',
        action: 'DROP',
        enabled: true
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Enable automatic security updates',
        description: 'Keep your system secure by automatically installing security patches.',
        priority: 'high'
      },
      {
        id: 'rec-2',
        title: 'Use strong passwords',
        description: 'Ensure all user accounts have strong, unique passwords.',
        priority: 'medium'
      },
      {
        id: 'rec-3',
        title: 'Regular security scans',
        description: 'Schedule weekly security scans to detect vulnerabilities early.',
        priority: 'low'
      }
    ]
  };

  const toggleService = async (serviceId, enabled) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual service toggle mutation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update service status
    } catch (error) {
      console.error('Failed to toggle service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firewallData: mockData,
    isLoading,
    toggleService
  };
};

const FirewallStatus = ({ vmId }) => {
  const { toast } = useToast();
  const { firewallData, isLoading, toggleService } = useFirewallStatus(vmId);

  const ServiceExplanation = ({ service }) => {
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async (checked) => {
      setIsToggling(true);
      try {
        await toggleService(service.id, checked);
        toast({
          title: `Service ${checked ? 'Enabled' : 'Disabled'}`,
          description: `${service.displayName} has been ${checked ? 'enabled' : 'disabled'}.`,
        });
      } catch (error) {
        toast({
          title: "Failed to Update Service",
          description: error.message || "Failed to update service status.",
          variant: "destructive",
        });
      } finally {
        setIsToggling(false);
      }
    };

    const getRiskColor = (risk) => {
      switch (risk) {
        case 'low': return 'text-green-600';
        case 'medium': return 'text-yellow-600';
        case 'high': return 'text-red-600';
        default: return 'text-muted-foreground';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="mt-1">
          {service.enabled ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-muted-foreground opacity-60" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{service.displayName}</h4>
            <Switch
              checked={service.enabled}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            {service.explanation}
          </p>
          <div className="flex items-center gap-3 text-xs">
            {service.ports && (
              <span className="text-muted-foreground">
                Ports: {service.ports.join(', ')}
              </span>
            )}
            <span className={`font-medium ${getRiskColor(service.riskLevel)}`}>
              {service.riskLevel} risk
            </span>
          </div>
        </div>
      </div>
    );
  };

  const SimpleRulesList = ({ rules }) => (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        These rules control network traffic to and from your VM. Green rules allow traffic, red rules block it.
      </p>
      {rules.map(rule => (
        <div key={rule.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
          <div className="flex-shrink-0">
            {rule.action === 'ACCEPT' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{rule.name}</h4>
            <p className="text-xs text-muted-foreground">{rule.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>From: {rule.source}</span>
              <span>•</span>
              <span>Port: {rule.ports}</span>
              <span>•</span>
              <span className={rule.action === 'ACCEPT' ? 'text-green-600' : 'text-red-600'}>
                {rule.action === 'ACCEPT' ? 'Allow' : 'Block'}
              </span>
            </div>
          </div>
          <Switch
            checked={rule.enabled}
            onCheckedChange={(checked) => {
              // TODO: Implement rule toggle
              toast({
                title: "Rule Updated",
                description: `${rule.name} has been ${checked ? 'enabled' : 'disabled'}.`,
              });
            }}
            size="sm"
          />
        </div>
      ))}
    </div>
  );

  const SecurityRecommendations = ({ vmId }) => (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Follow these recommendations to improve your VM's security posture.
      </p>
      {firewallData.recommendations.map(rec => (
        <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
          <div className="flex-shrink-0 mt-1">
            {rec.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-600" />}
            {rec.priority === 'medium' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
            {rec.priority === 'low' && <Info className="w-4 h-4 text-blue-600" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium">{rec.title}</h4>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  rec.priority === 'high' ? 'border-red-200 text-red-700' :
                  rec.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                  'border-blue-200 text-blue-700'
                }`}
              >
                {rec.priority} priority
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rec.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading && !firewallData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Firewall & Network Security</CardTitle>
          </div>
          <Badge className={firewallData.isSecure ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {firewallData.isSecure ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Secure
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                Review Needed
              </>
            )}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Control network access and security settings for your virtual machine.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Tips
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-2 mt-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Network Services</h3>
              <p className="text-sm text-muted-foreground">
                Control which services can communicate with your VM. 
                Green checkmarks mean the service is allowed and accessible.
              </p>
            </div>
            <div className="space-y-1">
              {firewallData.services.map(service => (
                <ServiceExplanation key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Firewall Rules</h3>
            </div>
            <SimpleRulesList rules={firewallData.rules} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Security Recommendations</h3>
            </div>
            <SecurityRecommendations vmId={vmId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FirewallStatus;