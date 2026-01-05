/**
 * COMPONENTS MODULE
 * 
 * This file contains all UI rendering functions for each component.
 * All functions read from the appData state object and update the DOM.
 */

/**
 * Render the dashboard overview with Bento Box layout
 */
function renderDashboard() {
    const container = document.getElementById('dashboard-grid');
    if (!container) return;
    
    const highAlerts = appData.alerts.filter(a => a.severity === 'high').length;
    const lowFreshness = appData.inventory.filter(i => i.freshnessScore < 50).length;
    const availableRecipes = appData.recipes.length;
    const shoppingItems = appData.shoppingList.filter(s => s.priority === 'high').length;
    
    container.innerHTML = `
        <!-- Smart Alerts Summary -->
        <div class="bg-white dark:bg-slate-800 rounded-lg nature-card border border-slate-200 dark:border-slate-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white uppercase tracking-wide text-xs">Smart Alerts</h3>
                <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                </div>
            </div>
                <p class="text-3xl font-bold text-slate-900 dark:text-white mb-1">${highAlerts}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">High-priority alerts</p>
            <a href="#" data-view="alerts" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1">
                View all <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>
        
        <!-- Freshness Overview -->
        <div class="bg-white dark:bg-slate-800 rounded-lg nature-card border border-slate-200 dark:border-slate-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white uppercase tracking-wide text-xs">Freshness Score</h3>
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mb-1">${lowFreshness}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Items need attention</p>
            <a href="#" data-view="freshness" class="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                View all <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>
        
        <!-- Recipe Engine Summary -->
        <div class="bg-white dark:bg-slate-800 rounded-lg nature-card border border-slate-200 dark:border-slate-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white uppercase tracking-wide text-xs">Recipe Engine</h3>
                <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mb-1">${availableRecipes}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Recipe suggestions</p>
            <a href="#" data-view="recipes" class="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                Explore <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>
        
        <!-- Smart Shopping Summary -->
        <div class="bg-white dark:bg-slate-800 rounded-lg nature-card border border-slate-200 dark:border-slate-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white uppercase tracking-wide text-xs">Smart Shopping</h3>
                <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mb-1">${shoppingItems}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">High-priority items</p>
            <a href="#" data-view="shopping" class="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                View list <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>
        
        <!-- Quick Stats -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-lg p-6 text-white col-span-1 md:col-span-2 lg:col-span-1">
            <h3 class="text-base font-semibold mb-4 uppercase tracking-wide text-xs text-slate-300">Inventory Status</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-slate-700">
                    <span class="text-slate-400 text-sm">Total Items</span>
                    <span class="text-2xl font-bold">${appData.inventory.length}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-sm">Categories</span>
                    <span class="text-2xl font-bold">${new Set(appData.inventory.map(i => i.category)).size}</span>
                </div>
            </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="bg-white dark:bg-slate-800 rounded-lg nature-card border border-slate-200 dark:border-slate-700 p-6 col-span-1 md:col-span-2">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide text-xs">Recent Activity</h3>
            <div class="space-y-2">
                ${appData.alerts.slice(0, 3).map(alert => `
                    <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                        <div class="w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">${alert.item}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">${alert.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Attach event listeners to dynamically created navigation links in dashboard
    const dashboardLinks = container.querySelectorAll('[data-view]');
    dashboardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.getAttribute('data-view');
            if (viewName) {
                showView(viewName);
            }
        });
    });
}

/**
 * Render Smart Alerts view
 */
