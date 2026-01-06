import express from 'express';
import * as foodController from '../controllers/foodController.js';

const router = express.Router();

// Food analysis routes
router.post('/:userId/analyze', foodController.uploadAndAnalyzeFood);
router.get('/:userId/history', foodController.getFoodHistory);
router.get('/:userId/daily-summary', foodController.getDailySummary);

// Diet plan routes
router.post('/:userId/diet-plan/generate', foodController.generatePersonalizedDiet);
router.get('/:userId/diet-plan', foodController.getActiveDiet);
router.get('/:userId/diet-plan/history', foodController.getDietHistory);

// Nutrition recommendations
router.get('/:userId/recommendations', foodController.getNutritionRecs);

export default router;
