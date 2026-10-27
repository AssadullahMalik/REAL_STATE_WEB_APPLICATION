import React from 'react';
import { useApp } from '../context/AppContext';
import { hasPermission } from '../utils/permissions';
import { Building2, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, currentUser } = useApp();
  const role = currentUser?.role;
  const canViewAdminConsole = hasPermission(role, 'view_admin_console');

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
      {/* Service Transparency Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-200/50 dark:bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
            <span>
              <strong>Your Real Estate, Simplified:</strong> Property Partner brings listing discovery, design visualization and direct seller contact into one place.
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-center md:text-right">
            AI Property Designer previews and AI Connect passes run locally in this build and are labelled where they apply.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Property Partner</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              An AI-powered real estate web platform combining structured property discovery, preference matching, spatial concept visualization, and direct buyer–seller communication.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span>Version 1.0</span>
              <span>·</span>
              <span>Responsive Web</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Core AI Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/matchmaker')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  AI Property Matchmaker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/designer')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  AI Property Designer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/connect')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  AI Connect Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Property Comparison Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/properties')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  All Properties
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/properties?type=villa')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Modern Villas & Estates
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/properties?type=apartment')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Urban Penthouses & Lofts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/properties?type=house')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Single-Family Residences
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/saved')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Saved Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Buyer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seller')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Seller Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seller/properties/new')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Post New Listing
                </button>
              </li>
              {canViewAdminConsole && (
                <li>
                  <button onClick={() => navigate('/admin')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-teal-600 dark:text-teal-300 font-medium cursor-pointer">
                    Admin Console
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => navigate(currentUser ? '/profile' : '/login')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  {currentUser ? 'My Account' : 'Account Sign In'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Property Partner. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 dark:hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-400 cursor-pointer">WCAG 2.2 AA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
