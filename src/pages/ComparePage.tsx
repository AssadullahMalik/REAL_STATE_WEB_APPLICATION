import React from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { 
  SlidersHorizontal, 
  X, 
  Check, 
  MapPin, 
  ArrowRight, 
  RotateCcw,
  Plus
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { 
    comparePropertyIds, 
    properties, 
    removeFromCompare, 
    clearCompare, 
    navigate,
    formatPrice,
    formatArea
  } = useApp();

  const comparedProperties = properties.filter((p) => comparePropertyIds.includes(p.id));

  // Collect union of all amenities across compared listings
  const allAmenities = Array.from(
    new Set(comparedProperties.flatMap((p) => p.amenities))
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Property Comparison Matrix
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comparing {comparedProperties.length} of 4 maximum selected residences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparedProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Matrix</span>
              </button>
            )}

            {comparedProperties.length < 4 && (
              <button
                onClick={() => navigate('/properties')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Listings</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {comparedProperties.length >= 2 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 sm:p-6 w-48 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider align-bottom">
                    Property Spec
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="p-4 sm:p-6 min-w-[240px] max-w-[300px] align-top">
                      <div className="space-y-3">
                        {/* Image */}
                        <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <ImageWithFallback
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromCompare(prop.id)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-md transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Price */}
                        <div>
                          <div className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase">
                            {prop.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                          </div>
                          <h3 
                            onClick={() => navigate(`/properties/${prop.id}`)}
                            className="text-sm font-bold text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer truncate mt-0.5"
                          >
                            {prop.title}
                          </h3>
                          <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
                            {formatPrice(prop.price, prop.listingType)}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/properties/${prop.id}`)}
                          className="w-full py-1.5 px-3 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-[11px] font-semibold rounded-lg text-center cursor-pointer"
                        >
                          View Listing Details
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Location */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Location</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{p.location.city}, {p.location.state}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Property Type */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Property Type</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 capitalize text-slate-800 dark:text-slate-200 font-medium">
                      {p.propertyType}
                    </td>
                  ))}
                </tr>

                {/* Living Area */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Living Area</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 tabular-nums text-slate-900 dark:text-white font-bold">
                      {formatArea(p.areaSqFt)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Bedrooms & Baths</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                      {p.bedrooms} Beds · {p.bathrooms} Baths
                    </td>
                  ))}
                </tr>

                {/* Year Built */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Year Constructed</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                      {p.yearBuilt}
                    </td>
                  ))}
                </tr>

                {/* Parking */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">Vehicle Parking</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                      {p.parkingSpaces} assigned spaces
                    </td>
                  ))}
                </tr>

                {/* Amenities Matrix */}
                <tr>
                  <td className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300 align-top">
                    Lifestyle Amenities Checklist
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 align-top space-y-1.5">
                      {allAmenities.map((amenity) => {
                        const hasIt = p.amenities.some((a) => a.toLowerCase() === amenity.toLowerCase());
                        return (
                          <div key={amenity} className="flex items-center gap-1.5 text-[11px]">
                            {hasIt ? (
                              <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 text-center font-bold shrink-0">—</span>
                            )}
                            <span className={hasIt ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400 dark:text-slate-500'}>
                              {amenity}
                            </span>
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty / Insufficient selection State (FR-SAVE-06) */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {comparedProperties.length === 1 
                ? 'Select at least one more property to compare' 
                : 'Your comparison table is currently empty'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Click the compare icon on any property card to align specifications, pricing per square foot, and amenity checklists side-by-side.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/properties')}
                className="px-5 py-2.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Browse Listings to Compare
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
