/**
 * Recommendation type mapper utility
 * Converts backend RecommendationType enum values to user-friendly display information
 */

import { Shield, Zap, AlertTriangle, HardDrive, Download, Settings, Info, Clock } from 'lucide-react';

// Priority levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Categories
export const CATEGORIES = {
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  MAINTENANCE: 'maintenance',
  STORAGE: 'storage',
  UPDATES: 'updates',
  GENERAL: 'general'
};

// Urgency badge configuration
export const URGENCY_BADGES = {
  IMMEDIATE: {
    text: 'URGENTE',
    color: 'bg-red-600 text-white',
    borderColor: 'border-red-600',
    icon: AlertTriangle,
    animate: true
  },
  URGENT: {
    text: 'ALTA PRIORIDAD',
    color: 'bg-orange-500 text-white',
    borderColor: 'border-orange-500',
    icon: AlertTriangle,
    animate: false
  },
  SOON: {
    text: 'ATENCIÓN REQUERIDA',
    color: 'bg-yellow-500 text-white',
    borderColor: 'border-yellow-500',
    icon: Clock,
    animate: false
  },
  NORMAL: {
    text: 'NORMAL',
    color: 'bg-blue-500 text-white',
    borderColor: 'border-blue-500',
    icon: Info,
    animate: false
  }
};

