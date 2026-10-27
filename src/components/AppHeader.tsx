import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AccountMenu } from './AccountMenu';
import {
  Menu,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  User as UserIcon,
  Search,
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    properties,
    currency,
    setCurrency,
    setMobileDrawerOpen
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when route changes
  useEffect(() => {
    setAccountMenuOpen(false);
    setNotificationsOpen(false);
  }, [currentPath]);

  // Click outside listener for notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) {
      navigate('/properties');
      return;
    }
    navigate(`/properties?location=${encodeURIComponent(headerSearchQuery.trim())}`);
  };

  // Compute Breadcrumb Trail
  const getBreadcrumbs = () => {
    const clean = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
    if (clean === '/') return [];

    const crumbs = [{ label: 'Home', path: '/' }];

    if (clean === '/properties') {
      crumbs.push({ label: 'Properties', path: '/properties' });
    } else if (clean.startsWith('/properties/')) {
      crumbs.push({ label: 'Properties', path: '/properties' });
      const propId = clean.replace('/properties/', '');
      const prop = properties.find((p) => p.id === propId);
      crumbs.push({ label: prop ? prop.title : 'Property Details', path: clean });
    } else if (clean === '/matchmaker') {
      crumbs.push({ label: 'AI Property Matchmaker', path: '/matchmaker' });
    } else if (clean === '/designer') {
      crumbs.push({ label: 'AI Property Designer', path: '/designer' });
    } else if (clean === '/connect') {
      crumbs.push({ label: 'AI Connect Plans', path: '/connect' });
    } else if (clean === '/dashboard') {
      crumbs.push({ label: 'Buyer Dashboard', path: '/dashboard' });
    } else if (clean === '/saved') {
      crumbs.push({ label: 'Saved Properties', path: '/saved' });
    } else if (clean === '/compare') {
      crumbs.push({ label: 'Property Matrix', path: '/compare' });
    } else if (clean === '/messages') {
      crumbs.push({ label: 'Messages', path: '/messages' });
    } else if (clean === '/seller') {
      crumbs.push({ label: 'Seller Portal', path: '/seller' });
    } else if (clean === '/seller/properties') {
      crumbs.push({ label: 'My Listings', path: '/seller/properties' });
    } else if (clean === '/seller/properties/new') {
      crumbs.push({ label: 'Add Property', path: '/seller/properties/new' });
    } else if (clean.startsWith('/seller/properties/') && clean.endsWith('/edit')) {
      crumbs.push({ label: 'Edit Property', path: clean });
    } else if (clean === '/profile') {
      crumbs.push({ label: 'Profile & Settings', path: '/profile' });
    } else if (clean === '/admin') {
      crumbs.push({ label: 'Administration', path: '/admin' });
    } else if (clean === '/login') {
      crumbs.push({ label: 'Sign In', path: '/login' });
    } else if (clean === '/register') {
      crumbs.push({ label: 'Create Account', path: '/register' });
    } else {
      crumbs.push({ label: 'Page', path: clean });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const canGoBack = currentPath !== '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#0b1522] border-b border-slate-200 dark:border-[#152336] transition-colors">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile drawer trigger, Back button, and Global Header Search bar */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-2xl">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Predictable Back Button (shown on interior routes) */}
          {canGoBack && (
            <button
              onClick={handleBack}
              title="Go back to the previous screen"
              aria-label="Go back"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#131f30] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Breadcrumbs on interior pages */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden md:block min-w-0 overflow-hidden shrink-0">
              <ol className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap gap-1.5 py-0.5">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <li key={crumb.path + idx} className="flex items-center gap-1.5">
                      {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />}
                      {isLast ? (
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] lg:max-w-[200px]" aria-current="page">
                          {crumb.label}
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(crumb.path)}
                          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer hover:underline text-slate-500 dark:text-slate-400"
                        >
                          {crumb.label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {/* Global Header Search Bar (Matches Reference Image) */}
          <form onSubmit={handleHeaderSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Search properties, locations, or keywords..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-[#131f30] border border-slate-200 dark:border-[#1b2b42] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium transition-all"
              />
            </div>
          </form>
        </div>

        {/* Right: Currency Toggle, Notification Bell, User Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#131f30] rounded-xl p-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1b2b42]">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="United States Dollar ($)"
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('PKR')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                currency === 'PKR'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Pakistani Rupee (₨)"
            >
              ₨ PKR
            </button>
          </div>

          {/* Notification Bell with Red Badge "3" (Matches Reference Image) */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#131f30] transition-colors cursor-pointer"
              aria-label="Notifications (3 unread)"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0b1522]">
                3
              </span>
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0e1b2e] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1c2e47] p-4 z-50 text-slate-900 dark:text-white animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1c2e47] mb-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Inquiry on 123 Maple Street</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 mt-1">
                      Alex Rivera sent a direct inquiry for your luxury villa listing.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>10 minutes ago</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Price update: 789 Oak Drive
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-1">
                      Listing price adjusted to $620,000 for your saved residence.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">1 hour ago</div>
                  </div>

                  <div className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      AI Matchmaker Report Ready
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-1">
                      3 new properties match your custom preferences in Austin and Miami.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Yesterday</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account / Profile Menu (Matches Reference Image: Elena Rostova, Seller) */}
          <div className="relative">
            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => setAccountMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              aria-label={
                currentUser
                  ? `Account menu for ${currentUser.name}, role ${currentUser.role}`
                  : 'Account menu, signed out'
              }
              className={`flex items-center gap-2.5 p-1 sm:pr-3 sm:pl-1.5 sm:py-1 rounded-xl transition-colors cursor-pointer border ${
                accountMenuOpen
                  ? 'bg-slate-100 dark:bg-[#182942] border-teal-500/50'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#131f30] dark:hover:bg-[#1b2b42] border-slate-200 dark:border-[#1b2b42]'
              }`}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/50 shrink-0"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
                >
                  {currentUser ? getInitials(currentUser.name) : <UserIcon className="w-3.5 h-3.5" />}
                </span>
              )}

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser ? currentUser.name : 'Sign in'}
                </span>
                {currentUser && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize leading-tight">
                    {currentUser.role}
                  </span>
                )}
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            <AccountMenu
              isOpen={accountMenuOpen}
              onClose={() => setAccountMenuOpen(false)}
              anchorRef={accountButtonRef}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

