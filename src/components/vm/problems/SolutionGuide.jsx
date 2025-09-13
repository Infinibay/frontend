'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Divider,
  Accordion,
  AccordionItem,
  Checkbox,
  Code,
  Link,
  Tooltip,
  Badge
} from '@nextui-org/react';
import {
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Info,
  Zap,
  Shield,
  Terminal,
  Eye,
  Download,
  Upload,
  Settings,
  HelpCircle
} from 'lucide-react';

const STEP_TYPES = {
  MANUAL: {
    icon: Settings,
    color: 'primary',
    label: 'Manual'
  },
  AUTOMATED: {
    icon: Zap,
    color: 'success',
    label: 'Automático'
  },
  VERIFICATION: {
    icon: Eye,
    color: 'warning',
    label: 'Verificación'
  },
  EXTERNAL: {
    icon: ExternalLink,
    color: 'secondary',
    label: 'Enlace Externo'
  },
  COMMAND: {
    icon: Terminal,
    color: 'default',
    label: 'Comando'
  }
};

const DIFFICULTY_LEVELS = {
  EASY: { label: 'Fácil', color: 'success', description: 'Pasos simples, sin riesgo' },
  MEDIUM: { label: 'Intermedio', color: 'warning', description: 'Requiere atención, riesgo moderado' },
  HARD: { label: 'Avanzado', color: 'danger', description: 'Pasos complejos, requiere experiencia' }
};

