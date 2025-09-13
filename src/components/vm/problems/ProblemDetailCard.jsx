'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Badge,
  Divider,
  Accordion,
  AccordionItem,
  Progress,
  Checkbox,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Zap,
  Shield,
  HardDrive,
  Download,
  Package,
  Firewall
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { SolutionGuide } from './SolutionGuide';
import { useProblemStatus } from '../../../hooks/useProblemStatus';

const CATEGORY_ICONS = {
  STORAGE: HardDrive,
  SECURITY: Shield,
  PERFORMANCE: Zap,
  NETWORK: ExternalLink,
  SYSTEM: Info,
  UPDATES: Download,
  APPLICATIONS: Package,
  FIREWALL: Firewall
};

const STATUS_CONFIG = {
  NEW: {
    color: 'default',
    label: 'Nuevo',
    icon: AlertTriangle,
    description: 'Problema recién detectado'
  },
  IN_PROGRESS: {
    color: 'primary',
    label: 'En Progreso',
    icon: Play,
    description: 'Solución en curso'
  },
  RESOLVED: {
    color: 'success',
    label: 'Resuelto',
    icon: CheckCircle,
    description: 'Problema solucionado'
  },
  DISMISSED: {
    color: 'warning',
    label: 'Descartado',
    icon: Pause,
    description: 'Problema descartado'
  }
};

