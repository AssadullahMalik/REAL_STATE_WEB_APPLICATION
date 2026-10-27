package com.example.propertypartner.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.propertypartner.data.model.MatchResult
import com.example.propertypartner.data.model.MatchmakerPreferences
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.components.PropertyCard
import com.example.propertypartner.ui.theme.EmeraldAccent
import com.example.propertypartner.ui.theme.TealPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MatchmakerScreen(
    repository: PropertyRepository,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var budgetMax by remember { mutableStateOf(2000000f) }
    var listingType by remember { mutableStateOf("sale") }
    var selectedCity by remember { mutableStateOf("Austin") }
    var selectedType by remember { mutableStateOf("villa") }
    var minBedrooms by remember { mutableStateOf(3) }
    var requirePool by remember { mutableStateOf(true) }
    var requireSolar by remember { mutableStateOf(true) }

    var hasRunSearch by remember { mutableStateOf(true) }
    var matchResults by remember { mutableStateOf<List<MatchResult>>(emptyList()) }

    fun runMatch() {
        val amenities = mutableListOf<String>()
        if (requirePool) amenities.add("Pool")
        if (requireSolar) amenities.add("Solar")

        val prefs = MatchmakerPreferences(
            budgetMin = 200000.0,
            budgetMax = budgetMax.toDouble(),
            listingType = listingType,
            locations = listOf(selectedCity),
            propertyTypes = listOf(selectedType),
            minBedrooms = minBedrooms,
            requiredAmenities = amenities
        )
        matchResults = repository.calculateMatches(prefs)
        hasRunSearch = true
    }

    LaunchedEffect(Unit) {
        runMatch()
    }

    val savedIds by repository.savedIds.collectAsState()
    val compareIds by repository.compareIds.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("matchmaker_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // AI Questionnaire Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f))
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(TealPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "AI Matchmaker Engine",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Smart algorithm weighing 12 property dimensions",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    HorizontalDivider()

                    // Budget Slider
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Max Budget Limit", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                text = repository.formatPrice(budgetMax.toDouble(), listingType),
                                style = MaterialTheme.typography.titleSmall,
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Slider(
                            value = budgetMax,
                            onValueChange = { budgetMax = it },
                            valueRange = 100000f..3000000f,
                            steps = 29,
                            modifier = Modifier.testTag("matchmaker_budget_slider")
                        )
                    }

                    // Target Market City
                    Column {
                        Text("Target Market", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("Austin", "Miami", "San Diego", "Chicago").forEach { city ->
                                FilterChip(
                                    selected = selectedCity == city,
                                    onClick = { selectedCity = city },
                                    label = { Text(city) }
                                )
                            }
                        }
                    }

                    // Preferred Architecture
                    Column {
                        Text("Preferred Architecture", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("villa" to "Villa", "apartment" to "Apartment", "house" to "House", "land" to "Land").forEach { (type, label) ->
                                FilterChip(
                                    selected = selectedType == type,
                                    onClick = { selectedType = type },
                                    label = { Text(label) }
                                )
                            }
                        }
                    }

                    // Minimum Bedrooms
                    Column {
                        Text("Minimum Bedrooms", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf(1, 2, 3, 4).forEach { beds ->
                                FilterChip(
                                    selected = minBedrooms == beds,
                                    onClick = { minBedrooms = beds },
                                    label = { Text("$beds+ Beds") }
                                )
                            }
                        }
                    }

                    // Priority Features
                    Column {
                        Text("Priority Features", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            FilterChip(
                                selected = requirePool,
                                onClick = { requirePool = !requirePool },
                                label = { Text("Pool Included") },
                                leadingIcon = {
                                    if (requirePool) Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                }
                            )
                            FilterChip(
                                selected = requireSolar,
                                onClick = { requireSolar = !requireSolar },
                                label = { Text("Solar Array") },
                                leadingIcon = {
                                    if (requireSolar) Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                }
                            )
                        }
                    }

                    Button(
                        onClick = { runMatch() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("run_matchmaker_button")
                    ) {
                        Icon(Icons.Default.Psychology, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Analyze & Score Matches")
                    }
                }
            }
        }

        // Match Results Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "AI Ranked Matches (${matchResults.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Sorted by Compatibility",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Match Items with Score Banner
        items(matchResults) { result ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column {
                    // Match Score Header
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (result.score >= 90) EmeraldAccent.copy(alpha = 0.15f)
                                else MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f)
                            )
                            .padding(horizontal = 16.dp, vertical = 10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (result.score >= 90) EmeraldAccent else MaterialTheme.colorScheme.primary
                                ) {
                                    Text(
                                        text = "${result.score}% Match",
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (result.score >= 90) "Top Architectural Match" else "Viable Alternative",
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }

                    // Matching Reasons list
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "AI Match Rationale:",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        result.matchingReasons.forEach { reason ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(vertical = 2.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = EmeraldAccent,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = reason, style = MaterialTheme.typography.bodySmall)
                            }
                        }

                        if (result.relaxedCriteria.isNotEmpty()) {
                            Spacer(modifier = Modifier.height(4.dp))
                            result.relaxedCriteria.forEach { note ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(vertical = 2.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Info,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = note,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    // Property Card Component embedded
                    PropertyCard(
                        property = result.property,
                        priceFormatted = repository.formatPrice(result.property.price, result.property.listingType),
                        areaFormatted = repository.formatArea(result.property.areaSqFt),
                        isFavorite = savedIds.contains(result.property.id),
                        isInCompare = compareIds.contains(result.property.id),
                        onCardClick = { onNavigateToDetail(result.property.id) },
                        onToggleFavorite = { repository.toggleFavorite(result.property.id) },
                        onToggleCompare = { repository.toggleCompare(result.property.id) }
                    )
                }
            }
        }
    }
}
