# Infinium Complete Setup & Testing Guide

## 🎯 What You Have

Your Infinium project now includes:
1. **Backend API Server** - Node.js/Express
2. **Frontend Services** - JavaScript modules for API communication
3. **ESP32 Firmware** - Arduino code for camera and uploads
4. **Database Schema** - Complete Supabase SQL setup
5. **Documentation** - Comprehensive guides

---

## ⚡ Quick Start (5 minutes)

### 1. Get Your API Keys

#### Google Gemini API
1. Go to https://ai.google.dev
2. Click "Get API key"
3. Create new project or select existing
4. Copy your API key

#### Cloudinary
1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy your Cloud Name, API Key, API Secret

#### Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy Project URL, anon key, service_role key

### 2. Setup Backend (2 minutes)

```bash
# Navigate to backend
cd c:\Users\HP\Desktop\Infinium\backend

# Run setup (Windows)
setup.bat

# Or manually:
npm install
copy .env.example .env
# Edit .env with your keys
```

### 3. Create Database

1. In Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy all content from `database.sql`
4. Paste and execute

### 4. Start Backend

```bash
npm start
# You should see: 🚀 Infinium Backend Server running on port 3000
```

### 5. Update Frontend

Edit `UI/js/services/apiService.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 6. Test Connection

Open browser console and run:
```javascript
testBackendConnection()
```

You should get a response like:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-06T...",
  "uptime": 12.3
}
```

---

## 🧪 Testing Workflows

### Test 1: Create User & Profile

```javascript
// In browser console
const user = await createUpdateUserProfile({
    id: 'test-user-123',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    gender: 'Male',
    allergies: ['peanuts'],
    dietaryPreferences: ['vegetarian'],
    calorieGoal: 2000,
    fitnessGoal: 'weight loss'
});

console.log(user);
```

### Test 2: Upload & Analyze Food Image

```javascript
// Method 1: From URL
const analysis = await uploadAndAnalyzeFood('test-user-123', 
    'https://example.com/food.jpg');

console.log(analysis);

// Method 2: From file input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const analysis = await uploadAndAnalyzeFood('test-user-123', file);
```

### Test 3: Get Food History

```javascript
const history = await getFoodHistory('test-user-123');
console.log(history.data);
```

### Test 4: Generate Diet Plan

```javascript
const plan = await generateDietPlan('test-user-123', 7);
console.log(plan.data.plan);
```

### Test 5: Get Daily Summary

```javascript
const today = new Date().toISOString().split('T')[0];
const summary = await getDailySummary('test-user-123', today);
console.log(summary);
```

---

## 📸 ESP32 Setup & Testing

### Hardware Requirements
- ESP32-CAM Module (AI-THINKER recommended)
- FTDI/USB-Serial adapter OR USB cable
- WiFi network

### Step 1: Install Arduino IDE
Download: https://www.arduino.cc/en/software

### Step 2: Add ESP32 Board
1. File → Preferences
2. Paste in "Additional Boards Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Click OK
4. Tools → Board Manager → Search "esp32" → Install

### Step 3: Install Libraries
Tools → Manage Libraries:
- Search and install:
  - `esp32-camera` (Espressif Systems)
  - `ArduinoJson` (Benoit Blanchon)

### Step 4: Upload Code
1. Open `esp32_firmware.ino` in Arduino IDE
2. Tools → Board → esp32 → AI Thinker ESP32-CAM
3. Tools → Port → Select your COM port
4. Click Upload (→)
5. Watch Serial Monitor (9600 baud)

### Step 5: Configure WiFi & Backend
After upload:
1. Open Serial Monitor (9600 baud)
2. Find IP address printed (usually 192.168.x.x)
3. Open in browser: `http://192.168.1.x`
4. Fill in configuration form:
   - WiFi SSID
   - WiFi Password
   - Backend URL: `http://YOUR_COMPUTER_IP:3000`
   - User ID: `test-user-123`
5. Click "Save Configuration"

### Step 6: Test ESP32 Upload
In web interface, click "Capture & Upload Image"

Watch terminal to see:
```
📸 Capturing image...
📤 Uploading to: http://YOUR_IP:3000/api/esp32/upload
Response code: 200
Upload successful!
```

---

## 🔍 Common Issues & Solutions

### Backend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill it (replace PID with actual)
taskkill /PID 12345 /F