// Recommendation type mappings - aligned with backend schema
export const RECOMMENDATION_MAPPINGS = {
  // Security recommendations
  DEFENDER_DISABLED: {
    label: 'Windows Defender Desactivado',
    description: 'Windows Defender está desactivado, lo que deja su VM vulnerable a amenazas de seguridad.',
    detailedDescription: 'Windows Defender es la primera línea de defensa contra malware y amenazas de seguridad. Cuando está desactivado, su VM está expuesta a virus, ransomware y otras amenazas.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Activar Windows Defender', 'Configurar protección en tiempo real'],
    userFriendlyExplanation: 'Su antivirus está apagado. Esto es peligroso porque pueden entrar virus a su computadora. Debe activarlo inmediatamente.',
    technicalDetails: 'Windows Defender proporciona protección en tiempo real contra malware, spyware y otras amenazas de seguridad.'
  },

  DEFENDER_THREAT: {
    label: 'Amenazas Detectadas por Defender',
    description: 'Windows Defender ha detectado amenazas activas o elementos en cuarentena.',
    detailedDescription: 'Se han detectado amenazas de seguridad que requieren atención inmediata para mantener la seguridad del sistema.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Revisar amenazas detectadas', 'Ejecutar análisis completo', 'Limpiar elementos en cuarentena'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.threatCount > 0) {
        return `Su antivirus encontró ${metadata.threatCount} amenaza(s) en su computadora. Debe revisarlas y limpiarlas inmediatamente.`;
      }
      return 'Su antivirus encontró virus o amenazas en su computadora. Debe revisarlas y limpiarlas inmediatamente.';
    },
    technicalDetails: 'Windows Defender ha detectado malware, spyware u otras amenazas que están activas o en cuarentena.'
  },

  // Performance recommendations
  HIGH_CPU_APP: {
    label: 'Aplicaciones con Uso Alto de CPU',
    description: 'Aplicaciones específicas están consumiendo recursos excesivos de CPU.',
    detailedDescription: 'Algunas aplicaciones están utilizando más CPU de lo normal, lo que puede ralentizar el sistema.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Identificar aplicaciones problemáticas', 'Cerrar aplicaciones innecesarias', 'Reiniciar aplicaciones específicas'],
    userFriendlyExplanation: 'Algunos programas están usando demasiada energía de su computadora. Debe cerrar los que no necesite.',
    technicalDetails: 'Aplicaciones específicas están consumiendo recursos de CPU por encima de los umbrales normales.'
  },

  HIGH_RAM_APP: {
    label: 'Aplicaciones con Uso Alto de Memoria',
    description: 'Aplicaciones específicas están consumiendo recursos excesivos de memoria.',
    detailedDescription: 'Algunas aplicaciones están utilizando más memoria RAM de lo normal, afectando el rendimiento del sistema.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Identificar aplicaciones que consumen memoria', 'Cerrar aplicaciones innecesarias', 'Reiniciar aplicaciones específicas'],
    userFriendlyExplanation: 'Algunos programas están usando demasiada memoria de su computadora. Debe cerrar los que no necesite.',
    technicalDetails: 'Aplicaciones específicas están consumiendo recursos de memoria por encima de los umbrales normales.'
  },

  // Storage recommendations
  DISK_SPACE_LOW: {
    label: 'Espacio en Disco Bajo',
    description: 'Queda poco espacio libre en el disco, lo que puede afectar el funcionamiento.',
    detailedDescription: 'Cuando el espacio libre es menor al 10%, el sistema puede volverse inestable y lento.',
    priority: PRIORITY_LEVELS.CRITICAL,
    category: CATEGORIES.STORAGE,
    icon: HardDrive,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    actions: ['Eliminar archivos innecesarios', 'Limpiar archivos temporales', 'Mover archivos a almacenamiento externo'],
    userFriendlyExplanation: 'Su disco duro está casi lleno (como un closet repleto). Esto puede causar problemas. Debe borrar archivos que no necesite.',
    technicalDetails: 'Se recomienda mantener al menos 15% de espacio libre para un funcionamiento óptimo.'
  },

  // Update recommendations
  APP_UPDATE_AVAILABLE: {
    label: 'Actualizaciones de Aplicaciones Disponibles',
    description: 'Hay actualizaciones disponibles para algunas aplicaciones instaladas.',
    detailedDescription: 'Las actualizaciones de aplicaciones incluyen mejoras de seguridad, corrección de errores y nuevas funcionalidades.',
    priority: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      return metadata?.securityUpdateCount > 0 ? PRIORITY_LEVELS.HIGH : PRIORITY_LEVELS.MEDIUM;
    },
    category: CATEGORIES.UPDATES,
    icon: Download,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    actions: ['Revisar actualizaciones disponibles', 'Instalar actualizaciones de seguridad', 'Programar actualizaciones automáticas'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.securityUpdateCount > 0) {
        return `Tiene ${metadata.securityUpdateCount} actualización(es) de seguridad importante(s). Es como actualizar aplicaciones en su teléfono - mejora la seguridad y funciones.`;
      }
      return 'Algunos de sus programas tienen versiones nuevas disponibles. Es como actualizar aplicaciones en su teléfono - mejora la seguridad y funciones.';
    },
    technicalDetails: 'Las actualizaciones de aplicaciones incluyen parches de seguridad críticos y mejoras de funcionalidad.'
  },

  OS_UPDATE_AVAILABLE: {
    label: 'Actualizaciones del Sistema Disponibles',
    description: 'Hay actualizaciones críticas o de seguridad de Windows disponibles.',
    detailedDescription: 'Las actualizaciones del sistema incluyen parches de seguridad críticos y mejoras de estabilidad que son esenciales para la seguridad.',
    priority: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      return metadata?.rebootDays >= 7 ? PRIORITY_LEVELS.CRITICAL : PRIORITY_LEVELS.HIGH;
    },
    category: CATEGORIES.UPDATES,
    icon: Download,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Instalar actualizaciones de Windows', 'Programar reinicio', 'Revisar actualizaciones automáticas'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.rebootDays >= 7) {
        return `URGENTE - Su sistema lleva ${metadata.rebootDays} días esperando reinicio. Windows tiene actualizaciones importantes esperando. Es como vacunarse - protege su computadora de problemas nuevos. Debe instalarlas y reiniciar inmediatamente.`;
      } else if (metadata?.rebootDays >= 3) {
        return `Su sistema lleva ${metadata.rebootDays} días esperando reinicio. Windows tiene actualizaciones importantes esperando. Debe instalarlas y reiniciar pronto.`;
      }
      return 'Windows tiene actualizaciones importantes esperando. Es como vacunarse - protege su computadora de problemas nuevos. Debe instalarlas.';
    },
    technicalDetails: 'Windows Update incluye parches de seguridad críticos que protegen contra vulnerabilidades conocidas.'
  },

  // Resource optimization recommendations
  OVER_PROVISIONED: {
    label: 'VM Sobre-Provisionada',
    description: 'Los recursos de la VM (CPU/RAM) están consistentemente sub-utilizados.',
    detailedDescription: 'Su VM tiene más recursos asignados de los que realmente necesita, lo que puede optimizarse.',
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES.PERFORMANCE,
    icon: Settings,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    actions: ['Revisar uso de recursos', 'Considerar reducir CPU/RAM', 'Optimizar configuración'],
    userFriendlyExplanation: 'Su computadora virtual tiene más poder del que necesita (como un camión para ir al supermercado). Puede optimizarla.',
    technicalDetails: 'Los recursos asignados exceden consistentemente el uso real durante períodos prolongados.'
  },

  UNDER_PROVISIONED: {
    label: 'VM Sub-Provisionada',
    description: 'Los recursos de la VM están consistentemente sobre-utilizados, afectando el rendimiento.',
    detailedDescription: 'Su VM necesita más recursos para funcionar óptimamente debido al alto uso constante.',
    priority: PRIORITY_LEVELS.HIGH,
    category: CATEGORIES.PERFORMANCE,
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actions: ['Aumentar CPU/RAM', 'Revisar carga de trabajo', 'Optimizar aplicaciones'],
    userFriendlyExplanation: 'Su computadora virtual necesita más poder para trabajar bien (como necesitar más trabajadores en una fábrica ocupada).',
    technicalDetails: 'Los recursos están consistentemente sobre-utilizados, causando degradación del rendimiento.'
  },

  // Network recommendations
  PORT_BLOCKED: {
    label: 'Puertos Bloqueados',
    description: 'Las reglas del firewall están bloqueando puertos que las aplicaciones intentan usar.',
    detailedDescription: 'Algunas aplicaciones no pueden funcionar correctamente debido a reglas de firewall que bloquean sus puertos.',
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES.SECURITY,
    icon: Shield,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    actions: ['Revisar reglas de firewall', 'Configurar excepciones', 'Verificar aplicaciones afectadas'],
    userFriendlyExplanation: (recommendation) => {
      const metadata = extractRecommendationMetadata(recommendation);
      if (metadata?.blockedPorts && metadata.blockedPorts.length > 0) {
        const port = metadata.blockedPorts[0];
        return `El programa '${port.processName || 'Unknown'}' no puede comunicarse en el puerto ${port.port} porque el firewall lo está bloqueando. Puede que necesite ajustar la configuración.`;
      }
      return 'Algunos programas no pueden comunicarse porque el firewall los está bloqueando. Puede que necesite ajustar la configuración.';
    },
    technicalDetails: 'Las reglas de firewall están impidiendo el tráfico de red legítimo de aplicaciones específicas.'
  },

  // General recommendations
  OTHER: {
    label: 'Recomendación General',
    description: 'Recomendación del sistema que no encaja en otras categorías.',
    detailedDescription: 'Esta es una recomendación general del sistema para mejorar el funcionamiento.',
    priority: PRIORITY_LEVELS.LOW,
    category: CATEGORIES.GENERAL,
    icon: Info,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    actions: ['Revisar detalles', 'Aplicar recomendación'],
    userFriendlyExplanation: 'El sistema tiene una recomendación general para mejorar el funcionamiento.',
    technicalDetails: 'Recomendación miscelánea del sistema.'
  }
};

