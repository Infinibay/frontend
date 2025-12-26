import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Valid configurations for each policy
const BLOCK_ALL_CONFIGS = {
  allow_outbound: {
    label: "Permitir toda conexion saliente",
    description: "Las VMs pueden conectarse a internet y servicios externos"
  },
  allow_internet: {
    label: "Permitir Internet",
    description: "Solo HTTP/HTTPS (puertos 80, 443) y DNS. Necesario para instalar Fedora"
  },
  block_all: {
    label: "Bloquear todo",
    description: "Bloquea todo el trafico (requiere configuracion manual)"
  }
};

const ALLOW_ALL_CONFIGS = {
  none: {
    label: "Sin bloqueos",
    description: "No bloquear ningun servicio inicialmente"
  },
  block_ssh: {
    label: "Bloquear SSH/SFTP",
    description: "Bloquea puertos 22 y 21 (acceso remoto y transferencia de archivos)"
  },
  block_smb: {
    label: "Bloquear SMB",
    description: "Bloquea puerto 445 (comparticion de archivos Windows)"
  },
  block_databases: {
    label: "Bloquear Bases de Datos",
    description: "Bloquea MySQL, PostgreSQL, MongoDB"
  }
};

/**
 * Create Department Dialog Component
 * Dialog for creating a new department with firewall configuration
 */
