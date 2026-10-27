import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ListingStatus } from '../types';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react';

export const SellerPropertiesPage: React.FC = () => {
  const { properties, deleteProperty, navigate, currentUser, formatPrice } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);

  // Keyboard shortcut: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && propertyToDelete) {
        setPropertyToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [propertyToDelete]);

  // Listings for this seller or all if viewing as demo broker
  const sellerProperties = properties.filter(
    (p) => p.sellerId === currentUser?.id || currentUser?.role === 'seller' || currentUser?.role === 'agent'
  );

  const filtered = statusFilter === 'all'
    ? sellerProperties
    : sellerProperties.filter((p) => p.status === statusFilter);

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/seller')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Seller Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              Inventory Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Property Listings ({sellerProperties.length})
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your published listings, draft concepts, and moderation submissions.
            </p>
          </div>

          <button
            onClick={() => navigate('/seller/properties/new')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'published', 'pending', 'draft'] as const).map((st) => {
            const active = statusFilter === st;
            const count = st === 'all' 
              ? sellerProperties.length 
              : sellerProperties.filter((p) => p.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Listings List */}
        {filtered.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((prop) => (
              <div
                key={prop.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                    alt={prop.title}
                    className="w-24 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prop.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : prop.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {prop.status}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 uppercase">{prop.propertyType}</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{prop.listingType}</span>
                    </div>

                    <h3 
                      onClick={() => navigate(`/properties/${prop.id}`)}
                      className="font-bold text-base text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      {prop.title}
                    </h3>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {formatPrice(prop.price, prop.listingType)}
                      </span>
                      <span>·</span>
                      <span>{prop.location.address}, {prop.location.city}</span>
                      <span>·</span>
                      <span>{prop.viewsCount} Views</span>
                      <span>·</span>
                      <span>{prop.inquiriesCount} Inquiries</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => navigate(`/seller/properties/${prop.id}/edit`)}
                    className="px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setPropertyToDelete({ id: prop.id, title: prop.title })}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Delete listing"
                    aria-label={`Delete ${prop.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No listings found under "{statusFilter}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a new property listing to start reaching prospective buyers.
            </p>
            <button
              onClick={() => navigate('/seller/properties/new')}
              className="px-5 py-2.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              List a Property Now
            </button>
          </div>
        )}
      </div>

      {/* Accessible Confirmation Modal for Destructive Deletion */}
      {propertyToDelete && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Listing Removal</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove <strong>"{propertyToDelete.title}"</strong> from the public directory? Active buyer inquiries associated with this property will also be archived.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