// Type aliases for backend compatibility
RECOMMENDATION_MAPPINGS.SYSTEM_UPDATE_AVAILABLE = RECOMMENDATION_MAPPINGS.OS_UPDATE_AVAILABLE;

/**
 * Get recommendation display information
 * @param {string} type - Recommendation type
 * @param {Object} recommendation - Optional full recommendation object with data
 * @returns {Object} Display information object
 */
export const getRecommendationInfo = (type, recommendation = null) => {
  const mapping = RECOMMENDATION_MAPPINGS[type] || {
    label: type,
    description: 'Recomendación del sistema',
    priority: PRIORITY_LEVELS.LOW,
    category: CATEGORIES.GENERAL,
    icon: Info,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    userFriendlyExplanation: 'El sistema tiene una recomendación para mejorar el funcionamiento.',
    technicalDetails: 'Información técnica no disponible.'
  };

  // Resolve dynamic properties if recommendation is provided
  if (recommendation) {
    const resolved = { ...mapping };

    // Resolve dynamic priority
    if (typeof mapping.priority === 'function') {
      resolved.priority = mapping.priority(recommendation);
    }

    // Resolve dynamic userFriendlyExplanation
    if (typeof mapping.userFriendlyExplanation === 'function') {
      resolved.userFriendlyExplanation = mapping.userFriendlyExplanation(recommendation);
    }

    // Extract metadata and attach enhanced info
    const metadata = extractRecommendationMetadata(recommendation);
    if (metadata) {
      resolved.urgencyBadge = getUrgencyBadge(type, metadata);
      resolved.dataPreview = getDataPreview(type, metadata);
      resolved.affectedCount = getAffectedCount(type, metadata);
    }

    return resolved;
  }

  return mapping;
};

/**
 * Get priority level for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} Priority level
 */
export const getRecommendationPriority = (type) => {
  return getRecommendationInfo(type).priority;
};

/**
 * Get category for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} Category
 */
export const getRecommendationCategory = (type) => {
  return getRecommendationInfo(type).category;
};

/**
 * Get icon component for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {Component} Icon component
 */
export const getRecommendationIcon = (type) => {
  return getRecommendationInfo(type).icon;
};

