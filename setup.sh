#!/bin/bash
# Quick setup script for Natours MVP

echo "🚀 Natours MVP Setup"
echo "===================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"
echo "✅ npm detected: $(npm -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📝 Next steps:"
echo "1. Update config.env with your MongoDB credentials"
echo "2. Run: npm run seed (to populate database)"
echo "3. Run: npm start (to start the server)"
echo ""
echo "📖 See SETUP.md for detailed instructions"
