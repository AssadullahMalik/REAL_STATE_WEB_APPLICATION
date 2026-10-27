import { Property, ConnectionPlan, Conversation, DesignConcept, User } from '../types';
import { hashPassword } from '../utils/storage';

/**
 * Starter credential for the bundled sample accounts. The value itself is not
 * stored — only its digest is — and it is shown to developers in the sign-in
 * shortcuts, which are compiled out of production builds.
 */
export const SAMPLE_ACCOUNT_PASSWORD = 'password123';

const SAMPLE_USER_RECORDS: User[] = [
  {
    id: 'user-buyer-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'buyer',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Software engineer looking for a contemporary home or condo with dedicated office space.',
    createdAt: '2026-01-15',
  },
  {
    id: 'user-seller-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexrealty.com',
    role: 'agent',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    agency: 'Vance & Co. Luxury Real Estate',
    bio: 'Licensed broker specializing in modern residential architecture and prime urban properties for 12+ years.',
    createdAt: '2025-08-20',
  },
  {
    id: 'user-seller-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@premierestates.com',
    role: 'seller',
    phone: '+1 (555) 345-9876',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    agency: 'Private Owner',
    bio: 'Architect and property developer focused on biophilic design and carbon-neutral homes.',
    createdAt: '2025-11-10',
  },
  {
    id: 'user-admin-1',
    name: 'Dr. Evelyn Reed',
    email: 'admin@propertypartner.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bio: 'System Administrator — platform moderation and account oversight.',
    createdAt: '2025-01-01',
  }
];

