import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyType, ListingType, ListingStatus } from '../types';
import { 
  Building2, 
  Upload, 
  Check, 
  ArrowLeft, 
  AlertCircle, 
  DollarSign, 
  MapPin, 
  Sliders, 
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface SellerAddEditPropertyPageProps {
  editPropertyId?: string;
}

const COMMON_AMENITIES = [
  'Infinity Pool',
  'Private Terrace',
  'EV Charger',
  'Solar Panel Array',
  'Chef Kitchen',
  'Home Gym',
  'Wine Cellar',
  'Fiber Internet',
  'Concierge 24/7',
  'Rooftop Deck',
  'Private Elevator',
  'Sauna & Steam Room',
  'Fireplace',
  'Hardwood Floors',
  'Pet Friendly',
  'Energy Star Rated',
  'High Ceilings',
  'Smart Home Automation'
];

export const SellerAddEditPropertyPage: React.FC<SellerAddEditPropertyPageProps> = ({ editPropertyId }) => {
  const { properties, addProperty, updateProperty, currentUser, navigate } = useApp();

  const existing = editPropertyId ? properties.find((p) => p.id === editPropertyId) : null;

  // Stepper state (progress & closure)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : '750000');
  const [listingType, setListingType] = useState<ListingType>(existing?.listingType || 'sale');
  const [propertyType, setPropertyType] = useState<PropertyType>(existing?.propertyType || 'house');
  
  // Location
  const [address, setAddress] = useState(existing?.location.address || '450 Mountain View Boulevard');
  const [city, setCity] = useState(existing?.location.city || 'Austin');
  const [state, setState] = useState(existing?.location.state || 'TX');
  const [zip, setZip] = useState(existing?.location.zip || '78746');
  const [neighborhood, setNeighborhood] = useState(existing?.location.neighborhood || 'Westlake Hills');

  // Specs
  const [areaSqFt, setAreaSqFt] = useState(existing?.areaSqFt ? String(existing.areaSqFt) : '2800');
  const [bedrooms, setBedrooms] = useState(existing?.bedrooms ? String(existing.bedrooms) : '3');
  const [bathrooms, setBathrooms] = useState(existing?.bathrooms ? String(existing.bathrooms) : '2.5');
  const [yearBuilt, setYearBuilt] = useState(existing?.yearBuilt ? String(existing.yearBuilt) : '2023');
  const [parkingSpaces, setParkingSpaces] = useState(existing?.parkingSpaces ? String(existing.parkingSpaces) : '2');

  // Amenities
  const [amenities, setAmenities] = useState<string[]>(existing?.amenities || ['EV Charger', 'Fiber Internet', 'Chef Kitchen']);

  // Images
  const [images, setImages] = useState<string[]>(
    existing?.images || [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ]
  );
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Unsaved changes warning modal
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Field Touched & Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!title.trim()) {
        newErrors.title = 'Listing title is required.';
      }
      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        newErrors.price = 'Price must be greater than zero.';
      }
      if (!description.trim() || description.trim().length < 20) {
        newErrors.description = 'Please enter a description of at least 20 characters.';
      }
    }

    if (stepNumber === 2) {
      if (!address.trim()) {
        newErrors.address = 'Street address is required.';
      }
      if (!city.trim()) {
        newErrors.city = 'City is required.';
      }
      if (!state.trim()) {
        newErrors.state = 'State / Region is required.';
      }
    }

    if (stepNumber === 3) {
      if (!areaSqFt || isNaN(Number(areaSqFt)) || Number(areaSqFt) <= 0) {
        newErrors.areaSqFt = 'Living area must be greater than zero.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleFinalSubmit = (statusToSet: ListingStatus) => {
    // Validate all steps
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setCurrentStep(1);
      return;
    }

    if (existing) {
      updateProperty(existing.id, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        listingType,
        propertyType,
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
          neighborhood: neighborhood.trim()
        },
        areaSqFt: Number(areaSqFt),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        yearBuilt: Number(yearBuilt),
        parkingSpaces: Number(parkingSpaces),
        amenities,
        images,
        status: statusToSet
      });
      navigate('/seller/properties');
    } else {
      addProperty({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency: '$',
        listingType,
        propertyType,
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
          neighborhood: neighborhood.trim()
        },
        areaSqFt: Number(areaSqFt),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        yearBuilt: Number(yearBuilt),
        parkingSpaces: Number(parkingSpaces),
        amenities,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
        sellerId: currentUser?.id || 'user-seller-1',
        sellerName: currentUser?.name || 'Marcus Vance',
        sellerRole: currentUser?.role === 'seller' ? 'seller' : 'agent',
        sellerPhone: currentUser?.phone || '+1 (555) 876-5432',
        sellerEmail: currentUser?.email || 'agent@propertypartner.internal',
        sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: statusToSet,
        featured: false
      });
      navigate('/seller/properties');
    }
  };

  const steps = [
    { num: 1, label: 'Overview & Price' },
    { num: 2, label: 'Location' },
    { num: 3, label: 'Specs & Amenities' },
    { num: 4, label: 'Photos & Publish' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDiscardModal(true)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Inventory</span>
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {existing ? `Edit Listing: ${existing.title}` : 'Create a New Property Listing'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Follow the 4 guided steps to publish your architectural space to qualified buyers.
          </p>
        </div>

        {/* Multi-Step Progress Indicator (Shneiderman Rule 3 & 8) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep || validateStep(currentStep)) {
                      setCurrentStep(s.num);
                    }
                  }}
                  className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer border ${
                    isCurrent
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300'
                      : isDone
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      : 'border-transparent text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-teal-600 text-white'
                        : isDone
                        ? 'bg-slate-900 dark:bg-slate-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isDone ? '✓' : s.num}
                    </span>
                    <span className="text-xs font-bold truncate hidden sm:inline">{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          {/* STEP 1: Overview & Price */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Step 1: Property Overview & Valuation
              </h2>

              <div>
                <label htmlFor="prop-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Listing Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="prop-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g. Modern Minimalist Hillside Villa"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                    errors.title ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-medium cursor-pointer"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Architectural Category
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-medium cursor-pointer"
                  >
                    <option value="house">Single Family House</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial Loft</option>
                    <option value="land">Permitted Land</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prop-price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Valuation Price ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      id="prop-price"
                      type="number"
                      min="1"
                      step="1000"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-medium focus:outline-none focus:ring-2 text-slate-900 dark:text-white ${
                        errors.price ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.price}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="prop-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Narrative Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prop-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Describe structural features, light orientation, materials, appliances, and neighborhood atmosphere..."
                  className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                    errors.description ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  <span>Minimum 20 characters</span>
                  <span>{description.length} characters</span>
                </div>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Step 2: Location & Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prop-address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prop-address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="e.g. 742 Skyline Ridge Way"
                    className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      errors.address ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Neighborhood / District
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Westlake Hills"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="prop-city" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prop-city"
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="e.g. Austin"
                    className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      errors.city ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="prop-state" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State / Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prop-state"
                      type="text"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                      }}
                      placeholder="TX"
                      className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        errors.state ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="78746"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Specs & Amenities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Step 3: Specifications & Amenities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label htmlFor="prop-area" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Living Area (sq ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prop-area"
                    type="number"
                    min="50"
                    value={areaSqFt}
                    onChange={(e) => {
                      setAreaSqFt(e.target.value);
                      if (errors.areaSqFt) setErrors((prev) => ({ ...prev, areaSqFt: '' }));
                    }}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-medium text-slate-900 dark:text-white ${
                      errors.areaSqFt ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {errors.areaSqFt && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.areaSqFt}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Year Built</label>
                  <input
                    type="number"
                    min="1800"
                    max="2030"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parking</label>
                  <input
                    type="number"
                    min="0"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Included Amenities ({amenities.length} selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((item) => {
                    const checked = amenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                          checked
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <span>{item}</span>
                        {checked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Photos & Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Step 4: Photography & Final Review
              </h2>

              {/* Photos management */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Property Gallery ({images.length} images)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                      <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-md transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Add photograph URL..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white dark:text-slate-950 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    + Add Photo
                  </button>
                </div>
              </div>

              {/* Summary Card before confirmation (Shneiderman Rule 4: Yield Closure) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">
                  Listing Summary Review
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-300">
                  <div><strong>Title:</strong> {title}</div>
                  <div><strong>Price:</strong> ${Number(price).toLocaleString()}</div>
                  <div><strong>Location:</strong> {city}, {state}</div>
                  <div><strong>Area:</strong> {Number(areaSqFt).toLocaleString()} sq ft</div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowDiscardModal(true)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel & Discard
            </button>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit('draft')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit('published')}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {existing ? 'Update Listing' : 'Publish Listing'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Discard Warning Modal (Shneiderman Rule 6 & Part 12) */}
      {showDiscardModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Discard Unsaved Changes?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You have entered property details. If you leave now without saving a draft or publishing, your changes will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardModal(false);
                  navigate('/seller/properties');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
