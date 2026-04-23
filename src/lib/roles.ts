/**
 * Role helpers for Infinibay.
 *
 * Roles come from the backend User model: ADMIN, SUPER_ADMIN, USER.
 * - Operator = ADMIN or SUPER_ADMIN (runs the instance).
 * - End user = USER (connects to their assigned desktops via /workspace).
 *
 * These helpers are the single source of truth for role checks in the UI.
 * Server-side enforcement is separate and must also be in place.
 */

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'USER';

export interface RoleHolder {
  role?: string | null;
}

export function isOperator(user: RoleHolder | null | undefined): boolean {
  const r = user?.role;
  return r === 'ADMIN' || r === 'SUPER_ADMIN';
}

export function isSuperAdmin(user: RoleHolder | null | undefined): boolean {
  return user?.role === 'SUPER_ADMIN';
}

export function isEndUser(user: RoleHolder | null | undefined): boolean {
  return user?.role === 'USER';
}

export function landingRouteForRole(user: RoleHolder | null | undefined): string {
  if (isOperator(user)) return '/overview';
  if (isEndUser(user)) return '/workspace';
  return '/auth/sign-in';
}
