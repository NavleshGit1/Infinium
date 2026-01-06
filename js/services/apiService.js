/**
 * Frontend API Service
 * Handles all communication with the backend
 */

// Use relative URL to work with any server/port
const API_BASE_URL = '/api';

/**
 * Make HTTP request to backend API
 * @param {string} endpoint - API endpoint (with or without /api prefix)
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Response data
 */
async function makeRequest(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {}
    } = options;

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    // Always add /api prefix for API endpoints
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
        try {
            const error = await response.json();
            throw new Error(error.error || `HTTP Error: ${response.status}`);
        } catch (e) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    }

    return response.json();
}

/**
 * Make HTTP request to non-API endpoints
 * @param {string} endpoint - Endpoint path (e.g., /health)
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Response data
 */
export async function makeRootRequest(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {}
    } = options;

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Upload and analyze food image
 * @param {string} userId - User ID
 * @param {string|Object} image - Image URL or File object or base64 string
 * @returns {Promise<Object>} - Analysis result
 */
export async function uploadAndAnalyzeFood(userId, image) {
    try {
        let imageData = {};

        if (typeof image === 'string') {
            // Check if it's a URL or base64
            if (image.startsWith('http')) {
                imageData.imageUrl = image;
            } else {
                imageData.imageBuffer = image;
            }
        } else if (image instanceof File) {
            // Convert File to base64
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = async () => {
                    imageData.imageBuffer = reader.result.split(',')[1];
                    try {
                        const result = await makeRequest(
                            `/food/${userId}/analyze`,
                            {
                                method: 'POST',
                                body: imageData
                            }
                        );
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(image);
            });
        }

        return makeRequest(
            `/food/${userId}/analyze`,
            {
                method: 'POST',
                body: imageData
            }
        );
    } catch (error) {
        console.error('Error uploading and analyzing food:', error);
        throw error;
    }
}

/**
 * Get food analysis history
 * @param {string} userId - User ID
 * @param {number} limit - Number of records
 * @returns {Promise<Object>} - Analysis history
 */
export async function getFoodHistory(userId, limit = 50) {
    try {
        return makeRequest(`/food/${userId}/history?limit=${limit}`);
    } catch (error) {
        console.error('Error fetching food history:', error);
        throw error;
    }
}

/**
 * Get daily nutrition summary
 * @param {string} userId - User ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} - Daily summary
 */
export async function getDailySummary(userId, date) {
    try {
        return makeRequest(`/food/${userId}/daily-summary?date=${date}`);
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        throw error;
    }
}

/**
 * Generate personalized diet plan
 * @param {string} userId - User ID
 * @param {number} daysCount - Number of days
 * @returns {Promise<Object>} - Diet plan
 */
export async function generateDietPlan(userId, daysCount = 7) {
    try {
        return makeRequest(
            `/food/${userId}/diet-plan/generate`,
            {
                method: 'POST',
                body: { daysCount }
            }
        );
    } catch (error) {
        console.error('Error generating diet plan:', error);
        throw error;
    }
}

/**
 * Get active diet plan
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Active diet plan
 */
export async function getActiveDietPlan(userId) {
    try {
        return makeRequest(`/food/${userId}/diet-plan`);
    } catch (error) {
        console.error('Error fetching diet plan:', error);
        throw error;
    }
}

/**
 * Get diet plan history
 * @param {string} userId - User ID
 * @param {number} limit - Number of records
 * @returns {Promise<Object>} - Diet plan history
 */
export async function getDietPlanHistory(userId, limit = 10) {
    try {
        return makeRequest(`/food/${userId}/diet-plan/history?limit=${limit}`);
    } catch (error) {
        console.error('Error fetching diet plan history:', error);
        throw error;
    }
}

/**
 * Get nutrition recommendations
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Recommendations
 */
export async function getNutritionRecommendations(userId) {
    try {
        return makeRequest(`/food/${userId}/recommendations`);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
}

/**
 * Create or update user profile
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - User profile
 */
export async function createUpdateUserProfile(userData) {
    try {
        return makeRequest(
            '/users/profile',
            {
                method: 'POST',
                body: userData
            }
        );
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile
 */
export async function getUserProfile(userId) {
    try {
        return makeRequest(`/users/${userId}/profile`);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

/**
 * Add family member
 * @param {string} userId - User ID
 * @param {Object} memberData - Family member data
 * @returns {Promise<Object>} - Family member
 */
export async function addFamilyMember(userId, memberData) {
    try {
        return makeRequest(
            `/users/${userId}/family`,
            {
                method: 'POST',
                body: memberData
            }
        );
    } catch (error) {
        console.error('Error adding family member:', error);
        throw error;
    }
}

/**
 * Get family members
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Family members list
 */
export async function getFamilyMembers(userId) {
    try {
        return makeRequest(`/users/${userId}/family`);
    } catch (error) {
        console.error('Error fetching family members:', error);
        throw error;
    }
}

/**
 * Test backend connection
 * @returns {Promise<Object>} - Health status
 */
export async function testBackendConnection() {
    try {
        const response = await fetch('/health');
        if (!response.ok) throw new Error('Backend is not responding');
        return response.json();
    } catch (error) {
        console.error('Backend connection error:', error);
        throw error;
    }
}
