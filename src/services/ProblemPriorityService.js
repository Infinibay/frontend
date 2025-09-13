/**
 * Service for intelligently prioritizing VM problems based on business impact and urgency
 */

import { PriorityLevel, ProblemStatus } from '../types/problems';

class ProblemPriorityService {
  constructor() {
    this.priorityWeights = {
      [PriorityLevel.CRITICAL]: 100,
      [PriorityLevel.IMPORTANT]: 50,
      [PriorityLevel.INFORMATIONAL]: 10
    };

    this.businessImpactWeights = {
      CRITICAL: 50,
      HIGH: 30,
      MEDIUM: 15,
      LOW: 5,
      NONE: 0
    };
  }

  /**
   * Calculate priority score for a problem
   * @param {import('../types/problems').Problem} problem
   * @returns {number}
   */
  calculatePriority(problem) {
    let score = 0;

    // Base priority weight
    score += this.priorityWeights[problem.priority] || 0;

    // Business impact factors
    const impact = problem.businessImpact;
    if (impact) {
      score += this.businessImpactWeights[impact.productivityImpact] || 0;
      score += this.businessImpactWeights[impact.securityRisk] || 0;
      score += this.businessImpactWeights[impact.systemStabilityRisk] || 0;
    }

    // Time-based urgency (newer problems get slight boost)
    const hoursSinceDetection = (new Date() - new Date(problem.detectedAt)) / (1000 * 60 * 60);
    if (hoursSinceDetection < 1) {
      score += 5; // Recent problems get small boost
    }

    // Category-specific adjustments
    score += this.getCategoryPriorityAdjustment(problem.category);

    // Auto-resolvable problems get slight boost (easy wins)
    if (problem.autoResolvable) {
      score += 3;
    }

    // Problems requiring restart get penalty (more disruptive)
    if (problem.requiresRestart) {
      score -= 5;
    }

    // Affected services boost
    if (problem.affectedServices && problem.affectedServices.length > 0) {
      score += problem.affectedServices.length * 2;
    }

    return Math.max(0, score);
  }

  /**
   * Sort problems by priority score (highest first)
   * @param {import('../types/problems').Problem[]} problems
   * @returns {import('../types/problems').ScoredProblem[]}
   */
  sortProblemsByPriority(problems) {
    return problems
      .map(p => ({ ...p, priorityScore: this.calculatePriority(p) }))
      .sort((a, b) => {
        // First sort by priority level
        const priorityOrder = {
          [PriorityLevel.CRITICAL]: 3,
          [PriorityLevel.IMPORTANT]: 2,
          [PriorityLevel.INFORMATIONAL]: 1
        };

        const aPriorityOrder = priorityOrder[a.priority] || 0;
        const bPriorityOrder = priorityOrder[b.priority] || 0;

        if (aPriorityOrder !== bPriorityOrder) {
          return bPriorityOrder - aPriorityOrder;
        }

        // Then by priority score
        return b.priorityScore - a.priorityScore;
      });
  }

  /**
   * Get priority label in Spanish
   */
  getPriorityLabel(priority) {
    const labels = {
      [PriorityLevel.CRITICAL]: 'CRÍTICO',
      [PriorityLevel.IMPORTANT]: 'IMPORTANTE',
      [PriorityLevel.INFORMATIONAL]: 'INFORMATIVO'
    };

    return labels[priority] || 'DESCONOCIDO';
  }

  /**
   * Get priority icon
   */
  getPriorityIcon(priority) {
    const icons = {
      [PriorityLevel.CRITICAL]: '🚨',
      [PriorityLevel.IMPORTANT]: '⚠️',
      [PriorityLevel.INFORMATIONAL]: 'ℹ️'
    };

    return icons[priority] || '❓';
  }

  /**
   * Get priority color class
   */
  getPriorityColor(priority) {
    const colors = {
      [PriorityLevel.CRITICAL]: 'text-red-600 bg-red-50 border-red-200',
      [PriorityLevel.IMPORTANT]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      [PriorityLevel.INFORMATIONAL]: 'text-blue-600 bg-blue-50 border-blue-200'
    };

    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  }

