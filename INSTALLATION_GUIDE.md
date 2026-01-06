# 📦 Infinium - Complete Installation & Deployment Guide

## Prerequisites Checklist

Before you start, make sure you have:

### Required Software
- [ ] Node.js v16+ (https://nodejs.org/)
- [ ] Arduino IDE (https://www.arduino.cc/en/software)
- [ ] Git (optional, https://git-scm.com/)
- [ ] A web browser (Chrome, Firefox, Safari, Edge)
- [ ] Command line/Terminal application

### Required Accounts
- [ ] Google Account (for Gemini API)
- [ ] Cloudinary Account (for image hosting)
- [ ] Supabase Account (for database)
- [ ] WiFi network (for ESP32)

### Hardware (Optional, for full demo)
- [ ] ESP32-CAM module
- [ ] USB cable or FTDI adapter
- [ ] Stable power supply

---

## Part 1: Backend Installation

### Step 1: Navigate to Backend Directory
```bash
cd c:\Users\HP\Desktop\Infinium\backend
```

### Step 2: Install Node Modules
```bash
npm install
```

This installs:
- express (web framework)
- @google/generative-ai (Gemini)
- cloudinary (image storage)
- @supabase/supabase-js (database)
- cors (security)
- dotenv (environment variables)
- multer (file uploads)
- uuid (unique IDs)
- And 6 more utilities

**Installation takes 2-3 minutes**

### Step 3: Get Your API Keys

#### 🔑 Google Gemini API Key
1. Go to https://ai.google.dev
2. Click "Get API key" (top right)
3. Click "Create API key in new project"
4. Copy the API key
5. Save it safely

#### 🔑 Cloudinary API Keys
1. Go to https://cloudinary.com and sign up
2. Go to Dashboard
3. Find "Account Details" section
4. Copy:
   - Cloud Name
   - API Key
   - Generate API Secret (click "View API Secret")
5. Save all three

#### 🔑 Supabase Keys
1. Go to https://supabase.com and sign up
2. Create new project
3. Wait for project to initialize (2-3 minutes)
4. Go to Settings → API
5. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key
6. Save all three

### Step 4: Create .env File
```bash
# Copy template to actual .env file
copy .env.example .env
```

### Step 5: Edit .env File
Open `c:\Users\HP\Desktop\Infinium\backend\.env` in your text editor

Replace placeholder values with your actual keys:

```env
# ✅ Replace with your Gemini API key
GOOGLE_API_KEY=AIzaSy...your...key...here

# ✅ Replace with your Cloudinary details
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret_key_here

# ✅ Replace with your Supabase details
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...your...key
SUPABASE_SERVICE_KEY=eyJhbGciOi...your...service...key

# No changes needed
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRATION=7d
```

**Save the file!**

### Step 6: Setup Supabase Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open `c:\Users\HP\Desktop\Infinium\backend\database.sql` in a text editor
5. Copy ALL the SQL code
6. Paste into Supabase SQL Editor
7. Click **Run**

You should see: `CREATE TABLE` messages for each table

8. Verify tables created:
   - Go to **Table Editor** (left sidebar)
   - You should see: users, family_members, food_analysis, diet_plans, etc.

### Step 7: Start the Backend Server
```bash
npm start
```

You should see:
```
🚀 Infinium Backend Server running on port 3000
📍 Environment: development
🔗 CORS enabled for: http://localhost:5173
```

**Keep this terminal open!**

---

## Part 2: Frontend Configuration

### Step 1: Verify API Service File Exists
Check that this file exists:
```
c:\Users\HP\Desktop\Infinium\UI\js\services\apiService.js
```

It should already be created. If not, the project setup included it.

### Step 2: Update API Base URL (if needed)
1. Open `c:\Users\HP\Desktop\Infinium\UI\js\services\apiService.js`
2. Find line with: `const API_BASE_URL = ...`
3. If your backend is on different machine:
   ```javascript
   // Change from localhost to your IP
   const API_BASE_URL = 'http://192.168.1.100:3000/api';
   ```
4. Save file

### Step 3: Verify HTML includes the script
1. Open `c:\Users\HP\Desktop\Infinium\UI\index.html`
2. Check bottom `<script>` section includes:
   ```html
   <script src="js/services/apiService.js"></script>
   ```

### Step 4: Test Connection
1. Open `c:\Users\HP\Desktop\Infinium\UI\index.html` in browser
2. Open Developer Console (F12)
3. Run this command:
   ```javascript
   testBackendConnection()
   ```
4. You should see a response like:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-06T10:30:45.123Z",
     "uptime": 23.45
   }
   ```

If you see an error, check:
- [ ] Backend is running (npm start)
- [ ] API URL is correct in apiService.js
- [ ] Port 3000 is not blocked by firewall

---

## Part 3: ESP32 Setup (Optional)

### Hardware Setup
1. Connect ESP32-CAM to your computer via USB
2. Wait for drivers to install automatically
3. Or download from: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

### Step 1: Install Arduino IDE
1. Download from https://www.arduino.cc/en/software
2. Install with default settings
3. Launch Arduino IDE

### Step 2: Add ESP32 Support
1. File → Preferences
2. In "Additional Boards Manager URLs" field, paste:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Click OK
4. Go to Tools → Board Manager
5. Search for "esp32"
6. Click install on "esp32" by Espressif Systems

### Step 3: Install Required Libraries
1. Go to Tools → Manage Libraries
2. Search and install each:
   - `esp32-camera` by Espressif Systems
   - `ArduinoJson` by Benoit Blanchon

### Step 4: Open ESP32 Firmware
1. Open `c:\Users\HP\Desktop\Infinium\backend\esp32_firmware.ino`
2. Copy all code
3. In Arduino IDE, create new sketch (Ctrl+N)
4. Paste the code
5. Save as `esp32_infinium`

### Step 5: Configure ESP32 Firmware
Find and edit these lines (around line 23-28):

```cpp
// Line 23-24: WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Line 27-28: Backend URL and User ID
const char* backendUrl = "http://192.168.1.100:3000";  // Your computer IP
const char* userId = "test-user-123";  // Or get from your account
```

### Step 6: Upload to ESP32
1. Select Board:
   - Tools → Board → esp32 → **AI Thinker ESP32-CAM**

2. Select COM Port:
   - Tools → Port → COM3 (or your port number)
   - If not visible, check USB driver installation

3. Upload:
   - Click Upload button (→) 
   - Wait for "Leaving..." message
   - Hold RESET button on ESP32 when you see "Connecting..."
   - When upload shows "Hard resetting via RTS pin..." you're done!

4. Watch Serial Monitor (Tools → Serial Monitor, 115200 baud)
   - You should see: `Infinium ESP32-CAM Starting...`

### Step 7: Configure ESP32
1. In Serial Monitor, find the IP address (e.g., `192.168.1.50`)
2. Open in browser: `http://192.168.1.50`
3. You'll see configuration form
4. Fill in:
   ```
   WiFi SSID: Your WiFi name
   WiFi Password: Your WiFi password
   Backend URL: http://192.168.1.100:3000
   User ID: test-user-123
   ```
5. Click "Save Configuration"
6. ESP32 will restart

### Step 8: Test ESP32 Upload
1. Back in web interface: `http://192.168.1.50`
2. Click "Capture & Upload Image"
3. Check backend terminal - you should see upload request
4. Check browser console for success message

---

## Complete Workflow Test

Once everything is installed, test the full workflow:

### Test 1: Create User Profile
```javascript
// Browser console
const user = await createUpdateUserProfile({
    id: 'test-user-123',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    gender: 'Male',
    calorieGoal: 2000,
    fitnessGoal: 'weight loss'
});

console.log('User created:', user);
```

### Test 2: Upload Food Image
```javascript
// Use any food image URL
const result = await uploadAndAnalyzeFood(
    'test-user-123',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
);

console.log('Analysis result:', result);
```

### Test 3: Check Food History
```javascript
const history = await getFoodHistory('test-user-123');
console.log('Food history:', history.data);
```

### Test 4: Generate Diet Plan
```javascript
const plan = await generateDietPlan('test-user-123', 7);
console.log('Diet plan:', plan.data.plan);
```

---

## Troubleshooting Installation

### npm install fails
```bash
# Clear cache and retry
npm cache clean --force
npm install

# If still fails, check Node version
node -v  # Should be 16+
```

### Backend won't start
```bash
# Port 3000 already in use?
netstat -ano | findstr :3000

# If yes, kill it or change PORT in .env
PORT=3001
npm start
```

### API Keys not working
- Verify you copied keys correctly (no extra spaces)
- Check that .env file is in correct location
- Verify services are enabled in provider dashboards

### ESP32 won't upload
- Check Arduino IDE has esp32 board installed
- Verify COM port is correct (Tools → Port)
- Try holding RESET button during upload
- Update USB drivers if not recognized

### Frontend can't connect to backend
```javascript
// In browser console, check this
const response = await fetch('http://localhost:3000/health');
console.log(response);
```

---

## File Checklist

After installation, you should have:

```
✅ backend/
   ✅ node_modules/ (created by npm install)
   ✅ .env (created from .env.example)
   ✅ package.json
   ✅ database.sql
   ✅ esp32_firmware.ino
   ✅ src/
      ✅ server.js
      ✅ services/ (gemini, cloudinary, supabase)
      ✅ controllers/ (food, user)
      ✅ routes/ (food, user)

✅ UI/
   ✅ js/services/apiService.js
   ✅ js/foodAnalysis.js (updated)
   ✅ index.html

✅ Root directory documents
   ✅ SETUP_AND_TESTING.md
   ✅ PROJECT_DELIVERY.md
```

---

## Post-Installation Steps

### 1. Verify Everything Works
Run all 4 tests from "Complete Workflow Test" section above

### 2. Read Documentation
- Start with `SETUP_AND_TESTING.md` for quick start
- Read `backend/README.md` for detailed information
- Check `PROJECT_DELIVERY.md` for complete overview

### 3. Explore Features
- Upload different food types
- Test with different diets
- Generate multiple diet plans
- Add family members

### 4. Customize For Your Needs
- Update UI colors/styling
- Adjust diet plan preferences
- Add more food analysis features
- Integrate with other services

---

## 🎉 Success!

If you've completed all steps without errors, you now have:

✅ **Working Backend Server** on http://localhost:3000
✅ **Connected Database** with Supabase  
✅ **Frontend Integration** ready to use
✅ **ESP32 Firmware** (if you did hardware setup)
✅ **Complete Documentation** for reference

---

## Next Steps

1. **Immediate**: Test the workflow (runs in 5 minutes)
2. **Short-term**: Add more food images and generate diet plans
3. **Medium-term**: Customize UI and add features
4. **Long-term**: Deploy to production servers

---

## Support

If you encounter issues:

1. Check **Troubleshooting Installation** section above
2. Read relevant error messages carefully
3. Check service dashboards (Google, Cloudinary, Supabase)
4. See **Support Resources** in PROJECT_DELIVERY.md

---

**🚀 Ready to go! Your Infinium system is installed and ready to track food!**
