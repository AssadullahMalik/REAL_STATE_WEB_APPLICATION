import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Heart, 
  SlidersHorizontal, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Car, 
  Check, 
  MessageSquare, 
  Phone, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Send,
  History
} from 'lucide-react';

interface PropertyDetailPageProps {
  propertyId: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { 
    properties, 
    navigate, 
    isFavorite, 
    toggleFavorite, 
    isInCompare, 
    toggleCompare,
    activeSubscription,
    createOrOpenConversation,
    addRecentlyViewed,
    recentlyViewedIds,
    formatPrice,
    formatArea,
    addToast
  } = useApp();

  const property = properties.find((p) => p.id === propertyId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState(
    "Hi, I am interested in this listing and would like to receive the floor plan and verify walkthrough availability."
  );

  // Track as recently viewed
  useEffect(() => {
    if (propertyId) {
      addRecentlyViewed(propertyId);
    }
  }, [propertyId]);

  // Keyboard shortcut: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInquiryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Property Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested real estate listing ID could not be located in the current catalog.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Return to Property Directory
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);
  const formattedPrice = formatPrice(property.price, property.listingType);

  // Handle Share (Shneiderman Rule 7: Internal locus of control)
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Direct listing link copied to clipboard.', 'success');
    } else {
      addToast('Share URL copied to clipboard.', 'info');
    }
  };

  const handleStartInquiry = () => {
    if (!activeSubscription || !activeSubscription.isActive) {
      addToast('An AI Connect subscription pass is required to initiate direct conversations.', 'info');
      navigate('/connect');
      return;
    }

    const conversationId = createOrOpenConversation(property.id, inquiryMessage);
    setInquiryModalOpen(false);
    navigate('/messages');
  };

  // Similar properties in same city or property type
  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.location.city === property.location.city || p.propertyType === property.propertyType) &&
        p.status === 'published'
    )
    .slice(0, 3);

  // Recently viewed properties (excluding this one)
  const recentlyViewedProperties = properties
    .filter((p) => p.id !== property.id && recentlyViewedIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/properties')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Directory</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleCompare(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                inCompare
                  ? 'bg-slate-900 dark:bg-teal-700 text-teal-400 dark:text-white border-slate-900 dark:border-teal-700'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{inCompare ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                favorite
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-600' : ''}`} />
              <span>{favorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="space-y-3">
          {/* Main Large Viewport */}
          <div className="relative aspect-16/9 md:aspect-21/9 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <ImageWithFallback
              src={property.images[selectedImageIndex] || property.images[0]}
              alt={property.title}
              fallbackTitle={property.title}
              className="w-full h-full object-cover"
            />
            {/* Scrim Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  <span>{property.listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                  <span>·</span>
                  <span className="capitalize">{property.propertyType}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-2xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {formattedPrice}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Est. ${(Math.round(property.price / property.areaSqFt)).toLocaleString()} / sq ft
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails Row */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-teal-500 ring-2 ring-teal-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Architectural Specifications Strip */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                  <Bed className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {property.bedrooms > 0 ? property.bedrooms : 'Studio'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Bedrooms</div>
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                  <Bath className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {property.bathrooms}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Bathrooms</div>
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                  <Square className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatArea(property.areaSqFt)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Living Area</div>
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {property.yearBuilt}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Year Built</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">About This Residence</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-400" />
                  <span>Parking: {property.parkingSpaces} vehicles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Listed: {property.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Amenities & Structural Features */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Amenities & Architectural Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                  >
                    <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Designer Redesign Prompt Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Property Designer Available</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Visualize Architectural Renovations for This Space
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Generate instant Scandinavian, Japandi, or minimalist transformation concepts with customized color palettes and cost breakdowns.
                </p>
              </div>
              <button
                onClick={() => navigate('/designer')}
                className="shrink-0 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Try Room Designer
              </button>
            </div>
          </div>

          {/* Sticky Purchase / Inquiry Sidebar Module */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              {/* Contiguous Price & Status */}
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Listing Valuation
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {formattedPrice}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Status: <span className="text-teal-600 dark:text-teal-400 font-bold capitalize">{property.status}</span>
                </div>
              </div>

              {/* Seller / Listing Agent Card */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Represented By
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt={property.sellerName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{property.sellerName}</span>
                      <span title="Verified Seller">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Listing Broker / Owner · Fast Responder
                    </div>
                  </div>
                </div>

                {/* Gated Seller Contact Fields (NFR-SEC-07 & AI Connect Rule) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Direct Phone:</span>
                    </span>
                    {activeSubscription && activeSubscription.isActive ? (
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">{property.sellerPhone}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-mono">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>***-***-****</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Verified Email:</span>
                    </span>
                    {activeSubscription && activeSubscription.isActive ? (
                      <span className="font-semibold text-slate-900 dark:text-white">{property.sellerEmail}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>***@***.com</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Inquiry Action Trigger */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {activeSubscription && activeSubscription.isActive
                      ? 'Contact Seller Directly'
                      : 'Unlock Contact via AI Connect'}
                  </span>
                </button>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 leading-normal">
                  {activeSubscription && activeSubscription.isActive
                    ? `Pass Active: ${activeSubscription.inquiriesRemaining} inquiries remaining.`
                    : 'Requires active AI Connect pass to protect sellers from unsolicited spam.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Similar Properties You May Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((sim) => (
                <PropertyCard key={sim.id} property={sim} compact />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Listings */}
        {recentlyViewedProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Recently Viewed by You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentlyViewedProperties.map((rv) => (
                <PropertyCard key={rv.id} property={rv} compact />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry / Message Starter Modal */}
      {inquiryModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="inquiry-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Inquire about {property.title}
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div>
              <label htmlFor="inquiry-text" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Message to {property.sellerName}
              </label>
              <textarea
                id="inquiry-text"
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* AI Connect status note */}
            {!activeSubscription || !activeSubscription.isActive ? (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                <strong>AI Connect Pass Required:</strong> Direct messaging is protected to eliminate bot spam. You will be redirected to choose a 7, 30, or 90-day connection pass.
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Active pass: <span className="font-semibold text-teal-700 dark:text-teal-400">{activeSubscription.planName}</span> ({activeSubscription.inquiriesRemaining} inquiries remaining).
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStartInquiry}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{activeSubscription && activeSubscription.isActive ? 'Send Message' : 'Proceed to AI Connect'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
