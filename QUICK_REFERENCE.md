# 🚀 Infinium - Quick Reference Guide

## Common Commands

### Backend

```bash
# Navigate to backend
cd c:\Users\HP\Desktop\Infinium\backend

# Install dependencies (first time only)
npm install

# Start development server
npm start

# Start with auto-reload
npm run dev

# Stop server
Ctrl + C
```

### Database

```sql
-- Supabase SQL Editor

-- View all users
SELECT * FROM users;

-- View food analysis
SELECT * FROM food_analysis ORDER BY created_at DESC;

-- View diet plans
SELECT * FROM diet_plans WHERE user_id = 'user123';

-- Count records
SELECT COUNT(*) FROM food_analysis;

-- Get user's nutrition summary
SELECT user_id, COUNT(*) as meals, SUM((analysis_data->>'totalCalories')::int) as total_calories
FROM food_analysis
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id;
```

### Browser Console (JavaScript)

```javascript
// Test backend connection
testBackendConnection()

// Create user
createUpdateUserProfile({ id: 'user123', name: 'John', age: 30, calorieGoal: 2000 })

// Analyze food from URL
uploadAndAnalyzeFood('user123', 'https://example.com/food.jpg')

// Get food history
getFoodHistory('user123')

// Generate diet plan
generateDietPlan('user123', 7)

// Get active diet plan
getActiveDietPlan('user123')

// Get daily summary
getDailySummary('user123', '2024-01-06')

// Get nutrition recommendations
getNutritionRecommendations('user123')
```

### cURL (Terminal Commands)

```bash
# Health check
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{"id":"user123","name":"John","age":30}'

# Get user profile
curl http://localhost:3000/api/users/user123/profile

# Analyze food
curl -X POST http://localhost:3000/api/food/user123/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://picsum.photos/400/400"}'

# Get food history
curl http://localhost:3000/api/food/user123/history

# Generate diet plan
curl -X POST http://localhost:3000/api/food/user123/diet-plan/generate \
  -H "Content-Type: application/json" \
  -d '{"daysCount":7}'
```

---

## API Endpoints Quick Lookup

### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/users/profile` | Create/update user |
| GET | `/api/users/{userId}/profile` | Get user profile |
| POST | `/api/users/{userId}/family` | Add family member |
| GET | `/api/users/{userId}/family` | List family members |

### Food Analysis
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/food/{userId}/analyze` | Upload & analyze image |
| GET | `/api/food/{userId}/history` | Get past analyses |
| GET | `/api/food/{userId}/daily-summary` | Daily nutrition totals |

### Diet Plans
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/food/{userId}/diet-plan/generate` | Create new plan |
| GET | `/api/food/{userId}/diet-plan` | Get active plan |
| GET | `/api/food/{userId}/diet-plan/history` | View past plans |
| GET | `/api/food/{userId}/recommendations` | Get nutrition advice |

### System
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/esp32/upload` | ESP32 image upload |
| GET | `/health` | Server health check |

---

## Environment Variables

```
GOOGLE_API_KEY              Google Gemini API key
CLOUDINARY_CLOUD_NAME       Your Cloudinary cloud name
CLOUDINARY_API_KEY          Cloudinary API key
CLOUDINARY_API_SECRET       Cloudinary API secret
SUPABASE_URL                Your Supabase project URL
SUPABASE_ANON_KEY           Supabase anonymous key
SUPABASE_SERVICE_KEY        Supabase service role key
PORT                        Server port (default: 3000)
NODE_ENV                    Environment (development/production)
CORS_ORIGIN                 Allowed CORS origin
JWT_SECRET                  JWT signing secret
JWT_EXPIRATION              JWT token expiration time
```

---

## File Locations

```
Frontend:
  Main: c:\Users\HP\Desktop\Infinium\UI\index.html
  API Service: c:\Users\HP\Desktop\Infinium\UI\js\services\apiService.js
  Food Module: c:\Users\HP\Desktop\Infinium\UI\js\foodAnalysis.js

Backend:
  Main: c:\Users\HP\Desktop\Infinium\backend\src\server.js
  Config: c:\Users\HP\Desktop\Infinium\backend\.env
  Database: c:\Users\HP\Desktop\Infinium\backend\database.sql
  Services: c:\Users\HP\Desktop\Infinium\backend\src\services\
  Controllers: c:\Users\HP\Desktop\Infinium\backend\src\controllers\
  Routes: c:\Users\HP\Desktop\Infinium\backend\src\routes\

ESP32:
  Firmware: c:\Users\HP\Desktop\Infinium\backend\esp32_firmware.ino

Docs:
  Setup: c:\Users\HP\Desktop\Infinium\INSTALLATION_GUIDE.md
  Testing: c:\Users\HP\Desktop\Infinium\SETUP_AND_TESTING.md
  Overview: c:\Users\HP\Desktop\Infinium\PROJECT_DELIVERY.md
