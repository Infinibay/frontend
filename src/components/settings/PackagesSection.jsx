"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import {
  usePackagesQuery,
  useEnablePackageMutation,
  useDisablePackageMutation,
  useUninstallPackageMutation
} from "@/gql/hooks"
import { useSizeContext, sizeVariants, getTypographyClass } from "@/components/ui/size-provider"
import {
  Package,
  Puzzle,
  ChevronDown,
  ChevronRight,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
  Database,
  Globe,
  Wrench,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * PackagesSection - UI for managing plugin packages
 *
 * Displays installed packages with their status, checkers, and capabilities.
 * Allows enabling/disabling packages and uninstalling external packages.
 */
const PackagesSection = ({ className }) => {
  const { toast } = useToast()
  const { size } = useSizeContext()
  const [expandedPackages, setExpandedPackages] = useState(new Set())
  const [packageToUninstall, setPackageToUninstall] = useState(null)

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = usePackagesQuery({
    fetchPolicy: 'cache-and-network'
  })

  const [enablePackage, { loading: enablingPackage }] = useEnablePackageMutation({
    onCompleted: (data) => {
      toast({
        title: "Package Enabled",
        description: `${data.enablePackage?.displayName} has been enabled`,
        variant: "success"
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    },
    refetchQueries: ['Packages']
  })

  const [disablePackage, { loading: disablingPackage }] = useDisablePackageMutation({
    onCompleted: (data) => {
      toast({
        title: "Package Disabled",
        description: `${data.disablePackage?.displayName} has been disabled`,
        variant: "success"
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    },
    refetchQueries: ['Packages']
  })

  const [uninstallPackage, { loading: uninstallingPackage }] = useUninstallPackageMutation({
    onCompleted: () => {
      toast({
        title: "Package Uninstalled",
        description: `${packageToUninstall?.displayName} has been removed`,
        variant: "success"
      })
      setPackageToUninstall(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      setPackageToUninstall(null)
    },
    refetchQueries: ['Packages']
  })

  const togglePackageExpand = (packageName) => {
    setExpandedPackages(prev => {
      const next = new Set(prev)
      if (next.has(packageName)) {
        next.delete(packageName)
      } else {
        next.add(packageName)
      }
      return next
    })
  }

  const handleToggleEnabled = async (pkg) => {
    if (pkg.isBuiltin) {
      toast({
        title: "Cannot Modify",
        description: "Built-in packages cannot be disabled",
        variant: "warning"
      })
      return
    }

    if (pkg.isEnabled) {
      await disablePackage({ variables: { name: pkg.name } })
    } else {
      await enablePackage({ variables: { name: pkg.name } })
    }
  }

  const handleUninstall = async () => {
    if (!packageToUninstall) return
    await uninstallPackage({ variables: { name: packageToUninstall.name } })
  }

  const getCapabilityIcon = (capability) => {
    switch (capability) {
      case 'network':
        return <Globe className={sizeVariants[size].icon.size} />
      case 'storage':
        return <Database className={sizeVariants[size].icon.size} />
      case 'cron':
        return <Clock className={sizeVariants[size].icon.size} />
      case 'remediation':
        return <Wrench className={sizeVariants[size].icon.size} />
      default:
        return <Shield className={sizeVariants[size].icon.size} />
    }
  }

  const formatCapabilities = (capabilities) => {
    if (!capabilities || Object.keys(capabilities).length === 0) {
      return null
    }

    const items = []

    if (capabilities.network?.length > 0) {
      items.push({
        key: 'network',
        label: 'Network Access',
        value: capabilities.network.join(', ')
      })
    }

    if (capabilities.storage) {
      items.push({
        key: 'storage',
        label: 'Persistent Storage',
        value: 'Enabled'
      })
    }

    if (capabilities.cron) {
      items.push({
        key: 'cron',
        label: 'Scheduled Execution',
        value: capabilities.cron
      })
    }

    if (capabilities.remediation) {
      items.push({
        key: 'remediation',
        label: 'Remediation Actions',
        value: 'Enabled'
      })
    }

    return items
  }

  // Loading state
  if (loading && !data) {
    return (
      <Card className={cn(sizeVariants[size].card.padding, className)}>
        <div className={sizeVariants[size].layout.section}>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={cn(sizeVariants[size].card.padding, className)}>
        <div className={sizeVariants[size].layout.section}>
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className={sizeVariants[size].icon.button} />
            <div>
              <h3 className={`font-medium ${getTypographyClass('subheading', size)}`}>
                Failed to Load Packages
              </h3>
              <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                {error.message}
              </p>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className={`${sizeVariants[size].icon.size} mr-2`} />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  const packages = data?.packages || []

  return (
    <>
      <Card className={cn(sizeVariants[size].card.padding, className)}>
        <div className={sizeVariants[size].layout.section}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`subheading ${getTypographyClass('subheading', size)} ${sizeVariants[size].layout.sectionSpacing}`}>
                Plugin Packages
              </h2>
              <p className={`${sizeVariants[size].typography.text} text-muted-foreground`}>
                Manage health checking packages and extensions. Built-in packages provide core functionality,
                while external packages can add specialized diagnostics.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className={`${sizeVariants[size].icon.size} animate-spin`} />
              ) : (
                <RefreshCw className={sizeVariants[size].icon.size} />
              )}
            </Button>
          </div>

          {packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className={`${sizeVariants[size].icon.hero} text-muted-foreground mb-4`} />
              <h3 className={`font-medium ${getTypographyClass('heading2', size)} mb-2`}>
                No Packages Installed
              </h3>
              <p className={`${sizeVariants[size].typography.small} text-muted-foreground max-w-md`}>
                Install packages using the CLI: <code className="bg-muted px-2 py-1 rounded">infinibay package install &lt;path&gt;</code>
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {packages.map((pkg) => {
                const isExpanded = expandedPackages.has(pkg.name)
                const capabilities = formatCapabilities(pkg.capabilities)

                return (
                  <Card
                    key={pkg.id}
                    className={cn(
                      "transition-all duration-200",
                      pkg.isEnabled ? "border-border" : "border-muted bg-muted/30",
                      !pkg.isBuiltin && "hover:shadow-md"
                    )}
                  >
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => togglePackageExpand(pkg.name)}
                    >
                      <div className={cn(
                        "flex items-center justify-between",
                        sizeVariants[size].card.padding
                      )}>
                        <div className="flex items-center gap-4">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              {isExpanded ? (
                                <ChevronDown className={sizeVariants[size].icon.size} />
                              ) : (
                                <ChevronRight className={sizeVariants[size].icon.size} />
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          <div className={cn(
                            "flex items-center justify-center rounded-lg",
                            sizeVariants[size].thumbnail,
                            pkg.isBuiltin ? "bg-primary/10" : "bg-accent/10"
                          )}>
                            {pkg.isBuiltin ? (
                              <Puzzle className={`${sizeVariants[size].icon.size} text-primary`} />
                            ) : (
                              <Package className={`${sizeVariants[size].icon.size} text-accent`} />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${getTypographyClass('heading2', size)}`}>
                                {pkg.displayName}
                              </h3>
                              <Badge
                                variant={pkg.isBuiltin ? "secondary" : "outline"}
                                className={sizeVariants[size].badge.padding}
                              >
                                {pkg.isBuiltin ? "Built-in" : "External"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={sizeVariants[size].badge.padding}
                              >
                                v{pkg.version}
                              </Badge>
                            </div>
                            <p className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                              {pkg.description || `${pkg.checkers.length} checker(s) • ${pkg.author}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {pkg.isEnabled ? (
                              <CheckCircle className={`${sizeVariants[size].icon.size} text-green-500`} />
                            ) : (
                              <AlertCircle className={`${sizeVariants[size].icon.size} text-muted-foreground`} />
                            )}
                            <span className={`${sizeVariants[size].typography.small} ${pkg.isEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                              {pkg.isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>

                          {!pkg.isBuiltin && (
                            <>
                              <Switch
                                checked={pkg.isEnabled}
                                onCheckedChange={() => handleToggleEnabled(pkg)}
                                disabled={enablingPackage || disablingPackage}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPackageToUninstall(pkg)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className={sizeVariants[size].icon.size} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className={cn(
                          "border-t",
                          sizeVariants[size].card.padding
                        )}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Checkers */}
                            <div>
                              <h4 className={`font-medium ${sizeVariants[size].typography.text} mb-3`}>
                                Health Checkers ({pkg.checkers.length})
                              </h4>
                              <div className="space-y-2">
                                {pkg.checkers.map((checker) => (
                                  <div
                                    key={checker.id}
                                    className={cn(
                                      "flex items-center justify-between p-2 rounded-md bg-muted/50",
                                      !checker.isEnabled && "opacity-50"
                                    )}
                                  >
                                    <div>
                                      <span className={`font-medium ${sizeVariants[size].typography.small}`}>
                                        {checker.name}
                                      </span>
                                      <span className={`${sizeVariants[size].badge.text} text-muted-foreground ml-2`}>
                                        ({checker.type})
                                      </span>
                                    </div>
                                    {checker.dataNeeds?.length > 0 && (
                                      <div className="flex gap-1">
                                        {checker.dataNeeds.slice(0, 3).map((need) => (
                                          <Badge
                                            key={need}
                                            variant="outline"
                                            className={`${sizeVariants[size].badge.padding} ${sizeVariants[size].badge.text}`}
                                          >
                                            {need}
                                          </Badge>
                                        ))}
                                        {checker.dataNeeds.length > 3 && (
                                          <Badge
                                            variant="outline"
                                            className={`${sizeVariants[size].badge.padding} ${sizeVariants[size].badge.text}`}
                                          >
                                            +{checker.dataNeeds.length - 3}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Package Info & Capabilities */}
                            <div>
                              <h4 className={`font-medium ${sizeVariants[size].typography.text} mb-3`}>
                                Package Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                                    Author
                                  </span>
                                  <span className={sizeVariants[size].typography.small}>
                                    {pkg.author}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                                    License
                                  </span>
                                  <Badge
                                    variant={pkg.license === 'open-source' ? 'success' : 'secondary'}
                                    className={`${sizeVariants[size].badge.padding} ${sizeVariants[size].badge.text}`}
                                  >
                                    {pkg.license}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${sizeVariants[size].typography.small} text-muted-foreground`}>
                                    Installed
                                  </span>
                                  <span className={sizeVariants[size].typography.small}>
                                    {new Date(pkg.installedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {capabilities && capabilities.length > 0 && (
                                <div className="mt-4">
                                  <h4 className={`font-medium ${sizeVariants[size].typography.text} mb-3`}>
                                    Capabilities
                                  </h4>
                                  <div className="space-y-2">
                                    {capabilities.map((cap) => (
                                      <div
                                        key={cap.key}
                                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                                      >
                                        {getCapabilityIcon(cap.key)}
                                        <div className="flex-1">
                                          <span className={`font-medium ${sizeVariants[size].typography.small}`}>
                                            {cap.label}
                                          </span>
                                          <span className={`${sizeVariants[size].badge.text} text-muted-foreground ml-2`}>
                                            {cap.value}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )
              })}
            </div>
          )}

          {/* CLI Instructions */}
          <div className={cn(
            "mt-6 p-4 rounded-lg bg-muted/50 border border-dashed",
            sizeVariants[size].typography.small
          )}>
            <h4 className={`font-medium ${sizeVariants[size].typography.text} mb-2`}>
              Installing External Packages
            </h4>
            <p className="text-muted-foreground mb-2">
              Use the Infinibay CLI to install external packages:
            </p>
            <code className="block bg-background px-3 py-2 rounded border font-mono">
              infinibay package install ./my-package.tar.gz
            </code>
          </div>
        </div>
      </Card>

      {/* Uninstall Confirmation Dialog */}
      <AlertDialog
        open={!!packageToUninstall}
        onOpenChange={(open) => !open && setPackageToUninstall(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uninstall Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to uninstall <strong>{packageToUninstall?.displayName}</strong>?
              This will remove all package files and checkers. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={uninstallingPackage}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUninstall}
              disabled={uninstallingPackage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {uninstallingPackage ? (
                <>
                  <Loader2 className={`${sizeVariants[size].icon.size} animate-spin mr-2`} />
                  Uninstalling...
                </>
              ) : (
                'Uninstall'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PackagesSection
