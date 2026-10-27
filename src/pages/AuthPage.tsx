import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { SAMPLE_ACCOUNT_PASSWORD } from '../data/mockData';
import { 
  validateEmailField, 
  validatePasswordField, 
  validateConfirmPasswordField, 
  validateRequiredField 
} from '../utils/validation';
import { 
  Building2, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const {
    signIn,
    registerAccount,
    findAccountByEmail,
    setAccountPassword,
    navigate,
    addToast,
    users
  } = useApp();

  // Sign-in shortcuts for the bundled sample accounts. Compiled out of
  // production builds.
  const IS_DEV = import.meta.env.DEV;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------------------
  // LOGIN FORM STATE & VALIDATION
  // ----------------------------------------------------
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [loginTouched, setLoginTouched] = useState({
    email: false,
    password: false,
  });

  const [loginErrors, setLoginErrors] = useState({
    email: null as string | null,
    password: null as string | null,
  });

  // Real-time login validation
  useEffect(() => {
    if (loginTouched.email) {
      setLoginErrors((prev) => ({ ...prev, email: validateEmailField(loginEmail) }));
    }
  }, [loginEmail, loginTouched.email]);

  useEffect(() => {
    if (loginTouched.password) {
      setLoginErrors((prev) => ({ ...prev, password: validatePasswordField(loginPassword, 8) }));
    }
  }, [loginPassword, loginTouched.password]);

  // ----------------------------------------------------
  // REGISTER FORM STATE & VALIDATION
  // ----------------------------------------------------
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('buyer');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [regTouched, setRegTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [regErrors, setRegErrors] = useState({
    name: null as string | null,
    email: null as string | null,
    password: null as string | null,
    confirmPassword: null as string | null,
    terms: null as string | null,
  });

  // Real-time register validation
  useEffect(() => {
    if (regTouched.name) {
      setRegErrors((prev) => ({ ...prev, name: validateRequiredField(regName, 'Full Name') }));
    }
  }, [regName, regTouched.name]);

  useEffect(() => {
    if (regTouched.email) {
      setRegErrors((prev) => ({ ...prev, email: validateEmailField(regEmail) }));
    }
  }, [regEmail, regTouched.email]);

  // Password & Confirm Password cross-validation
  useEffect(() => {
    if (regTouched.password) {
      setRegErrors((prev) => ({ ...prev, password: validatePasswordField(regPassword, 8) }));
    }
    // Update confirmation error state when password changes
    if (regTouched.confirmPassword) {
      setRegErrors((prev) => ({ 
        ...prev, 
        confirmPassword: validateConfirmPasswordField(regConfirmPassword, regPassword) 
      }));
    }
  }, [regPassword, regTouched.password, regConfirmPassword, regTouched.confirmPassword]);

  useEffect(() => {
    if (regTouched.confirmPassword) {
      setRegErrors((prev) => ({ 
        ...prev, 
        confirmPassword: validateConfirmPasswordField(regConfirmPassword, regPassword) 
      }));
    }
  }, [regConfirmPassword, regPassword, regTouched.confirmPassword]);

  useEffect(() => {
    if (regTouched.terms) {
      setRegErrors((prev) => ({
        ...prev,
        terms: agreedTerms ? null : 'You must accept the terms to continue.',
      }));
    }
  }, [agreedTerms, regTouched.terms]);

  // ----------------------------------------------------
  // FORGOT PASSWORD STATE & VALIDATION
  // ----------------------------------------------------
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  // Local recovery step. With no mail service configured, the reset is completed
  // on this device instead of through a dispatched link.
  const [recoveryAccountId, setRecoveryAccountId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetTouched, setResetTouched] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (forgotTouched) {
      setForgotError(validateEmailField(forgotEmail));
    }
  }, [forgotEmail, forgotTouched]);

  // General error banner for server or authentication failure
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  // ----------------------------------------------------
  // SUBMISSION HANDLERS
  // ----------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);

    // Mark all login fields as touched to expose errors if invalid
    setLoginTouched({ email: true, password: true });

    const emailErr = validateEmailField(loginEmail);
    const passErr = validatePasswordField(loginPassword, 8);

    setLoginErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      return; // Prevent submission
    }

    setIsSubmitting(true);

    const result = signIn(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (!result.success) {
      setFormSubmitError(result.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);

    // Mark all fields touched
    setRegTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    const nameErr = validateRequiredField(regName, 'Full Name');
    const emailErr = validateEmailField(regEmail);
    const passErr = validatePasswordField(regPassword, 8);
    const confirmErr = validateConfirmPasswordField(regConfirmPassword, regPassword);
    const termsErr = agreedTerms ? null : 'You must accept the terms to continue.';

    setRegErrors({
      name: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
      terms: termsErr,
    });

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      return; // Prevent submission until valid
    }

    setIsSubmitting(true);

    const result = registerAccount({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole === 'seller' ? 'seller' : 'buyer'
    });
    setIsSubmitting(false);

    if (!result.success) {
      setFormSubmitError(result.message);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);
    setForgotTouched(true);

    const emailErr = validateEmailField(forgotEmail);
    setForgotError(emailErr);

    if (emailErr) return;

    const account = findAccountByEmail(forgotEmail);
    if (!account) {
      setFormSubmitError('No account on this device matches that email, so there is nothing to recover. Create an account instead.');
      return;
    }

    setRecoveryAccountId(account.id);
    setRecoverySent(true);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetTouched(true);

    const passErr = validatePasswordField(resetPassword, 8);
    const confirmErr = validateConfirmPasswordField(resetConfirm, resetPassword);
    setResetError(passErr || confirmErr);

    if (passErr || confirmErr || !recoveryAccountId) return;

    setIsSubmitting(true);
    const saved = setAccountPassword(recoveryAccountId, resetPassword);
    setIsSubmitting(false);

    if (saved) {
      setResetDone(true);
      addToast('Password updated for this account.', 'success');
    } else {
      setFormSubmitError('The password could not be written to storage. No change was made.');
    }
  };

  // Developer-only shortcut onto the bundled sample accounts.
  const handleQuickSampleLogin = (role: UserRole) => {
    if (!IS_DEV) return;
    setFormSubmitError(null);
    const user = users.find((u) => u.role === role);
    if (user) {
      setLoginEmail(user.email);
      const result = signIn(user.email, SAMPLE_ACCOUNT_PASSWORD);
      if (!result.success) {
        setFormSubmitError('The sample account password was changed on this device, so sign in with your own password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Sign in to Property Partner'}
            {mode === 'register' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Access saved properties, matchmaker preferences, and seller chats'}
            {mode === 'register' && 'Join as a prospective buyer, private seller, or licensed broker'}
            {mode === 'forgot' && 'Confirm your account email, then choose a new password on this device'}
          </p>
        </div>

        {/* Developer-only sign-in shortcuts for the bundled sample accounts */}
        {IS_DEV && mode === 'login' && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-dashed border-teal-300 dark:border-teal-800 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 block">
              Development only · sample accounts
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSampleLogin('buyer')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickSampleLogin('seller')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => handleQuickSampleLogin('admin')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white dark:text-slate-950 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          {formSubmitError && (
            <div 
              role="alert" 
              className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{formSubmitError}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 1: LOGIN                                         */}
          {/* ==================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onBlur={() => setLoginTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="e.g. asad@gmail.com"
                    aria-invalid={loginErrors.email ? 'true' : 'false'}
                    aria-describedby={loginErrors.email ? 'login-email-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      loginErrors.email
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : loginTouched.email && !loginErrors.email && loginEmail
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {loginTouched.email && !loginErrors.email && loginEmail && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {loginErrors.email && (
                  <p 
                    id="login-email-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{loginErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setFormSubmitError(null);
                    }}
                    className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onBlur={() => setLoginTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="At least 8 characters"
                    aria-invalid={loginErrors.password ? 'true' : 'false'}
                    aria-describedby={loginErrors.password ? 'login-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      loginErrors.password
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : loginTouched.password && !loginErrors.password && loginPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p 
                    id="login-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{loginErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setFormSubmitError(null);
                  }}
                  className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE 2: REGISTER                                     */}
          {/* ==================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label 
                  htmlFor="reg-name" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="e.g. Asad Malik"
                    aria-invalid={regErrors.name ? 'true' : 'false'}
                    aria-describedby={regErrors.name ? 'reg-name-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.name
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.name && !regErrors.name && regName
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {regTouched.name && !regErrors.name && regName && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {regErrors.name && (
                  <p 
                    id="reg-name-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="reg-email" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="e.g. asad@gmail.com"
                    aria-invalid={regErrors.email ? 'true' : 'false'}
                    aria-describedby={regErrors.email ? 'reg-email-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.email
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.email && !regErrors.email && regEmail
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {regTouched.email && !regErrors.email && regEmail && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {regErrors.email && (
                  <p 
                    id="reg-email-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Intended Account Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                      regRole === 'buyer' 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Buyer / Investor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('seller')}
                    className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                      regRole === 'seller' 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Seller / Agent
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="reg-password" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Must be at least 8 characters"
                    aria-invalid={regErrors.password ? 'true' : 'false'}
                    aria-describedby={regErrors.password ? 'reg-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.password
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.password && !regErrors.password && regPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regErrors.password && (
                  <p 
                    id="reg-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="reg-confirm-password" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Re-enter password"
                    aria-invalid={regErrors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={regErrors.confirmPassword ? 'reg-confirm-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.confirmPassword
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.confirmPassword && !regErrors.confirmPassword && regConfirmPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regErrors.confirmPassword && (
                  <p 
                    id="reg-confirm-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="leading-snug">
                    I agree to the Property Partner Terms of Service and Privacy Policy. <span className="text-red-500">*</span>
                  </span>
                </label>
                {regErrors.terms && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.terms}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormSubmitError(null);
                  }}
                  className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE 3: FORGOT PASSWORD                              */}
          {/* ==================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {resetDone ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Password updated</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    The new password is stored for <strong>{forgotEmail}</strong> on this device. Sign in with it to continue.
                  </p>
                  <button
                    onClick={() => {
                      setResetDone(false);
                      setRecoverySent(false);
                      setRecoveryAccountId(null);
                      setResetPassword('');
                      setResetConfirm('');
                      setResetTouched(false);
                      setResetError(null);
                      setMode('login');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : recoverySent ? (
                <form onSubmit={handleResetSubmit} noValidate className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Account found for <strong className="text-slate-800 dark:text-slate-200">{forgotEmail}</strong>. No
                    recovery email can be sent because no mail service is configured for this deployment, so the new
                    password is set here on the account holder's own browser.
                  </p>

                  <div>
                    <label htmlFor="reset-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        id="reset-password"
                        type="password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        onBlur={() => setResetTouched(true)}
                        placeholder="At least 8 characters"
                        aria-invalid={resetTouched && resetError ? 'true' : 'false'}
                        aria-describedby={resetTouched && resetError ? 'reset-password-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 ${
                          resetTouched && resetError
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reset-confirm" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        id="reset-confirm"
                        type="password"
                        value={resetConfirm}
                        onChange={(e) => setResetConfirm(e.target.value)}
                        onBlur={() => setResetTouched(true)}
                        placeholder="Re-enter new password"
                        aria-invalid={resetTouched && resetError ? 'true' : 'false'}
                        aria-describedby={resetTouched && resetError ? 'reset-password-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 ${
                          resetTouched && resetError
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {resetTouched && resetError && (
                      <p id="reset-password-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{resetError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Set New Password</span>
                    )}
                  </button>

                  <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        setRecoverySent(false);
                        setRecoveryAccountId(null);
                        setMode('login');
                      }}
                      className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
                  <div>
                    <label 
                      htmlFor="forgot-email" 
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Account Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        onBlur={() => setForgotTouched(true)}
                        placeholder="e.g. asad@gmail.com"
                        aria-invalid={forgotError ? 'true' : 'false'}
                        aria-describedby={forgotError ? 'forgot-email-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                          forgotError
                            ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                            : forgotTouched && !forgotError && forgotEmail
                            ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {forgotError && (
                      <p 
                        id="forgot-email-error" 
                        role="alert" 
                        className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{forgotError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Checking Account...</span>
                      </>
                    ) : (
                      <span>Continue to Reset</span>
                    )}
                  </button>

                  <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setFormSubmitError(null);
                      }}
                      className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
