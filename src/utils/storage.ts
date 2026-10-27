import { User, NotificationPreferences } from '../types';

const SESSION_KEY = 'pp_session_v1';
const PROFILE_PREFIX = 'pp_account_profile_';
const NOTIFY_PREFS_PREFIX = 'pp_notify_prefs_';
const DIRECTORY_KEY = 'pp_accounts';

export interface StoredSession {
  userId: string;
  startedAt: string;
}

/**
 * Salted FNV-1a digest. This is a convenience credential check for a
 * deployment with no backend: it is not a substitute for server-side password
 * hashing, and the plaintext password is never written to storage.
 */
const CREDENTIAL_SALT = 'pp.v1:';

export function hashPassword(password: string): string {
  const input = CREDENTIAL_SALT + password;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function verifyPassword(password: string, hash?: string): boolean {
  if (!hash) return false;
  return hashPassword(password) === hash;
}

/** Reads the persisted session marker. Returns null when nothing is stored. */
export function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed && typeof parsed.userId === 'string' && typeof parsed.startedAt === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/** Persists the session marker. Returns false when storage is unavailable. */
export function writeStoredSession(userId: string): boolean {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId, startedAt: new Date().toISOString() } satisfies StoredSession)
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears the session marker only. Device-scoped browsing data (bookmarks,
 * comparisons, recently viewed listings) is intentionally left untouched.
 */
export function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

/**
 * Stores the editable profile fields for an account. The authoritative role,
 * id and credential never come from this blob, so editing the stored profile
 * cannot be used to claim additional privileges.
 */
export function writeStoredProfile(user: User): boolean {
  try {
    const editable = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      agency: user.agency,
      avatar: user.avatar
    };
    localStorage.setItem(PROFILE_PREFIX + user.id, JSON.stringify(editable));
    return true;
  } catch {
    return false;
  }
}

function readStoredProfile(userId: string): Partial<User> | null {
  try {
    const raw = localStorage.getItem(PROFILE_PREFIX + userId);
    return raw ? (JSON.parse(raw) as Partial<User>) : null;
  } catch {
    return null;
  }
}

/**
 * Rewrites the trusted account directory entry. Used when a credential or a
 * role-bearing record changes; the directory is the source of truth for both.
 */
export function upsertDirectoryAccount(account: User): boolean {
  const accounts = readAccountDirectory();
  const index = accounts.findIndex((a) => a.id === account.id);
  const next = index >= 0
    ? accounts.map((a, i) => (i === index ? { ...a, ...account } : a))
    : [...accounts, account];
  return writeAccountDirectory(next);
}

/** Reads the locally registered accounts (excludes the bundled directory). */
export function readAccountDirectory(): User[] {
  try {
    const raw = localStorage.getItem(DIRECTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

function writeAccountDirectory(accounts: User[]): boolean {
  try {
    localStorage.setItem(DIRECTORY_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

/**
 * Rebuilds the signed-in account from the stored session. Returns null when no
 * session exists or when the session references an unknown account, so a stale
 * or tampered marker is never treated as authenticated.
 */
export function readStoredAccount(directory: User[]): User | null {
  const session = readStoredSession();
  if (!session) return null;

  const trusted = directory.find((u) => u.id === session.userId);
  if (!trusted) {
    clearStoredSession();
    return null;
  }

  const stored = readStoredProfile(session.userId);
  if (!stored) return trusted;

  return {
    ...trusted,
    name: typeof stored.name === 'string' ? stored.name : trusted.name,
    email: typeof stored.email === 'string' ? stored.email : trusted.email,
    phone: typeof stored.phone === 'string' ? stored.phone : trusted.phone,
    bio: typeof stored.bio === 'string' ? stored.bio : trusted.bio,
    agency: typeof stored.agency === 'string' ? stored.agency : trusted.agency,
    avatar: typeof stored.avatar === 'string' ? stored.avatar : trusted.avatar,
    // Role and id are always re-resolved from the trusted directory entry.
    id: trusted.id,
    role: trusted.role
  };
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  listingResponseAlerts: true,
  weeklyMatchRecommendations: false,
  productUpdates: false
};

/** Loads stored notification choices for an account. */
export function readNotificationPreferences(userId: string): NotificationPreferences {
  try {
    const raw = localStorage.getItem(NOTIFY_PREFS_PREFIX + userId);
    if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

/** Stores notification choices for an account. Returns false when storage is unavailable. */
export function writeNotificationPreferences(
  userId: string,
  prefs: NotificationPreferences
): boolean {
  try {
    localStorage.setItem(NOTIFY_PREFS_PREFIX + userId, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}
