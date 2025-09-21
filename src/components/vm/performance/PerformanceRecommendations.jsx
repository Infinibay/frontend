import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  Clock,
  TrendingUp,
  Settings,
  Zap,
  Shield,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';

const PerformanceRecommendations = ({
  recommendations,
  vmId,
  onSchedule,
  onImplement,
  onMoreInfo
}) => {
  const [expandedRec, setExpandedRec] = useState(null);
  const [implementedRecs, setImplementedRecs] = useState(new Set());

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Recomendaciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              ¡Excelente! Tu máquina virtual está funcionando de manera óptima.
              No hay recomendaciones de mejora en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'media':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'baja':
        return <Star className="h-4 w-4 text-blue-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'facil':
        return 'bg-green-100 text-green-800';
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rendimiento':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'configuracion':
        return <Settings className="h-4 w-4 text-blue-600" />;
      case 'optimizacion':
        return <Zap className="h-4 w-4 text-purple-600" />;
      case 'seguridad':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const toggleExpanded = (index) => {
    setExpandedRec(expandedRec === index ? null : index);
  };

  const handleImplement = (rec, index) => {
    setImplementedRecs(prev => new Set([...prev, index]));
    if (onImplement) {
      onImplement(rec);
    }
  };

  const handleSchedule = (rec) => {
    if (onSchedule) {
      onSchedule(rec);
    }
  };

  const handleMoreInfo = (rec) => {
    if (onMoreInfo) {
      onMoreInfo(rec);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <span>Recomendaciones de Mejora</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Sugerencias para optimizar el rendimiento de tu máquina virtual
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            {/* Recommendation Header */}
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getCategoryIcon(rec.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(rec.priority)}
                    <h4 className="text-sm font-medium text-foreground">
                      {rec.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      Prioridad {rec.priority}
                    </Badge>
                    <Badge className={getDifficultyColor(rec.difficulty)}>
                      {rec.difficulty === 'facil' ? 'Fácil' :
                        rec.difficulty === 'moderado' ? 'Moderado' : 'Avanzado'}
                    </Badge>
                    {rec.estimatedTime && (
                      <span className="text-xs text-muted-foreground">
                        ⏱️ {rec.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                {expandedRec === index ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRec === index && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Expected Benefits */}
                {rec.benefits && rec.benefits.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">
                      Beneficios Esperados:
                    </h5>
                    <ul className="space-y-1">
                      {rec.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="text-green-600 text-xs mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Implementation Steps */}
                {rec.steps && rec.steps.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">
                      Pasos para Implementar:
                    </h5>
                    <ol className="space-y-2">
                      {rec.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Business Impact */}
                {rec.businessImpact && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-800 mb-1">
                      Impacto en el Negocio:
                    </h5>
                    <p className="text-sm text-blue-700">
                      {rec.businessImpact}
                    </p>
                  </div>
                )}

                {/* Risk Assessment */}
                {rec.risks && rec.risks.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="text-sm font-medium text-yellow-800 mb-1">
                      Consideraciones:
                    </h5>
                    <ul className="space-y-1">
                      {rec.risks.map((risk, riskIndex) => (
                        <li key={riskIndex} className="text-sm text-yellow-700 flex items-start space-x-2">
                          <span className="text-yellow-600 text-xs mt-1">⚠️</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  {implementedRecs.has(index) ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Implementado</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleImplement(rec, index)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Implementar Ahora
                      </button>
                      <button
                        onClick={() => handleSchedule(rec)}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors"
                      >
                        Programar para Después
                      </button>
                      <button
                        onClick={() => handleMoreInfo(rec)}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors"
                      >
                        Más Información
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Additional Help */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                ¿Necesitas Ayuda?
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Si no estás seguro de cómo implementar alguna recomendación,
                nuestro equipo de soporte puede ayudarte. Las recomendaciones
                se actualizan automáticamente basándose en el uso de tu máquina virtual.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

PerformanceRecommendations.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      priority: PropTypes.string,
      difficulty: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      benefits: PropTypes.arrayOf(PropTypes.string),
      steps: PropTypes.arrayOf(PropTypes.string),
      businessImpact: PropTypes.string,
      estimatedTime: PropTypes.string,
      risks: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  vmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSchedule: PropTypes.func,
  onImplement: PropTypes.func,
  onMoreInfo: PropTypes.func
};

export default PerformanceRecommendations;
