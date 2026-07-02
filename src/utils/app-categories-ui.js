/**
 * Utilidades de categorización de aplicaciones - Metadatos de UI
 *
 * Este módulo contiene los metadatos de UI (iconos, colores, etiquetas)
 * para las categorías de aplicaciones.
 *
 * @module app-categories-ui
 */

import {
  Code,
  Globe,
  Play,
  Briefcase,
  Gamepad2,
  MessageSquare,
  Settings,
  Info
} from 'lucide-react';

import {
  APP_CATEGORY_VALUES,
  deriveAppCategory,
  groupAppsByCategory,
  filterAppsByCategory,
  getCategoryStats
} from './app-categories-core';

/**
 * Constantes de categorías de aplicaciones con metadatos de UI
 * Cada categoría incluye etiqueta, descripción, icono y color
 */
// Labels/descriptions are English to match the rest of the UI, and `color` uses
// Harbor semantic foreground tokens (text-info / text-success / text-warning /
// text-danger / text-fg / text-fg-muted) which resolve correctly in both light
// and dark themes — never raw palette classes like text-blue-600 (which have no
// dark variant and clash with the theme).
export const APP_CATEGORIES = {
  DESARROLLO: {
    value: 'DESARROLLO',
    label: 'Development',
    description: 'Development and programming tools',
    icon: Code,
    color: 'text-info'
  },
  NAVEGADORES: {
    value: 'NAVEGADORES',
    label: 'Browsers',
    description: 'Web browsers and navigation tools',
    icon: Globe,
    color: 'text-success'
  },
  MULTIMEDIA: {
    value: 'MULTIMEDIA',
    label: 'Multimedia',
    description: 'Audio, video, and image applications',
    icon: Play,
    color: 'text-info'
  },
  PRODUCTIVIDAD: {
    value: 'PRODUCTIVIDAD',
    label: 'Productivity',
    description: 'Office and productivity tools',
    icon: Briefcase,
    color: 'text-warning'
  },
  JUEGOS: {
    value: 'JUEGOS',
    label: 'Games',
    description: 'Games and gaming platforms',
    icon: Gamepad2,
    color: 'text-danger'
  },
  COMUNICACION: {
    value: 'COMUNICACION',
    label: 'Communication',
    description: 'Communication and collaboration tools',
    icon: MessageSquare,
    color: 'text-info'
  },
  UTILIDADES: {
    value: 'UTILIDADES',
    label: 'Utilities',
    description: 'System utilities and tools',
    icon: Settings,
    color: 'text-fg-muted'
  },
  GENERAL: {
    value: 'GENERAL',
    label: 'General',
    description: 'General and miscellaneous applications',
    icon: Info,
    color: 'text-fg'
  }
};

/**
 * Constantes ready-to-use para opciones de filtros y validaciones
 */
export { APP_CATEGORY_VALUES };

export const APP_CATEGORY_OPTIONS = Object.values(APP_CATEGORIES).map(c => ({
  value: c.value,
  label: c.label
}));

/**
 * Obtiene la información completa de una categoría
 * Acepta clave de categoría, valor o etiqueta y normaliza internamente
 * @param {string} category - Categoría (clave, valor o etiqueta)
 * @returns {Object} Información de la categoría
 */
export const getCategoryInfo = (category) => {
  if (!category || typeof category !== 'string') {
    return APP_CATEGORIES.GENERAL;
  }

  const categoryKey = category.toUpperCase();
  return APP_CATEGORIES[categoryKey] || APP_CATEGORIES.GENERAL;
};

/**
 * Obtiene todas las categorías disponibles
 * @returns {Array} Array de objetos de categoría
 */
export const getAllCategories = () => {
  return Object.values(APP_CATEGORIES);
};

/**
 * Obtiene el componente de icono para una categoría
 * @param {string} category - Categoría (valor de APP_CATEGORIES)
 * @returns {React.Component} Componente de icono de lucide-react
 */
export const getCategoryIcon = (category) => {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.icon;
};

/**
 * Obtiene la etiqueta en español de una categoría
 * @param {string} category - Categoría (valor de APP_CATEGORIES)
 * @returns {string} Etiqueta de la categoría
 */
export const getCategoryLabel = (category) => {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.label;
};

/**
 * Obtiene la descripción en español de una categoría
 * @param {string} category - Categoría (valor de APP_CATEGORIES)
 * @returns {string} Descripción de la categoría
 */
export const getCategoryDescription = (category) => {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.description;
};

/**
 * Obtiene el color CSS de una categoría
 * @param {string} category - Categoría (valor de APP_CATEGORIES)
 * @returns {string} Clase de color CSS
 */
export const getCategoryColor = (category) => {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.color;
};

// Re-exportar funciones de lógica central para mantener compatibilidad
export {
  deriveAppCategory,
  groupAppsByCategory,
  filterAppsByCategory,
  getCategoryStats
};