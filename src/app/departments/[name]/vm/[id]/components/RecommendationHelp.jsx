import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Clock, AlertTriangle, Info, Shield, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getRecommendationInfo, getPriorityColors, extractRecommendationMetadata } from '@/utils/recommendationTypeMapper';

/**
 * Recommendation help component that provides contextual help and tooltips
 * for different recommendation types
 */
const RecommendationHelp = ({
  recommendationType,
  recommendation = null,
  showDetailed = false,
  className = ""
}) => {
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);
  const info = getRecommendationInfo(recommendationType, recommendation);
  const priorityColors = getPriorityColors(info.priority);

  // Resolve userFriendlyExplanation if it's a function
  const explanation = typeof info.userFriendlyExplanation === 'function'
    ? info.userFriendlyExplanation(recommendation)
    : info.userFriendlyExplanation;

  // Render structured data based on recommendation type
  const renderStructuredData = (recommendation) => {
    const meta = extractRecommendationMetadata(recommendation);
    if (!meta) return null;

    switch (recommendation.type) {
      case 'OS_UPDATE_AVAILABLE':
      case 'SYSTEM_UPDATE_AVAILABLE':
        return (
          <div className="space-y-4">
            {/* Reboot Timeline Visualization */}
            {meta.rebootDays !== null && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-orange-900">Reinicio Pendiente</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      {meta.rebootDays} día{meta.rebootDays !== 1 ? 's' : ''} desde el último reinicio
                    </p>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full transition-all ${
                      meta.rebootDays >= 7 ? 'bg-red-600' :
                      meta.rebootDays >= 3 ? 'bg-orange-500' :
                      'bg-yellow-400'
                    }`}
                    style={{ width: `${Math.min(100, (meta.rebootDays / 7) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0 días</span>
                  <span>3 días</span>
                  <span>7 días</span>
                </div>
              </div>
            )}

            {/* Update Counts */}
            <div className="grid grid-cols-3 gap-3">
              {meta.totalUpdates > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-900">{meta.totalUpdates}</div>
                  <div className="text-xs text-blue-700">Total</div>
                </div>
              )}
              {meta.securityCount > 0 && (
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-900">{meta.securityCount}</div>
                  <div className="text-xs text-red-700">Seguridad</div>
                </div>
              )}
              {meta.criticalCount > 0 && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-900">{meta.criticalCount}</div>
                  <div className="text-xs text-orange-700">Críticas</div>
                </div>
              )}
            </div>

            {/* Last Reboot Info */}
            {meta.lastReboot && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Último reinicio: {new Date(meta.lastReboot).toLocaleDateString('es-ES')}</span>
              </div>
            )}

            {/* Updates List */}
            {meta.updates && meta.updates.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Actualizaciones Pendientes:</h4>
                <div className="space-y-2">
                  {meta.updates.slice(0, 5).map((update, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">{update.title}</span>
                        {update.isSecurity && (
                          <Badge variant="destructive" className="text-xs">Seguridad</Badge>
                        )}
                      </div>
                      {update.kb && <div className="text-xs text-gray-500 mt-1">KB: {update.kb}</div>}
                    </div>
                  ))}
                  {meta.updates.length > 5 && (
                    <p className="text-xs text-gray-500">... y {meta.updates.length - 5} más</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'APP_UPDATE_AVAILABLE':
        const securityApps = meta.affectedApps?.filter(app => app.isSecurity) || [];
        const regularApps = meta.affectedApps?.filter(app => !app.isSecurity) || [];

        return (
          <div className="space-y-4">
            {/* Update Counts */}
            <div className="grid grid-cols-2 gap-3">
              {meta.securityUpdateCount > 0 && (
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-900">{meta.securityUpdateCount}</div>
                  <div className="text-xs text-red-700">Actualizaciones de Seguridad</div>
                </div>
              )}
              {meta.totalApps > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-900">{meta.totalApps}</div>
                  <div className="text-xs text-blue-700">Aplicaciones Afectadas</div>
                </div>
              )}
            </div>

            {/* Security Updates */}
            {securityApps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-sm">Actualizaciones de Seguridad:</h4>
                </div>
                <div className="space-y-2">
                  {securityApps.slice(0, 5).map((app, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">{app.name}</span>
                        <Badge variant="destructive" className="text-xs">Seguridad</Badge>
                      </div>
                      {app.currentVersion && app.newVersion && (
                        <div className="text-xs text-gray-600 mt-1">
                          {app.currentVersion} → {app.newVersion}
                        </div>
                      )}
                    </div>
                  ))}
                  {securityApps.length > 5 && (
                    <p className="text-xs text-gray-500">... y {securityApps.length - 5} más</p>
                  )}
                </div>
              </div>
            )}

            {/* Regular Updates */}
            {regularApps.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Otras Actualizaciones:</h4>
                <div className="space-y-2">
                  {regularApps.slice(0, 3).map((app, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                      <span className="font-medium">{app.name}</span>
                      {app.currentVersion && app.newVersion && (
                        <div className="text-xs text-gray-600 mt-1">
                          {app.currentVersion} → {app.newVersion}
                        </div>
                      )}
                    </div>
                  ))}
                  {regularApps.length > 3 && (
                    <p className="text-xs text-gray-500">... y {regularApps.length - 3} más</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'PORT_BLOCKED':
        return (
          <div className="space-y-4">
            {meta.blockedPorts && meta.blockedPorts.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Puertos Bloqueados:</h4>
                <div className="space-y-2">
                  {meta.blockedPorts.map((portInfo, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-3 text-sm">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-medium text-lg">{portInfo.port}</span>
                          <span className="text-gray-500 ml-2">({portInfo.protocol})</span>
                        </div>
                        {portInfo.processName && (
                          <Badge variant="outline">{portInfo.processName}</Badge>
                        )}
                      </div>

                      {portInfo.processId && (
                        <div className="text-xs text-gray-600 mb-1">
                          Proceso ID: {portInfo.processId}
                        </div>
                      )}

                      {portInfo.ruleName && (
                        <div className="text-xs text-gray-600 mb-1">
                          Regla: {portInfo.ruleName}
                        </div>
                      )}

                      {portInfo.lastAttempt && (
                        <div className="text-xs text-gray-500">
                          Último intento: {new Date(portInfo.lastAttempt).toLocaleString('es-ES')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800 mt-3">
                  <strong>Guía:</strong> Estos puertos están bloqueados por las reglas de firewall.
                  Use el botón "Configurar Firewall" para revisar y ajustar las reglas según sea necesario.
                </div>
              </div>
            )}
          </div>
        );

      case 'DEFENDER_THREAT':
        return (
          <div className="space-y-4">
            {/* Threat Counts */}
            <div className="grid grid-cols-2 gap-3">
              {meta.activeThreats > 0 && (
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-900">{meta.activeThreats}</div>
                  <div className="text-xs text-red-700">Amenazas Activas</div>
                </div>
              )}
              {meta.quarantinedThreats > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-900">{meta.quarantinedThreats}</div>
                  <div className="text-xs text-yellow-700">En Cuarentena</div>
                </div>
              )}
            </div>

            {/* Threats List */}
            {meta.threats && meta.threats.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Amenazas Detectadas:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Severidad</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Detectado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meta.threats.map((threat, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">
                            <div className="font-medium">{threat.name}</div>
                            {threat.path && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {threat.path}
                              </div>
                            )}
                          </td>
                          <td className="p-2">
                            <Badge
                              variant={
                                threat.severity === 'Critical' || threat.severity === 'High'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {threat.severity}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge
                              variant={threat.status === 'Active' ? 'destructive' : 'outline'}
                            >
                              {threat.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-xs text-gray-600">
                            {threat.detectionTime
                              ? new Date(threat.detectionTime).toLocaleDateString('es-ES')
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Last Scan Info */}
            {meta.lastScan && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Último escaneo: {new Date(meta.lastScan).toLocaleString('es-ES')}</span>
              </div>
            )}
          </div>
        );

      case 'UNDER_PROVISIONED':
      case 'OVER_PROVISIONED':
        const isUnder = recommendation.type === 'UNDER_PROVISIONED';

        return (
          <div className="space-y-4">
            {/* CPU Comparison */}
            {meta.currentCPU !== null && meta.recommendedCPU !== null && (
              <div>
                <h4 className="font-medium text-sm mb-2">CPU</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20">Actual:</span>
                    <div className="flex-1">
                      <Progress
                        value={(meta.currentCPU / Math.max(meta.currentCPU, meta.recommendedCPU)) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{meta.currentCPU} cores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20">Recomendado:</span>
                    <div className="flex-1">
                      <Progress
                        value={(meta.recommendedCPU / Math.max(meta.currentCPU, meta.recommendedCPU)) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{meta.recommendedCPU} cores</span>
                  </div>
                </div>
                {isUnder && meta.currentCPU < meta.recommendedCPU && (
                  <p className="text-xs text-orange-600 mt-2">
                    Se recomienda aumentar en {meta.recommendedCPU - meta.currentCPU} cores
                  </p>
                )}
                {!isUnder && meta.currentCPU > meta.recommendedCPU && (
                  <p className="text-xs text-blue-600 mt-2">
                    Se puede reducir en {meta.currentCPU - meta.recommendedCPU} cores
                  </p>
                )}
              </div>
            )}

            {/* RAM Comparison */}
            {meta.currentRAM !== null && meta.recommendedRAM !== null && (
              <div>
                <h4 className="font-medium text-sm mb-2">RAM</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20">Actual:</span>
                    <div className="flex-1">
                      <Progress
                        value={(meta.currentRAM / Math.max(meta.currentRAM, meta.recommendedRAM)) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{meta.currentRAM} GB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20">Recomendado:</span>
                    <div className="flex-1">
                      <Progress
                        value={(meta.recommendedRAM / Math.max(meta.currentRAM, meta.recommendedRAM)) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{meta.recommendedRAM} GB</span>
                  </div>
                </div>
                {isUnder && meta.currentRAM < meta.recommendedRAM && (
                  <p className="text-xs text-orange-600 mt-2">
                    Se recomienda aumentar en {meta.recommendedRAM - meta.currentRAM} GB
                  </p>
                )}
                {!isUnder && meta.currentRAM > meta.recommendedRAM && (
                  <p className="text-xs text-blue-600 mt-2">
                    Se puede reducir en {meta.currentRAM - meta.recommendedRAM} GB
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Quick tooltip for recommendation type
  const QuickTooltip = ({ children, content }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Priority indicator
  const PriorityIndicator = () => (
    <div className="flex items-center gap-2">
      {info.priority === 'critical' && (
        <AlertTriangle className="h-4 w-4 text-red-600" />
      )}
      <Badge className={priorityColors.badge}>
        {info.priority === 'critical' && 'Critical'}
        {info.priority === 'high' && 'High'}
        {info.priority === 'medium' && 'Medium'}
        {info.priority === 'low' && 'Low'}
      </Badge>
    </div>
  );

  // Simple tooltip help
  if (!showDetailed) {
    return (
      <QuickTooltip content={explanation}>
        <HelpCircle className={`h-4 w-4 ${info.color} hover:opacity-70 cursor-help ${className}`} />
      </QuickTooltip>
    );
  }

  // Detailed help card
  return (
    <Card className={`${className} ${priorityColors.border} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <info.icon className={`h-5 w-5 ${info.color}`} />
              {info.label}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {info.description}
            </p>
          </div>
          <PriorityIndicator />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* User-friendly explanation */}
        <div className={`p-3 rounded-lg ${priorityColors.bg}`}>
          <div className="flex items-start gap-2">
            <Info className={`h-4 w-4 mt-0.5 ${priorityColors.text}`} />
            <div>
              <h4 className="font-medium text-sm mb-1">What does this mean?</h4>
              <p className="text-sm text-gray-700">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Actions section */}
        {info.actions && info.actions.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">What can I do?</h4>
            <ul className="space-y-1">
              {info.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional recommendation data - structured rendering */}
        {recommendation?.data && (
          <div>
            <h4 className="font-medium text-sm mb-2">Additional information</h4>
            {renderStructuredData(recommendation) ?? (
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {typeof recommendation.data === 'string'
                    ? recommendation.data
                    : JSON.stringify(recommendation.data, null, 2)
                  }
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Collapsible technical details */}
        <Collapsible open={isDetailedOpen} onOpenChange={setIsDetailedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            {isDetailedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            View technical details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Technical description:</strong>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {info.detailedDescription}
              </p>
              {info.technicalDetails && (
                <>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Additional details:</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    {info.technicalDetails}
                  </p>
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Creation time if available */}
        {recommendation?.createdAt && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Detected: {new Date(recommendation.createdAt).toLocaleString('en-US')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * General help section for the recommendations system
 */
export const RecommendationsGeneralHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">What are recommendations?</CardTitle>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4 text-sm">
              <p className="text-gray-700">
                Recommendations are automatic suggestions to keep your virtual machine
                running optimally, securely and efficiently.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recommendation types:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                      <span><strong>Critical:</strong> Require immediate attention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                      <span><strong>Important:</strong> Should be resolved soon</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                      <span><strong>Medium:</strong> Improve performance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                      <span><strong>Low:</strong> Optional optimizations</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Categories:</h4>
                  <ul className="space-y-2">
                    <li>🛡️ <strong>Security:</strong> Protection and antivirus</li>
                    <li>⚡ <strong>Performance:</strong> System speed</li>
                    <li>💾 <strong>Storage:</strong> Disk space</li>
                    <li>🔄 <strong>Updates:</strong> Software updates</li>
                    <li>🔧 <strong>Maintenance:</strong> Preventive care</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Tip:</strong> Recommendations are updated automatically.
                  Check this section regularly to keep your VM in optimal condition.
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RecommendationHelp;