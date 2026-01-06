/**
 * Backend API Bridge
 * Imports and exposes all API functions from apiService.js
 */

import {
    uploadAndAnalyzeFood,
    getFoodHistory,
    getDailySummary,
    generateDietPlan,
    getActiveDietPlan,
    getDietPlanHistory,
    getNutritionRecommendations,
    createUpdateUserProfile,
    getUserProfile,
    addFamilyMember,
    getFamilyMembers,
    testBackendConnection,
    makeRootRequest
} from './services/apiService.js';

// Export all API functions for global use
window.apiService = {
    uploadAndAnalyzeFood,
    getFoodHistory,
    getDailySummary,
    generateDietPlan,
    getActiveDietPlan,
    getDietPlanHistory,
    getNutritionRecommendations,
    createUpdateUserProfile,
    getUserProfile,
    addFamilyMember,
    getFamilyMembers,
    testBackendConnection,
    makeRootRequest
};

// Also make individual functions available globally for convenience
window.uploadAndAnalyzeFood = uploadAndAnalyzeFood;
window.getFoodHistory = getFoodHistory;
window.getDailySummary = getDailySummary;
window.generateDietPlan = generateDietPlan;
window.getActiveDietPlan = getActiveDietPlan;
window.getDietPlanHistory = getDietPlanHistory;
window.getNutritionRecommendations = getNutritionRecommendations;
window.createUpdateUserProfile = createUpdateUserProfile;
window.getUserProfile = getUserProfile;
window.addFamilyMember = addFamilyMember;
window.getFamilyMembers = getFamilyMembers;
window.testBackendConnection = testBackendConnection;
window.makeRootRequest = makeRootRequest;

console.log('✅ API Backend Bridge loaded - All functions available');
