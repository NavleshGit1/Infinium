import { v4 as uuidv4 } from 'uuid';
import * as supabaseService from '../services/supabaseService.js';

/**
 * Create or update user profile
 */
export async function createUpdateUser(req, res) {
    try {
        const { id, name, email, age, gender, allergies, dietaryPreferences, calorieGoal, fitnessGoal } = req.body;
        
        const userId = id || uuidv4();
        
        // Check if user exists
        let user = null;
        try {
            user = await supabaseService.getUser(userId);
        } catch (error) {
            // User doesn't exist, create new
        }
        
        if (user) {
            // Update existing user
            user = await supabaseService.updateUser(userId, {
                name,
                email,
                age,
                gender,
                allergies,
                dietary_preferences: dietaryPreferences,
                calorie_goal: calorieGoal,
                fitness_goal: fitnessGoal,
                updated_at: new Date().toISOString()
            });
        } else {
            // Create new user
            user = await supabaseService.createUser({
                id: userId,
                name,
                email,
                age,
                gender,
                allergies,
                dietary_preferences: dietaryPreferences,
                calorie_goal: calorieGoal,
                fitness_goal: fitnessGoal,
                created_at: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in createUpdateUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get user profile
 */
export async function getProfile(req, res) {
    try {
        const { userId } = req.params;
        
        const user = await supabaseService.getUser(userId);
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
}

/**
 * Create family member
 */
export async function addFamilyMember(req, res) {
    try {
        const { userId } = req.params;
        const { name, age, gender, relationship, allergies, dietaryRestrictions, medicalConditions } = req.body;
        
        const member = await supabaseService.createFamilyMember({
            id: uuidv4(),
            user_id: userId,
            name,
            age,
            gender,
            relationship,
            allergies,
            dietary_restrictions: dietaryRestrictions,
            medical_conditions: medicalConditions,
            created_at: new Date().toISOString()
        });
        
        res.json({
            success: true,
            data: member
        });
    } catch (error) {
        console.error('Error in addFamilyMember:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get family members
 */
export async function getFamilyMembers(req, res) {
    try {
        const { userId } = req.params;
        
        const members = await supabaseService.getFamilyMembers(userId);
        
        res.json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error('Error in getFamilyMembers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
