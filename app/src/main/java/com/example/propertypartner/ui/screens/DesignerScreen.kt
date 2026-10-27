package com.example.propertypartner.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.propertypartner.data.model.DesignConcept
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.theme.TealPrimary
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DesignerScreen(
    repository: PropertyRepository,
    modifier: Modifier = Modifier
) {
    val savedConcepts by repository.designConcepts.collectAsState()

    var selectedRoom by remember { mutableStateOf("Living Room") }
    var selectedStyle by remember { mutableStateOf("Scandinavian Warmth") }
    var userNotes by remember { mutableStateOf("Integrate natural acoustic wood slats, ambient cove lighting, and open layout.") }
    var isGenerating by remember { mutableStateOf(false) }
    var currentConcept by remember { mutableStateOf(savedConcepts.firstOrNull()) }
    var showTransformed by remember { mutableStateOf(true) }
    var saveSuccessSnack by remember { mutableStateOf(false) }

    val rooms = listOf("Living Room", "Kitchen", "Primary Bedroom", "Spa Bathroom", "Outdoor Patio")
    val styles = listOf(
        "Scandinavian Warmth",
        "Japandi Minimalist",
        "Modern Biophilic",
        "Industrial Loft",
        "Mid-Century Modern"
    )

    fun generateNewConcept() {
        val newConcept = DesignConcept(
            id = "concept-${UUID.randomUUID()}",
            originalImage = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
            transformedImage = when (selectedStyle) {
                "Japandi Minimalist" -> "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
                "Modern Biophilic" -> "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                "Industrial Loft" -> "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                else -> "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
            },
            propertyType = "Modern Residence",
            roomArea = selectedRoom,
            designStyle = selectedStyle,
            paletteName = when (selectedStyle) {
                "Japandi Minimalist" -> "Wabi-Sabi Sand & Charcoal"
                "Modern Biophilic" -> "Sage, Olive & Forest Oak"
                "Industrial Loft" -> "Cast Iron & Raw Concrete"
                else -> "Nordic Light & Oatmeal"
            },
            paletteHexes = when (selectedStyle) {
                "Japandi Minimalist" -> listOf("#E8E2D9", "#B8AEA0", "#6A645D", "#2B2A29")
                "Modern Biophilic" -> listOf("#F0F4EF", "#BFCC94", "#556B2F", "#2E3B20")
                "Industrial Loft" -> listOf("#E5E5E5", "#A3A3A3", "#525252", "#171717")
                else -> listOf("#F5F5F0", "#D6CEBE", "#A69B89", "#4E4941")
            },
            userNotes = userNotes,
            architecturalOverview = "Complete spatial reconfiguration maximizing indirect natural illumination, floating cabinetry, and continuous bespoke finishes tailored for $selectedRoom.",
            keyEnhancements = listOf(
                "Installed continuous vertical acoustic architectural slating",
                "Integrated 2700K indirect perimeter ceiling LED channels",
                "Custom built-in millwork with concealed push-to-open hardware",
                "Optimized ergonomic movement flows and zoned acoustics"
            ),
            estimatedCostRange = when (selectedStyle) {
                "Industrial Loft" -> "$16,000 – $24,000"
                "Modern Biophilic" -> "$14,000 – $21,000"
                else -> "$12,000 – $18,500"
            },
            recommendedMaterials = listOf(
                "FSC-Certified Quarter-sawn White Oak",
                "High-performance Bouclé & Linen Textiles",
                "Micro-cement Wall Finishes",
                "Brushed Anodized Minimalist Fixtures"
            ),
            lightingConcept = "3-tier layered scheme: indirect continuous ceiling coves (2700K), recessed trimless accent spotlights (3000K), and sculptural task lighting."
        )
        currentConcept = newConcept
        repository.saveDesignConcept(newConcept)
        saveSuccessSnack = true
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("designer_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        // Concept Generator Controls Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.35f))
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
                                .background(MaterialTheme.colorScheme.secondary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Palette,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "AI Interior & Space Visualizer",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Generate architectural remodel concepts instantly",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    HorizontalDivider()

                    // Room Selection
                    Column {
                        Text("Target Room / Area", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            rooms.take(3).forEach { room ->
                                FilterChip(
                                    selected = selectedRoom == room,
                                    onClick = { selectedRoom = room },
                                    label = { Text(room) }
                                )
                            }
                        }
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(top = 6.dp)
                        ) {
                            rooms.drop(3).forEach { room ->
                                FilterChip(
                                    selected = selectedRoom == room,
                                    onClick = { selectedRoom = room },
                                    label = { Text(room) }
                                )
                            }
                        }
                    }

                    // Design Style Selection
                    Column {
                        Text("Aesthetic Direction", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            styles.take(2).forEach { style ->
                                FilterChip(
                                    selected = selectedStyle == style,
                                    onClick = { selectedStyle = style },
                                    label = { Text(style) }
                                )
                            }
                        }
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(top = 6.dp)
                        ) {
                            styles.drop(2).take(2).forEach { style ->
                                FilterChip(
                                    selected = selectedStyle == style,
                                    onClick = { selectedStyle = style },
                                    label = { Text(style) }
                                )
                            }
                        }
                    }

                    // Custom Notes
                    OutlinedTextField(
                        value = userNotes,
                        onValueChange = { userNotes = it },
                        label = { Text("Design Brief & Specific Preferences") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("designer_notes_input"),
                        maxLines = 3
                    )

                    Button(
                        onClick = { generateNewConcept() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("generate_concept_button")
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Render AI Design Concept")
                    }
                }
            }
        }

        // Active Concept Preview Card
        currentConcept?.let { concept ->
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column {
                        // Before / After Image with View Toggle
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(260.dp)
                        ) {
                            AsyncImage(
                                model = if (showTransformed) concept.transformedImage else concept.originalImage,
                                contentDescription = "Concept Visualization",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )

                            // Toggle Before / After Chip
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f),
                                modifier = Modifier
                                    .align(Alignment.BottomEnd)
                                    .padding(12.dp)
                            ) {
                                Row(modifier = Modifier.padding(4.dp)) {
                                    FilledTonalButton(
                                        onClick = { showTransformed = false },
                                        colors = ButtonDefaults.filledTonalButtonColors(
                                            containerColor = if (!showTransformed) MaterialTheme.colorScheme.primaryContainer else Color.Transparent
                                        ),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text("Original", fontSize = 12.sp)
                                    }
                                    FilledTonalButton(
                                        onClick = { showTransformed = true },
                                        colors = ButtonDefaults.filledTonalButtonColors(
                                            containerColor = if (showTransformed) MaterialTheme.colorScheme.primaryContainer else Color.Transparent
                                        ),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text("AI Transformed", fontSize = 12.sp)
                                    }
                                }
                            }
                        }

                        // Concept metadata details
                        Column(
                            modifier = Modifier.padding(18.dp),
                            verticalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "${concept.roomArea} · ${concept.designStyle}",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "Palette: ${concept.paletteName}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            // Color Palette Chips
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Palette:", style = MaterialTheme.typography.labelMedium)
                                concept.paletteHexes.forEach { hex ->
                                    val colorInt = android.graphics.Color.parseColor(hex)
                                    Box(
                                        modifier = Modifier
                                            .size(28.dp)
                                            .clip(CircleShape)
                                            .background(Color(colorInt))
                                            .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape)
                                    )
                                }
                            }

                            HorizontalDivider()

                            // Architectural Scope
                            Text(
                                text = "Architectural Scope",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = concept.architecturalOverview,
                                style = MaterialTheme.typography.bodyMedium,
                                lineHeight = 20.sp
                            )

                            // Key Enhancements
                            Text(
                                text = "Key Enhancements",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                            concept.keyEnhancements.forEach { item ->
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = TealPrimary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(text = item, style = MaterialTheme.typography.bodySmall)
                                }
                            }

                            // Cost & Materials
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("Estimated Remodel Cost", style = MaterialTheme.typography.labelMedium)
                                        Text(
                                            text = concept.estimatedCostRange,
                                            style = MaterialTheme.typography.labelLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "Lighting Scheme: ${concept.lightingConcept}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (saveSuccessSnack) {
        Snackbar(
            modifier = Modifier.padding(16.dp),
            action = { TextButton(onClick = { saveSuccessSnack = false }) { Text("OK") } }
        ) {
            Text("AI Design Concept rendered and saved to your project library!")
        }
    }
}
