# Infinium - AI Food Tracking System
## Complete Integration Guide: ESP32 + Gemini + Cloudinary + Supabase

### 🎯 Project Overview
Infinium is a comprehensive AI-powered food tracking system that uses:
- **ESP32-CAM**: Captures food images
- **Google Gemini**: Analyzes food and generates personalized diet plans
- **Cloudinary**: Stores and optimizes images
- **Supabase**: Database and backend infrastructure
- **React/JavaScript**: Frontend UI
- **Node.js/Express**: Backend API server

---

## 📋 Prerequisites

### Required Accounts & Services
1. **Google Cloud / Google AI Studio** - Gemini API
   - Get API key from: https://ai.google.dev
   
2. **Cloudinary** - Image hosting
   - Sign up at: https://cloudinary.com
   - Get: Cloud Name, API Key, API Secret
   
3. **Supabase** - Database & Auth
   - Create project at: https://supabase.com
   - Get: Project URL, Anon Key, Service Key

### Software Requirements
- Node.js (v16+)
- Arduino IDE (for ESP32)
- Git
- Terminal/Command Prompt

---

## 🚀 Setup Instructions

### Part 1: Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd c:\Users\HP\Desktop\Infinium\backend
```

#### Step 2: Install dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- @google/generative-ai (Gemini API)
- cloudinary (Image hosting)
- @supabase/supabase-js (Database)
- cors, dotenv, multer, and other utilities

#### Step 3: Create .env file
Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Copy the example
copy .env.example .env
```

Then edit `.env` with your actual values:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

GOOGLE_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key_here
```

#### Step 4: Setup Supabase Database
1. Go to Supabase project dashboard
2. Open SQL Editor
3. Copy all SQL from `database.sql`
4. Paste and execute in SQL Editor

This creates all necessary tables with proper indexing and RLS policies.

#### Step 5: Start backend server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
🚀 Infinium Backend Server running on port 3000
```

---

### Part 2: Frontend Setup

#### Step 1: Update API Base URL
Edit `UI/js/services/apiService.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Change IP if needed
```

#### Step 2: Update backend reference in app.js
The frontend already references the service, just ensure it's loaded in HTML.

#### Step 3: Add API Service to HTML
Make sure `index.html` includes the service:
```html
<script src="js/services/apiService.js"></script>
```

#### Step 4: Test backend connection
Open browser console and run:
```javascript
testBackendConnection()
```

---

### Part 3: ESP32 Camera Setup

#### Step 1: Install Arduino IDE
Download from: https://www.arduino.cc/en/software

#### Step 2: Add ESP32 Board
1. File → Preferences
2. Add to "Additional Boards Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Tools → Board Manager → Search "esp32" → Install

#### Step 3: Install Required Libraries
Tools → Manage Libraries → Install:
- `esp32-camera` by Espressif Systems
- `ArduinoJson` by Benoit Blanchon
- `WebServer` (built-in)

#### Step 4: Configure ESP32 Code
Edit `esp32_firmware.ino`:

```cpp
// Line 23-24: Enter your WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Line 27-28: Enter your backend URL and user ID
const char* backendUrl = "http://YOUR_BACKEND_IP:3000";
const char* userId = "YOUR_USER_ID";
```

#### Step 5: Upload to ESP32
1. Select Board: Tools → Board → esp32 → AI Thinker ESP32-CAM
2. Select Port: Tools → Port → COM port
3. Upload button (→)

#### Step 6: Configure ESP32 via Web Interface
1. After upload, open Serial Monitor (9600 baud)
2. Find the IP address printed
3. Open browser: `http://ESP32_IP`
4. Fill in:
   - WiFi SSID
   - WiFi Password
   - Backend URL: `http://YOUR_BACKEND_IP:3000`
   - User ID: Get from your account
5. Click "Save Configuration"

---

## 📊 API Endpoints

### Food Analysis
```
POST /api/food/{userId}/analyze
Body: { imageUrl: string | imageBuffer: base64 }
Response: { analysisId, imageUrl, analysis, savedAt }

GET /api/food/{userId}/history
Query: limit=50
Response: Array of food analysis records

GET /api/food/{userId}/daily-summary?date=YYYY-MM-DD
Response: { date, totalCalories, macros, meals }
```

### Diet Planning
```
POST /api/food/{userId}/diet-plan/generate
Body: { daysCount: 7 }
Response: { planId, plan, createdAt }

GET /api/food/{userId}/diet-plan
Response: Active diet plan or null

GET /api/food/{userId}/diet-plan/history?limit=10
Response: Array of previous diet plans
```

