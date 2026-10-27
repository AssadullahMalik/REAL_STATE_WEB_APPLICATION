package com.propertypartner.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.propertypartner.app.ui.theme.PropertyPartnerTheme
import com.propertypartner.app.ui.theme.TealPrimary

data class PropertyItem(
    val id: String,
    val title: String,
    val price: String,
    val location: String,
    val beds: Int,
    val baths: Int,
    val area: String,
    val type: String,
    val isVerified: Boolean = true
)

val sampleProperties = listOf(
    PropertyItem("1", "Al-Razi Luxury Villa", "PKR 45,000,000", "DHA Phase 6, Lahore", 4, 5, "1 Kanal", "Villa"),
    PropertyItem("2", "Elysium Sky Penthouse", "PKR 28,000,000", "Gulberg III, Lahore", 3, 3, "2,400 sqft", "Apartment"),
    PropertyItem("3", "Margalla Heights Residence", "PKR 35,000,000", "F-7/2, Islamabad", 4, 4, "10 Marla", "House"),
    PropertyItem("4", "Creek Vista Modern Suite", "PKR 22,000,000", "DHA Phase 8, Karachi", 2, 2, "1,850 sqft", "Apartment"),
    PropertyItem("5", "Serena Green Farmhouse", "PKR 65,000,000", "Bedian Road, Lahore", 5, 6, "4 Kanal", "Farmhouse")
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PropertyPartnerTheme {
                MainAppScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen() {
    var selectedTab by remember { mutableIntStateOf(0) }
    val savedIds = remember { mutableStateListOf<String>("1", "3") }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Logo",
                            tint = TealPrimary,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Property Partner",
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = { /* Search */ },
                        modifier = Modifier.testTag("search_icon_button")
                    ) {
                        Icon(Icons.Default.Search, contentDescription = "Search")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                modifier = Modifier.testTag("bottom_nav_bar")
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Explore") },
                    label = { Text("Explore") },
                    modifier = Modifier.testTag("nav_explore")
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Star, contentDescription = "AI Match") },
                    label = { Text("AI Match") },
                    modifier = Modifier.testTag("nav_aimatch")
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Edit, contentDescription = "AI Design") },
                    label = { Text("AI Design") },
                    modifier = Modifier.testTag("nav_aidesign")
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Share, contentDescription = "Live Web") },
                    label = { Text("Live Web") },
                    modifier = Modifier.testTag("nav_liveweb")
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Icon(Icons.Default.Favorite, contentDescription = "Saved") },
                    label = { Text("Saved") },
                    modifier = Modifier.testTag("nav_saved")
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            when (selectedTab) {
                0 -> ExploreScreen(
                    savedIds = savedIds,
                    onToggleSaved = { id ->
                        if (savedIds.contains(id)) savedIds.remove(id) else savedIds.add(id)
                    }
                )
                1 -> AIMatchmakerScreen()
                2 -> AIDesignerScreen()
                3 -> LiveWebScreen()
                4 -> SavedScreen(
                    savedIds = savedIds,
                    onToggleSaved = { id -> savedIds.remove(id) }
                )
            }
        }
    }
}

@Composable
fun ExploreScreen(
    savedIds: List<String>,
    onToggleSaved: (String) -> Unit
) {
    var filterType by remember { mutableStateOf("All") }

    val filteredList = remember(filterType) {
        if (filterType == "All") sampleProperties
        else sampleProperties.filter { it.type == filterType }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = TealPrimary.copy(alpha = 0.12f)
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().testTag("hero_banner_card")
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Find Your Dream Property",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "AI-Powered discovery, instant 3D design concepts, and verified direct connections.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
                    )
                }
            }
        }

        item {
            val filters = listOf("All", "Villa", "Apartment", "House", "Farmhouse")
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.testTag("filter_chips_row")
            ) {
                items(filters) { f ->
                    FilterChip(
                        selected = filterType == f,
                        onClick = { filterType = f },
                        label = { Text(f) }
                    )
                }
            }
        }

        items(filteredList, key = { it.id }) { prop ->
            PropertyCardItem(
                property = prop,
                isSaved = savedIds.contains(prop.id),
                onToggleSaved = { onToggleSaved(prop.id) }
            )
        }
    }
}

