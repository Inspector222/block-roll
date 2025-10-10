#!/bin/bash

# BlockRoll SDK Publishing Script
# This script builds and publishes all packages to NPM

set -e  # Exit on error

echo "🚀 BlockRoll SDK Publishing Script"
echo "=================================="
echo ""

# Check if logged in to npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to NPM. Please run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Confirm before publishing
read -p "Are you sure you want to publish all packages? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled"
    exit 1
fi

echo ""
echo "📦 Building and publishing packages..."
echo ""

# Publish core (others depend on it)
echo "1️⃣  Publishing @blockroll/core..."
cd core
npm run build
npm publish --access public
cd ..
echo "✅ @blockroll/core published"
echo ""

# Publish react-sdk
echo "2️⃣  Publishing @blockroll/react-sdk..."
cd react-sdk
npm run build
npm publish --access public
cd ..
echo "✅ @blockroll/react-sdk published"
echo ""

# Publish vue-sdk
echo "3️⃣  Publishing @blockroll/vue-sdk..."
cd vue-sdk
npm run build
npm publish --access public
cd ..
echo "✅ @blockroll/vue-sdk published"
echo ""

# Publish cdn
echo "4️⃣  Publishing @blockroll/cdn..."
cd cdn
npm run build
npm publish --access public
cd ..
echo "✅ @blockroll/cdn published"
echo ""

echo "🎉 All packages published successfully!"
echo ""
echo "📚 Your packages are now available:"
echo "   - npm install @blockroll/core"
echo "   - npm install @blockroll/react-sdk"
echo "   - npm install @blockroll/vue-sdk"
echo "   - npm install @blockroll/cdn"
echo ""
echo "🌐 CDN URLs (available in ~5 minutes):"
echo "   - https://cdn.jsdelivr.net/npm/@blockroll/cdn@latest/dist/blockroll.min.js"
echo "   - https://unpkg.com/@blockroll/cdn@latest/dist/blockroll.min.js"

