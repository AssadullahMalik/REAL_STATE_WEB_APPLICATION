package com.example.propertypartner.data.repository

import com.example.propertypartner.data.mock.SampleData
import com.example.propertypartner.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.NumberFormat
import java.util.Locale
import java.util.UUID

class PropertyRepository {
    private val _properties = MutableStateFlow<List<Property>>(SampleData.sampleProperties)
    val properties: StateFlow<List<Property>> = _properties.asStateFlow()

    private val _users = MutableStateFlow<List<User>>(SampleData.sampleUsers)
    val users: StateFlow<List<User>> = _users.asStateFlow()

    private val _currentUser = MutableStateFlow(SampleData.sampleUsers.first())
    val currentUser: StateFlow<User> = _currentUser.asStateFlow()

    private val _savedIds = MutableStateFlow<Set<String>>(setOf("prop-1", "prop-3"))
    val savedIds: StateFlow<Set<String>> = _savedIds.asStateFlow()

    private val _compareIds = MutableStateFlow<Set<String>>(setOf("prop-1", "prop-2"))
    val compareIds: StateFlow<Set<String>> = _compareIds.asStateFlow()

    private val _conversations = MutableStateFlow<List<Conversation>>(SampleData.sampleConversations)
    val conversations: StateFlow<List<Conversation>> = _conversations.asStateFlow()

    private val _designConcepts = MutableStateFlow<List<DesignConcept>>(SampleData.sampleDesignConcepts)
    val designConcepts: StateFlow<List<DesignConcept>> = _designConcepts.asStateFlow()

    private val _currency = MutableStateFlow(CurrencyType.USD)
    val currency: StateFlow<CurrencyType> = _currency.asStateFlow()

    private val _areaUnit = MutableStateFlow(AreaUnitType.SQFT)
    val areaUnit: StateFlow<AreaUnitType> = _areaUnit.asStateFlow()

    private val _activeSubscription = MutableStateFlow<ActiveSubscription?>(
        ActiveSubscription(
            id = "sub-1",
            planId = "plan-pro",
            planName = "Pro Partner Pass",
            price = 39.0,
            startDate = "2026-03-01",
            expiryDate = "2026-03-31",
            durationDays = 30,
            isActive = true,
            inquiriesRemaining = "Unlimited"
        )
    )
    val activeSubscription: StateFlow<ActiveSubscription?> = _activeSubscription.asStateFlow()

    fun switchUserRole(role: UserRole) {
        val target = _users.value.firstOrNull { it.role.equals(role.name, ignoreCase = true) }
            ?: User(
                id = "user-${role.name.lowercase()}",
                name = "${role.label} User",
                email = "${role.name.lowercase()}@propertypartner.internal",
                role = role.name.lowercase()
            )
        _currentUser.value = target
    }

    fun toggleFavorite(propertyId: String) {
        val current = _savedIds.value
        _savedIds.value = if (current.contains(propertyId)) current - propertyId else current + propertyId
    }

    fun isFavorite(propertyId: String): Boolean = _savedIds.value.contains(propertyId)

    fun toggleCompare(propertyId: String) {
        val current = _compareIds.value
        _compareIds.value = if (current.contains(propertyId)) {
            current - propertyId
        } else {
            if (current.size >= 4) current else current + propertyId
        }
    }

    fun isInCompare(propertyId: String): Boolean = _compareIds.value.contains(propertyId)

    fun clearCompare() {
        _compareIds.value = emptySet()
    }

    fun setCurrency(c: CurrencyType) {
        _currency.value = c
    }

    fun setAreaUnit(u: AreaUnitType) {
        _areaUnit.value = u
    }

    fun formatPrice(amountUsd: Double, listingType: String = "sale"): String {
        val isRent = listingType.equals("rent", ignoreCase = true)
        val rate = if (_currency.value == CurrencyType.PKR) 278.0 else 1.0
        val finalAmount = amountUsd * rate
        val formatter = NumberFormat.getNumberInstance(Locale.US).apply {
            maximumFractionDigits = 0
        }
        val symbol = _currency.value.symbol
        val suffix = if (isRent) "/mo" else ""
        return "$symbol${formatter.format(finalAmount)}$suffix"
    }

    fun formatArea(areaSqFt: Double): String {
        return if (_areaUnit.value == AreaUnitType.MARLA) {
            val marla = areaSqFt / 225.0
            String.format(Locale.US, "%.1f marla", marla)
        } else {
            val formatter = NumberFormat.getNumberInstance(Locale.US).apply { maximumFractionDigits = 0 }
            "${formatter.format(areaSqFt)} sq ft"
        }
    }

    fun addProperty(property: Property) {
        _properties.value = listOf(property) + _properties.value
    }

    fun updateProperty(property: Property) {
        _properties.value = _properties.value.map { if (it.id == property.id) property else it }
    }

    fun deleteProperty(propertyId: String) {
        _properties.value = _properties.value.filter { it.id != propertyId }
    }

    fun updatePropertyStatus(propertyId: String, status: String) {
        _properties.value = _properties.value.map {
            if (it.id == propertyId) it.copy(status = status) else it
        }
    }