const CreateDepartmentDialog = ({
  isOpen,
  onOpenChange,
  departmentName,
  onDepartmentNameChange,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  // Internal form state for firewall configuration
  const [formData, setFormData] = useState({
    firewallPolicy: 'BLOCK_ALL',
    firewallDefaultConfig: 'allow_outbound'
  });

  // Reset form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firewallPolicy: 'BLOCK_ALL',
        firewallDefaultConfig: 'allow_outbound'
      });
    }
  }, [isOpen]);

  // Handle policy change - reset default config to appropriate default
  const handlePolicyChange = (value) => {
    setFormData({
      firewallPolicy: value,
      firewallDefaultConfig: value === 'BLOCK_ALL' ? 'allow_outbound' : 'none'
    });
  };

  // Handle default config change
  const handleDefaultConfigChange = (value) => {
    setFormData(prev => ({
      ...prev,
      firewallDefaultConfig: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate configuration
    const validBlockAllConfigs = Object.keys(BLOCK_ALL_CONFIGS);
    const validAllowAllConfigs = Object.keys(ALLOW_ALL_CONFIGS);

    if (formData.firewallPolicy === 'BLOCK_ALL' &&
        !validBlockAllConfigs.includes(formData.firewallDefaultConfig)) {
      return;
    }

    if (formData.firewallPolicy === 'ALLOW_ALL' &&
        !validAllowAllConfigs.includes(formData.firewallDefaultConfig)) {
      return;
    }

    // Pass complete form data to parent
    onSubmit(e, {
      name: departmentName.trim(),
      firewallPolicy: formData.firewallPolicy,
      firewallDefaultConfig: formData.firewallDefaultConfig
    });
  };

  const isBlockAllRisky = formData.firewallPolicy === 'BLOCK_ALL' &&
                          formData.firewallDefaultConfig === 'block_all';
  const isAllowAllRisky = formData.firewallPolicy === 'ALLOW_ALL' &&
                          formData.firewallDefaultConfig === 'none';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Configure the new department and its firewall settings.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Department Name */}
            <div className="space-y-2">
              <Label>Nombre del Departamento</Label>
              <Input
                autoFocus
                type="text"
                placeholder="Nombre del departamento"
                value={departmentName}
                onChange={(e) => onDepartmentNameChange(e.target.value)}
              />
            </div>

            {/* Firewall Policy Section - Accordion Style */}
            <div className="space-y-3">
              <Label
                moreInformation="Define el comportamiento por defecto del firewall. Bloquear Todo es mas seguro y se recomienda para la mayoria de casos."
              >
                Politica de Firewall
              </Label>

              {/* Block All Policy - Accordion */}
              <div
                className={`rounded-lg border transition-all duration-200 ${
                  formData.firewallPolicy === 'BLOCK_ALL'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div
                  className="flex items-start space-x-3 p-3 cursor-pointer"
                  onClick={() => handlePolicyChange('BLOCK_ALL')}
                >
                  <RadioGroup value={formData.firewallPolicy} onValueChange={handlePolicyChange}>
                    <RadioGroupItem value="BLOCK_ALL" id="policy-block" className="mt-0.5" />
                  </RadioGroup>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="policy-block" className="text-sm font-medium cursor-pointer">
                      Bloquear Todo (Recomendado)
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Bloquea todo el trafico excepto lo que permitas explicitamente
                    </span>
                  </div>
                </div>

                {/* Nested exceptions for Block All */}
                {formData.firewallPolicy === 'BLOCK_ALL' && (
                  <div className="px-3 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="ml-6 pl-3 border-l-2 border-primary/30">
                      <span className="text-xs text-muted-foreground mb-2 block">
                        Permitir estas excepciones:
                      </span>

                      {isBlockAllRisky && (
                        <Alert variant="warning" className="mb-2 py-2">
                          <AlertDescription className="text-xs">
                            Esta configuracion puede causar problemas con la instalacion automatica de sistemas operativos.
                          </AlertDescription>
                        </Alert>
                      )}

                      <RadioGroup
                        value={formData.firewallDefaultConfig}
                        onValueChange={handleDefaultConfigChange}
                        className="space-y-1.5"
                      >
                        {Object.entries(BLOCK_ALL_CONFIGS).map(([value, config]) => (
                          <div
                            key={value}
                            className={`flex items-start space-x-2 p-2 rounded-md border transition-colors ${
                              formData.firewallDefaultConfig === value
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={value} id={`config-block-${value}`} className="mt-0.5 scale-90" />
                            <div className="flex flex-col flex-1 min-w-0">
                              <label htmlFor={`config-block-${value}`} className="text-xs font-medium cursor-pointer">
                                {config.label}
                              </label>
                              <span className="text-xs text-muted-foreground truncate">
                                {config.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>

              {/* Allow All Policy - Accordion */}
              <div
                className={`rounded-lg border transition-all duration-200 ${
                  formData.firewallPolicy === 'ALLOW_ALL'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div
                  className="flex items-start space-x-3 p-3 cursor-pointer"
                  onClick={() => handlePolicyChange('ALLOW_ALL')}
                >
                  <RadioGroup value={formData.firewallPolicy} onValueChange={handlePolicyChange}>
                    <RadioGroupItem value="ALLOW_ALL" id="policy-allow" className="mt-0.5" />
                  </RadioGroup>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="policy-allow" className="text-sm font-medium cursor-pointer">
                      Permitir Todo
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Permite todo el trafico excepto lo que bloquees explicitamente
                    </span>
                  </div>
                </div>

                {/* Nested blocks for Allow All */}
                {formData.firewallPolicy === 'ALLOW_ALL' && (
                  <div className="px-3 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="ml-6 pl-3 border-l-2 border-primary/30">
                      <span className="text-xs text-muted-foreground mb-2 block">
                        Bloquear estos servicios:
                      </span>

                      {isAllowAllRisky && (
                        <Alert variant="warning" className="mb-2 py-2">
                          <AlertDescription className="text-xs">
                            Sin bloqueos iniciales, las VMs estaran mas expuestas.
                          </AlertDescription>
                        </Alert>
                      )}

                      <RadioGroup
                        value={formData.firewallDefaultConfig}
                        onValueChange={handleDefaultConfigChange}
                        className="space-y-1.5"
                      >
                        {Object.entries(ALLOW_ALL_CONFIGS).map(([value, config]) => (
                          <div
                            key={value}
                            className={`flex items-start space-x-2 p-2 rounded-md border transition-colors ${
                              formData.firewallDefaultConfig === value
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={value} id={`config-allow-${value}`} className="mt-0.5 scale-90" />
                            <div className="flex flex-col flex-1 min-w-0">
                              <label htmlFor={`config-allow-${value}`} className="text-xs font-medium cursor-pointer">
                                {config.label}
                              </label>
                              <span className="text-xs text-muted-foreground truncate">
                                {config.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !departmentName.trim()}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