@Composable
fun PropertyCardItem(
    property: PropertyItem,
    isSaved: Boolean,
    onToggleSaved: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("property_card_${property.id}"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = property.price,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = TealPrimary
                )
                IconButton(
                    onClick = onToggleSaved,
                    modifier = Modifier.testTag("favorite_button_${property.id}")
                ) {
                    Icon(
                        imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Save favorite",
                        tint = if (isSaved) Color.Red else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            }

            Text(
                text = property.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.Place,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = property.location,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("${property.beds} Beds", style = MaterialTheme.typography.bodyMedium)
                Text("${property.baths} Baths", style = MaterialTheme.typography.bodyMedium)
                Text(property.area, style = MaterialTheme.typography.bodyMedium)
                Text(property.type, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
fun AIMatchmakerScreen() {
    var budget by remember { mutableStateOf("PKR 30M - 50M") }
    var locationPref by remember { mutableStateOf("Lahore / Islamabad") }
    var showResults by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "AI Property Matchmaker",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Tell our AI what matters to you and get personalized property recommendations with match explanations.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )

        OutlinedTextField(
            value = budget,
            onValueChange = { budget = it },
            label = { Text("Budget Range") },
            modifier = Modifier.fillMaxWidth().testTag("budget_input")
        )

        OutlinedTextField(
            value = locationPref,
            onValueChange = { locationPref = it },
            label = { Text("Preferred Location / City") },
            modifier = Modifier.fillMaxWidth().testTag("location_input")
        )

        Button(
            onClick = { showResults = true },
            colors = ButtonDefaults.buttonColors(containerColor = TealPrimary),
            modifier = Modifier.fillMaxWidth().testTag("run_ai_match_button")
        ) {
            Icon(Icons.Default.Star, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Find AI Matches")
        }

        if (showResults) {
            Card(
                modifier = Modifier.fillMaxWidth().testTag("match_result_card"),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = TealPrimary.copy(alpha = 0.08f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = TealPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "96% AI Match Score",
                            fontWeight = FontWeight.Bold,
                            color = TealPrimary
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Al-Razi Luxury Villa (DHA Phase 6, Lahore) matches your space requirements, security expectations, and falls right inside your target investment profile.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }
    }
}

@Composable
fun AIDesignerScreen() {
    var roomType by remember { mutableStateOf("Living Room") }
    var selectedStyle by remember { mutableStateOf("Modern Minimalist") }
    var isGenerating by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "AI Interior Designer",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Visualize renovation concepts and interior styling for any property room.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )

        val rooms = listOf("Living Room", "Master Bedroom", "Modern Kitchen", "Home Office")
        Text("Select Room:", fontWeight = FontWeight.SemiBold)
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(rooms) { r ->
                FilterChip(
                    selected = roomType == r,
                    onClick = { roomType = r },
                    label = { Text(r) }
                )
            }
        }

        val styles = listOf("Modern Minimalist", "Warm Scandinavian", "Luxury Classical", "Industrial Loft")
        Text("Select Style Aesthetic:", fontWeight = FontWeight.SemiBold)
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(styles) { s ->
                FilterChip(
                    selected = selectedStyle == s,
                    onClick = { selectedStyle = s },
                    label = { Text(s) }
                )
            }
        }

        Button(
            onClick = { isGenerating = true },
            colors = ButtonDefaults.buttonColors(containerColor = TealPrimary),
            modifier = Modifier.fillMaxWidth().testTag("generate_design_button")
        ) {
            Icon(Icons.Default.Edit, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Generate Design Concept")
        }

        if (isGenerating) {
            Card(
                modifier = Modifier.fillMaxWidth().testTag("design_result_card"),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Concept: $roomType - $selectedStyle",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Includes neutral palette (warm taupe and muted sage), recessed ambient ceiling lighting, floor-to-ceiling panoramic glass, and custom fluted wood paneling.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun LiveWebScreen() {
    Column(modifier = Modifier.fillMaxSize()) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            colors = CardDefaults.cardColors(containerColor = TealPrimary.copy(alpha = 0.1f))
        ) {
            Row(
                modifier = Modifier.padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Share, contentDescription = null, tint = TealPrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Live Web Server: http://localhost:3000",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Medium
                )
            }
        }
        AndroidView(
            modifier = Modifier.fillMaxSize().testTag("live_webview"),
            factory = { context ->
                WebView(context).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.loadWithOverviewMode = true
                    settings.useWideViewPort = true
                    webChromeClient = WebChromeClient()
                    webViewClient = WebViewClient()
                    loadUrl("http://localhost:3000")
                }
            }
        )
    }
}

@Composable
fun SavedScreen(
    savedIds: List<String>,
    onToggleSaved: (String) -> Unit
) {
    val savedList = remember(savedIds) {
        sampleProperties.filter { savedIds.contains(it.id) }
    }

    if (savedList.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    Icons.Default.FavoriteBorder,
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    "No saved properties yet",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    } else {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            items(savedList, key = { it.id }) { prop ->
                PropertyCardItem(
                    property = prop,
                    isSaved = true,
                    onToggleSaved = { onToggleSaved(prop.id) }
                )
            }
        }
    }
}