/**
 * Get user-friendly explanation for a recommendation type
 * @param {string} type - Recommendation type
 * @returns {string} User-friendly explanation
 */
export const getUserFriendlyExplanation = (type) => {
  return getRecommendationInfo(type).userFriendlyExplanation;
};

/**
 * Check if recommendation requires immediate action
 * @param {string} type - Recommendation type
 * @returns {boolean} True if requires immediate action
 */
export const requiresImmediateAction = (type) => {
  const priority = getRecommendationPriority(type);
  return priority === PRIORITY_LEVELS.CRITICAL;
};

/**
 * Get priority color classes
 * @param {string} priority - Priority level
 * @returns {Object} Color classes object
 */
export const getPriorityColors = (priority) => {
  const colorMap = {
    [PRIORITY_LEVELS.CRITICAL]: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    },
    [PRIORITY_LEVELS.HIGH]: {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    },
    [PRIORITY_LEVELS.MEDIUM]: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    [PRIORITY_LEVELS.LOW]: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  return colorMap[priority] || colorMap[PRIORITY_LEVELS.LOW];
};

/**
 * Check if a recommendation type is using fallback mapping
 * @param {string} type - Recommendation type
 * @returns {boolean} True if using fallback mapping
 */
export const isFallbackType = (type) => {
  return !RECOMMENDATION_MAPPINGS[type];
};

/**
 * Get category display information
 * @param {string} category - Category name
 * @returns {Object} Category display information
 */
export const getCategoryInfo = (category) => {
  const categoryMap = {
    [CATEGORIES.SECURITY]: {
      label: 'Seguridad',
      description: 'Recomendaciones relacionadas con la protección y seguridad del sistema',
      icon: Shield,
      color: 'text-red-600'
    },
    [CATEGORIES.PERFORMANCE]: {
      label: 'Rendimiento',
      description: 'Recomendaciones para mejorar la velocidad y eficiencia del sistema',
      icon: Zap,
      color: 'text-orange-600'
    },
    [CATEGORIES.MAINTENANCE]: {
      label: 'Mantenimiento',
      description: 'Tareas de mantenimiento preventivo y optimización',
      icon: Settings,
      color: 'text-blue-600'
    },
    [CATEGORIES.STORAGE]: {
      label: 'Almacenamiento',
      description: 'Gestión del espacio en disco y limpieza de archivos',
      icon: HardDrive,
      color: 'text-purple-600'
    },
    [CATEGORIES.UPDATES]: {
      label: 'Actualizaciones',
      description: 'Actualizaciones de sistema, aplicaciones y controladores',
      icon: Download,
      color: 'text-green-600'
    },
    [CATEGORIES.GENERAL]: {
      label: 'General',
      description: 'Recomendaciones generales del sistema',
      icon: Info,
      color: 'text-muted-foreground'
    }
  };

  return categoryMap[category] || categoryMap[CATEGORIES.GENERAL];
};

/**
 * Extract recommendation metadata from data field
 * @param {Object} recommendation - Full recommendation object
 * @returns {Object} Extracted metadata
 */
