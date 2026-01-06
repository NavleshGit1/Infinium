import { v4 as uuidv4 } from 'uuid';
import * as geminiService from '../services/geminiService.js';
import * as cloudinaryService from '../services/cloudinaryService.js';
import * as supabaseService from '../services/supabaseService.js';

/**
 * Upload and analyze food image
 */
export async function uploadAndAnalyzeFood(req, res) {
    try {
        const { userId } = req.params;
        const { imageUrl, imageBuffer } = req.body;
        
        // If image buffer is provided, upload to Cloudinary
        let cloudinaryUrl = imageUrl;
        let cloudinaryData = null;
        
        if (imageBuffer) {
            cloudinaryData = await cloudinaryService.uploadImage(
                Buffer.from(imageBuffer, 'base64'),
                `food-${Date.now()}.jpg`
            );
            cloudinaryUrl = cloudinaryData.url;
        }
        
        // Analyze food using Gemini
        const analysisResult = await geminiService.analyzeFoodImage(cloudinaryUrl);
        
        // Save to Supabase
        const analysisRecord = await supabaseService.saveFoodAnalysis({
            id: uuidv4(),
            user_id: userId,
            image_url: cloudinaryUrl,
            cloudinary_public_id: cloudinaryData?.publicId,
            analysis_data: analysisResult,
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        });
        
        res.json({
            success: true,
            data: {
                analysisId: analysisRecord.id,
                imageUrl: cloudinaryUrl,
                analysis: analysisResult,
                savedAt: analysisRecord.created_at
            }
        });
    } catch (error) {
        console.error('Error in uploadAndAnalyzeFood:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get food analysis history
 */
export async function getFoodHistory(req, res) {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;
        
        const history = await supabaseService.getFoodAnalysisHistory(userId, parseInt(limit));
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getFoodHistory:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Generate personalized diet plan
 */
export async function generatePersonalizedDiet(req, res) {
    try {
        const { userId } = req.params;
        const { daysCount = 7 } = req.body;
        
        // Get user profile
        const user = await supabaseService.getUser(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Get recent food history
        const history = await supabaseService.getFoodAnalysisHistory(userId, 14);
        
        // Generate diet plan using Gemini
        const dietPlan = await geminiService.generateDietPlan(
            {
                age: user.age,
                gender: user.gender,
                allergies: user.allergies,
                dietaryPreferences: user.dietary_preferences,
                calorieGoal: user.calorie_goal,
                fitnessGoal: user.fitness_goal
            },
            history,
            daysCount
        );
        
        // Save diet plan to database
        const savedPlan = await supabaseService.saveDietPlan({
            id: uuidv4(),
            user_id: userId,
            plan_data: dietPlan,
            duration_days: daysCount,
            is_active: true,
            created_at: new Date().toISOString()
        });
        
        res.json({
            success: true,
            data: {
                planId: savedPlan.id,
                plan: dietPlan,
                createdAt: savedPlan.created_at
            }
        });
    } catch (error) {
        console.error('Error in generatePersonalizedDiet:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get active diet plan
 */
export async function getActiveDiet(req, res) {
    try {
        const { userId } = req.params;
        
        const dietPlan = await supabaseService.getActiveDietPlan(userId);
        
        if (!dietPlan) {
            return res.json({
                success: true,
                data: null,
                message: 'No active diet plan'
            });
        }
        
        res.json({
            success: true,
            data: dietPlan
        });
    } catch (error) {
        console.error('Error in getActiveDiet:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get nutrition recommendations
 */
export async function getNutritionRecs(req, res) {
    try {
        const { userId } = req.params;
        
        // Get user profile
        const user = await supabaseService.getUser(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Get recommendations from cache if recent
        let recommendations = await supabaseService.getLatestRecommendations(userId);
        
        if (!recommendations || 
            new Date(recommendations.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            // Generate new recommendations
            recommendations = await geminiService.getNutritionRecommendations({
                age: user.age,
                gender: user.gender,
                allergies: user.allergies,
                dietaryPreferences: user.dietary_preferences,
                calorieGoal: user.calorie_goal,
                fitnessGoal: user.fitness_goal
            });
            
            // Save to database
            await supabaseService.saveNutritionRecommendations({
                id: uuidv4(),
                user_id: userId,
                recommendations_data: recommendations,
                created_at: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            data: recommendations.recommendations_data || recommendations
        });
    } catch (error) {
        console.error('Error in getNutritionRecs:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get daily nutrition summary
 */
export async function getDailySummary(req, res) {
    try {
        const { userId } = req.params;
        const { date } = req.query;
        
        const summary = await supabaseService.getDailyNutritionSummary(
            userId,
            date || new Date().toISOString().split('T')[0]
        );
        
        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in getDailySummary:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get diet plan history
 */
export async function getDietHistory(req, res) {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;
        
        const history = await supabaseService.getDietPlanHistory(userId, parseInt(limit));
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getDietHistory:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
