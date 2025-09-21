/**
 * Utilidades de categorización de aplicaciones - Lógica central
 *
 * Este módulo contiene la lógica pura de categorización sin dependencias de UI.
 * Precedencia de categorización: overrides → keyword scan → GENERAL
 *
 * @module app-categories-core
 */

/**
 * Valores de categorías disponibles
 */
export const APP_CATEGORY_VALUES = [
  'DESARROLLO',
  'NAVEGADORES',
  'MULTIMEDIA',
  'PRODUCTIVIDAD',
  'JUEGOS',
  'COMUNICACION',
  'UTILIDADES',
  'GENERAL'
];

/**
 * Sistema de overrides explícitos para resolver colisiones de palabras clave
 * Claves normalizadas (minúsculas, sin acentos) para nombres exactos de aplicaciones
 */
export const APP_OVERRIDES = {
  'slack': 'COMUNICACION',
  'discord': 'COMUNICACION',
  'teams': 'COMUNICACION',
  'zoom': 'COMUNICACION',
  'steam': 'JUEGOS',
  'epic games': 'JUEGOS',
  'epic games launcher': 'JUEGOS',
  'origin': 'JUEGOS',
  'uplay': 'JUEGOS',
  'battle.net': 'JUEGOS',
  'battlenet': 'JUEGOS',
  'chrome': 'NAVEGADORES',
  'firefox': 'NAVEGADORES',
  'edge': 'NAVEGADORES',
  'safari': 'NAVEGADORES',
  'opera': 'NAVEGADORES',
  'brave': 'NAVEGADORES',
  'vlc': 'MULTIMEDIA',
  'photoshop': 'MULTIMEDIA',
  'premiere': 'MULTIMEDIA',
  'after effects': 'MULTIMEDIA',
  'blender': 'MULTIMEDIA',
  'obs': 'MULTIMEDIA',
  'obs studio': 'MULTIMEDIA',
  'vscode': 'DESARROLLO',
  'visual studio code': 'DESARROLLO',
  'visual studio': 'DESARROLLO',
  'intellij': 'DESARROLLO',
  'android studio': 'DESARROLLO',
  'xcode': 'DESARROLLO',
  'postman': 'DESARROLLO',
  'docker': 'DESARROLLO',
  'git': 'DESARROLLO',
  'office': 'PRODUCTIVIDAD',
  'microsoft office': 'PRODUCTIVIDAD',
  'word': 'PRODUCTIVIDAD',
  'excel': 'PRODUCTIVIDAD',
  'powerpoint': 'PRODUCTIVIDAD',
  'outlook': 'PRODUCTIVIDAD',
  'notion': 'PRODUCTIVIDAD',
  'trello': 'PRODUCTIVIDAD',
  'asana': 'PRODUCTIVIDAD',
  '7-zip': 'UTILIDADES',
  'winrar': 'UTILIDADES',
  'notepad++': 'UTILIDADES',
  'calculator': 'UTILIDADES',
  'antivirus': 'UTILIDADES',
  'malwarebytes': 'UTILIDADES'
};

/**
 * Mapeo de palabras clave a categorías
 * Se utilizan para análisis con matching de límites de palabra
 * Palabras genéricas removidas para reducir falsos positivos
 */
export const CATEGORY_KEYWORDS = {
  DESARROLLO: [
    'visual studio code', 'vs code',
    'github', 'gitlab', 'bitbucket',
    'kubernetes', 'nodejs',
    'javascript', 'typescript', 'python',
    'eclipse', 'sublime text', 'atom',
    'insomnia', 'swagger',
    'webpack', 'npm', 'yarn', 'composer',
    'unity',
    'mysql workbench', 'pgadmin', 'mongodb compass',
    'terminal', 'powershell', 'bash',
    'vim', 'emacs', 'nano',
    'developer', 'programming', 'coding', 'ide',
    'framework', 'library', 'api', 'sdk'
  ],
  NAVEGADORES: [
    'google chrome', 'chromium',
    'mozilla firefox',
    'microsoft edge',
    'internet explorer',
    'browser', 'navegador'
  ],
  MULTIMEDIA: [
    'media player', 'video player',
    'adobe photoshop',
    'paint.net', 'canva',
    'audacity', 'audio editor',
    'adobe premiere',
    'adobe after effects',
    '3ds max', 'maya',
    'streaming',
    'spotify', 'apple music', 'itunes',
    'youtube', 'netflix', 'twitch',
    'multimedia'
  ],
  PRODUCTIVIDAD: [
    'office 365',
    'microsoft word',
    'microsoft excel',
    'microsoft powerpoint',
    'microsoft outlook',
    'obsidian', 'evernote',
    'microsoft teams',
    'jira',
    'calendar', 'calendario',
    'notes', 'notas', 'notebook',
    'acrobat reader',
    'calculadora',
    'productivity', 'productividad'
  ],
  JUEGOS: [
    'epic games launcher',
    'ea origin', 'ea app',
    'ubisoft connect',
    'teamspeak', 'mumble',
    'gaming',
    'juegos',
    'minecraft', 'fortnite', 'league of legends',
    'counter strike', 'valorant',
    'world of warcraft',
    'grand theft auto'
  ],
  COMUNICACION: [
    'microsoft teams',
    'zoom meetings',
    'google meet',
    'whatsapp', 'telegram', 'signal',
    'messenger', 'facebook messenger',
    'email', 'mail', 'correo',
    'chat', 'messaging', 'mensajeria',
    'communication', 'comunicacion',
    'video call', 'videollamada',
    'conference', 'conferencia'
  ],
  UTILIDADES: [
    '7zip', 'rar',
    'zip', 'unzip', 'archiver',
    'notepad',
    'mspaint',
    'ccleaner', 'cleaner',
    'task manager', 'administrador de tareas',
    'file manager', 'explorador',
    'utility', 'utilidad', 'herramienta',
    'backup', 'respaldo',
    'password manager', 'contrasena',
    'security', 'seguridad'
  ]
};

