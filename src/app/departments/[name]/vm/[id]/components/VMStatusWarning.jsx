import React, { useState } from 'react';
import { AlertTriangle, Power, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { usePowerOffMutation } from '@/gql/hooks';

const VMStatusWarning = ({
  vmStatus,
  vmId,
  vmName,
  onVMStopped
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [powerOffMachine, { loading: poweringOff }] = usePowerOffMutation();

  // Don't show warning if VM is already stopped
  if (vmStatus !== 'running') {
    return null;
  }

  const handleStopVM = async () => {
    try {
      await powerOffMachine({
        variables: { id: vmId }
      });
      setIsConfirmOpen(false);
      if (onVMStopped) {
        onVMStopped();
      }
    } catch (error) {
      console.error('Error stopping VM:', error);
      // Error handling will be shown by the mutation component
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Warning Alert */}
      <Alert variant="warning" className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="space-y-3">
          <div className="font-medium text-yellow-800">
            La máquina virtual debe estar apagada para modificar la configuración del firewall
          </div>

          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>¿Por qué es necesario?</strong> Las reglas de firewall se aplican durante el
              arranque de la máquina virtual. Los cambios realizados mientras está funcionando
              no tendrán efecto hasta el próximo reinicio.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                <Power className="h-3 w-3 mr-1" />
                Estado actual: Funcionando
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  disabled={poweringOff}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {poweringOff ? 'Apagando...' : 'Apagar Máquina Virtual'}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Confirmar apagado de la máquina virtual
                  </DialogTitle>
                  <DialogDescription className="space-y-3 text-sm">
                    <p>
                      Está a punto de apagar la máquina virtual <strong>{vmName}</strong>.
                    </p>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        ⚠️ Precauciones importantes:
                      </h4>
                      <ul className="text-yellow-700 space-y-1 text-xs">
                        <li>• Asegúrese de haber guardado todo su trabajo</li>
                        <li>• Cierre todas las aplicaciones importantes</li>
                        <li>• Este proceso puede tardar 1-2 minutos</li>
                        <li>• La VM se apagará de forma segura</li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      Tiempo estimado: 30-120 segundos
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmOpen(false)}
                    disabled={poweringOff}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStopVM}
                    disabled={poweringOff}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {poweringOff ? 'Apagando...' : 'Apagar Ahora'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </AlertDescription>
      </Alert>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm space-y-2">
            <h4 className="font-medium text-blue-800">
              Recomendaciones para cambios de firewall
            </h4>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• Realice los cambios durante ventanas de mantenimiento</li>
              <li>• Planifique los cambios durante horas de menor actividad</li>
              <li>• Pruebe las reglas en un entorno de desarrollo primero</li>
              <li>• Documente todos los cambios realizados</li>
              <li>• Tenga un plan de rollback preparado</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Impact Notice */}
      <Alert className="border-gray-200 bg-gray-50">
        <Clock className="h-4 w-4 text-gray-500" />
        <AlertDescription className="text-sm text-gray-600">
          <strong>Impacto en rendimiento:</strong> Los cambios de firewall requieren un
          reinicio temporal para aplicarse correctamente. Esto es una limitación del
          sistema de virtualización libvirt para garantizar la seguridad.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VMStatusWarning;