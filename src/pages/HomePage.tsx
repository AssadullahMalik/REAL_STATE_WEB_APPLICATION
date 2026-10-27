import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import heroBgImage from '../assets/images/hero_luxury_villa_1793112777200.jpg';
import { 
  Search, 
  Sparkles, 
  Layers, 
  MessageSquare, 
  ArrowRight, 
  Building2, 
  Home as HomeIcon, 
  Building, 
  Landmark, 
  MapPin, 
  ShieldCheck, 
  Shield,
  Star,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Check,
  RotateCcw
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { properties, navigate } = useApp();

  // Search Card Form State
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [propertySize, setPropertySize] = useState<string>('all');
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [bathrooms, setBathrooms] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Available unique cities from properties
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    properties.forEach((p) => {
      if (p.location?.city) {
        cities.add(`${p.location.city}, ${p.location.state}`);
      }
    });
    return Array.from(cities).sort();
  }, [properties]);

  // Featured Properties for homepage: published properties, top 4 for 4-column desktop grid
  const featuredProperties = useMemo(() => {
    const published = properties.filter((p) => p.status === 'published');
    // Prioritize featured ones
    const sorted = [...published].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    return sorted.slice(0, 4);
  }, [properties]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearching) return;
    setIsSearching(true);

    const params = new URLSearchParams();
    params.set('mode', listingType);

    if (propertyType && propertyType !== 'all') {
      params.set('type', propertyType);
    }

    if (location && location !== 'all') {
      const cityName = location.split(',')[0].trim();
      params.set('location', cityName);
    }

    // Price range parsing
    if (priceRange !== 'all') {
      if (listingType === 'sale') {
        if (priceRange === 'under-500k') params.set('maxPrice', '500000');
        else if (priceRange === '500k-1m') { params.set('minPrice', '500000'); params.set('maxPrice', '1000000'); }
        else if (priceRange === '1m-2.5m') { params.set('minPrice', '1000000'); params.set('maxPrice', '2500000'); }
        else if (priceRange === '2.5m-plus') { params.set('minPrice', '2500000'); }
      } else {
        if (priceRange === 'under-2k') params.set('maxPrice', '2000');
        else if (priceRange === '2k-4k') { params.set('minPrice', '2000'); params.set('maxPrice', '4000'); }
        else if (priceRange === '4k-7k') { params.set('minPrice', '4000'); params.set('maxPrice', '7000'); }
        else if (priceRange === '7k-plus') { params.set('minPrice', '7000'); }
      }
    }

    if (bedrooms !== 'all') {
      params.set('minBedrooms', bedrooms);
    }

    if (propertySize !== 'all') {
      if (propertySize === '1000') params.set('minArea', '1000');
      else if (propertySize === '2000') params.set('minArea', '2000');
      else if (propertySize === '3000') params.set('minArea', '3000');
      else if (propertySize === '4000') params.set('minArea', '4000');
    }

    if (bathrooms !== 'all') {
      params.set('minBathrooms', bathrooms);
    }

    setTimeout(() => {
      setIsSearching(false);
      navigate(`/properties?${params.toString()}`);
    }, 200);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetSearchForm = () => {
    setListingType('sale');
    setPropertyType('all');
    setLocation('all');
    setPriceRange('all');
    setBedrooms('all');
    setPropertySize('all');
    setBathrooms('all');
    setSelectedAmenities([]);
  };

  const categories = [
    { id: 'house', name: 'Houses & Estates', icon: HomeIcon, count: `${properties.filter(p => p.propertyType === 'house').length} Active` },
    { id: 'apartment', name: 'Urban Apartments', icon: Building, count: `${properties.filter(p => p.propertyType === 'apartment').length} Active` },
    { id: 'villa', name: 'Luxury Villas', icon: Landmark, count: `${properties.filter(p => p.propertyType === 'villa').length} Active` },
    { id: 'commercial', name: 'Commercial & Studios', icon: Building2, count: `${properties.filter(p => p.propertyType === 'commercial').length} Active` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e18] text-slate-900 dark:text-slate-100 transition-colors">
      {/* =========================================================================
          HERO SECTION (Matches Reference Image)
          Two-column layout on deep navy background with dusk luxury villa backdrop
          ========================================================================= */}
      <section className="relative bg-[#091422] text-white overflow-hidden border-b border-slate-800 dark:border-[#132338]">
        {/* Dusk luxury architectural villa backdrop image on the right */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBgImage} 
            alt="Luxury architectural estate at dusk" 
            className="w-full h-full object-cover object-right-top lg:object-right opacity-85"
          />
          {/* Multi-stage navy gradient overlays to preserve deep contrast for text and search card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#091422] via-[#091422]/95 lg:via-[#091422]/80 to-[#091422]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091422] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Branding Headline & Trust Indicators
                ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Kicker */}
              <div>
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-300 uppercase block mb-3">
                  FIND YOUR DREAM HOME
                </span>

                {/* Display Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Find Your <br />
                  <span className="text-teal-400">Dream Home</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Discover premium properties with verified listings, expert guidance and cutting-edge technology. Your perfect home awaits.
              </p>

              {/* Trust Indicators Row (Exact Match from Screenshot) */}
              <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-4 border-t border-slate-700/60 max-w-2xl">
                  {/* Trust item 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Verified Properties</div>
                      <div className="text-xs text-slate-400 mt-0.5">Trusted & Authentic</div>
                    </div>
                  </div>

                  {/* Trust item 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">RERA Compliant</div>
                      <div className="text-xs text-slate-400 mt-0.5">Legal & Secure</div>
                    </div>
                  </div>

                  {/* Trust item 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Premium Service</div>
                      <div className="text-xs text-slate-400 mt-0.5">Your Satisfaction First</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Verified Metrics & Secondary CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/properties')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-teal-400/50 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                </button>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>{properties.length} Active Verified Residences</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: Responsive Search Card (Light / Dark Adaptive)
                ------------------------------------------------------------- */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white dark:bg-[#0b1728] border border-slate-200 dark:border-[#182942] rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white transition-all">
                {/* Search Card Heading */}
                <div className="mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Find Your Perfect Property
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Search from thousands of verified listings
                  </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  {/* Segmented Buy / Rent Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex p-1 bg-slate-100 dark:bg-[#07101c] border border-slate-200 dark:border-[#16253b] rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setListingType('sale')}
                        className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${
                          listingType === 'sale'
                            ? 'bg-teal-600 text-white shadow-sm font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        onClick={() => setListingType('rent')}
                        className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${
                          listingType === 'rent'
                            ? 'bg-teal-600 text-white shadow-sm font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Rent
                      </button>
                    </div>
                  </div>

                  {/* Row 1: Property Type & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    {/* Property Type Selector */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <HomeIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>Property Type</span>
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-[#1d3250] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer transition-colors"
                      >
                        <option value="all" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Select Property Type</option>
                        <option value="house" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Single Family House</option>
                        <option value="villa" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Luxury Villa</option>
                        <option value="apartment" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Condo & Apartment</option>
                        <option value="townhouse" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Townhouse</option>
                        <option value="commercial" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Commercial Loft</option>
                        <option value="land" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Permitted Land</option>
                      </select>
                    </div>

                    {/* Location Selector */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>Location</span>
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-[#1d3250] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer transition-colors"
                      >
                        <option value="all" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Select City, Neighborhood</option>
                        {availableCities.map((c) => (
                          <option key={c} value={c} className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Price Range, Bedrooms, Property Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                    {/* Price Range */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Price Range
                      </label>
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-2.5 py-2.5 text-xs bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-[#1d3250] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer transition-colors"
                      >
                        <option value="all" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Any Price</option>
                        {listingType === 'sale' ? (
                          <>
                            <option value="under-500k" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">&lt; $500,000</option>
                            <option value="500k-1m" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$500,000 - $1M</option>
                            <option value="1m-2.5m" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$1M - $2.5M</option>
                            <option value="2.5m-plus" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$2.5M+</option>
                          </>
                        ) : (
                          <>
                            <option value="under-2k" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">&lt; $2,000 / mo</option>
                            <option value="2k-4k" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$2,000 - $4,000 / mo</option>
                            <option value="4k-7k" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$4,000 - $7,000 / mo</option>
                            <option value="7k-plus" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">$7,000+ / mo</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full px-2.5 py-2.5 text-xs bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-[#1d3250] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer transition-colors"
                      >
                        <option value="all" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Any</option>
                        <option value="1" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">1+ Bed</option>
                        <option value="2" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">2+ Beds</option>
                        <option value="3" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">3+ Beds</option>
                        <option value="4" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">4+ Beds</option>
                      </select>
                    </div>

                    {/* Property Size */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Property Size
                      </label>
                      <select
                        value={propertySize}
                        onChange={(e) => setPropertySize(e.target.value)}
                        className="w-full px-2.5 py-2.5 text-xs bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-[#1d3250] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer transition-colors"
                      >
                        <option value="all" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">Any Size</option>
                        <option value="1000" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">1,000+ sq ft</option>
                        <option value="2000" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">2,000+ sq ft</option>
                        <option value="3000" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">3,000+ sq ft</option>
                        <option value="4000" className="bg-white dark:bg-[#101f35] text-slate-900 dark:text-white">4,000+ sq ft</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Expandable More Filters */}
                  {showMoreFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-[#182942] space-y-3 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Bathrooms
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 text-xs">
                          {['all', '1', '2', '3'].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setBathrooms(b)}
                              className={`py-1.5 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                                bathrooms === b
                                  ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                                  : 'bg-slate-50 dark:bg-[#101f35] border-slate-200 dark:border-[#1d3250] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:text-white'
                              }`}
                            >
                              {b === 'all' ? 'Any' : `${b}+`}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Featured Amenities
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Pool', 'EV Charger', 'Solar', 'Chef Kitchen', 'Terrace', 'Gym'].map((amenity) => {
                            const selected = selectedAmenities.includes(amenity);
                            return (
                              <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                                  selected
                                    ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 text-teal-700 dark:text-teal-300 font-bold'
                                    : 'bg-slate-50 dark:bg-[#101f35] border-slate-200 dark:border-[#1d3250] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:text-white'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
                                <span>{amenity}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      <Search className="w-4 h-4" />
                      <span>{isSearching ? 'Filtering Listings...' : 'Search Properties'}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* Bottom Action: More Filters toggle */}
                  <div className="pt-1 flex items-center justify-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowMoreFilters(!showMoreFilters)}
                      className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{showMoreFilters ? 'Fewer Filters' : 'More Filters'}</span>
                    </button>

                    {(propertyType !== 'all' || location !== 'all' || priceRange !== 'all' || bedrooms !== 'all' || propertySize !== 'all') && (
                      <button
                        type="button"
                        onClick={resetSearchForm}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PROPERTIES SECTION (Matches Reference Image)
          4 columns on desktop with header dash indicator and "View All Properties ->"
          ========================================================================= */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-1 bg-teal-500 rounded-full inline-block" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Featured Properties
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-7">
              Handpicked properties based on your preferences
            </p>
          </div>

          <button
            onClick={() => navigate('/properties')}
            className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid Across Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          CORE AI SERVICES TRIAD (Preserves Business Capabilities)
          ========================================================================= */}
      <section className="py-14 bg-white dark:bg-[#0a1422] border-y border-slate-200 dark:border-[#152438]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Three Intelligent Services in One Platform
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Engineered around user-centered interaction principles to eliminate friction in discovering, visualizing, and communicating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Service 1: Matchmaker */}
            <div className="bg-slate-50 dark:bg-[#0e1b2e] rounded-2xl border border-slate-200 dark:border-[#1b2f4a] p-6 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-xs dark:shadow-md">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Property Matchmaker</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Input your exact budget limits, bedroom criteria, and amenity priorities. Our preference engine calculates scoring explanations for every home.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Explainable criteria scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Budget & lifestyle alignment</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/matchmaker')}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#132238] hover:bg-slate-100 dark:hover:bg-[#1a2f4a] text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-[#1e3553] shadow-xs"
              >
                <span>Launch Matchmaker</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              </button>
            </div>

            {/* Service 2: Designer */}
            <div className="bg-slate-50 dark:bg-[#0e1b2e] rounded-2xl border border-slate-200 dark:border-[#1b2f4a] p-6 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-xs dark:shadow-md">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Property Designer</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Upload room photos or test sample listings to visualize Scandinavian warmth, Japandi, or minimalist renovations with architectural palettes.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Before / after renovation concept view</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Material palettes & lighting guides</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/designer')}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#132238] hover:bg-slate-100 dark:hover:bg-[#1a2f4a] text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-[#1e3553] shadow-xs"
              >
                <span>Explore Designer</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              </button>
            </div>

            {/* Service 3: AI Connect */}
            <div className="bg-slate-50 dark:bg-[#0e1b2e] rounded-2xl border border-slate-200 dark:border-[#1b2f4a] p-6 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-xs dark:shadow-md">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Connect Direct Access</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Communicate directly with verified sellers and listing agents without middleman markup. Transparent 7, 30, and 90-day access passes.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Time-limited verified messaging passes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-700 dark:text-slate-300">Direct chat with listing owners</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/connect')}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#132238] hover:bg-slate-100 dark:hover:bg-[#1a2f4a] text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-[#1e3553] shadow-xs"
              >
                <span>View Connection Plans</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BROWSE BY ARCHITECTURAL CATEGORY
          ========================================================================= */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Browse by Architectural Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/properties?type=${cat.id}`)}
                className="bg-white dark:bg-[#0e1b2e] p-5 rounded-2xl border border-slate-200 dark:border-[#1b2f4a] hover:border-teal-500/50 hover:shadow-md text-left transition-all cursor-pointer group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#132238] text-slate-600 dark:text-slate-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/60 group-hover:text-teal-600 dark:group-hover:text-teal-400 flex items-center justify-center mb-3 transition-colors border border-slate-200 dark:border-[#1c304d]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">{cat.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.count}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          DUAL CTA: BUYERS & SELLERS
          ========================================================================= */}
      <section className="py-14 bg-slate-100 dark:bg-[#09121f] border-t border-slate-200 dark:border-[#152438]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0e1b2e] border border-slate-200 dark:border-[#1b2f4a] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">For Buyers & Investors</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-3">Find a Home That Fits Your Exact Budget</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Save time filtering thousands of irrelevant listings. Use our AI Matchmaker preference questionnaire to pinpoint properties that match your commute and lifestyle requirements.
                </p>
              </div>
              <button
                onClick={() => navigate('/matchmaker')}
                className="w-full sm:w-auto self-start px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Start Matchmaker Questionnaire
              </button>
            </div>

            {/* For Sellers */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0e1b2e] border border-slate-200 dark:border-[#1b2f4a] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">For Property Owners & Brokers</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-3">List Your Space to High-Intent Buyers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Create rich property records with photos, specifications, and amenity tags. Manage inquiries directly through the Seller Studio with live status indicators.
                </p>
              </div>
              <button
                onClick={() => navigate('/seller/properties/new')}
                className="w-full sm:w-auto self-start px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Create a Free Listing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

