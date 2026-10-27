package com.example.propertypartner.ui.navigation

sealed class Screen(val route: String, val title: String) {
    object Home : Screen("home", "Home")
    object Properties : Screen("properties", "Explore")
    object PropertyDetail : Screen("property_detail/{propertyId}", "Property Details") {
        fun createRoute(propertyId: String) = "property_detail/$propertyId"
    }
    object Matchmaker : Screen("matchmaker", "AI Matchmaker")
    object Designer : Screen("designer", "AI Designer")
    object Connect : Screen("connect", "AI Connect")
    object Saved : Screen("saved", "Saved")
    object Compare : Screen("compare", "Compare")
    object Messages : Screen("messages", "Messages")
    object ChatDetail : Screen("chat_detail/{conversationId}", "Chat") {
        fun createRoute(conversationId: String) = "chat_detail/$conversationId"
    }
    object SellerPortal : Screen("seller_portal", "Seller Studio")
    object Profile : Screen("profile", "Profile")
    object Admin : Screen("admin", "Admin Moderation")
}
