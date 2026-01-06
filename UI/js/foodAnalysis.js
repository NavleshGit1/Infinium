/**
 * FOOD ANALYSIS MODULE
 * Handles image upload, analysis, and integration with backend
 */

import * as apiService from './services/apiService.js';

// Current user ID (should be set after login)
let currentUserId = null;
let isAnalyzing = false;

/**
 * Set the current user ID
 */
export function setCurrentUserId(userId) {
    currentUserId = userId;
    console.log('Current user ID set:', userId);
}

/**
 * Handle image file upload
 */
export async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!currentUserId) {
        showNotification('Please login first', 'error');
        return;
    }

    try {
        isAnalyzing = true;
        showNotification('Analyzing food...', 'info');

        // Upload and analyze
        const result = await apiService.uploadAndAnalyzeFood(currentUserId, file);

        if (result.success) {
            showNotification('Analysis complete!', 'success');
            displayAnalysisResult(result.data);
            
            // Refresh food history
            await refreshFoodHistory();
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Failed to analyze image: ' + error.message, 'error');
    } finally {
        isAnalyzing = false;
    }
}

/**
 * Handle image URL input (for ESP32 or other sources)
 */
export async function handleImageUrlUpload(imageUrl) {
    if (!currentUserId) {
        showNotification('Please login first', 'error');
        return;
    }

    if (!imageUrl) {
        showNotification('Please enter an image URL', 'error');
        return;
    }

    try {
        isAnalyzing = true;
        showNotification('Analyzing food image...', 'info');

        const result = await apiService.uploadAndAnalyzeFood(currentUserId, imageUrl);

        if (result.success) {
            showNotification('Analysis complete!', 'success');
            displayAnalysisResult(result.data);
            
            // Refresh food history
            await refreshFoodHistory();
        }
    } catch (error) {
        console.error('Error analyzing URL:', error);
        showNotification('Failed to analyze image: ' + error.message, 'error');
    } finally {
        isAnalyzing = false;
    }
}

/**
 * Display analysis results
 */
