package com.example.propertypartner.data.mock

import com.example.propertypartner.data.model.*

object SampleData {
    val sampleUsers = listOf(
        User(
            id = "user-buyer-1",
            name = "Alex Rivera",
            email = "alex.rivera@example.com",
            role = "buyer",
            phone = "+1 (555) 234-5678",
            avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            bio = "Software engineer looking for a contemporary home or condo with dedicated office space."
        ),
        User(
            id = "user-seller-1",
            name = "Marcus Vance",
            email = "marcus.vance@apexrealty.com",
            role = "agent",
            phone = "+1 (555) 876-5432",
            avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            agency = "Vance & Co. Luxury Real Estate",
            bio = "Licensed broker specializing in modern residential architecture and prime urban properties for 12+ years."
        ),
        User(
            id = "user-seller-2",
            name = "Elena Rostova",
            email = "elena.rostova@premierestates.com",
            role = "seller",
            phone = "+1 (555) 345-9876",
            avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
            agency = "Private Owner",
            bio = "Architect and property developer focused on biophilic design and carbon-neutral homes."
        ),
        User(
            id = "user-admin-1",
            name = "Dr. Evelyn Reed",
            email = "admin@propertypartner.internal",
            role = "admin",
            avatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
            bio = "System Administrator — platform moderation and account oversight."
        )
    )

