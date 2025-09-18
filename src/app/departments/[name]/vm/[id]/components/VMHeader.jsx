import React, { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Play, Square, RotateCcw, Network, Globe, Home, Copy, Check } from 'lucide-react';
import { useVMNetworkRealTime } from '@/components/vm/hooks/useVMNetworkRealTime';

/**
 * Header component for the VM detail page
 */
const VMHeader = ({ vm, departmentName, onPowerAction, onRefresh }) => {
  if (!vm) return null;

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'default'; // Green
      case 'stopped':
      case 'shutoff':
        return 'secondary'; // Gray
      case 'paused':
      case 'suspended':
        return 'outline'; // Yellow outline
      default:
        return 'destructive'; // Red
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'En ejecución';
      case 'stopped':
      case 'shutoff':
        return 'Detenida';
      case 'paused':
        return 'Pausada';
      case 'suspended':
        return 'Suspendida';
      default:
        return status || 'Desconocido';
    }
  };

  // Format creation date
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRunning = vm.status?.toLowerCase() === 'running';
  const isStopped = vm.status?.toLowerCase() === 'stopped' || vm.status?.toLowerCase() === 'shutoff';

  // Use VM's department name for consistent navigation
  const deptName = vm?.department?.name || departmentName;

  return (
    <div className="mb-6">
      {/* Breadcrumb and back button */}
      <div className="flex items-center mb-4">
        <Link href={`/departments/${encodeURIComponent(deptName)}`} className="mr-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/departments" className="hover:text-foreground">
            Departamentos
          </Link>
          <span>/</span>
          <Link href={`/departments/${encodeURIComponent(deptName)}`} className="hover:text-foreground">
            {deptName}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{vm.name}</span>
        </nav>
      </div>

      {/* VM Info and Controls */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          {/* VM Name and Status */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{vm.name}</h1>
            <Badge variant={getStatusVariant(vm.status)} className="text-sm">
              {getStatusText(vm.status)}
            </Badge>
          </div>

          {/* VM Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Template:</span>
              <p className="font-medium">{vm.template?.name || 'No disponible'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Usuario:</span>
              <p className="font-medium">
                {vm.user ? vm.user.firstName + " " + vm.user.lastName + " (" + vm.user.email + ")" : 'No asignado'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Creada:</span>
              <p className="font-medium">{formatDate(vm.createdAt)}</p>
            </div>
          </div>

          {/* Template specs if available */}
          {vm.template && (
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>CPU: {vm.template.cores} cores</span>
              <span>RAM: {vm.template.ram} MB</span>
              <span>Storage: {vm.template.storage} GB</span>
            </div>
          )}

          {/* Network Information */}
          <NetworkInfoSection vm={vm} />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Start button */}
          {isStopped && (
            <Button 
              onClick={() => onPowerAction('start')}
              variant="default"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
          )}

          {/* Stop button */}
          {isRunning && (
            <Button 
              onClick={() => onPowerAction('stop')}
              variant="destructive"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Detener
            </Button>
          )}

          {/* Restart button - disabled for now */}
          {/* {isRunning && (
            <Button
              onClick={() => onPowerAction('restart')}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};

/**
 * Network Information Section Component
 * Displays IP addresses with connection status and copy functionality
 * Uses real-time network data as fallback when GraphQL doesn't provide IP fields
 */
const NetworkInfoSection = ({ vm }) => {
  const [copiedField, setCopiedField] = useState(null);

  // Get real-time network info as fallback
  const { networkInfo } = useVMNetworkRealTime(vm?.id);

  // Use real-time data as fallback for IP addresses
  const localIP = networkInfo?.localIP || vm?.localIP;
  const publicIP = networkInfo?.publicIP || vm?.publicIP;

  // Compute network status
  const hasAnyIP = Boolean(localIP || publicIP);

  const handleCopyIP = async (ip, field) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1000);
    } catch (error) {
      console.error('Failed to copy IP:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
      {/* Connection Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${hasAnyIP ? 'bg-green-500' : 'bg-gray-300'}`}
          aria-label={hasAnyIP ? 'Conectado' : 'Sin conexión'}
        />
        <span className="text-xs text-muted-foreground">
          {hasAnyIP ? 'Conectado' : 'Sin conexión'}
        </span>
      </div>

      {/* Local IP */}
      <div className="flex items-center gap-2 min-w-0">
        <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">IP Local:</span>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="font-mono truncate" title={localIP || 'No disponible'}>
            {localIP || 'No disponible'}
          </Badge>
          {localIP && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleCopyIP(localIP, 'local')}
              title="Copiar IP local"
              aria-label="Copiar IP local"
            >
              {copiedField === 'local' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Public IP */}
      <div className="flex items-center gap-2 min-w-0">
        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">IP Pública:</span>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="font-mono truncate" title={publicIP || 'No disponible'}>
            {publicIP || 'No disponible'}
          </Badge>
          {publicIP && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleCopyIP(publicIP, 'public')}
              title="Copiar IP pública"
              aria-label="Copiar IP pública"
            >
              {copiedField === 'public' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VMHeader;