export const extractRecommendationMetadata = (recommendation) => {
  if (!recommendation || !recommendation.data) {
    return null;
  }

  let data;
  try {
    data = typeof recommendation.data === 'string'
      ? JSON.parse(recommendation.data)
      : recommendation.data;
  } catch (error) {
    console.error('Failed to parse recommendation data:', error);
    return null;
  }

  const metadata = {};

  // OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE metadata
  if (recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') {
    metadata.rebootDays = data.rebootPendingDays || null;
    metadata.rebootUrgent = data.rebootUrgent || false;
    metadata.rebootRequiredSince = data.rebootRequiredSince || null;
    metadata.totalUpdates = data.totalUpdates || 0;
    metadata.criticalCount = data.criticalCount || 0;
    metadata.securityCount = data.securityCount || 0;
    metadata.importantCount = data.importantCount || 0;
    metadata.updateTitles = data.updateTitles || [];
    metadata.updates = data.updates || [];
  }

  // APP_UPDATE_AVAILABLE metadata
  if (recommendation.type === 'APP_UPDATE_AVAILABLE') {
    metadata.securityUpdateCount = data.security_updates || data.securityCount || 0;
    metadata.totalUpdateCount = data.total_updates || data.totalUpdates || 0;
    metadata.affectedApps = data.applications || data.apps || [];
  }

  // PORT_BLOCKED metadata
  if (recommendation.type === 'PORT_BLOCKED') {
    const blockedPorts = [];

    // Handle array of ports
    if (Array.isArray(data.ports)) {
      data.ports.forEach(portData => {
        blockedPorts.push({
          port: portData.port,
          protocol: portData.protocol,
          processName: portData.processName || 'Unknown',
          processId: portData.processId || null,
          ruleName: portData.ruleName || null,
          ruleAction: portData.ruleAction || null,
          blockReason: portData.blockReason || null,
          attemptCount: portData.attemptCount || 1,
          lastAttempt: portData.lastAttempt || null
        });
      });
    }
    // Handle single port (legacy format)
    else if (data.port && data.protocol) {
      blockedPorts.push({
        port: data.port,
        protocol: data.protocol,
        processName: data.processName || 'Unknown',
        processId: data.processId || null,
        ruleName: data.ruleName || null,
        ruleAction: data.ruleAction || null,
        blockReason: data.blockReason || null,
        attemptCount: data.attemptCount || 1,
        lastAttempt: data.lastAttempt || null
      });
    }

    metadata.blockedPorts = blockedPorts;
  }

  // DEFENDER_THREAT metadata
  if (recommendation.type === 'DEFENDER_THREAT') {
    metadata.activeThreats = data.active_threats || data.activeThreats || 0;
    metadata.quarantinedThreats = data.quarantined_threats || data.quarantinedThreats || 0;
    metadata.threatCount = (metadata.activeThreats || 0) + (metadata.quarantinedThreats || 0);
    metadata.lastScanTime = data.last_scan_time || data.lastScanTime || null;
  }

  // UNDER_PROVISIONED/OVER_PROVISIONED metadata
  if (recommendation.type === 'UNDER_PROVISIONED' || recommendation.type === 'OVER_PROVISIONED') {
    metadata.currentCPU = data.currentCPU || null;
    metadata.recommendedCPU = data.recommendedCPU || null;
    metadata.currentRAM = data.currentRAM || null;
    metadata.recommendedRAM = data.recommendedRAM || null;
    metadata.usagePattern = data.usagePattern || null;
  }

  return metadata;
};

/**
 * Get urgency badge for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {string|null} Urgency level or null
 */
const getUrgencyBadge = (type, metadata) => {
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays >= 7) {
    return 'IMMEDIATE';
  }
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays >= 3) {
    return 'URGENT';
  }
  if (type === 'DEFENDER_THREAT' && metadata.activeThreats > 0) {
    return 'IMMEDIATE';
  }
  if (type === 'APP_UPDATE_AVAILABLE' && metadata.securityUpdateCount > 0) {
    return 'URGENT';
  }
  if (type === 'PORT_BLOCKED') {
    return 'SOON';
  }
  return null;
};

/**
 * Get data preview text for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {string|null} Preview text or null
 */
const getDataPreview = (type, metadata) => {
  if ((type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') && metadata.rebootDays) {
    return `Reinicio pendiente ${metadata.rebootDays} días`;
  }
  if (type === 'APP_UPDATE_AVAILABLE' && metadata.securityUpdateCount > 0) {
    return `${metadata.securityUpdateCount} actualizaciones de seguridad`;
  }
  if (type === 'DEFENDER_THREAT' && metadata.threatCount > 0) {
    return `${metadata.threatCount} amenaza(s) detectada(s)`;
  }
  if (type === 'PORT_BLOCKED' && metadata.blockedPorts?.length > 0) {
    return `Puerto ${metadata.blockedPorts[0].port} bloqueado`;
  }
  return null;
};

/**
 * Get affected count for a recommendation
 * @param {string} type - Recommendation type
 * @param {Object} metadata - Extracted metadata
 * @returns {number|null} Count or null
 */
const getAffectedCount = (type, metadata) => {
  if (type === 'OS_UPDATE_AVAILABLE' || type === 'SYSTEM_UPDATE_AVAILABLE') {
    return metadata.totalUpdates || null;
  }
  if (type === 'APP_UPDATE_AVAILABLE') {
    return metadata.totalUpdateCount || null;
  }
  if (type === 'DEFENDER_THREAT') {
    return metadata.threatCount || null;
  }
  if (type === 'PORT_BLOCKED') {
    return metadata.blockedPorts?.length || null;
  }
  return null;
};

/**
 * Get reboot urgency text helper
 * @param {number} days - Days since reboot required
 * @returns {string} Urgency text
 */
export const getRebootUrgencyText = (days) => {
  if (days >= 7) {
    return `urgente - pendiente ${days} días`;
  } else if (days >= 3) {
    return `atención requerida - pendiente ${days} días`;
  } else if (days > 0) {
    return `pendiente ${days} día(s)`;
  }
  return '';
};