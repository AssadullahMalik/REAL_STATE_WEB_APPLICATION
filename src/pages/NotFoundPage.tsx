import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center transition-colors">
      <div className="max-w-md w-full space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page Not Located
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The requested page route could not be found in the Property Partner index.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
};
