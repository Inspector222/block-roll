@echo off
REM BlockRoll SDK Publishing Script for Windows
REM This script builds and publishes all packages to NPM

echo.
echo 🚀 BlockRoll SDK Publishing Script
echo ==================================
echo.

REM Check if logged in to npm
npm whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to NPM. Please run: npm login
    exit /b 1
)

for /f "tokens=*" %%i in ('npm whoami') do set NPM_USER=%%i
echo ✅ Logged in as: %NPM_USER%
echo.

REM Confirm before publishing
set /p CONFIRM="Are you sure you want to publish all packages? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Publishing cancelled
    exit /b 1
)

echo.
echo 📦 Building and publishing packages...
echo.

REM Publish core
echo 1️⃣  Publishing @blockroll/core...
cd core
call npm run build
call npm publish --access public
cd ..
echo ✅ @blockroll/core published
echo.

REM Publish react-sdk
echo 2️⃣  Publishing @blockroll/react-sdk...
cd react-sdk
call npm run build
call npm publish --access public
cd ..
echo ✅ @blockroll/react-sdk published
echo.

REM Publish vue-sdk
echo 3️⃣  Publishing @blockroll/vue-sdk...
cd vue-sdk
call npm run build
call npm publish --access public
cd ..
echo ✅ @blockroll/vue-sdk published
echo.

REM Publish cdn
echo 4️⃣  Publishing @blockroll/cdn...
cd cdn
call npm run build
call npm publish --access public
cd ..
echo ✅ @blockroll/cdn published
echo.

echo 🎉 All packages published successfully!
echo.
echo 📚 Your packages are now available:
echo    - npm install @blockroll/core
echo    - npm install @blockroll/react-sdk
echo    - npm install @blockroll/vue-sdk
echo    - npm install @blockroll/cdn
echo.
echo 🌐 CDN URLs (available in ~5 minutes):
echo    - https://cdn.jsdelivr.net/npm/@blockroll/cdn@latest/dist/blockroll.min.js
echo    - https://unpkg.com/@blockroll/cdn@latest/dist/blockroll.min.js

pause

