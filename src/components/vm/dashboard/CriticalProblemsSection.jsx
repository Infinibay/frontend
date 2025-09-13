/**
 * Component that prominently displays critical problems requiring immediate attention
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  AlertTriangle,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Eye,
  Calendar
} from 'lucide-react';
import { PriorityBadge } from '../problems';
import SolutionSteps from '../problems/SolutionSteps';
import { formatMinutes } from '../../../utils/time';
import { ProblemStatus } from '../../../types/problems';

const CriticalProblemsSection = ({
  criticalProblems = [],
  onProblemStatusChange,
  onSolutionStart,
  onStepComplete,
  onScheduleProblem
}) => {
  const [expandedProblems, setExpandedProblems] = useState(new Set());
  const [showingSolutions, setShowingSolutions] = useState(new Set());

  // Toggle problem expansion
  const toggleProblemExpansion = (problemId) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId);
    } else {
      newExpanded.add(problemId);
    }
    setExpandedProblems(newExpanded);
  };

  // Toggle solution display
  const toggleSolutionDisplay = (problemId) => {
    const newShowing = new Set(showingSolutions);
    if (newShowing.has(problemId)) {
      newShowing.delete(problemId);
    } else {
      newShowing.add(problemId);
      // Also expand the problem if not already expanded
      if (!expandedProblems.has(problemId)) {
        toggleProblemExpansion(problemId);
      }
    }
    setShowingSolutions(newShowing);

    // Notify parent if starting solution
    if (!showingSolutions.has(problemId) && onSolutionStart) {
      const problem = criticalProblems.find(p => p.id === problemId);
      if (problem && problem.solutions.length > 0) {
        onSolutionStart(problem, problem.solutions[0]);
      }
    }
  };

  // Handle status change
  const handleStatusChange = (problemId, newStatus) => {
    if (onProblemStatusChange) {
      onProblemStatusChange(problemId, newStatus);
    }
  };

  // Handle step completion
  const handleStepComplete = (problemId, solutionIndex, stepIndex, step) => {
    if (onStepComplete) {
      onStepComplete(problemId, solutionIndex, stepIndex, step);
    }
  };

  // Handle solution completion
  const handleSolutionComplete = (problemId) => {
    handleStatusChange(problemId, ProblemStatus.RESOLVED);
    setShowingSolutions(prev => {
      const newSet = new Set(prev);
      newSet.delete(problemId);
      return newSet;
    });
  };

  if (criticalProblems.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200 border-2">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              Sin problemas críticos
            </h3>
            <p className="text-sm text-green-700">
              Su VM no tiene problemas que requieran atención inmediata
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-red-800">
          Problemas Críticos ({criticalProblems.length})
        </h2>
      </div>

      <Alert variant="destructive" className="border-red-300 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Atención inmediata requerida:</strong> Estos problemas pueden afectar
          la operación de su negocio y deben resolverse lo antes posible.
        </AlertDescription>
      </Alert>

      {/* Critical Problems List */}
      <div className="space-y-3">
        {criticalProblems.map((problem) => {
          const isExpanded = expandedProblems.has(problem.id);
          const isShowingSolution = showingSolutions.has(problem.id);
          const hasSolutions = Array.isArray(problem.solutions) && problem.solutions.length > 0;
          const primarySolution = hasSolutions ? problem.solutions[0] : null;

          return (
            <Card
              key={problem.id}
              className="border-red-200 border-2 bg-red-50 shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <PriorityBadge
                        priority={problem.priority}
                        size="small"
                        animated={true}
                      />
                      {problem.autoResolvable && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-resoluble
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-lg text-red-800 leading-tight mb-2">
                      {problem.title}
                    </CardTitle>

                    <p className="text-sm text-red-700 leading-relaxed mb-3">
                      {problem.description}
                    </p>

                    {/* Quick Info */}
                    <div className="flex items-center space-x-4 text-sm text-red-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatMinutes(problem.estimatedFixTime)}</span>
                      </div>
                      {problem.affectedServices && problem.affectedServices.length > 0 && (
                        <div>
                          <span className="font-medium">Servicios afectados:</span>
                          <span className="ml-1">{problem.affectedServices.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProblemExpansion(problem.id)}
                    className="ml-2 flex-shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Business Impact Alert */}
                <Alert className="bg-red-100 border-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Impacto en el negocio:</strong> {problem.businessImpact.description}
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  {hasSolutions && (
                    <Button
                      size="sm"
                      onClick={() => toggleSolutionDisplay(problem.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isShowingSolution ? 'Ocultar Pasos' : 'Mostrar Pasos'}
                    </Button>
                  )}

                  {problem.autoResolvable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(problem.id, ProblemStatus.RESOLVED)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resolver Automáticamente
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(problem.id, ProblemStatus.DISMISSED)}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Marcar como Visto
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onScheduleProblem) {
                        onScheduleProblem(problem);
                      }
                      handleStatusChange(problem.id, ProblemStatus.SCHEDULED);
                    }}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Programar
                  </Button>
                </div>
              </CardHeader>

              {/* Expanded Content */}
              {isExpanded && (
                <CardContent className="pt-0">
                  {/* Detailed Business Impact */}
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Impacto detallado:</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Productividad:</span>
                        <span className={`ml-1 ${problem.businessImpact.productivityImpact === 'CRITICAL' ? 'text-red-600' :
                          problem.businessImpact.productivityImpact === 'HIGH' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                          {problem.businessImpact.productivityImpact}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Seguridad:</span>
                        <span className={`ml-1 ${problem.businessImpact.securityRisk === 'CRITICAL' ? 'text-red-600' :
                          problem.businessImpact.securityRisk === 'HIGH' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                          {problem.businessImpact.securityRisk}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Estabilidad:</span>
                        <span className={`ml-1 ${problem.businessImpact.systemStabilityRisk === 'CRITICAL' ? 'text-red-600' :
                          problem.businessImpact.systemStabilityRisk === 'HIGH' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                          {problem.businessImpact.systemStabilityRisk}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Solution Steps */}
                  {isShowingSolution && hasSolutions && primarySolution && (
                    <div className="border-t border-red-200 pt-4">
                      <SolutionSteps
                        solution={primarySolution}
                        onStepComplete={(stepIndex, step) =>
                          handleStepComplete(problem.id, 0, stepIndex, step)
                        }
                        onSolutionComplete={() => handleSolutionComplete(problem.id)}
                      />
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CriticalProblemsSection;
