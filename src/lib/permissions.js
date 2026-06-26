import { isEndUserView } from '@/lib/roles';

export const ROUTE_RESOURCE_BY_ID = {
  pools: 'desktops',
  images: 'blueprints',
  sessions: 'desktops',
  storage: 'infrastructure',
  events: 'overview',
  profile: 'workspace',
  computers: 'desktops',
  templates: 'blueprints',
  notification: 'overview',
};

export const DEFAULT_ROUTE_BY_RESOURCE = {
  overview: '/overview',
  workspace: '/workspace',
  departments: '/departments',
  desktops: '/desktops',
  infrastructure: '/infrastructure',
  blueprints: '/blueprints',
  applications: '/applications',
  firewall: '/departments',
  scripts: '/scripts',
  users: '/users',
  identity: '/identity',
  policies: '/policies',
  settings: '/settings',
};

export function resourceForNavId(id) {
  return ROUTE_RESOURCE_BY_ID[id] || id;
}

export function resourceForPath(pathname) {
  if (!pathname || pathname === '/') return null;
  if (pathname.startsWith('/auth/')) return null;

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return resourceForNavId(firstSegment);
}

/**
 * Path prefixes that make up the end-user (workspace) shell. An end-user-view
 * user may reach these and their own desktop detail route; everything else is
 * operator-only — even resources their read grants technically expose.
 */
const END_USER_PATH_PREFIXES = ['/workspace', '/profile'];

/** Their own desktop detail route, e.g. /departments/<name>/desktops/<id>. */
const END_USER_DESKTOP_DETAIL = /^\/departments\/[^/]+\/desktops\/[^/]+/;

function isEndUserHref(pathname) {
  if (!pathname) return false;
  const path = pathname.split('?')[0].split('#')[0];
  if (path === '/') return true;
  if (
    END_USER_PATH_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
  ) {
    return true;
  }
  return END_USER_DESKTOP_DETAIL.test(path);
}

export function isPathAllowed(pathname, allowedResources) {
  const resource = resourceForPath(pathname);
  if (!resource) return true;
  if (!allowedResources) return true;
  // End-user view: confine to the workspace shell + their own desktop detail.
  // A plain USER's read grants list operator resources (users, settings,
  // infrastructure, departments, …), so an allowedResources.includes() check
  // alone would wrongly admit them; gate on the end-user shell instead.
  if (isEndUserView(null, allowedResources)) {
    return isEndUserHref(pathname);
  }
  return allowedResources.includes(resource);
}

/**
 * Whether a navigation target (by href) is reachable for the given grants.
 * Mirrors {@link isPathAllowed} so callers that offer shortcuts to a page —
 * e.g. the global command palette — never surface a destination the route
 * guard would immediately bounce the user away from (Users / Settings /
 * Infrastructure / New Desktop for an end user, etc.).
 */
export function isHrefAllowed(href, allowedResources) {
  return isPathAllowed(href, allowedResources);
}

export function firstAllowedRoute(allowedResources, fallback = '/workspace') {
  if (!allowedResources?.length) return fallback;

  // End-user view lives in the workspace shell. Their read grants list
  // operator resources (departments, users, …) whose routes the stricter guard
  // now bounces, so deriving a landing route from them would redirect-loop —
  // honour the (workspace) fallback instead.
  if (isEndUserView(null, allowedResources)) return fallback;

  for (const resource of allowedResources) {
    const route = DEFAULT_ROUTE_BY_RESOURCE[resource];
    if (route) return route;
  }

  return fallback;
}
