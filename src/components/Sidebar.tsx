import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { hasPermission, AppPermission } from '../utils/permissions';
import {
  Building2,
  Home,
  LayoutDashboard,
  Search,
  Compass,
  Sparkles,
  Heart,
  SlidersHorizontal,
  MessageSquare,
  Mail,
  ListFilter,
  PlusCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Radio,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: AppPermission;
  count?: number;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    savedPropertyIds,
    comparePropertyIds,
    activeSubscription,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    mobileDrawerOpen,
    setMobileDrawerOpen
  } = useApp();

  // undefined role = signed-out visitor, which resolves to the guest policy.
  const role = currentUser?.role;

  // Escape key closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  };

  // Business navigation is derived from the authorized permissions of the
  // active role and matches the reference design.
  const navigationGroups: NavGroup[] = [
    {
      group: '',
      items: [
        { id: 'nav-home', label: 'Home', path: '/', icon: Home, permission: 'browse_listings' },
        { id: 'nav-dashboard', label: 'Buyer Dashboard', path: '/dashboard', icon: LayoutDashboard, permission: 'view_buyer_dashboard' },
        { id: 'nav-search', label: 'Search Properties', path: '/properties', icon: Search, permission: 'browse_listings' },
        { id: 'nav-saved', label: 'Saved Properties', path: '/saved', icon: Heart, permission: 'save_properties', count: savedPropertyIds.length },
        { id: 'nav-compare', label: 'Compare', path: '/compare', icon: SlidersHorizontal, permission: 'compare_properties', count: comparePropertyIds.length },
      ]
    },
    {
      group: 'AI TOOLS',
      items: [
        { id: 'nav-matchmaker', label: 'AI Property Matchmaker', path: '/matchmaker', icon: Sparkles, permission: 'ai_matchmaker' },
        { id: 'nav-designer', label: 'AI Property Designer', path: '/designer', icon: Compass, permission: 'ai_designer' },
        {
          id: 'nav-connect',
          label: 'AI Connect',
          path: '/connect',
          icon: Radio,
          permission: 'ai_connect_subscribe',
          badge: activeSubscription?.isActive ? 'Active' : undefined
        },
      ]
    },
    {
      group: 'COMMUNICATIONS',
      items: [
        {
          id: 'nav-messages',
          label: 'Messages',
          path: '/messages',
          icon: MessageSquare,
          permission: 'send_messages',
          count: 3
        },
        {
          id: 'nav-inquiries',
          label: 'Inquiries',
          path: '/messages',
          icon: Mail,
          permission: 'send_messages'
        },
      ]
    },
    {
      group: 'SELLER PORTAL',
      items: [
        { id: 'nav-seller-dashboard', label: 'Seller Dashboard', path: '/seller', icon: Building2, permission: 'view_seller_dashboard' },
        { id: 'nav-seller-properties', label: 'Manage Listings', path: '/seller/properties', icon: ListFilter, permission: 'manage_own_listings' },
        { id: 'nav-seller-new', label: 'Add Property', path: '/seller/properties/new', icon: PlusCircle, permission: 'create_listing' },
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'nav-admin', label: 'Admin Console', path: '/admin', icon: ShieldAlert, permission: 'view_admin_console' },
      ]
    }
  ];

  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(role, item.permission))
    }))
    .filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0b1522] border-r border-slate-200 dark:border-[#152336] text-slate-600 dark:text-slate-300 select-none">
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#152336] ${sidebarCollapsed ? 'px-3 justify-center' : ''}`}>
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-3 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          title="Property Partner - Return to Home"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="block font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                Property Partner
              </span>
              <span className="block text-[10px] font-semibold text-teal-600 dark:text-teal-400 mt-1 tracking-wide">
                Your Real Estate, Simplified
              </span>
            </div>
          )}
        </button>

        {/* Mobile close button */}
        {mobileDrawerOpen && (
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="sm:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation Links Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main navigation">
        {visibleGroups.map((group, groupIdx) => (
          <div key={group.group || `group-${groupIdx}`} className="space-y-1">
            {!sidebarCollapsed && group.group && (
              <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {group.group}
              </div>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-label={sidebarCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        active
                          ? 'bg-teal-50 dark:bg-[#134e4a]/70 text-teal-800 dark:text-teal-300 font-bold border-l-4 border-teal-600 dark:border-teal-400 pl-2 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#131f30] hover:text-slate-900 dark:hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} aria-hidden="true" />

                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}

                      {/* Badge / Count */}
                      {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          active
                            ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950'
                            : 'bg-teal-50 dark:bg-teal-900/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {!sidebarCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Area: Collapse Sidebar */}
      <div className="p-3 border-t border-slate-200 dark:border-[#152336] bg-slate-50/80 dark:bg-[#09111c]/60">
        <button
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden sm:flex w-full items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131f30] hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Left Sidebar */}
      <aside
        className={`hidden sm:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        }`}
        aria-label="Business navigation sidebar"
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

