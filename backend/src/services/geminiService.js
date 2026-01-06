import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Analyze food image using Gemini Vision API
 * @param {string} imageUrl - URL of food image from Cloudinary
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeFoodImage(imageUrl) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        
        const prompt = `Analyze this food image and provide detailed information in JSON format with the following structure:
        {
            "foodItems": [
                {
                    "name": "food name",
                    "quantity": "estimated quantity",
                    "calories": estimated calories (number),
                    "macros": {
                        "protein": grams,
                        "carbs": grams,
                        "fat": grams
                    },
                    "allergens": ["list of potential allergens"],
                    "nutritionFacts": {
                        "fiber": grams,
                        "sugar": grams,
                        "sodium": mg,
                        "vitamins": ["list of key vitamins"]
                    }
                }
            ],
            "totalCalories": total calories for entire meal,
            "mealType": "breakfast/lunch/dinner/snack",
            "healthScore": 1-10,
            "suggestions": ["health suggestions"],
            "timestamp": "${new Date().toISOString()}"
        }`;
        
        // Fetch image and convert to base64
        const imageData = await fetch(imageUrl);
        const buffer = await imageData.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64,
                    mimeType: 'image/jpeg'
                }
            },
            prompt
        ]);
        
        const responseText = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from Gemini response');
        }
        
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
    } catch (error) {
        console.error('Error analyzing food image:', error);
        throw new Error(`Food analysis failed: ${error.message}`);
    }
}

/**
 * Generate personalized diet plan based on user profile and history
 * @param {Object} userProfile - User dietary info, allergies, preferences
 * @param {Array} foodHistory - Previous food analysis data
 * @param {number} daysCount - Number of days to generate plan for
 * @returns {Promise<Object>} - Personalized diet plan
 */
export async function generateDietPlan(userProfile, foodHistory, daysCount = 7) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const allergyString = userProfile.allergies?.join(', ') || 'none';
        const dietaryPrefString = userProfile.dietaryPreferences?.join(', ') || 'none';
        const calorieGoal = userProfile.calorieGoal || 2000;
        const fitnessGoal = userProfile.fitnessGoal || 'maintain weight';
        
        const recentIntake = foodHistory
            .slice(-7)
            .map(f => `- ${f.items.map(i => i.name).join(', ')} (${f.totalCalories} cal)`)
            .join('\n');
        
        const prompt = `Create a personalized ${daysCount}-day diet plan for a user with the following profile:
        
        User Profile:
        - Calorie Goal: ${calorieGoal} calories/day
        - Fitness Goal: ${fitnessGoal}
        - Allergies: ${allergyString}
        - Dietary Preferences: ${dietaryPrefString}
        - Age: ${userProfile.age}
        - Gender: ${userProfile.gender}
        
        Recent Food Intake:
        ${recentIntake || 'No recent data'}
        
        Generate a JSON response with this structure:
        {
            "plan": {
                "duration": ${daysCount},
                "targetCalories": ${calorieGoal},
                "days": [
                    {
                        "day": 1,
                        "meals": [
                            {
                                "type": "breakfast/lunch/dinner/snack",
                                "name": "meal name",
                                "description": "brief description",
                                "ingredients": ["ingredient1", "ingredient2"],
                                "calories": number,
                                "macros": {"protein": g, "carbs": g, "fat": g},
                                "preparation": "simple steps"
                            }
                        ],
                        "dayTotalCalories": number
                    }
                ]
            },
            "nutritionTips": ["tip1", "tip2"],
            "hydrationReminder": "recommendation",
            "exerciseAdvice": "personalized advice",
            "weeklyObjectives": ["objective1", "objective2"]
        }`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from diet plan response');
        }
        
        const dietPlan = JSON.parse(jsonMatch[0]);
        return dietPlan;
    } catch (error) {
        console.error('Error generating diet plan:', error);
        throw new Error(`Diet plan generation failed: ${error.message}`);
    }
}

/**
 * Get nutritional recommendations based on user profile
 * @param {Object} userProfile - User profile
 * @returns {Promise<Object>} - Recommendations
 */
export async function getNutritionRecommendations(userProfile) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `Provide detailed nutritional recommendations for a ${userProfile.age}-year-old ${userProfile.gender.toLowerCase()} with the following:
        - Goal: ${userProfile.fitnessGoal}
        - Dietary restrictions: ${userProfile.dietaryPreferences?.join(', ') || 'none'}
        - Allergies: ${userProfile.allergies?.join(', ') || 'none'}
        - Daily calorie goal: ${userProfile.calorieGoal}
        
        Return JSON with this structure:
        {
            "macroBreakdown": {
                "proteinPercentage": number,
                "carbsPercentage": number,
                "fatPercentage": number,
                "explanation": "why these percentages"
            },
            "essentialNutrients": ["list of key nutrients to focus on"],
            "foodsToEmphasize": ["foods to eat more of"],
            "foodsToAvoid": ["foods to avoid"],
            "mealTimingAdvice": "when to eat",
            "supplementSuggestions": ["supplements to consider"]
        }`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from recommendations');
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error getting nutrition recommendations:', error);
        throw new Error(`Recommendations failed: ${error.message}`);
    }
}
