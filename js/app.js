/**
 * MAIN APPLICATION MODULE
 * 
 * This file handles navigation, view switching, and app initialization.
 */

// Current active view
let currentView = 'dashboard';
let backendConnected = false;

/**
 * Check backend connectivity with enhanced logging
 */
async function checkBackendConnection() {
    try {
        console.log('🔄 Attempting to connect to backend...');
        console.log('📍 Checking endpoint: /health');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend connected! Response:', data);
        window.backendConnected = true;
        return true;
    } catch (error) {
        console.error('❌ Backend connection error:', error.message);
        console.error('❌ Error type:', error.name);
        console.error('❌ Full error:', error);
        window.backendConnected = false;
        return false;
    }
}

/**
 * Initialize the application
 */
async function initApp() {
    // Initialize theme
    initTheme();
    
    // Test backend connection
    const isConnected = await checkBackendConnection();
    if (isConnected) {
        showNotification('✅ Backend connected successfully', 'success');
    } else {
        showNotification('⚠️ Backend not responding - Running in offline mode', 'warning');
    }
    
    // Set initial view
    showView('dashboard');
    
    // Attach navigation listeners
    attachViewListeners();
    
    // Setup mobile menu toggle
    setupMobileMenu();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Render initial dashboard
    renderDashboard();
    
    // Update alerts badge
    updateAlertsBadge();
    
    // Setup all button event listeners
    setupButtonListeners();
}

/**
 * Setup all button event listeners
 */
function setupButtonListeners() {
    console.log('⚙️ Setting up button listeners...');
    
    // Add event listeners to all data-view links (including dashboard cards)
    document.addEventListener('click', function(e) {
        const link = e.target.closest('[data-view]');
        if (link) {
            e.preventDefault();
            const viewName = link.getAttribute('data-view');
            if (viewName) {
                console.log(`📄 Navigating to ${viewName}`);
                showView(viewName);
            }
        }
    }, true);
    
    console.log('✅ Button listeners setup complete');
}

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If no saved theme, use system preference, otherwise default to light
    let isDark = false;
    if (savedTheme !== null) {
        isDark = savedTheme === 'dark';
    } else {
        isDark = prefersDark;
    }
    
    // Apply theme
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update checkbox state (ensure it's checked if dark, unchecked if light)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = isDark;
    }
}

/**
 * Setup theme toggle slider
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Set initial state based on current theme
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    themeToggle.checked = isCurrentlyDark;
    
    themeToggle.addEventListener('change', (e) => {
        const isDark = e.target.checked;
        
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        
        // Force a re-render to ensure all components update
        if (typeof refreshCurrentView === 'function') {
            refreshCurrentView();
        }
    });
}

/**
 * Setup mobile menu toggle functionality
 */
function setupMobileMenu() {
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeButton = document.getElementById('sidebar-close');
    
    function toggleSidebar() {
        sidebar?.classList.toggle('open');
        overlay?.classList.toggle('open');
    }
    
    toggleButton?.addEventListener('click', toggleSidebar);
    closeButton?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);
    
    // Close sidebar when clicking a nav link on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleSidebar();
            }
        });
    });
    
    // Make toggleSidebar globally available
    window.toggleSidebar = toggleSidebar;
}

/**
 * Attach event listeners to navigation links
 */
function attachViewListeners() {
    const navLinks = document.querySelectorAll('.nav-link, [data-view]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default for nav links, not for dashboard card links
            if (link.classList.contains('nav-link')) {
                e.preventDefault();
            }
            const viewName = link.getAttribute('data-view');
            if (viewName) {
                showView(viewName);
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
                if (activeLink) activeLink.classList.add('active');
                // Close mobile menu if open
                if (window.innerWidth < 1024) {
                    document.getElementById('sidebar').classList.remove('open');
                    document.getElementById('sidebar-overlay').classList.remove('open');
                }
            }
        });
    });
}

/**
 * Show a specific view and hide others
 * @param {string} viewName - Name of the view to show
 */
function showView(viewName) {
    // Hide all views
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active', 'bg-slate-50', 'dark:bg-slate-800', 'text-blue-600', 'dark:text-blue-400');
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active', 'bg-slate-50', 'dark:bg-slate-800', 'text-blue-600', 'dark:text-blue-400');
        }
    });
    
    // Update current view
    currentView = viewName;
    
    // Render the appropriate view content
    renderView(viewName);
}

/**
 * Render content for a specific view
 * @param {string} viewName - Name of the view to render
 */
function renderView(viewName) {
    switch(viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'alerts':
            renderAlerts();
            break;
        case 'freshness':
            renderFreshness();
            break;
        case 'foodanalysis':
            renderFoodAnalysis();
            break;
        case 'recipes':
            renderRecipes();
            break;
        case 'shopping':
            renderShopping();
            break;
        case 'family':
            renderFamily();
            break;
        case 'profile':
            renderProfile();
            break;
        default:
            console.warn(`Unknown view: ${viewName}`);
    }
}

/**
 * Refresh current view (useful for updates)
 */
function refreshCurrentView() {
    renderView(currentView);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Make functions available globally for inline handlers
window.dismissAlert = dismissAlert;
window.updateCalorieGoal = updateCalorieGoal;
// deleteFamilyMember and showNotification are already assigned in components.js

