/**
 * STATE MANAGEMENT MODULE
 * 
 * This file contains the central state object (appData) that holds all application data.
 * In the future, this will be updated via Google Cloud/Vertex AI API calls.
 */

// Central state object - all UI updates will be based on this
const appData = {
    // User profile and preferences
    user: {
        name: "Alex Johnson",
        email: "alex@example.com",
        dietaryPreferences: ["Vegetarian", "Low-Carb"],
        allergies: ["Nuts", "Shellfish"],
        calorieGoal: 2000,
        // TODO: Sync with Google Cloud user authentication
    },
    
    // Family Members - household information for personalized tracking
    family: [
        {
            id: 1,
            name: "Alex Johnson",
            age: 35,
            gender: "Male",
            relationship: "Self",
            allergies: ["Nuts", "Shellfish"],
            dietaryRestrictions: ["Vegetarian", "Low-Carb"],
            medicalConditions: ["None"],
            calorieGoal: 2000,
            // TODO: Sync with Google Cloud family data
        },
        {
            id: 2,
            name: "Sarah Johnson",
            age: 32,
            gender: "Female",
            relationship: "Spouse",
            allergies: ["Dairy"],
            dietaryRestrictions: ["Lactose-Free"],
            medicalConditions: ["Lactose Intolerance"],
            calorieGoal: 1800,
        },
        {
            id: 3,
            name: "Emma Johnson",
            age: 8,
            gender: "Female",
            relationship: "Daughter",
            allergies: ["Peanuts"],
            dietaryRestrictions: ["None"],
            medicalConditions: ["Peanut Allergy"],
            calorieGoal: 1500,
        },
        {
            id: 4,
            name: "Liam Johnson",
            age: 5,
            gender: "Male",
            relationship: "Son",
            allergies: ["None"],
            dietaryRestrictions: ["None"],
            medicalConditions: ["None"],
            calorieGoal: 1200,
        }
    ],
    
    // Smart Alerts - items expiring soon
    alerts: [
        {
            id: 1,
            item: "Milk",
            category: "Dairy",
            expirationDate: "2024-01-15",
            daysUntilExpiry: 1,
            severity: "high", // high, medium, low
            message: "Expires tomorrow!"
        },
        {
            id: 2,
            item: "Spinach",
            category: "Vegetables",
            expirationDate: "2024-01-16",
            daysUntilExpiry: 2,
            severity: "high",
            message: "Expires in 2 days"
        },
        {
            id: 3,
            item: "Bananas",
            category: "Fruits",
            expirationDate: "2024-01-18",
            daysUntilExpiry: 4,
            severity: "medium",
            message: "Expires in 4 days"
        },
        {
            id: 4,
            item: "Yogurt",
            category: "Dairy",
            expirationDate: "2024-01-20",
            daysUntilExpiry: 6,
            severity: "medium",
            message: "Expires in 6 days"
        }
    ],
    
    // Freshness Scoring - inventory with freshness metrics
    inventory: [
        {
            id: 1,
            name: "Milk",
            category: "Dairy",
            purchaseDate: "2024-01-10",
            expirationDate: "2024-01-15",
            freshnessScore: 15, // 0-100
            quantity: "1 gallon",
            storageLocation: "Refrigerator"
        },
        {
            id: 2,
            name: "Spinach",
            category: "Vegetables",
            purchaseDate: "2024-01-12",
            expirationDate: "2024-01-16",
            freshnessScore: 25,
            quantity: "1 bag",
            storageLocation: "Refrigerator"
        },
        {
            id: 3,
            name: "Chicken Breast",
            category: "Meat",
            purchaseDate: "2024-01-13",
            expirationDate: "2024-01-22",
            freshnessScore: 75,
            quantity: "2 lbs",
            storageLocation: "Freezer"
        },
        {
            id: 4,
            name: "Bananas",
            category: "Fruits",
            purchaseDate: "2024-01-11",
            expirationDate: "2024-01-18",
            freshnessScore: 35,
            quantity: "6 pieces",
            storageLocation: "Counter"
        },
        {
            id: 5,
            name: "Tomatoes",
            category: "Vegetables",
            purchaseDate: "2024-01-14",
            expirationDate: "2024-01-24",
            freshnessScore: 90,
            quantity: "4 pieces",
            storageLocation: "Counter"
        },
        {
            id: 6,
            name: "Yogurt",
            category: "Dairy",
            purchaseDate: "2024-01-11",
            expirationDate: "2024-01-20",
            freshnessScore: 50,
            quantity: "6 containers",
            storageLocation: "Refrigerator"
        },
        {
            id: 7,
            name: "Eggs",
            category: "Dairy",
            purchaseDate: "2024-01-09",
            expirationDate: "2024-01-30",
            freshnessScore: 85,
            quantity: "12 eggs",
            storageLocation: "Refrigerator"
        },
        {
            id: 8,
            name: "Bread",
            category: "Grains",
            purchaseDate: "2024-01-12",
            expirationDate: "2024-01-25",
            freshnessScore: 70,
            quantity: "1 loaf",
            storageLocation: "Pantry"
        }
    ],
    
    // Recipe Engine - AI-suggested recipes based on inventory
    recipes: [
        {
            id: 1,
            name: "Spinach & Tomato Scramble",
            description: "A healthy breakfast option using your fresh spinach and tomatoes",
            ingredients: ["Spinach", "Tomatoes", "Eggs"],
            prepTime: "15 min",
            difficulty: "Easy",
            matchScore: 95, // How well it matches available inventory
            calories: 280,
            // TODO: Fetch from Vertex AI based on inventory
        },
        {
            id: 2,
            name: "Banana Smoothie Bowl",
            description: "Use your ripe bananas with yogurt for a refreshing treat",
            ingredients: ["Bananas", "Yogurt", "Milk"],
            prepTime: "10 min",
            difficulty: "Easy",
            matchScore: 90,
            calories: 350,
        },
        {
            id: 3,
            name: "Chicken & Spinach Salad",
            description: "A protein-packed meal using chicken and fresh greens",
            ingredients: ["Chicken Breast", "Spinach", "Tomatoes"],
            prepTime: "25 min",
            difficulty: "Medium",
            matchScore: 85,
            calories: 420,
        },
        {
            id: 4,
            name: "Tomato & Egg Breakfast",
            description: "Simple and nutritious breakfast using your fresh ingredients",
            ingredients: ["Tomatoes", "Eggs", "Bread"],
            prepTime: "20 min",
            difficulty: "Easy",
            matchScore: 88,
            calories: 320,
        }
    ],
    
    // Smart Shopping - dynamically generated shopping list
    shoppingList: [
        {
            id: 1,
            item: "Onions",
            category: "Vegetables",
            priority: "high", // high, medium, low
            reason: "Frequently used ingredient",
            // TODO: Generate via Vertex AI based on consumption patterns
        },
        {
            id: 2,
            item: "Carrots",
            category: "Vegetables",
            priority: "medium",
            reason: "Low inventory",
        },
        {
            id: 3,
            item: "Chicken Breast",
            category: "Meat",
            priority: "high",
            reason: "Running low",
        },
        {
            id: 4,
            item: "Rice",
            category: "Grains",
            priority: "low",
            reason: "Suggested pairing",
        },
        {
            id: 5,
            item: "Apples",
            category: "Fruits",
            priority: "medium",
            reason: "Dietary preference match",
        }
    ]
};

/**
 * Helper function to get freshness color based on score
 * @param {number} score - Freshness score (0-100)
 * @returns {string} - Tailwind CSS color class
 */
function getFreshnessColor(score) {
    if (score >= 75) return "text-emerald-600 bg-emerald-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    if (score >= 25) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
}

/**
 * Helper function to get severity color for alerts
 * @param {string} severity - Alert severity (high, medium, low)
 * @returns {string} - Tailwind CSS color class
 */
function getSeverityColor(severity) {
    switch(severity) {
        case "high": return "border-red-500 bg-red-50";
        case "medium": return "border-orange-500 bg-orange-50";
        case "low": return "border-yellow-500 bg-yellow-50";
        default: return "border-slate-300 bg-slate-50";
    }
}

/**
 * Helper function to get priority color for shopping list
 * @param {string} priority - Item priority (high, medium, low)
 * @returns {string} - Tailwind CSS color class
 */
function getPriorityColor(priority) {
    switch(priority) {
        case "high": return "text-red-600 bg-red-50";
        case "medium": return "text-orange-600 bg-orange-50";
        case "low": return "text-slate-600 bg-slate-50";
        default: return "text-slate-600 bg-slate-50";
    }
}