/**
 * Normaliza texto para análisis de categorías
 * Convierte a minúsculas, remueve acentos y caracteres especiales
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
};

/**
 * Función de matching con límites de palabra para reducir falsos positivos
 * @param {string} text - Texto donde buscar
 * @param {string} keyword - Palabra clave a buscar
 * @returns {boolean} True si encuentra coincidencia con límites de palabra
 */
const match = (text, keyword) => {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^a-z0-9])${escapedKeyword}(?:[^a-z0-9]|$)`, 'i');
  return regex.test(text);
};

/**
 * Deriva la categoría de una aplicación basándose en su nombre y descripción
 * Precedencia: overrides → keyword scan → GENERAL
 * @param {Object} app - Objeto de aplicación
 * @param {string} app.name - Nombre de la aplicación
 * @param {string} [app.description] - Descripción de la aplicación
 * @returns {string} Categoría derivada (valor de APP_CATEGORY_VALUES)
 */
export const deriveAppCategory = (app) => {
  if (!app?.name) {
    return 'GENERAL';
  }

  const appName = normalizeText(app.name);
  const appDescription = normalizeText(app.description || '');
  const combinedText = `${appName} ${appDescription}`;

  // 1. Verificar overrides explícitos primero
  if (APP_OVERRIDES[appName]) {
    return APP_OVERRIDES[appName];
  }

  // 2. Buscar coincidencias en palabras clave con matching de límites
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (match(combinedText, keyword)) {
        return category;
      }
    }
  }

  // 3. Categoría por defecto
  return 'GENERAL';
};

/**
 * Agrupa aplicaciones por categoría
 * @param {Array} apps - Array de aplicaciones
 * @returns {Object} Objeto con aplicaciones agrupadas por categoría
 */
export const groupAppsByCategory = (apps) => {
  if (!Array.isArray(apps)) return {};

  return apps.reduce((grouped, app) => {
    const category = deriveAppCategory(app);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(app);
    return grouped;
  }, {});
};

/**
 * Filtra aplicaciones por categoría
 * Acepta clave de categoría, valor o etiqueta y normaliza internamente
 * @param {Array} apps - Array de aplicaciones
 * @param {string} category - Categoría a filtrar (clave, valor o etiqueta)
 * @returns {Array} Aplicaciones filtradas por categoría
 */
export const filterAppsByCategory = (apps, category) => {
  if (!Array.isArray(apps) || !category) return apps || [];

  // Normalizar la categoría a valor válido
  const normalizedCategory = category.toUpperCase();
  const categoryValue = APP_CATEGORY_VALUES.includes(normalizedCategory)
    ? normalizedCategory
    : 'GENERAL';

  return apps.filter(app => deriveAppCategory(app) === categoryValue);
};

/**
 * Obtiene estadísticas de categorías para un conjunto de aplicaciones
 * @param {Array} apps - Array de aplicaciones
 * @returns {Object} Estadísticas de categorías
 */
export const getCategoryStats = (apps) => {
  if (!Array.isArray(apps)) return {};

  const grouped = groupAppsByCategory(apps);
  const stats = {};

  APP_CATEGORY_VALUES.forEach(category => {
    stats[category] = {
      count: grouped[category]?.length || 0,
      percentage: apps.length > 0 ? ((grouped[category]?.length || 0) / apps.length * 100).toFixed(1) : 0
    };
  });

  return stats;
};