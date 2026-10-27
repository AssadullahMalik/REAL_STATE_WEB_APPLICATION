import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';

interface AccessDeniedPageProps {
  reason?: string;
  recommendedPath?: string;
  requiredRoleLabel?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  reason,
  recommendedPath = '/',
  requiredRoleLabel
}) => {
  const { currentUser, navigate } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Authorization Boundary
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Access Restricted
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {reason || 'You do not have the necessary role permissions to access this workspace.'}
          </p>
        </div>

        {/* Current Identity & Role Details */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Current Session:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {currentUser ? currentUser.name : 'Unauthenticated Guest'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Authorized Role:</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 capitalize">
              {currentUser ? currentUser.role : 'Guest (No Role)'}
            </span>
          </div>
          {requiredRoleLabel && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400">Required Role:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {requiredRoleLabel}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          {currentUser ? (
            <button
              onClick={() => navigate(recommendedPath)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to My Workspace</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Account</span>
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Browse Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