function renderAlerts() {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    
    if (appData.alerts.length === 0) {
        container.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-slate-600 text-lg">No alerts at this time</p>
                <p class="text-slate-400 text-sm mt-2">All items are fresh!</p>
            </div>
        `;
        return;
    }
    
    // Group alerts by severity
    const highAlerts = appData.alerts.filter(a => a.severity === 'high');
    const mediumAlerts = appData.alerts.filter(a => a.severity === 'medium');
    const lowAlerts = appData.alerts.filter(a => a.severity === 'low');
    
    container.innerHTML = `
        ${highAlerts.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">High Priority</h3>
                <div class="space-y-3">
                    ${highAlerts.map(alert => `
                        <div class="bg-white rounded-xl shadow-sm border-2 ${getSeverityColor(alert.severity)} p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h4 class="text-lg font-semibold text-slate-900">${alert.item}</h4>
                                        <span class="px-2 py-1 text-xs font-medium bg-white rounded-full text-red-600 border border-red-200">
                                            ${alert.category}
                                        </span>
                                    </div>
                                    <p class="text-slate-700 mb-2">${alert.message}</p>
                                    <p class="text-sm text-slate-600">Expiration: ${alert.expirationDate}</p>
                                </div>
                                <button class="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors" onclick="dismissAlert(${alert.id})">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${mediumAlerts.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Medium Priority</h3>
                <div class="space-y-3">
                    ${mediumAlerts.map(alert => `
                        <div class="bg-white rounded-xl shadow-sm border-2 ${getSeverityColor(alert.severity)} p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h4 class="text-lg font-semibold text-slate-900">${alert.item}</h4>
                                        <span class="px-2 py-1 text-xs font-medium bg-white rounded-full text-orange-600 border border-orange-200">
                                            ${alert.category}
                                        </span>
                                    </div>
                                    <p class="text-slate-700 mb-2">${alert.message}</p>
                                    <p class="text-sm text-slate-600">Expiration: ${alert.expirationDate}</p>
                                </div>
                                <button class="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors" onclick="dismissAlert(${alert.id})">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${lowAlerts.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Low Priority</h3>
                <div class="space-y-3">
                    ${lowAlerts.map(alert => `
                        <div class="bg-white rounded-xl shadow-sm border-2 ${getSeverityColor(alert.severity)} p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h4 class="text-lg font-semibold text-slate-900">${alert.item}</h4>
                                        <span class="px-2 py-1 text-xs font-medium bg-white rounded-full text-yellow-600 border border-yellow-200">
                                            ${alert.category}
                                        </span>
                                    </div>
                                    <p class="text-slate-700 mb-2">${alert.message}</p>
                                    <p class="text-sm text-slate-600">Expiration: ${alert.expirationDate}</p>
                                </div>
                                <button class="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors" onclick="dismissAlert(${alert.id})">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    // Update alerts badge
    updateAlertsBadge();
}

/**
 * Render Freshness Scoring view
 */
function renderFreshness() {
    const container = document.getElementById('freshness-container');
    if (!container) return;
    
    // Sort inventory by freshness score (lowest first)
    const sortedInventory = [...appData.inventory].sort((a, b) => a.freshnessScore - b.freshnessScore);
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Item</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Freshness Score</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Storage</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiration</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    ${sortedInventory.map(item => `
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-slate-900">${item.name}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                                    ${item.category}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-3">
                                    <div class="flex-1 bg-slate-200 rounded-full h-2 max-w-24">
                                        <div class="h-2 rounded-full transition-all" style="width: ${item.freshnessScore}%; background-color: ${
                                            item.freshnessScore >= 75 ? '#10b981' : 
                                            item.freshnessScore >= 50 ? '#f59e0b' : 
                                            item.freshnessScore >= 25 ? '#f97316' : '#ef4444'
                                        }"></div>
                                    </div>
                                    <span class="px-3 py-1 text-sm font-semibold rounded-full ${getFreshnessColor(item.freshnessScore)}">
                                        ${item.freshnessScore}%
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                ${item.quantity}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                ${item.storageLocation}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                ${item.expirationDate}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Render Recipe Engine view
 */
function renderRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container) return;
    
    // Sort recipes by match score (highest first)
    const sortedRecipes = [...appData.recipes].sort((a, b) => b.matchScore - a.matchScore);
    
    if (sortedRecipes.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <p class="text-slate-600 text-lg">No recipes available</p>
                <p class="text-slate-400 text-sm mt-2">Add more items to your inventory to get recipe suggestions</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sortedRecipes.map(recipe => `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-900 flex-1">${recipe.name}</h3>
                <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                    ${recipe.matchScore}% match
                </span>
            </div>
            <p class="text-slate-600 text-sm mb-4">${recipe.description}</p>
            
            <div class="mb-4">
                <p class="text-xs font-semibold text-slate-700 mb-2">Ingredients:</p>
                <div class="flex flex-wrap gap-2">
                    ${recipe.ingredients.map(ing => `
                        <span class="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full">
                            ${ing}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex items-center justify-between text-sm text-slate-600 mb-4">
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>${recipe.prepTime}</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span>${recipe.difficulty}</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span>${recipe.calories} cal</span>
                </div>
            </div>
            
            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                View Recipe
            </button>
        </div>
    `).join('');
}

/**
 * Render Smart Shopping view
 */
function renderShopping() {
    const container = document.getElementById('shopping-container');
    if (!container) return;
    
    // Group by priority
    const highPriority = appData.shoppingList.filter(s => s.priority === 'high');
    const mediumPriority = appData.shoppingList.filter(s => s.priority === 'medium');
    const lowPriority = appData.shoppingList.filter(s => s.priority === 'low');
    
    container.innerHTML = `
        ${highPriority.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">High Priority</h3>
                <div class="space-y-3">
                    ${highPriority.map(item => `
                        <div class="flex items-center gap-4 p-4 bg-white border-2 border-red-200 rounded-lg">
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded border-slate-300" id="shop-${item.id}">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-1">
                                    <h4 class="font-semibold text-slate-900">${item.item}</h4>
                                    <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                        ${item.category}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-600">${item.reason}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${mediumPriority.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Medium Priority</h3>
                <div class="space-y-3">
                    ${mediumPriority.map(item => `
                        <div class="flex items-center gap-4 p-4 bg-white border-2 border-orange-200 rounded-lg">
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded border-slate-300" id="shop-${item.id}">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-1">
                                    <h4 class="font-semibold text-slate-900">${item.item}</h4>
                                    <span class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                        ${item.category}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-600">${item.reason}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${lowPriority.length > 0 ? `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Low Priority</h3>
                <div class="space-y-3">
                    ${lowPriority.map(item => `
                        <div class="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-lg">
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded border-slate-300" id="shop-${item.id}">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-1">
                                    <h4 class="font-semibold text-slate-900">${item.item}</h4>
                                    <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                                        ${item.category}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-600">${item.reason}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${appData.shoppingList.length === 0 ? `
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-slate-600 text-lg">Shopping list is empty</p>
                <p class="text-slate-400 text-sm mt-2">All items are in stock!</p>
            </div>
        ` : ''}
    `;
}

/**
 * Render User Profile view
 */
function renderProfile() {
    const container = document.getElementById('profile-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="max-w-2xl">
            <div class="mb-8 pb-6 border-b border-slate-200">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                        <span class="text-2xl font-bold text-slate-700">${appData.user.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-slate-900">${appData.user.name}</h3>
                        <p class="text-slate-600">${appData.user.email}</p>
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold text-slate-800 mb-4">Dietary Preferences</h4>
                    <div class="flex flex-wrap gap-2">
                        ${appData.user.dietaryPreferences.map(pref => `
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                ${pref}
                            </span>
                        `).join('')}
                        <button class="px-3 py-1 border-2 border-dashed border-slate-300 text-slate-600 rounded-full text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
                            + Add Preference
                        </button>
                    </div>
                    <!-- TODO: Integrate with Google Cloud to save preferences -->
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-slate-800 mb-4">Allergies</h4>
                    <div class="flex flex-wrap gap-2">
                        ${appData.user.allergies.map(allergy => `
                            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                ${allergy}
                            </span>
                        `).join('')}
                        <button class="px-3 py-1 border-2 border-dashed border-slate-300 text-slate-600 rounded-full text-sm font-medium hover:border-red-400 hover:text-red-600 transition-colors">
                            + Add Allergy
                        </button>
                    </div>
                    <!-- TODO: Integrate with Google Cloud to save allergies -->
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-slate-800 mb-4">Daily Calorie Goal</h4>
                    <div class="bg-slate-50 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-700">Target Calories</span>
                            <span class="text-2xl font-bold text-slate-900">${appData.user.calorieGoal}</span>
                        </div>
                        <input type="range" min="1200" max="4000" value="${appData.user.calorieGoal}" 
                               class="w-full mt-3" 
                               onchange="updateCalorieGoal(this.value)">
                        <div class="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1200</span>
                            <span>2600</span>
                            <span>4000</span>
                        </div>
                    </div>
                    <!-- TODO: Sync calorie goal with Google Cloud -->
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-slate-800 mb-4">Account Settings</h4>
                    <div class="space-y-3">
                        <button class="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-slate-900">Notification Settings</p>
                                    <p class="text-sm text-slate-600">Manage alert preferences</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </button>
                        
                        <button class="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-slate-900">Data Sync</p>
                                    <p class="text-sm text-slate-600">Sync with Google Cloud</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </button>
                        
                        <button class="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-slate-900">Export Data</p>
                                    <p class="text-sm text-slate-600">Download your inventory data</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Family Management view
 */
function renderFamily() {
    const container = document.getElementById('family-container');
    if (!container) return;
    
    container.innerHTML = `
        <!-- Add Family Member Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 nature-card">
            <h3 class="text-lg font-semibold text-slate-900 mb-6 uppercase tracking-wide text-xs">Add Family Member</h3>
                <form id="add-family-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Name</label>
                            <input type="text" id="family-name" required
                                   class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                   placeholder="Enter name">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Age</label>
                            <input type="number" id="family-age" required min="0" max="120"
                                   class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                   placeholder="Enter age">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                            <select id="family-gender" required
                                    class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                            <input type="text" id="family-relationship" required
                                   class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                   placeholder="e.g., Spouse, Son, Daughter">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Calorie Goal (per day)</label>
                            <input type="number" id="family-calories" min="800" max="4000" step="50"
                                   class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                   placeholder="Enter daily calorie goal">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Allergies (comma-separated)</label>
                        <input type="text" id="family-allergies"
                               class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                               placeholder="e.g., Nuts, Shellfish, Dairy">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Dietary Restrictions (comma-separated)</label>
                        <input type="text" id="family-restrictions"
                               class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                               placeholder="e.g., Vegetarian, Vegan, Gluten-Free">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Medical Conditions (comma-separated)</label>
                        <textarea id="family-medical" rows="3"
                                  class="w-full px-4 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                  placeholder="e.g., Diabetes, High Blood Pressure"></textarea>
                    </div>
                    <button type="submit" 
                            class="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Add Family Member
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Family Members List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 nature-card">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-slate-900 uppercase tracking-wide text-xs">Family Members</h3>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">${appData.family.length}</span>
            </div>
            
            ${appData.family.length === 0 ? `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="text-slate-600 text-lg">No family members added yet</p>
                    <p class="text-slate-400 text-sm mt-2">Add your first family member above to get started</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${appData.family.map(member => `
                        <div class="border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-md transition-all bg-white">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h4 class="text-lg font-bold text-slate-900 mb-1">${member.name}</h4>
                                    <p class="text-sm text-slate-600 font-medium">${member.relationship}</p>
                                </div>
                                <button onclick="deleteFamilyMember(${member.id})" 
                                        class="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                        title="Delete member">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="space-y-2 text-sm">
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-600">Age:</span>
                                    <span class="font-semibold text-slate-800">${member.age} years</span>
                                    <span class="text-slate-400">•</span>
                                    <span class="text-slate-600">${member.gender}</span>
                                </div>
                                
                                ${member.calorieGoal ? `
                                    <div class="flex items-center gap-2">
                                        <span class="text-slate-600">Calorie Goal:</span>
                                        <span class="font-semibold text-slate-700">${member.calorieGoal} cal/day</span>
                                    </div>
                                ` : ''}
                                
                                ${member.allergies && member.allergies.length > 0 && member.allergies[0] !== 'None' ? `
                                    <div class="mt-3">
                                        <p class="text-xs font-semibold text-slate-700 mb-1">Allergies:</p>
                                        <div class="flex flex-wrap gap-1">
                                            ${member.allergies.map(allergy => `
                                                <span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                                                    ${allergy}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${member.dietaryRestrictions && member.dietaryRestrictions.length > 0 && member.dietaryRestrictions[0] !== 'None' ? `
                                    <div class="mt-2">
                                        <p class="text-xs font-semibold text-slate-700 mb-1">Dietary Restrictions:</p>
                                        <div class="flex flex-wrap gap-1">
                                            ${member.dietaryRestrictions.map(restriction => `
                                                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                                                    ${restriction}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${member.medicalConditions && member.medicalConditions.length > 0 && member.medicalConditions[0] !== 'None' ? `
                                    <div class="mt-2">
                                        <p class="text-xs font-semibold text-slate-700 mb-1">Medical Conditions:</p>
                                        <div class="flex flex-wrap gap-1">
                                            ${member.medicalConditions.map(condition => `
                                                <span class="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                                                    ${condition}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
    
    // Attach form submit handler (remove old listener first to prevent duplicates)
    const form = document.getElementById('add-family-form');
    if (form) {
        // Clone and replace form to remove all event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        // Add fresh event listener
        newForm.addEventListener('submit', handleAddFamilyMember);
    }
}

/**
 * Handle adding a new family member
 */
function handleAddFamilyMember(e) {
    e.preventDefault();
    
    // TODO: When integrated with Google Cloud, send POST request here
    
    const nameInput = document.getElementById('family-name');
    const ageInput = document.getElementById('family-age');
    const genderInput = document.getElementById('family-gender');
    const relationshipInput = document.getElementById('family-relationship');
    const caloriesInput = document.getElementById('family-calories');
    const allergiesInput = document.getElementById('family-allergies');
    const restrictionsInput = document.getElementById('family-restrictions');
    const medicalInput = document.getElementById('family-medical');
    
    // Validate required fields
    if (!nameInput || !ageInput || !genderInput || !relationshipInput) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);
    const gender = genderInput.value;
    const relationship = relationshipInput.value.trim();
    
    // Validate required fields have values
    if (!name || !gender || !relationship || isNaN(age) || age < 0 || age > 120) {
        showNotification('Please enter valid information for all required fields', 'error');
        return;
    }
    
    const calories = caloriesInput && caloriesInput.value ? parseInt(caloriesInput.value) : null;
    
    // Parse comma-separated values
    const allergies = allergiesInput ? allergiesInput.value
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0) : [];
    
    const restrictions = restrictionsInput ? restrictionsInput.value
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0) : [];
    
    const medical = medicalInput ? medicalInput.value
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0) : [];
    
    // Create new family member
    const newMember = {
        id: Date.now(), // Simple ID generation (in production, use proper ID generation)
        name: name,
        age: age,
        gender: gender,
        relationship: relationship,
        allergies: allergies.length > 0 ? allergies : ['None'],
        dietaryRestrictions: restrictions.length > 0 ? restrictions : ['None'],
        medicalConditions: medical.length > 0 ? medical : ['None'],
        calorieGoal: calories || null,
    };
    
    // Add to state
    appData.family.push(newMember);
    
    // Clear form
    e.target.reset();
    
    // Re-render family view
    renderFamily();
    
    // Show success feedback
    showNotification('Family member added successfully!', 'success');
}

/**
 * Delete a family member
 */
function deleteFamilyMember(memberId) {
    if (confirm('Are you sure you want to remove this family member?')) {
        // TODO: When integrated with Google Cloud, send DELETE request here
        appData.family = appData.family.filter(m => m.id !== memberId);
        renderFamily();
        showNotification('Family member removed', 'success');
    }
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Simple notification implementation
    const notification = document.createElement('div');
    let bgColor = 'bg-blue-600';
    if (type === 'success') bgColor = 'bg-green-600';
    if (type === 'error') bgColor = 'bg-red-600';
    
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium ${bgColor}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions available globally for inline handlers
window.deleteFamilyMember = deleteFamilyMember;
window.showNotification = showNotification;

/**
 * Update alerts badge in sidebar
 */
function updateAlertsBadge() {
    const badge = document.getElementById('alerts-badge');
    if (badge) {
        const count = appData.alerts.filter(a => a.severity === 'high').length;
        badge.textContent = count;
        if (count === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
        }
    }
}

/**
 * Dismiss an alert (remove from state and re-render)
 */
function dismissAlert(alertId) {
    // TODO: When integrated with Google Cloud, send DELETE request here
    appData.alerts = appData.alerts.filter(a => a.id !== alertId);
    renderAlerts();
    renderDashboard(); // Update dashboard summary
}

/**
 * Update calorie goal in state
 */
function updateCalorieGoal(newGoal) {
    // TODO: When integrated with Google Cloud, send PUT request here
    const goalValue = parseInt(newGoal);
    if (isNaN(goalValue)) return; // Validate input
    
    appData.user.calorieGoal = goalValue;
    // Update the display value in profile view if it's currently visible
    const goalDisplay = document.querySelector('#profile-container .text-2xl.font-bold.text-slate-900');
    if (goalDisplay) {
        goalDisplay.textContent = goalValue;
    }
}

