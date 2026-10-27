import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  User, 
  ActiveSubscription, 
  Conversation, 
  DesignConcept, 
  UserRole,
  ListingStatus,
  NotificationPreferences
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_USERS, 
  CONNECTION_PLANS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_DESIGN_CONCEPTS 
} from '../data/mockData';
import {
  readStoredAccount,
  readStoredSession,
  readNotificationPreferences,
  writeNotificationPreferences,
  writeStoredProfile,
  writeStoredSession,
  clearStoredSession,
  readAccountDirectory,
  upsertDirectoryAccount,
  hashPassword,
  verifyPassword,
  DEFAULT_NOTIFICATION_PREFERENCES
} from '../utils/storage';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type CurrencyType = 'USD' | 'PKR';
export type AreaUnitType = 'sqft' | 'marla';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: UserRole) => void;
  users: User[];

  // Credentials. There is no identity provider in this deployment, so accounts
  // live in this browser and only a password digest is ever persisted.
  authResult: { success: boolean; message: string } | null;
  signIn: (email: string, password: string) => { success: boolean; message: string };
  registerAccount: (input: {
    name: string;
    email: string;
    password: string;
    role: Exclude<UserRole, 'guest'>;
  }) => { success: boolean; message: string };
  findAccountByEmail: (email: string) => User | undefined;
  setAccountPassword: (userId: string, password: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
  accountHasCredential: boolean;

  // Account session management (client-side session, see utils/storage.ts)
  sessionStartedAt: string | null;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => boolean;
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: (updates: Partial<NotificationPreferences>) => boolean;

  // Theme Management (Light, Dark, System)
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDarkMode: boolean;

  // Responsive Navigation Sidebar & Drawer
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  
  // Properties
  properties: Property[];
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => string;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  updatePropertyStatus: (id: string, status: ListingStatus) => void;
  
  // Favorites / Saved Properties (with genuine Undo action - Shneiderman's Rule 6)
  savedPropertyIds: string[];
  toggleFavorite: (propertyId: string) => void;
  restoreFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  
  // Recently Viewed Properties
  recentlyViewedIds: string[];
  addRecentlyViewed: (propertyId: string) => void;

  // Comparison
  comparePropertyIds: string[];
  toggleCompare: (propertyId: string) => void;
  isInCompare: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  
  // Currency & Area Unit preferences (persisted per browser)
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  areaUnit: AreaUnitType;
  setAreaUnit: (u: AreaUnitType) => void;
  formatPrice: (usdAmount: number, listingType?: 'sale' | 'rent') => string;
  formatArea: (sqft: number) => string;

  // AI Connect Subscription
  activeSubscription: ActiveSubscription | null;
  purchaseSubscription: (planId: string) => { success: boolean; message: string };
  cancelSubscription: () => void;
  toggleSubscriptionExpirySimulation: () => void;
  
  // Messaging
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => void;
  createOrOpenConversation: (propertyId: string, initialMessage?: string) => string;
  
  // Design Concepts
  designConcepts: DesignConcept[];
  saveDesignConcept: (concept: DesignConcept) => void;
  
  // Routing
  currentPath: string;
  navigate: (path: string) => void;
  
  // Feedback
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// USD to PKR conversion rate used for display (1 USD ≈ 278 PKR)
const USD_TO_PKR = 278;
// 1 Marla ≈ 225 sq ft
const SQFT_PER_MARLA = 225;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Trusted account directory: bundled sample accounts plus any registered in
  // this browser. It is the source of truth for identity, role and credential.
  const [directory, setDirectory] = useState<User[]>(() => {
    const local = readAccountDirectory();
    if (local.length === 0) return INITIAL_USERS;
    const merged = [...INITIAL_USERS];
    local.forEach((entry) => {
      const i = merged.findIndex((u) => u.id === entry.id);
      if (i >= 0) merged[i] = { ...merged[i], ...entry };
      else merged.push(entry);
    });
    return merged;
  });
  const users = directory;

  const [authResult, setAuthResult] = useState<{ success: boolean; message: string } | null>(null);

  // Restored account session (null = signed out). The role is always re-read
  // from the account directory, so a tampered local marker cannot escalate it.
  const [currentUser, setCurrentUserState] = useState<User | null>(() => readStoredAccount(INITIAL_USERS) || INITIAL_USERS[2]);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(
    () => readStoredSession()?.startedAt ?? null
  );
  const [notificationPreferences, setNotificationPreferencesState] = useState<NotificationPreferences>(
    () => (currentUser ? readNotificationPreferences(currentUser.id) : DEFAULT_NOTIFICATION_PREFERENCES)
  );

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      writeStoredProfile(user);
      const marker = writeStoredSession(user.id);
      setSessionStartedAt(marker ? readStoredSession()?.startedAt ?? null : null);
      setNotificationPreferencesState(readNotificationPreferences(user.id));
    } else {
      clearStoredSession();
      setSessionStartedAt(null);
      setNotificationPreferencesState(DEFAULT_NOTIFICATION_PREFERENCES);
    }
  };

  /** Persisted profile update. Returns false when the write did not succeed. */
  const updateProfile = (updates: Partial<User>): boolean => {
    if (!currentUser) return false;

    // Protected fields are never taken from the incoming patch.
    const safeUpdates: Partial<User> = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.role;
    delete safeUpdates.createdAt;

    const next: User = { ...currentUser, ...safeUpdates };
    const stored = writeStoredProfile(next);
    if (!stored) return false;

    setCurrentUserState(next);
    return true;
  };

  const setNotificationPreferences = (updates: Partial<NotificationPreferences>): boolean => {
    if (!currentUser) return false;
    const next = { ...notificationPreferences, ...updates };
    const stored = writeNotificationPreferences(currentUser.id, next);
    if (!stored) return false;
    setNotificationPreferencesState(next);
    return true;
  };

  
  // Localization: Currency & Area Units
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    try {
      return (localStorage.getItem('pp_currency') as CurrencyType) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [areaUnit, setAreaUnitState] = useState<AreaUnitType>(() => {
    try {
      return (localStorage.getItem('pp_area_unit') as AreaUnitType) || 'sqft';
    } catch {
      return 'sqft';
    }
  });

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    localStorage.setItem('pp_currency', c);
  };

  const setAreaUnit = (u: AreaUnitType) => {
    setAreaUnitState(u);
    localStorage.setItem('pp_area_unit', u);
  };

  // Theme Management (Light, Dark, System) - Default to dark theme
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('pp_theme') as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pp_theme') as ThemeMode;
      if (saved === 'light') return false;
      return true; // Default to dark theme
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      let darkActive = false;
      if (theme === 'dark') {
        darkActive = true;
      } else if (theme === 'light') {
        darkActive = false;
      } else {
        darkActive = mediaQuery.matches;
      }
      setIsDarkMode(darkActive);
      if (darkActive) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem('pp_theme', t);
    } catch {}
    const themeLabel = t === 'system' ? 'System Default' : t === 'dark' ? 'Dark Theme' : 'Light Theme';
    addToast(`Theme set to ${themeLabel}.`, 'info');
  };

  // Responsive Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('pp_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Load saved properties from localStorage
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_favorites');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  // Recently Viewed Properties
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_recently_viewed');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2', 'prop-5'];
    } catch {
      return ['prop-1', 'prop-2', 'prop-5'];
    }
  });

  // Load comparison IDs
  const [comparePropertyIds, setComparePropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_compare');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  // Properties state
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem('pp_properties_v2');
      return stored ? JSON.parse(stored) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  // Subscription record. No pass is granted automatically: an entitlement only
  // exists after the signed-in account activates one on this device.
  const [subscriptionRecord, setSubscriptionRecord] = useState<ActiveSubscription | null>(() => {
    try {
      const stored = localStorage.getItem('pp_subscription');
      return stored ? (JSON.parse(stored) as ActiveSubscription) : null;
    } catch {
      return null;
    }
  });

  // Derived entitlement: scoped to the signed-in account and re-checked against
  // the stored expiry date, so the UI never reports an expired pass as active.
  const activeSubscription: ActiveSubscription | null = (() => {
    if (!subscriptionRecord || !currentUser) return null;
    if (subscriptionRecord.userId !== currentUser.id) return null;
    const expiredByDate = new Date(`${subscriptionRecord.expiryDate}T23:59:59`).getTime() < Date.now();
    return { ...subscriptionRecord, isActive: subscriptionRecord.isActive && !expiredByDate };
  })();

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem('pp_conversations');
      return stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Design concepts
  const [designConcepts, setDesignConcepts] = useState<DesignConcept[]>(() => {
    try {
      const stored = localStorage.getItem('pp_design_concepts');
      return stored ? JSON.parse(stored) : INITIAL_DESIGN_CONCEPTS;
    } catch {
      return INITIAL_DESIGN_CONCEPTS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simple SPA routing with browser history and hash support
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signOut = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pp_favorites', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('pp_recently_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem('pp_compare', JSON.stringify(comparePropertyIds));
  }, [comparePropertyIds]);

  useEffect(() => {
    localStorage.setItem('pp_properties_v2', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    if (subscriptionRecord) {
      localStorage.setItem('pp_subscription', JSON.stringify(subscriptionRecord));
    } else {
      localStorage.removeItem('pp_subscription');
    }
  }, [subscriptionRecord]);

  useEffect(() => {
    localStorage.setItem('pp_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('pp_design_concepts', JSON.stringify(designConcepts));
  }, [designConcepts]);

  const addToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'info',
    action?: { label: string; onClick: () => void }
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      removeToast(id);
    }, action ? 6500 : 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      addToast('You are browsing as a guest.', 'info');
      return;
    }
    const matched = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matched);
    addToast(`Signed in as ${matched.name} (${role.toUpperCase()}).`, 'success');
  };

  // ---------------------------------------------------------------------------
  // Credentials. Sign-in checks the supplied password against the digest held
  // for that account; nothing is trusted from the caller beyond the two fields.
  // ---------------------------------------------------------------------------
  const findAccountByEmail = (email: string) => {
    const needle = email.trim().toLowerCase();
    return directory.find((u) => u.email.toLowerCase() === needle);
  };

  const workspaceFor = (role: UserRole) =>
    role === 'seller' || role === 'agent' ? '/seller' : role === 'admin' ? '/admin' : '/dashboard';

  const signIn = (email: string, password: string) => {
    const account = findAccountByEmail(email);
    if (!account || !account.passwordHash) {
      const result = { success: false, message: 'We could not match that email and password. Check the address and try again.' };
      setAuthResult(result);
      return result;
    }
    if (!verifyPassword(password, account.passwordHash)) {
      const result = { success: false, message: 'We could not match that email and password.' };
      setAuthResult(result);
      return result;
    }
    setCurrentUser(account);
    setAuthResult(null);
    addToast(`Welcome back, ${account.name}.`, 'success');
    navigate(workspaceFor(account.role));
    return { success: true, message: 'Signed in.' };
  };

  const registerAccount = (input: {
    name: string;
    email: string;
    password: string;
    role: Exclude<UserRole, 'guest'>;
  }) => {
    if (findAccountByEmail(input.email)) {
      const result = { success: false, message: 'An account with this email already exists. Sign in instead.' };
      setAuthResult(result);
      return result;
    }

    const account: User = {
      id: `user-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      role: input.role,
      passwordHash: hashPassword(input.password),
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!upsertDirectoryAccount(account)) {
      const result = { success: false, message: 'Account could not be created on this device. Storage may be full or blocked.' };
      setAuthResult(result);
      return result;
    }

    setDirectory((prev) => {
      const i = prev.findIndex((u) => u.id === account.id);
      return i >= 0 ? prev.map((u, idx) => (idx === i ? account : u)) : [...prev, account];
    });
    setCurrentUser(account);
    setAuthResult(null);
    addToast(`Account created for ${account.name}. You are signed in.`, 'success');
    navigate(workspaceFor(account.role));
    return { success: true, message: 'Account created.' };
  };

  /**
   * Sets a new password for a known account without the previous one. Only
   * reachable from the recovery flow on this device, which is the equivalent of
   * clicking a reset link on the account owner's own browser.
   */
  const setAccountPassword = (userId: string, password: string): boolean => {
    const account = directory.find((u) => u.id === userId);
    if (!account) return false;
    const next: User = { ...account, passwordHash: hashPassword(password) };
    if (!upsertDirectoryAccount(next)) return false;
    setDirectory((prev) => prev.map((u) => (u.id === next.id ? next : u)));
    if (currentUser?.id === next.id) setCurrentUserState(next);
    return true;
  };

  /** Verified password change for the signed-in account. */
  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!currentUser) {
      return { success: false, message: 'Sign in to change your password.' };
    }
    const trusted = directory.find((u) => u.id === currentUser.id);
    if (!trusted?.passwordHash) {
      return { success: false, message: 'This account has no password on record, so there is nothing to verify.' };
    }
    if (!verifyPassword(currentPassword, trusted.passwordHash)) {
      return { success: false, message: 'Your current password is not correct.' };
    }
    const next: User = { ...trusted, passwordHash: hashPassword(newPassword) };
    if (!upsertDirectoryAccount(next)) {
      return { success: false, message: 'The password could not be written to storage. No change was made.' };
    }
    setDirectory((prev) => prev.map((u) => (u.id === next.id ? next : u)));
    setCurrentUserState(next);
    return { success: true, message: 'Password updated. Use it the next time you sign in.' };
  };

  const accountHasCredential = Boolean(
    currentUser && directory.find((u) => u.id === currentUser.id)?.passwordHash
  );

  // Genuine Undo for Saved Properties (Shneiderman's Rule 6)
  const toggleFavorite = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    const title = prop ? `"${prop.title}"` : 'Property';

    setSavedPropertyIds((prev) => {
      const exists = prev.includes(propertyId);
      if (exists) {
        addToast(
          `Removed ${title} from Saved Properties.`, 
          'info',
          {
            label: 'Undo',
            onClick: () => restoreFavorite(propertyId)
          }
        );
        return prev.filter((id) => id !== propertyId);
      } else {
        addToast(`Saved ${title} to your Saved Properties.`, 'success');
        return [...prev, propertyId];
      }
    });
  };

  const restoreFavorite = (propertyId: string) => {
    setSavedPropertyIds((prev) => {
      if (prev.includes(propertyId)) return prev;
      return [...prev, propertyId];
    });
    addToast('Restored property to Saved Properties.', 'success');
  };

  const isFavorite = (propertyId: string) => savedPropertyIds.includes(propertyId);

  // Recently Viewed tracking
  const addRecentlyViewed = (propertyId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== propertyId);
      return [propertyId, ...filtered].slice(0, 8);
    });
  };

  const toggleCompare = (propertyId: string) => {
    setComparePropertyIds((prev) => {
      if (prev.includes(propertyId)) {
        addToast('Removed from comparison matrix.', 'info');
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 4) {
        addToast('You can compare a maximum of 4 properties at once.', 'error');
        return prev;
      }
      addToast('Added to comparison matrix.', 'success');
      return [...prev, propertyId];
    });
  };

  const isInCompare = (propertyId: string) => comparePropertyIds.includes(propertyId);

  const removeFromCompare = (propertyId: string) => {
    setComparePropertyIds((prev) => prev.filter((id) => id !== propertyId));
    addToast('Removed from comparison matrix.', 'info');
  };

  const clearCompare = () => {
    setComparePropertyIds([]);
    addToast('Cleared all compared properties.', 'info');
  };

  // Currency & Unit Formatters
  const formatPrice = (usdAmount: number, listingType: 'sale' | 'rent' = 'sale'): string => {
    const isPkr = currency === 'PKR';
    const amount = isPkr ? usdAmount * USD_TO_PKR : usdAmount;

    let formatted = '';
    if (isPkr) {
      if (amount >= 10000000) {
        // Crores
        const crores = (amount / 10000000).toFixed(2);
        formatted = `PKR ${crores} Crore`;
      } else if (amount >= 100000) {
        // Lacs
        const lacs = (amount / 100000).toFixed(2);
        formatted = `PKR ${lacs} Lac`;
      } else {
        formatted = `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
      }
    } else {
      formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(amount);
    }

    if (listingType === 'rent') {
      formatted += ' / mo';
    }
    return formatted;
  };

  const formatArea = (sqft: number): string => {
    if (areaUnit === 'marla') {
      const marlas = (sqft / SQFT_PER_MARLA).toFixed(1);
      return `${marlas} Marla (${sqft.toLocaleString()} sq ft)`;
    }
    return `${sqft.toLocaleString()} sq ft`;
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => {
    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...propertyData,
      id: newId,
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProperties((prev) => [newProperty, ...prev]);
    addToast(`Listing "${newProperty.title}" created successfully!`, 'success');
    return newId;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast('Property listing updated successfully.', 'success');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSavedPropertyIds((prev) => prev.filter((favId) => favId !== id));
    setComparePropertyIds((prev) => prev.filter((comp) => comp !== id));
    addToast('Property listing permanently removed.', 'info');
  };

  const updatePropertyStatus = (id: string, status: ListingStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast(`Listing status updated to ${status}.`, 'success');
  };

  // Connection entitlement. No payment provider is integrated in this build: a
  // plan activation is recorded locally for the signed-in account only.
  const purchaseSubscription = (planId: string) => {
    if (!currentUser) {
      return { success: false, message: 'Sign in to activate a connection pass.' };
    }
    const plan = CONNECTION_PLANS.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid plan selected' };

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + plan.durationDays);

    const newSub: ActiveSubscription = {
      id: `sub-${Date.now()}`,
      userId: currentUser.id,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      startDate: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      durationDays: plan.durationDays,
      isActive: true,
      inquiriesRemaining: plan.maxChats
    };

    try {
      localStorage.setItem('pp_subscription', JSON.stringify(newSub));
    } catch {
      return { success: false, message: 'Entitlement could not be saved on this device.' };
    }

    setSubscriptionRecord(newSub);
    return { success: true, message: 'Pass activated for this account.' };
  };

  const cancelSubscription = () => {
    setSubscriptionRecord((prev) => (prev ? { ...prev, isActive: false } : null));
    addToast('Connection pass cancelled.', 'info');
  };

  /** Developer-only helper used to preview active vs expired messaging states. */
  const toggleSubscriptionExpirySimulation = () => {
    if (!import.meta.env.DEV) return;
    setSubscriptionRecord((prev) => {
      if (!prev || !currentUser) {
        const past = new Date();
        past.setDate(past.getDate() - 3);
        const start = new Date();
        start.setDate(start.getDate() - 33);
        addToast('Developer test state: expired pass created.', 'info');
        return {
          id: 'sub-expired-test',
          userId: currentUser?.id || 'user-buyer-1',
          planId: 'plan-basic',
          planName: 'Basic Explorer',
          price: 19,
          startDate: start.toISOString().split('T')[0],
          expiryDate: past.toISOString().split('T')[0],
          durationDays: 7,
          isActive: false,
          inquiriesRemaining: 0
        };
      }
      const toggled = !prev.isActive;
      addToast(
        toggled ? 'Developer test state: pass marked active.' : 'Developer test state: pass marked expired.',
        toggled ? 'success' : 'info'
      );
      // Re-activating also refreshes the expiry date so the derived status stays consistent.
      if (toggled) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + prev.durationDays);
        return { ...prev, isActive: true, startDate: new Date().toISOString().split('T')[0], expiryDate: expiry.toISOString().split('T')[0] };
      }
      return { ...prev, isActive: false };
    });
  };

  // Messaging operations
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId: currentUser?.id || 'user-buyer-1',
      senderName: currentUser?.name || 'You',
      senderRole: currentUser?.role || 'buyer',
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // No messaging service is connected to this deployment. Instead of inventing
    // a seller reply, the thread records an explicit delivery notice.
    setTimeout(() => {
      const alreadyNotified = conversations
        .find((c) => c.id === conversationId)
        ?.messages.some((m) => m.senderId === 'system-delivery');
      if (alreadyNotified) return;

      const notice = {
        id: `msg-notice-${Date.now()}`,
        conversationId,
        senderId: 'system-delivery',
        senderName: 'Property Partner',
        senderRole: 'system',
        text: 'Delivered to this device only. Direct seller delivery is not configured for this deployment.',
        timestamp: 'Just now',
        isRead: true
      };

      setConversations((current) =>
        current.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, notice] } : c
        )
      );
    }, 400);
  };

  const createOrOpenConversation = (propertyId: string, initialMessage?: string): string => {
    const existing = conversations.find((c) => c.propertyId === propertyId);
    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      return existing.id;
    }

    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return '';

    const newConvId = `conv-${Date.now()}`;
    const firstMsg = initialMessage || `Hi ${prop.sellerName}, I am interested in ${prop.title} and would like to request more details.`;

    const newConv: Conversation = {
      id: newConvId,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyPrice: prop.price,
      propertyLocation: `${prop.location.city}, ${prop.location.state}`,
      propertyImage: prop.images[0] || '',
      otherPartyId: prop.sellerId,
      otherPartyName: prop.sellerName,
      otherPartyRole: `${prop.sellerRole === 'agent' ? 'Listing Agent' : 'Direct Owner'}`,
      otherPartyAvatar: prop.sellerAvatar,
      lastMessage: firstMsg,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderId: currentUser?.id || 'user-buyer-1',
          senderName: currentUser?.name || 'You',
          senderRole: currentUser?.role || 'buyer',
          text: firstMsg,
          timestamp: 'Just now',
          isRead: true
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    addToast('Conversation opened on this device.', 'success');
    return newConvId;
  };

  const saveDesignConcept = (concept: DesignConcept) => {
    setDesignConcepts((prev) => [concept, ...prev]);
    addToast('Design concept saved to your portfolio on this device.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        authResult,
        signIn,
        registerAccount,
        findAccountByEmail,
        setAccountPassword,
        changePassword,
        accountHasCredential,
        sessionStartedAt,
        signOut,
        updateProfile,
        notificationPreferences,
        setNotificationPreferences,
        theme,
        setTheme,
        isDarkMode,
        sidebarCollapsed,
        toggleSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        updatePropertyStatus,
        savedPropertyIds,
        toggleFavorite,
        restoreFavorite,
        isFavorite,
        recentlyViewedIds,
        addRecentlyViewed,
        comparePropertyIds,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        currency,
        setCurrency,
        areaUnit,
        setAreaUnit,
        formatPrice,
        formatArea,
        activeSubscription,
        purchaseSubscription,
        cancelSubscription,
        toggleSubscriptionExpirySimulation,
        conversations,
        sendMessage,
        createOrOpenConversation,
        designConcepts,
        saveDesignConcept,
        currentPath,
        navigate,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
