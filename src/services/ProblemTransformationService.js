/**
 * Service for transforming technical health check data into user-friendly problem descriptions
 *
 * Supported solution templates:
 * - updates/outdated_packages: Install security updates
 * - storage/low_disk_space: Free up disk space
 * - security/weak_passwords: Strengthen weak passwords
 * - security/open_ports: Close unnecessary network ports
 * - performance/high_cpu: Reduce processor load
 * - performance/high_memory: Free up memory
 * - applications/service_down: Restore the affected service
 * - firewall/blocked_traffic: Fix incorrectly blocked traffic
 *
 * Issue types without an explicit template fall back to the generic path
 * (localized title/description, no guided steps) via generateSolutions().
 */

import {
  PriorityLevel,
  ProblemCategory,
  ProblemStatus,
  DifficultyLevel,
  SolutionStepType
} from '../types/problems';

class ProblemTransformationService {
  constructor() {
    this.language = 'en'; // Default to English
    this.technicalLevel = 'basic';
    this.initializeResources();
  }

  /**
   * Initialize bilingual resources
   */
  initializeResources() {
    this.resources = {
      es: {
        categories: {
          updates: 'Actualizaciones',
          security: 'Seguridad',
          storage: 'Almacenamiento',
          performance: 'Rendimiento',
          applications: 'Aplicaciones',
          firewall: 'Firewall'
        },
        titles: {
          updates: {
            'outdated_packages': 'Actualizaciones de seguridad pendientes',
            'security_updates': 'Actualizaciones críticas de seguridad disponibles',
            'system_restart': 'Reinicio del sistema requerido'
          },
          security: {
            'weak_passwords': 'Contraseñas débiles detectadas',
            'open_ports': 'Puertos de red expuestos innecesariamente',
            'firewall_disabled': 'Firewall desactivado'
          },
          storage: {
            'low_disk_space': 'Espacio en disco insuficiente',
            'disk_errors': 'Errores en el disco duro detectados',
            'backup_failed': 'Fallos en las copias de seguridad'
          },
          performance: {
            'high_cpu': 'Procesador sobrecargado',
            'high_memory': 'Memoria RAM insuficiente',
            'slow_response': 'Sistema respondiendo lentamente'
          },
          applications: {
            'service_down': 'Servicio crítico no disponible',
            'app_errors': 'Errores en aplicaciones importantes',
            'license_expired': 'Licencias de software vencidas'
          },
          firewall: {
            'blocked_traffic': 'Tráfico de red bloqueado incorrectamente',
            'rule_conflicts': 'Conflictos en reglas de firewall'
          }
        },
        descriptions: {
          updates: {
            'outdated_packages': 'Su sistema tiene actualizaciones de seguridad pendientes que podrían exponer su empresa a vulnerabilidades. Es importante mantener el sistema actualizado para proteger sus datos.',
            'security_updates': 'Se han detectado actualizaciones críticas de seguridad que deben instalarse inmediatamente para proteger su sistema contra amenazas conocidas.',
            'system_restart': 'El sistema necesita reiniciarse para completar la instalación de actualizaciones importantes. Esto mejorará la seguridad y estabilidad.'
          },
          security: {
            'weak_passwords': 'Se han detectado contraseñas débiles que podrían comprometer la seguridad de su sistema. Las contraseñas fuertes son la primera línea de defensa.',
            'open_ports': 'Algunos puertos de red están abiertos innecesariamente, lo que podría permitir acceso no autorizado a su sistema.',
            'firewall_disabled': 'El firewall está desactivado, dejando su sistema vulnerable a ataques externos. Es crucial mantenerlo activo.'
          },
          storage: {
            'low_disk_space': 'El espacio en disco está llegando al límite. Esto puede causar que el sistema funcione lentamente o que fallen las aplicaciones.',
            'disk_errors': 'Se han detectado errores en el disco duro que podrían indicar un fallo inminente. Es importante hacer una copia de seguridad inmediatamente.',
            'backup_failed': 'Las copias de seguridad automáticas han fallado. Sin copias de seguridad, sus datos están en riesgo.'
          },
          performance: {
            'high_cpu': 'El procesador está trabajando al máximo, lo que puede hacer que el sistema responda lentamente y afecte la productividad.',
            'high_memory': 'La memoria RAM está casi llena, lo que puede causar que las aplicaciones funcionen lentamente o se cierren inesperadamente.',
            'slow_response': 'El sistema está respondiendo más lentamente de lo normal, lo que puede afectar el trabajo diario de sus empleados.'
          },
          applications: {
            'service_down': 'Un servicio importante no está funcionando correctamente, lo que puede impedir que sus empleados trabajen normalmente.',
            'app_errors': 'Algunas aplicaciones están presentando errores que pueden afectar la productividad y causar pérdida de datos.',
            'license_expired': 'Las licencias de software han vencido, lo que puede causar que las aplicaciones dejen de funcionar.'
          },
          firewall: {
            'blocked_traffic': 'El firewall está bloqueando tráfico legítimo, lo que puede impedir el funcionamiento normal de aplicaciones.',
            'rule_conflicts': 'Hay conflictos en las reglas del firewall que pueden causar problemas de conectividad.'
          }
        },
        fallbacks: {
          problemDetected: 'Problema detectado en',
          problemRequiresAttention: 'Se ha detectado un problema en {category} que requiere atención.'
        }
      },
      en: {
        categories: {
          updates: 'Updates',
          security: 'Security',
          storage: 'Storage',
          performance: 'Performance',
          applications: 'Applications',
          firewall: 'Firewall'
        },
        titles: {
          updates: {
            'outdated_packages': 'Pending security updates',
            'security_updates': 'Critical security updates available',
            'system_restart': 'System restart required'
          },
          security: {
            'weak_passwords': 'Weak passwords detected',
            'open_ports': 'Unnecessarily exposed network ports',
            'firewall_disabled': 'Firewall disabled'
          },
          storage: {
            'low_disk_space': 'Insufficient disk space',
            'disk_errors': 'Hard drive errors detected',
            'backup_failed': 'Backup failures'
          },
          performance: {
            'high_cpu': 'Processor overloaded',
            'high_memory': 'Insufficient RAM memory',
            'slow_response': 'System responding slowly'
          },
          applications: {
            'service_down': 'Critical service unavailable',
            'app_errors': 'Errors in important applications',
            'license_expired': 'Software licenses expired'
          },
          firewall: {
            'blocked_traffic': 'Network traffic incorrectly blocked',
            'rule_conflicts': 'Firewall rule conflicts'
          }
        },
        descriptions: {
          updates: {
            'outdated_packages': 'Your system has pending security updates that could expose your business to vulnerabilities. It is important to keep the system updated to protect your data.',
            'security_updates': 'Critical security updates have been detected that must be installed immediately to protect your system against known threats.',
            'system_restart': 'The system needs to restart to complete the installation of important updates. This will improve security and stability.'
          },
          security: {
            'weak_passwords': 'Weak passwords have been detected that could compromise your system security. Strong passwords are the first line of defense.',
            'open_ports': 'Some network ports are unnecessarily open, which could allow unauthorized access to your system.',
            'firewall_disabled': 'The firewall is disabled, leaving your system vulnerable to external attacks. It is crucial to keep it active.'
          },
          storage: {
            'low_disk_space': 'Disk space is reaching the limit. This can cause the system to run slowly or applications to fail.',
            'disk_errors': 'Hard drive errors have been detected that could indicate imminent failure. It is important to backup immediately.',
            'backup_failed': 'Automatic backups have failed. Without backups, your data is at risk.'
          },
          performance: {
            'high_cpu': 'The processor is working at maximum capacity, which can make the system respond slowly and affect productivity.',
            'high_memory': 'RAM memory is almost full, which can cause applications to run slowly or close unexpectedly.',
            'slow_response': 'The system is responding slower than normal, which can affect your employees daily work.'
          },
          applications: {
            'service_down': 'An important service is not working correctly, which can prevent your employees from working normally.',
            'app_errors': 'Some applications are presenting errors that can affect productivity and cause data loss.',
            'license_expired': 'Software licenses have expired, which can cause applications to stop working.'
          },
          firewall: {
            'blocked_traffic': 'The firewall is blocking legitimate traffic, which can prevent normal application operation.',
            'rule_conflicts': 'There are conflicts in firewall rules that can cause connectivity problems.'
          }
        },
        fallbacks: {
          problemDetected: 'Problem detected in',
          problemRequiresAttention: 'A problem has been detected in {category} that requires attention.'
        }
      }
    };
  }

