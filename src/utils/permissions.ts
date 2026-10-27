import { UserRole } from '../types';

export type AppPermission =
  | 'browse_listings'
  | 'view_property_details'
  | 'save_properties'
  | 'compare_properties'
  | 'view_buyer_dashboard'
  | 'view_seller_dashboard'
  | 'create_listing'
  | 'manage_own_listings'
  | 'manage_any_listing'
  | 'ai_matchmaker'
  | 'ai_designer'
  | 'ai_connect_subscribe'
  | 'send_messages'
  | 'view_admin_console'
  | 'manage_users';

/**
 * Explicit Centralized Permission Matrix
 * Role-Based Access Control (RBAC) across Buyer, Seller, Agent, Admin, and Guest.
 */
export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  buyer: [
    'browse_listings',
    'view_property_details',
    'save_properties',
    'compare_properties',
    'view_buyer_dashboard',
    'ai_matchmaker',
    'ai_designer',
    'ai_connect_subscribe',
    'send_messages'
  ],
  seller: [
    'browse_listings',
    'view_property_details',
    'view_seller_dashboard',
    'create_listing',
    'manage_own_listings',
    'ai_designer',
    'ai_connect_subscribe',
    'send_messages'
  ],
  agent: [
    'browse_listings',
    'view_property_details',
    'view_seller_dashboard',
    'create_listing',
    'manage_own_listings',
    'ai_designer',
    'ai_connect_subscribe',
    'send_messages'
  ],
  admin: [
    'browse_listings',
    'view_property_details',
    'view_buyer_dashboard',
    'manage_own_listings',
    'manage_any_listing',
    'view_admin_console',
    'manage_users',
    'ai_matchmaker',
    'ai_designer',
    'ai_connect_subscribe'
  ],
  guest: [
    'browse_listings',
    'view_property_details',
    'compare_properties',
    'ai_matchmaker',
    'ai_designer',
    'ai_connect_subscribe'
  ]
};

/**
 * Check if a role possesses a specific permission.
 */
export function hasPermission(role: UserRole | undefined, permission: AppPermission): boolean {
  if (!role) return ROLE_PERMISSIONS.guest.includes(permission);
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export interface RouteAuthorization {
  allowedRoles: UserRole[];
  requiredPermission?: AppPermission;
  friendlyWorkspaceName: string;
}

/**
 * Route protection mapping
 */
export const ROUTE_ACCESS_MAP: Record<string, RouteAuthorization> = {
  '/dashboard': {
    allowedRoles: ['buyer', 'admin'],
    requiredPermission: 'view_buyer_dashboard',
    friendlyWorkspaceName: 'Buyer Dashboard'
  },
  '/connect': {
    allowedRoles: ['buyer', 'seller', 'agent', 'admin', 'guest'],
    requiredPermission: 'ai_connect_subscribe',
    friendlyWorkspaceName: 'AI Connect Plans'
  },
  '/saved': {
    allowedRoles: ['buyer'],
    requiredPermission: 'save_properties',
    friendlyWorkspaceName: 'Saved Properties'
  },
  '/seller': {
    allowedRoles: ['seller', 'agent'],
    requiredPermission: 'view_seller_dashboard',
    friendlyWorkspaceName: 'Seller Portal'
  },
  '/seller/properties': {
    allowedRoles: ['seller', 'agent'],
    requiredPermission: 'manage_own_listings',
    friendlyWorkspaceName: 'Listing Management'
  },
  '/seller/properties/new': {
    allowedRoles: ['seller', 'agent'],
    requiredPermission: 'create_listing',
    friendlyWorkspaceName: 'Create New Listing'
  },
  '/admin': {
    allowedRoles: ['admin'],
    requiredPermission: 'view_admin_console',
    friendlyWorkspaceName: 'Administration Console'
  },
  '/profile': {
    allowedRoles: ['buyer', 'seller', 'agent', 'admin'],
    friendlyWorkspaceName: 'Account Profile & Settings'
  },
  '/messages': {
    allowedRoles: ['buyer', 'seller', 'agent'],
    requiredPermission: 'send_messages',
    friendlyWorkspaceName: 'Inquiries & Direct Messages'
  }
};

/**
 * Determines whether a given user role can access the specified application route.
 */
export function canAccessRoute(role: UserRole | undefined, currentPath: string): { 
  allowed: boolean; 
  reason?: string;
  recommendedPath?: string;
  requiredRoleLabel?: string;
} {
  const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  
  // Dynamic route prefix checks
  if (cleanPath.startsWith('/seller/properties/') && cleanPath.endsWith('/edit')) {
    const auth = ROUTE_ACCESS_MAP['/seller/properties'];
    const userRole = role || 'guest';
    if (!auth.allowedRoles.includes(userRole) && userRole !== 'admin') {
      return {
        allowed: false,
        reason: 'Editing listings is restricted to authorized property owners, listing brokers, and platform administrators.',
        recommendedPath: userRole === 'buyer' ? '/dashboard' : '/login',
        requiredRoleLabel: 'Seller or Broker'
      };
    }
    return { allowed: true };
  }

  const routeAuth = ROUTE_ACCESS_MAP[cleanPath];

  // If route is not restricted, allow access (public route)
  if (!routeAuth) {
    return { allowed: true };
  }

  const userRole = role || 'guest';

  // Check role match
  if (!routeAuth.allowedRoles.includes(userRole)) {
    if (userRole === 'guest') {
      return {
        allowed: false,
        reason: `Authentication is required to access the ${routeAuth.friendlyWorkspaceName}. Please sign in to your account.`,
        recommendedPath: '/login',
        requiredRoleLabel: 'Authenticated User'
      };
    }

    let recommended = '/';
    if (userRole === 'buyer') recommended = '/dashboard';
    else if (userRole === 'seller' || userRole === 'agent') recommended = '/seller';
    else if (userRole === 'admin') recommended = '/admin';

    return {
      allowed: false,
      reason: `Access to ${routeAuth.friendlyWorkspaceName} is restricted. Your current account role (${userRole.toUpperCase()}) does not possess authorization for this workspace.`,
      recommendedPath: recommended,
      requiredRoleLabel: routeAuth.allowedRoles.map((r) => r.toUpperCase()).join(' or ')
    };
  }

  // Check specific permission if configured
  if (routeAuth.requiredPermission && !hasPermission(userRole, routeAuth.requiredPermission)) {
    return {
      allowed: false,
      reason: `Your account role does not have the '${routeAuth.requiredPermission}' privilege.`,
      recommendedPath: '/'
    };
  }

  return { allowed: true };
}
