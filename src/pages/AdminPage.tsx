import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, ListingStatus } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  Check, 
  X, 
  ExternalLink,
  RotateCcw,
  Clock
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    properties, 
    updatePropertyStatus, 
    users, 
    currentUser,
    activeSubscription,
    navigate,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'subscriptions' | 'reports'>('moderation');

  const pendingListings = properties.filter((p) => p.status === 'pending');
  const publishedListings = properties.filter((p) => p.status === 'published');

  const handleApprove = (propId: string) => {
    updatePropertyStatus(propId, 'published');
    addToast('Listing approved and published to public marketplace.', 'success');
  };

  const handleReject = (propId: string) => {
    updatePropertyStatus(propId, 'rejected');
    addToast('Listing rejected and returned to author with notes.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Console identity */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-900/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Administration Console
              </div>
              <div className="text-sm font-semibold">
                Listing moderation and platform oversight
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Actions apply to the listing records held by this deployment.
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Total User Accounts
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {users.length} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">registered</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Active Listings
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {publishedListings.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Moderation Queue
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {pendingListings.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Connection Passes
            </div>
            <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
              {activeSubscription?.isActive ? 1 : 0}{" "}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                {activeSubscription ? 'on file' : 'recorded'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              No payment provider is integrated, so billed revenue is not tracked.
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Moderation Queue</span>
            {pendingListings.length > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {pendingListings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            User Directory
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            AI Connect Subscriptions
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Reported Content
          </button>
        </div>

        {/* TAB 1: MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Listings for Verification ({pendingListings.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review submitted property records before making them publicly searchable.
              </p>
            </div>

            {pendingListings.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingListings.map((prop) => (
                  <div key={prop.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                        alt={prop.title}
                        className="w-24 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{prop.title}</h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {prop.location.city}, {prop.location.state} · ${prop.price.toLocaleString()} · {prop.areaSqFt} sq ft
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Submitted by: {prop.sellerName} ({prop.sellerRole}) · {prop.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/properties/${prop.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleReject(prop.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                <Check className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                <span>All submitted listings have been reviewed. Moderation queue is clear!</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">User Records Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Contact Email</th>
                    <th className="py-3 px-4 font-semibold">Registered</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">{u.role}</td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{u.createdAt}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS AUDIT */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Connect Active Subscriptions Audit</h2>
            <div className="space-y-3">
              {activeSubscription ? (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{activeSubscription.planName} · ${activeSubscription.price} USD</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      User: <strong>{currentUser?.name ?? 'Unattributed'}</strong> ({activeSubscription.userId}) · Valid: {activeSubscription.startDate} to {activeSubscription.expiryDate}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeSubscription.isActive ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}>
                    {activeSubscription.isActive ? 'Active Entitlement' : 'Expired'}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No connection pass records are available to this account. Pass activations are stored per device and are not visible as a platform-wide ledger in this deployment.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTED CONTENT */}
        {activeTab === 'reports' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Community Safety Reports</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Price Discrepancy Inquiry</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Flagged for potential HOA miscalculation on Solarium Villa.</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Resolved · Verified Accurate
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
