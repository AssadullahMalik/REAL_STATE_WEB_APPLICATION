import React from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Heart, 
  SlidersHorizontal, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Compass,
  History
} from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    savedPropertyIds, 
    comparePropertyIds, 
    activeSubscription, 
    conversations,
    properties, 
    recentlyViewedIds,
    navigate 
  } = useApp();

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));
  const recentlyViewed = properties.filter((p) => recentlyViewedIds.includes(p.id));
  const recommendedProperties = properties
    .filter((p) => p.status === 'published' && !savedPropertyIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e18] text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Greeting Banner (Matches image_561f6d67.png exactly) */}
        <div className="bg-[#09111e] border border-[#162338] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00c49f] bg-[#032622]/90 border border-[#0d594d] px-3.5 py-1 rounded-full">
              <span>Verified Buyer Profile</span>
              <span className="text-[#0d594d]">·</span>
              <span>{currentUser?.email || 'alex.rivera@example.com'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Alex Rivera'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Track your saved properties, monitor active seller conversations, and explore tailored architectural matches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/matchmaker')}
              className="px-5 py-2.5 bg-[#00c49f] hover:bg-[#00b08e] text-slate-950 font-bold text-xs rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Launch Matchmaker</span>
            </button>
            <button
              onClick={() => navigate('/designer')}
              className="px-5 py-2.5 bg-[#142033]/90 hover:bg-[#1a2c47] text-white font-semibold text-xs rounded-full border border-[#223652] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>AI Designer</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards (Matches image_561f6d67.png exactly) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Saved Properties */}
          <div 
            onClick={() => navigate('/saved')}
            className="bg-white dark:bg-[#0b1728] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-[#182942] hover:border-teal-500/40 shadow-xs dark:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">Saved Properties</span>
              <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 fill-none" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {savedPropertyIds.length}
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-2 flex items-center gap-1">
              <span>View collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Compare Matrix */}
          <div 
            onClick={() => navigate('/compare')}
            className="bg-white dark:bg-[#0b1728] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-[#182942] hover:border-teal-500/40 shadow-xs dark:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">Comparing</span>
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#132238] text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {comparePropertyIds.length} <span className="text-xs font-normal text-slate-400">/ 4 max</span>
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-2 flex items-center gap-1">
              <span>Open matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Connect Status */}
          <div 
            onClick={() => navigate('/connect')}
            className="bg-white dark:bg-[#0b1728] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-[#182942] hover:border-teal-500/40 shadow-xs dark:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">AI Connect</span>
              <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
              {activeSubscription && activeSubscription.isActive ? activeSubscription.planName : 'No Active Pass'}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {activeSubscription && activeSubscription.isActive ? `Expires ${activeSubscription.expiryDate}` : 'Unlock seller chat'}
            </div>
          </div>

          {/* Card 4: Conversations */}
          <div 
            onClick={() => navigate('/messages')}
            className="bg-white dark:bg-[#0b1728] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-[#182942] hover:border-teal-500/40 shadow-xs dark:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">Inquiry Messages</span>
              <div className="w-9 h-9 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-500 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {conversations.length}
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-2 flex items-center gap-1">
              <span>View threads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Section 1: Saved Properties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182942]">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Properties</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Residences you have bookmarked for comparison and review</p>
            </div>
            {savedProperties.length > 0 && (
              <button
                onClick={() => navigate('/saved')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline cursor-pointer"
              >
                Manage all ({savedProperties.length})
              </button>
            )}
          </div>

          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0b1728] rounded-xl border border-dashed border-slate-300 dark:border-[#182942] p-8 text-center shadow-xs">
              <Heart className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300">No saved properties yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Click the heart icon on any property card or detail page to bookmark listings for later review.
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Explore Properties
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Recently Viewed Properties */}
        {recentlyViewed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182942]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Viewed Properties</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your recent browsing history across the catalog</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Recommended for You */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182942]">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tailored for Your Preferences</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Curated suggestions aligned with your architectural tastes</p>
            </div>
            <button
              onClick={() => navigate('/matchmaker')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline cursor-pointer"
            >
              Adjust Match Criteria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
