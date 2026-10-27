import React from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, SlidersHorizontal, ArrowRight, Building2 } from 'lucide-react';

export const SavedPropertiesPage: React.FC = () => {
  const { savedPropertyIds, properties, navigate, comparePropertyIds } = useApp();

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-600 dark:fill-rose-400" />
              <span>Favorites Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Saved Properties
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You have {savedProperties.length} bookmarked {savedProperties.length === 1 ? 'property' : 'properties'} saved to this session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparePropertyIds.length > 0 && (
              <button
                onClick={() => navigate('/compare')}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare Matrix ({comparePropertyIds.length})</span>
              </button>
            )}
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse More Listings
            </button>
          </div>
        </div>

        {/* Content */}
        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          /* Informative Empty State (FR-SAVE-06) */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your saved properties list is currently empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              As you browse listings in the property directory, click the heart icon on any card to bookmark residences for later review or side-by-side comparison.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/properties')}
                className="px-5 py-2.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Explore Properties Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