  /**
   * Configure the service settings
   * @param {Object} config - Configuration options
   * @param {string} config.language - Language preference ('es' or 'en')
   * @param {string} config.technicalLevel - Technical level ('basic', 'intermediate', 'advanced')
   */
  configure({ language = 'en', technicalLevel = 'basic' } = {}) {
    this.language = language;
    this.technicalLevel = technicalLevel;
  }

  /**
   * Get localized resources for current language
   */
  getResources() {
    return this.resources[this.language] || this.resources.en;
  }

  /**
   * Transform health check data into user-friendly problems
   * @param {Object} healthData - Health check data from backend
   * @param {Object} vmInfo - VM information
   * @returns {import('../types/problems').Problem[]}
   */
  transformHealthChecks(healthData, vmInfo) {
    const problems = [];

    if (!healthData || !healthData.autoChecks) {
      return problems;
    }

    // Transform each health check category
    Object.entries(healthData.autoChecks).forEach(([category, checkData]) => {
      const issues = checkData?.issues || checkData?.alerts || checkData?.items || [];
      issues.forEach((issue, index) => {
        const problem = this.createProblemFromIssue(category, issue, vmInfo, index);
        if (problem) {
          problems.push(problem);
        }
      });
    });

    return problems;
  }

  /**
   * Create a problem object from a health check issue
   * @param {string} category - Health check category
   * @param {Object} issue - Issue data
   * @param {Object} vmInfo - VM information
   * @param {number} index - Issue index for ID generation
   * @returns {import('../types/problems').Problem}
   */
  createProblemFromIssue(category, issue, vmInfo, index) {
    const problemCategory = this.mapHealthCategoryToProblemCategory(category);
    const priority = this.determinePriority(category, issue);

    // Safe ID generation
    const safeVmId = vmInfo?.id ?? 'vm';
    const issueKey = issue?.id ?? `idx-${index}`;
    const id = `${safeVmId}-${category}-${issueKey}`;

    // Safe VM info extraction
    const vmId = vmInfo?.id ?? 'unknown-vm';
    const vmName = vmInfo?.name ?? 'VM';

    // Preserve issue timestamps when available
    const detectedAt = issue?.detectedAt ? new Date(issue.detectedAt) : new Date();

    // Extract affected services from issue
    const affectedServices = issue?.affectedServices || issue?.services || [];

    return {
      id,
      title: this.generateProblemTitle(category, issue),
      description: this.generateProblemDescription(category, issue),
      priority,
      category: problemCategory,
      status: ProblemStatus.NEW,
      businessImpact: this.calculateBusinessImpact(category, issue),
      solutions: this.generateSolutions(category, issue),
      detectedAt,
      lastUpdated: new Date(),
      vmId,
      vmName,
      affectedServices,
      autoResolvable: this.isAutoResolvable(category, issue),
      requiresRestart: this.requiresRestart(category, issue),
      estimatedFixTime: this.estimateFixTime(category, issue),
      technicalDetails: {
        sourceHealthCheck: category,
        rawData: issue
      }
    };
  }

