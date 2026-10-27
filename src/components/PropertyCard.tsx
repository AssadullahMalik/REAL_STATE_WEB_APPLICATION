import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './ImageWithFallback';
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { 
    navigate, 
    isFavorite, 
    toggleFavorite, 
    currency,
    formatPrice,
    formatArea
  } = useApp();

  const favorite = isFavorite(property.id);

  // Format price matching the reference image: $850,000 for sale, $2,500 / month for rent
  const renderPrice = () => {
    if (currency === 'PKR') {
      return formatPrice(property.price, property.listingType);
    }
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(property.price);

    if (property.listingType === 'rent') {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{formatted}</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ month</span>
        </div>
      );
    }
    return <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{formatted}</span>;
  };

  const addressLine = `${property.location.address}, ${property.location.city}, ${property.location.state}`;

  return (
    <article 
      onClick={() => navigate(`/properties/${property.id}`)}
      className="group bg-white dark:bg-[#0b1728] rounded-2xl border border-slate-200 dark:border-[#182942] overflow-hidden hover:border-slate-300 dark:hover:border-teal-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer text-slate-900 dark:text-white"
    >
      {/* Visual Slot */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-[#07101c]">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          fallbackTitle={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-Left Pill Badge: For Sale (teal) / For Rent (blue) */}
        <div className="absolute top-3 left-3 z-10">
          <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-xs ${
              property.listingType === 'sale' 
                ? 'bg-teal-600' 
                : 'bg-blue-600'
            }`}
          >
            {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Top-Right Favorite Heart Icon */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              favorite
                ? 'bg-white text-rose-500 shadow-md'
                : 'bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs'
            }`}
            title={favorite ? 'Remove from Saved Properties' : 'Save to Saved Properties'}
            aria-label={favorite ? 'Remove from Saved Properties' : 'Save to Saved Properties'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="mb-2">
            {renderPrice()}
          </div>

          {/* Address Line with Location Pin */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3 truncate">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate font-medium text-slate-700 dark:text-slate-300" title={addressLine}>
              {addressLine}
            </span>
          </div>

          {!compact && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {property.description}
            </p>
          )}
        </div>

        {/* Specs Row with Icons: Beds, Baths, sqft */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#152336] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{property.bedrooms}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Beds</span>
          </div>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{property.bathrooms}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Baths</span>
          </div>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

          <div className="flex items-center gap-1.5" title="Area">
            <Square className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
              {formatArea(property.areaSqFt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

