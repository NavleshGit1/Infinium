import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

/**
 * Create a new user profile
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
export async function createUser(userData) {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile
 */
export async function getUser(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated user
 */
export async function updateUser(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
}

/**
 * Save food analysis result
 * @param {Object} analysisData - Analysis data
 * @returns {Promise<Object>} - Saved analysis
 */
export async function saveFoodAnalysis(analysisData) {
    try {
        const { data, error } = await supabase
            .from('food_analysis')
            .insert([analysisData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to save food analysis: ${error.message}`);
    }
}

/**
 * Get food analysis history for user
 * @param {string} userId - User ID
 * @param {number} limit - Number of records to fetch
 * @returns {Promise<Array>} - Analysis history
 */
export async function getFoodAnalysisHistory(userId, limit = 50) {
    try {
        const { data, error } = await supabase
            .from('food_analysis')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch food analysis: ${error.message}`);
    }
}

/**
 * Save diet plan to database
 * @param {Object} planData - Diet plan data
 * @returns {Promise<Object>} - Saved plan
 */
export async function saveDietPlan(planData) {
    try {
        const { data, error } = await supabase
            .from('diet_plans')
            .insert([planData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to save diet plan: ${error.message}`);
    }
}

/**
 * Get active diet plan for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Active diet plan
 */
export async function getActiveDietPlan(userId) {
    try {
        const { data, error } = await supabase
            .from('diet_plans')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        throw new Error(`Failed to fetch diet plan: ${error.message}`);
    }
}

/**
 * Get diet plan history
 * @param {string} userId - User ID
 * @param {number} limit - Number of records
 * @returns {Promise<Array>} - Diet plan history
 */
export async function getDietPlanHistory(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('diet_plans')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch diet plans: ${error.message}`);
    }
}

/**
 * Save nutritional recommendations
 * @param {Object} recData - Recommendation data
 * @returns {Promise<Object>} - Saved recommendation
 */
export async function saveNutritionRecommendations(recData) {
    try {
        const { data, error } = await supabase
            .from('nutrition_recommendations')
            .insert([recData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to save recommendations: ${error.message}`);
    }
}

/**
 * Get latest nutritional recommendations
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Latest recommendations
 */
export async function getLatestRecommendations(userId) {
    try {
        const { data, error } = await supabase
            .from('nutrition_recommendations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        throw new Error(`Failed to fetch recommendations: ${error.message}`);
    }
}

/**
 * Create family member
 * @param {Object} memberData - Family member data
 * @returns {Promise<Object>} - Created member
 */
export async function createFamilyMember(memberData) {
    try {
        const { data, error } = await supabase
            .from('family_members')
            .insert([memberData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw new Error(`Failed to create family member: ${error.message}`);
    }
}

/**
 * Get family members
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Family members
 */
export async function getFamilyMembers(userId) {
    try {
        const { data, error } = await supabase
            .from('family_members')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch family members: ${error.message}`);
    }
}

/**
 * Calculate daily nutrition summary
 * @param {string} userId - User ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object>} - Daily summary
 */
export async function getDailyNutritionSummary(userId, date) {
    try {
        const { data, error } = await supabase
            .from('food_analysis')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date);
        
        if (error) throw error;
        
        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        data.forEach(analysis => {
            if (analysis.analysis_data?.foodItems) {
                analysis.analysis_data.foodItems.forEach(item => {
                    totalCalories += item.calories || 0;
                    totalProtein += item.macros?.protein || 0;
                    totalCarbs += item.macros?.carbs || 0;
                    totalFat += item.macros?.fat || 0;
                });
            }
        });
        
        return {
            date,
            totalCalories,
            macros: {
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            },
            meals: data.length
        };
    } catch (error) {
        throw new Error(`Failed to calculate nutrition summary: ${error.message}`);
    }
}

export { supabase };