  /**
   * Generate user-friendly problem titles
   */
  generateProblemTitle(category, issue) {
    const resources = this.getResources();
    const titles = resources.titles;

    return titles[category]?.[issue.type]
      || `${resources.fallbacks.problemDetected} ${this.getCategoryDisplayName(category)}`;
  }

  /**
   * Generate detailed problem descriptions
   */
  generateProblemDescription(category, issue) {
    const resources = this.getResources();
    const descriptions = resources.descriptions;

    return descriptions[category]?.[issue.type]
      || issue.description
      || resources.fallbacks.problemRequiresAttention.replace('{category}', this.getCategoryDisplayName(category));
  }

  /**
   * Generate step-by-step solutions
   */
  generateSolutions(category, issue) {
    const solutionTemplates = {
      updates: {
        'outdated_packages': {
          title: 'Install security updates',
          difficulty: DifficultyLevel.EASY,
          steps: [
            {
              title: 'Check available updates',
              description: 'Review which updates are pending',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            },
            {
              title: 'Install updates',
              description: 'Apply all security updates',
              type: SolutionStepType.AUTOMATED,
              estimatedTime: 15
            },
            {
              title: 'Verify installation',
              description: 'Confirm the updates were installed correctly',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            }
          ]
        }
      },
      storage: {
        'low_disk_space': {
          title: 'Free up disk space',
          difficulty: DifficultyLevel.EASY,
          steps: [
            {
              title: 'Clean temporary files',
              description: 'Delete temporary files and system cache',
              type: SolutionStepType.AUTOMATED,
              estimatedTime: 10
            },
            {
              title: 'Review large files',
              description: 'Identify and review files taking up a lot of space',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            },
            {
              title: 'Set up automatic cleanup',
              description: 'Enable automatic cleanup to prevent the problem',
              type: SolutionStepType.AUTOMATED,
              estimatedTime: 5
            }
          ]
        }
      },
      security: {
        'weak_passwords': {
          title: 'Strengthen weak passwords',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Identify affected accounts',
              description: 'Review which accounts were flagged for weak passwords',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            },
            {
              title: 'Set strong passwords',
              description: 'Update each account with a strong, unique password',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            },
            {
              title: 'Enforce a password policy',
              description: 'Require minimum length and complexity to prevent recurrence',
              type: SolutionStepType.MANUAL,
              estimatedTime: 10
            }
          ]
        },
        'open_ports': {
          title: 'Close unnecessary network ports',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Review exposed ports',
              description: 'Confirm which open ports are not required by any service',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 10
            },
            {
              title: 'Restrict or close the ports',
              description: 'Update firewall rules to block or limit access to the ports',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            },
            {
              title: 'Verify connectivity',
              description: 'Confirm required services still work after tightening access',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            }
          ]
        }
      },
      performance: {
        'high_cpu': {
          title: 'Reduce processor load',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Identify the demanding processes',
              description: 'Review which processes are consuming the most CPU',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            },
            {
              title: 'Stop or reconfigure them',
              description: 'Close unneeded processes or adjust their resource usage',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            },
            {
              title: 'Confirm the load dropped',
              description: 'Verify CPU usage returned to normal levels',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            }
          ]
        },
        'high_memory': {
          title: 'Free up memory',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Identify memory-heavy applications',
              description: 'Review which applications are using the most RAM',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            },
            {
              title: 'Close or restart them',
              description: 'Close unused applications or restart those leaking memory',
              type: SolutionStepType.MANUAL,
              estimatedTime: 10
            },
            {
              title: 'Consider adding memory',
              description: 'If usage stays high, plan to increase the VM memory allocation',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            }
          ]
        }
      },
      applications: {
        'service_down': {
          title: 'Restore the affected service',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Confirm the service status',
              description: 'Check that the reported service is actually stopped',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            },
            {
              title: 'Restart the service',
              description: 'Start the service and review its logs for the failure cause',
              type: SolutionStepType.MANUAL,
              estimatedTime: 10
            },
            {
              title: 'Verify it stays up',
              description: 'Confirm the service is running and responding as expected',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            }
          ]
        }
      },
      firewall: {
        'blocked_traffic': {
          title: 'Fix incorrectly blocked traffic',
          difficulty: DifficultyLevel.MEDIUM,
          steps: [
            {
              title: 'Identify the blocked traffic',
              description: 'Review which legitimate traffic the firewall is blocking',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 10
            },
            {
              title: 'Adjust the firewall rules',
              description: 'Add or update rules to allow the required traffic',
              type: SolutionStepType.MANUAL,
              estimatedTime: 15
            },
            {
              title: 'Verify the connection',
              description: 'Confirm the affected applications now connect correctly',
              type: SolutionStepType.VERIFICATION,
              estimatedTime: 5
            }
          ]
        }
      }
    };

    const template = solutionTemplates[category]?.[issue.type] ||
      solutionTemplates[category]?.[issue.severity];

    if (template) {
      return [{
        id: `solution-${category}-${issue.type || issue.severity}`,
        title: template.title,
        description: `Step-by-step solution to resolve: ${this.generateProblemTitle(category, issue)}`,
        difficulty: template.difficulty,
        totalEstimatedTime: template.steps.reduce((total, step) => total + step.estimatedTime, 0),
        steps: template.steps.map((step, index) => ({
          id: `step-${index + 1}`,
          ...step,
          isCompleted: false,
          isOptional: false
        })),
        prerequisites: [],
        warnings: this.getWarningsForCategory(category),
        successCriteria: [`The problem "${this.generateProblemTitle(category, issue)}" must be resolved`]
      }];
    }

    return [];
  }

  /**
   * Map health check categories to problem categories
   */
  mapHealthCategoryToProblemCategory(healthCategory) {
    const mapping = {
      'updates': ProblemCategory.UPDATES,
      'security': ProblemCategory.SECURITY,
      'storage': ProblemCategory.STORAGE,
      'performance': ProblemCategory.PERFORMANCE,
      'applications': ProblemCategory.APPLICATIONS,
      'firewall': ProblemCategory.FIREWALL
    };

    return mapping[healthCategory] || ProblemCategory.SYSTEM;
  }

  /**
   * Determine problem priority based on category and issue details
   */
  determinePriority(category, issue) {
    // Critical priorities
    if (category === 'security' ||
      (category === 'storage' && issue.severity === 'critical') ||
      (category === 'applications' && issue.type === 'service_down')) {
      return PriorityLevel.CRITICAL;
    }

    // Important priorities  
    if (category === 'updates' ||
      category === 'performance' ||
      (category === 'storage' && issue.severity === 'high')) {
      return PriorityLevel.IMPORTANT;
    }

    // Default to informational
    return PriorityLevel.INFORMATIONAL;
  }

  /**
   * Calculate business impact
   */
  calculateBusinessImpact(category, issue) {
    const impactMap = {
      security: {
        description: 'Security risk that could compromise confidential data',
        productivityImpact: 'HIGH',
        securityRisk: 'CRITICAL',
        systemStabilityRisk: 'MEDIUM'
      },
      storage: {
        description: 'Storage problems that can cause data loss',
        productivityImpact: 'MEDIUM',
        securityRisk: 'LOW',
        systemStabilityRisk: 'HIGH'
      },
      performance: {
        description: 'Reduced performance that affects daily productivity',
        productivityImpact: 'HIGH',
        securityRisk: 'NONE',
        systemStabilityRisk: 'MEDIUM'
      },
      updates: {
        description: 'Pending updates that improve security and stability',
        productivityImpact: 'LOW',
        securityRisk: 'MEDIUM',
        systemStabilityRisk: 'MEDIUM'
      }
    };

    return impactMap[category] || {
      description: 'Problem that requires attention',
      productivityImpact: 'LOW',
      securityRisk: 'LOW',
      systemStabilityRisk: 'LOW'
    };
  }

  /**
   * Estimate fix time in minutes
   */
  estimateFixTime(category, issue) {
    const timeEstimates = {
      updates: 30,
      security: 45,
      storage: 25,
      performance: 35,
      applications: 40,
      firewall: 20
    };

    return timeEstimates[category] || 30;
  }

  /**
   * Check if problem can be auto-resolved
   */
  isAutoResolvable(category, issue) {
    const autoResolvableTypes = ['outdated_packages', 'temp_files', 'cache_cleanup'];
    return autoResolvableTypes.includes(issue.type);
  }

  /**
   * Check if solution requires system restart
   */
  requiresRestart(category, issue) {
    const restartRequired = ['system_restart', 'kernel_update', 'driver_update'];
    return restartRequired.includes(issue.type);
  }

  /**
   * Get category display name in current language
   */
  getCategoryDisplayName(category) {
    const resources = this.getResources();
    return resources.categories[category] || category;
  }

  /**
   * Get warnings for specific categories
   */
  getWarningsForCategory(category) {
    const warnings = {
      security: ['Make sure you have backups before making security changes'],
      storage: ['Back up important data before continuing'],
      updates: ['The system may need to restart after updates']
    };

    return warnings[category] || [];
  }
}

const problemTransformationService = new ProblemTransformationService();

export default problemTransformationService;