function displayAnalysisResult(data) {
    const resultsContainer = document.getElementById('analysis-results');
    if (!resultsContainer) return;

    const analysis = data.analysis;
    
    let html = `
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Food Analysis Results</h3>
            
            <div class="mb-6">
                <img src="${data.imageUrl}" alt="Food" class="w-full h-64 object-cover rounded-lg mb-4">
                <p class="text-sm text-slate-500 dark:text-slate-400">Analyzed at ${new Date(data.savedAt).toLocaleString()}</p>
            </div>
    `;

    if (analysis.foodItems && analysis.foodItems.length > 0) {
        html += `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-3">Food Items</h4>
                <div class="space-y-3">
        `;

        analysis.foodItems.forEach(item => {
            html += `
                <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h5 class="font-semibold text-slate-900 dark:text-white">${item.name}</h5>
                            <p class="text-sm text-slate-600 dark:text-slate-400">${item.quantity || 'N/A'}</p>
                        </div>
                        <span class="text-lg font-bold text-orange-600">${item.calories} cal</span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-2 text-sm mb-3">
                        <div>
                            <p class="text-slate-500 dark:text-slate-400">Protein</p>
                            <p class="font-semibold text-slate-900 dark:text-white">${item.macros?.protein || 0}g</p>
                        </div>
                        <div>
                            <p class="text-slate-500 dark:text-slate-400">Carbs</p>
                            <p class="font-semibold text-slate-900 dark:text-white">${item.macros?.carbs || 0}g</p>
                        </div>
                        <div>
                            <p class="text-slate-500 dark:text-slate-400">Fat</p>
                            <p class="font-semibold text-slate-900 dark:text-white">${item.macros?.fat || 0}g</p>
                        </div>
                    </div>
                    
                    ${item.allergens && item.allergens.length > 0 ? `
                        <div class="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm">
                            <p class="text-red-700 dark:text-red-400">
                                <strong>⚠️ Allergens:</strong> ${item.allergens.join(', ')}
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Total calories
    html += `
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p class="text-slate-600 dark:text-slate-400 text-sm">Total Calories</p>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">${analysis.totalCalories || 0}</p>
        </div>
    `;

    // Meal type and health score
    if (analysis.mealType || analysis.healthScore) {
        html += `
            <div class="grid grid-cols-2 gap-4 mb-4">
                ${analysis.mealType ? `
                    <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p class="text-sm text-slate-600 dark:text-slate-400">Meal Type</p>
                        <p class="text-lg font-semibold text-slate-900 dark:text-white capitalize">${analysis.mealType}</p>
                    </div>
                ` : ''}
                ${analysis.healthScore ? `
                    <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p class="text-sm text-slate-600 dark:text-slate-400">Health Score</p>
                        <p class="text-lg font-semibold text-slate-900 dark:text-white">${analysis.healthScore}/10</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Suggestions
    if (analysis.suggestions && analysis.suggestions.length > 0) {
        html += `
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h5 class="font-semibold text-green-900 dark:text-green-400 mb-2">💡 Suggestions</h5>
                <ul class="text-sm text-green-800 dark:text-green-300 space-y-1">
                    ${analysis.suggestions.map(s => `<li>• ${s}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    html += `
        </div>
    `;

    resultsContainer.innerHTML = html;
}

/**
 * Refresh food history from backend
 */
export async function refreshFoodHistory() {
    if (!currentUserId) return;

    try {
        const result = await apiService.getFoodHistory(currentUserId, 10);
        
        if (result.success && result.data) {
            displayFoodHistory(result.data);
        }
    } catch (error) {
        console.error('Error refreshing food history:', error);
    }
}

/**
 * Display food history
 */
function displayFoodHistory(history) {
    const historyContainer = document.getElementById('food-history');
    if (!historyContainer) return;

    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No food analysis records yet.</p>
                <p class="text-sm mt-2">Upload an image to get started!</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="space-y-4">
            ${history.map(record => `
                <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex gap-4">
                    <img src="${record.image_url}" alt="Food" class="w-20 h-20 object-cover rounded-lg">
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h4 class="font-semibold text-slate-900 dark:text-white">
                                    ${record.analysis_data?.foodItems?.map(i => i.name).join(', ') || 'Food'}
                                </h4>
                                <p class="text-sm text-slate-500 dark:text-slate-400">
                                    ${new Date(record.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <span class="text-lg font-bold text-orange-600">
                                ${record.analysis_data?.totalCalories || 0} cal
                            </span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-xs">
                            <span class="text-slate-600 dark:text-slate-400">
                                P: ${record.analysis_data?.foodItems?.[0]?.macros?.protein || 0}g
                            </span>
                            <span class="text-slate-600 dark:text-slate-400">
                                C: ${record.analysis_data?.foodItems?.[0]?.macros?.carbs || 0}g
                            </span>
                            <span class="text-slate-600 dark:text-slate-400">
                                F: ${record.analysis_data?.foodItems?.[0]?.macros?.fat || 0}g
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    historyContainer.innerHTML = html;
}

/**
 * Get daily nutrition summary
 */
export async function getDailySummary(date = null) {
    if (!currentUserId) {
        showNotification('Please login first', 'error');
        return null;
    }

    try {
        const dateStr = date || new Date().toISOString().split('T')[0];
        const result = await apiService.getDailySummary(currentUserId, dateStr);
        
        if (result.success) {
            return result.data;
        }
    } catch (error) {
        console.error('Error getting daily summary:', error);
    }
    
    return null;
}

/**
 * Generate personalized diet plan
 */
export async function generatePersonalizedDietPlan(daysCount = 7) {
    if (!currentUserId) {
        showNotification('Please login first', 'error');
        return null;
    }

    try {
        isAnalyzing = true;
        showNotification('Generating personalized diet plan...', 'info');

        const result = await apiService.generateDietPlan(currentUserId, daysCount);

        if (result.success) {
            showNotification('Diet plan created successfully!', 'success');
            displayDietPlan(result.data.plan);
            return result.data;
        }
    } catch (error) {
        console.error('Error generating diet plan:', error);
        showNotification('Failed to generate diet plan: ' + error.message, 'error');
    } finally {
        isAnalyzing = false;
    }

    return null;
}

/**
 * Display diet plan
 */
function displayDietPlan(plan) {
    const container = document.getElementById('diet-plan-container');
    if (!container) return;

    let html = `
        <div class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p class="text-sm text-slate-600 dark:text-slate-400">Plan Duration</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${plan.plan?.duration || 7} days</p>
            </div>
    `;

    if (plan.plan?.days && plan.plan.days.length > 0) {
        plan.plan.days.forEach(day => {
            html += `
                <details class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4" open="${day.day === 1}">
                    <summary class="cursor-pointer font-semibold text-slate-900 dark:text-white flex justify-between">
                        <span>Day ${day.day}</span>
                        <span class="text-orange-600">${day.dayTotalCalories} cal</span>
                    </summary>
                    <div class="mt-4 space-y-3">
                        ${day.meals.map(meal => `
                            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                                <h5 class="font-semibold text-slate-900 dark:text-white capitalize">${meal.type}</h5>
                                <p class="text-sm text-slate-600 dark:text-slate-400">${meal.name}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">${meal.description}</p>
                                <div class="flex justify-between items-center mt-2 text-xs">
                                    <span class="text-orange-600">${meal.calories} cal</span>
                                    <span class="text-slate-500 dark:text-slate-400">
                                        P: ${meal.macros?.protein}g | C: ${meal.macros?.carbs}g | F: ${meal.macros?.fat}g
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </details>
            `;
        });
    }

    if (plan.plan?.nutritionTips) {
        html += `
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 class="font-semibold text-green-900 dark:text-green-400 mb-2">💡 Nutrition Tips</h4>
                <ul class="text-sm text-green-800 dark:text-green-300 space-y-1">
                    ${plan.plan.nutritionTips.map(tip => `<li>• ${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    html += `
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Load and display active diet plan
 */
export async function loadActiveDietPlan() {
    if (!currentUserId) return;

    try {
        const result = await apiService.getActiveDietPlan(currentUserId);
        
        if (result.success && result.data) {
            displayDietPlan(result.data.plan_data);
        }
    } catch (error) {
        console.error('Error loading diet plan:', error);
    }
}
