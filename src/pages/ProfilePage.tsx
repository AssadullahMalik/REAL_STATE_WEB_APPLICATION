import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Globe,
  Bell,
  Palette,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Info,
  LogOut,
  Lock
} from 'lucide-react';
import {
  validateEmailField,
  validateRequiredField,
  validatePasswordField,
  validateConfirmPasswordField
} from '../utils/validation';

type ProfileTab = 'profile' | 'settings' | 'appearance' | 'security' | 'notifications';

const TABS: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'My Profile', icon: UserIcon },
  { id: 'settings', label: 'Account Settings', icon: Sliders },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell }
];

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    signOut,
    addToast,
    navigate,
    theme,
    setTheme,
    currency,
    setCurrency,
    areaUnit,
    setAreaUnit,
    notificationPreferences,
    setNotificationPreferences,
    sessionStartedAt,
    currentPath,
    changePassword,
    accountHasCredential
  } = useApp();

  const activeTab: ProfileTab = useMemo(() => {
    const query = currentPath.split('?')[1] || '';
    const requested = new URLSearchParams(query).get('tab') as ProfileTab | null;
    return requested && TABS.some((t) => t.id === requested) ? requested : 'profile';
  }, [currentPath]);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [agency, setAgency] = useState(currentUser?.agency || '');

  // Password change state (Security & Privacy section)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Real-time validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false });
  const [isSaving, setIsSaving] = useState(false);

  const profileDirty =
    name !== (currentUser?.name ?? '') ||
    email !== (currentUser?.email ?? '') ||
    phone !== (currentUser?.phone ?? '') ||
    bio !== (currentUser?.bio ?? '') ||
    agency !== (currentUser?.agency ?? '');

  const dirtyRef = useRef(profileDirty);
  dirtyRef.current = profileDirty;

  // Warn before the browser unloads the page with unsaved profile edits.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const goToTab = (tab: ProfileTab) => {
    if (tab === activeTab) return;
    if (profileDirty) {
      const discard = window.confirm(
        'You have unsaved profile changes. Leave this section without saving them?'
      );
      if (!discard) return;
    }
    navigate(`/profile?tab=${tab}`);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (touched.name) setNameError(validateRequiredField(val, 'Full Name'));
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) setEmailError(validateEmailField(val));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true });

    const nErr = validateRequiredField(name, 'Full Name');
    const eErr = validateEmailField(email);
    setNameError(nErr);
    setEmailError(eErr);

    if (nErr || eErr) {
      addToast('Please correct the highlighted fields before saving.', 'error');
      return;
    }

    setIsSaving(true);
    const saved = updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      agency: agency.trim()
    });
    setIsSaving(false);

    if (saved) {
      addToast('Profile details saved.', 'success');
    } else {
      addToast('Your profile could not be saved. Please try again.', 'error');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);

    const newErr = validatePasswordField(newPassword, 8);
    const confirmErr = validateConfirmPasswordField(confirmNewPassword, newPassword);
    setPasswordError(newErr || confirmErr);
    if (newErr || confirmErr) return;

    setIsChangingPassword(true);
    const result = changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordTouched(false);
      setPasswordError(null);
      addToast(result.message, 'success');
    } else {
      setPasswordError(result.message);
      addToast(result.message, 'error');
    }
  };

  const workspacePath =
    currentUser?.role === 'seller' || currentUser?.role === 'agent'
      ? '/seller'
      : currentUser?.role === 'admin'
        ? '/admin'
        : '/dashboard';

  const formatSessionStart = () => {
    if (!sessionStartedAt) return 'Current browser session';
    const d = new Date(sessionStartedAt);
    if (Number.isNaN(d.getTime())) return 'Current browser session';
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const toggleRow = (
    label: string,
    description: string,
    checked: boolean,
    onChange: (value: boolean) => void,
    id: string
  ) => (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{description}</p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 mt-0.5 w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 flex ${
          checked ? 'bg-teal-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
      </button>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" aria-hidden="true" />
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">You are signed out</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your profile, preferences and notification settings.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={() => navigate(workspacePath)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 px-1 py-0.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to my workspace</span>
        </button>

        <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Profile &amp; Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal details, display preferences and account security.
            </p>
          </div>
          {profileDirty && (
            <div
              role="status"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
            >
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Unsaved profile changes</span>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div
          role="tablist"
          aria-label="Account sections"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
        >
          {TABS.map((tab) => {
            const selected = tab.id === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`profile-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="profile-tab-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => goToTab(tab.id)}
                onKeyDown={(e) => {
                  const index = TABS.findIndex((t) => t.id === tab.id);
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const next =
                      e.key === 'ArrowRight'
                        ? TABS[(index + 1) % TABS.length]
                        : TABS[(index - 1 + TABS.length) % TABS.length];
                    goToTab(next.id);
                    requestAnimationFrame(() =>
                      document.getElementById(`profile-tab-${next.id}`)?.focus()
                    );
                  }
                }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  selected
                    ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="profile-tab-panel"
          aria-labelledby={`profile-tab-${activeTab}`}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8"
        >
          {/* ============================ MY PROFILE ============================ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} noValidate className="space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/40"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-16 h-16 rounded-full bg-teal-600 text-white text-lg font-bold flex items-center justify-center"
                  >
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                    Role:{' '}
                    <span className="font-semibold text-teal-700 dark:text-teal-400">{currentUser.role}</span>
                    <span className="block text-[11px] not-italic text-slate-400 dark:text-slate-500 mt-0.5">
                      Roles are assigned by platform administration and cannot be changed here.
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
                      <input
                        id="profile-name"
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, name: true }));
                          setNameError(validateRequiredField(name, 'Full Name'));
                        }}
                        aria-invalid={nameError ? 'true' : 'false'}
                        aria-describedby={nameError ? 'profile-name-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 ${
                          nameError
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {nameError && (
                      <p id="profile-name-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{nameError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
                      <input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, email: true }));
                          setEmailError(validateEmailField(email));
                        }}
                        aria-invalid={emailError ? 'true' : 'false'}
                        aria-describedby={emailError ? 'profile-email-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 ${
                          emailError
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p id="profile-email-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profile-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
                      <input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="profile-agency" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Agency or Brokerage Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
                      <input
                        id="profile-agency"
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-bio" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profile Bio &amp; Search Criteria
                  </label>
                  <textarea
                    id="profile-bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Changes are stored for this account on this device.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setName(currentUser.name);
                      setEmail(currentUser.email);
                      setPhone(currentUser.phone || '');
                      setBio(currentUser.bio || '');
                      setAgency(currentUser.agency || '');
                      setNameError(null);
                      setEmailError(null);
                      setTouched({ name: false, email: false });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
                  >
                    Revert
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !profileDirty}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================= ACCOUNT SETTINGS ========================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5">
                <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Regional preferences</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Applied across listings, dashboards and reports. Selections are saved immediately.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Display currency</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Prices are stored in USD and converted for display.
                    </span>
                  </div>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold shrink-0">
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      aria-pressed={currency === 'USD'}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        currency === 'USD' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('PKR')}
                      aria-pressed={currency === 'PKR'}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        currency === 'PKR' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      PKR (₨)
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Area unit</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      1 Marla is treated as 225 sq ft.
                    </span>
                  </div>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold shrink-0">
                    <button
                      type="button"
                      onClick={() => setAreaUnit('sqft')}
                      aria-pressed={areaUnit === 'sqft'}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        areaUnit === 'sqft' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      sq ft
                    </button>
                    <button
                      type="button"
                      onClick={() => setAreaUnit('marla')}
                      aria-pressed={areaUnit === 'marla'}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        areaUnit === 'marla' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Marla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================ APPEARANCE ============================ */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5">
                <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Appearance</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Applies to every screen and is remembered for this browser.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: 'light', label: 'Light', icon: Sun, hint: 'Bright surfaces, navy text' },
                  { id: 'dark', label: 'Dark', icon: Moon, hint: 'Low-light surfaces, teal accents' },
                  { id: 'system', label: 'System', icon: Monitor, hint: 'Follows your OS setting' }
                ] as const).map((option) => {
                  const Icon = option.icon;
                  const selected = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTheme(option.id)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        selected
                          ? 'border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/50'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          option.id === 'light' ? 'text-amber-500' : option.id === 'dark' ? 'text-teal-500' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{option.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{option.hint}</span>
                      {selected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          <span>Selected</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Current selection: <strong className="text-slate-800 dark:text-slate-200 capitalize">{theme}</strong>
                {theme === 'system' && ' — your operating system currently prefers '}
                {theme === 'system' && (
                  <strong className="text-slate-800 dark:text-slate-200">
                    {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}
                  </strong>
                )}
                .
              </p>
            </div>
          )}

          {/* ========================= SECURITY & PRIVACY ======================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Current session</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    This deployment authenticates locally in your browser; there is no remote account server.
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Signed in as</dt>
                  <dd className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{currentUser.name}</dd>
                  <dd className="text-[11px] text-slate-500 dark:text-slate-400 font-mono break-all">{currentUser.email}</dd>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Authorized role</dt>
                  <dd className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-1 capitalize">{currentUser.role}</dd>
                  <dd className="text-[11px] text-slate-500 dark:text-slate-400">Role changes require an administrator.</dd>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Session started</dt>
                  <dd className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{formatSessionStart()}</dd>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Session storage</dt>
                  <dd className="text-xs font-semibold text-slate-900 dark:text-white mt-1">This browser only</dd>
                  <dd className="text-[11px] text-slate-500 dark:text-slate-400">Signing out removes the session marker on this device.</dd>
                </div>
              </dl>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Change password
                </h3>
                {accountHasCredential ? (
                  <form onSubmit={handleChangePassword} noValidate className="space-y-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Only a one-way digest of your password is kept in this browser; the password itself is never stored.
                    </p>
                    <div>
                      <label htmlFor="security-current-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
                        <input
                          id="security-current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          autoComplete="current-password"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="security-new-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="security-new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          aria-invalid={passwordTouched && passwordError ? 'true' : 'false'}
                          aria-describedby={passwordTouched && passwordError ? 'security-password-error' : undefined}
                          className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                            passwordTouched && passwordError
                              ? 'border-red-500 ring-1 ring-red-500/20'
                              : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label htmlFor="security-confirm-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="security-confirm-password"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          autoComplete="new-password"
                          aria-invalid={passwordTouched && passwordError ? 'true' : 'false'}
                          aria-describedby={passwordTouched && passwordError ? 'security-password-error' : undefined}
                          className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                            passwordTouched && passwordError
                              ? 'border-red-500 ring-1 ring-red-500/20'
                              : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                      </div>
                    </div>
                    {passwordTouched && passwordError && (
                      <p id="security-password-error" role="alert" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{passwordError}</span>
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isChangingPassword || !currentPassword}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                ) : (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    This account has no password on record, so there is nothing to change. Sign in again or recover the
                    password from the sign-in screen to set one.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    addToast('You are signed out of this device.', 'info');
                    navigate('/login');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Sign out of this device</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Not available in this deployment
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Password recovery by email — no mail or SMS delivery service is configured.</li>
                  <li>Two-factor authentication — no identity provider is connected.</li>
                  <li>Other active sessions — sessions from other devices are not visible to this client.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ======================= NOTIFICATION PREFERENCES ==================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5">
                <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notification preferences</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your choices are saved to this account as soon as you change them.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                  No email or push delivery service is connected to this deployment, so alerts are not dispatched yet.
                  Your preferences are recorded and will be used by whichever delivery channel is configured.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {toggleRow(
                  'Seller response alerts',
                  'Alert me when a seller replies to one of my inquiries.',
                  notificationPreferences.listingResponseAlerts,
                  (value) => {
                    const ok = setNotificationPreferences({ listingResponseAlerts: value });
                    addToast(
                      ok ? 'Notification preference saved.' : 'Preference could not be saved. Please try again.',
                      ok ? 'success' : 'error'
                    );
                  },
                  'notify-responses'
                )}
                {toggleRow(
                  'Weekly match recommendations',
                  'Send me new listings that fit my saved search criteria.',
                  notificationPreferences.weeklyMatchRecommendations,
                  (value) => {
                    const ok = setNotificationPreferences({ weeklyMatchRecommendations: value });
                    addToast(
                      ok ? 'Notification preference saved.' : 'Preference could not be saved. Please try again.',
                      ok ? 'success' : 'error'
                    );
                  },
                  'notify-matches'
                )}
                {toggleRow(
                  'Product updates',
                  'Occasional news about new Property Partner features.',
                  notificationPreferences.productUpdates,
                  (value) => {
                    const ok = setNotificationPreferences({ productUpdates: value });
                    addToast(
                      ok ? 'Notification preference saved.' : 'Preference could not be saved. Please try again.',
                      ok ? 'success' : 'error'
                    );
                  },
                  'notify-updates'
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
