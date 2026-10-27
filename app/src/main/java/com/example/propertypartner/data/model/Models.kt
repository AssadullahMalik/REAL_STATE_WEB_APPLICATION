package com.example.propertypartner.data.model

import kotlinx.serialization.Serializable

enum class UserRole(val label: String) {
    GUEST("Guest"),
    BUYER("Buyer"),
    SELLER("Seller"),
    AGENT("Agent"),
    ADMIN("Admin")
}

@Serializable
data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val phone: String? = null,
    val avatar: String? = null,
    val bio: String? = null,
    val agency: String? = null,
    val createdAt: String = "2026-01-01"
)

enum class PropertyType(val displayName: String) {
    HOUSE("House"),
    APARTMENT("Apartment"),
    CONDO("Condo"),
    VILLA("Villa"),
    TOWNHOUSE("Townhouse"),
    COMMERCIAL("Commercial"),
    LAND("Land")
}

enum class ListingType(val displayName: String) {
    SALE("For Sale"),
    RENT("For Rent")
}

enum class ListingStatus(val displayName: String) {
    PUBLISHED("Published"),
    PENDING("Pending Review"),
    DRAFT("Draft"),
    REJECTED("Rejected")
}

@Serializable
data class PropertyLocation(
    val address: String,
    val city: String,
    val state: String,
    val zip: String,
    val neighborhood: String? = null
) {
    val fullAddress: String
        get() = if (neighborhood.isNullOrBlank()) "$address, $city, $state $zip" else "$address, $neighborhood, $city, $state"
}

@Serializable
data class Property(
    val id: String,
    val title: String,
    val description: String,
    val price: Double,
    val currency: String = "$",
    val listingType: String, // "sale" or "rent"
    val propertyType: String, // "house", "apartment", "villa", etc.
    val location: PropertyLocation,
    val areaSqFt: Double,
    val bedrooms: Int,
    val bathrooms: Double,
    val yearBuilt: Int,
    val parkingSpaces: Int,
    val amenities: List<String> = emptyList(),
    val images: List<String> = emptyList(),
    val sellerId: String,
    val sellerName: String,
    val sellerRole: String = "agent",
    val sellerPhone: String? = null,
    val sellerEmail: String? = null,
    val sellerAvatar: String? = null,
    val status: String = "published",
    val featured: Boolean = false,
    val viewsCount: Int = 0,
    val inquiriesCount: Int = 0,
    val createdAt: String = "2026-02-01",
    val updatedAt: String = "2026-03-01"
)

data class MatchmakerPreferences(
    val budgetMin: Double = 300000.0,
    val budgetMax: Double = 2000000.0,
    val listingType: String = "sale",
    val locations: List<String> = listOf("Austin", "Miami", "San Diego"),
    val propertyTypes: List<String> = listOf("villa", "house", "apartment"),
    val minBedrooms: Int = 3,
    val minBathrooms: Double = 2.0,
    val minAreaSqFt: Double = 2000.0,
    val requiredAmenities: List<String> = listOf("Pool", "Smart Home Automation")
)

data class MatchResult(
    val property: Property,
    val score: Int,
    val matchingReasons: List<String>,
    val relaxedCriteria: List<String> = emptyList()
)

data class DesignConcept(
    val id: String,
    val originalImage: String,
    val transformedImage: String,
    val propertyType: String,
    val roomArea: String,
    val designStyle: String,
    val paletteName: String,
    val paletteHexes: List<String>,
    val userNotes: String,
    val architecturalOverview: String,
    val keyEnhancements: List<String>,
    val estimatedCostRange: String,
    val recommendedMaterials: List<String>,
    val lightingConcept: String,
    val createdAt: String = "2026-03-01"
)

data class ConnectionPlan(
    val id: String,
    val name: String,
    val tagline: String,
    val price: Double,
    val currency: String = "$",
    val durationDays: Int,
    val maxChats: String, // "5" or "unlimited"
    val features: List<String>,
    val badge: String? = null,
    val popular: Boolean = false
)

data class ActiveSubscription(
    val id: String,
    val planId: String,
    val planName: String,
    val price: Double,
    val startDate: String,
    val expiryDate: String,
    val durationDays: Int,
    val isActive: Boolean,
    val inquiriesRemaining: String
)

data class Message(
    val id: String,
    val conversationId: String,
    val senderId: String,
    val senderName: String,
    val senderRole: String,
    val text: String,
    val timestamp: String,
    val isRead: Boolean = false
)

data class Conversation(
    val id: String,
    val propertyId: String,
    val propertyTitle: String,
    val propertyPrice: Double,
    val propertyLocation: String,
    val propertyImage: String,
    val otherPartyId: String,
    val otherPartyName: String,
    val otherPartyRole: String,
    val otherPartyAvatar: String? = null,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0,
    val messages: List<Message> = emptyList()
)

data class NotificationPreferences(
    val listingResponseAlerts: Boolean = true,
    val weeklyMatchRecommendations: Boolean = true,
    val productUpdates: Boolean = false
)

enum class CurrencyType(val symbol: String, val code: String) {
    USD("$", "USD"),
    PKR("Rs ", "PKR")
}

enum class AreaUnitType(val unitName: String) {
    SQFT("sq ft"),
    MARLA("marla")
}
