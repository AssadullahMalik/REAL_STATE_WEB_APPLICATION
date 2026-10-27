package com.example.propertypartner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.propertypartner.data.model.CurrencyType
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.components.PropertyPartnerTopBar
import com.example.propertypartner.ui.components.RoleSwitcherDialog
import com.example.propertypartner.ui.navigation.Screen
import com.example.propertypartner.ui.screens.*
import com.example.propertypartner.ui.theme.PropertyPartnerTheme

class MainActivity : ComponentActivity() {
    private val repository = PropertyRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PropertyPartnerTheme {
                MainAppScaffold(repository = repository)
            }
        }
    }
}

@Composable
fun MainAppScaffold(repository: PropertyRepository) {
    val currentUser by repository.currentUser.collectAsState()
    val currency by repository.currency.collectAsState()

    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }
    var selectedPropertyId by remember { mutableStateOf<String?>(null) }
    var selectedCategoryFilter by remember { mutableStateOf<String?>(null) }
    var selectedConversationId by remember { mutableStateOf<String?>(null) }
    var showRoleDialog by remember { mutableStateOf(false) }

    // Back button handling
    BackHandler(enabled = currentScreen != Screen.Home) {
        if (selectedConversationId != null) {
            selectedConversationId = null
        } else if (currentScreen is Screen.PropertyDetail) {
            currentScreen = Screen.Properties
        } else {
            currentScreen = Screen.Home
        }
    }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .testTag("main_app_scaffold"),
        topBar = {
            PropertyPartnerTopBar(
                title = when (currentScreen) {
                    is Screen.Home -> "Property Partner"
                    is Screen.Properties -> "Explore Architecture"
                    is Screen.PropertyDetail -> "Property Details"
                    is Screen.Matchmaker -> "AI Matchmaker"
                    is Screen.Designer -> "AI Designer"
                    is Screen.Connect -> "AI Connect"
                    is Screen.Saved -> "Saved Favorites"
                    is Screen.Compare -> "Property Matrix"
                    is Screen.Messages -> "Direct Messages"
                    is Screen.SellerPortal -> "Seller Studio"
                    is Screen.Profile -> "Account & Settings"
                    is Screen.Admin -> "Admin Moderation"
                    else -> "Property Partner"
                },
                currentUser = currentUser,
                currency = currency,
                onRoleClick = { showRoleDialog = true },
                onCurrencyClick = {
                    repository.setCurrency(if (currency == CurrencyType.USD) CurrencyType.PKR else CurrencyType.USD)
                },
                onNavigateBack = if (currentScreen != Screen.Home) {
                    {
                        if (selectedConversationId != null) {
                            selectedConversationId = null
                        } else if (currentScreen is Screen.PropertyDetail) {
                            currentScreen = Screen.Properties
                        } else {
                            currentScreen = Screen.Home
                        }
                    }
                } else null,
                actions = {
                    if (currentUser.role == "admin" && currentScreen != Screen.Admin) {
                        IconButton(
                            onClick = { currentScreen = Screen.Admin },
                            modifier = Modifier.testTag("admin_top_action")
                        ) {
                            Icon(Icons.Default.AdminPanelSettings, contentDescription = "Admin")
                        }
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.testTag("bottom_navigation_bar")
            ) {
                // Home
                NavigationBarItem(
                    selected = currentScreen == Screen.Home,
                    onClick = { currentScreen = Screen.Home },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    modifier = Modifier.testTag("nav_item_home")
                )

                // Explore / Catalog
                NavigationBarItem(
                    selected = currentScreen == Screen.Properties,
                    onClick = { currentScreen = Screen.Properties },
                    icon = { Icon(Icons.Default.Search, contentDescription = "Explore") },
                    label = { Text("Explore") },
                    modifier = Modifier.testTag("nav_item_properties")
                )

                // AI Matchmaker
                NavigationBarItem(
                    selected = currentScreen == Screen.Matchmaker,
                    onClick = { currentScreen = Screen.Matchmaker },
                    icon = { Icon(Icons.Default.Psychology, contentDescription = "Matchmaker") },
                    label = { Text("Match") },
                    modifier = Modifier.testTag("nav_item_matchmaker")
                )

                // AI Designer
                NavigationBarItem(
                    selected = currentScreen == Screen.Designer,
                    onClick = { currentScreen = Screen.Designer },
                    icon = { Icon(Icons.Default.Palette, contentDescription = "Designer") },
                    label = { Text("Design") },
                    modifier = Modifier.testTag("nav_item_designer")
                )

                // Messages / Connect
                NavigationBarItem(
                    selected = currentScreen == Screen.Messages || currentScreen == Screen.Connect,
                    onClick = { currentScreen = Screen.Messages },
                    icon = { Icon(Icons.Default.Chat, contentDescription = "Messages") },
                    label = { Text("Chat") },
                    modifier = Modifier.testTag("nav_item_messages")
                )

                // Seller Studio or Saved or Profile
                if (currentUser.role == "seller" || currentUser.role == "agent") {
                    NavigationBarItem(
                        selected = currentScreen == Screen.SellerPortal,
                        onClick = { currentScreen = Screen.SellerPortal },
                        icon = { Icon(Icons.Default.Storefront, contentDescription = "Studio") },
                        label = { Text("Studio") },
                        modifier = Modifier.testTag("nav_item_studio")
                    )
                } else {
                    NavigationBarItem(
                        selected = currentScreen == Screen.Saved || currentScreen == Screen.Compare,
                        onClick = { currentScreen = Screen.Saved },
                        icon = { Icon(Icons.Default.Favorite, contentDescription = "Saved") },
                        label = { Text("Saved") },
                        modifier = Modifier.testTag("nav_item_saved")
                    )
                }

                // Profile
                NavigationBarItem(
                    selected = currentScreen == Screen.Profile,
                    onClick = { currentScreen = Screen.Profile },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") },
                    modifier = Modifier.testTag("nav_item_profile")
                )
            }
        }
    ) { paddingValues ->
        when (currentScreen) {
            is Screen.Home -> {
                HomeScreen(
                    repository = repository,
                    onNavigateToProperties = { cat ->
                        selectedCategoryFilter = cat
                        currentScreen = Screen.Properties
                    },
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    onNavigateToMatchmaker = { currentScreen = Screen.Matchmaker },
                    onNavigateToDesigner = { currentScreen = Screen.Designer },
                    onNavigateToConnect = { currentScreen = Screen.Connect },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Properties -> {
                PropertiesScreen(
                    repository = repository,
                    initialCategory = selectedCategoryFilter,
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.PropertyDetail -> {
                val propId = selectedPropertyId ?: "prop-1"
                PropertyDetailScreen(
                    propertyId = propId,
                    repository = repository,
                    onNavigateBack = { currentScreen = Screen.Properties },
                    onNavigateToChat = { convId ->
                        selectedConversationId = convId
                        currentScreen = Screen.Messages
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Matchmaker -> {
                MatchmakerScreen(
                    repository = repository,
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Designer -> {
                DesignerScreen(
                    repository = repository,
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Connect -> {
                ConnectScreen(
                    repository = repository,
                    onNavigateToMessages = { currentScreen = Screen.Messages },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Messages -> {
                MessagesScreen(
                    repository = repository,
                    selectedConvId = selectedConversationId,
                    onSelectConversation = { convId ->
                        selectedConversationId = if (convId.isBlank()) null else convId
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Saved -> {
                SavedPropertiesScreen(
                    repository = repository,
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Compare -> {
                CompareScreen(
                    repository = repository,
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.SellerPortal -> {
                SellerPortalScreen(
                    repository = repository,
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Profile -> {
                ProfileScreen(
                    repository = repository,
                    onOpenRoleDialog = { showRoleDialog = true },
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is Screen.Admin -> {
                AdminModerationScreen(
                    repository = repository,
                    modifier = Modifier.padding(paddingValues)
                )
            }
            else -> {
                HomeScreen(
                    repository = repository,
                    onNavigateToProperties = { currentScreen = Screen.Properties },
                    onNavigateToDetail = { id ->
                        selectedPropertyId = id
                        currentScreen = Screen.PropertyDetail
                    },
                    onNavigateToMatchmaker = { currentScreen = Screen.Matchmaker },
                    onNavigateToDesigner = { currentScreen = Screen.Designer },
                    onNavigateToConnect = { currentScreen = Screen.Connect },
                    modifier = Modifier.padding(paddingValues)
                )
            }
        }
    }

    if (showRoleDialog) {
        RoleSwitcherDialog(
            currentRole = currentUser.role,
            onRoleSelected = { role -> repository.switchUserRole(role) },
            onDismiss = { showRoleDialog = false }
        )
    }
}
