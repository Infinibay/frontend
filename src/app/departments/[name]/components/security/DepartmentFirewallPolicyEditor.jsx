'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Shield, ShieldOff, Edit2, RefreshCw, AlertTriangle, Globe, Lock, Unlock, ShieldPlus, ShieldMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateDepartmentFirewallPolicyMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:department-firewall-policy-editor');

const POLICY_CONFIG = {
  BLOCK_ALL: {
    label: 'Block All',
    description: 'Blocks all traffic except what you explicitly allow. Recommended for production.',
    icon: Shield,
    badgeVariant: 'destructive',
    configs: {
      allow_outbound: {
        label: 'Allow all outbound connections',
        description: 'VMs can connect to internet and external services without restrictions.',
        icon: Globe,
      },
      allow_internet: {
        label: 'Allow Internet',
        description: 'Only HTTP/HTTPS (ports 80, 443) and DNS. Required for installing systems like Fedora.',
        icon: Globe,
      },
      block_all: {
        label: 'Block all',
        description: 'Blocks all traffic. May cause issues with automatic OS installation.',
        icon: Lock,
        isRisky: true,
      },
    },
  },
  ALLOW_ALL: {
    label: 'Allow All',
    description: 'Allows all traffic except what you explicitly block. Useful for development environments.',
    icon: ShieldOff,
    badgeVariant: 'success',
    configs: {
      none: {
        label: 'No blocks',
        description: 'No initial blocks, VMs will be more exposed. Consider adding rules later.',
        icon: Unlock,
        isRisky: true,
      },
      block_ssh: {
        label: 'Block SSH/SFTP',
        description: 'Blocks SSH and SFTP (ports 22, 21) for increased security.',
        icon: Lock,
      },
      block_smb: {
        label: 'Block SMB',
        description: 'Blocks SMB protocol (port 445) for file sharing.',
        icon: Lock,
      },
      block_databases: {
        label: 'Block Databases',
        description: 'Blocks MySQL, PostgreSQL, MongoDB and other database ports.',
        icon: Lock,
      },
    },
  },
};

const getDefaultConfigForPolicy = (policy) => {
  if (policy === 'BLOCK_ALL') return 'allow_outbound';
  return 'none';
};

