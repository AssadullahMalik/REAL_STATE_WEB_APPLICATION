package com.example.propertypartner.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import com.example.propertypartner.data.mock.SampleData
import com.example.propertypartner.data.model.ConnectionPlan
import com.example.propertypartner.data.repository.PropertyRepository
import com.example.propertypartner.ui.theme.EmeraldAccent
import com.example.propertypartner.ui.theme.NavySecondary
import com.example.propertypartner.ui.theme.TealPrimary

@Composable
fun ConnectScreen(
    repository: PropertyRepository,
    onNavigateToMessages: () -> Unit,
    modifier: Modifier = Modifier
) {
    val activeSub by repository.activeSubscription.collectAsState()
    val plans = SampleData.connectionPlans
    var selectedPlanToBuy by remember { mutableStateOf<ConnectionPlan?>(null) }
    var showPurchasedSnack by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("connect_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = NavySecondary),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = TealPrimary
                    ) {
                        Text(
                            text = "AI CONNECT PASS",
                            color = Color.White,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Text(
                        text = "Direct Verified Buyer-Seller Communication",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Unlock verified direct messaging, tour scheduling, inspection document exchanges, and direct agent disclosure without intermediary spam.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFFCBD5E1)
                    )
                }
            }
        }

        // Active Subscription Status Card
        item {
            activeSub?.let { sub ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Verified,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Active Pass: ${sub.planName}",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = EmeraldAccent
                            ) {
                                Text(
                                    text = "ACTIVE",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }

                        Text(
                            text = "Valid until ${sub.expiryDate} · Chats: ${sub.inquiriesRemaining}",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            TextButton(onClick = { repository.cancelSubscription() }) {
                                Text("Cancel Subscription", color = MaterialTheme.colorScheme.error)
                            }
                            Button(
                                onClick = onNavigateToMessages,
                                colors = ButtonDefaults.buttonColors(containerColor = TealPrimary)
                            ) {
                                Icon(Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Open Messages Inbox")
                            }
                        }
                    }
                }
            }
        }

        item {
            Text(
                text = "Available Connection Plans",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }

        items(plans) { plan ->
            val isCurrentPlan = activeSub?.planId == plan.id
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .then(
                        if (plan.popular) Modifier.border(2.dp, TealPrimary, RoundedCornerShape(16.dp))
                        else Modifier
                    ),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = plan.name,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${plan.durationDays} Days Access",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        if (plan.badge != null) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = TealPrimary
                            ) {
                                Text(
                                    text = plan.badge.uppercase(),
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }

                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "$${plan.price.toInt()}",
                            style = MaterialTheme.typography.headlineLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = " / one-time pass",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(bottom = 4.dp, start = 4.dp)
                        )
                    }

                    Text(
                        text = plan.tagline,
                        style = MaterialTheme.typography.bodyMedium
                    )

                    HorizontalDivider()

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        plan.features.forEach { feat ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = TealPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(text = feat, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Button(
                        onClick = {
                            if (isCurrentPlan) {
                                onNavigateToMessages()
                            } else {
                                selectedPlanToBuy = plan
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("plan_action_${plan.id}"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isCurrentPlan) MaterialTheme.colorScheme.secondary else TealPrimary
                        )
                    ) {
                        Text(if (isCurrentPlan) "Active Pass — Go to Messages" else "Select ${plan.name}")
                    }
                }
            }
        }
    }

    // Purchase Dialog
    selectedPlanToBuy?.let { plan ->
        AlertDialog(
            onDismissRequest = { selectedPlanToBuy = null },
            title = { Text("Confirm Pass Activation") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Activate ${plan.name} for $${plan.price.toInt()}?")
                    Text(
                        "Includes ${plan.durationDays} days of verified messaging with sellers, tour requests, and direct disclosures.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        repository.purchaseSubscription(plan)
                        selectedPlanToBuy = null
                        showPurchasedSnack = true
                    }
                ) {
                    Text("Activate Now")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedPlanToBuy = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    if (showPurchasedSnack) {
        Snackbar(
            modifier = Modifier.padding(16.dp),
            action = { TextButton(onClick = { showPurchasedSnack = false }) { Text("Dismiss") } }
        ) {
            Text("Connection Pass activated! Direct messaging unlocked.")
        }
    }
}