    fun sendMessage(conversationId: String, text: String) {
        val current = _currentUser.value
        val newMsg = Message(
            id = "msg-${UUID.randomUUID()}",
            conversationId = conversationId,
            senderId = current.id,
            senderName = current.name,
            senderRole = current.role,
            text = text,
            timestamp = "Just now",
            isRead = true
        )
        _conversations.value = _conversations.value.map { conv ->
            if (conv.id == conversationId) {
                conv.copy(
                    lastMessage = text,
                    lastMessageTime = "Just now",
                    messages = conv.messages + newMsg
                )
            } else conv
        }
    }

    fun createOrOpenConversation(property: Property, initialMsg: String? = null): String {
        val existing = _conversations.value.firstOrNull { it.propertyId == property.id }
        if (existing != null) {
            if (!initialMsg.isNullOrBlank()) {
                sendMessage(existing.id, initialMsg)
            }
            return existing.id
        }

        val convId = "conv-${UUID.randomUUID()}"
        val current = _currentUser.value
        val messages = if (!initialMsg.isNullOrBlank()) {
            listOf(
                Message(
                    id = "msg-init",
                    conversationId = convId,
                    senderId = current.id,
                    senderName = current.name,
                    senderRole = current.role,
                    text = initialMsg,
                    timestamp = "Just now",
                    isRead = true
                )
            )
        } else emptyList()

        val newConv = Conversation(
            id = convId,
            propertyId = property.id,
            propertyTitle = property.title,
            propertyPrice = property.price,
            propertyLocation = property.location.city + ", " + property.location.state,
            propertyImage = property.images.firstOrNull() ?: "",
            otherPartyId = property.sellerId,
            otherPartyName = property.sellerName,
            otherPartyRole = if (property.sellerRole == "agent") "Listing Agent" else "Property Owner",
            otherPartyAvatar = property.sellerAvatar,
            lastMessage = initialMsg ?: "Inquiry initiated",
            lastMessageTime = "Just now",
            unreadCount = 0,
            messages = messages
        )
        _conversations.value = listOf(newConv) + _conversations.value
        return convId
    }

    fun purchaseSubscription(plan: ConnectionPlan) {
        _activeSubscription.value = ActiveSubscription(
            id = "sub-${UUID.randomUUID()}",
            planId = plan.id,
            planName = plan.name,
            price = plan.price,
            startDate = "Today",
            expiryDate = "In ${plan.durationDays} days",
            durationDays = plan.durationDays,
            isActive = true,
            inquiriesRemaining = plan.maxChats.replaceFirstChar { it.uppercase() }
        )
    }

    fun cancelSubscription() {
        _activeSubscription.value = null
    }

    fun saveDesignConcept(concept: DesignConcept) {
        _designConcepts.value = listOf(concept) + _designConcepts.value
    }

    fun calculateMatches(prefs: MatchmakerPreferences): List<MatchResult> {
        val published = _properties.value.filter { it.status == "published" }
        return published.map { prop ->
            var score = 100
            val reasons = mutableListOf<String>()
            val relaxed = mutableListOf<String>()

            // Budget
            if (prop.price in prefs.budgetMin..prefs.budgetMax) {
                reasons.add("Fits comfortably within budget (${formatPrice(prop.price)})")
            } else if (prop.price <= prefs.budgetMax * 1.15) {
                score -= 15
                relaxed.add("Slightly over max budget (+15% stretch)")
            } else {
                score -= 35
                relaxed.add("Outside preferred budget range")
            }

            // Listing Type
            if (prop.listingType.equals(prefs.listingType, ignoreCase = true)) {
                reasons.add("Matches ${prefs.listingType.uppercase()} status")
            } else {
                score -= 25
            }

            // Location
            if (prefs.locations.isEmpty() || prefs.locations.any { prop.location.city.contains(it, ignoreCase = true) }) {
                reasons.add("Located in desired city (${prop.location.city})")
            } else {
                score -= 15
                relaxed.add("Alternative location (${prop.location.city})")
            }

            // Property Type
            if (prefs.propertyTypes.isEmpty() || prefs.propertyTypes.any { prop.propertyType.equals(it, ignoreCase = true) }) {
                reasons.add("Property style matches (${prop.propertyType.uppercase()})")
            } else {
                score -= 10
            }

            // Bedrooms
            if (prop.bedrooms >= prefs.minBedrooms) {
                reasons.add("${prop.bedrooms} bedrooms meets criteria (${prefs.minBedrooms}+ requested)")
            } else {
                score -= 15
                relaxed.add("Fewer bedrooms (${prop.bedrooms} vs ${prefs.minBedrooms})")
            }

            // Area
            if (prop.areaSqFt >= prefs.minAreaSqFt) {
                reasons.add("Spacious ${formatArea(prop.areaSqFt)}")
            } else {
                score -= 10
            }

            // Amenities
            val matchedAmenities = prefs.requiredAmenities.filter { req ->
                prop.amenities.any { it.contains(req, ignoreCase = true) }
            }
            if (matchedAmenities.isNotEmpty()) {
                reasons.add("Features: ${matchedAmenities.joinToString(", ")}")
            }

            MatchResult(
                property = prop,
                score = score.coerceIn(40, 99),
                matchingReasons = reasons,
                relaxedCriteria = relaxed
            )
        }.sortedByDescending { it.score }
    }
}