# Or change PORT in .env
PORT=3001
```

**Error: "Cannot find module '@google/generative-ai'"**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Gemini API Errors

**"API key not valid"**
- Verify key in .env is correct
- Check quotas in Google Cloud Console
- Ensure billing is enabled

**"401 Unauthorized"**
- Regenerate API key at https://ai.google.dev
- Update .env and restart backend

### Cloudinary Upload Fails

**"Authentication failed"**
- Verify Cloud Name, API Key, API Secret
- Check they're in correct .env fields
- Regenerate keys in Cloudinary dashboard

### Supabase Connection Issues

**"Connection refused"**
- Verify SUPABASE_URL is correct
- Check project is active in Supabase
- Verify keys in .env

**"Authentication failed"**
- Make sure service_key is used (not anon_key for backend)
- Regenerate keys if needed

### ESP32 WiFi Connection

**"Failed to connect to WiFi"**
- Verify SSID and password
- Check 2.4GHz band (ESP32 doesn't support 5GHz)
- Try rebooting ESP32

**"Backend not responding"**
- Verify backend URL is reachable
- Check firewalls
- Try ping from command line:
  ```bash
  ping YOUR_BACKEND_IP
  ```

---

## 📊 API Testing with cURL

### Test Health
```bash
curl http://localhost:3000/health
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user123",
    "name": "Test User",
    "email": "test@example.com",
    "age": 30,
    "gender": "Male",
    "calorieGoal": 2000
  }'
```

### Get User Profile
```bash
curl http://localhost:3000/api/users/user123/profile
```

### Upload & Analyze (with URL)
```bash
curl -X POST http://localhost:3000/api/food/user123/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/food.jpg"
  }'
```

### Get Food History
```bash
curl http://localhost:3000/api/food/user123/history
```

### Generate Diet Plan
```bash
curl -X POST http://localhost:3000/api/food/user123/diet-plan/generate \
  -H "Content-Type: application/json" \
  -d '{
    "daysCount": 7
  }'
```

---

## 📈 Performance Monitoring

### Check Backend Health
```javascript
fetch('http://localhost:3000/health')
    .then(r => r.json())
    .then(d => console.log(`Uptime: ${d.uptime}s`));
```

### Monitor Requests
Backend logs requests to console. Example:
```
📸 Analyzing image...
🤖 Gemini: Generating analysis...
☁️ Cloudinary: Uploading image...
💾 Supabase: Saving results...
```

### Check Database
In Supabase, go to "Data" section to view:
- users table
- food_analysis records
- diet_plans
- etc.

---

## 🚀 Next Steps

### Phase 1: Development Complete ✅
- [x] Backend setup
- [x] Frontend integration
- [x] ESP32 firmware
- [x] Database schema

### Phase 2: Testing (You are here)
- [ ] Manual API testing
- [ ] ESP32 functionality
- [ ] Food analysis accuracy
- [ ] Diet plan generation

### Phase 3: Production Ready
- [ ] Add authentication
- [ ] Implement rate limiting
- [ ] Add error handling
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Load testing

---

## 📞 Getting Help

### Debug Mode
Enable verbose logging:
```javascript
// In browser console
window.DEBUG = true;

// All API calls will log details
```

### Check Logs
- Backend console: Shows all API requests
- Browser console: Shows frontend errors
- Supabase dashboard: View database logs
- Cloudinary dashboard: View upload history

### Documentation Links
- Gemini API: https://ai.google.dev/docs
- Cloudinary: https://cloudinary.com/documentation
- Supabase: https://supabase.com/docs
- Express.js: https://expressjs.com/
- ESP32-Camera: https://github.com/espressif/esp32-camera

---

## ✅ Verification Checklist

Run through this to verify everything works:

### Backend
- [ ] npm start runs without errors
- [ ] health endpoint returns status
- [ ] User profile can be created
- [ ] Food analysis works with URL
- [ ] Diet plan generation completes
- [ ] Results saved to Supabase

### Frontend
- [ ] API service file loaded
- [ ] Food history displays
- [ ] Images upload successfully
- [ ] Analysis results show
- [ ] Diet plans render correctly

### ESP32
- [ ] Firmware uploads successfully
- [ ] WiFi connection established
- [ ] Web interface accessible
- [ ] Configuration saves
- [ ] Images capture and upload

### Database
- [ ] Supabase project created
- [ ] Tables created with SQL
- [ ] Data appears after analysis
- [ ] Food history persists

---

## 🎉 Success!

If you've completed all steps and tests pass, your Infinium system is ready for:
1. **Food tracking** - Capture and analyze meals
2. **Personalized plans** - AI-generated diet recommendations
3. **Family management** - Track multiple users
4. **History tracking** - View past meals and progress

**Happy food tracking! 🍎📸🤖**