const DepartmentFirewallPolicyEditor = ({ department }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(department?.firewallPolicy || 'BLOCK_ALL');
  const [selectedConfig, setSelectedConfig] = useState(department?.firewallDefaultConfig || 'allow_outbound');

  const [updatePolicy, { loading }] = useUpdateDepartmentFirewallPolicyMutation();

  const currentPolicy = department?.firewallPolicy || 'BLOCK_ALL';
  const currentConfig = department?.firewallDefaultConfig || 'allow_outbound';
  const policyInfo = POLICY_CONFIG[currentPolicy];
  const configInfo = policyInfo?.configs[currentConfig];

  const hasChanges = selectedPolicy !== currentPolicy || selectedConfig !== currentConfig;
  const selectedPolicyInfo = POLICY_CONFIG[selectedPolicy];
  const selectedConfigInfo = selectedPolicyInfo?.configs[selectedConfig];
  const isRiskyConfig = selectedConfigInfo?.isRisky;

  const handleOpenEditDialog = () => {
    setSelectedPolicy(currentPolicy);
    setSelectedConfig(currentConfig);
    setIsEditDialogOpen(true);
  };

  const handlePolicyChange = (newPolicy) => {
    setSelectedPolicy(newPolicy);
    setSelectedConfig(getDefaultConfigForPolicy(newPolicy));
  };

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    debug.log('Updating firewall policy', { departmentId: department.id, selectedPolicy, selectedConfig });

    // Close dialogs first for better UX
    setIsConfirmDialogOpen(false);
    setIsEditDialogOpen(false);

    try {
      await updatePolicy({
        variables: {
          departmentId: department.id,
          input: {
            firewallPolicy: selectedPolicy,
            firewallDefaultConfig: selectedConfig,
          },
        },
      });

      toast.success('Firewall policy updated. The subnet is restarting...');
    } catch (error) {
      debug.error('Error updating firewall policy', error);
      toast.error(`Error updating policy: ${error.message}`);
    }
  };

  if (!department) {
    return null;
  }

  const PolicyIcon = policyInfo?.icon || Shield;

  return (
    <>
      {/* Current Policy Display Card */}
      <div className="glass-medium size-padding rounded-xl shadow-elevation-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${currentPolicy === 'BLOCK_ALL' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              <PolicyIcon className={`size-icon ${currentPolicy === 'BLOCK_ALL' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="size-heading font-semibold">Firewall Policy</h3>
                <Badge variant={policyInfo?.badgeVariant || 'secondary'}>
                  {policyInfo?.label || currentPolicy}
                </Badge>
              </div>
              <p className="size-text text-muted-foreground mt-1">
                {configInfo?.label || currentConfig}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-0.5">
                {configInfo?.description}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleOpenEditDialog}>
            <Edit2 className="size-icon mr-2" />
            Edit Policy
          </Button>
        </div>
      </div>

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Firewall Policy</DialogTitle>
            <DialogDescription>
              Define the default firewall behavior. &apos;Block All&apos; is more secure and recommended for most cases.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {/* Block All Policy - Accordion Style */}
            <div
              className={`rounded-lg border transition-all duration-200 ${
                selectedPolicy === 'BLOCK_ALL'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handlePolicyChange('BLOCK_ALL')}
              >
                <RadioGroup value={selectedPolicy} onValueChange={handlePolicyChange}>
                  <RadioGroupItem value="BLOCK_ALL" id="policy-block" />
                </RadioGroup>
                <div className="flex-1">
                  <Label htmlFor="policy-block" className="font-medium cursor-pointer flex items-center gap-2">
                    <Shield className="size-4 text-red-600" />
                    Block All
                    <Badge variant="outline" className="ml-2">Recommended</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {POLICY_CONFIG.BLOCK_ALL.description}
                  </p>
                </div>
              </div>

              {/* Nested exceptions for Block All */}
              {selectedPolicy === 'BLOCK_ALL' && (
                <div className="px-3 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="ml-6 pl-3 border-l-2 border-primary/30">
                    <Label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ShieldPlus className="size-3 text-green-600" />
                      Allow these exceptions:
                    </Label>
                    <RadioGroup value={selectedConfig} onValueChange={setSelectedConfig} className="space-y-1.5">
                      {Object.entries(POLICY_CONFIG.BLOCK_ALL.configs).map(([key, config]) => {
                        const ConfigIcon = config.icon;
                        return (
                          <div
                            key={key}
                            className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${
                              selectedConfig === key
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={key} id={`config-block-${key}`} className="scale-90" />
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={`config-block-${key}`} className="text-sm cursor-pointer flex items-center gap-1.5">
                                <ConfigIcon className="size-3.5" />
                                {config.label}
                                {config.isRisky && (
                                  <Badge variant="warning" className="ml-1 text-xs py-0">
                                    <AlertTriangle className="size-2.5 mr-0.5" />
                                    Risky
                                  </Badge>
                                )}
                              </Label>
                              <p className="text-xs text-muted-foreground truncate">
                                {config.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Allow All Policy - Accordion Style */}
            <div
              className={`rounded-lg border transition-all duration-200 ${
                selectedPolicy === 'ALLOW_ALL'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handlePolicyChange('ALLOW_ALL')}
              >
                <RadioGroup value={selectedPolicy} onValueChange={handlePolicyChange}>
                  <RadioGroupItem value="ALLOW_ALL" id="policy-allow" />
                </RadioGroup>
                <div className="flex-1">
                  <Label htmlFor="policy-allow" className="font-medium cursor-pointer flex items-center gap-2">
                    <ShieldOff className="size-4 text-green-600" />
                    Allow All
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {POLICY_CONFIG.ALLOW_ALL.description}
                  </p>
                </div>
              </div>

              {/* Nested blocks for Allow All */}
              {selectedPolicy === 'ALLOW_ALL' && (
                <div className="px-3 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="ml-6 pl-3 border-l-2 border-primary/30">
                    <Label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ShieldMinus className="size-3 text-red-600" />
                      Block these services:
                    </Label>
                    <RadioGroup value={selectedConfig} onValueChange={setSelectedConfig} className="space-y-1.5">
                      {Object.entries(POLICY_CONFIG.ALLOW_ALL.configs).map(([key, config]) => {
                        const ConfigIcon = config.icon;
                        return (
                          <div
                            key={key}
                            className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${
                              selectedConfig === key
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={key} id={`config-allow-${key}`} className="scale-90" />
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={`config-allow-${key}`} className="text-sm cursor-pointer flex items-center gap-1.5">
                                <ConfigIcon className="size-3.5" />
                                {config.label}
                                {config.isRisky && (
                                  <Badge variant="warning" className="ml-1 text-xs py-0">
                                    <AlertTriangle className="size-2.5 mr-0.5" />
                                    Risky
                                  </Badge>
                                )}
                              </Label>
                              <p className="text-xs text-muted-foreground truncate">
                                {config.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Warning */}
            {isRiskyConfig && (
              <Alert variant="warning">
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  This configuration may expose your VMs to security risks or cause issues with automatic OS installation.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={!hasChanges || loading}>
              {loading ? (
                <>
                  <RefreshCw className="size-icon mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Restart Department Subnet
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  When changing the firewall policy, the department subnet will automatically restart.
                  This will cause a <strong>temporary disconnection</strong> of all VMs in this department
                  (approximately 10-30 seconds).
                </p>
                <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current policy:</span>{' '}
                    <Badge variant={policyInfo?.badgeVariant}>{policyInfo?.label}</Badge>
                    {' → '}
                    <Badge variant={selectedPolicyInfo?.badgeVariant}>{selectedPolicyInfo?.label}</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Configuration:</span>{' '}
                    {configInfo?.label} → {selectedConfigInfo?.label}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <RefreshCw className="size-4 mr-2" />
              Confirm and Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DepartmentFirewallPolicyEditor;
