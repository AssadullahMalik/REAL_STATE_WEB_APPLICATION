import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyType, ListingType, MatchResult } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Sparkles, 
  Compass, 
  Sliders, 
  Check, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  DollarSign
} from 'lucide-react';

export const MatchmakerPage: React.FC = () => {
  const { properties, navigate } = useApp();

  // Guided Form Preferences
  const [budgetMin, setBudgetMin] = useState<number>(500000);
  const [budgetMax, setBudgetMax] = useState<number>(2500000);
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Austin', 'Miami']);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(['villa', 'house', 'apartment']);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(2000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'EV Charger',
    'Infinity Pool',
    'Home Office'
  ]);

  const [hasSearched, setHasSearched] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const availableCities = ['Austin', 'Miami', 'Boston', 'Seattle', 'New York', 'Scottsdale', 'Denver', 'San Francisco'];
  const allPropertyTypes: { type: PropertyType; label: string }[] = [
    { type: 'house', label: 'Single-Family House' },
    { type: 'villa', label: 'Luxury Villa' },
    { type: 'apartment', label: 'Apartment' },
    { type: 'condo', label: 'Condo' },
    { type: 'townhouse', label: 'Townhouse' },
    { type: 'commercial', label: 'Commercial Loft' },
  ];

  const popularAmenities = [
    'Infinity Pool',
    'EV Charger',
    'Solar Panel Array',
    'Home Gym',
    'Private Terrace',
    'Wine Cellar',
    'Concierge 24/7',
    'High Ceilings',
    'Detached Studio',
    'Mountain Views',
    'Ocean Views'
  ];

  const toggleLocation = (city: string) => {
    setSelectedLocations((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleType = (t: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleMatchCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (budgetMin > budgetMax) {
      setFormError('Minimum budget cannot exceed Maximum budget.');
      return;
    }

    if (selectedLocations.length === 0) {
      setFormError('Please select at least one preferred location.');
      return;
    }

    if (selectedTypes.length === 0) {
      setFormError('Please select at least one property type.');
      return;
    }

    const computedResults: MatchResult[] = [];

    properties
      .filter((p) => p.status === 'published')
      .forEach((prop) => {
        let score = 0;
        const reasons: string[] = [];
        const missing: string[] = [];

        // 1. Listing Type (Sale vs Rent)
        if (prop.listingType !== listingType) {
          return;
        }

        // 2. Budget match (Weight: 30 pts)
        if (prop.price >= budgetMin && prop.price <= budgetMax) {
          score += 30;
          reasons.push(`Priced comfortably at $${prop.price.toLocaleString()} within your $${budgetMin.toLocaleString()} - $${budgetMax.toLocaleString()} budget`);
        } else if (prop.price <= budgetMax * 1.15) {
          score += 15;
          reasons.push(`Slightly above target budget by only ${(Math.round((prop.price - budgetMax) / budgetMax * 100))}%`);
        } else {
          missing.push('Outside target price bracket');
        }

        // 3. Location match (Weight: 25 pts)
        if (selectedLocations.includes(prop.location.city)) {
          score += 25;
          reasons.push(`Located in your preferred market of ${prop.location.city}, ${prop.location.state}`);
        } else {
          missing.push(`Located in ${prop.location.city}`);
        }

        // 4. Property Type match (Weight: 20 pts)
        if (selectedTypes.includes(prop.propertyType)) {
          score += 20;
          reasons.push(`Matches your requested ${prop.propertyType.toUpperCase()} architectural style`);
        } else {
          missing.push(`Is a ${prop.propertyType}`);
        }

        // 5. Bedrooms match (Weight: 15 pts)
        if (prop.bedrooms >= minBedrooms) {
          score += 15;
          reasons.push(`Provides ${prop.bedrooms} bedrooms (meets or exceeds your ${minBedrooms}+ requirement)`);
        } else if (prop.bedrooms > 0) {
          missing.push(`Has ${prop.bedrooms} bedrooms (${minBedrooms} requested)`);
        }

        // 6. Area match (Weight: 10 pts)
        if (prop.areaSqFt >= minAreaSqFt) {
          score += 10;
          reasons.push(`Expansive living space of ${prop.areaSqFt.toLocaleString()} sq ft (above ${minAreaSqFt.toLocaleString()} sq ft goal)`);
        }

        // 7. Amenities bonus (up to 15 bonus pts)
        let matchedAmenitiesCount = 0;
        selectedAmenities.forEach((amenity) => {
          if (prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))) {
            matchedAmenitiesCount++;
          }
        });
        if (matchedAmenitiesCount > 0) {
          score += Math.min(15, matchedAmenitiesCount * 5);
          reasons.push(`Includes ${matchedAmenitiesCount} of your desired lifestyle amenities`);
        }

        // Normalize score up to 98%
        const finalScore = Math.min(99, Math.round((score / 100) * 98));

        if (finalScore >= 40) {
          computedResults.push({
            property: prop,
            score: finalScore,
            matchingReasons: reasons,
            relaxedCriteria: missing
          });
        }
      });

    // Sort by score descending
    computedResults.sort((a, b) => b.score - a.score);

    setMatches(computedResults);
    setHasSearched(true);

    setTimeout(() => {
      const resultsElement = document.getElementById('matchmaker-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            <Compass className="w-3.5 h-3.5" />
            <span>Intelligent Preference Engine</span>
            <span>·</span>
            <span>Explainable Recommendations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Property Matchmaker
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Specify your financial constraints and lifestyle priorities. Our matching algorithm computes objective suitability scores and explains the exact reasoning behind every recommendation.
          </p>
        </div>

        {/* Form & Controls Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleMatchCalculation} className="space-y-8">
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
                {formError}
              </div>
            )}

            {/* Step 1: Transaction Type & Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Transaction Type & Budget Bracket</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Intent</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setListingType('sale')}
                      className={`py-2 rounded-md transition-colors cursor-pointer ${
                        listingType === 'sale'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Buy Residence
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingType('rent')}
                      className={`py-2 rounded-md transition-colors cursor-pointer ${
                        listingType === 'rent'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Lease / Rent
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Budget ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="number"
                      step={listingType === 'rent' ? '200' : '25000'}
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Maximum Budget ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="number"
                      step={listingType === 'rent' ? '200' : '25000'}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Preferred Markets / Cities */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Preferred Metropolitan Markets</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => {
                  const selected = selectedLocations.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleLocation(city)}
                      className={`px-3.5 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${selected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{city}</span>
                      {selected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Architecture & Spatial Size */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Architecture & Minimum Specifications</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Desired Architectural Typologies:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allPropertyTypes.map((pt) => {
                      const selected = selectedTypes.includes(pt.type);
                      return (
                        <button
                          key={pt.type}
                          type="button"
                          onClick={() => toggleType(pt.type)}
                          className={`p-3 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{pt.label}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Minimum Bedrooms: {minBedrooms}+
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={minBedrooms}
                      onChange={(e) => setMinBedrooms(Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      <span>1 Bed</span>
                      <span>3 Beds</span>
                      <span>6+ Beds</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Minimum Living Space: {minAreaSqFt.toLocaleString()} sq ft
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="7500"
                      step="250"
                      value={minAreaSqFt}
                      onChange={(e) => setMinAreaSqFt(Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      <span>500 sq ft</span>
                      <span>3,500 sq ft</span>
                      <span>7,500+ sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Lifestyle Amenities */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Desired Lifestyle Amenities</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {popularAmenities.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-slate-900 dark:bg-teal-600 text-teal-400 dark:text-white border-slate-900 dark:border-teal-600 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-teal-400 dark:text-white" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Deterministic scoring calculates match compatibility without opaque black boxes.</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Property Matches</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Showcase Section */}
        {hasSearched && (
          <div id="matchmaker-results" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recommended Matches ({matches.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scored based on budget compliance, architectural typology, and amenities
                </p>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Modify Preferences</span>
              </button>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-6">
                {matches.map((match, idx) => (
                  <div
                    key={match.property.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 p-6"
                  >
                    {/* Left: Card / Image */}
                    <div className="lg:col-span-5">
                      <PropertyCard property={match.property} compact />
                    </div>

                    {/* Right: Transparent Explanation Breakdown */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Score Banner */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-teal-400 font-extrabold text-sm flex items-center justify-center tabular-nums">
                              {match.score}%
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Match Compatibility
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Algorithm rank #{idx + 1}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                            High Suitability
                          </span>
                        </div>

                        {/* Why it matches */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Why this residence fits your goals:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {match.matchingReasons.map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Trade-offs / Relaxed criteria if any */}
                        {match.relaxedCriteria && match.relaxedCriteria.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                              Points of consideration:
                            </span>
                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              {match.relaxedCriteria.map((crit, cIdx) => (
                                <span key={cIdx} className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                  {crit}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/properties/${match.property.id}`)}
                          className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Full Property Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  No direct matches found for this specific combination
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  We recommend widening your budget parameters by 10-15% or selecting additional metropolitan markets such as Austin or Miami.
                </p>
                <button
                  onClick={() => {
                    setBudgetMax((prev) => prev * 1.25);
                    setSelectedLocations(availableCities.slice(0, 4));
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 text-white text-xs font-semibold rounded-lg"
                >
                  Auto-Relax Criteria & Re-run
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
