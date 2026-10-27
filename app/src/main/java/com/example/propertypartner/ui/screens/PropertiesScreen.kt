package com.example.propertypartner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.propertypartner.data.model.Property
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.components.PropertyCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PropertiesScreen(
    repository: PropertyRepository,
    initialCategory: String? = null,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val properties by repository.properties.collectAsState()
    val savedIds by repository.savedIds.collectAsState()
    val compareIds by repository.compareIds.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedListingType by remember { mutableStateOf("all") } // "all", "sale", "rent"
    var selectedPropertyType by remember { mutableStateOf(initialCategory ?: "all") }
    var minBeds by remember { mutableStateOf(0) }
    var sortBy by remember { mutableStateOf("featured") } // "featured", "price_asc", "price_desc", "newest"
    var showFilterSheet by remember { mutableStateOf(false) }

    val publishedProps = properties.filter { it.status == "published" }

    val filtered = publishedProps.filter { prop ->
        val matchesSearch = searchQuery.isBlank() ||
                prop.title.contains(searchQuery, ignoreCase = true) ||
                prop.location.city.contains(searchQuery, ignoreCase = true) ||
                prop.location.address.contains(searchQuery, ignoreCase = true)
        val matchesListingType = selectedListingType == "all" || prop.listingType.equals(selectedListingType, ignoreCase = true)
        val matchesPropertyType = selectedPropertyType == "all" || prop.propertyType.equals(selectedPropertyType, ignoreCase = true)
        val matchesBeds = minBeds == 0 || prop.bedrooms >= minBeds

        matchesSearch && matchesListingType && matchesPropertyType && matchesBeds
    }.let { list ->
        when (sortBy) {
            "price_asc" -> list.sortedBy { it.price }
            "price_desc" -> list.sortedByDescending { it.price }
            "newest" -> list.sortedByDescending { it.createdAt }
            else -> list.sortedByDescending { it.featured }
        }
    }

    Scaffold(
        modifier = modifier.testTag("properties_catalog_screen"),
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showFilterSheet = true },
                icon = { Icon(Icons.Default.FilterList, contentDescription = null) },
                text = { Text("Filters") },
                modifier = Modifier.testTag("open_filters_fab")
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Search Box
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search location, title, neighborhood...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = null)
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("properties_search_field"),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
            }

            // Quick Filter Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("all" to "All", "sale" to "For Sale", "rent" to "For Rent").forEach { (type, label) ->
                        FilterChip(
                            selected = selectedListingType == type,
                            onClick = { selectedListingType = type },
                            label = { Text(label) },
                            modifier = Modifier.testTag("filter_listing_$type")
                        )
                    }
                }
            }

            // Results count & sort indicator
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${filtered.size} Properties Available",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Sort:",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        var sortMenuExpanded by remember { mutableStateOf(false) }
                        TextButton(
                            onClick = { sortMenuExpanded = true },
                            modifier = Modifier.testTag("sort_button")
                        ) {
                            Text(
                                when (sortBy) {
                                    "price_asc" -> "Price: Low to High"
                                    "price_desc" -> "Price: High to Low"
                                    "newest" -> "Newest"
                                    else -> "Featured"
                                }
                            )
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                        }
                        DropdownMenu(
                            expanded = sortMenuExpanded,
                            onDismissRequest = { sortMenuExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Featured First") },
                                onClick = { sortBy = "featured"; sortMenuExpanded = false }
                            )
                            DropdownMenuItem(
                                text = { Text("Price: Low to High") },
                                onClick = { sortBy = "price_asc"; sortMenuExpanded = false }
                            )
                            DropdownMenuItem(
                                text = { Text("Price: High to Low") },
                                onClick = { sortBy = "price_desc"; sortMenuExpanded = false }
                            )
                            DropdownMenuItem(
                                text = { Text("Newest Listed") },
                                onClick = { sortBy = "newest"; sortMenuExpanded = false }
                            )
                        }
                    }
                }
            }

            if (filtered.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 32.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.SearchOff,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "No Properties Found",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                "Try resetting search query or criteria filters.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            FilledTonalButton(
                                onClick = {
                                    searchQuery = ""
                                    selectedListingType = "all"
                                    selectedPropertyType = "all"
                                    minBeds = 0
                                }
                            ) {
                                Text("Reset All Filters")
                            }
                        }
                    }
                }
            } else {
                items(filtered) { prop ->
                    PropertyCard(
                        property = prop,
                        priceFormatted = repository.formatPrice(prop.price, prop.listingType),
                        areaFormatted = repository.formatArea(prop.areaSqFt),
                        isFavorite = savedIds.contains(prop.id),
                        isInCompare = compareIds.contains(prop.id),
                        onCardClick = { onNavigateToDetail(prop.id) },
                        onToggleFavorite = { repository.toggleFavorite(prop.id) },
                        onToggleCompare = { repository.toggleCompare(prop.id) }
                    )
                }
            }
        }
    }

    if (showFilterSheet) {
        ModalBottomSheet(
            onDismissRequest = { showFilterSheet = false },
            modifier = Modifier.testTag("filter_bottom_sheet")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Filter Properties",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                Text("Property Type", style = MaterialTheme.typography.titleSmall)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("all" to "All", "villa" to "Villa", "house" to "House", "apartment" to "Apartment", "land" to "Land").forEach { (type, label) ->
                        FilterChip(
                            selected = selectedPropertyType == type,
                            onClick = { selectedPropertyType = type },
                            label = { Text(label) }
                        )
                    }
                }

                Text("Minimum Bedrooms", style = MaterialTheme.typography.titleSmall)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(0 to "Any", 1 to "1+", 2 to "2+", 3 to "3+", 4 to "4+").forEach { (num, label) ->
                        FilterChip(
                            selected = minBeds == num,
                            onClick = { minBeds = num },
                            label = { Text(label) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = { showFilterSheet = false },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("apply_filters_button")
                ) {
                    Text("Apply Filters (${filtered.size} results)")
                }
            }
        }
    }
}
