import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Plus, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const { properties, currentUser, navigate, deleteProperty, conversations, formatPrice } = useApp();

  // Filter listings associated with current seller/agent or demo listings
  const sellerProperties = properties.filter(
    (p) => p.sellerId === currentUser?.id || currentUser?.role === 'seller' || currentUser?.role === 'agent'
  );

  const activeCount = sellerProperties.filter((p) => p.status === 'published').length;
  const pendingCount = sellerProperties.filter((p) => p.status === 'pending').length;
  const totalViews = sellerProperties.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalInquiries = sellerProperties.reduce((acc, p) => acc + p.inquiriesCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Primary CTA */}
        <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-full">
              <span>Seller Studio</span>
              <span className="text-teal-700">·</span>
              <span>{currentUser?.name || 'Marcus Vance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real Estate Listing Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Create and publish architectural property records, track buyer engagement metrics, and respond to incoming inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/seller/properties/new')}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List New Property</span>
            </button>
            <button
              onClick={() => navigate('/seller/properties')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Manage Catalog
            </button>
          </div>
        </div>

        {/* 4 Seller KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Total Listed
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {sellerProperties.length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Properties in portfolio</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Active & Published
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {activeCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Live in marketplace</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Pending Review
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Awaiting moderation</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Total Inquiries
            </div>
            <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
              {totalInquiries}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">High-intent buyer leads</div>
          </div>
        </div>

        {/* Recent Listings Management Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Property Listings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Overview of recent status and metrics</p>
            </div>
            <button
              onClick={() => navigate('/seller/properties')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sellerProperties.slice(0, 5).map((prop) => (
              <div
                key={prop.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                    alt={prop.title}
                    className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 
                      onClick={() => navigate(`/properties/${prop.id}`)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      {prop.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{prop.location.city}, {prop.location.state}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {formatPrice(prop.price, prop.listingType)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="font-medium">{prop.viewsCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-medium">{prop.inquiriesCount}</span>
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prop.status === 'published'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : prop.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {prop.status}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/seller/properties/${prop.id}/edit`)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 dark:hover:text-teal-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit Listing"
                      aria-label={`Edit ${prop.title}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProperty(prop.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Delete Listing"
                      aria-label={`Delete ${prop.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
