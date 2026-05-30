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

export function isPathAllowed(pathname, allowedResources) {
  const resource = resourceForPath(pathname);
  if (!resource) return true;
  if (!allowedResources) return true;
  return allowedResources.includes(resource);
}

export function firstAllowedRoute(allowedResources, fallback = '/workspace') {
  if (!allowedResources?.length) return fallback;

  for (const resource of allowedResources) {
    const route = DEFAULT_ROUTE_BY_RESOURCE[resource];
    if (route) return route;
  }

  return fallback;
}
