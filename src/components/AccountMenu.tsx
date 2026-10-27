import React, { useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  Settings,
  Palette,
  ShieldCheck,
  Bell,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
  Shield,
  Code2
} from 'lucide-react';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

type ProfileTab = 'profile' | 'settings' | 'appearance' | 'security' | 'notifications';

const IS_DEV = import.meta.env.DEV;

export const AccountMenu: React.FC<AccountMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const {
    currentUser,
    users,
    theme,
    switchUserRole,
    navigate,
    signOut,
    addToast
  } = useApp();

  const menuRef = useRef<HTMLDivElement>(null);

  const getItems = useCallback(() => {
    return menuRef.current
      ? Array.from(menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'))
      : [];
  }, []);

  // Open/close behaviour: outside click, Escape and roving keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;

    // Predictable focus: move into the first available action when opened.
    const items = getItems();
    if (items.length > 0) {
      items[0].focus();
    } else {
      menuRef.current?.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        anchorRef.current?.focus();
        return;
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
        return;
      }

      const list = getItems();
      if (list.length === 0) return;
      event.preventDefault();

      const currentIndex = list.indexOf(document.activeElement as HTMLButtonElement);
      let nextIndex = currentIndex;
      if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % list.length;
      if (event.key === 'ArrowUp') nextIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = list.length - 1;
      list[nextIndex]?.focus();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef, getItems]);

  if (!isOpen) return null;

  const goToTab = (tab: ProfileTab) => {
    navigate(`/profile?tab=${tab}`);
    onClose();
  };

  const handleSignOut = () => {
    const name = currentUser?.name;
    signOut();
    addToast(name ? `You are signed out, ${name}.` : 'You are signed out.', 'info');
    navigate('/login');
    onClose();
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'seller':
      case 'agent':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    }
  };

  const menuItem =
    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#15253d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors cursor-pointer group text-left';

  return (
    <div
      ref={menuRef}
      id="pp-account-menu"
      role="menu"
      tabIndex={-1}
      aria-orientation="vertical"
      aria-label="Account and settings"
      className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-[#0e1b2e] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1c2e47] p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
    >
      {/* 1. Signed-in identity */}
      {currentUser ? (
        <div className="p-3 bg-slate-50 dark:bg-[#132238] rounded-xl border border-slate-200 dark:border-[#1d3250] mb-2">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-11 h-11 rounded-full object-cover border-2 border-teal-500 shadow-xs shrink-0"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-11 h-11 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0"
              >
                {getInitials(currentUser.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                {currentUser.email}
              </div>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeColor(
                    currentUser.role
                  )}`}
                >
                  <Shield className="w-2.5 h-2.5" aria-hidden="true" />
                  <span>{currentUser.role}</span>
                </span>
                {currentUser.agency && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">· {currentUser.agency}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 mb-2 text-center">
          <div className="font-bold text-sm text-slate-900 dark:text-white">You are browsing as a guest</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Sign in to use saved properties, inquiries and personal dashboards.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate('/login');
                onClose();
              }}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate('/register');
                onClose();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Register</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Account management destinations */}
      {currentUser && (
        <div className="space-y-0.5">
          <button type="button" role="menuitem" className={menuItem} onClick={() => goToTab('profile')}>
            <span className="flex items-center gap-2.5">
              <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" aria-hidden="true" />
              <span className="font-medium">My Profile</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </button>

          <button type="button" role="menuitem" className={menuItem} onClick={() => goToTab('settings')}>
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" aria-hidden="true" />
              <span className="font-medium">Account Settings</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </button>

          <button type="button" role="menuitem" className={menuItem} onClick={() => goToTab('appearance')}>
            <span className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" aria-hidden="true" />
              <span className="font-medium">Appearance</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <span>{theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </span>
          </button>

          <button type="button" role="menuitem" className={menuItem} onClick={() => goToTab('security')}>
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" aria-hidden="true" />
              <span className="font-medium">Security &amp; Privacy</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </button>

          <button type="button" role="menuitem" className={menuItem} onClick={() => goToTab('notifications')}>
            <span className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" aria-hidden="true" />
              <span className="font-medium">Notification Preferences</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 3. Developer-only account preview (excluded from production builds) */}
      {IS_DEV && (
        <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Code2 className="w-3 h-3" aria-hidden="true" />
            <span>Developer account preview</span>
          </div>
          <div className="grid grid-cols-2 gap-1 px-1 pb-1">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  switchUserRole(u.role);
                  onClose();
                }}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-left truncate transition-colors cursor-pointer ${
                  currentUser?.id === u.id
                    ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="block truncate">{u.name}</span>
                <span className="block text-[10px] font-normal capitalize text-slate-400 dark:text-slate-500">
                  {u.role}
                </span>
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                switchUserRole('guest');
                onClose();
              }}
              className="col-span-2 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              Browse as guest
            </button>
          </div>
        </div>
      )}

      {/* 4. Sign out */}
      {currentUser && (
        <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 font-semibold transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
