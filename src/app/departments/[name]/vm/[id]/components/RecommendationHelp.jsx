import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Clock, AlertTriangle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { getRecommendationInfo, getPriorityColors } from '@/utils/recommendationTypeMapper';

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
  const info = getRecommendationInfo(recommendationType);
  const priorityColors = getPriorityColors(info.priority);

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
      <QuickTooltip content={info.userFriendlyExplanation}>
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
                {info.userFriendlyExplanation}
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

        {/* Additional recommendation data */}
        {recommendation?.data && (
          <div>
            <h4 className="font-medium text-sm mb-2">Additional information</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {typeof recommendation.data === 'string'
                  ? recommendation.data
                  : JSON.stringify(recommendation.data, null, 2)
                }
              </pre>
            </div>
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