  /**
   * Get priority description for tooltips
   */
  getPriorityDescription(priority) {
    const descriptions = {
      [PriorityLevel.CRITICAL]: 'Requiere atención inmediata. Puede afectar la operación del negocio o la seguridad.',
      [PriorityLevel.IMPORTANT]: 'Debe resolverse pronto. Puede afectar el rendimiento o la productividad.',
      [PriorityLevel.INFORMATIONAL]: 'Para monitoreo y optimización. No afecta la operación inmediata.'
    };

    return descriptions[priority] || 'Prioridad no definida';
  }

  /**
   * Get category-specific priority adjustments
   */
  getCategoryPriorityAdjustment(category) {
    const adjustments = {
      SECURITY: 15,      // Security issues always get boost
      STORAGE: 10,       // Storage issues can cause data loss
      PERFORMANCE: 8,    // Performance affects productivity
      APPLICATIONS: 12,  // App issues directly affect users
      UPDATES: 5,        // Updates are important but less urgent
      FIREWALL: 7,       // Network issues affect connectivity
      NETWORK: 6,        // Network issues
      SYSTEM: 4          // General system issues
    };

    return adjustments[category] || 0;
  }

  /**
   * Group problems by priority level
   */
  groupProblemsByPriority(problems) {
    const grouped = {
      [PriorityLevel.CRITICAL]: [],
      [PriorityLevel.IMPORTANT]: [],
      [PriorityLevel.INFORMATIONAL]: []
    };

    problems.forEach(problem => {
      if (grouped[problem.priority]) {
        grouped[problem.priority].push(problem);
      }
    });

    // Sort each group by priority score
    Object.keys(grouped).forEach(priority => {
      grouped[priority] = this.sortProblemsByPriority(grouped[priority]);
    });

    return grouped;
  }

  /**
   * Get summary statistics for problem priorities
   */
  getPrioritySummary(problems) {
    const summary = {
      total: problems.length,
      critical: 0,
      important: 0,
      informational: 0,
      avgPriorityScore: 0,
      highestPriorityProblem: null
    };

    let totalScore = 0;
    let highestScore = 0;

    problems.forEach(problem => {
      const score = this.calculatePriority(problem);
      totalScore += score;

      if (score > highestScore) {
        highestScore = score;
        summary.highestPriorityProblem = problem;
      }

      switch (problem.priority) {
        case PriorityLevel.CRITICAL:
          summary.critical++;
          break;
        case PriorityLevel.IMPORTANT:
          summary.important++;
          break;
        case PriorityLevel.INFORMATIONAL:
          summary.informational++;
          break;
      }
    });

    summary.avgPriorityScore = problems.length > 0 ? totalScore / problems.length : 0;

    return summary;
  }

  /**
   * Determine if immediate action is required
   */
  requiresImmediateAction(problems) {
    return problems.some(problem =>
      problem.priority === PriorityLevel.CRITICAL &&
      (problem.businessImpact.securityRisk === 'CRITICAL' ||
        problem.businessImpact.systemStabilityRisk === 'CRITICAL')
    );
  }

  /**
   * Get recommended action timeline
   */
  getRecommendedTimeline(priority) {
    const timelines = {
      [PriorityLevel.CRITICAL]: 'Resolver inmediatamente (dentro de 1 hora)',
      [PriorityLevel.IMPORTANT]: 'Resolver pronto (dentro de 24 horas)',
      [PriorityLevel.INFORMATIONAL]: 'Revisar cuando sea conveniente (dentro de 1 semana)'
    };

    return timelines[priority] || 'Revisar según disponibilidad';
  }

  /**
   * Filter problems by priority level
   */
  filterByPriority(problems, priorityLevels) {
    if (!priorityLevels || priorityLevels.length === 0) {
      return problems;
    }

    return problems.filter(problem =>
      priorityLevels.includes(problem.priority)
    );
  }

  /**
   * Get next recommended problem to work on
   */
  getNextRecommendedProblem(problems) {
    const sortedProblems = this.sortProblemsByPriority(problems);

    // Find first problem that's not resolved or in progress
    return sortedProblems.find(p =>
      p.status === ProblemStatus.NEW || p.status === ProblemStatus.SCHEDULED
    );
  }
}

export default new ProblemPriorityService();