export const INITIAL_USERS: User[] = SAMPLE_USER_RECORDS.map((u) => ({
  ...u,
  passwordHash: hashPassword(SAMPLE_ACCOUNT_PASSWORD)
}));

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Maple Luxury Villa',
    description: 'Masterfully crafted contemporary sanctuary boasting floor-to-ceiling glass walls, integrated Lutron smart automation, terrazzo flooring, and private heated pool. Complete with custom chef kitchen and high-efficiency geothermal climate control.',
    price: 850000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '123 Maple Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      neighborhood: 'Downtown Austin'
    },
    areaSqFt: 2800,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2023,
    parkingSpaces: 2,
    amenities: [
      'Private Pool',
      'EV Charger',
      'Smart Home Automation',
      'Solar Panel Array',
      'Chef Kitchen',
      'Private Terrace',
      'Home Gym',
      'Fiber Internet'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 1420,
    inquiriesCount: 18,
    createdAt: '2026-02-10',
    updatedAt: '2026-03-01'
  },
  {
    id: 'prop-2',
    title: 'Park Avenue Coastal Residences',
    description: 'Breathtaking high-floor residence framing panoramic unobstructed bay and skyline panoramas. Features private elevator vestibule, wrap-around sunset loggia, Calacatta marble waterfall island, and 24/7 concierge service.',
    price: 2500,
    currency: '$',
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '456 Park Avenue',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      neighborhood: 'Downtown Miami'
    },
    areaSqFt: 1200,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2022,
    parkingSpaces: 1,
    amenities: [
      'Concierge 24/7',
      'Rooftop Pool',
      'Private Elevator',
      'Balcony',
      'Valet Parking',
      'Sauna & Steam Room',
      'High-Speed Elevators',
      'Pet Spa'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 2190,
    inquiriesCount: 27,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-15'
  },
  {
    id: 'prop-3',
    title: 'Oak Drive Pacific Craftsman',
    description: 'Impeccably designed Craftsman residence blending natural timber architecture with modern Scandinavian minimalist interiors. Wide-plank white oak flooring, skylit reading atrium, custom walnut cabinetry, and lush garden.',
    price: 620000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '789 Oak Drive',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      neighborhood: 'Queen Anne'
    },
    areaSqFt: 1950,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2020,
    parkingSpaces: 2,
    amenities: [
      'Garden / Yard',
      'Fireplace',
      'Energy Star Rated',
      'Hardwood Floors',
      'Deck with Lake View',
      'Smart Thermostat'
    ],
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 980,
    inquiriesCount: 14,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-28'
  },
  {
    id: 'prop-4',
    title: 'Pine Lane Skyline Terrace Loft',
    description: 'Chic designer residence with panoramic floor-to-ceiling windows, modern open layout, acoustic glazing, Italian porcelain tiles, and full access to community rooftop deck and concierge.',
    price: 3200,
    currency: '$',
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '321 Pine Lane',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      neighborhood: 'Chelsea'
    },
    areaSqFt: 1100,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2021,
    parkingSpaces: 0,
    amenities: [
      'Panoramic Terrace',
      'Direct Elevator Access',
      'High Ceilings',
      'In-Unit Laundry',
      'Central AC',
      'Concierge',
      'Pet Friendly'
    ],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b81b37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 1120,
    inquiriesCount: 12,
    createdAt: '2026-02-14',
    updatedAt: '2026-03-02'
  },
  {
    id: 'prop-5',
    title: 'The Tribeca Cast-Iron Loft',
    description: 'Iconic authentic Tribeca loft with 13-foot timber beamed ceilings, cast-iron fluted columns, oversized south-facing industrial sash windows, poured concrete countertops, and dedicated freight-elevator access. Ideal live/work creative haven.',
    price: 7800,
    currency: '$',
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '68 Franklin Street, Floor 3',
      city: 'New York',
      state: 'NY',
      zip: '10013',
      neighborhood: 'Tribeca'
    },
    areaSqFt: 2200,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1910,
    parkingSpaces: 0,
    amenities: [
      'High Ceilings',
      'Direct Elevator Access',
      'Exposed Brick',
      'In-Unit Laundry',
      'Central AC',
      'Storage Unit',
      'Pet Friendly'
    ],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b81b37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 1650,
    inquiriesCount: 22,
    createdAt: '2026-02-18',
    updatedAt: '2026-03-04'
  },
  {
    id: 'prop-6',
    title: 'Sonoran Desert Minimalist Estate',
    description: 'Architectural masterpiece constructed from rammed earth and weathered steel, seamlessly integrated into the natural desert boulder landscape. Features cantilevered shaded ramadas, negative-edge pool, private stargazing roof terrace, and native xeriscape gardens.',
    price: 1680000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '9120 E Mirabel Way',
      city: 'Scottsdale',
      state: 'AZ',
      zip: '85262',
      neighborhood: 'North Scottsdale'
    },
    areaSqFt: 3800,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 2021,
    parkingSpaces: 3,
    amenities: [
      'Rammed Earth Walls',
      'Desert Infinity Pool',
      'Stargazing Deck',
      'Solar Power',
      'Outdoor Kitchen',
      'Gated Community',
      'Golf Course Access'
    ],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 890,
    inquiriesCount: 9,
    createdAt: '2026-01-30',
    updatedAt: '2026-02-25'
  },
  {
    id: 'prop-7',
    title: 'The Highline Urban Studio Residence',
    description: 'Chic designer studio with smart Murphy bed modular system, acoustic double-pane glazing, integrated desk alcove, Italian porcelain tiles, and full access to community co-working lounge, rooftop yoga deck, and bike workshop.',
    price: 3200,
    currency: '$',
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '520 W 28th Street, Apt 5B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      neighborhood: 'Chelsea'
    },
    areaSqFt: 620,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2020,
    parkingSpaces: 0,
    amenities: [
      'Co-Working Lounge',
      'Rooftop Deck',
      'Fitness Center',
      'Bike Storage',
      'Concierge',
      'Keyless Entry'
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 740,
    inquiriesCount: 16,
    createdAt: '2026-02-22',
    updatedAt: '2026-03-05'
  },
  {
    id: 'prop-8',
    title: 'Rocky Mountain Alpine Chalet',
    description: 'Ski-in / ski-out luxury timber residence on the flank of Aspen mountain. Heated stone driveway, double-sided roaring hearth, dry cedar sauna, custom boot warmers, and cathedral windows capturing Mount Sopris at sunrise.',
    price: 3450000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '215 Red Mountain Road',
      city: 'Denver',
      state: 'CO',
      zip: '81611',
      neighborhood: 'Aspen Valley'
    },
    areaSqFt: 4800,
    bedrooms: 5,
    bathrooms: 5.5,
    yearBuilt: 2021,
    parkingSpaces: 3,
    amenities: [
      'Ski Access',
      'Hot Tub',
      'Sauna',
      'Mountain Views',
      'Heated Driveway',
      'Vaulted Ceilings',
      'Wine Cellar',
      'Smart Thermostat'
    ],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: true,
    viewsCount: 3100,
    inquiriesCount: 35,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-12'
  },
  {
    id: 'prop-9',
    title: 'Silicon Valley Biophilic Smart Residence',
    description: 'LEED Platinum verified home engineered for tech leaders. Features fully automated Tesla solar roof with dual Powerwalls, circadian smart lighting, indoor living plant wall, acoustic isolation podcast studio, and Japanese Zen garden.',
    price: 2450000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '420 University Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94301',
      neighborhood: 'Palo Alto North'
    },
    areaSqFt: 3400,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 2024,
    parkingSpaces: 2,
    amenities: [
      'Tesla Powerwall',
      'Podcast Studio',
      'Zen Garden',
      'Circadian Lighting',
      'Air Purification System',
      'Smart Security',
      'Home Office'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 1540,
    inquiriesCount: 19,
    createdAt: '2026-02-05',
    updatedAt: '2026-03-01'
  },
  {
    id: 'prop-10',
    title: 'Downtown Chicago Riverwalk Condo',
    description: 'Sleek luxury residence directly hovering over the Chicago River. Floor-to-ceiling glass curved facade, Italian Snaidero kitchen, custom walk-in closets, automated blackout blinds, and five-star fitness and aquatic center.',
    price: 4500,
    currency: '$',
    listingType: 'rent',
    propertyType: 'condo',
    location: {
      address: '333 E Wacker Drive, #2404',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      neighborhood: 'The Loop'
    },
    areaSqFt: 1450,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2019,
    parkingSpaces: 1,
    amenities: [
      'River Views',
      'Indoor Lap Pool',
      'Doorman 24/7',
      'Dry Cleaning Valet',
      'Sky Lounge',
      'Business Center'
    ],
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 680,
    inquiriesCount: 8,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-27'
  },
  {
    id: 'prop-11',
    title: 'The Hillside Panoramic Plot (Permitted)',
    description: 'Prime shovel-ready residential hillside parcel offering 180-degree unobstructed sunset views across the Pacific Ocean. Fully permitted with approved architectural plans by renowned studio for a 4,500 sq ft contemporary cantilevered villa.',
    price: 680000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'land',
    location: {
      address: '880 Ocean Vista Way',
      city: 'San Diego',
      state: 'CA',
      zip: '92037',
      neighborhood: 'La Jolla'
    },
    areaSqFt: 18500,
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: 2026,
    parkingSpaces: 0,
    amenities: [
      'Ocean Views',
      'Approved Plans',
      'Utilities at Street',
      'Geotechnical Cleared',
      'Private Cul-de-sac'
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 420,
    inquiriesCount: 5,
    createdAt: '2026-02-25',
    updatedAt: '2026-03-06'
  },
  {
    id: 'prop-12',
    title: 'Modern Creative Studio & Retail HQ',
    description: 'Exceptional mixed-use commercial flagship building in the bustling arts corridor. Features open-plan flexible co-working gallery, barista coffee counter, dedicated loading bay, and rooftop terrace designed for company showcases.',
    price: 12000,
    currency: '$',
    listingType: 'rent',
    propertyType: 'commercial',
    location: {
      address: '144 S 2nd Street',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      neighborhood: 'South Congress'
    },
    areaSqFt: 5200,
    bedrooms: 0,
    bathrooms: 4,
    yearBuilt: 2022,
    parkingSpaces: 6,
    amenities: [
      'High Ceilings',
      'Loading Dock',
      'Showroom Window',
      'Rooftop Terrace',
      'Fiber Commercial Backbone',
      'HVAC Zoned'
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-1',
    sellerName: 'Marcus Vance',
    sellerRole: 'agent',
    sellerPhone: '+1 (555) 876-5432',
    sellerEmail: 'marcus.vance@apexrealty.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'published',
    featured: false,
    viewsCount: 1300,
    inquiriesCount: 11,
    createdAt: '2026-01-28',
    updatedAt: '2026-02-18'
  },
  {
    id: 'prop-13',
    title: 'Architectural Prairie Modern Residence',
    description: 'Submission pending moderation review: custom organic low-slung prairie residence with cantilevered roofs and continuous ribbon windows facing native oak groves.',
    price: 1150000,
    currency: '$',
    listingType: 'sale',
    propertyType: 'house',
    location: {
      address: '512 Oak Grove Lane',
      city: 'Austin',
      state: 'TX',
      zip: '78703',
      neighborhood: 'Tarrytown'
    },
    areaSqFt: 3100,
    bedrooms: 3,
    bathrooms: 3,
    yearBuilt: 2023,
    parkingSpaces: 2,
    amenities: ['Pool', 'Solar', 'Home Office', 'Hardwood'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-seller-2',
    sellerName: 'Elena Rostova',
    sellerRole: 'seller',
    sellerPhone: '+1 (555) 345-9876',
    sellerEmail: 'elena.rostova@premierestates.com',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'pending',
    featured: false,
    viewsCount: 120,
    inquiriesCount: 0,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01'
  }
];

export const CONNECTION_PLANS: ConnectionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic Explorer',
    tagline: 'Ideal for prospective buyers touring a few select properties.',
    price: 19,
    currency: '$',
    durationDays: 7,
    maxChats: 5,
    features: [
      '7 days full platform messaging access',
      'Direct inquiries on up to 5 properties',
      'Real-time message read receipts',
      'Automated tour request scheduler',
      'Standard seller response window'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Pro Partner Pass',
    tagline: 'Most popular for active buyers ready to make an informed offer.',
    price: 39,
    currency: '$',
    durationDays: 30,
    maxChats: 'unlimited',
    badge: 'Recommended',
    popular: true,
    features: [
      '30 days unlimited buyer-seller messaging',
      'Unlimited property conversations',
      'Priority verified inquiry badge on seller inbox',
      'Direct phone & email unlock after seller accept',
      'Export chat history & inspection document exchange',
      'AI Property Matchmaker priority alerts'
    ]
  },
  {
    id: 'plan-investor',
    name: 'Investor & Relocation',
    tagline: 'Comprehensive access for serious portfolio investors and cross-city relocations.',
    price: 89,
    currency: '$',
    durationDays: 90,
    maxChats: 'unlimited',
    badge: 'Extended Value',
    features: [
      '90 days continuous messaging access',
      'Unlimited property conversations across all markets',
      'Instant direct seller & agent contact disclosure',
      'Direct phone consultations booking tool',
      'VIP property notification alerts before public listing',
      'Unlimited AI Property Designer high-res concept exports'
    ]
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    propertyTitle: 'The Solarium Modern Villa',
    propertyPrice: 1850000,
    propertyLocation: 'Austin, TX',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    otherPartyId: 'user-seller-1',
    otherPartyName: 'Marcus Vance',
    otherPartyRole: 'Listing Agent · Vance & Co.',
    otherPartyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'The solar roof offset was 98% last summer. Happy to send the full energy utility disclosures over.',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-buyer-1',
        senderName: 'Alex Rivera',
        senderRole: 'buyer',
        text: 'Hello Marcus, I saw The Solarium Villa and was wondering about the annual HOA fees and solar battery warranty?',
        timestamp: 'Yesterday, 4:15 PM',
        isRead: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-seller-1',
        senderName: 'Marcus Vance',
        senderRole: 'agent',
        text: 'Hi Alex! The Westlake Hills HOA is voluntary at $450/year for park and trail maintenance. The Tesla Powerwalls are under full manufacturer warranty until 2033.',
        timestamp: 'Yesterday, 5:20 PM',
        isRead: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'user-buyer-1',
        senderName: 'Alex Rivera',
        senderRole: 'buyer',
        text: 'That is great news. Would this weekend be feasible for an in-person walkthrough around 2 PM on Saturday?',
        timestamp: 'Today, 9:30 AM',
        isRead: true
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        senderId: 'user-seller-1',
        senderName: 'Marcus Vance',
        senderRole: 'agent',
        text: 'Saturday at 2:00 PM works seamlessly. The solar roof offset was 98% last summer. Happy to send the full energy utility disclosures over.',
        timestamp: 'Today, 10:42 AM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    propertyId: 'prop-2',
    propertyTitle: 'The Bayfront Glass Penthouse',
    propertyPrice: 1250000,
    propertyLocation: 'Miami, FL',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    otherPartyId: 'user-seller-1',
    otherPartyName: 'Marcus Vance',
    otherPartyRole: 'Listing Agent · Vance & Co.',
    otherPartyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Both assigned deeded parking spots include Level 2 EV charging.',
    lastMessageTime: 'Oct 24',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-21',
        conversationId: 'conv-2',
        senderId: 'user-buyer-1',
        senderName: 'Alex Rivera',
        senderRole: 'buyer',
        text: 'Marcus, does the penthouse deed include covered garage spots with electric chargers?',
        timestamp: 'Oct 24, 11:00 AM',
        isRead: true
      },
      {
        id: 'msg-22',
        conversationId: 'conv-2',
        senderId: 'user-seller-1',
        senderName: 'Marcus Vance',
        senderRole: 'agent',
        text: 'Both assigned deeded parking spots include Level 2 EV charging.',
        timestamp: 'Oct 24, 11:34 AM',
        isRead: true
      }
    ]
  }
];

