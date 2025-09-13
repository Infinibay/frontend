/**
 * Card component for displaying individual problems in a clear, action-oriented format
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Eye,
  Wrench,
  Play
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SolutionSteps from './SolutionSteps';
import { PriorityLevel, ProblemStatus, DifficultyLevel } from '../../../types/problems';
import { formatMinutes } from '../../../utils/time';

const ProblemCard = ({
  problem,
  onStatusChange,
  onSolutionStart,
  onStepComplete,
  onSchedule,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(0);



  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      [ProblemStatus.NEW]: 'bg-blue-100 text-blue-800',
      [ProblemStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [ProblemStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [ProblemStatus.DISMISSED]: 'bg-gray-100 text-gray-800',
      [ProblemStatus.SCHEDULED]: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      [ProblemStatus.NEW]: 'Nuevo',
      [ProblemStatus.IN_PROGRESS]: 'En progreso',
      [ProblemStatus.RESOLVED]: 'Resuelto',
      [ProblemStatus.DISMISSED]: 'Descartado',
      [ProblemStatus.SCHEDULED]: 'Programado'
    };
    return labels[status] || status;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      [DifficultyLevel.EASY]: 'text-green-600',
      [DifficultyLevel.MEDIUM]: 'text-yellow-600',
      [DifficultyLevel.HARD]: 'text-orange-600',
      [DifficultyLevel.EXPERT]: 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(problem.id, newStatus);
    }
  };

  // Handle solution start
  const handleSolutionStart = (solutionIndex = 0) => {
    setSelectedSolution(solutionIndex);
    setShowSolution(true);
    handleStatusChange(ProblemStatus.IN_PROGRESS);

    if (onSolutionStart) {
      onSolutionStart(problem, problem.solutions[solutionIndex]);
    }
  };

  // Handle step completion
  const handleStepComplete = (stepIndex, step) => {
    if (onStepComplete) {
      onStepComplete(problem.id, selectedSolution, stepIndex, step);
    }
  };

  // Handle solution completion
  const handleSolutionComplete = (solution) => {
    handleStatusChange(ProblemStatus.RESOLVED);
    setShowSolution(false);
  };

  const currentSolution = problem.solutions[selectedSolution];

  return (
    <Card className={`
      w-full transition-all duration-200 hover:shadow-md
      ${problem.priority === PriorityLevel.CRITICAL ? 'border-red-200 shadow-red-50' : ''}
      ${problem.priority === PriorityLevel.IMPORTANT ? 'border-yellow-200 shadow-yellow-50' : ''}
      ${className}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <PriorityBadge
                priority={problem.priority}
                size="small"
                animated={problem.priority === PriorityLevel.CRITICAL}
              />
              <Badge className={getStatusColor(problem.status)}>
                {getStatusLabel(problem.status)}
              </Badge>
              {problem.autoResolvable && (
                <Badge variant="outline" className="text-xs">
                  <Play className="w-3 h-3 mr-1" />
                  Auto-resoluble
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight mb-2">
              {problem.title}
            </CardTitle>
            <p className="text-sm text-gray-600 leading-relaxed">
              {problem.description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 flex-shrink-0"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatMinutes(problem.estimatedFixTime)}</span>
          </div>
          <div className="flex items-center">
            <Wrench className="w-4 h-4 mr-1" />
            <span className="capitalize">{problem.category.toLowerCase()}</span>
          </div>
          {problem.requiresRestart && (
            <div className="flex items-center text-orange-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Requiere reinicio</span>
            </div>
          )}
        </div>

        {/* Business impact alert for critical issues */}
        {problem.priority === PriorityLevel.CRITICAL && (
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Impacto crítico:</strong> {problem.businessImpact.description}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Detailed business impact */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Impacto en el negocio:</h4>
            <p className="text-sm text-gray-600 mb-2">{problem.businessImpact.description}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-medium">Productividad:</span>
                <span className={`ml-1 ${problem.businessImpact.productivityImpact === 'CRITICAL' ? 'text-red-600' :
                  problem.businessImpact.productivityImpact === 'HIGH' ? 'text-orange-600' :
                    problem.businessImpact.productivityImpact === 'MEDIUM' ? 'text-yellow-600' :
                      'text-green-600'
                  }`}>
                  {problem.businessImpact.productivityImpact}
                </span>
              </div>
              <div>
                <span className="font-medium">Seguridad:</span>
                <span className={`ml-1 ${problem.businessImpact.securityRisk === 'CRITICAL' ? 'text-red-600' :
                  problem.businessImpact.securityRisk === 'HIGH' ? 'text-orange-600' :
                    problem.businessImpact.securityRisk === 'MEDIUM' ? 'text-yellow-600' :
                      'text-green-600'
                  }`}>
                  {problem.businessImpact.securityRisk}
                </span>
              </div>
              <div>
                <span className="font-medium">Estabilidad:</span>
                <span className={`ml-1 ${problem.businessImpact.systemStabilityRisk === 'CRITICAL' ? 'text-red-600' :
                  problem.businessImpact.systemStabilityRisk === 'HIGH' ? 'text-orange-600' :
                    problem.businessImpact.systemStabilityRisk === 'MEDIUM' ? 'text-yellow-600' :
                      'text-green-600'
                  }`}>
                  {problem.businessImpact.systemStabilityRisk}
                </span>
              </div>
            </div>
          </div>

          {/* Affected services */}
          {problem.affectedServices && problem.affectedServices.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Servicios afectados:</h4>
              <div className="flex flex-wrap gap-1">
                {problem.affectedServices.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Solutions */}
          {problem.solutions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Soluciones disponibles:</h4>
              <div className="space-y-2">
                {problem.solutions.map((solution, index) => (
                  <div key={solution.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{solution.title}</h5>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(solution.difficulty)}`}
                        >
                          {solution.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatMinutes(solution.totalEstimatedTime)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleSolutionStart(index)}
                      disabled={problem.status === ProblemStatus.RESOLVED}
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Ver solución
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center space-x-2 pt-3 border-t">
            {problem.status === ProblemStatus.NEW && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(ProblemStatus.DISMISSED)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Marcar como visto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onSchedule) {
                      onSchedule(problem);
                    }
                    handleStatusChange(ProblemStatus.SCHEDULED);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar arreglo
                </Button>
                {problem.autoResolvable && (
                  <Button
                    size="sm"
                    onClick={() => {
                      // TODO: Implement auto-resolution
                      handleStatusChange(ProblemStatus.RESOLVED);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resolver automáticamente
                  </Button>
                )}
              </>
            )}

            {problem.status === ProblemStatus.RESOLVED && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Problema resuelto</span>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Solution steps modal/expanded view */}
      {showSolution && currentSolution && (
        <CardContent className="pt-0 border-t">
          <SolutionSteps
            solution={currentSolution}
            onStepComplete={handleStepComplete}
            onSolutionComplete={handleSolutionComplete}
          />
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSolution(false)}
            >
              Cerrar solución
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProblemCard;
