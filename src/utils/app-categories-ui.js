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
export const APP_CATEGORIES = {
  DESARROLLO: {
    value: 'DESARROLLO',
    label: 'Desarrollo',
    description: 'Herramientas de desarrollo y programación',
    icon: Code,
    color: 'text-blue-600'
  },
  NAVEGADORES: {
    value: 'NAVEGADORES',
    label: 'Navegadores',
    description: 'Navegadores web y herramientas de navegación',
    icon: Globe,
    color: 'text-green-600'
  },
  MULTIMEDIA: {
    value: 'MULTIMEDIA',
    label: 'Multimedia',
    description: 'Aplicaciones de audio, video e imagen',
    icon: Play,
    color: 'text-purple-600'
  },
  PRODUCTIVIDAD: {
    value: 'PRODUCTIVIDAD',
    label: 'Productividad',
    description: 'Herramientas de oficina y productividad',
    icon: Briefcase,
    color: 'text-orange-600'
  },
  JUEGOS: {
    value: 'JUEGOS',
    label: 'Juegos',
    description: 'Juegos y plataformas gaming',
    icon: Gamepad2,
    color: 'text-red-600'
  },
  COMUNICACION: {
    value: 'COMUNICACION',
    label: 'Comunicación',
    description: 'Herramientas de comunicación y colaboración',
    icon: MessageSquare,
    color: 'text-indigo-600'
  },
  UTILIDADES: {
    value: 'UTILIDADES',
    label: 'Utilidades',
    description: 'Utilidades del sistema y herramientas',
    icon: Settings,
    color: 'text-gray-600'
  },
  GENERAL: {
    value: 'GENERAL',
    label: 'General',
    description: 'Aplicaciones generales y misceláneas',
    icon: Info,
    color: 'text-slate-600'
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