package com.example.propertypartner.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
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
import com.example.propertypartner.data.model.Property
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.components.PropertyCard
import com.example.propertypartner.ui.theme.TealPrimary

@Composable
fun SavedPropertiesScreen(
    repository: PropertyRepository,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val properties by repository.properties.collectAsState()
    val savedIds by repository.savedIds.collectAsState()
    val compareIds by repository.compareIds.collectAsState()

    val savedProps = properties.filter { savedIds.contains(it.id) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("saved_properties_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Saved Favorites (${savedProps.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        if (savedProps.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.FavoriteBorder,
                            contentDescription = null,
                            modifier = Modifier.size(56.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No Saved Properties Yet",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Tap the heart icon on any property to save it to your collection.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        } else {
            items(savedProps) { prop ->
                PropertyCard(
                    property = prop,
                    priceFormatted = repository.formatPrice(prop.price, prop.listingType),
                    areaFormatted = repository.formatArea(prop.areaSqFt),
                    isFavorite = true,
                    isInCompare = compareIds.contains(prop.id),
                    onCardClick = { onNavigateToDetail(prop.id) },
                    onToggleFavorite = { repository.toggleFavorite(prop.id) },
                    onToggleCompare = { repository.toggleCompare(prop.id) }
                )
            }
        }
    }
}

@Composable
fun CompareScreen(
    repository: PropertyRepository,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val properties by repository.properties.collectAsState()
    val compareIds by repository.compareIds.collectAsState()
    val compareProps = properties.filter { compareIds.contains(it.id) }

    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("compare_screen")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Property Matrix (${compareProps.size}/4)",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            if (compareProps.isNotEmpty()) {
                TextButton(
                    onClick = { repository.clearCompare() },
                    modifier = Modifier.testTag("clear_compare_button")
                ) {
                    Text("Clear All")
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (compareProps.isEmpty()) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.CompareArrows,
                        contentDescription = null,
                        modifier = Modifier.size(56.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No Properties Selected for Comparison",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Tap the compare icon on up to 4 properties to see side-by-side architectural metrics.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            // Horizontal scrollable comparison table
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .horizontalScroll(scrollState)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Header row
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        compareProps.forEach { prop ->
                            Card(
                                modifier = Modifier.width(220.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = prop.propertyType.uppercase(),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = TealPrimary,
                                            fontWeight = FontWeight.Bold
                                        )
                                        IconButton(
                                            onClick = { repository.toggleCompare(prop.id) },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(Icons.Default.Close, contentDescription = "Remove", modifier = Modifier.size(16.dp))
                                        }
                                    }
                                    Text(
                                        text = prop.title,
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 2
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = repository.formatPrice(prop.price, prop.listingType),
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Button(
                                        onClick = { onNavigateToDetail(prop.id) },
                                        modifier = Modifier.fillMaxWidth(),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text("View Details", fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }

                    // Comparison Metric Rows
                    val metrics = listOf(
                        "Price / Sq Ft" to { p: Property ->
                            val pps = p.price / p.areaSqFt
                            "$${pps.toInt()} / sq ft"
                        },
                        "Bedrooms" to { p: Property -> "${p.bedrooms} Beds" },
                        "Bathrooms" to { p: Property -> "${p.bathrooms} Baths" },
                        "Living Area" to { p: Property -> repository.formatArea(p.areaSqFt) },
                        "Year Built" to { p: Property -> "${p.yearBuilt}" },
                        "Parking Spaces" to { p: Property -> "${p.parkingSpaces} Spots" },
                        "City Location" to { p: Property -> "${p.location.city}, ${p.location.state}" }
                    )

                    metrics.forEach { (label, valueExtractor) ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(text = label, style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                    compareProps.forEach { prop ->
                                        Box(
                                            modifier = Modifier.width(220.dp)
                                        ) {
                                            Text(
                                                text = valueExtractor(prop),
                                                style = MaterialTheme.typography.bodyMedium,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
