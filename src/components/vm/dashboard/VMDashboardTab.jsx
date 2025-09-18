/**
 * Main dashboard component that replaces HealthDashboard with problem-focused interface
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

import StatusOverview from './StatusOverview';
import CriticalProblemsSection from './CriticalProblemsSection';
import SystemMetrics from './SystemMetrics';
import NetworkInfo from './NetworkInfo';
import { ProblemCard, PrioritySummary } from '../problems';
import useVMProblems from '../../../hooks/useVMProblems';
import { ProblemStatus } from '../../../types/problems';

const VMDashboardTab = ({
  vmId,
  vmName,
  vm,
  onRefresh,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get transformed problem data
  const {
    problems,
    criticalProblems,
    importantProblems,
    informationalProblems,
    summary,
    overallStatus,
    requiresImmediateAction,
    nextRecommendedProblem,
    lastCheckTime,
    isLoading,
    error,
    rawHealthData
  } = useVMProblems(vmId, vmName);

  // Handle problem status changes
  const handleProblemStatusChange = (problemId, newStatus) => {
    // TODO: Implement status change via GraphQL mutation
    console.log('Status change:', problemId, newStatus);
  };

  // Handle solution start
  const handleSolutionStart = (problem, solution) => {
    // TODO: Implement solution tracking
    console.log('Solution started:', problem.id, solution.id);
  };

  // Handle step completion
  const handleStepComplete = (problemId, solutionIndex, stepIndex, step) => {
    // TODO: Implement step tracking
    console.log('Step completed:', problemId, solutionIndex, stepIndex);
  };

  // Handle problem scheduling
  const handleScheduleProblem = (problem) => {
    // TODO: Implement scheduling functionality
    console.log('Schedule problem:', problem.id);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar datos de salud
            </h3>
            <p className="text-sm text-red-600 mb-4">
              No se pudieron cargar los datos de salud de la VM. 
              Por favor, intente actualizar la página.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Estado de Salud - {vmName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitoreo y gestión de problemas del sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <PrioritySummary problems={problems} />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Immediate Action Alert */}
      {requiresImmediateAction && (
        <Card className="border-red-300 bg-red-50 border-2">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">
                  Acción inmediata requerida
                </h3>
                <p className="text-sm text-red-700">
                  Su VM tiene problemas críticos que pueden afectar la operación del negocio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview */}
      <StatusOverview
        overallStatus={overallStatus}
        summary={summary}
        lastCheckTime={lastCheckTime}
        vmName={vmName}
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="critical" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Críticos ({criticalProblems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all-problems" className="flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Todos ({problems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Métricas</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Critical Problems Section */}
          <CriticalProblemsSection
            criticalProblems={criticalProblems}
            onProblemStatusChange={handleProblemStatusChange}
            onSolutionStart={handleSolutionStart}
            onStepComplete={handleStepComplete}
            onScheduleProblem={handleScheduleProblem}
          />

          {/* Next Recommended Action */}
          {nextRecommendedProblem && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Clock className="w-5 h-5" />
                  <span>Próxima acción recomendada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProblemCard
                  problem={nextRecommendedProblem}
                  onStatusChange={handleProblemStatusChange}
                  onSolutionStart={handleSolutionStart}
                  onStepComplete={handleStepComplete}
                  onSchedule={handleScheduleProblem}
                />
              </CardContent>
            </Card>
          )}

          {/* System Metrics Preview */}
          <SystemMetrics
            healthData={rawHealthData}
            problems={problems}
          />

          {/* Network Information */}
          <NetworkInfo vm={vm} />
        </TabsContent>

        {/* Critical Problems Tab */}
        <TabsContent value="critical" className="space-y-6">
          <CriticalProblemsSection
            criticalProblems={criticalProblems}
            onProblemStatusChange={handleProblemStatusChange}
            onSolutionStart={handleSolutionStart}
            onStepComplete={handleStepComplete}
            onScheduleProblem={handleScheduleProblem}
          />
        </TabsContent>

        {/* All Problems Tab */}
        <TabsContent value="all-problems" className="space-y-6">
          {/* Important Problems */}
          {importantProblems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Problemas Importantes ({importantProblems.length})</span>
              </h2>
              <div className="space-y-3">
                {importantProblems.map(problem => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onStatusChange={handleProblemStatusChange}
                    onSolutionStart={handleSolutionStart}
                    onStepComplete={handleStepComplete}
                    onSchedule={handleScheduleProblem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Informational Problems */}
          {informationalProblems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-800 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Información y Recomendaciones ({informationalProblems.length})</span>
              </h2>
              <div className="space-y-3">
                {informationalProblems.map(problem => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onStatusChange={handleProblemStatusChange}
                    onSolutionStart={handleSolutionStart}
                    onStepComplete={handleStepComplete}
                    onSchedule={handleScheduleProblem}
                  />
                ))}
              </div>
            </div>
          )}

          {problems.length === 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    ¡Excelente!
                  </h3>
                  <p className="text-sm text-green-700">
                    No se han detectado problemas en su VM. 
                    El sistema está funcionando correctamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <SystemMetrics
            healthData={rawHealthData}
            problems={problems}
          />

          {/* Network Information */}
          <NetworkInfo vm={vm} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VMDashboardTab;
