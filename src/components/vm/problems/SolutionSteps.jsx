/**
 * Component for displaying step-by-step solution instructions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import {
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Play,
  RotateCcw
} from 'lucide-react';
import { SolutionStepType, DifficultyLevel } from '../../../types/problems';
import { formatMinutes } from '../../../utils/time';

const SolutionSteps = ({
  solution,
  onStepComplete,
  onStepUndo,
  onSolutionComplete,
  className = ''
}) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate progress
  const totalSteps = solution.steps.length;
  const completedCount = completedSteps.size;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  // Update completed steps from solution data
  useEffect(() => {
    const completed = new Set();
    solution.steps.forEach((step, index) => {
      if (step.isCompleted) {
        completed.add(index);
      }
    });
    setCompletedSteps(completed);
  }, [solution.steps]);

  // Handle step completion
  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);

    if (onStepComplete) {
      onStepComplete(stepIndex, solution.steps[stepIndex]);
    }

    // Check if all steps are completed
    if (newCompleted.size === totalSteps && onSolutionComplete) {
      onSolutionComplete(solution);
    }

    // Move to next step
    if (stepIndex === currentStep && stepIndex < totalSteps - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  // Handle step undo
  const handleStepUndo = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.delete(stepIndex);
    setCompletedSteps(newCompleted);

    if (onStepUndo) {
      onStepUndo(stepIndex, solution.steps[stepIndex]);
    }

    // Move current step back if needed
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      [DifficultyLevel.EASY]: 'bg-green-100 text-green-800',
      [DifficultyLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [DifficultyLevel.HARD]: 'bg-orange-100 text-orange-800',
      [DifficultyLevel.EXPERT]: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-muted text-muted-foreground';
  };

  // Get step type icon
  const getStepTypeIcon = (type) => {
    const icons = {
      [SolutionStepType.MANUAL]: <Circle className="w-4 h-4" />,
      [SolutionStepType.AUTOMATED]: <Play className="w-4 h-4" />,
      [SolutionStepType.VERIFICATION]: <CheckCircle className="w-4 h-4" />,
      [SolutionStepType.EXTERNAL_LINK]: <ExternalLink className="w-4 h-4" />
    };
    return icons[type] || <Circle className="w-4 h-4" />;
  };



  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{solution.title}</CardTitle>
          <Badge className={getDifficultyColor(solution.difficulty)}>
            {solution.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{solution.description}</p>

        {/* Progress and time info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso: {completedCount}/{totalSteps} pasos</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatMinutes(solution.totalEstimatedTime)}
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        {/* Prerequisites */}
        {solution.prerequisites.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Requisitos previos:</strong>
              <ul className="list-disc list-inside mt-1">
                {solution.prerequisites.map((prereq, index) => (
                  <li key={index} className="text-sm">{prereq}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings */}
        {solution.warnings.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Advertencias importantes:</strong>
              <ul className="list-disc list-inside mt-1">
                {solution.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {solution.steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep && !isCompleted;
            const isAccessible = index === 0 || completedSteps.has(index - 1) || isCompleted;

            return (
              <div
                key={step.id}
                className={`
                  border rounded-lg p-4 transition-all duration-200
                  ${isCompleted ? 'bg-green-50 border-green-200' : ''}
                  ${isCurrent ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : ''}
                  ${!isAccessible ? 'bg-muted border-border opacity-60' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Step number and status */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                        ${isCurrent ? 'border-blue-500 bg-blue-500 text-white' : 'border-border text-muted-foreground'}
                      `}>
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-foreground'}`}>
                        {step.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {/* Step type indicator */}
                        <div className="flex items-center text-xs text-muted-foreground">
                          {getStepTypeIcon(step.type)}
                          <span className="ml-1 capitalize">{step.type.toLowerCase()}</span>
                        </div>
                        {/* Time estimate */}
                        <Badge variant="outline" className="text-xs">
                          {formatMinutes(step.estimatedTime)}
                        </Badge>
                        {step.isOptional && (
                          <Badge variant="secondary" className="text-xs">
                            Opcional
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                    {/* Warning message */}
                    {step.warningMessage && (
                      <Alert className="mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {step.warningMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* External link */}
                    {step.type === SolutionStepType.EXTERNAL_LINK && step.externalUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mb-3"
                        onClick={() => window.open(step.externalUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir enlace
                      </Button>
                    )}

                    {/* Expected result */}
                    {step.expectedResult && (
                      <div className="bg-muted p-3 rounded text-sm mb-3">
                        <strong>Resultado esperado:</strong> {step.expectedResult}
                      </div>
                    )}

                    {/* Action buttons */}
                    {isAccessible && (
                      <div className="flex items-center space-x-2">
                        {!isCompleted ? (
                          <Button
                            size="sm"
                            onClick={() => handleStepComplete(index)}
                            disabled={!isAccessible}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como completado
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStepUndo(index)}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Deshacer
                          </Button>
                        )}

                        {step.type === SolutionStepType.AUTOMATED && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement automated action
                              console.log('Execute automated action:', step.automatedAction);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Ejecutar automáticamente
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success criteria */}
        {solution.successCriteria.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Criterios de éxito:</h4>
            <ul className="list-disc list-inside text-sm text-green-700">
              {solution.successCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Rollback steps */}
        {solution.rollbackSteps && solution.rollbackSteps.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Pasos de reversión (si es necesario):</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-700">
              {solution.rollbackSteps.map((step, index) => (
                <li key={index} className="mb-1">{step.title}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionSteps;
