/**
 * Official VDI vocabulary for Infinibay UI.
 *
 * Single source of truth for user-facing terminology. Backend may use
 * different internal names (e.g., `Machine`, `MachineTemplate`) — use adapters
 * to translate at the data-layer boundary.
 *
 * See docs/design/harbor_design_guidelines.md §2 for definitions and rules.
 */

export const TERMS = {
  department: {
    singular: 'Department',
    plural: 'Departments',
    article: 'a',
  },
  desktop: {
    singular: 'Desktop',
    plural: 'Desktops',
    article: 'a',
  },
  blueprint: {
    singular: 'Blueprint',
    plural: 'Blueprints',
    article: 'a',
  },
  host: {
    singular: 'Host',
    plural: 'Hosts',
    article: 'a',
  },
  user: {
    singular: 'User',
    plural: 'Users',
    article: 'a',
  },
  operator: {
    singular: 'Operator',
    plural: 'Operators',
    article: 'an',
  },
  event: {
    singular: 'Event',
    plural: 'Events',
    article: 'an',
  },
  application: {
    singular: 'Application',
    plural: 'Applications',
    article: 'an',
  },
  script: {
    singular: 'Script',
    plural: 'Scripts',
    article: 'a',
  },
} as const;

export type TermKey = keyof typeof TERMS;