    val sampleProperties = listOf(
        Property(
            id = "prop-1",
            title = "The Solarium Modern Villa",
            description = "Masterfully crafted contemporary sanctuary boasting 14-foot floor-to-ceiling glass walls, integrated Lutron smart automation, terrazzo flooring, and private heated infinity pool overlooking tranquil canyon ridges. Complete with custom Bulthaup kitchen, Miele appliances, and high-efficiency geothermal climate control.",
            price = 1850000.0,
            currency = "$",
            listingType = "sale",
            propertyType = "villa",
            location = PropertyLocation(
                address = "742 Skyline Ridge Way",
                city = "Austin",
                state = "TX",
                zip = "78746",
                neighborhood = "Westlake Hills"
            ),
            areaSqFt = 4250.0,
            bedrooms = 4,
            bathrooms = 4.5,
            yearBuilt = 2023,
            parkingSpaces = 3,
            amenities = listOf(
                "Infinity Pool",
                "EV Charger",
                "Smart Home Automation",
                "Solar Panel Array",
                "Chef Kitchen",
                "Private Terrace",
                "Home Gym",
                "Wine Cellar",
                "Fiber Internet"
            ),
            images = listOf(
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-1",
            sellerName = "Marcus Vance",
            sellerRole = "agent",
            sellerPhone = "+1 (555) 876-5432",
            sellerEmail = "marcus.vance@apexrealty.com",
            sellerAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            status = "published",
            featured = true,
            viewsCount = 1420,
            inquiriesCount = 18
        ),
        Property(
            id = "prop-2",
            title = "The Bayfront Glass Penthouse",
            description = "Breathtaking 38th-floor penthouse framing panoramic unobstructed bay and skyline panoramas. Features private elevator vestibule, wrap-around sunset loggia, Calacatta marble waterfall island, motorized solar shades, and 24/7 concierge service in an iconic architectural tower.",
            price = 1250000.0,
            currency = "$",
            listingType = "sale",
            propertyType = "apartment",
            location = PropertyLocation(
                address = "1200 Brickell Bay Drive, PH-38",
                city = "Miami",
                state = "FL",
                zip = "33131",
                neighborhood = "Brickell Financial District"
            ),
            areaSqFt = 2850.0,
            bedrooms = 3,
            bathrooms = 3.0,
            yearBuilt = 2022,
            parkingSpaces = 2,
            amenities = listOf(
                "Concierge 24/7",
                "Rooftop Pool",
                "Private Elevator",
                "Balcony",
                "Valet Parking",
                "Sauna & Steam Room",
                "High-Speed Elevators",
                "Pet Spa"
            ),
            images = listOf(
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-1",
            sellerName = "Marcus Vance",
            sellerRole = "agent",
            sellerPhone = "+1 (555) 876-5432",
            sellerEmail = "marcus.vance@apexrealty.com",
            status = "published",
            featured = true,
            viewsCount = 980,
            inquiriesCount = 12
        ),
        Property(
            id = "prop-3",
            title = "Seaside Mid-Century Haven",
            description = "Tranquil coastal residence with exposed cedar beams, expansive terrazzo terrace, Japanese-inspired rock garden, and direct pathway to beach coves.",
            price = 945000.0,
            currency = "$",
            listingType = "sale",
            propertyType = "house",
            location = PropertyLocation(
                address = "320 Coast Boulevard",
                city = "San Diego",
                state = "CA",
                zip = "92037",
                neighborhood = "La Jolla"
            ),
            areaSqFt = 2400.0,
            bedrooms = 3,
            bathrooms = 2.5,
            yearBuilt = 2020,
            parkingSpaces = 2,
            amenities = listOf("Ocean View", "Private Garden", "Fire Pit", "Solar Power", "Hardwood Floors"),
            images = listOf(
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-2",
            sellerName = "Elena Rostova",
            sellerRole = "seller",
            sellerPhone = "+1 (555) 345-9876",
            sellerEmail = "elena.rostova@premierestates.com",
            status = "published",
            featured = false,
            viewsCount = 750,
            inquiriesCount = 9
        ),
        Property(
            id = "prop-4",
            title = "Urban Loft at River Point",
            description = "Industrial-chic multi-level loft boasting 18ft ceilings, polished concrete floors, steel-frame casement windows, and custom walnut cabinetry overlooking the skyline.",
            price = 4200.0,
            currency = "$",
            listingType = "rent",
            propertyType = "apartment",
            location = PropertyLocation(
                address = "500 N Canal Street, Apt 7B",
                city = "Chicago",
                state = "IL",
                zip = "60654",
                neighborhood = "Fulton Market"
            ),
            areaSqFt = 1600.0,
            bedrooms = 2,
            bathrooms = 2.0,
            yearBuilt = 2021,
            parkingSpaces = 1,
            amenities = listOf("City Skyline View", "Doorman", "Gym", "In-Unit Laundry", "Bicycle Storage"),
            images = listOf(
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-1",
            sellerName = "Marcus Vance",
            sellerRole = "agent",
            status = "published",
            featured = false,
            viewsCount = 540,
            inquiriesCount = 6
        ),
        Property(
            id = "prop-5",
            title = "The Hillside Panoramic Plot (Permitted)",
            description = "Prime shovel-ready residential hillside parcel offering 180-degree unobstructed sunset views across the Pacific Ocean. Fully permitted with approved architectural plans.",
            price = 680000.0,
            currency = "$",
            listingType = "sale",
            propertyType = "land",
            location = PropertyLocation(
                address = "880 Ocean Vista Way",
                city = "San Diego",
                state = "CA",
                zip = "92037",
                neighborhood = "La Jolla"
            ),
            areaSqFt = 18500.0,
            bedrooms = 0,
            bathrooms = 0.0,
            yearBuilt = 2026,
            parkingSpaces = 0,
            amenities = listOf("Ocean Views", "Approved Plans", "Utilities at Street", "Geotechnical Cleared"),
            images = listOf(
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-2",
            sellerName = "Elena Rostova",
            sellerRole = "seller",
            status = "published",
            featured = false,
            viewsCount = 420,
            inquiriesCount = 5
        ),
        Property(
            id = "prop-6",
            title = "Architectural Prairie Modern Residence",
            description = "Submission pending moderation review: custom organic low-slung prairie residence with cantilevered roofs and continuous ribbon windows facing native oak groves.",
            price = 1150000.0,
            currency = "$",
            listingType = "sale",
            propertyType = "house",
            location = PropertyLocation(
                address = "512 Oak Grove Lane",
                city = "Austin",
                state = "TX",
                zip = "78703",
                neighborhood = "Tarrytown"
            ),
            areaSqFt = 3100.0,
            bedrooms = 3,
            bathrooms = 3.0,
            yearBuilt = 2023,
            parkingSpaces = 2,
            amenities = listOf("Pool", "Solar", "Home Office", "Hardwood"),
            images = listOf(
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            ),
            sellerId = "user-seller-2",
            sellerName = "Elena Rostova",
            sellerRole = "seller",
            status = "pending",
            featured = false,
            viewsCount = 120,
            inquiriesCount = 1
        )
    )

    val connectionPlans = listOf(
        ConnectionPlan(
            id = "plan-basic",
            name = "Basic Explorer",
            tagline = "Ideal for prospective buyers touring a few select properties.",
            price = 19.0,
            durationDays = 7,
            maxChats = "5",
            features = listOf(
                "7 days full platform messaging access",
                "Direct inquiries on up to 5 properties",
                "Real-time message read receipts",
                "Automated tour request scheduler",
                "Standard seller response window"
            )
        ),
        ConnectionPlan(
            id = "plan-pro",
            name = "Pro Partner Pass",
            tagline = "Most popular for active buyers ready to make an informed offer.",
            price = 39.0,
            durationDays = 30,
            maxChats = "unlimited",
            badge = "Recommended",
            popular = true,
            features = listOf(
                "30 days unlimited buyer-seller messaging",
                "Unlimited property conversations",
                "Priority verified inquiry badge on seller inbox",
                "Direct phone & email unlock after seller accept",
                "Export chat history & inspection document exchange",
                "AI Property Matchmaker priority alerts"
            )
        ),
        ConnectionPlan(
            id = "plan-investor",
            name = "Investor & Relocation",
            tagline = "Comprehensive access for serious portfolio investors.",
            price = 89.0,
            durationDays = 90,
            maxChats = "unlimited",
            badge = "Extended Value",
            features = listOf(
                "90 days continuous messaging access",
                "Unlimited property conversations across all markets",
                "Instant direct seller & agent contact disclosure",
                "Direct phone consultations booking tool",
                "VIP property notification alerts before public listing",
                "Unlimited AI Property Designer concept exports"
            )
        )
    )

    val sampleConversations = listOf(
        Conversation(
            id = "conv-1",
            propertyId = "prop-1",
            propertyTitle = "The Solarium Modern Villa",
            propertyPrice = 1850000.0,
            propertyLocation = "Austin, TX",
            propertyImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
            otherPartyId = "user-seller-1",
            otherPartyName = "Marcus Vance",
            otherPartyRole = "Listing Agent · Vance & Co.",
            otherPartyAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            lastMessage = "Saturday at 2:00 PM works seamlessly. Happy to send the full energy utility disclosures over.",
            lastMessageTime = "10:42 AM",
            unreadCount = 1,
            messages = listOf(
                Message(
                    id = "msg-1",
                    conversationId = "conv-1",
                    senderId = "user-buyer-1",
                    senderName = "Alex Rivera",
                    senderRole = "buyer",
                    text = "Hello Marcus, I saw The Solarium Villa and was wondering about the HOA fees and solar battery warranty?",
                    timestamp = "Yesterday, 4:15 PM",
                    isRead = true
                ),
                Message(
                    id = "msg-2",
                    conversationId = "conv-1",
                    senderId = "user-seller-1",
                    senderName = "Marcus Vance",
                    senderRole = "agent",
                    text = "Hi Alex! The Westlake Hills HOA is voluntary at $450/year. The Tesla Powerwalls are under full manufacturer warranty until 2033.",
                    timestamp = "Yesterday, 5:20 PM",
                    isRead = true
                ),
                Message(
                    id = "msg-3",
                    conversationId = "conv-1",
                    senderId = "user-buyer-1",
                    senderName = "Alex Rivera",
                    senderRole = "buyer",
                    text = "That is great news. Would this weekend be feasible for an in-person walkthrough around 2 PM on Saturday?",
                    timestamp = "Today, 9:30 AM",
                    isRead = true
                ),
                Message(
                    id = "msg-4",
                    conversationId = "conv-1",
                    senderId = "user-seller-1",
                    senderName = "Marcus Vance",
                    senderRole = "agent",
                    text = "Saturday at 2:00 PM works seamlessly. Happy to send the full energy utility disclosures over.",
                    timestamp = "Today, 10:42 AM",
                    isRead = false
                )
            )
        )
    )

    val sampleDesignConcepts = listOf(
        DesignConcept(
            id = "concept-1",
            originalImage = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
            transformedImage = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
            propertyType = "Single Family Home",
            roomArea = "Living Room",
            designStyle = "Scandinavian Warmth",
            paletteName = "Nordic Light & Oatmeal",
            paletteHexes = listOf("#F5F5F0", "#D6CEBE", "#A69B89", "#4E4941"),
            userNotes = "Open up the dark corner, install acoustic wood slat paneling, and maximize natural afternoon illumination.",
            architecturalOverview = "Replacement of bulky dark cabinetry with floating quarter-sawn white oak storage, continuous fluted vertical acoustic slats, and soft cove LED perimeter lighting.",
            keyEnhancements = listOf(
                "Installed floor-to-ceiling slatted oak acoustic accent feature",
                "Replaced recessed halogen cans with 2700K indirect perimeter LED channel",
                "Integrated floating bouclé bench seat with concealed storage drawers",
                "Optimized natural cross-ventilation flow toward patio sliding glass door"
            ),
            estimatedCostRange = "$12,000 – $18,500",
            recommendedMaterials = listOf(
                "FSC-Certified Quarter-sawn White Oak",
                "Organic Natural Bouclé Upholstery",
                "Micro-cement Fireplace Surround",
                "Brushed Brass Minimalist Hardware"
            ),
            lightingConcept = "Layered 3-zone system: indirect perimeter ceiling cove (2700K), magnetic recessed trimless task spots (3000K), and paper-shade sculptural floor lamp."
        )
    )
}
