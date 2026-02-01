/**
 * Component that displays VM network information including IP addresses
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Network,
  Globe,
  Home,
  Copy,
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useVMNetworkRealTime } from '../../../hooks/useVMNetworkRealTime';

const NetworkInfo = ({ vm, className = '' }) => {
  const [copiedField, setCopiedField] = React.useState(null);

  // Use the real-time network hook for additional real-time features
  const { networkInfo, connectionStatus, hasNetworkInfo } = useVMNetworkRealTime(vm?.id);

  // Handle copying IP to clipboard
  const handleCopyIP = async (ip, fieldName) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy IP address:', err);
    }
  };

  // Check if VM has IP information (prioritize real-time data)
  const hasNetworkInfoData = hasNetworkInfo || vm?.localIP || vm?.publicIP;
  const currentLocalIP = networkInfo?.localIP || vm?.localIP;
  const currentPublicIP = networkInfo?.publicIP || vm?.publicIP;

  if (!hasNetworkInfoData) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5" />
            <span>Información de Red</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Información de red no disponible
            </p>
            <p className="text-sm text-muted-foreground">
              Las direcciones IP se detectarán automáticamente cuando la VM esté en funcionamiento
              y InfiniService esté conectado.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="w-5 h-5" />
          <span>Información de Red</span>
          <div className="ml-auto flex items-center space-x-2">
            {networkInfo?.hasIPUpdated && (
              <Badge variant="default" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 animate-pulse">
                Actualizado
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`${
                connectionStatus === 'connected'
                  ? 'border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-900/20'
                  : connectionStatus === 'connecting'
                  ? 'border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {connectionStatus === 'connected' && <Wifi className="w-3 h-3 mr-1" />}
              {connectionStatus === 'offline' && <WifiOff className="w-3 h-3 mr-1" />}
              {connectionStatus === 'connected'
                ? 'Conectado'
                : connectionStatus === 'connecting'
                ? 'Conectando...'
                : 'Desconectado'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Local IP Address */}
        {currentLocalIP && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">IP Local</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Red privada/interna</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-mono text-sm bg-white dark:bg-muted px-3 py-1 rounded border ${networkInfo?.hasIPUpdated ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}>
                {currentLocalIP}
              </span>
              <button
                onClick={() => handleCopyIP(currentLocalIP, 'local')}
                className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded transition-colors"
                title="Copiar IP local"
              >
                {copiedField === 'local' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Public IP Address */}
        {currentPublicIP && (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">IP Pública</div>
                <div className="text-sm text-green-700 dark:text-green-300">Acceso desde internet</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-mono text-sm bg-white dark:bg-muted px-3 py-1 rounded border ${networkInfo?.hasIPUpdated ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}>
                {currentPublicIP}
              </span>
              <button
                onClick={() => handleCopyIP(currentPublicIP, 'public')}
                className="p-1 hover:bg-green-200 dark:hover:bg-green-800/40 rounded transition-colors"
                title="Copiar IP pública"
              >
                {copiedField === 'public' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-green-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Network Status Information */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Estado de la Red
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Estado VM:</span>
              <Badge
                variant={vm.status === 'running' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {vm.status === 'running' ? 'En funcionamiento' : 'Detenida'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Conectividad:</span>
              <span className={
                connectionStatus === 'connected' ? 'text-green-600' :
                connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-muted-foreground'
              }>
                {connectionStatus === 'connected' ? 'Conectado' :
                 connectionStatus === 'connecting' ? 'Conectando...' : 'Sin conexión'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Última actualización:</span>
              <span className="text-muted-foreground">
                En tiempo real
              </span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <strong>💡 Información:</strong> Las direcciones IP se detectan automáticamente
          cuando la VM está ejecutándose y el agente InfiniService está activo.
          Los cambios se actualizan en tiempo real.
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkInfo;