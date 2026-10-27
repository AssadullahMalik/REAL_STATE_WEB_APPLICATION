export type UserRole = 'guest' | 'buyer' | 'seller' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  agency?: string;
  /**
   * Non-reversible digest of the account password. This build has no server,
   * so the digest lives in this browser only; the plaintext is never stored.
   */
  passwordHash?: string;
  createdAt: string;
}

export type PropertyType = 
  | 'house' 
  | 'apartment' 
  | 'condo' 
  | 'villa' 
  | 'townhouse' 
  | 'commercial' 
  | 'land';

export type ListingStatus = 'published' | 'pending' | 'draft' | 'rejected';
export type ListingType = 'sale' | 'rent';

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: ListingType;
  propertyType: PropertyType;
  location: PropertyLocation;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  parkingSpaces: number;
  amenities: string[];
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRole: 'seller' | 'agent';
  sellerPhone?: string;
  sellerEmail?: string;
  sellerAvatar?: string;
  status: ListingStatus;
  featured?: boolean;
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchmakerPreferences {
  budgetMin: number;
  budgetMax: number;
  listingType: ListingType;
  locations: string[];
  propertyTypes: PropertyType[];
  minBedrooms: number;
  minBathrooms: number;
  minAreaSqFt: number;
  requiredAmenities: string[];
}

export interface MatchResult {
  property: Property;
  score: number;
  matchingReasons: string[];
  relaxedCriteria?: string[];
}

export interface DesignConcept {
  id: string;
  originalImage: string;
  transformedImage: string;
  propertyType: string;
  roomArea: string;
  designStyle: string;
  paletteName: string;
  paletteHexes: string[];
  userNotes: string;
  architecturalOverview: string;
  keyEnhancements: string[];
  estimatedCostRange: string;
  recommendedMaterials: string[];
  lightingConcept: string;
  disclaimer?: string;
  createdAt: string;
}

export interface ConnectionPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  durationDays: number;
  maxChats: number | 'unlimited';
  features: string[];
  badge?: string;
  popular?: boolean;
}

export interface ActiveSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  price: number;
  startDate: string;
  expiryDate: string;
  durationDays: number;
  isActive: boolean;
  inquiriesRemaining: number | 'unlimited';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyLocation: string;
  propertyImage: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyRole: string;
  otherPartyAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface InquiryForm {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  preferredTourDate?: string;
  message: string;
}

/**
 * Stored account notification choices. These preferences are persisted per
 * account; delivery depends on a notification service being configured for the
 * deployment.
 */
export interface NotificationPreferences {
  listingResponseAlerts: boolean;
  weeklyMatchRecommendations: boolean;
  productUpdates: boolean;
}