export function SolutionGuide({ problem, vmId, onStatusChange }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrerequisites, setShowPrerequisites] = useState(true);
  const [solutionStarted, setSolutionStarted] = useState(false);

  // Generate solution steps based on problem type
  const solutionSteps = useMemo(() => {
    const steps = [];

    // Add prerequisite checks
    steps.push({
      id: 'prereq-backup',
      type: 'VERIFICATION',
      title: 'Verificar Respaldo del Sistema',
      description: 'Asegúrate de tener un respaldo reciente antes de proceder',
      estimatedTime: 5,
      difficulty: 'EASY',
      isPrerequisite: true,
      instructions: [
        'Verifica que existe un respaldo reciente de la VM',
        'Confirma que el respaldo está funcionando correctamente',
        'Si no hay respaldo, créalo antes de continuar'
      ],
      warnings: ['No proceder sin un respaldo válido'],
      successCriteria: 'Respaldo verificado y funcional'
    });

    // Add problem-specific steps based on category
    switch (problem.category) {
      case 'STORAGE':
        steps.push(
          {
            id: 'storage-analysis',
            type: 'VERIFICATION',
            title: 'Analizar Uso de Almacenamiento',
            description: 'Identificar qué está consumiendo el espacio en disco',
            estimatedTime: 10,
            difficulty: 'EASY',
            instructions: [
              'Abrir el administrador de archivos',
              'Navegar a las propiedades del disco',
              'Identificar las carpetas que más espacio consumen',
              'Documentar los hallazgos'
            ],
            commands: [
              'df -h',
              'du -sh /* | sort -hr'
            ],
            successCriteria: 'Identificadas las carpetas que consumen más espacio'
          },
          {
            id: 'storage-cleanup',
            type: 'MANUAL',
            title: 'Limpiar Archivos Innecesarios',
            description: 'Eliminar archivos temporales y logs antiguos',
            estimatedTime: 15,
            difficulty: 'MEDIUM',
            instructions: [
              'Limpiar archivos temporales del sistema',
              'Eliminar logs antiguos (más de 30 días)',
              'Vaciar la papelera de reciclaje',
              'Limpiar caché de aplicaciones'
            ],
            warnings: ['No eliminar archivos del sistema críticos'],
            commands: [
              'sudo apt-get clean',
              'sudo journalctl --vacuum-time=30d'
            ],
            successCriteria: 'Liberado al menos 1GB de espacio'
          }
        );
        break;

      case 'SECURITY':
        steps.push(
          {
            id: 'security-scan',
            type: 'AUTOMATED',
            title: 'Ejecutar Escaneo de Seguridad',
            description: 'Realizar un análisis completo del sistema',
            estimatedTime: 20,
            difficulty: 'EASY',
            instructions: [
              'Iniciar el escaneo de antivirus',
              'Ejecutar análisis de vulnerabilidades',
              'Revisar logs de seguridad',
              'Documentar amenazas encontradas'
            ],
            successCriteria: 'Escaneo completado sin amenazas activas'
          },
          {
            id: 'security-update',
            type: 'AUTOMATED',
            title: 'Aplicar Actualizaciones de Seguridad',
            description: 'Instalar parches y actualizaciones críticas',
            estimatedTime: 30,
            difficulty: 'MEDIUM',
            instructions: [
              'Verificar actualizaciones disponibles',
              'Aplicar parches de seguridad críticos',
              'Reiniciar servicios afectados',
              'Verificar que los servicios funcionan correctamente'
            ],
            warnings: ['Puede requerir reinicio del sistema'],
            successCriteria: 'Todas las actualizaciones de seguridad aplicadas'
          }
        );
        break;

      case 'PERFORMANCE':
        steps.push(
          {
            id: 'performance-analysis',
            type: 'VERIFICATION',
            title: 'Analizar Rendimiento del Sistema',
            description: 'Identificar procesos que consumen recursos',
            estimatedTime: 10,
            difficulty: 'EASY',
            instructions: [
              'Abrir el monitor de sistema',
              'Identificar procesos con alto uso de CPU',
              'Revisar uso de memoria RAM',
              'Documentar procesos problemáticos'
            ],
            commands: [
              'top',
              'htop',
              'free -h'
            ],
            successCriteria: 'Identificados los procesos que consumen más recursos'
          },
          {
            id: 'performance-optimization',
            type: 'MANUAL',
            title: 'Optimizar Procesos del Sistema',
            description: 'Ajustar configuraciones para mejorar rendimiento',
            estimatedTime: 25,
            difficulty: 'HARD',
            instructions: [
              'Terminar procesos innecesarios',
              'Ajustar prioridades de procesos críticos',
              'Optimizar configuración de memoria',
              'Configurar servicios de inicio'
            ],
            warnings: ['No terminar procesos críticos del sistema'],
            successCriteria: 'Uso de CPU reducido en al menos 20%'
          }
        );
        break;

      default:
        steps.push({
          id: 'generic-solution',
          type: 'MANUAL',
          title: 'Aplicar Solución Recomendada',
          description: 'Seguir las recomendaciones específicas para este problema',
          estimatedTime: 15,
          difficulty: 'MEDIUM',
          instructions: problem.solutions?.[0]?.steps?.map(s => s.description || s.title) || [
            'Revisar la documentación del problema',
            'Aplicar la solución recomendada',
            'Verificar que el problema se ha resuelto'
          ],
          successCriteria: 'Problema resuelto según las métricas del sistema'
        });
    }

    // Add final verification step
    steps.push({
      id: 'final-verification',
      type: 'VERIFICATION',
      title: 'Verificación Final',
      description: 'Confirmar que el problema ha sido resuelto',
      estimatedTime: 5,
      difficulty: 'EASY',
      instructions: [
        'Ejecutar diagnósticos del sistema',
        'Verificar que las métricas han mejorado',
        'Confirmar que no hay errores relacionados',
        'Documentar la solución aplicada'
      ],
      successCriteria: 'Problema completamente resuelto'
    });

    return steps;
  }, [problem]);

  const prerequisites = solutionSteps.filter(step => step.isPrerequisite);
  const mainSteps = solutionSteps.filter(step => !step.isPrerequisite);

  const totalEstimatedTime = solutionSteps.reduce((total, step) => total + step.estimatedTime, 0);
  const completedTime = solutionSteps
    .filter(step => completedSteps.has(step.id))
    .reduce((total, step) => total + step.estimatedTime, 0);

  const progressPercentage = solutionSteps.length > 0
    ? (completedSteps.size / solutionSteps.length) * 100
    : 0;

  const handleStepComplete = (stepId, completed) => {
    const newCompleted = new Set(completedSteps);
    if (completed) {
      newCompleted.add(stepId);
    } else {
      newCompleted.delete(stepId);
    }
    setCompletedSteps(newCompleted);

    // Auto-advance to next step
    if (completed) {
      const currentStepIndex = solutionSteps.findIndex(step => step.id === stepId);
      if (currentStepIndex < solutionSteps.length - 1) {
        setCurrentStep(currentStepIndex + 1);
      }
    }

    // Check if all steps are completed
    if (newCompleted.size === solutionSteps.length) {
      onStatusChange?.(problem.id, 'RESOLVED');
    }
  };

  const handleStartSolution = () => {
    setSolutionStarted(true);
    setShowPrerequisites(false);
    onStatusChange?.(problem.id, 'IN_PROGRESS');
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getDifficultyConfig = (difficulty) => {
    return DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.MEDIUM;
  };

  const getStepTypeConfig = (type) => {
    return STEP_TYPES[type] || STEP_TYPES.MANUAL;
  };

  return (
    <div className="space-y-6">
      {/* Solution Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-lg font-semibold">Guía de Solución</h3>
              <p className="text-sm text-default-500">
                {solutionSteps.length} pasos • Tiempo estimado: {formatTime(totalEstimatedTime)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">Progreso</div>
                <div className="text-xs text-default-500">
                  {completedSteps.size} de {solutionSteps.length} pasos
                </div>
              </div>
              <Progress
                value={progressPercentage}
                color="success"
                size="lg"
                className="w-32"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Chip
                color={getDifficultyConfig(problem.difficulty || 'MEDIUM').color}
                variant="flat"
              >
                {getDifficultyConfig(problem.difficulty || 'MEDIUM').label}
              </Chip>
              <Chip variant="bordered">
                {formatTime(completedTime)} / {formatTime(totalEstimatedTime)}
              </Chip>
            </div>
            {!solutionStarted && (
              <Button
                color="primary"
                startContent={<Play className="w-4 h-4" />}
                onPress={handleStartSolution}
              >
                Iniciar Solución
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Prerequisites */}
      {showPrerequisites && prerequisites.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h4 className="font-semibold">Requisitos Previos</h4>
            </div>
          </CardHeader>
          <CardBody>
            <Card className="bg-warning-50 border-warning">
              <CardBody className="py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning-700">
                    Completa estos pasos antes de proceder con la solución principal.
                  </span>
                </div>
              </CardBody>
            </Card>
            <div className="mt-4 space-y-3">
              {prerequisites.map((step) => (
                <SolutionStep
                  key={step.id}
                  step={step}
                  completed={completedSteps.has(step.id)}
                  onComplete={(completed) => handleStepComplete(step.id, completed)}
                  isActive={false}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Solution Steps */}
      {solutionStarted && (
        <div className="space-y-4">
          {mainSteps.map((step, index) => (
            <SolutionStep
              key={step.id}
              step={step}
              stepNumber={index + 1}
              completed={completedSteps.has(step.id)}
              onComplete={(completed) => handleStepComplete(step.id, completed)}
              isActive={currentStep === index}
            />
          ))}
        </div>
      )}

      {/* Completion Summary */}
      {progressPercentage === 100 && (
        <Card className="border-success">
          <CardBody>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-lg font-semibold mb-2">¡Solución Completada!</h3>
              <p className="text-default-600 mb-4">
                Has completado todos los pasos de la solución. El problema debería estar resuelto.
              </p>
              <Button
                color="success"
                variant="flat"
                startContent={<CheckCircle className="w-4 h-4" />}
                onPress={() => onStatusChange?.(problem.id, 'RESOLVED')}
              >
                Marcar como Resuelto
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function SolutionStep({ step, stepNumber, completed, onComplete, isActive }) {
  const [expanded, setExpanded] = useState(isActive);
  const typeConfig = STEP_TYPES[step.type] || STEP_TYPES.MANUAL;
  const TypeIcon = typeConfig.icon;
  const difficultyConfig = DIFFICULTY_LEVELS[step.difficulty] || DIFFICULTY_LEVELS.MEDIUM;

  useEffect(() => {
    if (isActive) {
      setExpanded(true);
    }
  }, [isActive]);

  return (
    <Card className={`${isActive ? 'border-primary' : ''} ${completed ? 'bg-success-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={completed}
              onValueChange={onComplete}
              color="success"
            />
            {stepNumber && (
              <Badge content={stepNumber} color="primary" size="sm">
                <div className="w-8 h-8" />
              </Badge>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{step.title}</h4>
              <Chip
                startContent={<TypeIcon className="w-3 h-3" />}
                color={typeConfig.color}
                variant="flat"
                size="sm"
              >
                {typeConfig.label}
              </Chip>
              <Chip
                color={difficultyConfig.color}
                variant="bordered"
                size="sm"
              >
                {difficultyConfig.label}
              </Chip>
              <Chip
                startContent={<Clock className="w-3 h-3" />}
                variant="bordered"
                size="sm"
              >
                {step.estimatedTime} min
              </Chip>
            </div>
            <p className="text-sm text-default-600">{step.description}</p>
          </div>

          <Button
            variant="light"
            size="sm"
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardBody className="pt-0">
          <Divider className="mb-4" />

          <div className="space-y-4">
            {/* Instructions */}
            <div>
              <h5 className="font-medium mb-2">Instrucciones:</h5>
              <ol className="list-decimal list-inside space-y-1">
                {step.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-default-700">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            {/* Commands */}
            {step.commands && step.commands.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Comandos:</h5>
                <div className="space-y-2">
                  {step.commands.map((command, index) => (
                    <Code key={index} className="block p-2 bg-default-100">
                      {command}
                    </Code>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {step.warnings && step.warnings.length > 0 && (
              <Card className="bg-warning-50 border-warning">
                <CardBody className="py-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <h6 className="font-medium text-warning-700 mb-1">Advertencias</h6>
                      <ul className="list-disc list-inside text-sm text-warning-600">
                        {step.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Success Criteria */}
            {step.successCriteria && (
              <div>
                <h5 className="font-medium mb-2">Criterio de Éxito:</h5>
                <p className="text-sm text-success-700 bg-success-50 p-2 rounded">
                  {step.successCriteria}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  );
}
