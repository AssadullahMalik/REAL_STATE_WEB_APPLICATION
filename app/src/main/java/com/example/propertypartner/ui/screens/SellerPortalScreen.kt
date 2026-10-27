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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.propertypartner.data.model.Property
import com.example.propertypartner.data.model.PropertyLocation
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.components.PropertyCard
import com.example.propertypartner.ui.theme.EmeraldAccent
import com.example.propertypartner.ui.theme.TealPrimary
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SellerPortalScreen(
    repository: PropertyRepository,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val properties by repository.properties.collectAsState()
    val currentUser by repository.currentUser.collectAsState()
    val savedIds by repository.savedIds.collectAsState()
    val compareIds by repository.compareIds.collectAsState()

    var showAddDialog by remember { mutableStateOf(false) }

    // Form fields for new property
    var newTitle by remember { mutableStateOf("") }
    var newDescription by remember { mutableStateOf("") }
    var newPrice by remember { mutableStateOf("850000") }
    var newCity by remember { mutableStateOf("Austin") }
    var newState by remember { mutableStateOf("TX") }
    var newArea by remember { mutableStateOf("3200") }
    var newBeds by remember { mutableStateOf("3") }
    var newBaths by remember { mutableStateOf("3.0") }
    var newPropType by remember { mutableStateOf("house") }

    // Seller's properties
    val myProperties = properties.filter { it.sellerId == currentUser.id || currentUser.role == "admin" || currentUser.role == "seller" || currentUser.role == "agent" }

    val totalViews = myProperties.sumOf { it.viewsCount }
    val totalInquiries = myProperties.sumOf { it.inquiriesCount }
    val portfolioValue = myProperties.sumOf { it.price }

    Scaffold(
        modifier = modifier.testTag("seller_portal_screen"),
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showAddDialog = true },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("New Listing") },
                modifier = Modifier.testTag("add_property_fab"),
                containerColor = TealPrimary,
                contentColor = Color.White
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
            item {
                Text(
                    text = "Seller & Agent Studio",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Manage listings, monitor inquiry telemetry, and publish inventory.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Metrics row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Active Listings", style = MaterialTheme.typography.labelSmall)
                            Text(
                                text = "${myProperties.size}",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Total Views", style = MaterialTheme.typography.labelSmall)
                            Text(
                                text = "$totalViews",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Inquiries", style = MaterialTheme.typography.labelSmall)
                            Text(
                                text = "$totalInquiries",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            item {
                Text(
                    text = "Inventory Management (${myProperties.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            items(myProperties) { prop ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = when (prop.status) {
                                    "published" -> EmeraldAccent
                                    "pending" -> Color(0xFFF59E0B)
                                    else -> Color(0xFF64748B)
                                }
                            ) {
                                Text(
                                    text = prop.status.uppercase(),
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }

                            Row {
                                TextButton(
                                    onClick = {
                                        val nextStatus = if (prop.status == "published") "draft" else "published"
                                        repository.updatePropertyStatus(prop.id, nextStatus)
                                    }
                                ) {
                                    Text(if (prop.status == "published") "Set Draft" else "Publish")
                                }
                                IconButton(
                                    onClick = { repository.deleteProperty(prop.id) }
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                                }
                            }
                        }

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
    }

    // Add New Property Dialog
    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Create New Property Listing") },
            text = {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = newTitle,
                            onValueChange = { newTitle = it },
                            label = { Text("Property Title") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = newPrice,
                            onValueChange = { newPrice = it },
                            label = { Text("Price (USD)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = newCity,
                                onValueChange = { newCity = it },
                                label = { Text("City") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = newState,
                                onValueChange = { newState = it },
                                label = { Text("State") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = newBeds,
                                onValueChange = { newBeds = it },
                                label = { Text("Beds") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = newBaths,
                                onValueChange = { newBaths = it },
                                label = { Text("Baths") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = newArea,
                            onValueChange = { newArea = it },
                            label = { Text("Area (Sq Ft)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = newDescription,
                            onValueChange = { newDescription = it },
                            label = { Text("Description") },
                            modifier = Modifier.fillMaxWidth(),
                            maxLines = 3
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val propId = "prop-${UUID.randomUUID()}"
                        val newProp = Property(
                            id = propId,
                            title = if (newTitle.isBlank()) "Contemporary Architectural Residence" else newTitle,
                            description = if (newDescription.isBlank()) "Stunning modern home featuring open-plan design and high-end finishes." else newDescription,
                            price = newPrice.toDoubleOrNull() ?: 750000.0,
                            listingType = "sale",
                            propertyType = newPropType,
                            location = PropertyLocation(
                                address = "100 Innovation Way",
                                city = if (newCity.isBlank()) "Austin" else newCity,
                                state = if (newState.isBlank()) "TX" else newState,
                                zip = "78701"
                            ),
                            areaSqFt = newArea.toDoubleOrNull() ?: 2800.0,
                            bedrooms = newBeds.toIntOrNull() ?: 3,
                            bathrooms = newBaths.toDoubleOrNull() ?: 2.5,
                            yearBuilt = 2024,
                            parkingSpaces = 2,
                            amenities = listOf("Smart Home", "Solar Panel Array", "Private Terrace"),
                            images = listOf("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"),
                            sellerId = currentUser.id,
                            sellerName = currentUser.name,
                            sellerRole = if (currentUser.role == "agent") "agent" else "seller",
                            status = "published",
                            featured = true
                        )
                        repository.addProperty(newProp)
                        showAddDialog = false
                    }
                ) {
                    Text("Publish Listing")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) { Text("Cancel") }
            }
        )
    }
}
