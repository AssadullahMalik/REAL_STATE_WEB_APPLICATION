import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyType, ListingType } from '../types';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  AlertCircle,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

const COMMON_FILTER_AMENITIES = [
  'Infinity Pool',
  'EV Charger',
  'Solar Panel Array',
  'Chef Kitchen',
  'Home Gym',
  'Private Terrace',
  'Concierge 24/7'
];

export const PropertiesPage: React.FC = () => {
  const { properties, currentPath } = useApp();

  // Parse initial query params from URL if available
  const queryParams = useMemo(() => {
    const searchPart = currentPath.split('?')[1];
    return new URLSearchParams(searchPart || '');
  }, [currentPath]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(queryParams.get('location') || '');
  const [selectedType, setSelectedType] = useState<string>(queryParams.get('type') || 'all');
  const [selectedListingType, setSelectedListingType] = useState<string>(queryParams.get('mode') || 'all');
  const [minPrice, setMinPrice] = useState<string>(queryParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(queryParams.get('maxPrice') || '');
  const [minBedrooms, setMinBedrooms] = useState<string>('all');
  const [minBathrooms, setMinBathrooms] = useState<string>('all');
  const [minArea, setMinArea] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.location.city));
    return Array.from(set).sort();
  }, [properties]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedListingType('all');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('all');
    setMinBathrooms('all');
    setMinArea('');
    setSelectedAmenities([]);
    setSelectedCity('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = 
    searchTerm ||
    selectedType !== 'all' ||
    selectedListingType !== 'all' ||
    minPrice ||
    maxPrice ||
    minBedrooms !== 'all' ||
    minBathrooms !== 'all' ||
    minArea ||
    selectedAmenities.length > 0 ||
    selectedCity !== 'all';

  // Filter computation
  const filteredProperties = useMemo(() => {
    let result = properties.filter((prop) => prop.status === 'published');

    // 1. Search term (City, neighborhood, title, or address)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.state.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          (p.location.neighborhood && p.location.neighborhood.toLowerCase().includes(q))
      );
    }

    // 2. City
    if (selectedCity !== 'all') {
      result = result.filter((p) => p.location.city === selectedCity);
    }

    // 3. Property Type
    if (selectedType !== 'all') {
      result = result.filter((p) => p.propertyType === selectedType);
    }

    // 4. Listing Type (Sale vs Rent)
    if (selectedListingType !== 'all') {
      result = result.filter((p) => p.listingType === selectedListingType);
    }

    // 5. Min Price
    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // 6. Max Price
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // 7. Bedrooms
    if (minBedrooms !== 'all') {
      result = result.filter((p) => p.bedrooms >= Number(minBedrooms));
    }

    // 8. Bathrooms
    if (minBathrooms !== 'all') {
      result = result.filter((p) => p.bathrooms >= Number(minBathrooms));
    }

    // 9. Min Area
    if (minArea && !isNaN(Number(minArea))) {
      result = result.filter((p) => p.areaSqFt >= Number(minArea));
    }

    // 10. Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((p) =>
        selectedAmenities.every((req) =>
          p.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      // Default: relevance / featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [
    properties,
    searchTerm,
    selectedCity,
    selectedType,
    selectedListingType,
    minPrice,
    maxPrice,
    minBedrooms,
    minBathrooms,
    minArea,
    selectedAmenities,
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              Real Estate Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Property Search & Listings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse verified residential, luxury villa, and commercial architecture
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{showFiltersMobile ? 'Hide Filters' : 'Filter Options'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`lg:block bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-6 ${
              showFiltersMobile ? 'block' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Filter Properties
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Keyword / Location Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Keyword or Neighborhood
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Austin, Miami, Solarium..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Metropolitan City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type (Buy vs Rent) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Listing Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedListingType('all')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListingType('sale')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'sale'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListingType('rent')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'rent'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Property Architecture
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="house">Single-Family House</option>
                <option value="villa">Luxury Villa</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="commercial">Commercial Loft</option>
                <option value="land">Permitted Land</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Price Range ($ USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono text-slate-900 dark:text-white"
                />
              </div>
              {minPrice && maxPrice && Number(minPrice) > Number(maxPrice) && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Min price cannot exceed Max price
                </p>
              )}
            </div>

            {/* Minimum Living Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Minimum Area (Sq Ft)
              </label>
              <input
                type="number"
                min="0"
                step="250"
                placeholder="e.g. 2000"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono text-slate-900 dark:text-white"
              />
            </div>

            {/* Minimum Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Minimum Bedrooms
              </label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {['all', '1', '2', '3', '4'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinBedrooms(val)}
                    className={`py-1 rounded-md text-center border transition-colors cursor-pointer ${
                      minBedrooms === val
                        ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {val === 'all' ? 'Any' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Minimum Bathrooms
              </label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {['all', '1', '2', '3', '4'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinBathrooms(val)}
                    className={`py-1 rounded-md text-center border transition-colors cursor-pointer ${
                      minBathrooms === val
                        ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {val === 'all' ? 'Any' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Amenities Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Amenities & Features
              </label>
              <div className="space-y-1.5">
                {COMMON_FILTER_AMENITIES.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`w-full p-2 rounded-lg border text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                        checked
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-600 text-teal-800 dark:text-teal-300 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{amenity}</span>
                      {checked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Control Bar: Count & Sorting */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                <span className="font-bold text-slate-900 dark:text-white">{filteredProperties.length}</span>
                <span>properties matched</span>
                {hasActiveFilters && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                    (Filtered from {properties.length} total)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="relevance">Relevance / Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Listed</option>
                  <option value="area-desc">Largest Area (Sq Ft)</option>
                </select>
              </div>
            </div>

            {/* Visible Applied-Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1">
                  Active Filters:
                </span>

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Keyword: "{searchTerm}"</span>
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>City: {selectedCity}</span>
                    <button onClick={() => setSelectedCity('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedListingType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 capitalize">
                    <span>Type: For {selectedListingType}</span>
                    <button onClick={() => setSelectedListingType('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 capitalize">
                    <span>Architecture: {selectedType}</span>
                    <button onClick={() => setSelectedType('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minPrice && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Min ${Number(minPrice).toLocaleString()}</span>
                    <button onClick={() => setMinPrice('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Max ${Number(maxPrice).toLocaleString()}</span>
                    <button onClick={() => setMaxPrice('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minBedrooms !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Beds: {minBedrooms}+</span>
                    <button onClick={() => setMinBedrooms('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minBathrooms !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Baths: {minBathrooms}+</span>
                    <button onClick={() => setMinBathrooms('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minArea && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Min {Number(minArea).toLocaleString()} sq ft</span>
                    <button onClick={() => setMinArea('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedAmenities.map((amenity) => (
                  <span key={amenity} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-300 rounded-md">
                    <span>{amenity}</span>
                    <button onClick={() => toggleAmenity(amenity)} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={resetFilters}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-semibold ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              /* Empty State (Shneiderman Rule 3 & 5: Informative feedback & recovery) */
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  No properties match these filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Try broadening your budget, clearing specific amenity requirements, or selecting an alternate metropolitan city to explore available spaces.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