export const INITIAL_DESIGN_CONCEPTS: DesignConcept[] = [
  {
    id: 'concept-1',
    originalImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    transformedImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    propertyType: 'Single Family Home',
    roomArea: 'Living Room',
    designStyle: 'Scandinavian Warmth',
    paletteName: 'Nordic Light & Oatmeal',
    paletteHexes: ['#F5F5F0', '#D6CEBE', '#A69B89', '#4E4941'],
    userNotes: 'Open up the dark corner, install acoustic wood slat paneling, and maximize natural afternoon illumination.',
    architecturalOverview: 'Replacement of bulky dark cabinetry with floating quarter-sawn white oak storage, continuous fluted vertical acoustic slats, and soft cove LED perimeter lighting.',
    keyEnhancements: [
      'Installed floor-to-ceiling slatted oak acoustic accent feature',
      'Replaced recessed halogen cans with 2700K indirect perimeter LED channel',
      'Integrated floating bouclé bench seat with concealed storage drawers',
      'Optimized natural cross-ventilation flow toward patio sliding glass door'
    ],
    estimatedCostRange: '$12,000 – $18,500',
    recommendedMaterials: [
      'FSC-Certified Quarter-sawn White Oak',
      'Organic Natural Bouclé Upholstery',
      'Micro-cement Fireplace Surround',
      'Brushed Brass Minimalist Hardware'
    ],
    lightingConcept: 'Layered 3-zone system: indirect perimeter ceiling cove (2700K), magnetic recessed trimless task spots (3000K), and paper-shade sculptural floor lamp.',
    createdAt: '2026-02-28'
  }
];