```

---

## Common Issues & Quick Fixes

### Backend Issues

```bash
# Port already in use
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Module not found
npm install
npm cache clean --force

# .env not found
copy .env.example .env
# Then edit .env with your keys
```

### API Issues

```javascript
// CORS error
// Fix: Check CORS_ORIGIN in .env

// 404 error
// Fix: Verify endpoint URL is correct

// 500 error
// Fix: Check backend console for error message

// JSON parsing error
// Fix: Verify request body is valid JSON
```

### Database Issues

```sql
-- Connection refused
-- Fix: Check SUPABASE_URL in .env

-- Auth failed
-- Fix: Verify SUPABASE_SERVICE_KEY is correct

-- Table doesn't exist
-- Fix: Run database.sql in Supabase SQL Editor
```

---

## Performance Tips

### Frontend
```javascript
// Lazy load images
<img loading="lazy" src="image.jpg">

// Cache API responses
const cache = {};
async function getCachedFood(userId) {
    if (!cache[userId]) {
        cache[userId] = await getFoodHistory(userId);
    }
    return cache[userId];
}

// Debounce search
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}
```

### Backend
```javascript
// Use pagination
GET /api/food/{userId}/history?limit=50&offset=0

// Enable caching headers
res.set('Cache-Control', 'public, max-age=3600');

// Use indexes on frequently queried fields
-- Already included in database.sql
```

### Database
```sql
-- Use LIMIT to avoid large result sets
SELECT * FROM food_analysis LIMIT 50;

-- Index frequently searched columns
-- Already created in database.sql
```

---

## Development Workflow

### Daily Workflow
```bash
# 1. Start backend
cd backend
npm start

# 2. In another terminal, test connection
curl http://localhost:3000/health

# 3. Make changes to API
# Edit src/services/ or src/controllers/

# 4. Backend auto-reloads on save (if using npm run dev)

# 5. Test in browser console
testBackendConnection()
```

### Adding New Feature
```bash
# 1. Create service file in src/services/
# 2. Add controller in src/controllers/
# 3. Add route in src/routes/
# 4. Update frontend apiService.js
# 5. Test in browser console
# 6. Update documentation
```

---

## Deployment Checklist

- [ ] Update all API keys in environment variables
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to your domain
- [ ] Change JWT_SECRET to random value
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure rate limiting
- [ ] Enable RLS policies in Supabase
- [ ] Setup monitoring/alerts
- [ ] Test all endpoints
- [ ] Document deployment process

---

## Log Files & Debugging

### Backend Console Output
```
🚀 Server started
🔗 Database connected
📸 Image uploaded
🤖 Gemini analyzing
💾 Data saved
```

### Browser Console
```javascript
// Enable debug mode
localStorage.setItem('debug', 'infinium');
location.reload();

// All API calls will now log details
```

### Supabase Logs
- Dashboard → Logs (bottom left)
- Filter by table or time period
- Search for specific queries

---

## Testing Scenarios

### Scenario 1: First Time User
```javascript
// Create account
createUpdateUserProfile({ id: 'new-user', name: 'Alice', age: 25 })

// Upload first meal
uploadAndAnalyzeFood('new-user', 'https://picsum.photos/400/400')

// View analysis
getFoodHistory('new-user')
```

### Scenario 2: Weekly Meal Tracking
```javascript
// Day 1-7: Upload meals daily
uploadAndAnalyzeFood(userId, imageUrl)

// End of week: Get summary
getDailySummary(userId, '2024-01-13')

// Generate next week's plan
generateDietPlan(userId, 7)
```

### Scenario 3: Family Tracking
```javascript
// Create primary user
createUpdateUserProfile({ id: 'parent', name: 'Parent' })

// Add family members
addFamilyMember('parent', { name: 'Child1', age: 10 })
addFamilyMember('parent', { name: 'Child2', age: 8 })

// View family
getFamilyMembers('parent')
```

---

## Useful Links

- Gemini API Docs: https://ai.google.dev/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Supabase Docs: https://supabase.com/docs
- Express.js: https://expressjs.com/
- Node.js: https://nodejs.org/docs/

---

## Version Info

- Node.js: v16+
- Express.js: ^4.18.2
- Supabase JS: ^2.38.4
- Gemini AI: ^0.3.0
- Cloudinary: ^1.40.0

---

## Support Contacts

- Technical Issues: Check backend console logs
- API Errors: Verify .env configuration
- Database Problems: Check Supabase dashboard
- Image Upload: Verify Cloudinary settings

---

**Quick Start**: Open `INSTALLATION_GUIDE.md`
**Full Details**: Open `PROJECT_DELIVERY.md`
**Testing**: Open `SETUP_AND_TESTING.md`

---

**Created**: January 6, 2026
**Status**: Production Ready ✅
