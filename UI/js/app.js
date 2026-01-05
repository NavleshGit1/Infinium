/**
 * MAIN APPLICATION MODULE
 * 
 * This file handles navigation, view switching, and app initialization.
 */

// Current active view
let currentView = 'dashboard';

/**
 * Initialize the application
 */
function initApp() {
    // Initialize theme
    initTheme();
    
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
            e.preventDefault();
            const viewName = link.getAttribute('data-view');
            if (viewName) {
                showView(viewName);
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

