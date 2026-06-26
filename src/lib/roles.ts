/**
 * Role helpers for Infinibay.
 *
 * Roles come from the backend User model: ADMIN, SUPER_ADMIN, USER.
 * - Operator = ADMIN or SUPER_ADMIN (runs the instance).
 * - End user = USER (connects to their assigned desktops via /workspace).
 *
 * IMPORTANT: the legacy `role` enum is NOT the whole story. The backend
 * base-tiers every custom role to enum `USER`, so a delegated operator holding
 * a custom role looks like an end user through `isEndUser()` alone. Prefer the
 * `*View` helpers below, which derive the operator-vs-end-user split from the
 * `myPermissions.allowedResources` set (the nav areas the user can actually
 * reach) and only fall back to the enum when those resources aren't loaded yet.
 *
 * These helpers are the single source of truth for role checks in the UI.
 * Server-side enforcement is separate and must also be in place.
 */

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'USER';

export interface RoleHolder {
  role?: string | null;
}

/**
 * Nav areas that ONLY operators ever hold. If `allowedResources` contains any
 * of these the user runs the instance and gets the operator shell — regardless
 * of which legacy enum the backend tiered their custom role to.
 *
 * This list must stay *exclusive*: a plain end-user (enum USER) is granted
 * read access to departments/applications/scripts/users/infrastructure/
 * settings/firewall, so those resources appear in their `allowedResources` and
 * MUST NOT be treated as operator markers (doing so misclassifies every USER
 * as an operator). The ids below are the ones a plain USER never holds:
 *  - 'overview'/'desktops' — USER's vm grants are OWN-scoped → 'workspace'.
 *  - 'blueprints'          — USER has no machineTemplate/goldenImage/iso.
 *  - 'identity'            — USER has no identityProvider grant.
 *  - 'policies'            — USER has no role/permission/audit grant.
 */
export const OPERATOR_RESOURCES: string[] = [
  'overview',
  'desktops',
  'blueprints',
  'identity',
  'policies',
];

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

/**
 * True when the user should see the OPERATOR shell. Driven by the resources the
 * backend says they can reach (so custom-role operators are recognised); falls
 * back to the legacy enum while `allowedResources` is still loading.
 */
export function isOperatorView(
  user: RoleHolder | null | undefined,
  allowedResources?: string[] | null,
): boolean {
  if (allowedResources && allowedResources.length) {
    return allowedResources.some((r) => OPERATOR_RESOURCES.includes(r));
  }
  return isOperator(user);
}

/**
 * True when the user should see the END-USER shell (workspace only). The
 * complement of {@link isOperatorView}, with the same enum fallback.
 */
export function isEndUserView(
  user: RoleHolder | null | undefined,
  allowedResources?: string[] | null,
): boolean {
  if (allowedResources && allowedResources.length) {
    return !isOperatorView(user, allowedResources);
  }
  return isEndUser(user);
}

export function landingRouteForRole(user: RoleHolder | null | undefined): string {
  if (isOperator(user)) return '/overview';
  if (isEndUser(user)) return '/workspace';
  return '/auth/sign-in';
}