### User Profile
```
POST /api/users/profile
Body: { id, name, email, age, gender, allergies, dietaryPreferences, ... }
Response: Created/updated user

GET /api/users/{userId}/profile
Response: User profile data

POST /api/users/{userId}/family
Body: { name, age, gender, relationship, allergies, ... }
Response: Created family member

GET /api/users/{userId}/family
Response: Array of family members
```

### ESP32 Upload
```
POST /api/esp32/upload
Body: { userId: string, imageBuffer: base64 }
Response: Same as food analysis
```

---

## 🔄 Complete Workflow

### 1. User Setup
```javascript
// Frontend
const user = await createUpdateUserProfile({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    gender: 'Male',
    allergies: ['peanuts', 'shellfish'],
    dietaryPreferences: ['vegetarian'],
    calorieGoal: 2000,
    fitnessGoal: 'weight loss'
});
```

### 2. ESP32 Captures Image
```
ESP32 takes photo → Uploads to backend
Backend receives → Uploads to Cloudinary → Analyzes with Gemini → Saves to Supabase
```

### 3. Frontend Retrieves Analysis
```javascript
// Get food history
const history = await getFoodHistory('user123');

// Get daily summary
const daily = await getDailySummary('user123', '2024-01-06');

// Generate diet plan
const plan = await generateDietPlan('user123', 7);
```

### 4. Personalized Diet Plan
Gemini generates based on:
- User profile (age, gender, goals)
- Allergies and preferences
- Recent food intake history

---

## 🛠️ Troubleshooting

### Backend Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Gemini API Errors
- Verify API key is correct
- Check quota in Google Cloud Console
- Ensure model name is correct: `gemini-pro-vision`

### Cloudinary Upload Fails
- Verify Cloud Name, API Key, API Secret
- Check CORS settings
- Ensure image format is supported (JPEG, PNG, etc.)

### Supabase Connection Issues
- Verify URL and keys are correct
- Check RLS policies are disabled for testing
- Ensure tables are created (run SQL)

### ESP32 Won't Connect
- Check WiFi SSID and password
- Verify backend is running and accessible
- Check Serial Monitor for error messages
- Verify correct board and COM port selected

### Image Upload from ESP32 Fails
- Ensure image size isn't too large (10MB max recommended)
- Check base64 encoding
- Verify User ID exists in backend

---

## 📁 Project Structure

```
Infinium/
├── UI/
│   ├── index.html
│   ├── css/
│   └── js/
│       ├── app.js
│       ├── components.js
│       ├── state.js
│       └── services/
│           └── apiService.js
├── backend/
│   ├── package.json
│   ├── .env
│   ├── database.sql
│   ├── esp32_firmware.ino
│   └── src/
│       ├── server.js
│       ├── services/
│       │   ├── geminiService.js
│       │   ├── cloudinaryService.js
│       │   └── supabaseService.js
│       ├── controllers/
│       │   ├── foodController.js
│       │   └── userController.js
│       └── routes/
│           ├── foodRoutes.js
│           └── userRoutes.js
```

---

## 🔐 Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Use environment variables** for all secrets
3. **Enable RLS in Supabase** for production
4. **HTTPS only** in production
5. **Rate limit API endpoints**
6. **Validate all inputs** on backend

---

## 📈 Performance Optimization

### Image Optimization
- Cloudinary auto-quality reduces file size by 60-80%
- Use responsive transforms for different devices

### Database Queries
- Indexes on user_id and date fields
- Pagination for history endpoints
- Cache recommendations (valid 7 days)

### Gemini API
- Cache diet plans (7 days)
- Batch food analysis requests if possible
- Use appropriate model sizes

---

## 🚢 Deployment

### Backend Deployment (Heroku, Railway, Render)
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel, Netlify)
```bash
# Build
npm run build

# Deploy dist/ folder
```

### Update API URL in Production
```javascript
// config.js
const API_BASE_URL = 
    process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api'
    : 'http://localhost:3000/api';
```

---

## 📞 Support & Resources

- **Google Gemini API**: https://ai.google.dev/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Supabase Docs**: https://supabase.com/docs
- **ESP32-Camera**: https://github.com/espressif/esp32-camera
- **Express.js**: https://expressjs.com/

---

## 📝 License
Created for Infinium Project

---

## ✅ Checklist

- [ ] Backend .env configured
- [ ] Supabase database created
- [ ] Gemini API key obtained
- [ ] Cloudinary account setup
- [ ] Backend running on port 3000
- [ ] Frontend API service updated
- [ ] ESP32 firmware uploaded
- [ ] ESP32 web config completed
- [ ] Test image capture and analysis
- [ ] Generate diet plan successfully

---

**Happy Food Tracking! 🍎📸🤖**