export function ProblemDetailCard({
  problem,
  vmId,
  selectable = false,
  selected = false,
  onSelect,
  onStatusChange,
  showDetailedView = false
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(problem.notes || '');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const { isOpen: isSolutionOpen, onOpen: onSolutionOpen, onOpenChange: onSolutionOpenChange } = useDisclosure();

  const { updateProblemStatus, isUpdating } = useProblemStatus();

  const CategoryIcon = CATEGORY_ICONS[problem.category] || Info;
  const statusConfig = STATUS_CONFIG[problem.status] || STATUS_CONFIG.NEW;
  const StatusIcon = statusConfig.icon;

  // Calculate business impact score
  const businessImpactScore = useMemo(() => {
    const impactFactors = {
      CRITICAL: 100,
      IMPORTANT: 70,
      INFORMATIONAL: 30
    };

    const categoryMultipliers = {
      SECURITY: 1.2,
      STORAGE: 1.1,
      PERFORMANCE: 1.0,
      NETWORK: 0.9,
      SYSTEM: 0.8
    };

    const baseScore = impactFactors[problem.priority] || 30;
    const multiplier = categoryMultipliers[problem.category] || 1.0;

    return Math.min(100, Math.round(baseScore * multiplier));
  }, [problem.priority, problem.category]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProblemStatus(problem.id, newStatus);
      if (onStatusChange) {
        onStatusChange(problem.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating problem status:', error);
    }
  };

  const getStatusActions = () => {
    const actions = [];

    switch (problem.status) {
      case 'NEW':
        actions.push(
          <Button
            key="start"
            color="primary"
            variant="flat"
            size="sm"
            startContent={<Play className="w-4 h-4" />}
            onPress={() => handleStatusChange('IN_PROGRESS')}
            isLoading={isUpdating}
          >
            Iniciar Solución
          </Button>
        );
        break;

      case 'IN_PROGRESS':
        actions.push(
          <Button
            key="resolve"
            color="success"
            variant="flat"
            size="sm"
            startContent={<CheckCircle className="w-4 h-4" />}
            onPress={() => handleStatusChange('RESOLVED')}
            isLoading={isUpdating}
          >
            Marcar Resuelto
          </Button>
        );
        actions.push(
          <Button
            key="pause"
            color="warning"
            variant="flat"
            size="sm"
            startContent={<Pause className="w-4 h-4" />}
            onPress={() => handleStatusChange('DISMISSED')}
            isLoading={isUpdating}
          >
            Pausar
          </Button>
        );
        break;

      case 'RESOLVED':
        actions.push(
          <Button
            key="reopen"
            color="default"
            variant="flat"
            size="sm"
            startContent={<RotateCcw className="w-4 h-4" />}
            onPress={() => handleStatusChange('IN_PROGRESS')}
            isLoading={isUpdating}
          >
            Reabrir
          </Button>
        );
        break;

      case 'DISMISSED':
        actions.push(
          <Button
            key="restart"
            color="primary"
            variant="flat"
            size="sm"
            startContent={<Play className="w-4 h-4" />}
            onPress={() => handleStatusChange('IN_PROGRESS')}
            isLoading={isUpdating}
          >
            Reactivar
          </Button>
        );
        break;
    }

    return actions;
  };

  const formatTimeEstimate = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <>
      <Card className={`${problem.priority === 'CRITICAL' ? 'border-danger' : ''} ${selected ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-start gap-3 flex-1">
              {selectable && (
                <Checkbox
                  isSelected={selected}
                  onValueChange={onSelect}
                  className="mt-1"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon className="w-5 h-5 text-default-500" />
                  <PriorityBadge priority={problem.priority} />
                  <Chip
                    startContent={<StatusIcon className="w-3 h-3" />}
                    color={statusConfig.color}
                    variant="flat"
                    size="sm"
                  >
                    {statusConfig.label}
                  </Chip>
                  {problem.estimatedFixTime && (
                    <Chip
                      startContent={<Clock className="w-3 h-3" />}
                      variant="bordered"
                      size="sm"
                    >
                      {formatTimeEstimate(problem.estimatedFixTime)}
                    </Chip>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1">{problem.title}</h3>
                <p className="text-default-600 text-sm">{problem.description}</p>

                {showDetailedView && (
                  <div className="mt-3 space-y-2">
                    {/* Business Impact */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Impacto en el Negocio:</span>
                      <Progress
                        value={businessImpactScore}
                        color={businessImpactScore > 80 ? 'danger' : businessImpactScore > 50 ? 'warning' : 'success'}
                        size="sm"
                        className="flex-1 max-w-32"
                      />
                      <span className="text-sm text-default-500">{businessImpactScore}%</span>
                    </div>

                    {/* Affected Services */}
                    {problem.affectedServices && problem.affectedServices.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Servicios Afectados:</span>
                        <div className="flex gap-1">
                          {problem.affectedServices.slice(0, 3).map((service, index) => (
                            <Chip key={index} size="sm" variant="bordered">
                              {service}
                            </Chip>
                          ))}
                          {problem.affectedServices.length > 3 && (
                            <Chip size="sm" variant="bordered">
                              +{problem.affectedServices.length - 3} más
                            </Chip>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-2">
                {getStatusActions()}
                <Button
                  color="primary"
                  variant="solid"
                  size="sm"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  onPress={onSolutionOpen}
                >
                  Ver Solución
                </Button>
              </div>

              {showDetailedView && (
                <Button
                  variant="light"
                  size="sm"
                  startContent={expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  onPress={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Menos Detalles' : 'Más Detalles'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {expanded && showDetailedView && (
          <CardBody className="pt-0">
            <Divider className="mb-4" />

            <Accordion variant="bordered">
              <AccordionItem
                key="business-impact"
                aria-label="Impacto en el Negocio"
                title="Impacto en el Negocio"
                startContent={<TrendingUp className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Severidad del Impacto:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={businessImpactScore}
                          color={businessImpactScore > 80 ? 'danger' : businessImpactScore > 50 ? 'warning' : 'success'}
                          size="sm"
                          className="flex-1"
                        />
                        <span className="text-sm">{businessImpactScore}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Tiempo Estimado:</span>
                      <p className="text-sm text-default-600 mt-1">
                        {problem.estimatedFixTime ? formatTimeEstimate(problem.estimatedFixTime) : 'No estimado'}
                      </p>
                    </div>
                  </div>

                  {problem.businessImpact && (
                    <div>
                      <span className="text-sm font-medium">Descripción del Impacto:</span>
                      <p className="text-sm text-default-600 mt-1">{problem.businessImpact}</p>
                    </div>
                  )}
                </div>
              </AccordionItem>

              <AccordionItem
                key="technical-details"
                aria-label="Detalles Técnicos"
                title="Detalles Técnicos"
                startContent={<Info className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Categoría:</span>
                      <p className="text-sm text-default-600 mt-1">{problem.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Detectado:</span>
                      <p className="text-sm text-default-600 mt-1">
                        {problem.detectedAt ? new Date(problem.detectedAt).toLocaleString('es-ES') : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>

                  {problem.technicalDetails && (
                    <div>
                      <span className="text-sm font-medium">Información Técnica:</span>
                      <div className="bg-default-100 rounded-lg p-3 mt-1">
                        <pre className="text-xs text-default-700 whitespace-pre-wrap">
                          {JSON.stringify(problem.technicalDetails, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>

              <AccordionItem
                key="notes"
                aria-label="Notas y Comentarios"
                title="Notas y Comentarios"
                startContent={<MessageSquare className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <Textarea
                    placeholder="Agregar notas sobre este problema..."
                    value={notes}
                    onValueChange={setNotes}
                    minRows={3}
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() => {
                      // Save notes logic here
                      console.log('Saving notes:', notes);
                    }}
                  >
                    Guardar Notas
                  </Button>
                </div>
              </AccordionItem>
            </Accordion>
          </CardBody>
        )}
      </Card>

      {/* Solution Guide Modal */}
      <Modal
        isOpen={isSolutionOpen}
        onOpenChange={onSolutionOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2>Guía de Solución: {problem.title}</h2>
                <p className="text-sm text-default-500">
                  Sigue estos pasos para resolver el problema
                </p>
              </ModalHeader>
              <ModalBody>
                <SolutionGuide
                  problem={problem}
                  vmId={vmId}
                  onStatusChange={handleStatusChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
