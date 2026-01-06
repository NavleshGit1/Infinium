@echo off
REM Quick Setup Script for Infinium Backend (Windows)

echo.
echo 🚀 Infinium Backend Quick Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node -v

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env with your API credentials:
    echo    - SUPABASE_URL
    echo    - SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_KEY
    echo    - GOOGLE_API_KEY
    echo    - CLOUDINARY_CLOUD_NAME
    echo    - CLOUDINARY_API_KEY
    echo    - CLOUDINARY_API_SECRET
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your credentials
echo 2. Run: npm start
echo 3. Backend will run on http://localhost:3000
echo.
echo For more details, see README.md
echo.
pause
